---
title: Dati di rete
sidebar_position: 14
---
# Dati di rete

Questa applicazione installa e configura un'istanza [Netdata Agent](https://learn.netdata.cloud/docs/netdata-agent/) sul nodo del cluster scelto NethServer 8.

Un agente Netdata raccoglie e visualizza metriche di sistema locali in un'interfaccia utente web. Anche se può essere parte di ampie implementazioni, la configurazione fornita è adattata solo per il sistema locale, mirando ad assistere nell'analisi dell'utilizzo delle risorse di base del nodo (CPU, RAM, dischi, rete...) e non è destinata a monitorare applicazioni specifiche o integrazione con Netdata Cloud.

## Configurazione

To access the Netdata web interface, navigate to the Status page and follow the `Application URL` link.

The random URL path component is generated at installation time and never changes. It can also be obtained from the cluster Settings page, under the "HTTP routes" section, by searching for `netdata`.

:::warning

L'interfaccia web non ha autenticazione. Mentre non contiene informazioni intrinsecamente sensibili, assicurarsi di mantenere il percorso URL casuale segreto.

:::

After installation, the application does not require any special configuration.

- Choose the option `skip and use the dashboard anonymously` at the bottom right corner of the login screen to immediately access the node metrics.
- As alternative, refer to the next section to connect Netdata Cloud.

### Netdata Cloud

The Netdata instance can be connected to Netdata Cloud.

To do this, you must create a free Netdata Cloud account (or log in if you already have one). This account allows you to securely claim your node (by pasting a unique identifier) and access its metrics remotely via <https://app.netdata.cloud>.

The file `netdata_random_session_id` contains the string used to identify your node. To retrieve it, run the following command:

> podman exec netdata1 cat /var/lib/netdata/netdata_random_session_id

## Metrics storage

La configurazione dell'agente Netdata è derivata dall'immagine ufficiale Docker di azioni Netdata. Ha tre livelli di storage con diverse risoluzioni metriche e politiche di ritenzione: secondo, minuto, ora.

| Tier   | Resolution | Retention period | Disk retention |
|--------|------------|------------------|----------------|
| Tier 0 | 1 second   | 14 days          | 1 GB           |
| Tier 1 | 1 minute   | 3 months         | 1 GB           |
| Tier 2 | 1 hour     | 2 years          | 1 GB           |

Configured retention limits per storage tier

La configurazione delle scorte fornisce fino a 14 giorni di metriche finissime con una risoluzione di un secondo. Il livello di livello minimo può coprire fino a 3 mesi di registrazioni, mentre il livello di ore può coprire fino a 2 anni. La ritenzione effettiva può variare a seconda dell'attività del sistema e delle metriche specifiche raccolte. Lo spazio effettivo del disco utilizzato dipende dall'efficienza di compressione dei dati.

I dati vengono cancellati una volta che raggiunge il limite di tempo o il limite di spazio del disco, a seconda di ciò che viene prima.
