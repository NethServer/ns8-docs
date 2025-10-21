.. _install-section:

============
Installation
============

First, ensure that the :ref:`System requirements
<system-requirements-section>` are met.

You can install NethServer 8 on a supported distribution or use a
pre-built image. Both methods require an active Internet connection.

.. _install_linux-section:

Install on a supported distribution
===================================

Pick your preferred Linux distribution between :ref:`supported ones
<supported-distros-section>`.

Start the installation procedure as ``root``: ::

   curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash

If the ``curl`` command is not available try to install it with: ::

   apt install curl || dnf install curl

.. _install_image-section:

Pre-built image
===============

.. |nbsp| unicode:: 0xA0
   :trim:

The pre-built image is based on Rocky Linux 9 and comes preconfigured with
the packages and NS8 core components installed by the standard
installation procedure. It uses Cloud-init for network initialization.
Refer to your virtualization platform documentation for more information
about Cloud-init support.

.. csv-table:: NS8 image download links
   :header: "Platform", "Format", "Size", "URL"

   "Proxmox_ (QEMU)", "qcow2", "1.4 |nbsp| GB", "https://tinyurl.com/ns8-rocky-qcow2"
   "VMWare_ ESXi 8+", "vmdk",  "2.8 |nbsp| GB", "https://tinyurl.com/ns8-rocky-vmdk"

.. _Proxmox: https://www.proxmox.com
.. _VMWare: https://www.vmware.com

If your platform is not in the above list the prebuilt image cannot be
used. Please refer to :ref:`install_linux-section`.

When the image download has completed verify the file integrity with the
`sha256 checksum file
<https://distfeed.nethserver.org/ns8-images/CHECKSUM>`_.  Download the
checksum then run for example the following command: ::

   sha256sum --ignore-missing -c CHECKSUM

Virtualization platform-specific notes:

- For VMWare ESXi 8+, add a hard disk with existing image and select *IDE
  controller 1 (Master)*.

- On Proxmox, for maximum performance, select ``host`` as the CPU type. Avoid "kvm64", because Rocky Linux image does not support it.  Refer to `Proxmox documentation`_ for further details about CPU selection.

.. _Proxmox documentation: https://pve.proxmox.com/pve-docs/chapter-qm.html#qm_cpu

Finally, start the NS8 image within your virtualization platform. If
Cloud-init does not find a network configuration, it attempts to obtain
one via DHCP. After a few seconds, the system console displays a login
prompt showing the assigned IP address.

Default OS administrative credentials are

* Username: ``root``
* Password: ``Nethesis,1234``

Log in using the default credentials. On the first login, you will be
prompted to change the root password.

SSH access is disabled for root. To obtain administrative SSH access,
create a personal user account in the ``wheel`` group and set a password.
For example, run the following commands and enter the desired password: ::

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
