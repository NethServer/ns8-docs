.. _webtop-section:

======
Webtop
======

WebTop is a full-featured groupware which implements ActiveSync, CalDAV and CardDAV protocols.

You can install multiple WebTop instances on the same node from the :ref:`software_center-section`.

Configuration
=============

WebTop needs a dedicated virtual host, a FQDN like ``webtop.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

.. warning::

   Please note that the mobile app **cannot connect to servers with self-signed certificates**!

How to configure:

1. access the application configuration page and enter a valid FQDN inside ``WebTop virtual host`` field
2. enable ``Request Let's Encrypt certificate``
3. bind the WebTop instance to an existing ``Mail server``
4. select the ``Default locale`` and the ``Default timezone``
4. click the :guilabel:`Save` button

Inside the ``Advanced`` section, you can also configure:

* the debug mode
* log levels
* minimum and maximum memory
