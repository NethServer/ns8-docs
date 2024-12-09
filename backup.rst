.. _backup-restore-section:

==================
Backup and restore
==================

Access the ``Backup`` page to manage the backup and restore of individual
applications and global cluster configuration. If you have a single-node
cluster and want to restore it on a new NS8 node, see
:ref:`disaster_recovery-section`.

The first time you access the Backup page, you need to create a secret
password to encrypt the cluster configuration file.

Once the cluster backup password is set, the full Backup page is
displayed. It is divided into two main sections:

- **Cluster configuration**: Download the small cluster backup file and
  change its encryption password. See :ref:`cluster_backup-section` for
  more information.

- **Applications**: Define backup destinations, set automated backup
  schedules and retention rules, and restore individual applications.

.. _backup-destination:

Backup destination
==================

A backup destination is where the backup data of applications is saved.
Defining a destination is a prerequisite to schedule a backup or restore
an application.

Access the ``Backup`` page, click on the :guilabel:`Add destination`
button, and choose a provider. Supported providers are:

* `Backblaze B2`_
* `Amazon S3`_
* `Azure Blob Storage`_
* Generic S3, like :ref:`MinIO <minio-section>`
* Windows file share, through SMB2/3 protocols
* :ref:`Local storage <local-storage>`, attached to a node of the cluster

.. _`Backblaze B2`: https://www.backblaze.com/b2/cloud-storage.html
.. _`Azure Blob Storage`: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction
.. _`Amazon S3`: https://aws.amazon.com/s3/

Fill in the required fields for the chosen provider.

The backup procedure generates a two-level structure where application
instances are grouped by type at the first level, and by a UUID-named
folder at the second level. For example: ::

   dokuwiki/
   ├─ dd5b0b7c-579e-42ee-96a3-282d10958cda/
   ├─ b1497438-76d9-4aa1-b6fd-d8a4f827563e/
   ├─ fcf7b6e3-2424-442d-b625-ab90438c74db/
   mail/
   ├─ 92b8ee37-44dd-4f9f-9ee8-658e24556c55/
   loki/
   └─ 652ea526-b0dc-4bfb-a356-8a841b22bbd2/

Each UUID directory contains a Restic_ repository. All Restic repositories
under the same backup destination share the same encryption key. This key
can be automatically generated when the destination is created.

.. _Restic: https://restic.readthedocs.io

If adding a previously used destination (i.e., it has Restic directories
inside), you must fill the `Data encryption key` field under the
`Advanced` section with the previous key value, otherwise existing backups
cannot be opened.

Low-level access to Restic repositories can be performed using the
restic-wrapper_ command, as documented in the NS8 Developer's Manual.

.. _restic-wrapper: https://nethserver.github.io/ns8-core/core/backup_restore/#the-restic-wrapper-command

.. _local-storage:

Local storage
-------------

The ``Local storage`` destination allows storing backup data on locally
attached storage, like an external USB disk. Follow this procedure:

1. Format the disk with a supported filesystem, e.g., XFS: ::

      mkfs.xfs /dev/disk/by-id/some-disk-id

2. Create a Podman volume named ``backup00``: ::

      podman volume create \
            --label org.nethserver.role=backup \
            --opt=device=/dev/disk/by-id/some-disk-id \
            --opt=o=noatime \
            backup00

3. Configure the ``rclone-webdav.service`` unit to use that volume: ::

      echo BACKUP_VOLUME=backup00 > /var/lib/nethserver/node/state/rclone-webdav.env

4. Restart the service. The disk is mounted automatically: ::

      systemctl restart rclone-webdav.service

   .. note::

      The disk is unmounted when the ``rclone-webdav`` service is stopped.

5. Remove the default volume used by the service, as it is no longer
   needed. Existing content will be lost: ::

      podman volume rm rclone-webdav

Schedule application backup
===========================

To schedule the backup of existing applications:

* Click on the :guilabel:`Schedule backup` button.
* Select the application instances to be backed up.
* Choose one backup destination.
* Set the day, time, and retention policy for the backup.
* Enter a name for the backup schedule.
* Save the configuration by clicking the :guilabel:`Schedule backup`
  button.

To manually execute a backup, click the ``Run backup now`` item from the
three-dots menu of the scheduled backup.

To add more instances to an existing backup, click the ``Edit`` item from
the three-dots menu of the scheduled backup.

After the first backup run, the backup status is reported under ``Backup >
Schedules > See details``.

.. _application_restore-section:

Restore applications
====================

To restore an application, at least one backup destination must be
available.

* Click on the :guilabel:`Restore an app` button.
* A dialog box will list all applications in the defined backup
  destinations. Select the application you want to restore.
* If the selected application is already installed, a ``Replace existing
  app`` checkbox becomes visible. If enabled, the existing instance will
  be removed upon restore.
* Select an older backup snapshot if the latest one is not preferable.
* Select the target node.
* Click on the :guilabel:`Restore` button.

Selective content restore
=========================

Some applications allow you to search for and restore specific items from
a backup snapshot. For more information, refer to:

- Samba :ref:`share-selective-restore`, for files and directories within a
  Samba share.
- Mail :ref:`mailbox-selective-restore`, for public mailboxes and user
  mailbox folders.


.. _cluster_backup-section:

Cluster backup
==============

The cluster configuration backup contains all required data for
:ref:`disaster_recovery-section`, including destination configurations and
their data encryption keys, which are also necessary for restoring
individual application backups. It is a compressed JSON file encrypted
with GPG.

The first time the ``Backup`` page is accessed, you must set an encryption
password and store it in a safe place. A new encryption password is needed
after a new leader node is elected (see :ref:`node-promotion-section`).

The cluster configuration backup is automatically copied to backup
destinations during scheduled runs, ensuring up-to-date backups of both
your data and the cluster setup. If the cluster has an active
:ref:`subscription <subscription-section>` that includes cloud backup of
the cluster configuration, the cluster configuration backup is also
available from the subscription portal.

Periodically download the cluster configuration backup and keep it in a
safe place. Click on the :guilabel:`Download cluster backup` button under
the ``Cluster configuration`` section of the ``Backup`` page.

.. note::

   If you lose the cluster configuration backup, you can still restore
   applications to another cluster if you know the data encryption
   password of the backup destination.

To inspect the content of the downloaded file, use the following command,
replacing "SECRET" with your encryption password: ::

   echo 'SECRET' | gpg --batch --passphrase-fd 0 --decrypt backup.json.gz.gpg | gunzip | jq


.. _disaster_recovery-section:

Disaster recovery
=================

You can restore a previously configured cluster using the disaster
recovery procedure. You will need a :ref:`cluster configuration backup
<cluster_backup-section>`:

1. :ref:`Install <install-section>` a new cluster and log in using the
   default credentials.
2. Change the default administrator password.
3. Click on the :guilabel:`Restore cluster` button.
4. Choose whether to restore a cluster configuration from a remote HTTP
   server or upload the backup from your browser.
5. Enter the encryption secret in the ``Backup password`` field.
6. Select the applications to restore.

For more information, refer to the backup and restore notes for each
application. For example:

* :ref:`file-server-restore`
