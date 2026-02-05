.. _software_center-section:

===============
Software center
===============

The Software Center page displays and manages applications available from
all configured repositories.

Application information
=======================

Each application is represented by a card displaying its name, level of
certification, and category. Click on the application's name to view
detailed information such as screenshots, author, latest version,
container images, and links to documentation, source code, and bug
tracker.

Some applications may include additional Terms and Conditions; if present,
read them carefully.

.. hint::

  For detailed information about the installed core components refer to
  :ref:`core_updates-section`.

.. _certification-levels:

Levels of certification
=======================

Applications are certified at the following levels:

- **Level 1/5**: The application is hosted by a custom repository (or it
  is not part of any repository) and is not certified.
- **Level 2/5**: The application is hosted by the ``nethforge`` repository
  and certified by the NethServer community.
- **Level 3/5**: The application is hosted by the ``default`` or
  ``subscription`` repositories and is certified by Nethesis.
- **Level 4/5**: The application is developed and maintained by Nethesis
  developers.
- **Level 5/5**: The application is developed and maintained by Nethesis
  developers and is covered by Nethesis support.

Certification levels are determined based on the following factors:

1. **Repository**: To be listed in a public repository, an application
   must undergo a review process. Being listed in a public repository
   establishes the base certification level of the application.
2. **Origin**: The container image registry hosting the application
   identifies the person or organization distributing it. Currently, the
   recognized registries are ``ghcr.io/nethserver`` and
   ``ghcr.io/nethesis``.
3. **Support**: If the cluster has an active subscription and paid support
   is available for the application (whether included in the current
   subscription plan or not). See :ref:`subscription-section` for more
   information.

.. _install-applications:

Install applications
====================

To install a new application, click the :guilabel:`Install` button of the
application card.

- If your cluster has multiple nodes, you will also need to select the
  target node.

- Some applications -- like Samba, Nextcloud, and Mail -- may require
  large disk space and support additional volume selection, if the target
  node provides one, as explained in section
  :ref:`additional-volumes-section`.

  The volume selector displays the volume mount directory, the filesystem
  label and space usage.

To install more applications of the same type, click on the
``Instances`` link within the application's card. Then, select
:guilabel:`Install new instance`. Note that in some cases, installation on
certain cluster nodes may be restricted due to application policies or
node resource limitations.


.. _additional-volumes-section:

Configure additional volumes
----------------------------

Applications that host large amount of data may not fit the *default
volume* where the node's root filesystem usually resides.

When NS8 is installing an application that has such special data
requirements on a node that provides one or more additional volumes the
system administrator can decide which one to use, or choose the default
volume.

The additional volume must be configured before the application is
installed.

.. warning::

  The additional volume setup procedure may lead to data-loss. It requires
  some Linux command line experience, hence it is highly recommended to
  test this procedure on a non-production system.

When configuring an additional volume on a NS8 node, observe the following
check list:

- Make sure the volume is not already mounted elsewhere. Multiple mount
  points for the same disk may lead to SELinux relabeling issues. The
  following command briefly lists existing mountpoints: ::

     findmnt --real

- If the volume does not exist yet, format it with ``xfs`` or ``ext4``
  filesystems. Their features and defaults match NS8 expectations.

  Use ``lsblk`` to list the block devices (disks or partitions) available
  on the node, and the ``mkfs`` command to create a new file system on one
  of them. Be careful, formatting the wrong device will destroy your data.

- Set a filesystem label (e.g. ``LABDISK0``) to easily recognize the
  volume. It may also simplify the ``/etc/fstab`` or Systemd ``.mount``
  unit configuration. Related commands are ``xfs_admin``, ``e2label``,
  ``tune2fs``.

- Mount the volume under ``/mnt`` or ``/srv`` base paths. They are
  commonly used for this purpose. For example, create a mountpoint
  directory and mount the volume on it ::

      mkdir /srv/disk0
      mount /dev/disk/by-label/LABDISK0 /srv/disk0

- Make sure the volume is mounted automatically at boot time.
  Append a ``/etc/fstab`` entry for the mounted volume ::

    findmnt -no SOURCE,TARGET,FSTYPE,OPTIONS /srv/disk0 >> /etc/fstab

  A reboot test is then highly recommended.

The NS8 cluster leader node, where Software center runs, needs a few
minutes to record the configuration change and present the additional
volume selection next time an application that supports it is installed.

For advanced use cases, where an application do not enable the automatic
volume selection, it is still possible to assign an arbitrary volume
following :ref:`named-volume-redirection`.

.. _application-instances:

Installed applications
======================

Once an application has been installed, click on the
``Instances`` link within the application's card. You can perform various
actions on each instance by clicking on its three-dots menu:

- ``Update to testing version``: This action is visible only when a
  testing version is available. Carefully review the
  pre-release documentation or consult the app developer before
  proceeding.
- ``Add to favorites``: Pin the application at the top of the
  **application drawer**.
- ``Edit instance label``: Add a custom name to the instance.
- ``Clone``: Clone the application. See :ref:`move_clone-section`.
- ``Move``: Move the application to another node. See
  :ref:`move_clone-section`.
- ``Restart instance``: stop all application components and start them
  again, similar to a system reboot but limited to the application.
- ``Uninstall``: Remove the application and all related data.

The :ref:`Applications page <applications-section>` is an alternative and
comprehensive place where the applications installed in the cluster can be
managed.

.. |bento| image:: _static/bento.png
           :alt: application drawer

Installed applications are also listed in the **application drawer**, by
clicking on the |bento| menu in the top-right corner of the screen.

.. _software_repositories-section:

Software repositories
=====================

An NS8 software repository is an index of applications and a collection of
their metadata.

You can access the list of configured repositories in several ways:

* In the ``Settings`` page: click the ``Software repositories`` card.
* In the ``Software Center`` page: click the ``Software repositories``
  item in the three-dots menu at the top-right corner.

NS8 includes a default set of software repositories, some enabled and
others disabled:

- ``default``: Contains applications developed and maintained mainly by
  NethServer developers. It also tracks updates for NS8 core modules and
  the core itself.
- ``nethforge``: A repository of applications built and maintained by the
  NethServer community. It is initially disabled.
- ``subscription``: Added and enabled when the cluster has an active
  subscription. It overrides the contents of the ``default`` repository
  with an update schedule managed by Nethesis. See
  :ref:`subscription-section` for details.

To add a custom repository, click on the :guilabel:`Add repository` button
and fill in the required fields:

- ``Name``: A unique name for the repository.
- ``URL``: The public URL of the repository. It must be a valid `NS8
  repository <https://nethserver.github.io/ns8-core/modules/metadata/>`_.
- ``Status``: Check this option to enable the repository.

Note that if the same application is listed in multiple repositories, the
one from the repository with the higher priority will be considered.
Repository priority is determined by the alphabetical order of the
repository names, with those later in the alphabet (e.g., "Z") having
higher priority than those earlier (e.g., "A").

You can refresh the metadata by clicking on the :guilabel:`Reload
repositories` button.


.. _updates-section:

Updates
=======

If the enabled repositories contain an update for an installed application
instance or any core component, a warning message is displayed at the top
of the Software center page. You can see if there are any available
updates also by accessing the ``Cluster status`` page.

NethServer 8 can handle two different types of updates:

* :ref:`core_updates-section`
* :ref:`module_updates-section`

:ref:`Operating system updates <os_updates-section>` are demanded to the
underlying Linux distribution.

If you have an active subscription, available updates are applied
automatically as described in :ref:`scheduled-updates`.

.. _core_updates-section:

Core updates
------------

NS8 consists of the core and several modules. Each core component has
its own version number, and the Software Center will display a warning
when an update is available.

- *Core* contains the web user interface, the API server, the agents
  that manage the containers and backup engines.
- *LDAP proxy* is a proxy server for LDAP TCP connections that handles all
  connections from applications to :ref:`User domain providers
  <user-domains-section>`.
- :ref:`Loki log server <loki-section>`
- :ref:`Traefik proxy <traefik-section>`
- :ref:`Samba Active Directory <active_directory-section>`
- :ref:`OpenLDAP <openldap-section>`

You can review the components currently installed in the cluster at any
time. To do this, click on the three-dots menu in the top-right corner of
the ``Software Center`` page, then select the ``Core apps`` option.
Click on :guilabel:`Update core` button to apply the updates.

Core module updates are always applied altogether to avoid version
mismatches.

.. _module_updates-section:

.. _application-updates:

Application updates
-------------------

The list of available updates is listed inside the ``Updates`` tab of
:ref:`software_center-section`. The software center displays a card for
each application with available updates.

You can apply all application updates by clicking the :guilabel:`Update all
apps` button.

By clicking the :guilabel:`Review and update` button on the application card, you will
see all module instances that require an update. You can update each
instance separately by clicking on the :guilabel:`Update` button. If you
prefer to update all instances of the same module, just click
:guilabel:`Update all instances` button.
