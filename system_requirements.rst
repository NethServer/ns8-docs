.. _system-requirements-section:

===================
System requirements
===================

NethServer 8 (NS8) can be deployed on a single node or across multiple
nodes. In both cases it is called "cluster".

Minimum hardware requirements for a single node installation:

- 2 vCPU/cores, x86-64 architecture
- 2GB RAM
- 40GB Solid-state drive

More nodes can be added later, and when adding a new node, it is
recommended to use similar hardware and the same Linux distribution
installed on the other nodes.

The above requirements must be increased to match users, applications, and
load needs.

.. _supported-distros-section:

Linux distribution
==================

Install NS8 on a clean Linux server distribution, avoiding installation on
desktop systems or servers already running other services.

Linux distributions and versions with Nethesis :ref:`Subscription
<subscription-section>` (including "Enterprise" plan) support:

- `Rocky Linux <https://rockylinux.org/>`_ 9

Linux distributions and versions with NethServer's community support:

- `CentOS Stream <https://www.centos.org/centos-stream/>`_ 9
- `AlmaLinux <https://almalinux.org>`_ 9
- `Debian <https://www.debian.org/>`_ 12


.. _static-ip-reqs:

Static IP address
=================

A working internet connection is necessary for the installation,
configuration, and updating of the system. It is required also if an
active :ref:`subscription <subscription-section>` is in place.

Assign a static IP address to the system. DHCP and any other
dynamic IP discovery protocols are not allowed.

.. _dns-reqs:

DNS configuration
=================

To ensure network clients can connect to the server, its fully qualified
domain name (FQDN) must resolve to a routable IP address via DNS. Register
the FQDN with DNS record type A for IPv4 addresses and type AAAA for IPv6
addresses.

A correct FQDN and DNS setup is essential for TLS encryption to function
properly. Once connected to the server, network clients verify the TLS
certificate against the given FQDN.

To meet these requirements, follow these steps:

1. **Determine your DNS provider**: Based on your server's purpose, DNS
   can be provided by a public internet service, a private network appliance,
   or a combination of both. Review and understand the documentation for
   your chosen DNS provider.

2. **Register the FQDN**: Choose the FQDN for your server and register it
   in the DNS with the server's public IP address. An FQDN consists of a
   hostname prefix (a single word) and a DNS domain suffix. For example,
   if the hostname is ``jupiter`` and the domain suffix is ``example.org``,
   the resulting FQDN will be ``jupiter.example.org``.


.. _worker-node-reqs:

Worker node requirements
========================

A worker node has specific requirements for installation and
configuration.

During the join procedure, the worker node connects to the leader at the
following URL: ::

    https://<leader_fqdn>/cluster-admin/

It also establishes a WireGuard VPN connection with the leader using the
default UDP port 55820.

Ensure the following requirements are met:

1. The worker node must resolve the leader's FQDN to the correct routable
   address.

2. The HTTPS server (TCP port 443) at that address must handle the API
   request.

3. The VPN UDP port (default 55820) must not be blocked by any network
   appliances.


Web browser requirements
========================

To access the cluster administration web user interface, you need an
up-to-date release of Firefox, Chrome, or Chromium browser as the web
client.
