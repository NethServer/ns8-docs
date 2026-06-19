---
title: Netdata
---
# Netdata

Questa applicazione installa e configura un'istanza [Netdata Agent](https://learn.netdata.cloud/docs/netdata-agent/) sul nodo scelto del cluster NethServer 8.

Un Netdata Agent raccoglie e mostra le metriche locali del sistema in un'interfaccia web. Sebbene possa far parte di distribuzioni più ampie, la configurazione fornita è pensata solo per il sistema locale, con l'obiettivo di aiutarti ad analizzare l'utilizzo delle risorse di base del nodo (CPU, RAM, dischi, rete...) e non è destinata al monitoraggio di applicazioni specifiche né all'integrazione con Netdata Cloud.

## Configurazione

Per accedere all'interfaccia web di Netdata, vai alla pagina Status e segui il collegamento `Application URL`.

Il componente casuale del percorso URL viene generato al momento dell'installazione e non cambia mai. Può anche essere recuperato dalla pagina Settings del cluster, nella sezione "HTTP routes", cercando `netdata`.

:::warning

L'interfaccia web non ha autenticazione. Anche se non contiene informazioni intrinsecamente sensibili, assicurati di mantenere segreto il percorso URL casuale.

:::

Dopo l'installazione, l'applicazione non richiede alcuna configurazione speciale.

- Scegli l'opzione `skip and use the dashboard anonymously` nell'angolo in basso a destra della schermata di accesso per vedere subito le metriche del nodo.
- In alternativa, consulta la sezione successiva per collegare Netdata Cloud.

### Netdata Cloud

L'istanza Netdata può essere collegata a Netdata Cloud.

Per farlo, devi creare un account gratuito Netdata Cloud, oppure accedere se ne hai già uno. Questo account ti permette di associare in modo sicuro il tuo nodo, incollando un identificativo univoco, e di accedere alle sue metriche da remoto tramite <https://app.netdata.cloud>.

Il file `netdata_random_session_id` contiene la stringa usata per identificare il tuo nodo. Per recuperarla, esegui il comando seguente:

> podman exec netdata1 cat /var/lib/netdata/netdata_random_session_id

## Archiviazione delle metriche

La configurazione di Netdata Agent deriva dall'immagine Docker ufficiale standard di Netdata. Ha tre livelli di archiviazione con diverse risoluzioni delle metriche e politiche di conservazione: secondo, minuto, ora.

| Livello | Risoluzione | Periodo di conservazione | Spazio disco riservato |
|--------|------------|--------------------------|------------------------|
| Livello 0 | 1 secondo | 14 giorni | 1 GB |
| Livello 1 | 1 minuto | 3 mesi | 1 GB |
| Livello 2 | 1 ora | 2 anni | 1 GB |

Limiti di conservazione configurati per livello di archiviazione

La configurazione standard fornisce fino a 14 giorni di metriche dettagliate con risoluzione di un secondo. Il livello a un minuto può coprire fino a 3 mesi di registrazioni, mentre il livello a un'ora può coprire fino a 2 anni. La conservazione effettiva può variare in base all'attività del sistema e alle metriche specifiche raccolte. Lo spazio su disco effettivamente utilizzato dipende dall'efficienza di compressione dei dati.

I dati vengono eliminati quando raggiungono il limite di tempo o il limite di spazio su disco, a seconda di quale dei due viene raggiunto per primo.
