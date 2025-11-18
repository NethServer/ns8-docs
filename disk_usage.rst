.. _disk-usage-section:

==========
Disk usage
==========

NethServer 8 uses Podman__ to manage OCI containers.

.. __: https://podman.io/

- Rootless applications require the most space. They put their data inside
  the user's home directory, for example
  ``/home/loki1/.local/share/containers/storage``, ``/home/loki1/.config``

- Rootful applications typically store data under
  ``/var/lib/containers/storage`` and ``/var/lib/nethserver`` directories

Inspect the default directories used by Podman with commands like: ::

  podman info -f json | jq -r '.store.graphRoot'
  podman info -f json | jq -r '.store.volumePath'

For rootless applications, prepend ``runagent -m <module_id>``, e.g.: ::

  runagent -m loki1 podman info -f json | jq -r '.store.graphRoot'
  runagent -m loki1 podman info -f json | jq -r '.store.volumePath'

To get a list of the applications running on the local node, run: ::

  runagent -l

Application data includes:

- Container images, like binary code, scripts, static configuration, and
  everything the app needs to run.
- API code, UI code, and the dynamic configuration they generate to
  integrate the application with the rest of the cluster.
- User's data like files, messages, pictures, organized in Podman *named
  volumes*.

It is always advisable to **plan in advance where user data is stored**.
To decide the disk where a named volume will reside before installing an
application refer to :ref:`named-volume-location`.

However, when NS8 runs multiple applications, disk usage increases
rapidly, and you may **run out of space**. If disk space runs low,
consider expanding the filesystem using the methods described in the
following sections.

Expand the filesystem with external tools
=========================================

As a general approach, to expand a filesystem, you have to grow the device
where it is mounted first.

Often, the device itself is contained by some other device, logical or
physical, like a logical volume or a disk partition. In this case, the
logical volume or disk partition has to be grown.

On a physical machine, the best option is to set up LVM during the
distribution installation. LVM helps with device management, and there are
plenty of how-to guides that explain how to achieve this goal.

On a virtual machine, you can easily expand the entire root disk and
filesystem. If you created the VM with the pre-built image, read the next
section for detailed commands.

Expand pre-built image filesystem
=================================

If NS8 was installed as a virtual machine starting from the
:ref:`pre-built image <install_image-section>` in QCOW2 format, follow
this procedure.

1. Shut down the node and resize its .qcow2 image from its host system.
   For example ::

    sudo qemu-img resize ns8-disk.qcow2 +50G

2. Start the node and grow its 5th partition (remove the --dry-run option,
   when you are confident): ::

    growpart --dry-run /dev/vda 5

3. Grow the root filesystem: ::

    xfs_growfs /

Attach a disk for new applications
==================================

At any time in the NS8 node's life, you can mount a new disk on an
alternative path, like ``/home1``, and start to install applications on
it. Existing rootless applications will continue to use their home
directory on the old disk, whilst new apps will be created under
``/home1`` and consume the new disk space.

1. Create the alternative base path: ::

    mkdir -m 0755 /home1

2. Mount the device on the new path: ::

    mount /dev/some /home1

   To persist the mount, edit `/etc/fstab` or create a systemd `.mount`
   unit. Verify that the device remains mounted after a reboot.

3. Configure the node agent to use `/home1` as the base directory for new
   applications: ::

    runagent -m node configure-home-basedir --set /home1

Migrate /home data to a new disk
================================

If the previous section is not applicable, consider adding a new disk and
migrating existing data with a Bash script included in the core:
``migrate-home-disk.sh``. This script illustrates the basic steps required
for data migration.

.. warning::

  The included script is just an example that may not fit your system. USE
  AT YOUR OWN RISK!

The script will:

* stop all rootless applications
* copy all rootless applications inside the new disk
* reclaim space from the root filesystem
* mount the new disk under ``/home``
* restart all rootless applications

Before running the script, make sure to attach the disk to the node,
format it, and mount it to a custom location like ``/mnt/temp_disk``.

Then launch the Bash script by passing the mount location as a parameter,
like: ::

  bash /var/lib/nethserver/node/migrate-home-disk.sh /mnt/temp_disk


.. _named-volume-location:

Assign named volume to an additional disk
=========================================

Applications organize user's data with Podman named volumes which normally
live under the default Podman paths (see above). This section explains how
to pre-configure named volumes to be created under alternative base paths
and disks.

.. note::

  Configure the named volume assignment *before* installing, restoring, or
  cloning the application.

For example, Samba File Server application will contain a large amount of
user's data and you want to offload them to a separate disk. This is a
typical scenario where the root disk space is dedicated to the operating
system, application images, and named volumes for fast random-access
databases. The separate disk, slower but larger than the root one, will
contain the bigger part of user's data.

Let's assume the disk is already mounted under ``/srv/disk0`` and
formatted with a ``xfs`` filesystem. The mount configuration is persistent
with a ``/etc/fstab`` entry and it survives after a system reboot.

Assumptions:

- Mount the disk under ``/mnt`` or ``/srv`` base paths. They are commonly
  used for this purpose.

- Format the disk with ``xfs`` or ``ext4`` filesystems. Their features and
  defaults match NS8 expectations.

- Set a filesystem label, (e.g. ``LABDISK0``) to easily recognize the disk.
  It may also ease ``/etc/fstab`` configuration.

- After a system reboot, an entry in ``/etc/fstab`` or a Systemd
  ``.mount`` unit correctly mounts the disk on ``/srv/disk0``.

- The disk is not mounted elsewhere. Multiple mount points for the same
  disk may lead to SELinux relabeling issues.

List available base paths
^^^^^^^^^^^^^^^^^^^^^^^^^

Disks mount points constitute the base directories where named volumes
will be placed with our custom configuration.

Obtain a list of base paths with this command ::

  volumectl list-base-paths
  /srv/disk0 (LABDISK0) size=2.0G available=1.9G used=46.5M

In this example ``LABDISK0`` is the label set after the filesystem
creation. It's a mnemonic label that helps to identify the disk.

Use the disk for Samba shares
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

From direct experience, or by reading ns8-samba documentation we know that
we can assign two named volumes:

- `shares`
- `homes`

The following commands will assign them to LABDISK0: ::

  volumectl add-volume shares --for samba --target /srv/disk0
  volumectl add-volume homes --for samba --target /srv/disk0

Check the assignments by printing ``/etc/nethserver/volumes.conf``:

  cat /etc/nethserver/volumes.conf

Next time Samba is installed on the local node its ``shares`` and
``homes`` volumes will be created under ``/mnt/disk0``. The same
configuration is applied also if Samba is installed by the restore and
clone procedures.
