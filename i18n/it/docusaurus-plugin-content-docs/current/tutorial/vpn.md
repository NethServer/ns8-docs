---
title: Configurazione personalizzata della VPN
sidebar_position: 6
---
# Configurazione personalizzata della VPN

I nodi di un cluster NS8 sono collegati tramite una VPN WireGuard. In termini VPN, ogni nodo, sia leader sia worker, è definito un "peer". Tuttavia, la rete usa una topologia a stella, in cui il nodo leader è il centro della stella. Questo significa che il nodo leader ha un ruolo centrale non solo nell'amministrazione del cluster, ma anche a livello VPN. In sintesi:

- I pacchetti tra un worker e il leader vengono instradati tramite un collegamento diretto.
- I pacchetti tra due worker distinti devono transitare attraverso il nodo leader, coinvolgendo due collegamenti.

I dati tra peer vengono trasmessi come pacchetti UDP cifrati.

## Cambiare la porta VPN

Per impostazione predefinita, per lo scambio dei dati VPN viene usata la porta UDP 55820. In generale, non è necessario cambiare la porta VPN predefinita. Prima di farlo, valuta alternative come la configurazione del port forwarding, soprattutto se alcuni nodi si trovano dietro un dispositivo di Network Address Translation (NAT).

Se cambiare la porta predefinita è inevitabile, procedi come segue. Per esempio, per cambiare la porta del nodo worker 2 in 55823:

1.  Aggiorna in Redis il record dell'endpoint VPN per il nodo 2. Esegui questo comando sul nodo leader:

        redis-cli hset node/2/vpn endpoint node2.example.org:55823

2.  Sul nodo 2, cambia la porta di ascolto di WireGuard:

        wg set wg0 listen-port 55823
        wg-quick save wg0

3.  Adatta la configurazione del firewall sul nodo 2:

        firewall-cmd --service ns-wireguard --add-port 55823/udp --permanent
        firewall-cmd --reload

Questa procedura funziona anche per cambiare la porta di ascolto del nodo leader. Tuttavia, per renderla effettiva, il comando seguente deve essere eseguito su ciascun nodo:

    apply-vpn-routes
