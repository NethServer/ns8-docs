# NS8 Documentation — Copilot Instructions

This repository contains the Sphinx-based administrator manual for NethServer 8,
published at https://docs.nethserver.org/en/latest/.

## Build commands

```bash
# Install dependencies (Fedora)
sudo dnf install python3-sphinx python3-pip make
pip install -r requirements.txt

# Build HTML output
make html

# Spell-check a file before submitting
hunspell -d en_US <filename>.rst
```

Localization (Italian translation files are maintained by CI):

```bash
make gettext
sphinx-intl update -p _build/gettext -l it
```

## Architecture

- Every `.rst` file is one chapter. `index.rst` defines the document tree and
  reading order via `toctree` directives.
- `conf.py` configures Sphinx (theme: `sphinx_book_theme`, extension:
  `sphinx_copybutton`).
- `locale/` holds `.po` translation files, auto-updated by the CI workflow
  (`.github/workflows/`) on every push to `main`.
- ReadTheDocs builds and publishes the `main` branch automatically
  (`.readthedocs.yaml`).
- `README.rst` is excluded from the Sphinx build (`exclude_patterns` in
  `conf.py`) and serves only as contributor guidance.

## RST conventions

**Document structure** — one top-level title per file, underlined with `=`.
Subsequent heading levels in order:

```rst
First level
===========

Second level
------------

Third level
^^^^^^^^^^^

Fourth level
~~~~~~~~~~~~
```

**Cross-references** — label targets use a `-section` suffix and are placed
immediately before the heading they describe:

```rst
.. _mytitle-section:

My title
--------
```

Reference them with `:ref:\`mytitle-section\`` in any file.

**Anonymous hyperlinks** — used for external URLs inside a section:

```rst
`Link text <https://example.com>`__
```

**UI elements** — use `:guilabel:` for buttons and clickable labels:

```rst
Click the :guilabel:`Save` button
```

**Inline code** — double backticks for file paths, commands, config keys,
volume names, and UI field values: ` ``postgres-data`` `.

**Index entries** — use `:index:` for terms that should appear in the
generated index: ` :index:\`Slack\` `.

**Notes and warnings**:

```rst
.. note::

   Note text (indented 3 spaces).

.. warning::

   Warning text (indented 3 spaces).
```

**Code blocks** — use the `::` paragraph form, with the block indented two
spaces:

```rst
Run this command: ::

  some-command --option value
```

## Style guidelines

- Write in second person ("you"), present tense, imperative mood for
  procedures.
- Keep sentences short and direct (see links in `README.rst` under
  *Documentation style guidelines*).
- Each application chapter follows the same pattern: brief description,
  configuration steps, then advanced topics. Follow the existing chapter
  structure when adding a new application.
- When updating an example, also remove any notes that referred to the
  replaced behaviour as a future or planned feature.
