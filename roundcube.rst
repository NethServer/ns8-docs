.. _roundcube-section:

=========
Roundcube
=========

`Roundcube <https://roundcube.net/>`_  is a web mail client.
Roundcube's main features are:

* simple and fast
* built-in address book integrated with internal LDAP
* support for HTML messages
* shared folders support
* plugins

You can install multiple Roundcube instances on the same node from the :ref:`software_center-section`.

Configuration
=============

Roundcube needs a dedicated virtual host, a FQDN like ``webmail.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

.. warning::

   Please note that the mobile app **cannot connect to servers with self-signed certificates**!

How to configure:

1. access the application configuration page and enter a valid FQDN inside ``Roundcube hostname`` field
2. enable ``Request LE certificate`` and ``HTTP to HTTPS`` options accordingly to your needs
3. bind the Roundcube instance to an existing ``Mail server``
4. click the :guilabel:`Save` button

Inside the ``Advanced`` section, you can also configure a list of :ref:`roundcube_plugins-section`
and the ``Maximum size for attachments``.

.. _roundcube_plugins-section:

Plugins
=======

Roundcube supports many plugins that are already bundled within the installation.

The plugins that are enabled by default are:

* archive
* Zip download

Recommended plugins:

* New mail notifier
* Emoticons
* VCard support
* Manage sieve: manage filters for incoming mail
* Mark as junk: mark the selected messages as Junk and move them to the configured Junk folder

