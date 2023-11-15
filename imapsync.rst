.. _imapsync-section:

========
Imapsync
========



This module installs Imapsync, an IMAP transfer tool. Its purpose is migrating email messages from remote IMAP accounts to a local one.

The migration is both recursive and incremental and can be repeated as many times as needed, also you can select the task frequency.

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
