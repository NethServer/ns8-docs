---
title: WebTop
sidebar_position: 2
---
# Guida utente di WebTop

Funzionalità per gli utenti finali del groupware WebTop.

## Autenticazione

Usa sempre il formato completo del nome utente `<user>@<domain>` per accedere all'applicazione web e ad ActiveSync.

**Esempio**

- Nome del server: mymail.mightydomain.com
- Dominio di posta alternativo: baddomain.net
- Utente: goofy
- Login: <goofy@mightydomain.com>

:::note

Il protocollo ActiveSync è supportato solo sui dispositivi Android e iOS. Outlook non è supportato.

:::

## Gestione delle impostazioni utente

La maggior parte delle impostazioni utente può essere gestita direttamente dall'utente tramite il menu delle impostazioni. Le impostazioni bloccate richiedono privilegi amministrativi.

L'amministratore può impersonare gli utenti per verificare gli account esistenti usando credenziali di accesso speciali:

- **User name**: `admin!<username>`
- **Password**: `<WebTop admin password>`

Durante l'impersonificazione ottieni privilegi simili a quelli dell'utente, quindi puoi controllare esattamente ciò che l'utente può vedere. L'amministrazione completa delle impostazioni utente è disponibile direttamente nell'interfaccia di amministrazione, facendo clic con il tasto destro su un utente: il menu delle impostazioni aprirà il pannello completo delle impostazioni utente, con tutte le opzioni sbloccate.

Puoi anche cambiare l'indirizzo email di tutti gli utenti selezionati:

1.  seleziona gli utenti (Click + CTRL per la selezione multipla)
2.  fai clic con il tasto destro su **Bulk update email domain**

## Autenticazione a due fattori (2FA)

WebTop supporta l'autenticazione a due fattori. L'utente può scegliere tra:

- app Google Authenticator ([Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), [iOS](https://apps.apple.com/it/app/google-authenticator/id388497605))
- indirizzo email secondario

Per abilitare la 2FA:

- fai clic sul pulsante del menu nell'angolo in alto a destra e seleziona l'icona **Settings**
- quindi seleziona **Security** e fai clic sul pulsante **Activate**

![image](/_static/user-manual/webtop/screenshots/webtop-2fa.png)

## Sincronizzazione ActiveSync (EAS)

I dispositivi mobili possono essere sincronizzati usando ActiveSync. ActiveSync può essere usato solo per **contatti** e **calendari**.

### Apple iOS

Accedi al tuo dispositivo iOS, apri Settings e aggiungi un account Exchange seguendo la [guida ufficiale](https://support.apple.com/en-us/HT201729).

Compila i campi richiesti con:

- **E-mail**: inserisci il tuo indirizzo email, ad esempio: <goofy@nethserver.org>
- **Server**: inserisci il nome pubblico del tuo server, ad esempio: mail.nethserver.org
- **Domain**: lascia vuoto
- **User name**: inserisci il tuo nome utente completo, ad esempio: <goofy@nethserver.org>
- **Password**: inserisci la tua password

:::note

i dispositivi iOS richiedono un certificato SSL valido sul server. Vedi [Certificati TLS](../../administrator-manual/configuration/certificates.md)

:::

### Google Android

Accedi al tuo dispositivo Android, apri Settings, quindi seleziona **Add account** -\> **Exchange** (oppure `Company` nelle versioni più vecchie).

Compila i campi richiesti con:

- **User name**: inserisci il tuo nome utente completo, ad esempio: <goofy@nethserver.org>
- **Password**: inserisci la tua password

Quindi seleziona **Manual configuration** e modifica il nome del campo *Server* impostandolo sul nome pubblico del tuo server. Infine, se sul server hai un certificato autofirmato, assicurati di selezionare l'opzione **SSL/TLS (accept all certificates)**.

:::note

Su alcune versioni di Android (in particolare Samsung), `User name` e `Domain` devono essere inseriti nella stessa riga. In questo caso, lascia vuoto il campo prima del carattere backslash `\` e inserisci il nome utente nel formato seguente: `\goofy@nethserver.org`

:::

### Calendari e contatti multipli

Calendari condivisi e rubriche possono essere sincronizzati usando il protocollo ActiveSync.

Le risorse condivise vengono mostrate con il nome del proprietario e la categoria. Il numero tra parentesi quadre è l'ID interno. Gli eventi privati non vengono sincronizzati.

I dispositivi mobili basati su Apple iOS supportano pienamente cartelle/categorie per calendari, contatti e attività (chiamate promemoria), inclusi i colori originali.

I dispositivi mobili basati su Android supportano solo calendari e contatti; le attività non sono supportate. Usando l'applicazione Google Calendar, tutti gli elementi avranno lo stesso colore.

Installando e usando l'applicazione [CloudCal](https://pselis.com/cloudcal/), puoi cambiare i colori associati a ogni calendario, compresi quelli condivisi.

Sui dispositivi Android, i contatti provenienti da rubriche condivise vengono uniti alla rubrica personale e mostrati in una vista unica. I contatti possono essere modificati e le modifiche verranno salvate nella sorgente originale.

:::note

Per ricevere dati via EAS sui dispositivi mobili, le risorse condivise (Calendari e Contatti) devono avere la sincronizzazione abilitata (`Active` o `Read-only`):

![Multiple synchronization](/_static/user-manual/webtop/screenshots/webtop-multiple_sync.png)

:::

È possibile abilitare o disabilitare la sincronizzazione per ogni risorsa condivisa.

Per farlo, basta fare clic con il tasto destro sulla risorsa condivisa `Customize → Devices sync.`:

> ![Sync shared EAS](/_static/user-manual/webtop/screenshots/webtop-sync_shared_eas.png)

L'impostazione predefinita è `Not active`.

## Sincronizzazione CalDAV e CardDAV

Calendari e rubriche possono essere sincronizzati anche tramite i protocolli CalDAV e CardDAV.

Per sincronizzare un calendario, recupera il suo link `URL` facendo clic con il tasto destro sul calendario e selezionando **Links to this calendar**, quindi usalo per configurare il client di terze parti.

Per sincronizzare una rubrica, recupera il suo link `URL` facendo clic con il tasto destro sulla rubrica e selezionando **Links to this address book**, quindi usalo per configurare il client di terze parti.

Per autenticarti, fornisci le credenziali nel formato seguente:

- **User name**: inserisci il tuo nome utente completo (cioè *goofy@nethserver.org*)
- **Password**: inserisci la tua password

Alcuni client di terze parti consentono di semplificare la configurazione tramite la funzione di *auto-discovery*, che rileva automaticamente le risorse sincronizzabili, come accade sui dispositivi mobili (ad esempio dispositivi Android o iOS).

:::note

Se usi client che non supportano l'auto-discovery, devi usare l'URL completo: `https://<server_name>/webtop-dav/server.php`

Se usi client che supportano l'auto-discovery, usa l'URL: `https://<server_name>`

:::

### Google Android

Un buon client Android di terze parti è [DAVx5](https://www.davx5.com/).

- aggiungi un nuovo account facendo clic sul tasto **+** e seleziona il metodo **Login with URL and username**
- inserisci l'`URL` (`https://<server_name>`), il nome utente completo (cioè *goofy@nethserver.org*) e la password
- fai clic sul nuovo profilo e seleziona le risorse che vuoi sincronizzare

### Apple iOS

Il supporto CalDAV/CardDAV è integrato in iOS, quindi per configurarlo:

- vai in **Settings** -\> **Account and Password** -\> **Add account**
- seleziona **Other** -\> **Add CalDAV or CardDAV account**
- inserisci il nome del server (cioè *server.nethserver.org*), il nome utente completo (cioè *goofy@nethserver.org*) e la password

### Client desktop

**Thunderbird**

Thunderbird include già il supporto per i calendari CalDAV. Per sincronizzare i contatti con CardDAV serve un add-on di terze parti come [Cardbook](https://addons.thunderbird.net/it/thunderbird/addon/cardbook/).

**Outlook**

Il plugin open source [CalDAV Synchronizer](https://caldavsynchronizer.org/) per Outlook supporta sia CardDAV sia CalDAV.

:::warning

WebTop è un **groupware client-less**: le sue funzionalità sono pienamente disponibili **solo usando l'interfaccia web**!

L'uso di CalDAV/CardDAV tramite client di terze parti **non può essere considerato un'alternativa all'interfaccia web**.

:::

## Condivisione dell'email

È possibile condividere una singola cartella o l'intero account con tutte le sottocartelle. Seleziona la cartella da condividere -\> clic destro -\> **Manage sharing**:

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_mail_folder_1.png)

- seleziona l'utente con cui condividere la risorsa (1)
- seleziona se vuoi condividere la tua identità con l'utente e perfino forzare la tua firma (2)
- scegli il livello di permessi associato a questa condivisione (3)
- se devi modificare ulteriormente i permessi, seleziona `Advanced` (4)
- infine, scegli se applicare la condivisione solo alla cartella da cui sei partito, solo al ramo di sottocartelle oppure all'intero account (5)

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_mail_folder_2.png)

:::note

L'opzione **Force mailcard** può essere usata solo se la mailcard è stata associata all'indirizzo email.

:::

## Condivisione di calendari e contatti

### Condivisione del calendario

Puoi condividere ogni calendario personale singolarmente. Seleziona il calendario da condividere -\> clic destro -\> **Sharing and permissions**:

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_cal_1.png)

Seleziona l'utente destinatario della condivisione (o il gruppo) e abilita i permessi sia per la cartella sia per i singoli elementi:

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_cal_2.png)

### Condivisione dei contatti

Allo stesso modo, puoi condividere i tuoi contatti selezionando la rubrica che vuoi condividere -\> clic destro -\> **Sharing and permissions**. Seleziona l'utente destinatario della condivisione (o il gruppo) e abilita i permessi sia per la cartella sia per i singoli elementi.

## Anteprima rapida dei messaggi

Per impostazione predefinita, la pagina della posta mostra un'anteprima del contenuto degli ultimi messaggi ricevuti.

Questa funzione può essere abilitata o disabilitata dal menu **Settings**, nella scheda **Mail**. La checkbox si chiama **Show quick preview on message row**.

## Archiviazione della posta

L'archiviazione è utile per mantenere organizzata la cartella Posta in arrivo spostando manualmente i messaggi.

:::note

L'archiviazione della posta non è un backup.

:::

Il sistema crea automaticamente una nuova cartella speciale **Archives**.

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive1.png)

Se la cartella **Archives** non appare subito dopo l'accesso, comparirà al primo utilizzo dell'archiviazione.

Esistono tre criteri di archiviazione:

- **Single folder:** una singola radice per tutte le email archiviate
- **Per year:** una radice per ogni anno
- **By year / month:** una radice per ogni anno e mese

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive2.png)

Per mantenere la struttura originale delle cartelle è possibile attivare **Keep folders structure**.

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive3.png)

L'operazione di archiviazione è accessibile dal menu contestuale (clic destro). Fai clic su **Archive**.

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive4.png)

Il sistema elaborerà l'archiviazione in base alle ultime impostazioni scelte.

## Sottoscrizione delle cartelle IMAP

Per impostazione predefinita, tutte le cartelle IMAP sul server vengono sottoscritte automaticamente e quindi sono visibili fin dal primo accesso.

Se vuoi nascondere alcune cartelle dalla vista, operazione equivalente alla rimozione della sottoscrizione, puoi semplicemente fare clic con il tasto destro sulla cartella da nascondere e selezionare dal menu interattivo la voce **Hide from list**.

Per esempio, se vuoi nascondere la sottocartella `folder1` da questo elenco, fai clic con il tasto destro su di essa e seleziona **Hide from list**:

![image](/_static/user-manual/webtop/screenshots/webtop-sub_imap_folder1.png)

È possibile gestire la visibilità delle cartelle nascoste selezionando la funzione **Manage visibility**:

![image](/_static/user-manual/webtop/screenshots/webtop-sub_imap_folder2.png)

Per esempio, se vuoi ripristinare la sottoscrizione della cartella **folder1** appena nascosta, selezionala dall'elenco delle cartelle nascoste e fai clic sull'icona a sinistra:

![image](/_static/user-manual/webtop/screenshots/webtop-sub_imap_folder3.png)

## Attività

### Filtri di visualizzazione rapida

Nella barra degli strumenti sopra la griglia ci sono 7 pulsanti che ti permettono di selezionare la visualizzazione rapida più adatta. I primi due pulsanti si riferiscono alle attività di oggi o a quelle pianificate nei prossimi 7 giorni:

![image](/_static/user-manual/webtop/screenshots/webtop-task1.png)

- **Today**: mostra le attività non concluse senza data di inizio o con data di inizio fino a oggi (incluso) e quelle completate con data di fine fino a oggi (incluso)
- **Next 7 days**: mostra le attività non completate senza data di inizio o con inizio entro i prossimi 7 giorni e quelle completate con data di completamento fino a ora (incluso)

I restanti 5 pulsanti ti permettono di ottenere questi altri tipi di visualizzazione rapida:

![image](/_static/user-manual/webtop/screenshots/webtop-task2.png)

- **Not started**: mostra solo attività con stato "To be started" e con inizio oggi (incluso)
- **Late**: mostra solo attività non completate con data di inizio fino a oggi (incluso) e data di completamento precedente a quella corrente
- **Completed**: mostra tutte le attività con stato completato e con qualsiasi intervallo di date
- **Not completed**: mostra tutte le attività con stato diverso da completato e con data di inizio entro 1 anno (per le attività ricorrenti viene mostrata solo la prima istanza della serie ancora da completare)
- **All**: mostra tutte le attività in qualsiasi stato (per le attività ricorrenti viene mostrata l'icona principale della serie)

### Attività ricorrenti

È possibile configurare qualsiasi tipo di ricorrenza:

![image](/_static/user-manual/webtop/screenshots/webtop-task3.png)

La modifica di un'attività ricorrente può essere fatta in due modi diversi:

1.  sulla singola attività aprendola con un doppio clic da una vista diversa da **All**. In questo caso l'attività verrà **rimossa** dalla ricorrenza e la sua icona diventerà questa:

![image](/_static/user-manual/webtop/screenshots/webtop-task4.png)

2.  sull'intera serie con un doppio clic dalla vista **All** oppure usando il pulsante seguente sulla singola attività già aperta:

![image](/_static/user-manual/webtop/screenshots/webtop-task5.png)

### Sotto-attività

Su qualsiasi attività è sempre possibile aggiungere sotto-attività correlate (un solo livello Master/Slave) semplicemente usando il tasto destro e selezionando **Add sub-task**. Nelle attività collegate, sia nella master sia nella slave, è disponibile in basso a destra un link per aprire le attività correlate:

![image](/_static/user-manual/webtop/screenshots/webtop-task6.png)

È possibile **Move** o **Copy** questo tipo di attività (clic destro -\> **Move/Copy**) scegliendo se copiare o spostare le sotto-attività tramite un'opzione attiva per impostazione predefinita.

### Ricerche multiple

Nella barra in alto c'è una ricerca rapida eseguita su tutti i campi. Puoi anche restringere la ricerca compilando più campi di ricerca.

![image](/_static/user-manual/webtop/screenshots/webtop-task7.png)

## Integrazione con Nextcloud

Prima di procedere, verifica che il modulo **Nextcloud** sia stato installato dal [Software center](../../administrator-manual/installation/software_center.md).

Per impostazione predefinita, l'integrazione con Nextcloud è disabilitata per tutti gli utenti. Per abilitarla, usa il pannello di amministrazione a cui puoi accedere usando la password amministrativa di WebTop.

Se vuoi abilitare il servizio per tutti gli utenti, procedi come segue:

1.  accedi al pannello di amministrazione e seleziona **Groups**:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_groups.png)

2.  modifica le proprietà del gruppo "users" facendo doppio clic e selezionando il pulsante relativo alle autorizzazioni:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_permission.png)

3.  aggiungi alle autorizzazioni esistenti quelle relative alle risorse `STORE_CLOUD` e `STORE_OTHER`, selezionando le voci come mostrato di seguito:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_1.png)

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_2.png)

per ottenere questo risultato:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_3.png)

4.  salva e chiudi.

Da questo momento ogni utente potrà inserire la risorsa Nextcloud (locale o remota) nel Cloud personale.

Per farlo, basta selezionare il pulsante Cloud e aggiungere una nuova risorsa Nextcloud facendo clic con il tasto destro su **My resources** e poi su **Add resource** in questo modo:

![image](/_static/user-manual/webtop/screenshots/webtop-nextcloud_1.png)

Si aprirà una procedura guidata precompilata:

![image](/_static/user-manual/webtop/screenshots/webtop-nextcloud_2.png)

:::note

Ricorda di compilare i campi `User name` e `Password` relativi all'accesso alla risorsa Nextcloud, altrimenti non sarà possibile usare il link pubblico ai file condivisi.

:::

:::note

Il **Path** deve essere modificato da `/nextcloud/remote.php/webdav` a `/remote.php/webdav`. Assicurati inoltre di inserire il FQDN di Nextcloud nel campo **Host** (ad esempio `nextcloud.mydomain.com`).

:::

Procedi con il pulsante **Next** fino al completamento del wizard.

## Cloud personale

Il modulo Cloud personale ti permette di inviare e ricevere documenti tramite link web.

### Come creare un link per inviare un documento

Per creare il link, seleziona il pulsante in alto a destra:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud1.png)

Segui il wizard per generare il link e usa il campo **date** per impostare la scadenza.

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud2.png)

puoi creare una **password** per proteggerlo:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud3.png)

Il link verrà generato e inserito nella nuova email:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud4.png)

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud5.png)

Il download del file genera una notifica al mittente:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud6.png)

### Richiesta di un documento

Per creare la richiesta, inserisci l'oggetto dell'email e poi seleziona il pulsante in alto a destra:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud7.png)

Segui il wizard. Puoi impostare sia una data di scadenza sia una password. Il link verrà inserito automaticamente nel messaggio:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud8.png)

Verrà inviata un'email di richiesta per caricare il documento nel Cloud:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud9.png)

Il mittente riceverà una notifica per ogni file caricato:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud10.png)

Per scaricare i file ti basta accedere al tuo `Cloud --> Uploads --> Folder` personale con data e nome:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud11.png)

## Integrazione chat {#webtop-chat}

L'installazione dell'integrazione web chat è disabilitata per impostazione predefinita per tutti gli utenti.

Per abilitare l'integrazione chat:

1.  Installa l'applicazione "Ejabberd" dalla pagina `Software center`. Vedi [Installare applicazioni](../../administrator-manual/installation/software_center.md#install-applications) ed [Ejabberd](../../administrator-manual/applications/ejabberd.md).
2.  Nella pagina `Settings` di Ejabberd, il campo `Ejabberd domain (FQDN)` deve corrispondere al valore di `Mail domain` nelle impostazioni di WebTop.
3.  Accedi a WebTop come utente admin e abilita l'autorizzazione alla web chat:
    - accedi al menu **Administration**, quindi `Domains --> NethServer --> Groups --> Users --> Authorizations`
    - `Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource --> WEBCHAT --> Action --> ACCESS`
    - fai clic su **OK**, quindi salva e chiudi

## Integrazione Jitsi

Con questa integrazione è possibile avviare una nuova videoconferenza e inviare l'invito via email, oppure pianificarne una creando l'evento direttamente dal calendario. Per attivare l'integrazione è necessario configurare l'istanza [Jitsi](https://jitsi.org/) che vuoi usare direttamente dal pannello admin modificando le [impostazioni globali documentate](https://www.sonicle.com/docs/webtop5/core.html#meeting-integration-settings).

Per impostazione predefinita, il servizio di videoconferenza è disabilitato per tutti gli utenti. Per abilitarlo per tutti gli utenti è necessario aggiungere una specifica autorizzazione dal pannello di amministrazione:

- accedi al menu **Administration**, quindi `Domains --> NethServer --> Groups --> Users --> Authorizations`
- `Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource MEETING --> Action --> CREATE`
- fai clic su **OK**, quindi salva e chiudi

La conferenza sarà disponibile per gli utenti dopo un nuovo accesso.

Per creare una nuova videoconferenza puoi partire da questi due pulsanti:

(in alto a sinistra)

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi1.png)

(in alto a destra)

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi2.png)

È possibile farlo anche da una nuova finestra email o da un nuovo evento del calendario.

Per ogni nuova riunione devi decidere se deve iniziare subito (riunione istantanea) oppure se deve essere pianificata tramite invito.

Ci sono diversi modi per condividere il link della nuova riunione:

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi3.png)

- **Start now** ti consente di accedere immediatamente alla stanza appena creata e copiare il link tramite il pulsante disponibile accanto all'URL
- **Send invitation** -\> **Copy meeting invite**: in questo caso verrà copiato un messaggio di invito che include anche il link della riunione (ad esempio: To join the meeting on Jitsi Meet, click this link: …)
- **Send invitation** -\> **Share by email**: ti verrà chiesto se vuoi cambiare l'oggetto e la data della riunione, che verranno poi inseriti nella nuova email generata:

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi4.png)

- **Send invitation** -\> **Plan event**: anche in questo caso ti verrà chiesto se vuoi cambiare l'oggetto e la data/ora della riunione prima di creare l'evento del calendario che ti permetterà di invitare altri partecipanti.

Se un evento contiene un link a una videoconferenza di terze parti, compariranno i pulsanti che ti permetteranno di accedere direttamente alla riunione:

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi5.png)

### Videochiamate di terze parti

I servizi di videoconferenza attualmente supportati, oltre a Jitsi, sono: Google Meet, MS Teams e Zoom. È possibile aggiungere piattaforme aggiuntive tramite un'[impostazione globale](https://www.sonicle.com/docs/webtop5/core.html#meeting-integration-settings).

## Integrazione SMS

È possibile inviare messaggi SMS (Short Message Service) a un contatto che abbia il numero di cellulare nella rubrica. Per attivare l'invio degli SMS, devi prima scegliere uno dei due provider supportati: [smshosting](https://www.smshosting.it/it) oppure [twilio](https://www.twilio.com/).

Una volta registrato al servizio del provider scelto, recupera le API key (`AUTH_KEY` e `AUTH_SECRET`) da inserire nel database di configurazione di WebTop. Le impostazioni da configurare sono quelle mostrate [qui](https://www.sonicle.com/docs/webtop5/core.html#sms-settings).

Puoi farlo accedendo al pannello di amministrazione -\> **Properties (system)** -\> **Add** -\> seleziona **com.sonicle.webtop.core (WebTop)** e inserisci i dati nei campi **Key** e **Value** in base alla chiave da configurare:

`sms.provider` = smshosting or twilio

`sms.provider.webrest.user` = API AUTH_KEY

`sms.provider.webrest.password` = API AUTH_SECRET

`sms.sender` = (default optional)

La chiave `sms.sender` è facoltativa e viene usata per specificare il mittente predefinito durante l'invio degli SMS. È possibile indicare un numero (massimo 16 caratteri) oppure un testo (massimo 11 caratteri).

:::note

Ogni utente può sovrascrivere il mittente personalizzandolo dal proprio pannello impostazioni: **WebTop** -\> **Switchboard VOIP and SMS** -\> **SMS Hosting service configured** -\> **Default sender**

:::

Per inviare un SMS dalla rubrica, fai clic con il tasto destro su un contatto che abbia compilato il campo mobile -\> **Send SMS**

## Personalizzazione del launcher

Il launcher è il menu a icone sul lato sinistro della pagina. Puoi aggiungere pulsanti personalizzati al launcher.

Per configurare i pulsanti, accedi al pannello di amministrazione WebTop e seleziona -\> **Domains** -\> **NethServer** -\> **Launcher**:

![image](/_static/user-manual/webtop/screenshots/webtop_launchers.png)

Per ogni pulsante, inserisci questi tre valori:

- `Name`: testo descrittivo della scheda mostrato al passaggio del mouse
- `Link URL`: URL da aprire in un nuovo browser
- `Icon URL`: URL dell'immagine dell'icona; deve sempre essere un indirizzo raggiungibile pubblicamente. Per evitare problemi di scalatura, usa immagini vettoriali

Se non riesci a trovare un URL pubblico per l'immagine dell'icona, puoi caricarla nel cloud pubblico di WebTop. Il cloud pubblico di WebTop ospita già le immagini delle mailcard. Accedi al pannello di amministrazione e fai clic su **Cloud** -\> **Public Images**, quindi inserisci un URL come `https://<public_name_server>/webtop/resources/156c0407/images/<icon.svg>`.

I pulsanti dei link personalizzati configurati verranno mostrati a tutti gli utenti al successivo accesso.

## Notifiche del browser

WebTop può notificare i nuovi messaggi email e gli eventi imminenti del calendario.

Per attivare questa funzione, ti basta accedere alle impostazioni generali del tuo utente:

![image](/_static/user-manual/webtop/screenshots/webtop-desktop_notifications.png)

È possibile abilitare le notifiche desktop in due modalità:

- **Always**: le notifiche verranno sempre mostrate, anche con il browser aperto
- **Auto (in background only)**: le notifiche verranno mostrate solo quando il browser è in background

Assicurati di consentire le notifiche nel tuo browser.

Se hai bisogno di abilitare questo consenso in seguito su un browser diverso, fai clic sull'apposito pulsante:

![image](/_static/user-manual/webtop/screenshots/webtop-button_desktop_notifications.png)

## Sottoscrizione di risorse remote

WebTop supporta la sottoscrizione a calendari e contatti remoti (directory) usando CardDAV, CalDAV e iCal.

### Calendari remoti

Un calendario Internet può essere aggiunto e sincronizzato. Per farlo basta fare clic con il tasto destro sui calendari personali e selezionare **Add Internet Calendar**. Sono supportati due tipi di calendari remoti: WebCal (formato ICS) e CalDAV.

:::note

La sincronizzazione dei calendari Webcal (ICS) viene sempre eseguita scaricando ogni volta tutti gli eventi della risorsa remota, mentre con la modalità CalDAV vengono sincronizzate solo le differenze.

:::

#### Esempio di calendario remoto Google Cal (solo Webcal - ICS)

1)  Prendi il link ICS di accesso pubblico dal tuo calendario Google: **Calendar options -> Settings and sharing -> Secret address in iCal format**
2)  In WebTop, aggiungi un calendario Internet di tipo Webcal e incolla l'URL copiato senza inserire le credenziali di autenticazione nel passaggio 1 del wizard.
3)  Il wizard si collegherà al calendario, dandoti la possibilità di cambiarne nome e colore, quindi eseguirà la prima sincronizzazione.

:::note

La prima sincronizzazione potrebbe fallire a causa delle impostazioni di sicurezza di Google. Se ricevi una notifica che ti avvisa dell'accesso alle tue risorse, devi consentirne l'uso confermando che si tratta di un tentativo legittimo.

:::

### Contatti remoti (directory)

#### Rubrica remota Google CardDAV

Passaggi:

- in WebTop, configura una nuova rubrica Internet, fai clic con il tasto destro su **Personal Categories -> Add Internet address book** e inserisci nel passaggio 1 del wizard un URL di questo tipo: `https://www.googleapis.com/carddav/v1/principals/XXXXXXXXXX@gmail.XXX/lists/default/` Sostituisci `X` con il tuo account GMail

- inserisci le credenziali di autenticazione (come nome utente usa l'indirizzo Gmail completo):

  > ![image](/_static/user-manual/webtop/screenshots/webtop-remote_phonebook.png)

- il wizard nei passaggi successivi si collegherà alla rubrica, dandoti la possibilità di cambiarne nome e colore, quindi eseguirà la prima sincronizzazione

Devi abilitare la sincronizzazione nel tuo account Google e consentire l'accesso tramite [App Password](https://support.google.com/accounts/answer/185833).

La sincronizzazione delle risorse remote può essere eseguita manualmente o automaticamente.

#### Sincronizzazione automatica

Per sincronizzare automaticamente puoi scegliere tra tre intervalli di tempo: 15, 30 e 60 minuti. La scelta dell'intervallo può essere fatta in fase di creazione oppure successivamente modificando le opzioni. Per farlo, fai clic con il tasto destro sulla rubrica (o sul calendario), **Edit Category**, **Internet Addressbook** (oppure **Internet Calendar**):

![image](/_static/user-manual/webtop/screenshots/webtop-sync_automatic.png)

#### Sincronizzazione manuale

Per aggiornare, ad esempio, una rubrica remota, fai clic con il tasto destro su di essa e poi seleziona la voce **Synchronize**:

![image](/_static/user-manual/webtop/screenshots/webtop-sync_google.png)

Per le rubriche CardDAV, così come per i calendari CalDAV remoti, puoi selezionare se eseguire una sincronizzazione completa oppure solo delle modifiche. Per farlo, fai clic con il tasto destro sulla rubrica (o sul calendario) e seleziona **Edit Category**:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_sync_google.png)

Seleziona la modalità desiderata accanto al pulsante di sincronizzazione:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_sync_google2.png)

## Notifica di un nuovo dispositivo

Puoi ricevere un'email che ti avvisa quando un nuovo dispositivo accede all'account per la prima volta.

Per impostazione predefinita, questa funzione è disabilitata per tutti gli utenti, per evitare troppi falsi positivi involontari al primo accesso.

Puoi [personalizzare questa funzione](https://www.sonicle.com/docs/webtop5/core.html#security-settings) accedendo al pannello di amministrazione.

:::note

Gli accessi effettuati tramite impersonificazione (`admin!<user>`) non invieranno mai una notifica email.

:::

## Importare contatti e calendari

WebTop supporta l'importazione di contatti e calendari da vari formati di file.

### Contatti

Formati di contatto supportati:

- CSV - valori separati da virgola (`*.txt`, `*.csv`)
- Excel (`*.xls`, `*.xlsx`)
- VCard (`*.vcf`, `*.vcard`)
- LDIF (`*.ldif`)

Per importare i contatti:

1.  fai clic con il tasto destro sulla rubrica di destinazione, quindi seleziona **Import contacts**

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_contacts1.png)

2.  seleziona il formato di importazione e assicurati che i campi del file corrispondano a quelli disponibili in WebTop

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_contacts2.png)

Se stai importando una rubrica esportata da Outlook, assicurati di impostare **Text qualifier** sul valore `"`.

![image](/_static/user-manual/webtop/screenshots/webtop-import_contacts3.png)

### Calendari

Formato di calendario supportato: iCalendar (`*.ics`, `*.ical`, `*.icalendar`)

Per importare gli eventi:

1.  fai clic con il tasto destro sul calendario di destinazione, quindi seleziona **Import events**

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_calendars1.png)

2.  seleziona il formato di importazione

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_calendars2.png)

3.  quindi scegli se vuoi eliminare tutti gli eventi esistenti e importare quelli nuovi, oppure aggiungere semplicemente i dati importati agli eventi di calendario già presenti

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_calendars3.png)

## Personalizzazione del composer della posta

### Nascondere il destinatario suggerito automaticamente nelle ricerche

Puoi disabilitare il suggerimento degli indirizzi salvati automaticamente. Accedi al pannello di amministrazione web -\> **Properties (system)** -\> **Add** -\>, seleziona **com.sonicle.webtop.core (WebTop)** e inserisci i dati nei campi **Key** e **Value** in base alla chiave da configurare:

`recipient.provider.auto.enabled` = false (predefinito: true)

### Modificare l'oggetto di un'email e salvarlo

Per abilitare la modifica dell'oggetto per le email ricevute e inviate, accedi al pannello di amministrazione web -\> **Properties (system)** -\> **Add** -\> seleziona **com.sonicle.webtop.mail (Mail)** e inserisci i dati nei campi **Key** e **Value** in base alla chiave da configurare:

`message.edit.subject` = true (predefinito: false)

### Eliminare gli indirizzi email suggeriti automaticamente

Quando compili il destinatario di un'email, vengono suggeriti alcuni indirizzi email salvati automaticamente. Se devi eliminarne uno perché errato, spostati con i tasti freccia fino a selezionare quello che vuoi cancellare (senza farci clic sopra), quindi eliminalo con **Shift + Canc**
