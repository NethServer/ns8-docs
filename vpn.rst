.. _vpn-custom-section:

================
VPN Custom Setup
================

The nodes of an NS8 cluster are connected via a WireGuard VPN. In VPN terms,
every node, whether leader or worker, is referred to as a "peer." However,
the network uses a star topology, where the leader node is the center of
the star. This means the leader node holds a central role not only in cluster
administration but also at the VPN level. In summary:

- Packets between a worker and the leader are routed through a direct link.
- Packets between two distinct workers must transit through the leader node,
  involving two links.

Data between peers is transmitted as encrypted UDP packets.

Change the VPN Port
===================

By default, UDP port 55820 is used for VPN data exchange. Generally, changing
the default VPN port is not necessary. Before doing so, consider alternatives
such as configuring port forwarding, especially if some nodes are behind a
Network Address Translation (NAT) device.

If changing the default port is unavoidable, proceed as follows. For example,
to change the port of worker node 2 to 55823:

#. Update the VPN endpoint record for node 2 in Redis. Run this command on
   the leader node: ::

    redis-cli hset node/2/vpn endpoint node2.example.org:55823

#. On node 2, change the WireGuard listening port: ::

    wg set wg0 listen-port 55823
    wg-quick save wg0

#. Adjust the firewall configuration on node 2: ::

    firewall-cmd --service ns-wireguard --add-port 55823/udp --permanent
    firewall-cmd --reload

This procedure also works to change the listening port of the leader node.
However, to make it effective, the following command must be executed on
each of them: ::

    apply-vpn-routes
