---
title: Prometheus
sidebar_position: 6
---
# Prometheus

:::note

Il modulo Prometheus è diverso da quello in [Metriche e avvisi](../configuration/metrics.md). Questo modulo è focalizzato sul monitoraggio di servizi e applicazioni esterni.

:::

NethServer 8 include uno stack di monitoraggio ampiamente adottato composto da:

- [Prometheus](https://prometheus.io/) raccoglie tutti gli endpoint metrici e li memorizza su disco locale
- [Grafana](https://grafana.com/) visualizza le metriche raccolte

Si tratta dello stesso stack usato da [Metriche e avvisi](../configuration/metrics.md), ma questo modulo è focalizzato sul monitoraggio di servizi e applicazioni esterni.

Puoi installare una sola istanza di **Prometheus**, di solito sul nodo leader. Prometheus non richiede alcuna configurazione e sarà esposto su un URL casuale. L'URL è disponibile nella pagina `Status` dell'istanza Prometheus. Puoi accedervi dal software center oppure dal menu delle applicazioni in alto a destra.

Dalla core 3.5.0, `node_exporter` è già installato come modulo core su tutti i nodi. Prometheus raccoglierà automaticamente le metriche da tutti i nodi.

**Grafana** può essere installato solo sul nodo leader. Dopo l'installazione, dovrai configurare `Host name` con un FQDN valido per accedere all'istanza Grafana. Abilita le opzioni `Let's Encrypt` e `HTTP to HTTPS` in base alle tue esigenze.

Grafana mostrerà automaticamente le metriche di Prometheus e [Loki](../configuration/log_server.md).
