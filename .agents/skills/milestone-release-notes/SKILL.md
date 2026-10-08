---
description: 'Use when the user asks to prepare the release notes of a NethServer 8 milestone (e.g. "release notes for 8.11"), to scan or classify the issues of a NethServer/dev milestone, or to write the community or partner forum announcement of a milestone.'
name: milestone-release-notes
---

# NS8 milestone release notes and announcements

## Overview

Every NethServer 8 milestone (about one per quarter) ends with three
deliverables:

1. A `## Major changes on YYYY-MM-DD` section in
   `docs/administrator-manual/about/release_notes.md`, with its Italian mirror,
   published through a pull request.
2. An English announcement for the community forum (`ANNOUNCEMENT.md`).
3. An Italian announcement for the Nethesis partner forum
   (`ANNOUNCEMENT-it.md`).

The source of truth is the milestone of the
[NethServer/dev](https://github.com/NethServer/dev/milestones) repository and
the GitHub releases of the `ns8-*` modules.

The steps below run in order, with a user checkpoint after each one. The user
edits the drafts by hand between the steps: always re-read the files before
changing them, and keep their edits.

---

## Step 1 — Collect the milestone issues

Find the milestone number and due date:

```bash
gh api graphql -f query='{repository(owner:"NethServer",name:"dev"){milestones(first:20,orderBy:{field:CREATED_AT,direction:DESC}){nodes{number title dueOn state}}}}'
```

Fetch all issues in one call. The issue type is available only through
GraphQL, not `gh issue list`. Check `totalCount`; milestones usually stay
below 100 issues:

```bash
gh api graphql -f query='{repository(owner:"NethServer",name:"dev"){milestone(number:N){issues(first:100){totalCount nodes{number title state issueType{name} labels(first:20){nodes{name}} body comments(last:15){nodes{body}}}}}}}' > milestone.json
```

Save the output in the scratchpad, not in the repository.

**Scope:**

- Closed issues, plus open issues labelled `testing` or `verified` (they are
  about to close).
- Types `Feature`, `Bug` and `Task`. Issues without a type can still matter
  (e.g. an upstream version bump): list them separately for the user.
- The label `milestone goal :crown:` marks the flagship items of the
  milestone: they lead the release notes and get more detail.
- A closed `Design` issue alone is **not** proof of shipping. Implementation
  often happens in a later milestone. Include it only if a related
  Feature/Backend/Frontend issue closed in the same milestone, or a release
  comment, confirms it.
- Issues are not linked as GitHub sub-issues: group related issues (e.g. a
  Feature and its Frontend issue) by reading their bodies.

**Component and version:** the convention in NethServer/dev is a closing
comment such as `Released https://github.com/NethServer/ns8-mail/releases/tag/1.9.0`.
Extract every `ns8-<component>/releases/tag/<version>` from the comments. If
there is none, check the linked PRs and `gh release list --repo
NethServer/ns8-<component>`. Some modules live outside the NethServer org
(e.g. `nethesis/ns8-nethvoice`). An issue without a release is not shipped
yet: report it, do not announce it.

## Step 2 — Classify by end-user impact

Before drafting, give the user a report in chat that classifies every
in-scope issue:

1. **Features with UI or documentation impact**: new pages, tabs, fields,
   options.
2. **Features that change behavior without UI**: defaults, CLI behavior,
   performance, dropped platforms, upstream upgrades.
3. **Bug fixes that change the previous behavior**: a setting now applied, a
   status now reported differently, a folder now created earlier.
4. **Plain bug fixes**: regressions and crashes fixed, no behavior change.
5. **Internal or developer-only changes**: no end-user impact.

For every item, record the version tag and the docs coverage:

- Search the docs **on `origin/main`**, not on the current branch, which
  can be behind: `git grep -n -i -e "<keyword>" origin/main -- docs`.
- List the open docs PRs: `gh pr list --repo NethServer/ns8-docs --state open`.
  When one documents a feature, read its diff: it is the most reliable
  description of what shipped.
- Flag documentation gaps: features whose page does not describe them yet.

## Step 3 — Draft the release notes

Work on a branch (e.g. `relnotes<milestone>`, like `relnotes810`) and open a
**draft** pull request. Draft the section as text first and get the user's
approval of the bullet list before committing.

Section format:

```markdown
## Major changes on YYYY-MM-DD

**Milestone 8.N**

- **Short title** \[Component X.Y.Z\] -- What changed, from the
  administrator's point of view. See [Page section](../path/page.md#anchor).
```

Rules:

- The date is the milestone `dueOn` as a placeholder. The user sets the real
  publish date at the end.
- The `[Component X.Y.Z]` tag is the **ns8 module release** (e.g.
  `[WebTop 1.5.9]`), never the upstream version. Mention the upstream version
  in the prose if useful ("WebTop was updated to upstream release 5.35.6").
  List several versions when a feature spans them: `\[Core 3.20.1, 3.22.0\]`.
- Order: milestone goals first, then thematically related bullets next to
  each other (core UI, monitoring, CrowdSec, Mail, other apps, platform
  changes), not issue-number order.
- Include features (types 1 and 2) and the behavior-changing fixes (type 3).
  Leave plain bug fixes out. The user may still drop items: respect removals
  made in later commits or fixups.
- Routine dependency bumps collected in a Task issue ("Released ns8-mattermost
  2.4.5" comments) go into one closing bullet:
  `- **Other application updates** -- Loki 1.5.0, Nextcloud 1.7.6.`
  Skip apps that already have their own bullet in the section, and versions
  already listed in a previous milestone. Major upstream upgrades with a
  dedicated issue get their own bullet.
- A manual upgrade procedure (e.g. a major version with a database
  migration) must be stated clearly and linked.
- Link each bullet to the docs section that describes the feature, using
  explicit heading ids. If the section is added by another docs PR, say in the
  PR description that this PR must be merged after it.
- Before finalizing, run Step 1 again: modules often release during the last
  days of the milestone (e.g. CrowdSec 1.3.0 and Piler 1.3.0 in 8.10).

PR description: what the section announces, the list of `NethServer/dev#N`
references it covers, and the merge order constraints. Update it whenever the
content changes.

## Step 4 — Italian mirror

Add the same section to
`i18n/it/docusaurus-plugin-content-docs/current/administrator-manual/about/release_notes.md`:

- Heading: `## Modifiche principali del DD-MM-YYYY`, then `**Milestone 8.N**`.
- One bullet per English bullet, same order, same version tags and links.
  Link text uses the Italian heading of the target section.
- UI labels use the Italian strings shown by the UI. Take them from the
  translation files, by key, as `AGENTS.md` explains: `core/ui/public/i18n/it/translation.json`
  in ns8-core, and `ui/public/i18n/it/translation.json` in the application
  repository (ns8-mail, ns8-crowdsec, ...). Use the current label, even when
  older sections use a previous wording.
- Keep in English: "subscription", Grafana dashboard names, IMAP folder names,
  titles of English-only pages linked from GitHub.
- Use impersonal forms ("Vedere ...", "abilitarla dalla pagina ...").

## Step 5 — Check and publish

1. Rebase the branch on `origin/main` when the linked sections were merged
   after the branch was created. Otherwise the PR preview shows broken
   anchors. Force-push with `--force-with-lease`.
2. Run `yarn build`: it must report no broken links or anchors in both
   locales.
3. Commit following the `nethserver-skills:conventional-commit` skill
   (e.g. `docs(release-notes): add remaining 8.10 changes`).
4. When the user asks, set the final date, mark the PR ready for review
   (`gh pr ready`) and request the reviewers they name
   (`gh pr edit --add-reviewer`). Resolve names to logins with
   `gh api repos/NethServer/ns8-docs/assignees`.

---

## Step 6 — Community announcement (English)

Ask the user for the previous milestone announcement and use it as the
template. Write `ANNOUNCEMENT.md` at the repository root. **Never commit the
announcement files**: they are pasted into the forum by hand.

Tone: friendly, concise, non-technical. Explain what the user gains, not how
it works. Use the release notes as the only source.

Structure:

1. **Opening**: one sentence presenting the milestone as a checkpoint of the
   NethServer 8 journey (this replaces a "milestone meaning" section), then a
   bullet list of the cycle's focus areas. The forum topic title is set
   separately: no `#` heading.
2. **`## :star2: Enhancements`**: link to the release notes section
   (`https://docs.nethserver.org/docs/administrator-manual/about/release_notes#major-changes-on-YYYY-MM-DD`).
   Then one `###` section per feature with **interesting UI changes**, so the
   user can add screenshots. Put features without UI later.
3. **Optional `##` sections** for news outside the release notes (e.g. a new
   subscription portal), as provided by the user.
4. **`## :wrench: Other changes`**: the remaining items, grouped by app with
   bold labels, **Core first** (`**Core**`, `**Mail**`, `**Webmail and
   WebTop**`, ..., `**Other applications**`).
5. **`## :beetle: Bug fixes`**: "20+ bugs have been addressed ..." with the
   real count of closed bugs, three example issue URLs with clear end-user
   impact, and the issue tracker query:
   `https://github.com/NethServer/dev/issues?q=is%3Aissue+milestone%3A%22NethServer+8.N%22+type%3Abug`.
6. **`## :compass: Roadmap`**: the outcome of the previous milestone goals,
   then the next goals as given by the user. Do not invent goals.
7. **`## :handshake: Join the NS8 community`**: kept from the template.

Discourse formatting:

- Screenshots go in `[grid]` ... `[/grid]` blocks, one image per line:
  `![Caption|690x320](upload://<id>.png)`. A caption broken across two lines
  breaks the image: check this after the user adds screenshots.
- Thank community contributors by forum handle (e.g. `@pagaille`).

Keep the announcement consistent with the release notes: if the user removes
a bullet from the release notes, point out matching lines in the
announcement.

## Step 7 — Partner announcement (Italian)

Translate `ANNOUNCEMENT.md` into `ANNOUNCEMENT-it.md` for the Nethesis partner
forum:

- Same structure and screenshots. Captions can stay in English.
- Address readers with "voi". Keep "subscription" in English, feminine
  ("la subscription").
- UI labels as in Step 4.
- Link the Italian release notes:
  `https://docs.nethserver.org/it/docs/administrator-manual/about/release_notes#modifiche-principali-del-DD-MM-YYYY`.
  The anchor exists only after the Italian section is merged.
- Replace the "Join the NS8 community" section with the update instructions
  provided by the user, for example:

  ```markdown
  ## :arrows_counterclockwise: Aggiornamento

  L'aggiornamento avviene in modalità automatica. Dalla pagina `Software center` del cluster-admin è possibile come al solito anticipare l'aggiornamento con la procedura manuale.
  ```

- Sign as "Il team NethServer".

 **Never commit the announcement files!**