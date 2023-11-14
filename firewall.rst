========
Firewall
========

NethServer 8 comes with a simple built-in firewall.

The cluster VPN network interface ``wg0`` is part of a trusted zone where all traffic
is permitted.
All other network interfaces are part of a public zone where only specific ports are open.
By default, NS8 will have the following open ports:

- cluster VPN endpoint, default is 55820 UDP. It can be changed during
  :ref:`post-installation steps <post-install-steps>` and :ref:`node
  promotion <node-promotion-section>`
- HTTP and HTTPS, 80 and 443 TCP
- SSH, 22 TCP
- Cockpit (not installed by default), 9090 TCP

Modules which requires publicly open ports, like the mail server, will automatically configure the firewall.

Browse open ports
-----------------

You can review the network interfaces and a table presenting open ports, categorized by services/modules for each node, on the  ``Nodes`` page. Access it by clicking the three dots menu on the node card you are interested in, then select :guilabel:`Firewall`.

Manage ports manually
---------------------

To allow connections to the listening port of a third-party service, use
``firewall-cmd``. For instance, the following command opens TCP port 9000: ::

    firewall-cmd --add-port=9000/tcp

To close the same port: ::

    firewall-cmd --remove-port=9000/tcp

Changes to the firewall configuration are lost after a firewall restart or
system reboot, unless the same command is invoked a second time, adding
also the ``--permanent`` flag. Refer to the ``firewall-cmd`` manual page
for more information.

To see the list of allowed services and ports, run ::

    firewall-cmd --list-all
