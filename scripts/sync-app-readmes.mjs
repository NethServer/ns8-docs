/**
 * Collects the README.md of every published NS8 app and writes them as a flat
 * markdown tree ready to be synced to the Kapa S3 bucket.
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
 *   --prefix KEY   Bucket prefix, used to build index.json object keys (default: app-readmes)
 *   --dry-run      Resolve the app list only: no README is fetched, nothing is written
 */

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const feeds = [
  {origin: 'core', url: 'https://distfeed.nethserver.org/ns8/updates/repodata.json'},
  {origin: 'nethforge', url: 'https://forge.nethserver.org/ns8/updates/repodata.json'},
];

const concurrency = 8;

function parseArgs(argv) {
  const options = {out: 'app-readmes-sync', prefix: 'app-readmes', dryRun: false};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--out' || arg === '--prefix') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
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
 * public. In CI the environment provides it; locally we borrow the one the gh
 * CLI already holds, so nobody has to mint a second token by hand.
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

async function fetchReadme({owner, repo}) {
  const headers = {accept: 'application/vnd.github.raw'};
  if (githubToken) {
    headers.authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {headers}
  );

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
          `${githubToken ? '' : ' (anonymous requests are limited to 60 per' +
            ' hour: run `gh auth login`, or set GH_TOKEN to a token with no' +
            ' scopes)'}` +
          `. Limit resets at ${resetAt}`
      );
    }
  }
  if (!response.ok) {
    throw new Error(
      `GitHub API returned HTTP ${response.status} for ${owner}/${repo}`
    );
  }

  const body = await response.text();
  return body.trim() ? body : null;
}

function latestStableTag(versions) {
  if (!Array.isArray(versions)) {
    return null;
  }
  const stable = versions.find((version) => version && version.testing === false);
  return (stable ?? versions[0])?.tag ?? null;
}

/**
 * The banner is one contiguous blockquote on purpose: it has to survive Kapa's
 * chunking so that every retrieved chunk of the file carries the warning.
 */
function buildBanner(app) {
  const lines = [
    `> **Source type: developer documentation.** This page is the \`README.md\` of the`,
    `> repository \`${app.owner}/${app.repo}\`, which packages the NS8 app \`${app.id}\`.`,
    `> It is written for developers and packagers, is not part of the official`,
    `> NethServer 8 manual, and may be incomplete, out of date, or describe unreleased`,
    `> behaviour. Prefer the official manual at https://docs.nethserver.org when it`,
    `> covers the topic.`,
  ];

  if (app.origin === 'nethforge') {
    const maintainer = app.author ?? 'a third party';
    lines.push(
      `> This app is distributed through NethForge and is maintained by a third party`,
      `> (${maintainer}), not by the NethServer team.`
    );
  }

  return lines.join('\n');
}

function buildDocument(app, readme) {
  const title = `# ${app.name} (${app.id}) — NS8 app README`;

  const facts = [
    app.description ? `Description: ${app.description}.` : null,
    app.categories.length ? `Categories: ${app.categories.join(', ')}.` : null,
    app.version ? `Latest published version: ${app.version}.` : null,
    `Distribution: ${app.origin === 'core' ? 'NethServer core repository' : 'NethForge'}.`,
    `Repository: ${app.codeUrl}`,
  ].filter(Boolean);

  // The README's own top-level heading would compete with ours: demote it.
  const body = readme
    .replace(/\r\n/g, '\n')
    .replace(/^#(?=\s)/m, '##')
    .trim();

  return `${title}\n\n${buildBanner(app)}\n\n${facts.join(' ')}\n\n${body}\n`;
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

  // A module id can appear in both feeds; the core feed is authoritative.
  const byId = new Map();
  for (const app of apps) {
    const existing = byId.get(app.id);
    if (existing && existing.origin === 'core') {
      skipped.push({
        id: app.id,
        origin: app.origin,
        reason: 'already provided by the core feed',
      });
      continue;
    }
    byId.set(app.id, app);
  }
  const selected = [...byId.values()];

  console.log(`Resolved ${selected.length} apps from ${feeds.length} feeds`);

  if (options.dryRun) {
    for (const app of selected) {
      console.log(`  ${app.origin}/${app.id} → ${app.owner}/${app.repo}`);
    }
    for (const {id, origin, reason} of skipped) {
      console.log(`  skipped ${origin}/${id}: ${reason}`);
    }
    console.log('Dry run: no README fetched, nothing written');
    process.exit(0);
  }

  const documents = await mapWithConcurrency(selected, concurrency, async (app) => {
    const readme = await fetchReadme(app);
    if (!readme) {
      skipped.push({
        id: app.id,
        origin: app.origin,
        reason: `no README in ${app.owner}/${app.repo}`,
      });
      return null;
    }
    return {app, content: buildDocument(app, readme)};
  });

  const written = documents.filter(Boolean);

  if (written.length === 0) {
    throw new Error('No README could be fetched: refusing to publish an empty tree');
  }

  const outDir = path.resolve(process.cwd(), options.out);
  fs.rmSync(outDir, {recursive: true, force: true});

  const index = [];

  for (const {app, content} of written) {
    const relativePath = path.join(app.origin, `${app.id}.md`);
    const target = path.join(outDir, relativePath);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content, 'utf8');

    index.push({
      // object_key must be the full key in the bucket, prefix included.
      object_key: path.posix.join(options.prefix, app.origin, `${app.id}.md`),
      source_url: `${app.codeUrl.replace(/\/$/, '')}#readme`,
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
