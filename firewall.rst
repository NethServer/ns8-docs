========
Firewall
========

NethServer 8 comes with a simple built-in firewall.

The cluster VPN network interface ``wg0`` is part of a trusted zones where all traffic
is permitted.
All other network interfaces are part of public zone where only specific ports are open.
By default, NS8 will be open the following ports:

- cluster VPN endpoint, default is 5580 UDP
- HTTP and HTTPS, 80 and 443 TCP
- SSH, 22 TCP
- Cockpit (if installed), 9090 TCP

Modules which requires publicly open ports, like mail server, will automatically configure the firewall.
