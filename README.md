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

## Syncing app READMEs to Kapa

The "Ask AI" widget answers from two knowledge sources: this manual, and the
READMEs of every published NS8 app. The second source is a bucket of
markdown files that Kapa indexes as a separate, developer-oriented source
group, so that answers drawn from it are flagged as such.

`.github/workflows/sync-app-readmes.yml` refreshes that bucket daily. To run
the collection step locally, without uploading anything:

```bash
yarn sync:app-readmes --dry-run          # list the files that would be collected
yarn sync:app-readmes --out /tmp/readmes # collect the READMEs into /tmp/readmes
```

The app list comes from the `repodata.json` feeds of the `default` and
`nethforge` software repositories, and each app's source repository is taken
from its `docs.code_url` field, so apps maintained outside the NethServer
organization are included too.
Apps whose `code_url` is a placeholder, or whose repository has no README, are
skipped and listed at the end of the run.

Both the root README and the README of each component subdirectory are
collected, so an app like `ns8-mail` contributes its own README plus those of
`postfix/`, `dovecot/`, `rspamd/` and `clamav/`. The output is a flat
directory: a root README is named `<software repository>_<app>.md`, as in
`default_mail.md`, and a component README appends its directory, as in
`default_mail_postfix.md`. READMEs under `ui/`, `test/`,
`tests/`, `lib/`, `var/`, `vendor/` and `node_modules/` are left out, as are
component READMEs below 300 bytes: those are scaffold, vendored or stub files,
and near-identical copies of them across 40 repositories would only crowd out
real content at retrieval time.

Files are read at the app's latest stable release tag, the highest non-testing
version in its `repodata.json` entry, not at the branch head. The collected text
then matches the version users are actually running, and the citation URL points
at that tag, so the page Kapa quotes stays the page a reader opens. An app that
cannot be read at its release — no stable version published, or no such tag in
its repository — is skipped and listed at the end of the run, rather than
collected from its development branch: everything indexed is a released README,
without exception.

Every collected file gets a provenance banner prepended, warning that it is
developer documentation rather than the official manual. The banner is part of
the indexed content on purpose: it reaches the model through retrieval, and
does not depend on the Kapa system instructions alone. An `index.json` maps
each object key to its GitHub URL, which is what Kapa shows in citations.

The collection step needs a GitHub token: it makes one call per app to list its
files and one per collected README, around 110 in total, against an anonymous
allowance of 60 per hour. If you are logged in with `gh auth login` its token is
picked up automatically; otherwise set `GH_TOKEN` to a token with no scopes.
Every repository read here is public.

Uploading requires write credentials for the Kapa bucket, so it is normally left
to the workflow. To do it by hand, pass the destination to the upload wrapper:

```bash
export AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_DEFAULT_REGION=...
yarn upload:app-readmes s3://BUCKET --dry-run  # collect, print the sync command
yarn upload:app-readmes s3://BUCKET            # collect and upload
```

The wrapper collects the READMEs and runs `aws s3 sync --delete` for you. Pass
the destination and nothing else: it derives the `index.json` object keys from
that single URL, so they cannot disagree with the keys the objects actually get.
Doing the two steps by hand instead is what makes them drift, and the failure is
silent — the files upload and index correctly, only the citation URLs are wrong.

The files go to the bucket root, so the bucket must be dedicated to them: the
sync deletes whatever else it finds there. A destination with a path, such as
`s3://BUCKET/app-readmes`, confines both the upload and the deletion to that
prefix instead, and Kapa's S3 source then needs the same prefix configured.

For an S3-compatible provider other than AWS, add `--endpoint-url URL` or set
`KAPA_S3_ENDPOINT_URL`. The credentials used here need write access; the ones
configured in Kapa are a separate, read-only pair.

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
and mirrors the `docs/` tree. Translations are maintained manually: when you
change a page under `docs/`, update the matching Italian Markdown file under
`i18n/it/docusaurus-plugin-content-docs/current/`.

## License

See [`LICENSE`](LICENSE).
