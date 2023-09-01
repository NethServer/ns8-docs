.. _os-network-section:

==================
Node network setup
==================

A workable network configuration could be already provided by an automatic
procedure, like ``cloud-init``.  If you are running a cloud VPS, do not
change the node network settings, and **read the cloud provider
documentation** before changing the node host name.

Also the **OS installation procedure** can help to set up a working network
setup for your node. In this case refer to the OS documentation.

In any other case, if the node cannot be reached from the network, enter
the system console and try to fix the network configuration with one of
the following methods.

The basic parameters to fix the node network configuration are:

1. The public network interface name, for example ``eth0``
2. A static IP address and network mask to assign, for example ``192.168.12.3/24``
3. The network default gateway IP address. It is an IP address in the same
   network of your node, for instance ``192.168.12.1``
4. The DNS server address. It can be a public DNS service, like Google
   ``8.8.8.8`` or ``8.8.4.4``, Cloudflare ``1.1.1.1``, or a private DNS
   server. In small environments it could be the gateway host itself.

``nmtui``
=========

The ``nmtui`` (Text User Interface for controlling NetworkManager) is
available on EL distributions, like CentOS Stream, Alma and Rocky Linux.

Launch the text interface to edit network connections with: ::

    nmtui edit

This is a summary of keyboard functions:

* Arrows and tab keys move between interface elements (like buttons and
  form fields)
* ``Enter``, button click
* ``Esc``, cancel, back to previous screen
* ``Space``, modify checkbox, selection
* ``Ctrl+C``, abort

