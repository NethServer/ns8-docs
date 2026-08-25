/**
 * Collects the NS8 app READMEs and uploads them to the Kapa bucket in one step.
 *
 * The bucket destination is the only input: the prefix passed to
 * sync-app-readmes.mjs is derived from it, so the object keys recorded in
 * index.json can never disagree with the keys the objects actually get. A
 * mismatch there is silent — the files upload and index fine, only the citation
 * URLs are wrong — which is why this wrapper exists.
 *
 * Usage:
 *   node scripts/upload-app-readmes.mjs s3://BUCKET/PREFIX [options]
 *
 *   --out DIR           Staging directory (default: app-readmes-sync)
 *   --endpoint-url URL  For S3-compatible providers other than AWS
 *                       (default: $KAPA_S3_ENDPOINT_URL)
 *   --dry-run           Collect the READMEs, print the sync command, upload nothing
 */

import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

function parseArgs(argv) {
  const options = {
    destination: null,
    out: 'app-readmes-sync',
    endpointUrl: process.env.KAPA_S3_ENDPOINT_URL || null,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--out' || arg === '--endpoint-url') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      options[arg === '--out' ? 'out' : 'endpointUrl'] = value;
      index += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else if (options.destination) {
      throw new Error(`Unexpected argument: ${arg}`);
    } else {
      options.destination = arg;
    }
  }

  if (!options.destination) {
    throw new Error(
      'Missing bucket destination. Usage: node scripts/upload-app-readmes.mjs s3://BUCKET/PREFIX'
    );
  }

  return options;
}

/**
 * Splits s3://bucket/prefix into its two halves. The prefix is mandatory: Kapa
 * reads a prefix of the bucket, and syncing to the bucket root with --delete
 * would wipe anything else stored there.
 */
function parseDestination(destination) {
  let url;
  try {
    url = new URL(destination);
  } catch {
    throw new Error(`Not a valid S3 URL: ${destination}`);
  }

  if (url.protocol !== 's3:') {
    throw new Error(`Destination must start with s3:// — got ${destination}`);
  }

  const bucket = url.hostname;
  const prefix = url.pathname.replace(/^\/+/, '').replace(/\/+$/, '');

  if (!bucket) {
    throw new Error(`Missing bucket name in ${destination}`);
  }
  if (!prefix) {
    throw new Error(
      `Missing bucket prefix in ${destination}: refusing to sync to the bucket root`
    );
  }

  return {bucket, prefix};
}

function run(command, args, {dryRun = false} = {}) {
  const printable = [command, ...args].join(' ');

  if (dryRun) {
    console.log(`Would run: ${printable}`);
    return;
  }

  console.log(`+ ${printable}`);
  const result = spawnSync(command, args, {stdio: 'inherit'});

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  const {bucket, prefix} = parseDestination(options.destination);
  const generator = path.join('scripts', 'sync-app-readmes.mjs');

  run(process.execPath, [generator, '--out', options.out, '--prefix', prefix]);

  run(
    'aws',
    [
      's3',
      'sync',
      options.out,
      `s3://${bucket}/${prefix}`,
      '--delete',
      '--no-progress',
      ...(options.endpointUrl ? ['--endpoint-url', options.endpointUrl] : []),
    ],
    {dryRun: options.dryRun}
  );

  console.log(
    options.dryRun
      ? `Dry run: ${options.out} is ready, nothing uploaded`
      : `Uploaded ${options.out} to s3://${bucket}/${prefix}`
  );
} catch (error) {
  console.error(`upload-app-readmes: ${error.message}`);
  process.exit(1);
}
