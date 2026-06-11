---
title: Configurazione personalizzata VPN
sidebar_position: 6
---
# Configurazione personalizzata VPN

I nodi di un cluster NS8 sono collegati tramite una VPN WireGuard. In termini VPN, ogni nodo, sia leader che lavoratore, è indicato come "peer". Tuttavia, la rete utilizza una topologia stellare, dove il nodo leader è il centro della stella. Ciò significa che il nodo leader ha un ruolo centrale non solo nell'amministrazione dei cluster, ma anche a livello VPN. In sintesi:

- I pacchetti tra un lavoratore e il leader sono indirizzati attraverso un collegamento diretto.
- Packets between two distinct workers must transit through the leader node, involving two links.

I dati tra pari vengono trasmessi come pacchetti UDP crittografati.

## Change the VPN Port

By default, UDP port 55820 is used for VPN data exchange. Generally, changing the default VPN port is not necessary. Before doing so, consider alternatives such as configuring port forwarding, especially if some nodes are behind a Network Address Translation (NAT) device.

Se la modifica della porta predefinita è inevitabile, procedere come segue. Ad esempio, per modificare il nodo del lavoratore da 2 a 55823:

1.  Aggiorna il record di endpoint VPN per il nodo 2 in Redis. Eseguire questo comando sul nodo leader:

        redis-cli hset node/2/vpn endpoint node2.example.org:55823

2.  On node 2, change the WireGuard listening port:

        wg set wg0 listen-port 55823
        wg-quick save wg0

3.  Adjust the firewall configuration on node 2:

        firewall-cmd --service ns-wireguard --add-port 55823/udp --permanent
        firewall-cmd --reload

This procedure also works to change the listening port of the leader node. However, to make it effective, the following command must be executed on each of them:

    apply-vpn-routes
