.. _node-firewall-section:

========
Firewall
========

NethServer 8 comes with a simple built-in firewall.

* The cluster VPN network interface ``wg0`` is part of a trusted zone
  where all traffic is permitted.

* All other network interfaces are part of a public zone where only
  specific ports are open.

By default, an NS8 node has the following open ports:

- Wireguard VPN, 55820 UDP
- HTTP and HTTPS, 80 and 443 TCP
- SSH, 22 TCP
- Cockpit (not installed by default), 9090 TCP

Applications that require publicly open ports, such as the Mail server, will
automatically configure the firewall.

Review firewall settings
------------------------

Under the Settings page, click on the :guilabel:`Firewall` card and select
a node of the cluster.

- For the selected node, a table summarizes the services running on the
  node and their open TCP and UDP ports. If a port is not listed here, it
  is closed for connections from the public zone.

- Below the table of services and open ports, there is a list of the
  network interfaces of the node.

The same page is accessible from the Nodes page by selecting the
``Firewall`` action from the three-dots menu of each node card.

Manage ports manually
---------------------

To allow connections to the listening port of a third-party service, use
``firewall-cmd``. For instance, the following command opens TCP port 9000: ::

    firewall-cmd --add-port=9000/tcp

To close the same port, use: ::

    firewall-cmd --remove-port=9000/tcp

Changes to the firewall configuration are lost after a firewall restart or
system reboot unless the same command is invoked a second time with the
``--permanent`` flag. Refer to the ``firewall-cmd`` manual page
for more information.

To see the list of allowed services and ports, run: ::

    firewall-cmd --list-all

Manage SSH port redirection
---------------------------
When a node is publicly accessible, such as a cloud VPS, it is desirable to change the
default SSH port 22 to a custom port. However, changing the port at the ``sshd``
configuration level has two drawbacks:

1. The default SELinux policy must be adjusted.
2. The :ref:`Subscription <subscription-section>` remote support requirement does not work,
   because ``sshd`` must continue to accept local connections on port 22.

Since the Firewalld configuration must be changed in any case, the preferred approach
is to configure only Firewalld with a *port forward* (or *port redirection*) and leave ``sshd`` unchanged.

The following commands open port 2222 and restrict access to port 22
to trusted interfaces: ::

    firewall-cmd --permanent --add-forward-port=port=2222:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --add-port=2222/tcp
    firewall-cmd --permanent --service=ssh --remove-port=22/tcp
    firewall-cmd --reload

To change it to another port e.g. from above 2222 to 2019: ::

    firewall-cmd --permanent --add-forward-port=port=2019:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --add-port=2019/tcp
    firewall-cmd --permanent --remove-forward-port=port=2222:proto=tcp:toport=22
    firewall-cmd --reload
 