.. _system-requirements-section:

===================
System requirements
===================

NethServer 8 can be deployed on a single machine or on more nodes in a cluster scenario.
NS8 is currently available only for `x86-64 architecture <https://en.wikipedia.org/wiki/X86-64>`_.

Minimum hardware requirements for a single node installation:

- 2 vCPU/cores
- 2GB RAM
- 20GB disk

More nodes can be added later. When adding a new node, you should use
similar hardware and the same distribution installed on the leader node.

Always install NethServer 8 on a clean server machine, do not install it on a desktop.

.. _supported-distros-section:

Linux distribution
==================

Supported GNU/Linux distributions and versions:

- `Rocky Linux <https://rockylinux.org/>`_ 9
- `CentOS Stream <https://www.centos.org/centos-stream/>`_ 9
- `AlmaLinux <https://almalinux.org>`_ 9
- `Debian <https://www.debian.org/>`_ 12


.. _static-ip-reqs:

Static IP address
=================

The server must be assigned a static IP address. DHCP and any other
dynamic IP discovery protocols are not allowed.

.. _dns-reqs:

DNS configuration
=================

As you are configuring a server, network clients must resolve its fully
qualified domain name (FQDN) to a routable IP address with the DNS. This
is a requirement to connect with the server.

A correct FQDN and DNS setup is also a requirement for TLS encryption to
work properly. Once connected with the server, network clients check if
the FQDN is in the TLS certificate before exchanging data with it.

1. Depending on your server purpose, DNS can be provided by a public
   internet service, a private network appliance, or even both of them.
   Read carefully and understand their documentation.

2. Decide the FQDN of your server and register it in the DNS with the
   server public IP address. A FQDN is composed by the host name prefix (a
   single word) and the DNS domain suffix. For instance, host name can be
   ``jupiter`` and domain suffix ``example.org``: the resulting FQDN is
   ``jupiter.example.org``.


.. _worker-node-reqs:

Worker node requirements
========================

.. highlight:: text

Among network clients, a NethServer 8 worker node has some special
requirements to be installed and configured.

A worker node reaches the leader during the join procedure at the
following URL: ::

    https://<leader_fqdn>/cluster-admin/

Ensure the following requirements are met:

1. the worker node must resolve the leader FQDN to the correct routable
   address

2. the HTTPS server (TCP port 443) at that address must handle the API
   request

3. the API server response contains the leader ``VPN endpoint``: it is a
   host address with a UDP port number used to set up a Wireguard VPN. The
   VPN endpoint is configured during the :ref:`cluster creation
   <post-install-steps>` procedure. Ensure it is not blocked by other
   network appliances.
