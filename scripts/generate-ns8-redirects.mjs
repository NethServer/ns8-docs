/**
 * Generates static HTML redirect pages for old ReadTheDocs NS8 URLs.
 * Old pattern: /projects/ns8/en/latest/{page}.html
 * Run after `docusaurus build`.
 */

import fs from 'node:fs';
import path from 'node:path';

const buildDir = path.join(process.cwd(), 'build');
const outputDir = path.join(buildDir, 'projects', 'ns8', 'en', 'latest');

// Mapping: old RTD page name → new Docusaurus path
const redirects = {
  // About
  'introduction.html': '/docs/administrator-manual/about/introduction',
  'release_notes.html': '/docs/administrator-manual/about/release_notes',
  'subscription.html': '/docs/administrator-manual/about/subscription',

  // Installation
  'install.html': '/docs/administrator-manual/installation/install',
  'modules.html': '/docs/administrator-manual/installation/modules',
  'software_center.html': '/docs/administrator-manual/installation/software_center',
  'system_requirements.html': '/docs/administrator-manual/installation/system_requirements',
  'user_domains.html': '/docs/administrator-manual/installation/user_domains',

  // Configuration
  'backup.html': '/docs/administrator-manual/configuration/backup',
  'certificates.html': '/docs/administrator-manual/configuration/certificates',
  'cluster.html': '/docs/administrator-manual/configuration/cluster',
  'email_notifications.html': '/docs/administrator-manual/configuration/email_notifications',
  'firewall.html': '/docs/administrator-manual/configuration/firewall',
  'log_server.html': '/docs/administrator-manual/configuration/log_server',
  'metrics.html': '/docs/administrator-manual/configuration/metrics',
  'proxy.html': '/docs/administrator-manual/configuration/proxy',

  // Applications
  'collabora.html': '/docs/administrator-manual/applications/collabora',
  'crowdsec.html': '/docs/administrator-manual/applications/crowdsec',
  'dnsmasq.html': '/docs/administrator-manual/applications/dnsmasq',
  'ejabberd.html': '/docs/administrator-manual/applications/ejabberd',
  'file_server.html': '/docs/administrator-manual/applications/file_server',
  'imapsync.html': '/docs/administrator-manual/applications/imapsync',
  'mail.html': '/docs/administrator-manual/applications/mail',
  'mattermost.html': '/docs/administrator-manual/applications/mattermost',
  'netdata.html': '/docs/administrator-manual/applications/netdata',
  'nethsecurity_controller.html': '/docs/administrator-manual/applications/nethsecurity_controller',
  'nethvoice.html': '/docs/administrator-manual/applications/nethvoice',
  'nextcloud.html': '/docs/administrator-manual/applications/nextcloud',
  'piler.html': '/docs/administrator-manual/applications/piler',
  'roundcube.html': '/docs/administrator-manual/applications/roundcube',
  'rustfs.html': '/docs/administrator-manual/applications/rustfs',
  'webtop.html': '/docs/administrator-manual/applications/webtop',

  // NethForge
  'dependencytrack.html': '/docs/administrator-manual/nethforge/dependencytrack',
  'dokuwiki.html': '/docs/administrator-manual/nethforge/dokuwiki',
  'hermes_agent.html': '/docs/administrator-manual/nethforge/hermes_agent',
  'lamp.html': '/docs/administrator-manual/nethforge/lamp',
  'mariadb.html': '/docs/administrator-manual/nethforge/mariadb',
  'matrix.html': '/docs/administrator-manual/nethforge/matrix',
  'n8n.html': '/docs/administrator-manual/nethforge/n8n',
  'passbolt.html': '/docs/administrator-manual/nethforge/passbolt',
  'prometheus.html': '/docs/administrator-manual/nethforge/prometheus',
  'sogo.html': '/docs/administrator-manual/nethforge/sogo',
  'webserver.html': '/docs/administrator-manual/nethforge/webserver',
};

if (!fs.existsSync(buildDir)) {
  throw new Error(`Missing build directory: ${buildDir}`);
}

fs.mkdirSync(outputDir, {recursive: true});

for (const [filename, targetPath] of Object.entries(redirects)) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${targetPath}">
  <link rel="canonical" href="${targetPath}">
  <title>Redirecting…</title>
</head>
<body>
  <p>This page has moved. <a href="${targetPath}">Click here if you are not redirected automatically.</a></p>
</body>
</html>
`;
  fs.writeFileSync(path.join(outputDir, filename), html, 'utf8');
}

console.log(`Generated ${Object.keys(redirects).length} redirect pages in ${outputDir}`);
