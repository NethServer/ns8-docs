.. _imapsync-section:

========
Imapsync
========



This module installs Imapsync, an IMAP transfer tool used for copying and moving emails from external IMAP servers to a :ref:`Mail server <email-section>` instance.
This module can serve many purposes. For example:

- If you want to use the local IMAP account as a backup for the remote one.
- If you want to use the local IMAP account as a combination of several remote ones.
- If you want to migrate messages from one remote IMAP account to a local one.

The task is both recursive and incremental and can be repeated as many times as needed, also you can select the task frequency.

The system administrator of the local NethServer does not need to know the password of the local user because Imapsync access the local user mailbox with administrative permissions. However, the administrator has to know the password of the remote IMAP account, unless the IMAP administrative authentication is implemented also by the remote email server.

If the remote IMAP server is a NethServer 7, the IMAP admin user is ``vmail`` and its password can be read from ``/var/lib/nethserver/secrets/vmail``. The username with a ``*vmail`` suffix (e.g. ``username@domain.com*vmail``) and the vmail password has to be set in the IMAP synchronization panel.



.. note::
   List of `IMAP servers <https://imapsync.lamiral.info/FAQ.d/FAQ.Admin_Authentication.txt>`_ with admin authentication in Imapsync documentation


Imapsync is an Open Source software. Check out the `official documentation <https://imapsync.lamiral.info/#doc>`_ for further details.

Configuration
=============

Imapsync needs to be configured to use a Mail module already installed in the NethServer 8 cluster. Once configured, you can create as many tasks as needed for each user of the domain.

.. note::
   Imasync is integrated with LDAP user domain that you can configure at :ref:`user-domains-section`.


Known limitations
=================

- Messages copied by Imapsync are not subject to anti-spam and anti-virus
  checks.

- Imapsync does not integrate with :ref:`Piler <piler-section>`: messages
  copied by Imapsync are not archived.

- Sieve filters are evaluated during LMTP delivery, which is used by Postfix to deliver emails. However, Imapsync likely uses IMAP commands to interact directly with Dovecot, bypassing LMTP and preventing Sieve scripts from being executed.