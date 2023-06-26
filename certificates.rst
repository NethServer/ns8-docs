.. _certificate_manager-section:

================
TLS certificates
================

An SSL/TLS certificate is a digital object issued by a Certificate Authority (CA).
The certificate is used to verify the identity of a host and to establish encrypted communication channels.
Upon installation, NethServer 8 uses a default self-signed certificate for all TLS services, including the Web user interface.

Let's Encrypt certificates
==========================

NethServer 8 can request valid `Let's Encrypt <https://letsencrypt.org/>`_ certificates using `traefik <https://traefik.io/>`_.

Requesting Let's Encrypt is possible if the following requirements are met:

1. the server must be reachable from outside on port 80. Make sure your port 80
   is open to the public Internet (you can check with sites like `CSM <http://www.canyouseeme.org/>`_)
2. the domains that you want the certificate for must be public domain names
   associated to the server own public IP. Make sure you have public DNS names
   pointing to your server (you can check with sites like `VDNS <http://viewdns.info/>`_)

   Wildcard certificates (i.e. ``*.nethserver.org``) are not supported.

If the above requirements are met, you can obtain a valid certificate for a domain by following these steps:

- access the ``Settings`` page and click the ``TLS certificates`` card
- click on :guilabel:`Request certificate` button
- enter the node FQDN and select the node
- click on :guilabel:`Request certificate` button

The procedure will take a while, but the system will notify you when the certificate is ready.
The Let's Encrypt certificate is automatically renewed 30 days before expiration.


Custom certificates
===================

If you are already in possession of a certificate and its private key, you can upload them to the cluster.
You can follow this procedure to install the certificate:

- access ``Settings`` page and click the ``TLS Certificates`` card
- click on :guilabel:`Upload certificate`
- once the modal is open, select the Traefik instance where the certificate will be installed to
- upload the key file and the certificate file. They are checked on upload and if the key does not match the certificate, you receive an error
- once selected the files for the upload, click on :guilabel:`Upload`
-
You receive an error if something with the upload goes wrong, otherwise the modal closes itself and the certificate list is refreshed.
