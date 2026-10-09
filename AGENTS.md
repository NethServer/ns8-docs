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
  `i18n/it/docusaurus-plugin-content-docs/current/`. Keep the two sides in sync: when you change an English page, update its Italian mirror too.
- Images are served from `static/` and referenced with absolute paths such as
  `/_static/image.png`.

## CI

- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on push
  to `main`.
- `.github/workflows/test-deploy.yml` — test build on pull requests.
- `.github/workflows/preview.yml` — publishes a per-pull-request preview to
  `pr-preview/pr-<number>/` on the `gh-pages` branch and removes it when the PR
  closes. Skipped for pull requests from forks.

## Markdown conventions

- One top-level `#` heading per file; the page `title` is set in frontmatter.
- Use explicit heading ids where other pages link to them:
  `## My section {#my-section}`. Reference them with relative links such as
  `[text](../configuration/cluster.md#cluster-section)`.
- Page titles, page names, and UI labels (buttons, fields, menu entries) use
  inline code: `` `Save` ``, `` `Settings` ``.
- File paths, commands, config keys and volume names use inline code:
  `` `postgres-data` ``.
- In Italian pages, UI labels use the Italian strings shown by the UI.
  Take them from the
  [ns8-core](https://github.com/NethServer/ns8-core) translation files:
  1. Search `core/ui/public/i18n/en/translation.json` for the English
     label and note its key (e.g. `settings_subscription.system_id` for
     "System key").
  2. Read the same key in `core/ui/public/i18n/it/translation.json`
     ("Chiave sistema").

  Labels of an application UI come from the same files in its own
  repository, e.g. `ui/public/i18n/it/translation.json` in `ns8-mail`.
  Copy the string as is, and use one label language for the whole page.
- Table captions are a paragraph right after the table, written as
  `<p class="table-caption">Caption text</p>`. The `table-caption` class
  (centered, italic) is defined in `src/css/custom.css`.
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
- Do not write which release introduced a feature (for example "Available
  from NethServer 8.10" or "core 3.22.0"). The docs always describe a cluster
  with the latest updates installed.
