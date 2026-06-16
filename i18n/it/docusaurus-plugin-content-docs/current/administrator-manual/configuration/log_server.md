---
title: Log di sistema
sidebar_position: 2
---
# Log di sistema

I registri generati da qualsiasi nodo del cluster vengono raccolti e archiviati nel nodo leader. Consulta [Persistenza dei log](#logs-persistence-section) per ulteriori informazioni.
## Accesso ai log

La pagina Log di Sistema consente agli utenti di cercare i log in modo efficiente in base a data, query testuale o contesto. I contesti disponibili includono:

- **Cluster**: Mostra i log di tutti i nodi del cluster.
- **Nodo**: Mostra i log di un nodo specifico.
- **Applicazione**: Mostra i log di una particolare istanza applicativa.

Gli utenti possono scegliere tra due modalità operative:

- **Modalità Dump** Recupera un numero limitato di record di log entro un periodo di tempo specificato. Il numero massimo di righe può essere regolato utilizzando il campo `Max lines`.
- **Modalità Follow** Mostra i log in tempo reale, fornendo aggiornamenti live.

Se il campo `Search query` è impostato, vengono restituiti solo i record di log che corrispondono alla stringa specificata. Sono consentite solo corrispondenze esatte di sottostringhe.

Per un'analisi comparativa dei log provenienti da due nodi o applicazioni, seguire questi passaggi:

- Fare clic sul pulsante **Add search**.
- Facoltativamente, passare alla modalità `Vertical layout` dal menu a tre punti per un confronto affiancato.

Ad esempio, confrontare i log può essere utile per visualizzare i log di Traefik da un lato, per vedere le richieste HTTP in entrata, e i log di Nextcloud dall'altro lato per osservare l'attività dell'applicazione.

:::note

Per impostazione predefinita, le ricerche nei log sono indirizzate all'istanza Loki attiva. Se ci sono [istanze Loki inattive](#inactive-loki-section) all'interno del cluster, è possibile selezionarle per cercare voci di log passate.

:::
## Interfaccia a riga di comando

Oltre ad accedere ai log tramite la pagina web **System Logs**, gli utenti possono utilizzare il comando `api-server-logs` per cercare nei log. Di seguito sono riportati esempi che illustrano il suo utilizzo:

1)  **Invocazione di base:** Entra in "modalità follow" per l'intero cluster:

        api-server-logs logs

2)  **Modalità follow per un'istanza di applicazione:** Abilita la modalità follow per l'istanza specificata di un'applicazione (modulo), come `traefik1`. L'opzione `--entity` seleziona il contesto:

        api-server-logs logs --entity module --name traefik1

3)  **Modalità dump per un'istanza specifica in un periodo di tempo:** Avvia la modalità dump per la stessa istanza all'interno di un periodo di tempo specifico. Le date devono rispettare il formato ISO8601:

        api-server-logs logs --mode dump --entity module --name traefik1 --from 2024-04-09T16:43:22Z --to 2024-04-09T16:55:31Z

4)  **Modifica del fuso orario di output:** Modifica il fuso orario di output mantenendo la stessa query. Fare riferimento a `timedatectl list-timezones` per un elenco completo delle opzioni:

        api-server-logs logs --timezone America/New_York --mode dump --entity module --name traefik1 --from 2024-04-09T16:43:22Z --to 2024-04-09T16:55:31Z
## Persistenza dei log {#logs-persistence-section}

Alla creazione del cluster, un'istanza del modulo core Loki[^1] viene installata sul nodo leader e designata come istanza attiva. Il nodo leader, come qualsiasi altro nodo worker, trasmette continuamente i propri dati di log a questa istanza attiva di Loki[^2].

### Modifica delle impostazioni

Accedi alla pagina `Settings`, fai clic sulla scheda System logs e poi sul menu a tre punti per modificare la conservazione dei log (seleziona `Edit retention`) o assegnare un nome descrittivo all'istanza attiva di Loki (seleziona `Edit label`).

### Comprendere la conservazione dei log

La conservazione dei log si riferisce all'età massima dei record di log archiviati. I record più vecchi del periodo di conservazione vengono automaticamente eliminati. Per impostazione predefinita, i System logs hanno un periodo di conservazione di 365 giorni, ma questo può essere personalizzato a piacere. Per conformarsi alle normative comuni e alle migliori pratiche, si consiglia un periodo di conservazione di 200 giorni o più.

### Istanze Loki inattive {#inactive-loki-section}

In un cluster NS8, le istanze Loki sono gestite automaticamente. Solo una istanza Loki è configurata come *attiva* e riceve i flussi di log dalle applicazioni. Le altre istanze sono *inattive*: possono essere utilizzate solo per ricerche nei log.

Un'istanza Loki inattiva può derivare da due situazioni:

1.  Un'istanza Loki viene ripristinata da un backup.
2.  Quando un nodo worker viene promosso a leader, una nuova istanza Loki viene installata sul nuovo leader e diventa l'istanza attiva, mentre l'istanza attiva precedente viene contrassegnata come *inattiva*.

In caso di promozione del leader, si applicano anche le seguenti condizioni:

- La nuova istanza attiva eredita l'impostazione di conservazione dell'istanza attiva precedente.
- Un'istanza inattiva continua a conservare i log in base alla sua ultima impostazione di conservazione.

Come indicato, è comunque possibile effettuare ricerche nei log su un'istanza inattiva.

Per rimuovere un'istanza inattiva, seleziona il menu a tre punti e scegli l'azione `Uninstall`.
## Inoltro dei log {#logs-forwarding-section}

Sul nodo leader, è possibile inoltrare i flussi di log gestiti dall'istanza attiva di Loki a un server syslog esterno o al Cloud Log Manager. Questo consente un'aggregazione centralizzata dei log, facilitando il monitoraggio, l'analisi e la risoluzione dei problemi nell'ambiente NethServer.

Per abilitare gli inoltri, accedere alla pagina `Impostazioni` -\> `Log di sistema`, dove sono elencate tutte le istanze Loki, inclusa quella attiva. Qui è possibile configurare i servizi aprendo il menu della scheda Loki.

Se l'inoltro è abilitato, il suo stato può essere visualizzato in due punti:

- Nella pagina `Stato del cluster` sotto la scheda `Log di sistema`.
- Nella pagina `Impostazioni` -\> `Log di sistema` sotto la scheda dell'istanza Loki attiva.

Gli stati visualizzati sono:

- **Abilitato**: Un cerchio verde con una descrizione indica che l'inoltro è attivo.
- **Fallito**: Un cerchio rosso con una descrizione indica che l'inoltro ha riscontrato un problema.

### Syslog {#syslog-section}

Un server syslog riceve, memorizza e gestisce i messaggi di log provenienti da dispositivi di rete e applicazioni, facilitando il monitoraggio e l'analisi centralizzati dei log.

Prima di configurare l'inoltro, assicurarsi che il server syslog sia funzionante correttamente. Saranno necessarie le seguenti informazioni per abilitare l'inoltro syslog:

- **Nome host o indirizzo IP**: L'indirizzo IP del server syslog.
- **Porta**: Il numero di porta su cui il server syslog è in ascolto.
- **Protocollo**: Il protocollo utilizzato per la comunicazione con il server (UDP o TCP).
- **Filtro**: Scegliere se inoltrare tutti i record di log o solo quelli relativi agli eventi di sicurezza.
- **Formato**: Formato dei log ([RFC 3164](https://www.rfc-editor.org/rfc/rfc3164) o [RFC 5424](https://www.rfc-editor.org/rfc/rfc5424)).
- **Data di inizio esportazione**: Specificare da quando i log devono essere inoltrati. È possibile scegliere l'ultimo timestamp[^3] o inserire manualmente una data e un'ora.

### Cloud Log Manager {#clm-section}

:::note

Questo servizio è disponibile solo con [abbonamento](../about/subscription.md).

:::

Il Nethesis Cloud Log Manager è una soluzione centralizzata per raccogliere, memorizzare e gestire i log provenienti da vari dispositivi all'interno di un'organizzazione. Consente la raccolta in tempo reale degli eventi da sistemi come Linux, Windows, firewall, switch e hypervisor, centralizzando tutti i log in un'unica interfaccia.

Per abilitare l'inoltro verso il Cloud Log Manager, accedere alla pagina `Impostazioni` e selezionare `Log di sistema`. Aprire il menu a tre punti dell'istanza Loki attiva, quindi fare clic sull'azione `Configura Cloud Log Manager`. Compilare il modulo con le seguenti informazioni:

- **URL del Cloud Log Manager**: L'URL del Cloud Log Manager (di solito `https://nar.nethesis.it/`).
- **Chiave univoca aziendale**: Questa chiave, nota anche come 'tenant', identifica e associa i log del cluster all'interno di un'azienda nel Cloud Log Manager. È possibile trovarla nell'applicazione web del Cloud Log Manager, sotto Utenti e Aziende \> Aziende.
- **Data di inizio esportazione**: Specificare da quando i log devono essere inoltrati. È possibile scegliere l'ultimo timestamp[^4] o inserire manualmente una data e un'ora.

Prendere nota dell'*identificatore del cluster*, visualizzato nell'avviso nella parte superiore del modulo. Il valore dell'identificatore del cluster è una stringa come `cluster-02834ab3` e apparirà nella colonna Host dell'applicazione web del Cloud Log Manager.

Una volta salvato il modulo, la procedura di esportazione avrà inizio. Dopo alcuni minuti, i log di sicurezza del cluster saranno disponibili su <https://naradmin.nethesis.it/>.

Solo i log di sicurezza vengono inoltrati al Cloud Log Manager. Per inoltrare l'intero flusso di log, che potrebbe generare una quantità considerevole di dati, fare riferimento a [Syslog](#syslog-section).

**Note a piè di pagina**

[^1]: Grafana Loki è un database speciale progettato per memorizzare, indicizzare e cercare i log di sistema. Per ulteriori informazioni, vedere <https://github.com/nethserver/ns8-loki>

[^2]: Il servizio core promtail.service opera su ogni nodo, leggendo i diari di sistema, inoltrando i nuovi record all'istanza Loki attiva e preservando la posizione dell'ultimo cursore del diario inviato per garantire riavvii senza perdita di log.

[^3]: L'ultimo timestamp indica l'ultima volta in cui l'inoltro ha inviato correttamente i log. Questo consente all'inoltro di riprendere l'invio dal punto in cui era stato interrotto, garantendo la continuità nella gestione dei log.

[^4]: L'ultimo timestamp indica l'ultima volta in cui l'inoltro ha inviato correttamente i log. Questo consente all'inoltro di riprendere l'invio dal punto in cui era stato interrotto, garantendo la continuità nella gestione dei log.
