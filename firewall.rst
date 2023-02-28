========
Firewall
========

NethServer 8 comes with a simple built-in firewall.

The cluster VPN network interface ``wg0`` is part of a trusted zone where all traffic
is permitted.
All other network interfaces are part of a public zone where only specific ports are open.
By default, NS8 will have the following open ports:

- cluster VPN endpoint, default is 5580 UDP
- HTTP and HTTPS, 80 and 443 TCP
- SSH, 22 TCP
- Cockpit (if installed), 9090 TCP

Modules which requires publicly open ports, like the mail server, will automatically configure the firewall.
