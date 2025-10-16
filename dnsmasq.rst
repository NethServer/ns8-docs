.. _dnsmasq-section:

=======
DNSMasq
=======

The DNSMasq module is a lightweight DNS and DHCP server designed to provide its services within a private network. It is not recommended for use as a public DNS server.

.. note::

  Do not configure Dnsmasq as the NS8 node name resolver in
  ``/etc/resolv.conf``. For more information, see :ref:`resolv-conf`.


Prerequisites
=============

The only prerequisite is a network interface configured. This means that the network should have a valid IPv4 address and a valid subnet mask.
Please refer to your distro documentation on how to properly configure a network interface.


Configuration
=============

After installing the module, you can configure both the DNS and DHCP server through the web interface.

Select in the ``Interface`` field the interface that you want to use for DNS and DHCP server, then press :guilabel:`Save`.

Once the configuration is saved, there will be available two toggle switches to enable/disable DNS and DHCP server.

.. _dnsmasq-dhcp-section:

DHCP
====

The DHCP server can be configured with the following options:

- ``IP range start``: The first IP address that will be assigned to clients.
- ``IP range end``: The last IP address that will be assigned to clients.
- ``Lease time``: The time that the IP address will be assigned to the client, expressed in hours.
- ``Gateway``:  The gateway IP address for client configuration (DHCP
  router option 3). If left empty, the gateway address configured for the
  local node is assigned to clients.

The fields are automatically filled with default values at the first configuration, but you can change them according to your needs. Additional options can be configured manually, please refer to `Advanced Configuration`_ section.

DNS
===

The DNS server can be configured with the following options:

- ``Primary forwarding server``: The primary DNS server that will be used to resolve the queries.
- ``Secondary forwarding server``: The secondary DNS server that will be used to resolve the queries.

When the DNS server is enabled, all Fully Qualified Domain Names (FQDNs) configured within the node will be resolved using a 'CNAME' record pointing to the node's hostname.

.. note::
    The DNS server will not automatically resolve the entries in the ``/etc/hosts`` file. To resolve the entries in the ``/etc/hosts`` file, you need to add them manually in the `DNS Records`_ section.


DNS Records
===========

Additional DNS entries can be added in the ``DNS Records`` section. Simply press the :guilabel:`Add DNS Record` button and fill the fields with the desired values:

- ``Hostname``: The hostname that will be resolved.
- ``IP Address``: The IP address that will be resolved to the hostname.

IP addresses can be either IPv4 or IPv6.


Advanced Configuration
======================

The module provides additional configuration options that can be accessed manually through the configuration files.

The directories that accept custom files are located in the root directory of the module, under the `state` directory.

The following directories can be used to add custom configuration files:

- ``dnsmasq.d``: This directory is used to add custom configuration files for the DNSMasq service.
  The files must have the `.conf` extension.
  Please refer to the `DNSMasq documentation <https://dnsmasq.org/docs/dnsmasq-man.html>`_ for more information on how to configure the service.
- ``dnsmasq_hosts.d``: This directory is used to add custom hosts files that will be used by the DNSMasq service. 
  The format of the file is the same as the `/etc/hosts` file.
  Refer to the `manual <https://man7.org/linux/man-pages/man5/hosts.5.html>`_ for more information on how to write the file.

After adding the custom files, you need to restart the service to apply the changes.

The custom files enrich the existing configuration. You can customize the provided DHCP instance without creating a custom one using the tag `default`, more info can be found in the `DNSMasq documentation <https://dnsmasq.org/docs/dnsmasq-man.html>`_.

The custom files are included in the module backup.
