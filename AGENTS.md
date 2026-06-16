# NS8 Documentation — Copilot Instructions

This repository contains the [Docusaurus](https://docusaurus.io/)-based
documentation for NethServer 8, published at
https://docs.nethserver.org.

## Build commands

```bash
# Install dependencies (Node.js >= 18)
yarn install

# Start a local dev server with hot reload
yarn start

# Build the static site (also validates links/anchors and MDX)
yarn build

# Serve the production build locally
yarn serve

# Regenerate the theme/UI translation placeholders for Italian
yarn write-translations -l it
```

Always run `yarn build` before submitting changes: it fails on broken MDX and
reports broken links and anchors.

## Architecture

- The site is split into three manuals, each rendered as its own sidebar
  (see `sidebars.ts` and `docusaurus.config.ts` navbar):
  - `docs/administrator-manual/` — install, configure and manage NS8 and apps
    (`about/`, `installation/`, `configuration/`, `applications/`,
    `nethforge/`).
  - `docs/user-manual/` — end-user docs (`user-portal/`, `webtop/`).
  - `docs/tutorial/` — tutorials and best practices.
- Each subfolder has a `_category_.json` (sidebar label + position); each
  manual root has an `index.md` with a `slug:` so the navbar links resolve.
- `docusaurus.config.ts` sets `markdown.format: 'detect'`, so `.md` files are
  parsed as CommonMark (tolerant of bare `<...>`/`{...}`) and `.mdx` as MDX.
- Internationalization: English is the default locale; Italian lives under
  `i18n/it/`. Translated docs mirror the `docs/` tree under
  `i18n/it/docusaurus-plugin-content-docs/current/`.
- Images are served from `static/` and referenced with absolute paths such as
  `/_static/image.png`.

## CI

- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on push
  to `main`.
- `.github/workflows/test-deploy.yml` — test build on pull requests.
- `.github/workflows/sync-translations.yml` — AI agent that keeps the English
  and Italian docs in sync when one side changes
  (`.github/scripts/translation-agent/`).

## Markdown conventions

- One top-level `#` heading per file; the page `title` is set in frontmatter.
- Use explicit heading ids where other pages link to them:
  `## My section {#my-section}`. Reference them with relative links such as
  `[text](../configuration/cluster.md#cluster-section)`.
- UI elements (buttons, fields) use bold: `**Save**`.
- File paths, commands, config keys and volume names use inline code:
  `` `postgres-data` ``.
- Admonitions use the Docusaurus syntax:

  ```markdown
  :::note
  Note text.
  :::

  :::warning
  Warning text.
  :::
  ```

## Style guidelines

- Write in second person ("you"), present tense, imperative mood for
  procedures. Keep sentences short and direct.
- Each application chapter follows the same pattern: brief description,
  configuration steps, then advanced topics. Follow the existing chapter
  structure when adding a new application.
- When updating an example, also remove any notes that referred to the
  replaced behaviour as a future or planned feature.
