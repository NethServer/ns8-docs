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

   "QEMU/Proxmox", "qcow2", "1.7 |nbsp| GB", "https://distfeed.nethserver.org/ns8-images/ns8-rocky-linux-9-ns8-stable.qcow2"
   "VMWare", "vmdk", "3.0 |nbsp| GB", "https://distfeed.nethserver.org/ns8-images/ns8-rocky-linux-9-ns8-stable.vmdk"

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

When the installation script ends or the pre-built image has started,
access the Web user interface at ::

    https://<server_ip_or_fqdn>/cluster-admin/

.. hint::

   If the node is unreachable see :ref:`os-network-section`

The default credentials to login on cluster-admin are

* Username: ``admin``
* Password: ``Nethesis,1234``

Choose :guilabel:`Create cluster` and follow the procedure to create a new
single-node cluster.

For security reasons, the admin password must be changed immediately if it
is still at the default value.

Ensure the node Fully Qualified Domain Name (FQDN) is correct, and
respects the :ref:`DNS requirements <dns-reqs>`.

Even if running on a single node, the system will setup a Virtual Private
Network (VPN) for the cluster. With the VPN in place, you will be able to
add more nodes in the future. The proposed default values should be good
for most environments, anyway make sure ``VPN network (CIDR)`` does not
conflict with your existing network environment, because it cannot be
changed once it has been set.

Finally, click on :guilabel:`Create cluster` button. Your NS8 is now ready.

A new cluster has assigned the default name ``NethServer 8``. If you wish to
change it:

* go to the ``Settings`` page and click on the ``Cluster`` card
* enter a name inside the ``Cluster label`` field
* click the :guilabel:`Save settings` button

Now sure where to go from here?
You can install a :ref:`LDAP <openldap-section>` or :ref:`Active Directory <active_directory-section>` user domain,
read an introduction about :ref:`modules <modules-section>`,
take a look at :ref:`system logs <loki-section>`, add :ref:`new nodes <cluster-section>`, or setup a :ref:`metric dashboard <metrics-section>`.

Uninstall
=========

You can uninstall NS8 from your Linux distribution.

The uninstall command attempts to stop and erase core components and additional modules.
Handle it with care because it erases everything under ``/home`` and ``/var/lib/nethserver`` directories.

To uninstall NS8, execute: ::

  bash /var/lib/nethserver/node/uninstall.sh
