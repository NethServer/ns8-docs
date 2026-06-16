---
title: Migrazione da NethServer 7
sidebar_position: 4
---
# Migrazione da NethServer 7

La migrazione è il processo che converte una macchina NethServer 7 (*sorgente* NS7) in una NethServer 8 (*destinazione* NS8).

Prima di iniziare ti serviranno:

- accesso SSH e Cockpit alla macchina NS7 sorgente.
- un nuovo server che contenga un [cluster NS8 appena installato](../administrator-manual/installation/install.md).

Controlla anche i seguenti requisiti:

1.  L'indirizzo VPN del cluster NS8 deve essere risolto correttamente da NS7 e la porta VPN non deve essere bloccata da apparati di rete intermedi. L'indirizzo e la porta VPN sono stati configurati durante la creazione del cluster: per impostazione predefinita l'indirizzo è il FQDN del nodo leader e il numero di porta è 55820.
2.  Se NS7 è collegato a un provider di account esterno, devi configurare NS8 con lo stesso provider di account, come spiegato in [Provider di account](#migrate-account-provider).
3.  Devi avere accesso al tuo server DNS autoritativo. Le applicazioni in NS8 hanno un nome host virtuale dedicato, un FQDN che deve essere registrato nel DNS. Dovrai aggiungere o modificare un record DNS CNAME per ciascuna di esse.
4.  Il repository `nethforge` deve essere abilitato in NS8 per migrare SOGo.

## Collegare NS8

La procedura di migrazione aggiungerà NS7 come nodo speciale del cluster NethServer 8. Se sul sistema NS7 è configurato un provider di account, verrà collegato al cluster NS8 come provider di account esterno prima che inizi il processo di migrazione.

1.  Installa lo strumento di migrazione sulla macchina sorgente. Accedi a Cockpit sul server sorgente e installa **Migration to NS8** dal Software Center.
2.  Apri l'applicazione appena installata `NS8 migration`.
3.  Collega il server NethServer 7 a un cluster NethServer 8 nuovo già esistente inserendo i seguenti campi:
    - `LDAP user domain`: questo campo è disponibile quando NS7 usa un provider di account OpenLDAP locale. Assicurati che il nome del dominio utenti sia univoco all'interno del cluster NS8. Il database LDAP locale di NS7 verrà rinominato con questo nuovo nome di dominio durante la migrazione nel cluster NS8.
    - `NS8 leader node`: il nome host o l'indirizzo IP del nodo leader del cluster NethServer 8
    - `NS8 admin username` e `NS8 admin password`: credenziali amministrative del nodo leader. Queste credenziali vengono usate solo per creare in NS8 un account amministrativo `ns7admin1` (nota che il suffisso `1` può essere in realtà qualsiasi numero), riservato allo strumento di migrazione NS7. Assicurati che questo account venga rimosso automaticamente al termine della migrazione.
    - deseleziona l'opzione `TLS validation` se il nodo leader non ha un certificato TLS valido
4.  Fai clic sul pulsante **Connect**.

Se NS8 ha un piano di sottoscrizione attivo, gli aggiornamenti automatici vengono inibiti finché il nodo NS7 non viene rimosso automaticamente dal cluster al completamento della migrazione. Vedi anche [Aggiornamenti pianificati](../administrator-manual/about/subscription.md#scheduled-updates).

## Migrare un'applicazione

L'interfaccia web mostrerà l'elenco di tutte le applicazioni installate in NethServer 7.

:::tip

Se NS7 ha un provider di account remoto e viene invece mostrato un messaggio di errore, vedi [Provider di account](#migrate-account-provider).

:::

1.  Scegli un'applicazione e fai clic sul pulsante **Start migration**. In questa fase il processo di migrazione installerà l'applicazione nel cluster NethServer 8 e avvierà la prima sincronizzazione dei dati. Se il cluster NethServer 8 è composto da 2 o più nodi, ti verrà chiesto di selezionare un nodo di destinazione.
2.  Fai clic più volte sul pulsante **Sync data** per mantenere sincronizzati i dati dell'applicazione tra NethServer 7 e NethServer 8. Se a questo punto qualcosa va storto, fai clic sul pulsante **Abort migration** per rimuovere l'istanza applicativa NS8 e ricominciare da capo.
3.  Quando sei pronto per la migrazione finale, fai clic sul pulsante **Finish migration**. Se l'applicazione migrata richiede parametri aggiuntivi, il sistema mostrerà una finestra di dialogo prima di procedere.

Tieni presente che la maggior parte delle applicazioni web avrà bisogno di un FQDN dedicato (virtual host) dopo il completamento della migrazione. Assicurati che il record DNS punti al nodo NS8. In NS8 puoi comunque configurare [route HTTP personalizzate](#migrated_routes-section) per le applicazioni migrate.

Al termine della migrazione di ogni applicazione avviene quanto segue:

- L'applicazione in NS8 viene configurata e avviata con i dati migrati.
- L'applicazione in NS7 viene arrestata e disabilitata.
- Lo strumento di migrazione configura una pagina HTML con un collegamento che punta al nuovo nome host virtuale dell'applicazione servito da NS8. Gli utenti finali vedranno quel link al posto della vecchia applicazione. Vedi anche [Route HTTP manuali](#migrated_routes-section).
- Se l'applicazione NS7 era collegata al provider di account locale, l'applicazione NS8 continuerà a usarlo tramite un provider di account esterno temporaneo e la VPN del cluster. Vedi [Provider di account](#migrate-account-provider) per maggiori informazioni.

In alternativa, puoi saltare la migrazione di un'applicazione con il pulsante **Skip migration**.

## Completare la migrazione

Quando il provider di account viene finalmente migrato, la procedura di migrazione scollega NS7 dal cluster NS8 e compare di nuovo la pagina iniziale di connessione.

Se NS7 deve usare NS8 come provider di account remoto, leggi con attenzione la sezione [Provider di account](#migrate-account-provider).

## Log

- L'interfaccia dello strumento di migrazione ha una pagina `Logs` per leggere il contenuto di `/var/log/ns8-migration.log`. La procedura di migrazione di ogni applicazione invia una traccia della propria attività a quel file.
- Inoltre, quando NS7 entra o esce dal cluster NS8 e quando i servizi NS7 vengono modificati, alcune informazioni possono essere registrate in `/var/log/messages` come di consueto.
- Sul lato NS8, il log dell'applicazione contiene la traccia dell'attività `import-module`.

## Provider di account {#migrate-account-provider}

È richiesto il tuo intervento se il sistema NS7 è configurato con un **provider di account remoto**. Lo strumento di migrazione si aspetta di trovare in NS8 un dominio utenti esterno che corrisponda al valore `BaseDN` del provider di account remoto. Per esempio, in NS7 sotto la pagina `Users & Groups`, guarda i dettagli di `Account provider`: se il valore `BaseDN` è `dc=directory,dc=nh`, allora il nome del dominio utenti esterno in NS8 deve essere impostato su `directory.nh`. Oltre al nome corrispondente, il dominio utenti esterno di NS8 deve puntare allo stesso database LDAP di NS7 (indipendentemente dalla sua implementazione). Tieni presente che ogni nodo del cluster NS8 deve poter raggiungere lo stesso database LDAP, ora e in futuro.

Se il sistema NS7 usa un **provider di account locale**, assicurati che il suo nome di dominio sia univoco all'interno del cluster NS8 e non entri in conflitto con alcun nome di dominio utenti esistente. Questo è particolarmente importante per i domini AD, perché non possono essere rinominati nel modulo di connessione dello strumento di migrazione. Quando è collegato al cluster NS8, viene creato un dominio utenti esterno temporaneo per consentire alle applicazioni migrate di accedere al provider di account locale NS7 fino al completamento della sua migrazione. Una volta migrato il provider di account locale, il dominio utenti esterno temporaneo viene rimosso automaticamente.

Consulta le sezioni seguenti per informazioni specifiche sulla migrazione del provider di account locale.

### Samba DC

Completa la migrazione del DC facendo clic sul pulsante **Finish migration**. La procedura chiede di selezionare un indirizzo IP: diventerà l'IP del DC di destinazione.

:::warning

I client Windows potrebbero non sapere come raggiungere il nuovo DC

:::

1.  Se la configurazione DNS dei client Windows è controllata da un server DHCP, imposta l'indirizzo IP del DC NS8 come nuovo server DNS.
2.  Se i client Windows usano un DNS esterno, questo deve essere configurato per inoltrare le richieste per la zona DNS di Active Directory all'indirizzo IP del DC NS8.
3.  Se i client Windows hanno una configurazione DNS manuale e usano l'indirizzo IP del DC NS7 come server DNS e di autenticazione, valuta di trasferire l'indirizzo IP del DC NS7 al DC NS8.

In quest'ultimo caso, il trasferimento dell'IP evita di dover riconfigurare le impostazioni DNS su ogni client Windows. Questo può essere preferibile rispetto a un server DNS esterno, se blocca le richieste di aggiornamento DNS dinamico (DDNS).

Per trasferire l'indirizzo IP del DC sorgente al DC di destinazione, alcuni passaggi devono essere eseguiti manualmente dopo il completamento della migrazione.

1.  Controlla che la migrazione degli account sia andata a buon fine. Utenti e gruppi devono essere elencati correttamente nella pagina `Domains and users`.

2.  Al termine della migrazione l'indirizzo IP del DC sorgente è libero e può essere assegnato al nodo di destinazione. Consulta la documentazione del sistema operativo del nodo per assegnare un indirizzo IP secondario (alias) al nodo di destinazione.

3.  Cambia l'indirizzo IP del DC. Per esempio, se l'istanza DC è `samba1` e il nuovo IP è `192.168.1.123`, esegui il comando seguente:

        api-cli run module/samba1/set-ipaddress --data '{"ipaddress":"192.168.1.123"}'

Il Samba DC di NS8 può essere configurato come provider di account esterno per NS7. Tieni presente che NS7 deve poter accedere all'[indirizzo IP](../administrator-manual/installation/user_domains.md#active_directory-section) a cui è associato il provider di account Samba. Questa configurazione può essere utile se hai ancora moduli in esecuzione su NS7 che richiedono l'accesso al provider di account.

Le impostazioni di scadenza delle password vengono preservate durante la migrazione. La policy di robustezza delle password, se abilitata, viene convertita per essere conforme ai requisiti di complessità dei server Windows 2003+[^1] e viene applicata ai futuri cambi password. Vedi anche [Policy password](../administrator-manual/installation/user_domains.md#password-policy-section).

### OpenLDAP

Completa la migrazione di OpenLDAP facendo clic sul pulsante **Finish migration**.

:::warning

L'istanza OpenLDAP in esecuzione in NS8 non è attualmente accessibile come provider di account esterno per NS7 e altri dispositivi di rete.

:::

Le informazioni sull'età della password e sullo stato di blocco dell'account sono preservate dalla procedura di migrazione.

Tuttavia, le impostazioni della policy delle password (robustezza e scadenza) non vengono migrate. Per riabilitarle, vai nelle impostazioni del dominio nella pagina `Domains and users`. Vedi anche [Policy password](../administrator-manual/installation/user_domains.md#password-policy-section).

## Mail {#mail-migration-section}

La procedura di migrazione preserva sia i dati sia le configurazioni dell'applicazione Email di NS7, salvo diversa indicazione in questa sezione o in [Nextcloud](#config-excluded-migration).

I messaggi di posta vengono copiati in NS8 con Rsync. Dopo aver fatto clic su **Finish migration**, vengono eseguite alcune operazioni che possono richiedere tempo.

- **Conversione del formato ACL IMAP**: il formato di nomi utente e gruppi nelle ACL IMAP viene modificato rimuovendo il suffisso del dominio. Per esempio, una voce ACL che fa riferimento all'utente IMAP `john.doe@server.example.org` diventa `john.doe`. L'accesso IMAP continua ad accettare entrambi i formati.
- **Ricalcolo delle quote**: se la quota IMAP è abilitata, le dimensioni delle mailbox vengono ricalcolate in background. Durante questo periodo, l'utilizzo del disco delle mailbox potrebbe non essere disponibile.
- **Reindicizzazione di messaggi e allegati**: il motore di ricerca full-text di NS8 viene eseguito in background per reindicizzare tutti i messaggi e gli allegati. Durante questo periodo, le ricerche full-text potrebbero non funzionare. Per controllare se il processo di reindicizzazione è ancora in esecuzione, usa il comando `pgrep dovecot-index`.

Ricorda di aggiornare i record DNS o trasferire l'indirizzo IP al nodo NS8 al termine della migrazione.

### Smart host

La configurazione smart host del sistema NS7 viene convertita in una [regola relay predefinita](../administrator-manual/applications/mail.md#relay-rules-section). L'applicazione Mail di NS8 viene quindi configurata come server SMTP per ogni applicazione del cluster: vedi [Notifiche email](../administrator-manual/configuration/email_notifications.md).

### Connettore POP3 {#getmail_migration-section}

La migrazione trasferisce le impostazioni del connettore POP3 nell'[applicazione Imapsync](../administrator-manual/applications/imapsync.md) di NS8.

- Gli account configurati con IMAP vengono convertiti automaticamente in attività Imapsync funzionanti.
- Gli account che usano POP3 richiedono una verifica e un adeguamento manuali prima di avviare la sincronizzazione.

In entrambi i casi, l'attività Imapsync viene creata con l'opzione `Sieve filter` disabilitata.

:::note

I messaggi copiati da Imapsync bypassano i controlli antispam e antivirus. Per garantire la sicurezza, abilita queste protezioni sul server IMAP remoto prima della sincronizzazione.

:::

## NethVoice {#migrated_nethvoice-section}

La procedura di migrazione richiede l'assegnazione di due FQDN:

- uno per l'interfaccia di amministrazione dell'applicazione **NethVoice**
- uno per **NethVoice CTI**.

I dati di NethVoice (file delle registrazioni, file audio, database CDR) vengono copiati in NS8 con Rsync. Dopo aver fatto clic su **Finish migration**, vengono eseguite alcune operazioni che possono richiedere tempo.

Ricorda di aggiornare i record DNS se prevedi di usare alla fine della migrazione lo stesso FQDN che usavi per NethVoice su NS7.

Ulteriori informazioni sono disponibili in: [Documentazione di NethVoice](https://docs.nethvoice.com/).

## Route HTTP manuali {#migrated_routes-section}

In NethServer 7, la maggior parte delle applicazioni web era accessibile usando route in stile path. Per esempio, dato un server chiamato `server.nethserver.org`, l'installazione WebTop era disponibile all'indirizzo `https://server.nethserver.org/webtop`.

D'altra parte, quando l'applicazione viene migrata ti verrà chiesto di inserire un FQDN, così WebTop sarà disponibile su un URL come `https://webtop.nethserver.org`.

Se hai già migrato al nuovo server il record DNS del FQDN, puoi anche ricreare manualmente le vecchie route HTTP dalla [pagina proxy](../administrator-manual/configuration/proxy.md).

Esempio di aggiunta delle route WebTop:

1.  apri la sezione `HTTP routes` dalla pagina `Settings`
2.  fai clic sul nome dell'istanza WebTop, ad esempio `webtop1`: una finestra modale mostrerà i dettagli della route
3.  copia il valore del campo `URL`, ad esempio `http://127.0.0.1:20033`
4.  fai clic sul pulsante **Create route**
5.  scegli un `Name` per la root e seleziona il `Node` su cui è in esecuzione l'istanza WebTop
6.  incolla il valore copiato prima (`http://127.0.0.1:20033`) nel campo `URL`
7.  lascia vuoto il campo `Host` e inserisci `/webtop` nel campo `Path`
8.  ripeti i passaggi da 4 a 7 per tutte le altre route WebTop:
    - `/Microsoft-Server-ActiveSync`
    - `/.well-known`
    - `/webtop-dav`

## Nextcloud {#config-excluded-migration}

Dopo l'aggiornamento a Nextcloud 31, le installazioni distribuite originariamente con Nextcloud 24 o versioni precedenti possono mostrare un avviso nelle impostazioni di amministrazione riguardo al formato delle righe del database. In questo caso, il database può essere ottimizzato con il comando di ottimizzazione del database; maggiori informazioni sono disponibili nella [pagina di Nextcloud](../administrator-manual/applications/nextcloud.md#nextcloud-db-optimize-section).

## Limitazioni

Lo strumento di migrazione supporta un insieme limitato di applicazioni. Se un'applicazione è installata ma non è elencata nella pagina dello strumento di migrazione, non sarà coperta dal processo di migrazione.

Le seguenti configurazioni non vengono migrate:

- template personalizzati
- impostazioni della policy delle password del provider di account (vedi [Provider di account](#migrate-account-provider))
- impostazioni smart host di sistema, se l'applicazione NS7 Email non è installata oppure non è stata migrata
- l'impostazione `Accept unknown recipients` del server di posta, che intercetta i messaggi inviati a indirizzi non esistenti. Vedi [Domini](../administrator-manual/applications/mail.md#email_domains) per i dettagli.

I seguenti dati non vengono migrati:

- log di sistema
- Samba Audit DB
- cartelle condivise (se NS7 usa un provider di account remoto)

[^1]: [Passwords must meet complexity requirements](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)#password-must-meet-complexity-requirements) dal sito web *learn.microsoft.com*.
