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

At the end of the application migration, the system will:

* start the module inside NethServer 8
* disable the application inside NethServer 7

If the migrated application was connected to a local account provider, the
application will still be able to access the provider running on NethServer 7
using the cluster VPN.

Account provider should always be migrated after all other applications.

.. note:: No custom template is migrated during the migration process.
