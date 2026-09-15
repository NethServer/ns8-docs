/**
 * Collects the READMEs of every published NS8 app and writes them as a markdown
 * tree ready to be synced to the Kapa S3 bucket.
 *
 * Both the root README and the README of each component subdirectory are
 * collected. Scaffold and vendored ones are not: see excludedSegments.
 *
 * Every file is read at the app's latest stable release tag rather than at the
 * branch head, so the collected text matches the version users are running.
 *
 * The list of apps comes from the two repodata.json feeds, not from a repository
 * name glob: NethForge apps are maintained outside the NethServer organization.
 *
 * Every file gets a provenance banner prepended, so that the "this is developer
 * documentation, not the manual" warning is part of the indexed content itself and
 * not only of the Kapa system instructions.
 *
 * Usage:
 *   node scripts/sync-app-readmes.mjs [--out DIR] [--prefix KEY] [--dry-run]
 *
 *   --out DIR     Output directory, synced as-is to s3://BUCKET/PREFIX (default: app-readmes-sync)
 *   --prefix KEY   Bucket prefix, prepended to index.json object keys (default: none)
 *   --dry-run      Resolve the app list only: no README is fetched, nothing is written
 */

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const feeds = [
  {origin: 'default', url: 'https://distfeed.nethserver.org/ns8/updates/repodata.json'},
  {origin: 'nethforge', url: 'https://forge.nethserver.org/ns8/updates/repodata.json'},
];

const concurrency = 8;

// A README under any of these directories is scaffold, vendored, or a fixture:
// `ui/README.md` alone accounts for 34 near-identical copies of the vue-cli
// boilerplate, which would only clutter retrieval.
const excludedSegments = new Set([
  'ui',
  'test',
  'tests',
  'lib',
  'var',
  'vendor',
  'node_modules',
]);

// Component READMEs below this size carry no usable content. The root README is
// exempt: it is the app's primary document even when it is thin.
const minimumComponentSize = 300;

// Repositories, keyed as lowercase owner/repo, whose documentation reaches its
// readers elsewhere. NethVoice runs its own documentation site, so collecting
// its READMEs here would answer NethVoice questions from developer notes
// instead of from the documentation written for the purpose.
const excludedRepos = new Set([
  'nethesis/ns8-nethvoice',
  'nethesis/ns8-nethvoice-proxy',
]);

function parseArgs(argv) {
  const options = {out: 'app-readmes-sync', prefix: '', dryRun: false};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--out' || arg === '--prefix') {
      const value = argv[index + 1];
      // An empty prefix is meaningful, it puts the files at the bucket root.
      const missing = arg === '--prefix' ? value === undefined : !value;
      if (missing || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      options[arg === '--out' ? 'out' : 'prefix'] = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function fetchJson(url) {
  const response = await fetch(url, {headers: {accept: 'application/json'}});
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Extracts owner/repo from a GitHub code_url. Returns null for anything that is
 * not a plain github.com repository URL: the README fetch below is GitHub-only.
 */
function parseGithubRepo(codeUrl) {
  let url;
  try {
    url = new URL(codeUrl);
  } catch {
    return null;
  }

  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
    return null;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  return {owner: segments[0], repo: segments[1].replace(/\.git$/, '')};
}

/**
 * The token only lifts the anonymous rate limit: every repository read here is
 * public. It is required in practice, since a run needs one tree call per app
 * plus one call per collected file, well past the 60/hour anonymous allowance.
 * In CI the environment provides it; locally we borrow the one the gh CLI
 * already holds, so nobody has to mint a second token by hand.
 */
function resolveGithubToken() {
  const fromEnv = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  if (fromEnv) {
    return fromEnv;
  }

  const result = spawnSync('gh', ['auth', 'token'], {encoding: 'utf8'});
  if (result.status === 0) {
    return result.stdout.trim() || null;
  }

  return null;
}

const githubToken = resolveGithubToken();

function githubHeaders(accept) {
  const headers = {accept};
  if (githubToken) {
    headers.authorization = `Bearer ${githubToken}`;
  }
  return headers;
}

async function githubFetch(url, accept) {
  const response = await fetch(url, {headers: githubHeaders(accept)});

  if (response.status === 404) {
    return null;
  }
  if (response.status === 403 || response.status === 429) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining === '0') {
      const reset = Number(response.headers.get('x-ratelimit-reset'));
      const resetAt = Number.isFinite(reset)
        ? new Date(reset * 1000).toISOString()
        : 'unknown';
      throw new Error(
        'GitHub API rate limit exhausted' +
          `${githubToken ? '' : ' (a run needs about 110 requests and anonymous' +
            ' callers get 60 per hour: run `gh auth login`, or set GH_TOKEN to a' +
            ' token with no scopes)'}` +
          `. Limit resets at ${resetAt}`
      );
    }
  }
  if (!response.ok) {
    throw new Error(`GitHub API returned HTTP ${response.status} for ${url}`);
  }

  return response;
}

/**
 * Lists the READMEs worth collecting in a repository. One recursive tree call
 * returns every path with its size, so both filters apply without fetching
 * anything.
 */
async function listReadmes(app) {
  // Read the app as it was released, not as it is being developed: the manual
  // describes released behaviour, and a README from main can document options
  // that no published version has yet. An app that cannot be read at its
  // release is skipped rather than read from the branch, so that everything
  // collected is a released README without exception.
  if (!app.version) {
    return {files: [], ref: null, reason: `no stable release published for ${app.id}`};
  }

  const ref = app.version;
  const response = await githubFetch(
    `https://api.github.com/repos/${app.owner}/${app.repo}/git/trees/${ref}?recursive=1`,
    'application/json'
  );

  if (!response) {
    // One extra call, on this failure path only, to tell a missing repository
    // apart from a repository that simply never got tagged.
    const head = await githubFetch(
      `https://api.github.com/repos/${app.owner}/${app.repo}/git/trees/HEAD?recursive=1`,
      'application/json'
    );
    return {
      files: [],
      ref: null,
      reason: head
        ? `no tag ${ref} in ${app.owner}/${app.repo}`
        : `no repository at ${app.owner}/${app.repo}`,
    };
  }

  const tree = await response.json();

  if (tree.truncated) {
    console.log(
      `Warning: the tree of ${app.owner}/${app.repo} is truncated, some READMEs may be missing`
    );
  }

  const readmes = (tree.tree ?? []).filter(
    (entry) => entry.type === 'blob' && /(^|\/)README\.md$/i.test(entry.path)
  );

  const files = [];

  for (const entry of readmes) {
    const segments = entry.path.split('/');
    const directories = segments.slice(0, -1);

    if (directories.length === 0) {
      files.push({path: entry.path, directory: null});
      continue;
    }
    if (directories.some((segment) => excludedSegments.has(segment.toLowerCase()))) {
      continue;
    }
    if (entry.size < minimumComponentSize) {
      continue;
    }

    files.push({path: entry.path, directory: directories.join('/')});
  }

  if (!files.some((file) => !file.directory)) {
    return {files, ref, reason: `no root README.md in ${app.owner}/${app.repo}@${ref}`};
  }

  return {files, ref, reason: null};
}

async function fetchFile(app, filePath, ref) {
  const response = await githubFetch(
    `https://api.github.com/repos/${app.owner}/${app.repo}/contents/${filePath}?ref=${ref}`,
    'application/vnd.github.raw'
  );

  if (!response) {
    return null;
  }

  const body = await response.text();
  return body.trim() ? body : null;
}

function compareVersions(a, b) {
  const left = a.split('.');
  const right = b.split('.');

  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const numericLeft = Number(left[index] ?? 0);
    const numericRight = Number(right[index] ?? 0);

    if (Number.isNaN(numericLeft) || Number.isNaN(numericRight)) {
      const compared = (left[index] ?? '').localeCompare(right[index] ?? '');
      if (compared !== 0) {
        return compared;
      }
      continue;
    }
    if (numericLeft !== numericRight) {
      return numericLeft - numericRight;
    }
  }

  return 0;
}

/**
 * Highest stable tag in a repodata versions array. The array is not ordered:
 * ns8-core lists 2.9.6 before 3.21.0 because it still supports both majors, so
 * the entries have to be compared rather than picked positionally.
 */
function latestStableTag(versions) {
  if (!Array.isArray(versions)) {
    return null;
  }

  const stable = versions
    .filter((version) => version?.testing === false && typeof version.tag === 'string')
    .map((version) => version.tag)
    .sort(compareVersions);

  return stable.at(-1) ?? null;
}

/**
 * The banner is one contiguous blockquote on purpose: it has to survive Kapa's
 * chunking so that every retrieved chunk of the file carries the warning.
 */
function buildBanner(app, file, ref) {
  // Every collected file comes from a release tag, so the banner never has to
  // hedge about unreleased behaviour.
  const lines = [
    `> **Source type: developer documentation.** This page is \`${file.path}\` at`,
    `> release \`${ref}\` of the repository \`${app.owner}/${app.repo}\`, which packages`,
    `> the NS8 app \`${app.id}\`. It is written for developers and packagers, is not`,
    `> part of the official NethServer 8 manual, and may be incomplete or out of`,
    `> date. Prefer the official manual at https://docs.nethserver.org when it`,
    `> covers the topic.`,
  ];

  if (app.origin === 'nethforge') {
    const maintainer = app.author ?? 'a third party';
    lines.push(
      `> This app is distributed through NethForge and is maintained by a third party`,
      `> (${maintainer}), not by the NethServer team.`,
      `> The following commands may disrupt your system, review them carefully.`,
    );
  }

  return lines.join('\n');
}

/**
 * Repeats the provenance before every section of the body.
 *
 * The banner at the top of the file only reaches the model when retrieval hits
 * the chunk that contains it. Most collected READMEs are large enough to be
 * split, so a marker per section keeps the warning next to the text it applies
 * to wherever a chunk boundary falls. Second and third level headings both
 * count: several READMEs put all their substance under one ## with ###
 * subsections, and marking only ## left multi-kilobyte stretches unmarked.
 */
function markSections(app, file, ref, body) {
  const marker =
    `> Developer documentation from \`${app.owner}/${app.repo}\` at release` +
    ` \`${ref}\`, not the official NethServer 8 manual.`;

  const lines = body.split('\n');
  const marked = [];
  let fenced = false;
  let seenFirstSection = false;

  for (const line of lines) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      fenced = !fenced;
    }

    // The first section already sits under the banner, so marking it would only
    // repeat what the reader has just been told.
    if (!fenced && /^###?\s/.test(line)) {
      if (seenFirstSection) {
        marked.push(marker, '');
      }
      seenFirstSection = true;
    }

    marked.push(line);
  }

  return marked.join('\n');
}

function buildDocument(app, file, ref, readme) {
  const title = file.directory
    ? `# ${app.name} (${app.id}) — ${file.directory} component README`
    : `# ${app.name} (${app.id}) — NS8 app README`;

  const facts = [
    app.description ? `Description: ${app.description}.` : null,
    app.categories.length ? `Categories: ${app.categories.join(', ')}.` : null,
    `Taken from release ${ref}, the latest published version.`,
    `Software repository: ${app.origin}.`,
    `Source code: ${app.codeUrl}`,
  ].filter(Boolean);

  // The README's own top-level heading would compete with ours: demote it.
  const body = readme
    .replace(/\r\n/g, '\n')
    .replace(/^#(?=\s)/m, '##')
    .trim();

  const marked = markSections(app, file, ref, body);

  return `${title}\n\n${buildBanner(app, file, ref)}\n\n${facts.join(' ')}\n\n${marked}\n`;
}

/**
 * Bucket key for a collected file. The tree is flat: <repository>_<app>.md for a
 * root README, with the component directory appended for the others, its
 * slashes flattened to dashes.
 */
function objectPath(app, file) {
  const parts = [app.origin, app.id];
  if (file.directory) {
    parts.push(file.directory.replace(/\//g, '-'));
  }
  return `${parts.join('_')}.md`;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(
    Array.from({length: Math.min(limit, items.length)}, () => worker())
  );

  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const skipped = [];
  const apps = [];

  for (const {origin, url} of feeds) {
    const modules = await fetchJson(url);
    if (!Array.isArray(modules)) {
      throw new Error(`${url} did not return a JSON array`);
    }

    for (const module of modules) {
      const codeUrl = module?.docs?.code_url;
      const id = module?.id ?? module?.name;

      if (!codeUrl) {
        skipped.push({id, origin, reason: 'no docs.code_url in repodata'});
        continue;
      }

      const repo = parseGithubRepo(codeUrl);
      if (!repo) {
        skipped.push({id, origin, reason: `code_url is not a GitHub repository: ${codeUrl}`});
        continue;
      }
      if (excludedRepos.has(`${repo.owner}/${repo.repo}`.toLowerCase())) {
        skipped.push({
          id,
          origin,
          reason: `${repo.owner}/${repo.repo} is documented on its own site`,
        });
        continue;
      }

      apps.push({
        id,
        origin,
        codeUrl,
        owner: repo.owner,
        repo: repo.repo,
        name: module.name ?? id,
        description: module?.description?.en ?? null,
        categories: Array.isArray(module.categories) ? module.categories : [],
        author: module?.authors?.[0]?.name ?? null,
        version: latestStableTag(module.versions),
      });
    }
  }

  // A module id can appear in both feeds; the default one is authoritative.
  const byId = new Map();
  for (const app of apps) {
    const existing = byId.get(app.id);
    if (existing && existing.origin === 'default') {
      skipped.push({
        id: app.id,
        origin: app.origin,
        reason: 'already provided by the default repository',
      });
      continue;
    }
    byId.set(app.id, app);
  }
  const selected = [...byId.values()];

  console.log(`Resolved ${selected.length} apps from ${feeds.length} feeds`);

  // Discovery is one tree call per app, so it runs for a dry run too: the point
  // of a dry run is to show which files would be collected.
  const listings = await mapWithConcurrency(selected, concurrency, async (app) => {
    const {files, ref, reason} = await listReadmes(app);
    if (reason) {
      skipped.push({id: app.id, origin: app.origin, reason});
    }
    return files.map((file) => ({app, file, ref}));
  });

  const candidates = listings.flat();

  if (options.dryRun) {
    for (const {app, file, ref} of candidates) {
      console.log(
        `  ${objectPath(app, file)} ← ${app.owner}/${app.repo}@${ref}/${file.path}`
      );
    }
    for (const {id, origin, reason} of skipped) {
      console.log(`  skipped ${origin}/${id}: ${reason}`);
    }
    console.log(
      `Dry run: ${candidates.length} files would be collected, nothing written`
    );
    return;
  }

  const documents = await mapWithConcurrency(candidates, concurrency, async (candidate) => {
    const {app, file, ref} = candidate;
    const readme = await fetchFile(app, file.path, ref);
    if (!readme) {
      skipped.push({
        id: app.id,
        origin: app.origin,
        reason: `${file.path} disappeared from ${app.owner}/${app.repo}@${ref}`,
      });
      return null;
    }
    return {app, file, ref, content: buildDocument(app, file, ref, readme)};
  });

  const written = documents.filter(Boolean);

  if (written.length === 0) {
    throw new Error('No README could be fetched: refusing to publish an empty tree');
  }

  const outDir = path.resolve(process.cwd(), options.out);
  fs.rmSync(outDir, {recursive: true, force: true});

  const index = [];

  for (const {app, file, ref, content} of written) {
    const relativePath = objectPath(app, file);
    const target = path.join(outDir, relativePath);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content, 'utf8');

    index.push({
      // object_key must be the full key in the bucket, prefix included.
      object_key: path.posix.join(options.prefix, relativePath),
      // Pointing at the tag makes the citation permanent: the page Kapa quotes
      // stays the page a reader opens, whatever lands on the branch later.
      source_url: `https://github.com/${app.owner}/${app.repo}/blob/${ref}/${file.path}`,
    });
  }

  fs.writeFileSync(
    path.join(outDir, 'index.json'),
    `${JSON.stringify(index, null, 2)}\n`,
    'utf8'
  );

  for (const {id, origin, reason} of skipped) {
    console.log(`Skipped ${origin}/${id}: ${reason}`);
  }

  console.log(
    `Wrote ${written.length} README files and index.json to ${outDir} ` +
      `(${skipped.length} skipped)`
  );
}

main().catch((error) => {
  console.error(`sync-app-readmes: ${error.message}`);
  process.exit(1);
});
