---
title: System logs
sidebar_position: 2
---
# System logs

I record di registro generati da qualsiasi nodo di cluster vengono raccolti e memorizzati nel nodo leader. Vedere [Log di persistenza](#logs-persistence-section) per ulteriori informazioni.

## Accesso ai log

The System Logs page allows users to efficiently search logs based on date, text query, or context. The available contexts include:

- **Cluster**: Visualizza i log di tutti i nodi di cluster.
- **Node**: Shows logs from a specific node.
- **Application**: Presents logs from a particular application instance.

Gli utenti possono scegliere tra due modalità di funzionamento:

- \*\* Modalità Dump\*\* Recupera un numero limitato di record di registro entro un determinato periodo di tempo. Il numero massimo di linee può essere regolato utilizzando il campo `Max righe`.
- **Follow mode** Displays logs in real-time, providing live updates.

If the `Search query` field is set, only log records matching the given string are returned. Only exact substring matches are allowed.

Per l'analisi comparativa dei registri da due nodi o applicazioni, seguire questi passaggi:

- Click on **Add search** button.
- Optionally, switch to `Vertical layout` from the three-dots menu for a side-by-side comparison.

Ad esempio, confrontare i log può essere utile per vedere il registro Traefik da un lato, per vedere le richieste HTTP in arrivo, e i registri di Nextcloud dall'altro lato per vedere l'attività dell'applicazione.

:::note

Per impostazione predefinita, le ricerche di registro sono indirizzate all'istanza Loki attiva. Se ci sono [inactive Loki instances](#inactive-loki-section) all'interno del cluster, è possibile selezionarli per cercare le voci di registro passate.

:::

## Command line interface

In addition to accessing logs via the System Logs web page, users can utilize the `api-server-logs` command for log searching. Below are examples illustrating its usage:

1)  **Basic invocation:** Enters "follow mode" for the entire cluster:

        api-server-logs logs

2)  **Follow mode for application instance:** Enables follow mode for the specified application (module) instance, such as `traefik1`. The `--entity` flag selects the context:

        api-server-logs logs --entity module --name traefik1

3)  **Dump mode for specific instance in a time period:** Initiates dump mode for the same instance within a specific time period. Dates must adhere to the ISO8601 format:

        api-server-logs logs --mode dump --entity module --name traefik1 --from 2024-04-09T16:43:22Z --to 2024-04-09T16:55:31Z

4)  **Changing output timezone:** Modifies the output timezone while maintaining the same query. Refer to `timedatectl list-timezones` for a full list of options:

        api-server-logs logs --timezone America/New_York --mode dump --entity module --name traefik1 --from 2024-04-09T16:43:22Z --to 2024-04-09T16:55:31Z

## Log di persistenza {#logs-persistence-section}

Al momento della creazione di cluster, un'istanza di modulo di base Loki[^1] viene installato sul nodo leader e designato come l'istanza attiva. Il nodo leader, come qualsiasi altro nodo lavoratore, trasmette continuamente i suoi dati di registro a questa istanza attiva Loki[^2].

### Adjusting Settings

Navigate to the `Settings` page, click on the System logs card and then on the three-dots menu to modify log retention (select `Edit retention`) or assign a user-friendly name to the active Loki instance (select `Edit label`).

### Comprendere la ritenzione del registro

La ritenzione di registro si riferisce all'età massima dei registri di registro memorizzati. I record più vecchi del periodo di conservazione vengono automaticamente eliminati. Per impostazione predefinita, i registri di sistema hanno un periodo di conservazione di 365 giorni, ma questo può essere personalizzato a qualsiasi durata desiderata. Per rispettare le normative e le best practice comuni, un periodo di conservazione raccomandato è di 200 giorni o più.

### Esempi di Loki inattivi {#inactive-loki-section}

In a NS8 cluster, Loki instances are managed automatically. Only one Loki instance is configured as *active* and receives log streams from applications. Other instances are *inactive*: they can only be used for log searches.

An inactive Loki instance can originate from two situations:

1.  A Loki instance is restored from backup.
2.  When a worker node is promoted to leader, a new Loki instance is installed on the new leader and becomes the active instance, while the previous active instance is marked as *inactive*.

In case of a leader promotion, the following also applies:

- The new active instance inherits the retention setting of the previous active instance.
- An inactive instance continues to retain logs according to its last retention setting.

As noted, log searches can still be performed on an inactive instance.

To remove an inactive instance, select the three-dots menu and choose the `Uninstall` action.

## Logs forwarding {#logs-forwarding-section}

Sul nodo leader, hai la capacità di inoltrare i flussi di registro gestiti dall'istanza attiva Loki a un server syslog esterno o al Cloud Log Manager. Questo consente l'aggregazione centralizzata dei log, facilitando il monitoraggio, l'analisi e la risoluzione dei problemi dell'ambiente NethServer.

Per abilitare i inoltratori, passare a `Impostazioni` -\> `System Logs` pagina, dove tutte le istanze Loki, inclusa quella attiva, sono elencate. Qui è possibile configurare i servizi aprendo il menu della carta Loki.

Se il inoltratore è abilitato, il suo stato può essere visto in due luoghi:

- On the `Cluster Status` page under the `System Logs` card.
- Sul `Settings` -\> `System Logs` pagina sotto la scheda di istanza Loki attiva.

The displayed states are:

- **Enabled**: Un cerchio verde con una descrizione indica che il forwarder è attivo.
- **Failed**: Un cerchio rosso con una descrizione indica che il forwarder ha incontrato un problema.

### Syslog {#syslog-section}

Un server syslog riceve, memorizza e gestisce i messaggi di registro da dispositivi e applicazioni di rete, facilitando il monitoraggio e l'analisi centralizzati del registro.

Prima di configurare il server forwarder, assicurarsi che il server syslog funzioni correttamente. Avrete bisogno delle seguenti informazioni per attivare il server syslog:

- **Host name or IP address**: The IP address of the syslog server.
- **Port**: The port number on which the syslog server listens.
- **Protocollo** Il protocollo utilizzato per la comunicazione del server (UDP o TCP).
- **Filter**: Scegli se inoltrare tutti i record di registro o solo quelli relativi agli eventi di sicurezza.
- **Format**: Log format ([RFC 3164](https://www.rfc-editor.org/rfc/rfc3164) or [RFC 5424](https://www.rfc-editor.org/rfc/rfc5424)).
- \*\* Data di inizio esportazione\*\*: Specificare da quando i registri devono essere inoltrati. È possibile scegliere l'ultimo timestamp[^3] o inserire manualmente una data e l'ora.

### Cloud Log Manager {#clm-section}

:::note

This service is available only with [subscription](../about/subscription.md).

:::

The Nethesis Cloud Log Manager is a centralized solution for collecting, storing, and managing logs from various devices within an organization. It allows for real-time event collection from systems such as Linux, Windows, firewalls, switches, and hypervisors, centralizing all logs into a single interface.

To enable the forwarder for Cloud Log Manager, navigate to the `Settings` page and select `System Logs`. Open the three-dots menu of the active Loki instance, then click on `Configure Cloud Log Manager` action. Fill the form with the following information:

- **Cloud Log Manager URL**: The URL of the Cloud Log Manager (usually `https://nar.nethesis.it/`).
- **Ditta chiave unica**: Questa chiave, nota anche come "tenant", identifica e associa i log dei cluster all'interno di una società in Cloud Log Manager. È possibile trovarlo nell'applicazione web Cloud Log Manager, sotto Utenti e Aziende \> Aziende.
- \*\* Data di inizio esportazione\*\*: Specificare da quando i registri devono essere inoltrati. È possibile scegliere l'ultimo timestamp[^4] o inserire manualmente una data e l'ora.

Take note of the *cluster identifier*, displayed in the notice at the top of the form. The cluster identifier value is a string like `cluster-02834ab3` and will appear in the Host column of the Cloud Log Manager web application.

Una volta salvato il modulo, inizia la procedura di esportazione. Dopo pochi minuti, i registri di sicurezza del cluster saranno disponibili all'indirizzo <https://naradmin.nethesis.it/>.

Solo i registri di sicurezza vengono inoltrati al Cloud Log Manager. Per inoltrare il flusso di registro completo, che può generare dati considerevoli, fare riferimento a [Syslog](#syslog-section).

**Footnotes**

[^1]: Grafana Loki is a special database designed to store, index and search system logs. For more information, see <https://github.com/nethserver/ns8-loki>

[^2]: La coda. servizio core funziona su ogni nodo, riviste di sistema di lettura, invio di nuovi record all'istanza attiva Loki, e preservare l'ultima posizione del cursore della rivista inviata per garantire riavviamento senza interruzioni senza perdita di registro.

[^3]: Ultimo timestamp indica l'ultima volta che il forwarder ha inviato i registri. Ciò consente al inoltratore di riprendere da dove è stato interrotto, garantendo continuità nella gestione dei log.

[^4]: Ultimo timestamp indica l'ultima volta che il forwarder ha inviato i registri. Ciò consente al inoltratore di riprendere da dove è stato interrotto, garantendo continuità nella gestione dei log.
