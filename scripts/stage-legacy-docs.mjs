import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const buildDir = path.join(repoRoot, 'build');
const legacySourceRoot = path.join(repoRoot, 'static', 'legacy');
const copiedLegacyRoot = path.join(buildDir, 'legacy');

const legacyTargets = [
  {locale: 'en', version: 'v7', destination: path.join(buildDir, 'en', 'v7')},
  {locale: 'en', version: 'v6', destination: path.join(buildDir, 'en', 'v6')},
  {locale: 'it', version: 'v7', destination: path.join(buildDir, 'it', 'v7')},
  {locale: 'it', version: 'v6', destination: path.join(buildDir, 'it', 'v6')},
  {
    locale: 'projects',
    version: 'nethserver-devel/en/latest',
    destination: path.join(buildDir, 'projects', 'nethserver-devel', 'en', 'latest'),
  },
];

if (!fs.existsSync(buildDir)) {
  throw new Error(`Missing build directory: ${buildDir}`);
}

for (const {locale, version, destination} of legacyTargets) {
  const sourceCandidates = locale === 'en'
    ? [
        path.join(legacySourceRoot, locale, version),
        path.join(legacySourceRoot, version),
      ]
    : locale === 'projects'
      ? [path.join(legacySourceRoot, 'projects', version)]
      : [path.join(legacySourceRoot, locale, version)];
  const source = sourceCandidates.find((candidate) =>
    fs.existsSync(path.join(candidate, 'index.html'))
  );

  if (!source) {
    throw new Error(
      `Missing legacy artifact index for ${locale}/${version}: ${sourceCandidates.join(', ')}`
    );
  }

  fs.rmSync(destination, {recursive: true, force: true});
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.cpSync(source, destination, {recursive: true});
}

// Docusaurus copies static/legacy to build/legacy by default; remove it so the
// published site only exposes the intended /en/v6 and /en/v7 paths.
fs.rmSync(copiedLegacyRoot, {recursive: true, force: true});
