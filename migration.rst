======================
NethServer 7 migration
======================

.. highlight:: bash

.. warning:: This is an ALPHA release, do not use it on production!

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
Access the source server using SSH as root user, then execute: ::

  yum --enablerepo=nethserver-testing install -y nethserver-ns8-migration

You can now open the just installed ``NS8 migration`` application from Cockpit.

Now, connect the NethServer 7 server to an existing new NethServer 8 cluster by entering the following fields:

- ``NS8 leader node``: the host name or IP address of NethServer 8 cluster leader node
- ``NS8 admin username`` and ``NS8 admin password``: administrator credentials for the leader node
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
You can still configure :ref:`manual routes <migrated_routes-section>` for the migrated applications.

At the end of the application migration, the system will:

* start the module inside NethServer 8
* disable the application inside NethServer 7

If the migrated application was connected to a local account provider, the
application will still be able to access the provider running on NethServer 7
using the cluster VPN.

Account provider should always be migrated after all other applications.

.. note:: No custom template is migrated during the migration process.

.. _migrated_routes-section:

Manual routes
=============

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

