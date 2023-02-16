.. _install-section:

============
Installation
============

.. highlight:: bash

Pick your preferred distribution between :ref:`supported ones <supported-distros-section>` and
ensure that the system firewall is not blocking any connection.

First, make sure the system is up to date and ``curl`` is installed:

* for CentOS/AlmaLinux/RockyLinux: ``dnf update -y && dnf install -y curl``
* for Debian: ``apt-get update && apt-get upgrade -y && apt-get install -y curl``

Start the installation procedure as ``root``: ::

   curl https://raw.githubusercontent.com/NethServer/ns8-core/main/core/install.sh | bash

At the end of the install script access the Web user interface at **https://\<server_ip_or_fqdn\>/cluster-admin/**.

First, you will need to login using default credentials:

* user: ``admin``
* password: ``Nethesis,1234``

Then, choose :guilabel:`Create cluster` to create a new single-node cluster and setup a new administrator password.

Even if running on a single node, the system will setup a Virtual Private Network (VPN) for the cluster.
With the VPN in place, you will able to add more nodes in the future.

Please enter the following VPN details:

* ``VPN endpoint address``: it's the public name of the leader node, it should be a valid (Fully Qualified Domain Named) FQDN with a public DNS record
* ``VPN endpoint port``: it's the public port of the VPN, the port should be accessible to any future node
* ``VPN CIDR``: the VPN network address, make sure this network is not already used inside your existing network environment

If unsure, you can keep the proposed defaults which should be good for most environments.

Finally, click on :guilabel:`Create cluster` button. Your NS8 is now ready to run :ref:`applications <modules-section>`.

Each cluster has an auto-generated name. If you whish to change it:

* go to ``Settings`` page and click on ``Cluster`` card
* enter a name inside the ``Cluster label`` field
* click the :guilabel:`Save settings` button

Now sure where to go from here?
You can install an :ref:`LDAP <openldap-section>` or :ref:`Active Directory <active_directory-section>` user domain,
take a look to :ref:`system logs <loki-section>`, add :ref:`new nodes <cluster-section>` or setup a :ref:`metric dashboard <metrics-section>`.

To customize the installation, please reference to `developer manual <https://nethserver.github.io/ns8-core>`_.
