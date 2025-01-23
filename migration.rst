.. _migration-section:

======================
NethServer 7 migration
======================

Migration is the process to convert a NethServer 7 machine (*source* NS7)
into a NethServer 8 (*destination* NS8).

Before starting you will need:

* SSH and Cockpit access to the source NS7 machine.
* A new server containing a :ref:`freshly installed NS8 cluster <install-section>`.

Also check the following requirements:

#. The NS8 cluster VPN address must be resolved correctly by NS7 and the
   VPN port must not be blocked by intermediate network appliances. The
   VPN address and port were configured during the cluster creation: by
   default the address is the leader node FQDN and the port number is
   55820.

#. If NS7 is connected to an external account provider, you must configure
   NS8 with the same account provider, as explained in
   :ref:`migrate-account-provider`.

#. You must be granted access to your authoritative DNS server.
   Applications in NS8 have a dedicated virtual host name, a FQDN that
   must be registered in the DNS. You will need to add or change a DNS
   CNAME for each of them.

#. The ``nethforge`` repository must be enabled in NS8 to migrate SOGo.

Connect to NS8
==============

The migration procedure will add NS7 as special node of the NethServer 8 cluster.
If an account provider is configured on your NS7 system, it will be linked to the NS8 cluster as an external account provider before the migration process begins.

#. Install the migration tool on the source machine. Access Cockpit on the
   source server and install "Migration to NS8" from the Software Center.

#. Open the just installed ``NS8 migration`` application.

#. Connect the NethServer 7 server to an existing new NethServer 8 cluster
   by entering the following fields:

   - ``LDAP user domain``: This field is available when NS7 uses a local
     OpenLDAP account provider. Ensure the user domain name is unique
     within the NS8 cluster. The local LDAP database from NS7 will be
     renamed to this new domain name during migration to the NS8 cluster.

   - ``NS8 leader node``: the host name or IP address of NethServer 8 cluster leader node

   - ``NS8 admin username`` and ``NS8 admin password``: administrator
     credentials for the leader node. 
     These credentials are solely used to create a ``ns7admin1`` admin account in NS8
     (note that the trailing '1' may actually be any number),
     reserved for the NS7 migration tool. Ensure that this account is automatically
     removed at the end of the migration.

   - uncheck the ``TLS validation`` option if the leader node does not have a valid TLS certificate

#. Click the :guilabel:`Connect` button.

If NS8 has an active subscription plan, automated updates are inhibited
until the NS7 node is automatically removed from the cluster at migration
completion. See also :ref:`scheduled-updates`.

Migrate an application
======================

The web interface will display the list of all applications installed inside NethServer 7.

.. hint:: 

    If NS7 has a remote account provider and an error message is displayed
    instead, see :ref:`migrate-account-provider`.


#. Choose an application and click on the :guilabel:`Start migration`
   button. In this phase the migration process will install the
   application into the NethServer 8 cluster and start the first data
   synchronization. If the NethServer 8 cluster is composed by 2 or more
   nodes, you will be asked to select a destination node.

#. Click the :guilabel:`Sync data` button multiple time to keep in sync
   the application data between NethServer 7 and NethServer 8. If
   something goes wrong at this point, click the :guilabel:`Abort
   migration` button to remove the NS8 application instance and start over
   with it.

#. When you are ready for the final migration, click the :guilabel:`Finish
   migration` button. If the migrated application requires extra
   parameters, the system will display a dialog box before proceeding.

Please note that most web application will need a dedicated FQDN (virtual
host) after finishing the migration. Make sure the DNS record points to
the NS8 node. In NS8, you can still configure :ref:`custom HTTP routes
<migrated_routes-section>` for the migrated applications.

At the end of each application migration the following happens:

- The application in NS8 is configured and started with the migrated data.

- The application in NS7 is stopped and disabled.

- The migration tool configures an HTML page with a link pointing to the
  new application virtual host name served by NS8. End-users will see
  that link instead of the old application. See also
  :ref:`migrated_routes-section`.

- If the NS7 application was connected to the local account provider, the
  NS8 application still uses it, through a temporary external account
  provider and the cluster VPN. See :ref:`migrate-account-provider` for
  more information.

As alternative, the migration of an application can be skipped with the
:guilabel:`Skip migration` button.


Complete the migration
======================

When the account provider is finally migrated, the migration procedure
disconnects NS7 from the NS8 cluster and the initial connection page
appears again.

If NS7 needs to use NS8 as remote account provider, read carefully the
section :ref:`migrate-account-provider`.

Logs
====

* The migration tool UI has a ``Logs`` page for reading ``/var/log/ns8-migration.log`` contents. 
  The migration procedure of each application sends a trace of its activity to that file.
* Furthermore, when joining/leaving the NS8 cluster and when NS7 services are modified, some 
  information can be recorded by ``/var/log/messages`` as usual.
* On the NS8 side, the application log contains the trace of the ``import-module`` activity.

.. _migrate-account-provider:

Account provider
================

Your action is required if the NS7 system is configured with a **remote
account provider**. The migration tool expects to find in NS8 an external
user domain matching the ``BaseDN`` value of the remote account provider.
For example, in NS7 under the ``Users & Groups`` page, look at the
``Account provider`` details: if the ``BaseDN`` value is
``dc=directory,dc=nh``, then the NS8 external user domain name must be set
to ``directory.nh``. Apart from the matching name, the external user
domain of NS8 must point to the same LDAP database of NS7 (regardless its
implementation). Bear in mind that every node of the NS8 cluster must
reach the same LDAP database, now and in the future.

If the NS7 system uses a **local account provider**, ensure its domain
name is unique within the NS8 cluster and does not conflict with any
existing user domain name. This is particularly important for AD domains,
as they cannot be renamed in the migration tool's connection form. When
connected to the NS8 cluster, a temporary external user domain is created
to allow migrated applications to access the NS7 local account provider
until its migration is complete. Once the local account provider is
migrated, the temporary external user domain is automatically removed.

Refer to the next sections for specific information about the local
account provider migration.

Samba DC
--------

Complete the DC migration by clicking the :guilabel:`Finish migration`
button. The procedure asks to select an IP address: it will become the IP of
the destination DC.

.. warning::

  Windows clients might not know how to reach the new DC

a. If DNS configuration of Windows clients is controlled by a DHCP server,
   set the NS8 DC IP address as the new DNS server.

b. If Windows clients use an external DNS, it must be
   configured to forward the requests for the Active Directory DNS zone to
   the NS8 DC IP address.

c. If Windows clients have a manual DNS configuration and use the NS7 DC
   IP address as DNS and authentication server, consider to transfer the
   NS7 DC IP address to the NS8 DC.

In the last case, transferring the IP avoids the reconfiguration of DNS
settings for each Windows client. This can be preferable over an external
DNS server, if it blocks dynamic DNS update requests (DDNS).

To transfer the source DC IP address to the destination DC some steps must
be done manually after the migration has completed.

#. Check the migration of accounts was successful. Users and groups must
   be listed correctly under ``Domains and users`` page.

#. At the end of the migration the source DC IP address is free and can be
   assigned to the destination node. Refer to the node operating system documentation to
   assign a secondary (alias) IP address to the destination node.

#. Change the IP address of the DC. For example, if DC instance is
   ``samba1`` and the new IP is ``192.168.1.123``, run the following
   command: ::

      api-cli run module/samba1/set-ipaddress --data '{"ipaddress":"192.168.1.123"}'

The NS8 Samba DC can be configured as external account provider
for NS7. Bear in mind that NS7 must be able to access the :ref:`IP address <active_directory-section>` the Samba account provider is bound to.
This configuration could be useful if you have modules still running on NS7 that require
access to the account provider.

Password expiration settings are preserved during the migration. The
password strength policy, if enabled, is converted for compliancy with
Windows 2003+ server complexity requirements [#WINP]_ and is enforced for
future password changes. See also :ref:`password-policy-section`.

.. [#WINP] `Passwords must meet complexity requirements <https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)#password-must-meet-complexity-requirements>`_
    from *learn.microsoft.com* website.

OpenLDAP
--------

Complete the OpenLDAP migration by clicking on the :guilabel:`Finish
migration` button.

.. warning::

  The OpenLDAP instance running in NS8 is currently not accessible as
  external account provider for NS7 and other network devices.

Password age and account locked status information are preserved by the
migration procedure.

However, password policy settings (strength and expiration) are not
migrated. To re-enable them, navigate to the domain settings of the
``Domains and users`` page. See also :ref:`password-policy-section`.

.. _mail-migration-section:

Mail
====

The Migration Procedure preserves both data and configurations of NS7
Email application, unless stated differently in this section or in
:ref:`config-excluded-migration`.

Mail messages are copied to NS8 with Rsync. After :guilabel:`Finish
migration` is clicked, some time-consuming operations are executed.

- **IMAP ACL Format Conversion**: The user and group name format in IMAP
  ACLs is modified by removing the domain suffix. For example, an ACL entry
  referring to IMAP user `john.doe@server.example.org` becomes `john.doe`.
  IMAP login still accepts both formats.

- **Quota Recalculation**: If IMAP quota is enabled, mailbox sizes are
  recalculated in the background. During this time, disk usage of mailboxes
  might not be available.

- **Messages and Attachments Reindexing**: The full-text search engine of
  NS8 runs in the background to reindex all messages and attachments. During
  this time, full-text searches might not work. To check if the reindexing
  process is still running, use the command ``pgrep dovecot-index``.

Remember to update the DNS records or transfer the IP address to the NS8
node at the end of the migration.

Smart host
----------

The NS7 system smart host configuration is converted to a :ref:`default
relay rule <relay-rules-section>`. The NS8 Mail application is then
configured as the SMTP server for every application in the cluster: see
:ref:`email-notifications`.

.. _getmail_migration-section:

POP3 connector
--------------

The migration involves transferring POP3 Connector settings to NS8 :ref:`Imapsync module <imapsync-section>`, together with Email application.
Configurations of accounts using the IMAP protocol are translated to working Imapsync tasks.
For accounts using POP3, it is necessary to review the settings and commence synchronization manually.

.. warning::

  Emails fetched by Imapsync are not subject to anti-spam, anti-virus, or
  Sieve filtering.

.. _migrated_nethvoice-section:

NethVoice
=========

.. note::
   
   The migration tool automatically installs the :ref:`NethVoice Proxy <nethvoice_proxy-section>` if it is not already present on the destination node.
   In such cases, it is recommended to configure the :ref:`NethVoice Proxy <nethvoice_proxy-section>` prior to completing the NethVoice setup.

The migration procedure requires two FQDNs to be assigned: 

- one for the administration interface of the **NethVoice** application 
- one for **NethVoice CTI**.


NethVoice data (recording files, audio files, CDR database) are copied to NS8 with Rsync. 
After :guilabel:`Finish migration` is clicked, some time-consuming operations are executed.

Remember to update the DNS records if you plan to use the same FQDN as NethVoice on NS7
at the end of the migration.


.. _migrated_routes-section:

Manual HTTP routes
==================

In NethServer 7, most web applications were accessible using path-style routes.
As an example, given a server named ``server.nethserver.org`` the WebTop installation
was available at ``https://server.nethserver.org/webtop``.

On the other side, when the application is migrated you will be asked to enter a FQDN
so WebTop will be available on a URL like ``https://webtop.nethserver.org``.

If you have already migrated the FQDN DNS record to the new server, you can also manually
recreate the old HTTP routes from the :ref:`proxy page <traefik-section>`.

Example for adding WebTop routes:

1. open the ``HTTP routes`` section from the ``Settings`` page
2. click on the Webtop instance name, like ``webtop1``, a modal dialog will show the route details
3. copy the value from the ``URL`` field, like ``http://127.0.0.1:20033``
4. click on the :guilabel:`Create route` button
5. choose a ``Name`` for the root and select the ``Node`` where the WebTop instance is running
6. paste the value copied before (``http://127.0.0.1:20033``) inside the ``URL`` field
7. leave the ``Host`` field empty and enter ``/webtop`` inside the ``Path`` field
8. repeat steps from 4 to 7 for all other WebTop routes:

   * ``/Microsoft-Server-ActiveSync``
   * ``/.well-known``
   * ``/webtop-dav``

.. _config-excluded-migration:

Limitations
===========

The migration tool supports a limited set of applications. If an
application is installed but not listed on the migration tool page, it
will not be covered by the migration process.

The following configurations are not migrated:

- Custom templates

- Account provider password policy settings (see
  :ref:`migrate-account-provider`)

- System smart host settings, if the NS7 Email app is either not installed
  or not migrated

- The ``Accept unknown recipients`` setting of the mail server, which catches
  messages sent to non-existing addresses. See :ref:`email_domains` for details.

Additionally, shared folders will not be migrated if NS7 uses a remote
account provider.
