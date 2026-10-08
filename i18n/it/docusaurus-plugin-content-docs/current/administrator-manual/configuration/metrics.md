---
title: Metriche e avvisi
sidebar_position: 8
---
# Metriche e avvisi

Lo stack di monitoraggio viene installato automaticamente sul nodo leader.

Tutti i nodi eseguono [Node exporter](https://prometheus.io/docs/guides/node-exporter/), che fornisce l'endpoint delle metriche del nodo.

Il nodo leader esegue:

- [Prometheus](https://prometheus.io/) raccoglie le metriche da tutti gli endpoint di node_exporter e le memorizza su disco locale
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) invia gli avvisi ai destinatari configurati
- [Grafana](https://grafana.com/) visualizza le metriche raccolte; è disabilitato per impostazione predefinita

Il monitoraggio è sempre disponibile e si riconfigura automaticamente quando nuovi nodi vengono aggiunti o rimossi dal cluster. Quando un nodo viene promosso a leader, lo stack di monitoraggio viene installato automaticamente sul nuovo nodo leader e rimosso da quello precedente.

:::note

Le metriche e gli avvisi non vengono preservati quando cambia il nodo leader.

:::

Puoi configurare metriche e avvisi dalla pagina `Settings`, nella sezione `Metrics`. La pagina ti permette di configurare i seguenti parametri:

- [Dashboard di Grafana](#grafana_access-section)
- [Notifiche degli avvisi](#alerts_notifications-section)

## Avvisi {#alerts-section}

Prometheus invia automaticamente gli avvisi ad Alertmanager quando una regola viene attivata. Le regole attuali generano avvisi per:

- Nessuno spazio di swap configurato
- Spazio di swap quasi esaurito
- Uno o più backup non riusciti
- Partizioni disco quasi piene
- Software RAID (mdadm) degradato
- Certificato TLS scaduto o in scadenza entro 28 giorni
- Nodo del cluster offline da più di 5 minuti
- Server dei log Loki offline da più di 5 minuti

Se il cluster ha una sottoscrizione Enterprise, gli avvisi vengono inoltrati anche a [my.nethesis.it](https://my.nethesis.it). I cluster con sottoscrizione Community non inoltrano gli avvisi.

Puoi comunque configurare l'invio degli avvisi a indirizzi email personalizzati.

Gli avvisi sono visibili anche dal menu `Alerting` di Grafana. Vedi [Dashboard di Grafana](#grafana_access-section).

### Notifiche degli avvisi {#alerts_notifications-section}

Le notifiche email possono essere inviate agli utenti quando un avviso viene attivato o risolto.

Il cluster ha bisogno di un server SMTP per inviare le notifiche. Quindi, assicurati prima di abilitare la funzionalità [Email notifications](email_notifications.md).

Per configurare le notifiche degli avvisi, accedi alla sezione `Metrics` della pagina `Settings`. La pagina ti permette di configurare i seguenti parametri:

- `Sender email address`: l'indirizzo email che verrà usato come mittente. Il valore predefinito è calcolato dall'FQDN del leader.
- `Recipient email addresses`: gli indirizzi email a cui verranno inviati gli avvisi. Inserisci un indirizzo per riga. Sono supportati più destinatari.

Se il cluster ha una sottoscrizione Enterprise, gli avvisi vengono inviati anche a [my.nethesis.it](https://my.nethesis.it).

## Dashboard di Grafana {#grafana_access-section}

Grafana è una piattaforma open source per il monitoraggio e l'osservabilità. Ti permette di interrogare, visualizzare e comprendere le tue metriche indipendentemente da dove sono archiviate. Grafana ti fornisce strumenti per trasformare le serie temporali in grafici e visualizzazioni utili.

Per impostazione predefinita, Grafana è disabilitato. Puoi abilitarlo usando l'opzione `Access Grafana` nella pagina `Settings`, nella sezione `Metrics`.

Quando è abilitato, Grafana è accessibile sul nodo leader all'indirizzo `https://<leader-node>/grafana`.

Per accedere a Grafana, devi autenticarti con le credenziali di amministrazione del cluster.

NS8 preconfigura solo le dashboard di Grafana. Le altre funzionalità di Grafana, come avvisi, regole di avviso, notifiche e silenziamenti, non sono controllate da NS8.

Le dashboard sono organizzate in due cartelle: `core` e `modules`. In questo contesto, un'applicazione è chiamata "modulo", vedi [Il termine modulo](../installation/modules.md#il-termine-modulo).

Cartella `core`, dashboard del cluster stesso:

- `Node Exporter Full`: metriche hardware e del sistema operativo di ogni nodo
  - CPU, memoria, spazio disco, I/O disco, rete, unità systemd
  - Scegli il nodo con il selettore `Host`. I nodi sono elencati per indirizzo IP della VPN e porta, ad esempio `10.5.4.1:9100`
- `Containers`: uso di CPU, memoria, rete e disco di ogni modulo e dei suoi container. Vedi [Dashboard Containers](#containers-dashboard-section)
- `Logs`: cerca nei log del cluster archiviati in Loki. Vedi [Log di sistema](log_server.md)
  - Filtra per `Node ID`, `Module`, `Category`
  - Ricerca testuale libera
- `Loki metrics`: stato e throughput del server di log Loki

Cartella `modules`, dashboard delle applicazioni installate. Quando un'applicazione viene installata, le sue dashboard compaiono in `modules`. Esempi:

- Samba: `Samba Audit search`, `Samba Audit statistics`. Vedi [File server](../applications/file_server.md)
- CrowdSec: `CrowdSec Overview`, `CrowdSec Metrics`. Vedi [CrowdSec](../applications/crowdsec.md)

### Dashboard Containers {#containers-dashboard-section}

Usa la dashboard `Containers` per trovare quale container di un'applicazione (o "modulo" in questo contesto, vedi [Il termine modulo](../installation/modules.md#il-termine-modulo)) usa più CPU, memoria o disco su un nodo.

Selettori in alto:

- `Node`
- `Module`

Entrambi accettano più valori. `All` è consentito.

Riepilogo in alto, per l'intervallo di tempo selezionato:

- Numero di moduli e container
- CPU totale (1.0 = un core completamente occupato)
- Memoria totale (page cache inclusa)
- Disco totale
- OOM kill (processi terminati per memoria esaurita)

Righe:

- `Modules`: tabella con una riga per modulo e nodo, più grafici di CPU, memoria e rete per modulo
  - `core` è il core stesso: Redis, promtail, node_exporter, rclone-gateway, archivio immagini rootfull condiviso, stato di cluster, nodo e api-server
  - `unknown` è un container di cui non si trova il proprietario, ad esempio avviato a mano o in fase di uscita
  - Se un modulo mostra uso del disco ma zero container, il modulo è installato ma non in esecuzione
- `Containers`: tabella e grafici per i moduli scelti in `Module`
  - Top 10 di CPU e memoria, I/O a blocchi, rete
  - I nomi dei container sono univoci per modulo, non per nodo. Ad esempio `traefik` esiste sia in `traefik1` sia in `loki1`. Leggi sempre insieme modulo e container
- `Disk`: top 10 dei moduli per uso disco (volumi, immagini, stato del modulo), crescita del disco negli ultimi 14 giorni, tabella dei volumi
- `Collector health` (compressa): età e durata dell'ultima raccolta, container e moduli saltati

:::note

Limiti:

- I dati del disco sono aggiornati una volta al giorno, quindi possono avere fino a un giorno di ritardo. Subito dopo l'installazione o l'aggiornamento, i pannelli del disco possono essere vuoti fino alla prima esecuzione giornaliera.
- I grafici di rete mostrano solo i container con una rete propria. La maggior parte dei container NS8 usa la rete dell'host: il loro traffico è nei grafici di rete del nodo in `Node Exporter Full`.
- Un file con hardlink tra due moduli viene contato per entrambi, quindi la somma può superare lo spazio realmente usato.

:::

Per aggiornare subito i dati del disco, esegui sul nodo:

    systemctl start refresh-volume-metrics.service

:::warning

Se cambia il nodo leader, Grafana sarà accessibile sul nuovo nodo leader ma le personalizzazioni delle dashboard andranno perse.

:::

## Accesso all'interfaccia web di Prometheus

Per impostazione predefinita, l'interfaccia web di Prometheus non è esposta alla rete pubblica.

Se devi risolvere problemi nella configurazione di Prometheus, puoi abilitarla su `https://<leader-node>/prometheus`. Come per Grafana, dovrai autenticarti con le credenziali di amministrazione del cluster.

Per abilitare l'accesso all'interfaccia web di Prometheus, esegui il seguente comando sul nodo leader:

    api-cli run module/metrics1/configure-module --data '{"prometheus_path": "prometheus", "grafana_path": "grafana"}'
