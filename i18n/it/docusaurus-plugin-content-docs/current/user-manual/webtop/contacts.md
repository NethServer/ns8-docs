---
title: Contatti
sidebar_position: 5
---
# Contatti

Usa questa sezione per sincronizzare, condividere, importare ed estendere le rubriche in WebTop.

## Sincronizzazione ActiveSync (EAS)

I dispositivi mobili possono essere sincronizzati usando ActiveSync. ActiveSync può essere usato solo per **contatti** e **calendari**.

Anche i contatti condivisi possono essere sincronizzati. Per la procedura completa di configurazione mobile, vedi [Calendario](./calendar.md#sincronizzazione-activesync-eas).

## Sincronizzazione CardDAV

Le rubriche possono essere sincronizzate tramite il protocollo CardDAV.

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

Il supporto CardDAV è integrato in iOS, quindi per configurarlo:

- vai in **Settings** -\> **Account and Password** -\> **Add account**
- seleziona **Other** -\> **Add CardDAV account**
- inserisci il nome del server (cioè *server.nethserver.org*), il nome utente completo (cioè *goofy@nethserver.org*) e la password

### Client desktop

**Thunderbird**

Per sincronizzare i contatti con CardDAV serve un add-on di terze parti come [Cardbook](https://addons.thunderbird.net/it/thunderbird/addon/cardbook/).

**Outlook**

Il plugin open source [CalDAV Synchronizer](https://caldavsynchronizer.org/) per Outlook supporta sia CardDAV sia CalDAV.

:::warning

WebTop è un **groupware client-less**: le sue funzionalità sono pienamente disponibili **solo usando l'interfaccia web**!

L'uso di CardDAV tramite client di terze parti **non può essere considerato un'alternativa all'interfaccia web**.

:::

## Condivisione dei contatti

Puoi condividere i tuoi contatti selezionando la rubrica che vuoi condividere -\> clic destro -\> **Sharing and permissions**. Seleziona l'utente destinatario della condivisione (o il gruppo) e abilita i permessi sia per la cartella sia per i singoli elementi.

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

## Sottoscrizione dei contatti remoti

WebTop supporta la sottoscrizione a contatti remoti usando CardDAV.

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

Per sincronizzare automaticamente puoi scegliere tra tre intervalli di tempo: 15, 30 e 60 minuti. La scelta dell'intervallo può essere fatta in fase di creazione oppure successivamente modificando le opzioni. Per farlo, fai clic con il tasto destro sulla rubrica, **Edit Category**, **Internet Addressbook**:

![image](/_static/user-manual/webtop/screenshots/webtop-sync_automatic.png)

#### Sincronizzazione manuale

Per aggiornare, ad esempio, una rubrica remota, fai clic con il tasto destro su di essa e poi seleziona la voce **Synchronize**:

![image](/_static/user-manual/webtop/screenshots/webtop-sync_google.png)

Per le rubriche CardDAV, puoi selezionare se eseguire una sincronizzazione completa oppure solo delle modifiche. Per farlo, fai clic con il tasto destro sulla rubrica e seleziona **Edit Category**:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_sync_google.png)

Seleziona la modalità desiderata accanto al pulsante di sincronizzazione:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_sync_google2.png)

## Importare contatti

WebTop supporta l'importazione di contatti da vari formati di file.

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

Se stai importando una rubrica esportata da Outlook, assicurati di impostare **Text qualifier** sul valore `"`:

![image](/_static/user-manual/webtop/screenshots/webtop-import_contacts3.png)
