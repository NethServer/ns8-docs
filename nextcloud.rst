.. _nextcloud-section: 

=========
Nextcloud
=========

`Nextcloud <http://nextcloud.com/>`_ provides universal access to your files via the web,
your computer or your mobile devices wherever you are. It also provides a platform to easily
view and synchronize your contacts, calendars and bookmarks across all your devices and enables
basic editing right on the web.

**Key features:**

* configure :index:`Nextcloud` with MariaDB and Redis cache
* integration with NethServer 8 :ref:`user-domains-section`
* automatic backup

You can install multiple Nextcloud instances on the same node from the :ref:`software-center-section`.

Configuration
=============

Nextcloud needs a dedicated virtual host, a FQDN like ``nextcloud.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

After the installation:

1. access the ``Settings`` page of the newly installed instance
2. enter a valid FQDN inside the ``Host name`` field
3. enable ``Let's Encrypt`` option accordingly to your needs
4. click the :guilabel:`Save` button

Then click on ``Configure Nextcloud`` to run the first configuration wizard.
The wizard will ask to setup an administrator user and password.
If during the wizard you are going to install recommended apps, please note that the built-in Collabora server (Nextcloud Office) will not work.
If you want to integrate with Collabora online see :ref:`below <collabora-integration-section>`.

After the wizard has been completed, return to the NethServer page and reload it.
You can now connect Nextcloud to an existing :ref:`user domain <user-domains-section>` by selecting the domain under the ``User domain`` field.
All users configured inside the domain will be able to access the Nextcloud installation.

.. note::   Nextcloud update/upgrade procedure may disables the apps to avoid incompatibility problems.
            Server logs keep track of which apps were disabled. After a successful update/upgrade procedure
            you can use the Applications page to update and re-enable the apps.

User list
---------

All users are listed inside the administrator panel of Nextcloud using a unique identifier containing letters and numbers.
This is because the system ensures that there are no duplicate internal user names as reported 
in section `Internal Username` of `Official Nextcloud documentation <https://docs.nextcloud.com>`_.


.. _collabora-integration-section:

Collabora Online
----------------

First, install and configure a :ref:`Collabora Online <collabora-section>` instance.

Then, access the ``Settings`` page of Nextcloud module. 

You will find an option named ``CODE server host name``.
Select one of the existing Collabora instances or enter a domain of another Collabora installation.

The Collabora instance will be accessed using HTTPS protocol, so remember to disable the ``Verify TLS certification`` option
if the Collabora does not have a valid TLS certificate.

Finally, click the :guilabel:`Save` button.
You will now be able to edit documents directly inside Nextcloud.
