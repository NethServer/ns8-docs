.. _rustfs-section:

======
RustFS
======

`RustFS <https://rustfs.com/>`_ offers high-performance, S3 compatible object storage.

You can install multiple RustFS instances on the same node from the :ref:`software_center-section`.

Configuration
=============

Some S3 clients do not correctly support API endpoints exposed under a path prefix. For better compatibility, 
two distinct server names need to be assigned: one dedicated to the S3 protocol endpoint and another dedicated to the administrative console.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have corresponding public DNS records.

How to configure:

1. access the application configuration page and enter the ``API server host name``:
   this will be the FQDN used by hosts to connect to S3 services
2. fill the ``Web interface host name``: you will be able to configure your
   RustFS instance from this FQDN
3. enable ``Let's Encrypt`` option accordingly to your needs
4. fill the ``rustfs root user name`` and the ``rustfs root password``: those are the login credentials
5. click the :guilabel:`Save` button
6. open the entered host name inside the browser, eg: ``https://rustfs-ui.nethserver.org``.
