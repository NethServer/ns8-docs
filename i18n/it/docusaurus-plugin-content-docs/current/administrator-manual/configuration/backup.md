---
title: Backup e ripristino
sidebar_position: 5
---
# Backup e ripristino

La pagina `Backup e ripristino` gestisce le **destinazioni di backup** e i **piani**, e consente di scaricare il backup del cluster, un piccolo file crittografato con GPG che contiene configurazioni a livello di cluster, come le impostazioni delle destinazioni di backup, necessarie per ripristinare rapidamente le applicazioni. Se hai un cluster a nodo singolo e desideri ripristinarlo su un nuovo nodo NS8, consulta [Recupero di emergenza](#disaster_recovery-section).

La prima volta che accedi alla pagina `Backup e ripristino`, è necessario creare una password segreta per crittografare il file di backup del cluster.

Una volta impostata la password del backup del cluster, viene visualizzata l'intera pagina `Backup e ripristino`. Questa è suddivisa in:

- **Scarica backup del cluster**: Scarica il piccolo file di backup del cluster e modifica la sua password di crittografia. Consulta [Backup del cluster](#cluster_backup-section) per ulteriori informazioni.
- **Destinazioni di backup**: decidi dove possono essere inviati i dati di backup, ad esempio un servizio di hosting remoto S3 o una condivisione SMB locale. Le destinazioni includono segreti di accesso e una chiave di crittografia end-to-end per il backup.
- **Backup pianificati**: pianifica l'esecuzione dei backup in orari specifici, la politica di conservazione e quali applicazioni includere.

Infine, nella scheda `Ripristino`, è possibile avviare il ripristino di singole applicazioni. Consulta [Ripristino delle applicazioni](#application_restore-section).

Le sezioni successive illustrano ciascuna funzione in dettaglio.

## Destinazione del backup {#backup-destination}

Una destinazione di backup è il luogo in cui vengono salvati i dati di backup delle applicazioni. Definire una destinazione è un prerequisito per pianificare un backup o ripristinare un'applicazione.

Accedi alla pagina `Backup e ripristino`, fai clic sul pulsante **Aggiungi destinazione** e scegli un provider. I provider supportati sono:

- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)
- [Amazon S3](https://aws.amazon.com/s3/)
- [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
- S3 generico, come [RustFS](../applications/rustfs.md)
- Condivisione file Windows, tramite i protocolli SMB2/3
- [Storage locale](#local-storage), collegato a un nodo del cluster

Compila i campi richiesti per il provider scelto.

Se aggiungi una destinazione precedentemente utilizzata (cioè che contiene già dati), devi compilare il campo `Chiave di crittografia dei dati` nella sezione `Avanzate`, altrimenti i backup esistenti non possono essere aperti. Per nuove destinazioni, lascia il campo vuoto per generare una chiave casuale.

Quando una destinazione di backup viene aggiunta o modificata, le sue impostazioni vengono validate da tutti i nodi del cluster. Almeno un nodo deve riuscire a raggiungere la destinazione affinché le impostazioni vengano accettate. Durante l'esecuzione del backup, se un nodo non riesce a raggiungere direttamente una destinazione, tenterà di inoltrare i dati del backup attraverso il nodo leader, quindi attraverso altri nodi worker, fino a trovare un percorso funzionante.

La procedura di backup genera una struttura a due livelli in cui le istanze delle applicazioni sono raggruppate per tipo al primo livello e da una cartella denominata UUID al secondo livello. Ad esempio:

    dokuwiki/
    ├─ dd5b0b7c-579e-42ee-96a3-282d10958cda/
    ├─ b1497438-76d9-4aa1-b6fd-d8a4f827563e/
    ├─ fcf7b6e3-2424-442d-b625-ab90438c74db/
    mail/
    ├─ 92b8ee37-44dd-4f9f-9ee8-658e24556c55/
    loki/
    └─ 652ea526-b0dc-4bfb-a356-8a841b22bbd2/

Ogni directory UUID contiene un repository [Restic](https://restic.readthedocs.io). Tutti i repository Restic sotto la stessa destinazione di backup condividono la stessa chiave di crittografia dei dati.

L'accesso a basso livello ai repository Restic può essere effettuato utilizzando il comando [restic-wrapper](https://nethserver.github.io/ns8-core/core/backup_restore/#the-restic-wrapper-command), come documentato nel Manuale dello Sviluppatore di NS8.

### Storage locale {#local-storage}

La destinazione `Storage locale` consente di memorizzare i dati di backup su uno storage collegato localmente, come un disco USB esterno. Segui questa procedura:

1.  Formatta il disco con un filesystem supportato, ad esempio XFS:

        mkfs.xfs /dev/disk/by-id/some-disk-id

2.  Crea un volume Podman denominato `backup00`:

        podman volume create \
              --label org.nethserver.role=backup \
              --opt=device=/dev/disk/by-id/some-disk-id \
              --opt=o=noatime \
              backup00

3.  Configura l'unità `rclone-webdav.service` per utilizzare tale volume:

        echo BACKUP_VOLUME=backup00 > /var/lib/nethserver/node/state/rclone-webdav.env

4.  Riavvia il servizio. Il disco verrà montato automaticamente:

        systemctl restart rclone-webdav.service

    > [!NOTA]
    > Il disco viene smontato quando il servizio `rclone-webdav` viene arrestato.

5.  Rimuovi il volume predefinito utilizzato dal servizio, poiché non è più necessario. Il contenuto esistente verrà perso:

        podman volume rm rclone-webdav

## Pianificare il backup delle applicazioni

Per pianificare il backup delle applicazioni installate:

- Fare clic sul pulsante **Pianifica backup**.
- Selezionare le applicazioni da includere.
- Scegliere una destinazione per il backup.
- Impostare il giorno, l'orario e la politica di conservazione per il backup.
- Inserire un nome per la pianificazione del backup.
- Salvare la configurazione facendo clic sul pulsante **Pianifica backup**.

Per eseguire manualmente un backup, fare clic sull'elemento `Esegui backup ora` dal menu a tre punti del backup pianificato.

Per modificare le applicazioni incluse in un backup esistente, fare clic sull'elemento `Modifica` dal menu a tre punti del backup pianificato.

Dopo la prima esecuzione del backup, lo stato del backup viene riportato in `Backup > Pianificazioni > Vedi dettagli`.

## Ripristino delle applicazioni {#application_restore-section}

Per ripristinare un'applicazione, deve essere disponibile almeno una destinazione di backup.

Se non sono presenti destinazioni e si dispone di un file di backup del cluster crittografato, accedere alla pagina `Backup e ripristino` e fare clic su **Importa destinazioni** per ripristinarle rapidamente.

Una volta definite le destinazioni, fare clic sulla scheda `Ripristina` e seguire questa procedura:

- Fare clic sul pulsante **Ripristina applicazione**.
- Una finestra di dialogo elenca tutte le applicazioni trovate nelle destinazioni di backup configurate. Selezionare l'applicazione che si desidera ripristinare.
- Se l'applicazione selezionata è già installata, diventa visibile una casella di controllo `Sostituisci app esistente`. Quando abilitata, l'applicazione esistente verrà rimossa automaticamente al termine della procedura di ripristino.
- Selezionare lo snapshot di backup dall'elenco.
- Selezionare il nodo di destinazione per il ripristino. Si noti che, in alcuni casi, il ripristino su determinati nodi del cluster potrebbe essere limitato a causa di politiche applicative o limitazioni delle risorse del nodo.
- Fare clic sul pulsante **Ripristina**.

Si noti che i certificati TLS ottenuti da Let's Encrypt non fanno parte del backup e non vengono ripristinati con l'applicazione: devono essere richiesti nuovamente dalla pagina delle impostazioni dell'applicazione dopo il ripristino.

Alcune applicazioni principali hanno comportamenti speciali durante il ripristino:

- **Traefik** ripristina solo i certificati caricati e le rotte HTTP definite dall'utente. Fare riferimento a [Caricare certificati TLS personalizzati](certificates.md#custom-certificates-section) e [Creare una rotta HTTP personalizzata](proxy.md#custom-http-route-section).
- Il ripristino di **Loki** installa un'istanza aggiuntiva di Loki *inattiva*. Può essere utilizzata solo per le ricerche nei log, come spiegato in [Log di sistema](log_server.md).
- Il comportamento del ripristino di **Samba** dipende dal fatto che il dominio utente AD sia già presente nel cluster. Se presente, vengono ripristinati solo i dati delle cartelle condivise. In caso contrario, viene ripristinato anche il database LDAP del DC. Vedere [Ripristinare il file server da un backup](../applications/file_server.md#file-server-restore) per ulteriori informazioni.

## Ripristino selettivo dei contenuti {#selective-content-restore}

Alcune applicazioni consentono di cercare e ripristinare elementi specifici da uno snapshot di backup. Per maggiori informazioni, fare riferimento a:

- Samba [Ripristinare un singolo file o cartella da un backup di una cartella condivisa](../applications/file_server.md#share-selective-restore), per file e directory all'interno di una condivisione Samba.
- Mail [Ripristinare una cartella di una casella di posta da un backup](../applications/mail.md#mailbox-selective-restore), per caselle di posta pubbliche e cartelle delle caselle di posta degli utenti.

## Backup del cluster {#cluster_backup-section}

Il backup del cluster contiene tutti i dati necessari per il [Ripristino di emergenza](#disaster_recovery-section), incluse le configurazioni delle destinazioni e le relative chiavi di crittografia dei dati, che sono indispensabili anche per ripristinare i backup delle singole applicazioni. Si tratta di un file JSON compresso e crittografato con GPG.

La prima volta che si accede alla pagina `Backup e ripristino`, è necessario impostare una password di crittografia e conservarla in un luogo sicuro. Una nuova password di crittografia è richiesta dopo l'elezione di un nuovo nodo leader (vedi [Promuovere un nodo a leader](cluster.md#node-promotion-section)).

Il backup del cluster viene copiato automaticamente nelle destinazioni di backup durante le esecuzioni programmate, garantendo backup aggiornati sia dei dati che della configurazione del cluster. Se il cluster dispone di un [abbonamento](../about/subscription.md) attivo che include il backup cloud della configurazione del cluster, il backup del cluster è disponibile anche dal portale dell'abbonamento.

Scaricare periodicamente il backup del cluster e conservarlo in un luogo sicuro. Fare clic sul pulsante **Scarica backup del cluster** nella pagina `Backup e ripristino`.

:::note

Se si perde il backup del cluster, è comunque possibile ripristinare le applicazioni su un altro cluster solo se si conosce la password di crittografia dei dati della destinazione di backup.

:::

Per ispezionare il contenuto del file scaricato, utilizzare il seguente comando, sostituendo "SECRET" con la propria password di crittografia:

    echo 'SECRET' | gpg --batch --passphrase-fd 0 --decrypt backup.json.gz.gpg | gunzip | jq

## Ripristino di emergenza {#disaster_recovery-section}

La procedura di ripristino di emergenza è progettata per il ripristino di un **cluster a nodo singolo**. È sufficiente disporre del file [backup del cluster](#cluster_backup-section) originale.

0.  Assicurarsi che il nuovo sistema abbia spazio libero su disco sufficiente. La procedura di ripristino non verifica lo spazio libero su disco.
1.  [Installare](../installation/install.md) un nuovo cluster e accedere utilizzando le credenziali predefinite.
2.  Modificare la password predefinita dell'amministratore.
3.  Fare clic sul pulsante **Ripristina cluster**.
4.  Scegliere se ripristinare una configurazione del cluster da un server HTTP remoto o caricare il backup dal browser.
5.  Inserire il segreto di crittografia nel campo `Backup password`.
6.  Selezionare le applicazioni da ripristinare.

Per ulteriori informazioni, fare riferimento alle note di backup e ripristino per ciascuna applicazione. Ad esempio:

- [Ripristinare il file server dal backup](../applications/file_server.md#file-server-restore)