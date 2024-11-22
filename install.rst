.. _install-section:

============
Installation
============


Installation methods
====================

You can install NethServer 8 :ref:`on a supported distribution <install_linux-section>` or use one of :ref:`pre-built images <install_image-section>`.
Both methods require a working Internet connection.

.. _install_linux-section:

Install on a supported distribution
-----------------------------------

Pick your preferred Linux distribution between :ref:`supported ones
<supported-distros-section>`.

Start the installation procedure as ``root``: ::

   curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash

If the ``curl`` command is not available try to install it with: ::

   apt install curl || dnf install curl

.. _install_image-section:

Pre-built image
---------------

.. |nbsp| unicode:: 0xA0
   :trim:

NethServer 8 provides an image built upon the stable foundation Rocky
Linux 9, making it suitable for a wide range of server applications.

The pre-built image uses Cloud-init for network initialization. The
default method to obtain network configuration is the DHCP protocol. Refer
to your virtualization platform documentation for more information about
Cloud-init support.

.. csv-table:: NS8 image download links
   :header: "Platform", "Format", "Size", "URL"

   "QEMU/Proxmox", "qcow2", "1.7 |nbsp| GB", "https://tinyurl.com/ns8-rocky-qcow2"
   "VMWare", "vmdk", "3.0 |nbsp| GB", "https://tinyurl.com/ns8-rocky-vmdk"

Choose the ``qcow2`` image format if you are using a KVM-based virtualization
platform, like `Proxmox <https://www.proxmox.com/>`_, or the ``vmdk`` format
if you are using something like `VMware <https://www.vmware.com>`_.

When the image download has completed verify the file integrity with the
`sha256 checksum file
<https://distfeed.nethserver.org/ns8-images/CHECKSUM>`_.  Download the
checksum then run for example the following command: ::

   sha256sum --ignore-missing -c CHECKSUM

Virtualization platform-specific notes:

- For VMWare, configure the virtual machine to use the IDE driver for the disk.
- For Proxmox, change the default CPU model to anything other than ``kvm64``.

Finally, start the NS8 image within your virtualization platform, or
upload it to a cloud provider to create a public virtual machine.

Default OS administrative credentials are

* Username: ``root``
* Password: ``Nethesis,1234``

Access the system console and log in using the default credentials. Upon
the first login, you will be prompted to change the password.

To obtain administrative SSH access to the system, create a personal user
account in the ``wheel`` group and set a password. For instance, execute
the following commands and enter the desired password: ::

  useradd -G wheel ethan.smith
  passwd ethan.smith

After logging in with the personal user account, gain root access by
executing: ::

  sudo su -

.. warning::

   If DHCP was used to obtain the initial network configuration, change
   the Rocky Linux network settings and configure a static IP address. For
   more information refer to :ref:`os-network-section`.

.. _post-install-steps:

Post-installation steps
=======================

When the installation script completes or the pre-built image has started,
access the Web user interface at: ::

    https://<server_ip_or_fqdn>/cluster-admin/

.. hint::

   If the node is unreachable, refer to :ref:`os-network-section`.

The default credentials for logging in to the cluster-admin interface are:

* Username: ``admin``
* Password: ``Nethesis,1234``

Choose :guilabel:`Create cluster` and follow the procedure to set up a new
single-node cluster. Alternatively, you can join the node to an existing
cluster as described in :ref:`cluster-section`, or restore a cluster
backup as detailed in :ref:`disaster_recovery-section`.

For security reasons, change the admin password immediately if it is still
set to the default value.

Ensure the node's Fully Qualified Domain Name (FQDN) is correct and meets
the :ref:`DNS requirements <dns-reqs>`.

Even if running on a single node, the system will set up a Virtual Private
Network (VPN) for the cluster. This VPN setup will allow you to add more
nodes in the future. The proposed default values should be suitable for most
environments, as it theoretically accommodates up to 254 cluster nodes.
However, ensure that the ``VPN network (CIDR)`` does not conflict with your
existing network environment, as it cannot be changed once set.

Finally, click the :guilabel:`Create cluster` button. Your NS8 is now
ready.

By default, the new cluster is named ``NethServer 8``. If you wish to
change it:

* Go to the ``Settings`` page and click on the ``Cluster`` card.
* Enter a new name in the ``Cluster label`` field.
* Click the :guilabel:`Save settings` button.

Not sure where to go from here? You can:

* Install an :ref:`LDAP <openldap-section>` or :ref:`Active Directory
  <active_directory-section>` user domain.
* Read an introduction about :ref:`NS8 applications <modules-section>`.
* Take a look at :ref:`system logs <loki-section>`.
* Add :ref:`new nodes <cluster-section>`.
* Set up a :ref:`metric dashboard <metrics-section>`.

Uninstall
=========

You can uninstall NS8 from your Linux distribution.

The uninstall command attempts to stop and erase core components and additional modules.
Handle it with care because it erases everything under ``/home`` and ``/var/lib/nethserver`` directories.

To uninstall NS8, execute: ::

  bash /var/lib/nethserver/node/uninstall.sh
