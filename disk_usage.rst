==========
Disk usage
==========

NethServer 8 uses Podman__ to manage OCI containers.

.. __: https://podman.io/

- Rootless applications require the most space. They put their data inside
  the user's home directory, for example
  ``/home/loki1/.local/share/containers/storage``.

- Rootful applications typically store images and volumes in the
  ``/var/lib/containers/storage`` directory.

Inspect the default directories used by Podman with commands like: ::

  podman info -f json | jq -r '.store.graphRoot'
  podman info -f json | jq -r '.store.volumePath'

For rootless applications, prepend ``runagent -m <module_id>``, e.g.: ::

  runagent -m loki1 podman info -f json | jq -r '.store.graphRoot'
  runagent -m loki1 podman info -f json | jq -r '.store.volumePath'

To get a list of the applications running on the local node, run: ::

  runagent -l

There is another growing directory, ``/var/lib/nethserver``, that contains
the actions and state data of rootful modules, and core components like
the user interface code. Space requirements for this directory should be
minimal.

When NS8 runs multiple applications, disk usage increases rapidly, and you
may run out of space. If disk space runs low, consider expanding the
filesystem using the methods described in the following sections.

Expand the filesystem with external tools
-----------------------------------------

As a general approach, to expand a filesystem, you have to grow the device
where it is mounted first.

Often, the device itself is contained by some other device, logical or
physical, like a logical volume or a disk partition. In this case, the
logical volume or disk partition has to be grown.

On a physical machine, the best option is to set up LVM during the
distribution installation. LVM helps with device management, and there are
plenty of HOW-TOs that explain how to achieve this goal.

On a virtual machine, you can easily expand the entire root disk and
filesystem. If you created the VM with the pre-built image, read the next
section for detailed commands.

Expand pre-built image filesystem
---------------------------------

If NS8 was installed as a virtual machine starting from the
:ref:`pre-built image <install_image-section>` in QCOW2 format, follow
this procedure.

1. Shut down the node and resize its .qcow2 image from its host system.
   For example ::

    sudo qemu-img resize ns8-disk.qcow2 +50G

2. Start the node and grow its 5th partition (remove -N, dry-run flag,
   when you are confident): ::

    growpart -N /dev/vda 5

3. Grow the root filesystem: ::

    xfs_growfs /

Attach a disk for new applications
----------------------------------

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
--------------------------------

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
