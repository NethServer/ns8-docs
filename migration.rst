.. _migration-section:

======================
NethServer 7 migration
======================

.. highlight:: bash

Migration is the process to convert a NethServer 7 machine (*source*) into a NethServer 8 (*destination*).

Before starting you will need:

* SSH and Cockpit access to the source NethServer 7 machine
* a new server containing a :ref:`freshly installed NethServer 8 cluster <install-section>`

Also make sure that

* if the source is connected to an external account provider,
  such account provider is reachable also from the destination
* you have access to your authoritative DNS server:
  you will need to change some DNS records after the migration of
  each application

The migration procedure will add the source machine as special node of NethServer 8 cluster.

First, you are going to install the migration tool on the source machine.
Access Cockpit on the source server and install "Migration to NS8" from the Software Center.

You can now open the just installed ``NS8 migration`` application.

Now, connect the NethServer 7 server to an existing new NethServer 8 cluster by entering the following fields:

- ``NS8 leader node``: the host name or IP address of NethServer 8 cluster leader node
- ``NS8 admin username`` and ``NS8 admin password``: administrator credentials for the leader node.

  As best practice, you can create a dedicated user from the :ref:`administrators-section` page and delete
  the user once the migration has been completed.
  Please note that the user must have 2FA disabled.
- uncheck the ``TLS validation`` option if the leader node does not have a valid TLS certificate

Then, click the :guilabel:`Connect` button.

The web interface will display the list of all applications installed inside NethServer 7.
Choose an application and click on the :guilabel:`Start migration` button.
In this phase the migration process will install the application into the NethServer 8 cluster
and start the first data synchronization.
If the NethServer 8 cluster is composed by 2 or more nodes, you will be asked to select a destination
node.

You can now click the :guilabel:`Sync data` button multiple time to keep in sync
the application data between NethServer 7 and NethServer 8.

When you're ready for the final migration, click the :guilabel:`Finish migration` button.
If the migrated application requires extra parameters, the system will display a dialog box
before proceeding.
Please note that most web application will need a dedicated FQDN (virtual host) after the migration.
Make sure the DNS record points to the NS8 node.
You can still configure :ref:`custom HTTP routes <migrated_routes-section>` for the migrated applications.

At the end of the application migration, the system will:

* start the module inside NethServer 8
* disable the application inside NethServer 7

If the migrated application was connected to a local account provider, the
application will still be able to access the provider running on NethServer 7
using the cluster VPN.

.. _migrate-account-provider:

Account provider
================

The NS7 account provider must be migrated after all other applications.

Samba DC
--------

Complete the DC migration by clicking the :guilabel:`Finish migration`
button. The procedure asks to select an IP address: it will become the IP of
the destination DC.

.. warning::

  Windows clients might not know how to reach the destination DC

* If DNS configuration of Windows clients is controlled by a DHCP server,
  set the destination DC IP address as the new DNS server.

* If Windows clients use an external DNS, it must be
  configured to forward the requests for the Active Directory DNS zone to
  the destination DC IP address.

* If Windows clients have a manual DNS configuration and use the source DC
  IP address as DNS and authentication server, consider to transfer the
  source DC IP address to the destination DC.

In the last case, transferring the IP avoids the reconfiguration of DNS
settings for each Windows client. This is generally preferable over an
external DNS server, if it blocks dynamic DNS update requests (DDNS).

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

      api-cli run module/samba1/set-ip-address --data '{"ipaddress":"192.168.1.123"}'

The NS8 Samba DC can be configured as external account provider
for NS7. Bear in mind that NS7 must be able to access the :ref:`IP address <active_directory-section>` the Samba account provider is bound to.
This configuration could be useful if you have modules still running on NS7 that require
access to the account provider.

OpenLDAP
--------

The OpenLDAP instance running in NS8 is currently not accessible as
external account provider for NS7 and other network devices.

.. _getmail_migration-section:

POP3 connector
==============

The migration involves transferring POP3 Connector settings to NS8 Imapsync module, together with Email application.
Configurations of accounts using the IMAP protocol are translated to working Imapsync tasks.
For accounts using POP3, it is necessary to review the settings and commence synchronization manually.

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

Configurations excluded from migration
======================================

The following configurations will not be migrated:

- custom templates
- SMTP mail relay rules

