.. _minio-section:

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
4. click the :guilabel:`Save` button
5. open the entered host name inside the browser, eg: ``https://minio-ui.nethserver.org``.

Configure local disks
=====================

Setting up MinIO with a locally attached USB/SCSI disk provides two key benefits:

1. data privacy: if you're cautious about sharing data with cloud providers, this setup allows you to retain control over your information and prevent third-party access
2. local data ownership: by utilizing a local disk, you maintain complete data control within your own environment.
   This improves security and minimizes dependence on external services

Instructions
------------

As system root user, follow these steps for a disk named ``scsi-disk1``:

1. **Create a mount point:**
   make a directory to serve as the mount point for the disk::

   mkdir -p /mnt/data

2. **Automate mount at boot:**
   ensure the disk is automatically mounted during boot by modifying ``/etc/fstab``::

   echo '/dev/disk/by-id/scsi-disk1 /mnt/data ext4 defaults,nofail,discard 0 0' >> /etc/fstab
   systemctl daemon-reload

3. **Mount the disk:**
   physically attach the disk using the mount command::

   mount /mnt/data

4. **Ensure MinIO access:**
   allow the MinIO instance (e.g., ``minio1``) to access the disk::

   chown minio1:minio1 /mnt/data/

Finally, within the module's user interface, configure the ``Storage path`` to be `/mnt/data`.
Pleaste note that the above path won't be part of the backup.
