.. _imapsync-section:

========
Imapsync
========

Imapsync_ is an IMAP transfer tool used for copying and moving emails
between IMAP servers.

.. _Imapsync: https://imapsync.lamiral.info/

While Imapsync has a wide range of use cases, the NS8 Imapsync application
focuses on transferring emails from remote IMAP servers to a :ref:`Mail
application <email-section>` instance. It serves two main purposes:

1. **IMAP account migration**: Messages from a remote IMAP account can be
   imported to a local Mail account. The import is recursive, incremental,
   and can be repeated as needed.

2. **INBOX retrieval**: Messages received in the INBOX folder of a remote
   IMAP account can be periodically transferred to the INBOX folder of a
   local Mail account.

Configuration
=============

Imapsync must be configured to use an existing Mail module in the
NethServer 8 cluster. For this purpose, it must be granted master user
access to the Mail module. Navigate to the ``Settings`` page and select a
Mail instance from the drop-down menu.

Once configured, proceed to the ``Tasks`` page and create one or more
synchronization tasks. Click :guilabel:`Create task` and complete the form
fields as follows:

- **Local user**: Select the NS8 user account that will receive the
  synchronized emails.

- **Remote user**: Enter the username or email address to authenticate
  with the remote IMAP server.

- **Remote password**: Provide the password for the remote IMAP account.
  Click the eye icon to reveal the password if needed.

- **IMAP server**: Enter the hostname or IP address of the remote IMAP
  server (e.g., ``imap.example.org``).

- **IMAP TCP Port**: Specify the port number for the IMAP server:

  - ``143`` (default) for STARTTLS encryption

  - ``993`` for SSL/TLS encryption

- **Select encryption**: Choose the encryption method required by the
  remote IMAP server:

  - ``STARTTLS (default 143/tcp)``: Upgrades an unencrypted connection to
    a secure one.

  - ``SSL/TLS (993/tcp)``: Uses an encrypted connection from the start.

  - ``None``: Connects without encryption (not recommended).

- **Folder synchronization**: Choose which folders to sync from the remote
  server:

  - ``Only INBOX``: Synchronizes only the main inbox. This option allows
    the user's Sieve filter to be enabled and applied during each task
    run.

  - ``All folders``: Synchronizes all available folders recursively.

  - ``All except selected``: Synchronizes all folders except those
    specified. Enter one folder name per line in the text area. The
    entries are interpreted as Regular Expressions matching remote folder
    names.

- **Remote server messages deletion**: Configure how messages should be
  handled on the remote server after synchronization:

  - ``Do not delete any message`` (default)

  - ``Delete messages from the server after each sync``

  - ``Delete messages older than a specified number of days`` (a field
    will appear to specify the retention period)

- **Task frequency**: Define how often the task runs:

  - ``Not scheduled, manual execution only``: Runs only when manually
    triggered.

  - ``Run at a fixed interval (in minutes)``: Runs automatically at the
    specified interval.

Once all fields are set, click :guilabel:`Create task` to create the task.
To discard the changes, click :guilabel:`Cancel`.

Understanding "Only INBOX" option
---------------------------------

.. note::

  To avoid unexpected changes to the "Seen" flag required by Imapsync, do
  not access the remote IMAP account with other IMAP clients.

When a message is transferred by a task using the ``Only INBOX`` folder
synchronization option, it is marked in the remote account with the IMAP
"Seen" flag. IMAP clients commonly display messages without the "Seen"
flag as "New" or "Unread."

Messages with the "Seen" flag are ignored by Imapsync in subsequent
transfers. This prevents re-transferring messages that have been moved
from the local INBOX to Trash or another folder.

Using the "Seen" flag as a transfer condition also allows the user's Sieve
filter to be applied safely to transferred messages.

NethServer as a Remote IMAP Server
----------------------------------

If the remote IMAP server is a NethServer instance, you can configure the
synchronization task using either a regular user account or the IMAP master
user password. The master user simplifies migration by avoiding the need
to know individual account passwords.

In NethServer 7 the ``vmail`` master user password can be retrieved at
``/var/lib/nethserver/secrets/vmail``.

In NethServer 8 the ``vmail`` master user password can be obtained from a
command like: ::

  runagent -m mail1 grep DOVECOT_VMAIL_PASS dovecot.env

Append the ``*vmail`` suffix to the task's ``Remote user`` field value.

For example:

- ``ns8user`` becomes ``ns8user*vmail``

- ``ns7user@example.org`` becomes ``ns7user@example.org*vmail``


Known limitations
=================

- Messages copied by Imapsync bypass anti-spam and anti-virus checks.
  To ensure security, enable these protections on the remote IMAP server
  before synchronization.

- Imapsync does not integrate with :ref:`Piler <piler-section>`, meaning
  that messages transferred via Imapsync are not archived.
