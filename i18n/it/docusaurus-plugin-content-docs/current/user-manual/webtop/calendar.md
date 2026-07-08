---
title: Calendario
sidebar_position: 4
---
# Calendario

Usa questa sezione per sincronizzare, condividere, importare ed estendere i calendari in WebTop.

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

## Sincronizzazione CalDAV

I calendari possono essere sincronizzati tramite il protocollo CalDAV.

Per sincronizzare un calendario, recupera il suo link `URL` facendo clic con il tasto destro sul calendario e selezionando **Links to this calendar**, quindi usalo per configurare il client di terze parti.

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

Il supporto CalDAV è integrato in iOS, quindi per configurarlo:

- vai in **Settings** -\> **Account and Password** -\> **Add account**
- seleziona **Other** -\> **Add CalDAV account**
- inserisci il nome del server (cioè *server.nethserver.org*), il nome utente completo (cioè *goofy@nethserver.org*) e la password

### Client desktop

**Thunderbird**

Thunderbird include già il supporto per i calendari CalDAV.

**Outlook**

Il plugin open source [CalDAV Synchronizer](https://caldavsynchronizer.org/) per Outlook supporta CalDAV.

:::warning

WebTop è un **groupware client-less**: le sue funzionalità sono pienamente disponibili **solo usando l'interfaccia web**!

L'uso di CalDAV tramite client di terze parti **non può essere considerato un'alternativa all'interfaccia web**.

:::

## Condivisione dei calendari

Puoi condividere ogni calendario personale singolarmente. Seleziona il calendario da condividere -\> clic destro -\> **Sharing and permissions**:

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_cal_1.png)

Seleziona l'utente destinatario della condivisione (o il gruppo) e abilita i permessi sia per la cartella sia per i singoli elementi:

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_cal_2.png)

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
- **Send invitation** -\> **Copy meeting invite**: in questo caso verrà copiato un messaggio di invito che include anche il link della riunione (ad esempio: To join the meeting on Jitsi Meet, click this link: ...)
- **Send invitation** -\> **Share by email**: ti verrà chiesto se vuoi cambiare l'oggetto e la data della riunione, che verranno poi inseriti nella nuova email generata:

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi4.png)

- **Send invitation** -\> **Plan event**: anche in questo caso ti verrà chiesto se vuoi cambiare l'oggetto e la data/ora della riunione prima di creare l'evento del calendario che ti permetterà di invitare altri partecipanti.

Se un evento contiene un link a una videoconferenza di terze parti, compariranno i pulsanti che ti permetteranno di accedere direttamente alla riunione:

![image](/_static/user-manual/webtop/screenshots/webtop_jitsi5.png)

### Videochiamate di terze parti

I servizi di videoconferenza attualmente supportati, oltre a Jitsi, sono: Google Meet, MS Teams e Zoom. È possibile aggiungere piattaforme aggiuntive tramite un'[impostazione globale](https://www.sonicle.com/docs/webtop5/core.html#meeting-integration-settings).

## Sottoscrizione dei calendari remoti

WebTop supporta la sottoscrizione a calendari remoti usando CalDAV e iCal.

### Calendari remoti

Un calendario Internet può essere aggiunto e sincronizzato. Per farlo basta fare clic con il tasto destro sui calendari personali e selezionare **Add Internet Calendar**. Sono supportati due tipi di calendari remoti: WebCal (formato ICS) e CalDAV.

:::note

La sincronizzazione dei calendari Webcal (ICS) viene sempre eseguita scaricando ogni volta tutti gli eventi della risorsa remota, mentre con la modalità CalDAV vengono sincronizzate solo le differenze.

:::

#### Esempio di calendario remoto Google Cal (solo Webcal - ICS)

1.  Prendi il link ICS di accesso pubblico dal tuo calendario Google: **Calendar options -> Settings and sharing -> Secret address in iCal format**
2.  In WebTop, aggiungi un calendario Internet di tipo Webcal e incolla l'URL copiato senza inserire le credenziali di autenticazione nel passaggio 1 del wizard.
3.  Il wizard si collegherà al calendario, dandoti la possibilità di cambiarne nome e colore, quindi eseguirà la prima sincronizzazione.

:::note

La prima sincronizzazione potrebbe fallire a causa delle impostazioni di sicurezza di Google. Se ricevi una notifica che ti avvisa dell'accesso alle tue risorse, devi consentirne l'uso confermando che si tratta di un tentativo legittimo.

:::

#### Sincronizzazione automatica

Per sincronizzare automaticamente puoi scegliere tra tre intervalli di tempo: 15, 30 e 60 minuti. La scelta dell'intervallo può essere fatta in fase di creazione oppure successivamente modificando le opzioni. Per farlo, fai clic con il tasto destro sul calendario, **Edit Category**, **Internet Calendar**:

![image](/_static/user-manual/webtop/screenshots/webtop-sync_automatic.png)

#### Sincronizzazione manuale

Per aggiornare un calendario remoto, fai clic con il tasto destro su di esso e poi seleziona **Synchronize**:

![image](/_static/user-manual/webtop/screenshots/webtop-sync_google.png)

Per i calendari CalDAV remoti, puoi selezionare se eseguire una sincronizzazione completa oppure solo delle modifiche. Per farlo, fai clic con il tasto destro sul calendario e seleziona **Edit Category**:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_sync_google.png)

Seleziona la modalità desiderata accanto al pulsante di sincronizzazione:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_sync_google2.png)

## Importare calendari

WebTop supporta l'importazione dei calendari da file.

Formato di calendario supportato: iCalendar (`*.ics`, `*.ical`, `*.icalendar`)

Per importare gli eventi:

1.  fai clic con il tasto destro sul calendario di destinazione, quindi seleziona **Import events**

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_calendars1.png)

2.  seleziona il formato di importazione

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_calendars2.png)

3.  quindi scegli se vuoi eliminare tutti gli eventi esistenti e importare quelli nuovi, oppure aggiungere semplicemente i dati importati agli eventi di calendario già presenti

    ![image](/_static/user-manual/webtop/screenshots/webtop-import_calendars3.png)
