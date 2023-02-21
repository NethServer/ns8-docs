=====
MinIO
=====

`MinIO <https://min.io/>`_ offers high-performance, S3 compatible object storage.

You can install multiple MinIO instances on the same node from the :ref:`software_center-section`.

Configuration
=============

MinIO needs two dedicated virtual host, a FQDN like ``minio-api.nethserver.org`` and ``minio-ui.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have corresponding public DNS records.

How to configure:

1. access the application configuration page and enter the ``API server host name``:
   this will be the FQDN used by hosts to connect to S3 services
2. fill the ``Web interface host name``: you will be able to configure your
   MinIO instance from this FQDN
3. enable ``Let's Encrypt`` option accordingly to your needs
4. Click the :guilabel:`Save` button
5. open the entered host name inside the browser, eg: ``https://minio-ui.nethserver.org``.
