==================
Backup and restore
==================

The full cluster backup is composed by configuration and applications data.
Access the ``Backup`` page to manage the backup and restore.

Backup repository
=================

First, you will need to configure a backup repository where the data will be saved.
A backup repository keeps all backup data encrypted using `restic <https://restic.readthedocs.io>`_ engine.

Access the ``Backup`` page, click on :guilabel:`Add repository` button and choose a provider.
Currently supported providers are:

* `Backblaze B2 <https://www.backblaze.com/b2/cloud-storage.html>`_
* `Amazon S3 <https://aws.amazon.com/it/s3/>`_

Fill in the required fields depending on the chosen provider.

A new encryption key will be automatically created for new repositories.
If you are accessing a repository which already contains a NS8 backup, remember also to enter
the ``Repository password`` under the ``Advanced`` section.

Application backup
==================

Once at least one repository has been configured, you can schedule the backup of existing applications:

* click on :guilabel:`Schedule backup` button
* select which application instances should be added to the backup
* choose one backup repository
* setup day and time of the backup and the retention policy
* enter a name of the backup
* save the configuration by clicking the :guilabel:`Schedule backup` button

Whenever you want to manually execute the backup, click the ``Run backup now`` item from the three-dots menu of the scheduled backup.

To add more instances to an existing backup, click the ``Edit`` item from the three-dots menu of the scheduled backup.

.. _application_restore-section:

Application restore
===================

You can restore an application only if there is at least one repository configured:

* click on the :guilabel:`Restore an app` button.
* a dialog box will list all applications inside the existing backup, select the application you want to restore
* as default the restore procedure will create a new instance, if you want to replace the existing one select the ``Replace existing app`` option
* select the target node
* click on the :guilabel:`Restore` button

.. _cluster_backup-section:

Cluster backup
==============

The cluster configuration backup contains all required data to execute a :ref:`disaster_recovery-section`.
It is a compressed JSON file encrypted with GPG.

The first time ``Backup`` page is accessed an encryption password must be
set and stored in a safe place. A new encryption password is needed also
after a new leader node is elected (see :ref:`node-promotion-section`).

To download the cluster configuration backup, click on :guilabel:`Download cluster backup` button under
the ``Cluster configuration`` section of the ``Backup`` page.

Please, download the cluster configuration backup and keep it on a safe place.

.. note:: 
   In case you lose the configuration backup, you can still restore applications to another cluster only if you know the
   encryption password of the backup repository.

.. highlight:: bash

To inspect the content of the backup use the following command, where ``<pass>`` is the encryption password
entered before the download: ::

   echo <pass> | gpg --batch --passphrase-fd 0 --decrypt backup.json.gz.gpg | gunzip | jq

.. _disaster_recovery-section:

Disaster recovery
=================

You can restore a previously configured cluster using the disaster recovery procedure.
To follow this procedure you will need a :ref:`a cluster configuration backup <cluster_backup-section>`:

1. :ref:`install <install-section>` a new cluster and login using default credentials
2. change the default administrator password
3. click on :guilabel:`Restore cluster`
4. you can now choose whether to restore a cluster configuration hosted on a remote HTTP server or upload the backup
   from your browser
5. if on step 2 you entered the same password of the old cluster, the system will automatically decrypt the configuration backup;
   otherwise enter the encryption secret inside the ``Backup password`` field
6. select the applications to restore
