========
DokuWiki
========

`DokuWiki <https://www.dokuwiki.org>`_ is a simple and highly versatile open source Wiki.

You can install multiple DokuWiki instances on the same node from the :ref:`software_center-section`.

Configuration
=============

DokuWiki needs a dedicated virtual host, an FQDN like ``wiki.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the application configuration page and enter all required fields
2. enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs
3. click the :guilabel:`Save` button
4. use your browser to go to the selected FQDN, eg: ``https://wiki.nethserver.org``.

