.. _n8n-section:

===
n8n
===

`n8n <https://n8n.io/>`_ is a flexible AI workflow automation for technical teams.
It allows you to build flexible workflows focused on deep data integration.

Configuration
=============

n8n needs a dedicated virtual host, an FQDN like ``n8n.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the application configuration page and enter all required fields
2. enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs
3. click the :guilabel:`Save` button
4. use your browser to go to the selected FQDN, eg: ``https://n8n.nethserver.org``
5. create the n8n admin account
