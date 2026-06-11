---
title: Backup and restore
sidebar_position: 5
---
# Backup and restore

The `Backup and restore` page manages **backup destinations** and **schedules**, and allows the download of the cluster backup, a small GPG-encrypted file containing cluster-wide configurations, like the backup destination settings, necessary to quickly restore applications. If you have a single-node cluster and want to restore it on a new NS8 node, see [Disaster recovery](#disaster_recovery-section).

The first time you access the `Backup and restore` page, you need to create a secret password to encrypt the cluster backup file.

Once the cluster backup password is set, the full `Backup and restore` page is displayed. It is divided into:

- **Download cluster backup**: Download the small cluster backup file and change its encryption password. See [Cluster backup](#cluster_backup-section) for more information.
- **Backup destinations**: decide where backup data can be sent, for example a remote S3 hosting service or a local SMB share. The destinations embed access secrets and an end-to-end backup encryption key.
- **Scheduled backups**: plan the backup runs at specific times, the retention policy, and what applications are included.

Finally, under the `Restore` tab, it is possible to start the restore of individual applications. See [Restore applications](#application_restore-section).

The next sections illustrate each function in detail.

## Backup destination {#backup-destination}

A backup destination is where the backup data of applications is saved. Defining a destination is a prerequisite to schedule a backup or restore an application.

Access the `Backup and restore` page, click on the **Add
destination** button, and choose a provider. Supported providers are:

- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
- [Amazon S3](https://aws.amazon.com/s3/)
- [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
- Generic S3, like [RustFS](../applications/rustfs.md)
- Windows file share, through SMB2/3 protocols
- [Local storage](#local-storage), attached to a node of the cluster

Fill in the required fields for the chosen provider.

If adding a previously used destination (i.e., it already has data inside), you must fill the `Data encryption key` field under the `Advanced` section, otherwise existing backups cannot be opened. For new destinations leave the field empty to generate a random key.

The backup procedure generates a two-level structure where application instances are grouped by type at the first level, and by a UUID-named folder at the second level. For example:

    dokuwiki/
    ├─ dd5b0b7c-579e-42ee-96a3-282d10958cda/
    ├─ b1497438-76d9-4aa1-b6fd-d8a4f827563e/
    ├─ fcf7b6e3-2424-442d-b625-ab90438c74db/
    mail/
    ├─ 92b8ee37-44dd-4f9f-9ee8-658e24556c55/
    loki/
    └─ 652ea526-b0dc-4bfb-a356-8a841b22bbd2/

Each UUID directory contains a [Restic](https://restic.readthedocs.io) repository. All Restic repositories under the same backup destination share the same data encryption key.

Low-level access to Restic repositories can be performed using the [restic-wrapper](https://nethserver.github.io/ns8-core/core/backup_restore/#the-restic-wrapper-command) command, as documented in the NS8 Developer's Manual.

### Local storage {#local-storage}

The `Local storage` destination allows storing backup data on locally attached storage, like an external USB disk. Follow this procedure:

1.  Format the disk with a supported filesystem, e.g., XFS:

        mkfs.xfs /dev/disk/by-id/some-disk-id

2.  Create a Podman volume named `backup00`:

        podman volume create \
              --label org.nethserver.role=backup \
              --opt=device=/dev/disk/by-id/some-disk-id \
              --opt=o=noatime \
              backup00

3.  Configure the `rclone-webdav.service` unit to use that volume:

        echo BACKUP_VOLUME=backup00 > /var/lib/nethserver/node/state/rclone-webdav.env

4.  Restart the service. The disk is mounted automatically:

        systemctl restart rclone-webdav.service

    > [!NOTE]
    > The disk is unmounted when the `rclone-webdav` service is stopped.

5.  Remove the default volume used by the service, as it is no longer needed. Existing content will be lost:

        podman volume rm rclone-webdav

## Schedule application backup

To schedule the backup of installed applications:

- Click on the **Schedule backup** button.
- Select the applications to include.
- Choose one backup destination.
- Set the day, time, and retention policy for the backup.
- Enter a name for the backup schedule.
- Save the configuration by clicking the **Schedule backup** button.

To manually execute a backup, click the `Run backup now` item from the three-dots menu of the scheduled backup.

To change which applications are included in an existing backup, click the `Edit` item from the three-dots menu of the scheduled backup.

After the first backup run, the backup status is reported under `Backup > Schedules > See details`.

## Restore applications {#application_restore-section}

To restore an application, at least one backup destination must be available.

If no destinations are present and you have an encrypted cluster backup file, go to the `Backup and restore` page and click **Import
destinations** to quickly restore them.

Once destinations are defined, click the `Restore` tab and follow this procedure:

- Click on the **Restore application** button.
- A dialog box lists all applications found in the configured backup destinations. Select the application you want to restore.
- If the selected application is already installed, a `Replace existing app` checkbox becomes visible. When enabled, the existing application will be removed automatically at the end of the restore procedure.
- Select the backup snapshot from the list.
- Select the restore target node. Note that in some cases, restoring to certain cluster nodes may be restricted due to application policies or node resource limitations.
- Click on the **Restore** button.

Note that TLS certificates obtained from Let's Encrypt are not part of the backup and are not restored with the application: they must be requested again from the application settings page after restore.

Some core applications have special behavior during restore:

- **Traefik** restores only uploaded certificates and user-defined HTTP routes. Refer to [Upload custom TLS certificates](certificates.md#custom-certificates-section) and [Create a custom HTTP route](proxy.md#custom-http-route-section).
- **Loki** restore installs an additional *inactive* Loki instance. It can be used only for log searches, as explained in [System logs](log_server.md).
- **Samba** restore behavior depends on whether the AD user domain is already present in the cluster. If present, only shared folder data is restored. If not present, the DC LDAP database is restored as well. See [Restore file server from backup](../applications/file_server.md#file-server-restore) for more information.

## Selective content restore {#selective-content-restore}

Some applications allow you to search for and restore specific items from a backup snapshot. For more information, refer to:

- Samba [Restore a single file or folder from a shared folder backup](../applications/file_server.md#share-selective-restore), for files and directories within a Samba share.
- Mail [Restore a mailbox folder from a backup](../applications/mail.md#mailbox-selective-restore), for public mailboxes and user mailbox folders.

## Cluster backup {#cluster_backup-section}

The cluster backup contains all required data for [Disaster recovery](#disaster_recovery-section), including destination configurations and their data encryption keys, which are also necessary for restoring individual application backups. It is a compressed JSON file encrypted with GPG.

The first time the `Backup and restore` page is accessed, you must set an encryption password and store it in a safe place. A new encryption password is needed after a new leader node is elected (see [Promote a node to leader](cluster.md#node-promotion-section)).

The cluster backup is automatically copied to backup destinations during scheduled runs, ensuring up-to-date backups of both your data and the cluster setup. If the cluster has an active [subscription](../about/subscription.md) that includes cloud backup of the cluster configuration, the cluster backup is also available from the subscription portal.

Periodically download the cluster backup and keep it in a safe place. Click on the **Download cluster backup** button of the `Backup and restore` page.

:::note

If you lose the cluster backup, you can still restore applications to another cluster only if you know the data encryption password of the backup destination.

:::

To inspect the content of the downloaded file, use the following command, replacing "SECRET" with your encryption password:

    echo 'SECRET' | gpg --batch --passphrase-fd 0 --decrypt backup.json.gz.gpg | gunzip | jq

## Disaster recovery {#disaster_recovery-section}

The disaster recovery procedure is designed for the restoration of a **single-node cluster**. You just need the original [cluster backup](#cluster_backup-section) file.

0.  Make sure the new system has enough free disk space. The restore procedure does not check the free disk space.
1.  [Install](../installation/install.md) a new cluster and log in using the default credentials.
2.  Change the default administrator password.
3.  Click on the **Restore cluster** button.
4.  Choose whether to restore a cluster configuration from a remote HTTP server or upload the backup from your browser.
5.  Enter the encryption secret in the `Backup password` field.
6.  Select the applications to restore.

For more information, refer to the backup and restore notes for each application. For example:

- [Restore file server from backup](../applications/file_server.md#file-server-restore)
