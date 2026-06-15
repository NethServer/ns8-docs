# NethServer 8 documentation

[Docusaurus](https://docusaurus.io/) sources for the NethServer 8 (NS8)
documentation, published at https://docs.nethserver.org.

The documentation is organized into three manuals:

- **Administrator manual** (`docs/administrator-manual/`) — how to install,
  configure and manage NS8 and its applications.
- **User manual** (`docs/user-manual/`) — end-user documentation (user portal
  and the WebTop groupware).
- **Tutorial** (`docs/tutorial/`) — tutorials and best practices.

## Requirements

- [Node.js](https://nodejs.org/) >= 18
- [Yarn](https://classic.yarnpkg.com/) (classic)

## Local development

```bash
yarn install   # install dependencies
yarn start     # start a dev server with hot reload at http://localhost:3000
```

## Building

```bash
yarn build     # generate the static site into build/
yarn serve     # serve the production build locally
```

`yarn build` validates the site (MDX compilation, broken links and anchors),
so run it before opening a pull request.

The build also stages committed legacy static artifacts from `static/legacy/`
into the final published paths:

- `static/legacy/v7/` -> `build/en/v7/`
- `static/legacy/v6/` -> `build/en/v6/`
- `static/legacy/it/v7/` -> `build/it/v7/`
- `static/legacy/it/v6/` -> `build/it/v6/`
- `static/legacy/projects/nethserver-devel/en/latest/` -> `build/projects/nethserver-devel/en/latest/`

## Refreshing legacy artifacts

Legacy NS7/NS6 documentation is stored in this repository as static artifacts
only. To refresh those artifacts from the legacy repository:

```bash
cd /home/giacomo/projects/nethserver/docs/administrator-manual/en
git checkout v7
make clean
make html

git checkout v6
make clean
make html
```

Then copy each generated `_build/html/` tree into:

- `static/legacy/v7/`
- `static/legacy/v6/`

For the Italian archives, mirror the published pages instead:

- `https://docs.nethserver.org/it/v7/` -> `static/legacy/it/v7/`
- `https://docs.nethserver.org/it/v6/` -> `static/legacy/it/v6/`

The legacy developer manual is English only. Mirror it from:

- `https://docs.nethserver.org/projects/nethserver-devel/en/latest/` -> `static/legacy/projects/nethserver-devel/en/latest/`

To test the final result locally:

```bash
yarn install
yarn build
yarn serve
```

Then open:

- `http://localhost:3000/`
- `http://localhost:3000/en/v7/`
- `http://localhost:3000/en/v6/`
- `http://localhost:3000/it/`
- `http://localhost:3000/it/v7/`
- `http://localhost:3000/it/v6/`
- `http://localhost:3000/projects/nethserver-devel/en/latest/`

## How to contribute

The easiest way to contribute is by forking and editing the repository on
GitHub:

- Create a GitHub account if you don't have one.
- Fork https://github.com/NethServer/ns8-docs.
- Edit any page under `docs/` (Markdown). Add a new page by creating a `.md`
  file in the appropriate folder; the sidebar is generated automatically from
  the folder structure (`sidebars.ts`).
- Open a pull request. A test build runs automatically; once merged into
  `main`, the site is built and published to GitHub Pages.

See [`AGENTS.md`](AGENTS.md) for the Markdown conventions and project layout.

## Translations

English is the default language. The Italian translation lives under `i18n/it/`
and mirrors the `docs/` tree. Translations are kept in sync automatically by the
translation workflow (`.github/workflows/sync-translations.yml`); you can also
edit the Italian Markdown files directly.

## License

See [`LICENSE`](LICENSE).
