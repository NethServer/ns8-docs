.. _install-section:

============
Installation
============

.. highlight:: bash

You can install NethServer 8 starting :ref:`from a scratch <install_linux-section>` or use one of :ref:`pre-built images <install_image-section>`.
Both methods require a working Internet connection.

.. _install_linux-section:

Install from scratch
====================

Pick your preferred distribution between :ref:`supported ones <supported-distros-section>` and
ensure that the system firewall is not blocking any connection.

First, make sure the system is up to date and ``curl`` is installed:

* for CentOS/AlmaLinux/RockyLinux: ``dnf update -y && dnf install -y curl``
* for Debian: ``apt-get update && apt-get upgrade -y && apt-get install -y curl``

Start the installation procedure as ``root``: ::

   curl https://raw.githubusercontent.com/NethServer/ns8-core/main/core/install.sh | bash

When the installation script ends, access the Web user interface at **https://\<server_ip_or_fqdn\>/cluster-admin/**.

First, you will need to login using the default credentials:

* Username: ``admin``
* Password: ``Nethesis,1234``

Then, choose :guilabel:`Create cluster` to create a new single-node cluster and setup a new administrator password.

Even if running on a single node, the system will setup a Virtual Private Network (VPN) for the cluster.
With the VPN in place, you will be able to add more nodes in the future.

Please enter the following VPN details:

* ``VPN endpoint address``: this is the address of the leader node of your cluster, and must be reachable by any other nodes you may
  add to your cluster. Local network names and IP addresses will prevent you from adding systems to your
  cluster which aren’t on the same network as the leader node
* ``VPN endpoint port``: it's the public port of the VPN, the port should be accessible to any future node
* ``VPN CIDR``: the VPN network address, make sure this network is not already used inside your existing network environment

If unsure, you can keep the proposed defaults which should be good for most environments.

Finally, click on :guilabel:`Create cluster` button. Your NS8 is now ready to run :ref:`applications <modules-section>`.

Each cluster has an auto-generated name. If you wish to change it:

* go to the ``Settings`` page and click on the ``Cluster`` card
* enter a name inside the ``Cluster label`` field
* click the :guilabel:`Save settings` button

Now sure where to go from here?
You can install an :ref:`LDAP <openldap-section>` or :ref:`Active Directory <active_directory-section>` user domain,
take a look at :ref:`system logs <loki-section>`, add :ref:`new nodes <cluster-section>` or setup a :ref:`metric dashboard <metrics-section>`.

To customize the installation, please refer to the `developer manual <https://nethserver.github.io/ns8-core>`_.

.. _install_image-section:

Pre-built images
================

Download one of latest available images from the `release page <https://github.com/NethServer/ns8-core/releases>`_.

Select your preferred distribution flavor, download the image and start it inside your virtualization platform.
Choose a ``qcow2`` image if you are using a KVM-based platform like `Proxmox <https://www.proxmox.com/>`_
or a ``vmdk`` image if your using something like `VMware <https://www.vmware.com>`_.
You can also upload the image on a cloud provider and create a public virtual machine.

When using the image on a cloud-provider with cloud-init support, the machine will be configured with the host name
chosen during the setup phase. Otherwise, when running on a local KVM-based platform, the machine will have the default host name
``builder.nethserver.org``.

Known bugs:

- Debian image could be currently used only for local virtualization platform
- When using RHEL-based images on Proxmox, change the default CPU model to anything other than ``kvm64``

Uninstall
=========

You can uninstall NS8 from your Linux distribution.

The uninstall command attempts to stop and erase core components and additional modules.
Handle it with care because it erases everything under ``/home`` and ``/var/lib/nethserver`` directories.

To uninstall NS8, execute: ::

  bash /var/lib/nethserver/node/uninstall.sh
