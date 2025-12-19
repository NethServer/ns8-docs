.. _system-requirements-section:

===================
System requirements
===================

NethServer 8 (NS8) can be deployed on a single node or across multiple
nodes. In both cases it is called "cluster". A node can be either a physical 
or virtual machine. Deployment on container-based virtualization solutions, 
such as Proxmox LXC, is not supported.

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

- `Rocky Linux <https://rockylinux.org/>`_ 9
- `CentOS Stream <https://www.centos.org/centos-stream/>`_ 9
- `AlmaLinux <https://almalinux.org>`_ 9
- `Debian <https://www.debian.org/>`_ 12

.. _swap-reqs:

Swap space
==========

Set up a swap partition or swap file. In most environments, `4 GB of
swap space`__ provides a good balance between performance and resource
usage. The decision to allocate more space depends on the system's memory
workload.

.. __: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_storage_devices/getting-started-with-swap_managing-storage-devices#recommended-system-swap-space_getting-started-with-swap

.. _static-ip-reqs:

Static IP address
=================

A working internet connection is necessary for the installation,
configuration, and updating of the node. It is required also if an
active :ref:`subscription <subscription-section>` is in place.

Assign a static IP address to the node. DHCP and any other
dynamic IP discovery protocols are not allowed.

.. _resolv-conf:

Name resolution
===============

The node name resolver must be configured to use DNS servers that are not
provided by NS8 itself. This is required because the ``/etc/resolv.conf``
file is inherited by application containers, which may use private network
setups that can conflict with the node’s own DNS service.

The ``/etc/resolv.conf`` file should contain one or more ``nameserver``
lines specifying the IP addresses of DNS servers available to the node.
These servers can be in the same LAN or on the public Internet. If the
file is managed by tools such as ``NetworkManager`` or ``cloud-init``, do
not edit it directly. Instead, follow the configuration guidelines
provided by those tools.

Avoid the following configurations:

- Do not use ``nameserver 127.0.0.1`` or any IP address assigned to the
  node itself. If the Linux distribution has installed a local DNS
  resolver service, refer to its documentation to disable or remove it.

- Do not use any NS8 application providing DNS service as the node name
  resolver, such as Samba Active Directory or DNSMasq. This can cause
  name resolution loops or prevent node updates.

- Do not mix DNS servers from different network scopes, for example,
  ``1.1.1.1`` (public, Cloudflare) and ``192.168.1.1`` (private). Doing so
  can lead to inconsistent DNS query results.


.. _dns-reqs:

DNS configuration
=================

To ensure network clients can connect to the node, its fully qualified
domain name (FQDN) must resolve to a routable IP address via DNS. Register
the FQDN with DNS record type A for IPv4 addresses and type AAAA for IPv6
addresses.

A correct FQDN and DNS setup is essential for TLS encryption to function
properly. Once connected to the node, network clients verify the TLS
certificate against the given FQDN.

To meet these requirements, follow these steps:

1. **Determine your DNS provider**: Based on your node's purpose, DNS
   can be provided by a public internet service, a private network appliance,
   or a combination of both. Review and understand the documentation for
   your chosen DNS provider.

2. **Register the FQDN**: Choose the FQDN for your node and register it in
   the DNS with its public IP address. An FQDN consists of a hostname
   prefix (a single word) and a DNS domain suffix. For example, if the
   hostname is ``jupiter`` and the domain suffix is ``example.org``, the
   resulting FQDN will be ``jupiter.example.org``.


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


.. _ssh-service-reqs:

SSH service requirements
========================

A running SSH service is not strictly required by NS8 unless a
:ref:`subscription <subscription-section>` is active. In this case,
``sshd`` must be listening on the standard TCP port 22 to correctly
integrate with the remote support service.

If you want to change the public SSH port, configure a port redirect
without altering the ``sshd`` listening port configuration. See
:ref:`ssh-redirection` for instructions.

.. _external-services:

External network connectivity
=============================

A NethServer 8 (NS8) node requires outbound network connectivity to a
number of external services to operate correctly. These services are used
for system updates, application distribution, cluster operations,
subscription management, backup, support, and TLS certificate issuance.

Unless otherwise stated, connections are outbound only and use HTTPS
over TCP port 443.

.. csv-table:: External services and endpoints required by NS8
   :header: "Purpose", "Host name", "Port", "Protocol", "Notes"

   "Name resolution", "<DNS address>", "53", "UDP/TCP", "DNS address"
   "Cluster VPN and node communication", "<leader node address>", "55820", "UDP", "Inter-node VPN and cluster traffic"
   "Cluster-admin leader API", "<leader node address>", "443", "HTTPS", "Join a new worker to the cluster"
   "OS and NS8 repositories mirror resolution", "mirrorlist.nethserver.org", "80", "HTTP", "Used to resolve Rocky Linux and NS8 mirrors"
   "Rocky Linux DNF repositories", "u4.nethesis.it, u5.nethesis.it", "443", "HTTPS", "Rocky Linux BaseOS and AppStream updates"
   "TLS certificate issuance", "acme-v02.api.letsencrypt.org", "443", "HTTPS", "Let's Encrypt ACME v2 endpoint"
   "NS8 core and updates repository", "distfeed.nethserver.org", "443", "HTTPS", "Core updates and patches"
   "Community application repository", "forge.nethserver.org", "443", "HTTPS", "Optional community modules"
   "Container image registry", "ghcr.io", "443", "HTTPS", "Official NS8 application and container images"
   "Container image registry", "docker.io", "443", "HTTPS", "Third-party container images"
   "Container image registry", "quay.io", "443", "HTTPS", "Third-party container images"
   "Cluster phone-home service", "phonehome.nethserver.org", "443", "HTTPS", "Cluster registration and metadata"

.. csv-table:: Endpoints used by cluster leader node with an active Subscription
   :header: "Purpose", "Host name", "Port", "Protocol", "Notes"

   "Subscription validation and feeds", "subscription.nethserver.com", "443", "HTTPS", "Core updates and patches for Subscription"
   "Subscription portal", "my.nethserver.com", "443", "HTTPS", "System and subscription management"
   "Subscription portal for resellers", "my.nethesis.it", "443", "HTTPS", "Inventory, heartbeat, entitlement checks"
   "Support VPN peer", "sos.nethesis.it", "1194", "UDP", "Remote support VPN (optional)"
   "Support VPN peer", "sos.nethesis.it", "443", "TCP", "Remote support VPN (optional)"
   "Cloud backup service", "backupd.nethesis.it", "443", "HTTPS", "Off-site backup and restore for cluster configuration"
   "Cloud Log Manager", "nar.nethesis.it", "443", "HTTPS", "Cloud storage and management for security logs (optional)"

Notes

* All listed connections are initiated by the NS8 node.
* Blocking access to these services can prevent updates, application
  installation, backups, cluster formation, or subscription validation.
* Additional outbound connections may be required by specific features,
  such as email notifications and HTTP routes, and by installed
  applications, depending on their configuration and upstream services.

Web browser requirements
========================

To access the cluster administration web user interface, you need an
up-to-date release of Firefox, Chrome, or Chromium browser as the web
client.
