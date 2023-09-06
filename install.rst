.. _install-section:

============
Installation
============

.. highlight:: bash

Installation methods
====================

You can install NethServer 8 :ref:`on a supported distribution <install_linux-section>` or use one of :ref:`pre-built images <install_image-section>`.
Both methods require a working Internet connection.

.. _install_linux-section:

Install on a supported distribution
-----------------------------------

Pick your preferred Linux distribution between :ref:`supported ones <supported-distros-section>` and
ensure that the system firewall is not blocking any connection.

First, make sure the system is up to date and ``curl`` is installed:

* for CentOS/AlmaLinux/RockyLinux: ``dnf update -y && dnf install -y curl``
* for Debian: ``apt-get update && apt-get upgrade -y && apt-get install -y curl``

Start the installation procedure as ``root``: ::

   curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash


.. _install_image-section:

Pre-built images
----------------

Download one of latest available images from the `release page <https://github.com/NethServer/ns8-core/releases>`_.

Select your preferred distribution flavor, download the image and start it inside your virtualization platform.
Choose a ``qcow2`` image if you are using a KVM-based platform like `Proxmox <https://www.proxmox.com/>`_
or a ``vmdk`` image if your using something like `VMware <https://www.vmware.com>`_.
You can also upload the image to a cloud provider and create a public virtual machine.

Default OS administrative credentials are

* Username: ``root``
* Password: ``Nethesis,1234``

Known bugs:

- Debian image could be currently used only for local virtualization platform
- When using RHEL-based images on Proxmox, change the default CPU model to anything other than ``kvm64``

.. _post-install-steps:

Post-installation steps
=======================

When the installation script ends or the pre-built image has started,
access the Web user interface at ::

    https://<server_ip_or_fqdn>/cluster-admin/

.. hint::

   If the node is unreachable see :ref:`os-network-section`

Use the default credentials to login:

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
