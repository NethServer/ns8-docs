---
description: 'Use when the user provides one or more Freshdesk helpdesk ticket URLs and wants the resolution documented in the ns8-docs repository, mentions "/helpdesk", or asks to turn a support case into a tutorial or into an existing documentation page.'
name: freshdesk-ticket-to-docs
---

# Freshdesk Ticket → NS8 Documentation

## Overview

A Freshdesk **ticket** is a private, multi-party conversation: a reporter, one or
more agents, dead ends, scheduling chatter and customer-identifying data. It is
not publishable text.

This skill distils a ticket thread down to the technical problem and its
solution, strips everything that identifies who reported it, and writes the
result into `ns8-docs` — either as a new tutorial or as a new section in a page
that already covers the topic — in **both English and Italian**.

For importing a Freshdesk **solution article** (already-curated KB content),
use the `freshdesk-to-tutorial` skill instead.

---

## Step 1 — Collect inputs

### 1a. Auth token

Ask the user:

> "Please provide your Freshdesk API token (it will be kept only for this conversation and never stored permanently)."

Hold the token only in the current conversation. **Never** write it to any
file, commit, database, or memory tool, and never store or cache it across
conversations.

### 1b. Ticket URLs

If the user has not already provided them, ask:

> "Please paste one or more Freshdesk ticket URLs (e.g. https://helpdesk.nethesis.it/a/tickets/12345)."

Extract the numeric ticket ID from each URL (last path segment).

### 1c. What to document

**Required input.** A ticket thread usually contains more than one issue, and
only part of it is worth documenting. Ask:

> "What should this page document? (the problem to solve, the audience, and anything from the ticket to leave out)"

Do not proceed without an answer. The user's stated goal scopes everything
that follows: it decides which parts of the thread are signal, and it is the
difference between a useful page and a transcript.

---

## Step 2 — Fetch the tickets

Base URL: `https://nethesis.freshdesk.com/api/v2`
Auth: HTTP Basic with `<token>:X` (token as username, literal `X` as password).

```bash
# Ticket metadata and the opening message
curl -s -u "<TOKEN>:X" \
  -H "Content-Type: application/json" \
  "https://nethesis.freshdesk.com/api/v2/tickets/<TICKET_ID>"

# The full reply thread
curl -s -u "<TOKEN>:X" \
  "https://nethesis.freshdesk.com/api/v2/tickets/<TICKET_ID>/conversations"
```

### 2a. Archived tickets

Freshdesk auto-archives old tickets; the endpoints above then return `404`.
A `404` is not proof the ticket doesn't exist — retry against the archived
endpoints before telling the user it's missing:

```bash
# Archived ticket metadata
curl -s -u "<TOKEN>:X" \
  "https://nethesis.freshdesk.com/api/v2/tickets/archived/<TICKET_ID>"

# Archived ticket conversations
curl -s -u "<TOKEN>:X" \
  "https://nethesis.freshdesk.com/api/v2/tickets/archived/<TICKET_ID>/conversations"
```

Same response shape and same fields as a live ticket — read them identically.
Only report a ticket as unreachable if both the live and the archived
endpoint return `404`.

Fields read from the ticket object:

| Field | Description |
|---|---|
| `subject` | Ticket subject line |
| `description_text` | Plain-text opening message |
| `status` | 2 = open, 3 = pending, 4 = resolved, 5 = closed |
| `tags` | Array of tag strings |
| `custom_fields` | Product / version fields, when set |

Fields read from each conversation entry:

| Field | Description |
|---|---|
| `body_text` | Plain-text reply |
| `incoming` | `true` = from the customer, `false` = from an agent |
| `private` | `true` = internal note, never shown to the customer |
| `attachments` | Array of files (see Step 8) |

Prefer the `_text` variants over the HTML ones: ticket bodies are quoted email
and the HTML carries no structure worth keeping.

---

## Step 3 — Assess NS8 relevance

Examine `subject`, `description_text`, `tags` and the thread.

**The ticket is relevant to NethServer 8 if** it mentions any of:
- "NethServer 8", "NS8", "nethserver8"
- Modules/apps known to run on NS8 (Mail, WebTop, Nextcloud, Mattermost, Samba, OpenVPN, etc.)
- Cluster, node, leader, replica — NS8 architectural concepts

If the ticket is **not relevant to NS8**, stop and inform the user:
> "This ticket does not appear to be relevant to NethServer 8. No files were created."

If several tickets were supplied and only some are relevant, report which ones
were dropped and continue with the rest.

---

## Step 4 — Distil the thread

This is the core of the skill. Read the whole thread, then reconstruct four
things in this order:

1. **Symptom** — what the reporter actually observed. Usually in
   `description_text` and the first `incoming` replies. Error messages and log
   lines belong here.
2. **Cause** — the diagnosis the agent reached. Often buried in a `private`
   note or in the reply where the tone changes from "can you check" to
   "this is because".
3. **Fix** — the steps that resolved it. Prefer the **last** agent reply that
   the reporter confirmed as working over any intermediate attempt.
4. **Verification** — how a reader confirms the fix took effect.

**Discard:**
- Greetings, sign-offs, apologies, thanks
- Scheduling ("can we call at 15:00"), escalation and assignment chatter
- Customer-specific negotiation, contract and licensing talk
- Attempts that did not work — *unless* a dead end is instructive, in which
  case keep it as a `:::note` saying what does **not** work and why
- `private: true` notes, unless the note contains the actual technical
  resolution

**Rewrite, never quote.** The page is written in the repo voice: second
person, present tense, imperative mood for procedures. No "the customer
reported", no "we asked them to". Verbatim thread text is a failure mode, not
a shortcut.

If the thread never reaches a working fix, say so and stop — a ticket with no
resolution has nothing to document.

---

## Step 5 — Scrub (blocking gate)

Run this **before writing any file**. Nothing proceeds until it passes.

The page contains only the technical problem and its solution. Anything that
identifies who reported it, from where, or under which contract does not
appear in the output.

| Found in ticket | Emit instead |
|---|---|
| Customer or company name | Generic phrasing, or `example.org` |
| Person name, agent name, email signature | Remove |
| Email address | `user@example.com` |
| Real hostname or FQDN | `server.example.com` |
| Public IP address | `203.0.113.10` (TEST-NET-3) |
| Private IP that identifies a specific site | `192.168.1.10` |
| Ticket ID, ticket URL, requester ID | Remove entirely |
| Licence key, serial, API token, password | Remove entirely |
| VPN, tenant or subscription identifier | Remove entirely |

Apply the same rules **inside code blocks and log excerpts** — that is where
hostnames, IP addresses and mail addresses hide. A scrubbed log line must stay
realistic: replace the value, keep the format.

Do not keep a ticket reference for traceability. There is no internal-only
comment form that is safe here — the repository is public.

---

## Step 6 — Choose the target, then wait

Search the repository for pages that already cover the topic, for example:

```bash
grep -ril "<app-or-subsystem>" docs/administrator-manual/applications/ docs/tutorial/
```

Then present both options concretely, with real paths:

```
A) Integrate into docs/administrator-manual/applications/mail.md
   → new section "## <heading>" after "## <existing heading>"
B) New tutorial at docs/tutorial/<slug>.md
```

**Stop and wait for the user to choose.** No file is created or modified
before that.

Recommend **A** when the content is a variation of behaviour the page already
documents, and a reader hitting the problem would already be on that page.
Recommend **B** when it is a standalone troubleshooting procedure, spans
several components, or would unbalance the existing page.

---

## Step 7a — New tutorial

English file at `docs/tutorial/<slug>.md`, where `<slug>` is derived from the
page title (lowercase, spaces → hyphens, strip special characters):

```markdown
---
title: "Page title"
sidebar_position: 99
---
# Page title

<distilled body>
```

Use `sidebar_position: 99` as a placeholder; the user adjusts it.

Italian file at
`i18n/it/docusaurus-plugin-content-docs/current/tutorial/<slug>.md`, same
structure with a translated `title:`.

Translate the English output yourself — the Freshdesk account has no
multilingual API, and the source thread is not a translation source:
- Informal second person ("tu"), consistent with the rest of the Italian docs.
- Keep code blocks, command names, config keys, file paths, product names and
  UI labels in English.
- Preserve all Markdown syntax, admonitions and image references unchanged.

**Then add the page to the hand-maintained link list in both index files:**

- `docs/tutorial/index.md`
- `i18n/it/docusaurus-plugin-content-docs/current/tutorial/index.md`

Append a bullet in the same style as the existing entries, for example
`- [Page title](./<slug>.md)`. The sidebar is autogenerated, but these lists
are not — skipping this leaves the page unreachable from the tutorial index.

---

## Step 7b — Integrate into an existing page

1. Read the target page first, and find the heading depth and position where
   the new content belongs.
2. Add the section with an explicit id so other pages can link to it:
   `## Section title {#section-title}`.
3. Apply the identical edit to the Italian mirror under
   `i18n/it/docusaurus-plugin-content-docs/current/<same relative path>`,
   translated per the rules in Step 7a. If the mirror does not exist, say so
   explicitly rather than skipping it silently.
4. **Never renumber, retitle or reorder existing headings** — inbound anchors
   from other pages and from external sites break.
5. If the target page has a link list or table of contents maintained by hand,
   add the new section to it.

---

## Step 8 — Attachments

Ticket attachments are customer screenshots. Treat them as unsafe by default:
they are **not** downloaded or embedded automatically.

List them for the user with filename, size and the reply they came from, and
ask which — if any — to include. For each approved file:

```bash
mkdir -p static/_static/tutorial/<slug>
curl -s -o "static/_static/tutorial/<slug>/<filename>" "<attachment-url>"
```

Reference as `![alt text](/_static/tutorial/<slug>/<filename>)`.

An approved screenshot still needs its visible content checked: browser tabs,
window titles, sidebars and toolbars routinely show customer domains, user
names and hostnames. If visible data cannot be removed, do not use the image —
describe the UI in prose instead.

---

## Step 9 — Merging several tickets

When more than one ticket is supplied, they always produce **one** page.

- The shared symptom becomes the page topic.
- Per-ticket variations become sub-sections, or a "depending on your
  configuration" branch within a single procedure.
- Deduplicate steps that repeat across tickets; do not write the same
  procedure twice.
- If the tickets turn out to describe genuinely unrelated problems, say so and
  ask the user which one to document.

---

## Step 10 — Validate

```bash
yarn build 2>&1 | tail -30
```

Fix any MDX, broken-link or broken-anchor errors before declaring the task
complete. Then print a summary:

```
✅ Created:  docs/tutorial/<slug>.md
✅ Created:  i18n/it/docusaurus-plugin-content-docs/current/tutorial/<slug>.md
✏️  Updated:  docs/tutorial/index.md
✏️  Updated:  i18n/it/docusaurus-plugin-content-docs/current/tutorial/index.md
📁 Images:   static/_static/tutorial/<slug>/  (<N> files)

Next steps:
- Review and adjust sidebar_position in both files
```

---

## Reference: Freshdesk API endpoints used

| Purpose | Method | URL |
|---|---|---|
| Get ticket | GET | `/api/v2/tickets/{id}` |
| Get ticket conversations | GET | `/api/v2/tickets/{id}/conversations` |
| Get archived ticket (fallback on 404) | GET | `/api/v2/tickets/archived/{id}` |
| Get archived ticket conversations (fallback on 404) | GET | `/api/v2/tickets/archived/{id}/conversations` |
| Get requester (avoid — identifying) | GET | `/api/v2/contacts/{id}` |

Authentication: `curl -u "<token>:X"` (Basic Auth, literal `X` as password).

---

## NS8 docs conventions (apply to generated Markdown)

- One `#` heading per file (the page title); use `##` and below for sections.
- Page titles, page names and UI labels (buttons, fields, menu entries) in
  `inline code`: `` `Save` ``, `` `Settings` ``.
- File paths, commands, config keys and volume names in `inline code`.
- Admonitions: `:::note`, `:::warning`, `:::tip`, `:::info`.
- Images: absolute path from the site root, `/_static/...`.
- Cross-links: relative paths including the extension, such as
  `../administrator-manual/installation/install.md#pre-built-image`.
- Explicit heading ids where other pages link to them:
  `## My section {#my-section}`.
- Write in second person, present tense, imperative mood for procedures. Keep
  sentences short and direct.

---

## Common mistakes

| Mistake | Why it is wrong |
|---|---|
| Pasting thread text as-is | Ticket prose is dialogue, not documentation. Rewrite in the repo voice. |
| Documenting the first fix attempted | Intermediate attempts often fail. Use the fix the reporter confirmed. |
| Scrubbing prose but not code blocks | Hostnames, IPs and mail addresses live in the log excerpts. |
| Keeping the ticket ID "for reference" | The repository is public. |
| Writing files before the user picks the target | Step 6 is a stop, not a suggestion. |
| Creating the tutorial but not touching `index.md` | The link lists are hand-maintained; the page ends up orphaned. |
| Editing the English page only | Every change has an Italian mirror. |
| Embedding a ticket screenshot without review | Screenshots leak domains, user names and hostnames. |
