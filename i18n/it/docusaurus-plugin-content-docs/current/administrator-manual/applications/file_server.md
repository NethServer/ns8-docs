---
title: File server Samba
sidebar_position: 3
---
# File server Samba

L'applicazione file server [Samba](http://www.samba.org) fornisce cartelle condivise e directory home a utenti e gruppi all'interno di un dominio Active Directory.

Prima di installare il file server Samba in un nodo del cluster, valuta lo spazio su disco disponibile e stima i requisiti di spazio. Fai riferimento alla sezione [Utilizzo del disco](../../tutorial/disk_usage.md) per le strategie di gestione dello spazio su disco. Ad esempio, se monti un volume aggiuntivo nelle directory `/mnt/disk1` o `/srv/disk1`, la procedura di installazione ti chiederà poi se vuoi usarlo per Samba.

Solo un'istanza di Samba può essere installata per ciascun nodo NS8. Il metodo di installazione dipende dal ruolo che Samba svolgerà nel dominio Active Directory.

- **Domain Controller**: per installare un'istanza di Samba come Active Directory Domain Controller, fai riferimento a [Active Directory](../installation/user_domains.md#active_directory-section). Quando lo configuri come provider di account, assicurati che l'interruttore `Provide shared folders and authentication to Windows clients` sia abilitato.

  Solo un controller di dominio AD può essere configurato con un indirizzo IP LAN per fornire autenticazione, cartelle condivise e DNS ai client Windows. Gli altri DC sono vincolati alla VPN privata del cluster e sono accessibili solo alle applicazioni del cluster.

- **Domain Member**: per installare un'istanza di Samba come Active Directory Domain Member, avvia l'installazione dal Software Center come per qualsiasi altra applicazione. Un membro di dominio può collegarsi sia a provider AD interni sia esterni. Vedi [Domini utente](../installation/user_domains.md).

## Configurazione {#samba-configuration}

Quando Samba è installato come **domain member**, viene avviata una procedura di configurazione iniziale per raccogliere le informazioni essenziali.

- **Domain**: seleziona una voce dall'elenco dei domini utente NS8 disponibili. Sono elencati solo i domini Active Directory interni ed esterni.
- **Admin credentials**: sono necessarie per unire Samba al dominio come membro file server. Inserisci nome utente e password di un membro del gruppo Active Directory "Domain Admins".
- **File server name and alias**: assegna a Samba un nome univoco per l'account computer. Sceglilo con attenzione, perché non potrà essere modificato in seguito. Il nome alias è facoltativo e può essere cambiato in qualsiasi momento.
- **File server IP address**: seleziona l'indirizzo IP del file server.

### Alias del file server {#file-server-alias}

Una volta completata la procedura di configurazione iniziale, usa la pagina `Settings` nel menu a sinistra per modificare il valore facoltativo `File server alias`. Il nome alias del server è utile per migrare e consolidare cartelle condivise da un altro server. Il nome alias viene aggiunto al DNS di Active Directory come record CNAME che punta al nome del file server Samba. Il nome alias viene aggiunto anche come Service Principal Name (SPN) all'account computer.

### Indirizzo IP del file server {#file-server-address}

In alcuni casi è anche possibile modificare `File server IP address` e scegliere un diverso indirizzo IP privato tra quelli assegnati al nodo. Tieni presente che un domain controller non può cambiare il proprio indirizzo IP se esistono altri controller di dominio nello stesso dominio AD.

## Cartelle condivise {#shared-folders-section}

Apri l'applicazione Samba dal cassetto delle applicazioni, seleziona `Shared folders` dal menu a sinistra e fai clic su **Create shared folder**.

Per creare una nuova cartella condivisa sono richiesti i seguenti parametri:

- **Name**: il nome della cartella condivisa. Evita di usare il nome di un utente del dominio, perché verrebbe aperta la directory home di quell'utente invece della cartella condivisa.
- **Description**: testo libero mostrato ai client di rete come "commento condivisione".
- **Main group**: seleziona un gruppo di dominio a cui assegnare i permessi iniziali della condivisione.
- **Initial permissions**: scegli una delle tre opzioni disponibili. Nota che al gruppo `Domain Admins` vengono inizialmente concessi privilegi completi in tutti i casi.
  1.  Il gruppo principale può leggere e scrivere; tutti gli altri possono leggere.
  2.  Il gruppo principale può leggere e scrivere; tutti gli altri non hanno accesso.
  3.  Tutti possono leggere e scrivere, incluso il gruppo principale.

:::note

Per accedere alla cartella condivisa, devi fornire credenziali di dominio valide. L'accesso anonimo o come guest non è consentito per motivi di sicurezza[^1].

:::

Una volta creata, dal menu con tre puntini della cartella condivisa sono disponibili le seguenti azioni:

- **Edit**: cambia la descrizione della condivisione mostrata ai client di rete come "commento condivisione".
- **Set permissions**: rimuove eventuali ACL esistenti e applica ricorsivamente nuove ACL iniziali.
- **Restore file or folder**: cerca file e cartelle da una precedente istantanea di backup e li ripristina. Vedi [Ripristinare un singolo file o una cartella da un backup di cartella condivisa](#share-selective-restore).
- **Delete**: rimuove la cartella condivisa e il suo contenuto.

Il pulsante **Show ACLs** mostra le ACL del filesystem applicate alla directory radice della cartella condivisa. Puoi modificare le ACL con un client SMB, come l'applicazione Esplora file inclusa nelle edizioni Windows Pro, oppure con il comando `smbcacls` fornito dal progetto Samba.

Sia nel flusso di creazione sia in quello di modifica, nella sezione `Advanced` sono disponibili alcune impostazioni aggiuntive descritte di seguito.

### Registrazione di audit {#share-audit-logging}

Se l'interruttore `Audit logging` è abilitato per una cartella condivisa, le operazioni di accesso e le modifiche ai permessi vengono registrate in un database. Per scopi di risoluzione dei problemi, puoi abilitare la registrazione delle operazioni non riuscite con l'interruttore `Log failed events`.

Gli eventi registrati sono accessibili dalla dashboard Grafana `Samba Audit search`, come spiegato in [Accesso a Grafana](../configuration/metrics.md#grafana_access-section).

Ulteriori informazioni sul database di audit sono disponibili nella dashboard Grafana `Samba Audit statistics`.

### Visibilità della cartella {#share-browseable}

L'interruttore `Make folder visible when browsing` controlla se la cartella condivisa viene elencata in rete. Se l'interruttore è disabilitato, è possibile accedere alla condivisione solo conoscendone il nome e il percorso di rete.

Questa funzionalità è anche detta *hidden share* oppure attributo *share browseable/browsable*.

### Cestino {#share-recycle}

L'interruttore `Keep deleted files in a recycle bin` abilita una speciale sottocartella `.recycle` in cui file o directory vengono spostati invece di essere eliminati definitivamente quando gli utenti provano a rimuoverli dalla condivisione.

Il contenuto eliminato viene collocato in una sottocartella privata creata automaticamente dentro `.recycle`. Questa sottocartella privata prende il nome dell'utente ed è accessibile solo all'utente che ha eliminato il contenuto e all'amministratore.

Quando l'interruttore è abilitato, diventano disponibili anche due opzioni aggiuntive:

- **Retention**: se è impostato un limite, un'attività automatica giornaliera rimuove gli elementi nella sottocartella `.recycle` più vecchi del numero di giorni specificato (predefinito: 30).
- **When files with the same name are deleted**: determina se mantenere solo la versione più recente di un file eliminato con lo stesso nome oppure conservarne più versioni.

### Ripristinare un singolo file o una cartella da un backup di cartella condivisa {#share-selective-restore}

Se l'applicazione ha una o più destinazioni di backup configurate e un backup è già stato eseguito, puoi cercare e ripristinare un file o una cartella da una precedente istantanea di backup di una specifica cartella condivisa.

:::warning

La procedura non calcola lo spazio su disco necessario per il ripristino. Assicurati che sia disponibile spazio su disco sufficiente prima di procedere.

:::

1.  Vai all'istanza dell'applicazione Samba e apri la pagina `Shared folders`. Ogni cartella condivisa è visualizzata come una scheda. Dal menu con tre puntini della cartella condivisa desiderata, seleziona `Restore file or folder`.

2.  Scegli la destinazione di backup da cui ripristinare il contenuto. Il caricamento delle destinazioni remote può richiedere del tempo.

3.  Seleziona la data dell'istantanea di backup da ripristinare. Le istantanee sono elencate dalla più recente alla più vecchia.

4.  Inizia a digitare il nome del file o della cartella da ripristinare. La ricerca corrisponde sia al nome sia al percorso relativo, a partire dalla radice della cartella condivisa. I risultati sono ordinati in modo che le corrispondenze sul nome compaiano prima di quelle sul percorso. Seleziona un elemento dai risultati.

    Fai clic su **Restore** per avviare il processo di ripristino.

L'elemento selezionato verrà ripristinato in una sottocartella della cartella condivisa chiamata "Restored folder". Questa cartella è leggibile da tutti, mentre il suo contenuto mantiene le ACL del backup.

## Clonare un'istanza di file server {#file-server-clone}

Quando Samba ha il ruolo di Domain Member, è possibile clonarlo come descritto in [Clona e sposta](../installation/modules.md#move_clone-section).

Dopo il completamento del processo di clonazione, vai alla pagina `Status` dell'applicazione Samba. Verrà avviata la procedura di configurazione iniziale per acquisire le informazioni mancanti. In Active Directory viene creato un nuovo account computer. Segui la procedura descritta in [Configurazione](#samba-configuration).

## Ripristinare il file server da backup {#file-server-restore}

Per prima cosa, segui la procedura descritta in [Ripristino applicazioni](../configuration/backup.md#application_restore-section) selezionando il backup del **modulo Samba**.

Dopo il completamento del processo di ripristino, potrebbero essere necessarie ulteriori azioni per avviare il file server, a seconda del ruolo originale di Samba: member o controller.

### Ripristinare un domain member

Per completare il ripristino di un **domain member**, vai alla pagina `Status` dell'applicazione Samba.

- Se l'indirizzo IP originale e il dominio utenti sono stati trovati, la procedura di ripristino avvia automaticamente il file server. Non sono necessarie operazioni manuali.

- In caso contrario, verrà avviata la procedura di configurazione iniziale per acquisire le informazioni mancanti. In questo caso viene creato un nuovo account computer in Active Directory. Segui la procedura descritta in [Configurazione](#samba-configuration).

  Se rimuovi manualmente l'account computer originale, puoi impostare il nome originale come `File server alias` per fornire accesso continuo alle cartelle condivise dai client di rete.

  Per gestire gli account computer di un dominio Active Directory interno di NS8, invoca il comando `samba-tool` da un nodo NS8 che ospita un Samba Domain Controller. Ad esempio, questo comando stampa un messaggio di aiuto inline:

      runagent -m samba0 podman exec -ti samba-dc samba-tool computer

  Sostituisci `samba0` con l'identificatore corretto del modulo DC.

### Ripristinare un domain controller

Se il **domain controller** ripristinato è il primo nel dominio, ci sono due alternative:

1.  Se l'indirizzo IP del sistema è lo stesso usato nel set di backup, i servizi DC vengono avviati automaticamente e non sono richieste ulteriori azioni.

2.  Se la condizione precedente non si applica, i servizi DC vengono avviati usando come fallback l'indirizzo IP VPN del sistema. Un comando simile è richiesto per selezionare un altro indirizzo IP in un secondo momento:

        api-cli run module/samba0/set-ipaddress --data '{"ipaddress": "10.15.21.100"}'

    Sostituisci `samba0` con l'identificatore corretto del modulo. Sostituisci il valore `ipaddress` con l'indirizzo IP corretto.

Altrimenti, se esistono già uno o più controller di dominio:

- Vai alla pagina `Domain and users` e apri il collegamento **Unconfigured provider**.
- Compila il modulo per unire un nuovo DC al dominio.

**Note**

[^1]: L'accesso guest in SMB2 e SMB3 è disabilitato per impostazione predefinita in Windows; vedi la documentazione Microsoft [File server](##REF##File server).
