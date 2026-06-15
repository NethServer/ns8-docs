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

- [Accesso a Grafana](#grafana_access-section)
- [Notifiche degli avvisi](#alerts_notifications-section)

## Avvisi {#alerts-section}

Prometheus invia automaticamente gli avvisi ad Alertmanager quando una regola viene attivata. Le regole attuali generano avvisi per:

- Nessuno spazio di swap configurato
- Spazio di swap quasi esaurito
- Uno o più backup non riusciti
- Partizioni disco quasi piene
- Software RAID (mdadm) degradato
- Certificato TLS scaduto o in scadenza entro 28 giorni

Se la macchina ha una sottoscrizione valida, gli avvisi vengono inoltrati ai portali Nethesis come [my.nethesis.it](https://my.nethesis.it) o [my.nethserver.com](https://my.nethserver.com).

Puoi comunque configurare l'invio degli avvisi a indirizzi email personalizzati.

Gli avvisi sono visibili anche in [Grafana](#grafana_access-section).

### Notifiche degli avvisi {#alerts_notifications-section}

Le notifiche email possono essere inviate agli utenti quando un avviso viene attivato o risolto.

Il cluster ha bisogno di un server SMTP per inviare le notifiche. Quindi, assicurati prima di abilitare la funzionalità [Email notifications](email_notifications.md).

Per configurare le notifiche degli avvisi, accedi alla sezione `Metrics` della pagina `Settings`. La pagina ti permette di configurare i seguenti parametri:

- `Sender email address`: l'indirizzo email che verrà usato come mittente. Il valore predefinito è calcolato dall'FQDN del leader.
- `Recipient email addresses`: gli indirizzi email a cui verranno inviati gli avvisi. Inserisci un indirizzo per riga. Sono supportati più destinatari.

Tieni presente che, se il cluster ha una sottoscrizione valida, gli avvisi verranno inviati anche ai portali Nethesis.

## Accesso a Grafana {#grafana_access-section}

Grafana è una piattaforma open source per il monitoraggio e l'osservabilità. Ti permette di interrogare, visualizzare e comprendere le tue metriche indipendentemente da dove sono archiviate. Grafana ti fornisce strumenti per trasformare le serie temporali in grafici e visualizzazioni utili.

Per impostazione predefinita, Grafana è disabilitato. Puoi abilitarlo usando l'opzione `Access Grafana` nella pagina `Settings`, nella sezione `Metrics`.

Quando è abilitato, Grafana è accessibile sul nodo leader all'indirizzo `https://<leader-node>/grafana`.

Per accedere a Grafana, devi autenticarti con le credenziali di amministrazione del cluster.

Grafana mostrerà automaticamente alcune dashboard predefinite:

- cartella *core*: contiene le dashboard predefinite per il cluster. Le dashboard disponibili sono:
  - una dashboard per le metriche di tutti i nodi, come carico CPU, uso della memoria e spazio disco
  - una dashboard per gli avvisi attivati
  - una dashboard sulle statistiche di Loki
  - una dashboard per eseguire query sui log di Loki
- cartella *modules*: contiene le dashboard predefinite per i moduli installati, come Samba Audit

:::warning

Se cambia il nodo leader, Grafana sarà accessibile sul nuovo nodo leader ma le personalizzazioni delle dashboard andranno perse.

:::

## Accesso all'interfaccia web di Prometheus

Per impostazione predefinita, l'interfaccia web di Prometheus non è esposta alla rete pubblica.

Se devi risolvere problemi nella configurazione di Prometheus, puoi abilitarla su `https://<leader-node>/prometheus`. Come per Grafana, dovrai autenticarti con le credenziali di amministrazione del cluster.

Per abilitare l'accesso all'interfaccia web di Prometheus, esegui il seguente comando sul nodo leader:

    api-cli run module/metrics1/configure-module --data '{"prometheus_path": "prometheus", "grafana_path": "grafana"}'
