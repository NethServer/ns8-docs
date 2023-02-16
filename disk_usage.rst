==========
Disk usage
==========

.. highlight:: bash

NethServer 8 uses `podman <https://podman.io/>`_ to mance OCI containers.
When running multiple containers the disk usage will grow quite fast and you could quickly run out of space.

Rootless containers put their data inside the user home directory ``/home``.
So if you plan to run many services on the same host, consider to mount an extra disk or partition at ``/home`` path.

Rootfull containers usually save images and volumes inside the ``/var/lib/containers/storage`` directory.

To inspect podman storage configuration of your distribution, you can use the following command: ::

  podman info -f json | jq .store.graphRoot

There is another growning directory ``/var/lib/nethserver``: it contains the user interface and actions of rootfull modules.

Add more space
==============

If you’re running out of disk space, consider to expand the ``/home`` filesystem.

On a physical machine, the best option is to setup LVM during the distribution installation.
On the other hand, on a virtual machine you could easily expand the whole root filesystem.

If you can't do any of the above, consider adding a new disk and migrate existing data using below script.
The script will:

* stop all rootless containers
* copy all rootless containers inside the new disk
* reclaim space from the root filesystem
* mount the new disk under ``/home``
* restart all rootless containrs

Before running the script, make sure to attach the disk to the machine, format it and mount to a custom
location like ``/mnt/temp_disk``.
Then launch the script by passing the mount location as parameter, like: ::

  migrate /mnt/temp_disk

The ``migrate`` script: ::

  #!/bin/bash
  set -e
  mount_dir=$1
  if [ -z "$mount_dir" ]; then
    echo "Please provide the disk mount dir"
    exit 1
  fi
  if [ ! -d "$mount_dir" ]; then
    echo "Mount dir not found"
    exit 1
  fi
  if ! which rsync &>/dev/null; then
    echo "rsync not found, please install it before proceed"
    exit 1
  fi
  device=$(grep $(echo "$mount_dir" | sed 's/\/$//') /etc/mtab | awk '{print $1}')
  if [ -z "$device" ]; then
    echo "Device not found for $mount_dir"
    exit 1
  fi
  for userhome in /home/*[0-9]; do
    moduleid=$(basename $userhome)
    echo "Disabling rootless module ${moduleid}..."
    systemctl stop user@$(id -u $moduleid)
  done
  echo "Copying files..."
  rsync -avrX --delete-after /home/ $mount_dir/
  echo "Reclaim space..."
  for userhome in /home/*[0-9]; do
   rm -rf $userhome
  done
  echo "Remount disk to /home..."
  umount $device
  mount $device /home
  for userhome in /home/*[0-9]; do
    moduleid=$(basename $userhome)
    echo "Starting rootless module ${moduleid}..."
    systemctl start user@$(id -u $moduleid)
  done
  echo "Done"
  echo
  eval $(blkid $device -o export)
  echo "Add this line to fstab:"
  echo
  echo "UUID=$UUID /home $TYPE rw,errors=remount-ro 0 1"

