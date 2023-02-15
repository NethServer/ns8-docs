.. _collabora-section:

================
Collabora Online
================

Collabora Online is a powerful LibreOffice-based online office that supports all
major document, spreadsheet and presentation file formats, which you can integrate
in your own infrastructure.
Please see the `official website <https://www.collaboraoffice.com/collabora-online/>`_.

You can install multiple Collabora Online instances on the same node from the :ref:`software-center-section`.

Configuration
=============

Collabora needs a dedicated virtual host, a FQDN like ``collabora.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the ``Settings`` page of the newly installed instance
2. enter a valid FQDN inside the ``Collabora FQDN`` field
3. enter a strong password the the ``admin`` user which can be used to access the admin console
4. enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs
5. click the :guilabel:`Save` button

You can access the admin console by accessing the ``Status`` page and clicking the ``Open console`` link.

To integrate Collabora with Nextcloud, see :ref:`collabora-integration-section`.
