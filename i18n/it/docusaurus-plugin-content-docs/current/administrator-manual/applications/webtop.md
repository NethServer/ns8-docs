---
title: Groupware WebTop
sidebar_position: 5
---
# Groupware WebTop

WebTop è un groupware completo che implementa i protocolli ActiveSync, CalDAV e CardDAV.

È possibile installare più istanze WebTop sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

WebTop ha bisogno di un host virtuale dedicato, un FQDN come `webtop.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedere alla pagina di configurazione dell'applicazione e inserire un FQDN valido all'interno del campo `Host virtuale WebTop (FQDN)`
2.  abilitare `Richiedi certificato Let's Encrypt`
3.  collegare l'istanza WebTop ad un `Mail server` esistente
4.  selezionare la `Localizzazione predefinita` e il `Fuso orario predefinito`
5.  cliccare sul pulsante **Salva**

All'interno della sezione `Avanzate`, è inoltre possibile configurare:

- la modalità debug
- livelli di log
- memoria minima e massima
- [PEC Bridge](#pec-bridge) indirizzo di notifica (solo Nethesis Enterprise)

## Utente amministratore {#webtop5_admin-section}

Dopo l'installazione, WebTop sarà accessibile utilizzando l'utente amministratore. L'utente amministratore può modificare le impostazioni globali e accedere come qualsiasi altro utente, tuttavia, non è un utente di sistema e non può accedere a qualsiasi altro servizio come Posta, Calendari, ecc.

Le credenziali di default sono:

- Utente: *admin*
- Password: *admin*

La password dell'utente dell'amministratore deve essere modificata dall'interfaccia di WebTop.

:::warning

Ricordare di cambiare la password di admin dopo l'installazione!

:::

Per controllare la posta dell'account admin di sistema, utilizzare il seguente login: admin@\<dominio\> dove `<dominio>` è la parte di dominio dell'FQDN del server.

**Esempio**

- Nome del server: mymail.mightydomain.com
- Utente: admin
- Login: <admin@mightydomain.com>

### Cambiare password di admin

Accedere a WebTop utilizzando l'utente `admin`, quindi aprire le impostazioni dell'utente facendo clic sul menu ![hamburger](/_static/user-manual/webtop/screenshots/webtop-hamburger.png) nell'angolo in alto a destra.

Andare in **Impostazioni** quindi fare clic su **Cambia password**.

## Modifica del logo

Per modificare e personalizzare il logo iniziale che appare nella pagina di login di WebTop, è necessario caricare il file immagine personalizzato sulle immagini pubbliche dell'utente amministratore e rinominarlo `login.png`.

Procedere come segue:

1.  login con l'utente admin di WebTop

2.  selezionare il servizio cloud e le immagini pubbliche:

    ![image](/_static/user-manual/webtop/screenshots/webtop-public_images.png)

3.  caricare l'immagine (tramite il pulsante Carica in basso a sinistra o semplicemente trascinando con un drag & drop)

4.  rinominare l'immagine caricata in modo che si chiami **"login.svg"** (usare il tasto destro -\> Rinomina):

5.  il prossimo accesso mostrerà il nuovo logo nella pagina di login

### Loghi personalizzati per schemi di colori chiaro e scuro

È possibile fornire **logo personalizzati sia per la modalità chiara sia per quella scura** caricando due file immagine diversi nel cloud pubblico.

Durante il processo di login, il sistema cerca un'immagine di login personalizzata seguendo il seguente ordine di priorità per i nomi dei file:

1.  `login@{color-scheme}.svg`
2.  `login@{color-scheme}.png`
3.  `login@{color-scheme}.jpg`
4.  `login.svg`
5.  `login.jpg`
6.  `login.png`

Dove `{color-scheme}` può essere `light` o `dark`.

Esempi:

    login@dark.svg
    login@light.svg

Se non viene trovata un'immagine specifica per la combinazione di colori, il sistema torna ai nomi di file generici `login.*`.

## Configurazione automatica dei client di posta {#email_autoconfig}

I protocolli [Autodiscover](https://learn.microsoft.com/en-us/previous-versions/office/office-2010/cc511507(v=office.14)#The%20Autodiscover%20XML%20schema) e [Autoconfig](https://wiki.mozilla.org/Thunderbird:Autoconfiguration) consentono ai client di posta di rilevare automaticamente le impostazioni del server di posta, come gli indirizzi dei server di posta in entrata e in uscita, le porte e i metodi di autenticazione. Questo semplifica il processo di configurazione per gli utenti finali, che non devono inserire manualmente le impostazioni del server.

I protocolli Autodiscover e Autoconfig non sono supportati da tutti i client di posta. Ad esempio, i dispositivi iOS non li supportano, mentre client come Thunderbird e Microsoft Outlook su desktop Windows e Linux, così come i dispositivi Android, li supportano. Alcuni client potrebbero comunque richiedere la configurazione manuale delle impostazioni del server.

Per abilitare la configurazione automatica dei client di posta, è necessario configurare alcuni record DNS e rotte HTTP per il dominio di posta di WebTop (ad es. `example.org`).

### Record A

I record di tipo A vengono utilizzati dai client di posta per stabilire connessioni TLS, pertanto i loro nomi devono essere associati a un certificato TLS valido.

- `mail.example.org`, `imap.example.org`, `smtp.example.org` devono puntare all'IP statico pubblico del **server di posta**
- `autodiscover.example.org`, `autoconfig.example.org` devono puntare all'IP statico pubblico del **server che ospita WebTop**.

### Route HTTP

Per garantire che le richieste Autodiscover e Autoconfig vengano indirizzate alla corretta istanza di WebTop, è necessario configurare una route HTTP verso il server WebTop. Navigare in **Impostazioni** → **Route HTTP** dalla [pagina proxy](../configuration/proxy.md). Questa configurazione è necessaria affinché i record DNS di tipo A come `autodiscover.example.org` e `autoconfig.example.org` siano correttamente gestiti dall'applicazione WebTop.

Configurare la route HTTP con i seguenti parametri sia per Autodiscover che per Autoconfig:

- Nome: `autodiscover_webtop` e `autoconfig_webtop`
- Nodo: selezionare il nodo su cui è in esecuzione l'istanza WebTop
- URL: copiare l'URL, incluso il numero di porta specifico, dai dettagli della route HTTP di WebTop generata automaticamente (ad es. <http://127.0.0.1:20001>)
- Host: `autodiscover.example.org` e `autoconfig.example.org`
- Richiedi certificato Let's Encrypt: abilitare questa opzione se si desidera utilizzare un certificato Let's Encrypt (facoltativo)

### Record MX

Un record di tipo MX è anche un requisito dell'applicazione Mail, come spiegato in [Impostazioni generali](mail.md#mail-general-settings). Per il record MX di `example.org` Autodiscover preferisce un nome come `mail.example.org`.

### Record SRV

Questo consente ai client di individuare il servizio Autodiscover tramite un record di tipo SRV.

- Nome: `_autodiscover._tcp.example.org`
- Tipo: `SRV`
- Servizio: `_autodiscover`
- Protocollo: `_tcp`
- TTL: `3600`
- Priorità: `10`
- Peso: `10`
- Porta: `443`
- Target: `autodiscover.example.org` -- il record DNS A che punta al server WebTop.

## Etichette personalizzate

È possibile aggiungere una o più etichette nelle e-mail, in un evento di calendario o un'attività.

Ci sono due tipi di etichette:

- **Private**: non utilizzabile per campi personalizzati e non visibile ad altri utenti
- **Shared**: utilizzabile per pannelli di campi personalizzati e visibile ad altri utenti

L'utente può normalmente gestire solo etichette private. Per gestire le etichette condivise è necessario abilitare una specifica autorizzazione tramite il pannello di amministrazione:

- andare nel menù Amministrazione, quindi selezionare **Domini** -\> **NethServer** -\> **Gruppi** -\> **Utenti** -\> **Autorizzazioni**
- aggiungere (+) -\> **Servizi** -\> **com.sonicle.webtop.core (WebTop)** -\> **Risorsa** -\> **TAGS** -\> **Azione** -\> **MANAGE**
- cliccare **OK** poi **Salva e chiudi**

È possibile gestire le etichette tramite il pulsante ![tools](/_static/user-manual/webtop/screenshots/webtop-tools.png) nell'angolo in alto a destra.

La stessa funzionalità può essere raggiunta anche dai singoli moduli facendo clic con il tasto destro -\> **Etichette** -\> **Gestisci etichette**.

La visibilità può essere impostata solo durante la creazione di etichette. Per modificare la visibilità dell'etichetta è necessario eliminare l'etichetta e crearla di nuovo.

Le etichette create possono essere utilizzate in qualsiasi altro modulo come Posta, Rubrica, Calendario e Attività.

## Campi personalizzati {#custom_fields-section}

Con i campi personalizzati, è possibile fornire informazioni e dati aggiuntivi per ogni contatto, evento o attività.

I campi personalizzati sono disponibili solo per i moduli Rubrica, Calendario e Attività e sono specifici per ciascun modulo diverso.

Per gestire i campi personalizzati e i relativi pannelli, l'utente deve avere un'autorizzazione specifica, ottenuta tramite il pannello di amministrazione:

- andare nel menù Amministrazione, quindi selezionare **Domini** -\> **NethServer** -\> **Gruppi** -\> **Utenti** -\> **Autorizzazioni**
- aggiungere (+) -\> **Servizi** -\> **com.sonicle.webtop.core (WebTop)** -\> **Risorsa** -\> **CUSTOM_FIELDS** -\> **Azione** -\> **MANAGE**
- cliccare **OK** poi salva e chiudi

Gli utenti che dispongono di questa autorizzazione troveranno il pulsante specifico disponibile in alto a destra:

![image](/_static/user-manual/webtop/screenshots/webtop-cf1.png)

Per creare un nuovo campo personalizzato è necessario compilare almeno il campo **Nome** e selezionare il **Tipo**:

![image](/_static/user-manual/webtop/screenshots/webtop-cf2.png)

Per il campo **Nome** sono consentiti solo caratteri alfanumerici (inclusi `-` e `_`). **Gli spazi non sono consentiti**. Il campo **Descrizione** viene utilizzato per aggiungere dettagli al campo e il campo **Etichetta** rappresenta l'etichetta che verrà mostrata insieme al campo.

Per ogni campo è possibile abilitare due opzioni:

- **Mostra nella barra di ricerca**: il campo viene aggiunto nella finestra di ricerca multipla (sarà necessario un nuovo accesso)
- **Mostra in anteprima**: il campo viene mostrato nella finestra di anteprima di un contatto

Per ogni tipo sono disponibili ulteriori proprietà specifiche, anch'esse personalizzabili.

Per il tipo **Casella di riepilogo** è necessario compilare i valori da selezionare:

![image](/_static/user-manual/webtop/screenshots/webtop-cf4.png)

Tramite il pulsante **Clona** è possibile copiare il campo personalizzato per crearne di simili:

![image](/_static/user-manual/webtop/screenshots/webtop-cf5.png)

:::note

Con la **versione FREE**, installata per impostazione predefinita, è possibile creare fino a un **massimo di 3 campi personalizzati** per ogni modulo diverso (3 in Rubrica + 3 in Calendario + 3 in Attività). Per rimuovere questo limite è necessario passare alla **versione PREMIUM** acquistando una licenza dedicata sul [negozio Nethesis](https://nethshop.nethesis.it/product/campi-custom-webtop/)

:::

### Ricerche nei campi personalizzati

Una delle migliori funzionalità dei campi personalizzati è la possibilità di eseguire ricerche multiple su tutti i moduli e i campi per cui è stata attivata l'opzione **Mostra nella barra di ricerca**.

## Pannelli personalizzati

I pannelli personalizzati visualizzano i [Campi personalizzati](#custom_fields-section) e li associano alle risorse.

Gli utenti con l'autorizzazione per gestire i campi personalizzati possono accedere al pannello di configurazione tramite il pulsante in alto a destra:

![image](/_static/user-manual/webtop/screenshots/webtop-panels.png)

Quando si crea un nuovo pannello è obbligatorio indicare il **Nome** che apparirà nella risorsa. È anche possibile inserire una **Descrizione** e un **Titolo**.

Utilizzando le etichette condivise, è possibile assegnare facilmente i pannelli a specifiche categorie di risorse. Un pannello senza un'etichetta associata sarà visibile per ogni risorsa disponibile: tutti i contatti, tutti gli eventi o tutte le attività.

Utilizzare il pulsante **Aggiungi** per aggiungere un campo personalizzato all'interno del pannello.

## Mailcard

Una delle principali funzionalità di gestione delle firme su WebTop è la possibilità di integrare immagini o campi personalizzati profilati per utente.

Per utilizzare le immagini è necessario caricarle nel cloud pubblico tramite l'utente admin di WebTop nel seguente modo:

![image](/_static/user-manual/webtop/screenshots/webtop-public_images.png)

È possibile utilizzare il pulsante **Carica** per caricare un'immagine che si trova in basso, oppure semplicemente tramite drag & drop.

:::note

Ricordare che le immagini pubbliche inserite nella firma sono in realtà collegate con un link pubblico. Per essere visibili ai destinatari delle e-mail, il server deve essere raggiungibile da remoto sulla porta 80 (http) e il suo nome FQDN deve essere risolvibile pubblicamente.

:::

In alternativa, è possibile configurare un'impostazione globale per trasformare automaticamente le immagini in allegati inline anziché in link pubblici su Internet.

È possibile farlo dall'interfaccia web accedendo al pannello di amministrazione -\> **Proprietà (sistema)** -\> **Aggiungi** -\> selezionare **com.sonicle.webtop.mail (Mail)** e inserire i dati nei campi **Chiave** e **Valore** in base alla chiave da configurare:

`public.resource.links.as.inline.attachments` = true (default = false)

Per modificare la firma, ogni utente può accedere a `Impostazioni --> Posta --> Modifica --> Modifica`:

![image](/_static/user-manual/webtop/screenshots/webtop-edit_mailcard.png)

È possibile utilizzare l'immagine caricata all'interno della mailcard con questo pulsante:

![image](/_static/user-manual/webtop/screenshots/webtop-public_signature.png)

:::note

La mailcard personale può essere associata all'utente o all'indirizzo e-mail. Gli utenti con accesso all'indirizzo e-mail potranno anche utilizzare la mailcard.

:::

Accedendo alle impostazioni utente dal pannello di amministrazione di WebTop ( `Domini --> NethServer --> Utenti --> Clic destro sull'utente` ) è anche possibile configurare una mailcard di dominio generale che verrà impostata automaticamente per tutti gli utenti che non hanno configurato la propria mailcard personale:

![image](/_static/user-manual/webtop/screenshots/webtop-domain_mailcard.png)

Inoltre, sarà anche possibile modificare i dati personali:

![image](/_static/user-manual/webtop/screenshots/webtop-personal_information.png)

che possono essere utilizzati all'interno dei campi basati su template nell'editor della mailcard di dominio:

![image](/_static/user-manual/webtop/screenshots/webtop-mailcard_editor.png)

In questo modo è possibile creare una singola mailcard che verrà personalizzata automaticamente per ogni utente che non utilizza la propria mailcard.

### Mailcard multiple

È possibile configurare più mailcard (firme HTML) per ogni utente.

Accedere a `Impostazioni --> Posta --> Identità` e creare più identità:

![image](/_static/user-manual/webtop/screenshots/webtop-sig_sig1.png)

Per modificare ogni singola firma selezionare `Impostazioni --> Posta --> Identità`, quindi selezionare ogni singola firma e fare clic sul pulsante **modifica mailcard**

![image](/_static/user-manual/webtop/screenshots/webtop-sig_sig2.png)

![image](/_static/user-manual/webtop/screenshots/webtop-sig_sig3.png)

per utilizzare più mailcard, creare una nuova e-mail e scegliere la firma:

![image](/_static/user-manual/webtop/screenshots/webtop-sig_sig5.png)

## Personalizzare la sicurezza proattiva sulle e-mail

Il modulo di Sicurezza Proattiva (PAS) avvisa l'utente finale di possibili rischi per la sicurezza e mittenti sospetti nelle e-mail. L'utente verrà avvisato anche quando tenta di aprire allegati o link potenzialmente pericolosi contenuti nelle e-mail.

La funzione PAS consente alcune personalizzazioni sia per l'**utente finale** che per l'**admin** di WebTop.

Per l'**utente finale** è possibile contrassegnare un mittente come attendibile quando viene riconosciuto come tale dallo scudo giallo. Per farlo, è possibile fare clic direttamente sullo scudo oppure fare clic con il tasto destro sul mittente e selezionare la voce **Contrassegna come attendibile**.

:::note

Questo tipo di personalizzazione è valido solo per l'utente che ha eseguito l'azione. È possibile contrassegnare un mittente come attendibile solo se lo scudo è giallo.

:::

L'**utente admin** può disabilitare tutte o alcune delle regole che fanno parte del PAS (ProActive Security), sia per singoli utenti che per gruppi. Per farlo, è necessario aggiungere una specifica autorizzazione (al singolo utente o al gruppo di utenti) per il Servizio `com.sonicle.webtop.mail (Mail)` e per la risorsa `PRO_ACTIVE_SECURITY`:

![image](/_static/user-manual/webtop/screenshots/webtop-pas1.png)

Di seguito è riportata la spiegazione di ogni singola voce disponibile come `Azione`:

- `DISABLED`: disabilita completamente il PAS
- `NO_LINK_DOMAIN_CHECK`: non controllare i domini diversi dal dominio del mittente
- `NO_MY_DOMAIN_CHECK`: non verificare se il dominio del mittente è nel mio dominio
- `NO_FREQUENT_CONTACT_CHECK`: non controllare se il mittente è tra i miei contatti salvati automaticamente
- `NO_ANY_CONTACTS_CHECK`: non controllare se il mittente è tra uno dei miei contatti
- `NO_FAKE_PATTERNS_CHECK`: non verificare la presenza di falsi pattern nel mittente (es. l'indirizzo e-mail del nome mostrato è diverso dall'indirizzo e-mail del mittente)
- `NO_UNSUBSCRIBE_DIRECTIVES_CHECK`: non controllare la voce per le direttive di annullamento iscrizione alla mailing list (solo se lo stato spam è verde)
- `NO_DISPLAYNAME_CHECK`: non confrontare il nome visualizzato del contatto con il contatto nella mia rubrica con la stessa e-mail
- `NO_SPAM_SCORE_VISUALIZATION`: non mostrare/controllare il punteggio spam visualizzato nell'intestazione del messaggio
- `NO_LINK_CLICK_PROMPT`: non controllare l'azione di clic sui link
- `NO_ZIP_CHECK`: non dare avviso sugli allegati zip

In questo modo è possibile personalizzare e creare profili speciali per alcuni utenti che potrebbero non voler avere tutte le azioni attive.

L'amministratore può anche scegliere l'elenco delle **estensioni di file per gli allegati** considerati una minaccia. Per impostazione predefinita, queste sono le estensioni considerate pericolose: `exe,bat,dll,com,cmd,bin,cab,js,jar`

Per modificare questo elenco è necessario aggiungere questa impostazione globale:

- **Servizio** = `com.sonicle.webtop.mail`
- **Chiave** = `pas.dangerous.extensions`

Ad esempio, se si volesse aggiungere l'estensione HTML tra quelle considerate pericolose, il campo valore dovrebbe contenere quanto segue:

- **Valore** = `exe,bat,dll,com,cmd,bin,cab,js,jar,html` (i valori devono essere sempre separati da una virgola)

## Accesso utente e log di sessione utenti

La tabella che mostra l'intero registro di accessi e sessioni per ogni utente è disponibile sotto il pannello di amministratore. Accedere al menu: `Amministrazione`, poi **Domini** --\> **NethServer** --\> **Audit (dominio)** --\> **Log accessi**.

Per ogni accesso, la tabella riporta i seguenti dati nelle colonne: ID sessione, nome utente, data e ora, durata della sessione, stato di autenticazione ed eventuali errori di login.

È possibile abilitare la geolocalizzazione IP pubblica. In primo luogo, è necessario registrare un account su [ipstack](https://ipstack.com/) e ottenere la `API KEY` da inserire nel db di configurazione.

Accedere al pannello di amministrazione -\> **Proprietà (sistema)** -\> **aggiungi** -\> **com.sonicle.webtop.core (WebTop)** -\> inserire i seguenti dati nei campi **Chiave** e **Valore**:

- `geolocation.provider` = `ipstack`
- `geolocation.ipstack.apikey` = `<API KEY FROM PROVIDER>`

Poi, logout e un nuovo login. Per mostrare la geolocalizzazione IP cliccare sull'icona all'estrema destra della riga:

![image](/_static/user-manual/webtop/screenshots/webtop_geologip.png)

**Impersonate login**

Per impostazione predefinita, i login effettuati tramite impersonate (`admin!<user>`) non vengono visualizzati nella tabella dei log di accesso. Per aggiungere anche questo tipo di accesso, è necessario aggiungere la seguente chiave per il servizio core:

> - `chiave` = `audit.logimpersonated`
> - `valore` = `true`

## Limite massimo della dimensione del file

Ci sono limiti predefiniti relativi alla dimensione massima del file:

- Dimensione massima del file per gli upload di chat (impostazione predefinita interna = 10 MB)
- Dimensione massima del singolo file allegato nel messaggio (impostazione predefinita interna = 10 MB)
- Dimensione massima del file per caricamenti interni nel cloud (impostazione predefinita interna = 500 MB)
- Dimensione massima del file per gli upload pubblici nel cloud (impostazione predefinita interna = 100 MB)

Per modificare questi valori predefiniti per tutti gli utenti, è possibile aggiungere le seguenti chiavi tramite l'interfaccia admin: **Proprietà (sistema) -> Aggiungi**. Il valore deve essere espresso in `bytes`. Esempio: `10MB = 10485760 bytes`.

**Dimensione massima del file per gli upload delle chat**

- Servizio: `com.sonicle.webtop.core`
- Chiave: `im.upload.maxfilesize`

**Dimensione massima del singolo file allegato nel messaggio**

- Servizio: `com.sonicle.webtop.mail`
- Chiave: `attachment.maxfilesize`

**Dimensione massima del file per caricamenti interni sul cloud**

- Servizio: `com.sonicle.webtop.vfs`
- Chiave: `upload.private.maxfilesize`

**Dimensione massima del file per gli upload pubblici sul cloud**

- Servizio: `com.sonicle.webtop.vfs`
- Chiave: `upload.public.maxfilesize`

## PEC Bridge {#pec-bridge}

:::note

Disponibile solo per Nethesis Enterprise

:::

PEC (Posta Elettronica Certificata) è ampiamente utilizzato in Italia come sostituto virtuale per posta raccomandata, in quanto detiene la stessa validità legale.

PEC Bridge è una funzione WebTop che integra caselle di posta PEC esterne con WebTop.

Se il sistema ha una [Sottoscrizione](../about/subscription.md) attiva con il piano Nethesis Enterprise, è possibile acquistare una licenza PEC Bridge attraverso la [categoria NethService](https://nethshop.nethesis.it/product-category/nethservice/) nel negozio online Nethesis.

Una volta completato l'acquisto, Nethesis fornirà le istruzioni per attivare la licenza e configurare il PEC Bridge.

Nelle impostazioni Avanzate del pannello di amministrazione di WebTop, è possibile impostare l'`Indirizzo di notifica PEC Bridge` per ricevere notifiche quando viene ricevuto un nuovo evento PEC.

### Personalizzazione

È possibile personalizzare il comportamento del PEC Bridge impostando le seguenti variabili d'ambiente:

- `PECBRIDGE_NOTIFY_OWNER`: indica quali notifiche inviare al proprietario dell'account PEC.
  I valori possibili sono:

  - `all`: tutte le notifiche vengono inviate al proprietario PEC (questo è il valore predefinito se la variabile non è impostata)
  - `auth`: vengono inviate al proprietario PEC solo le notifiche di errore di autenticazione
  - `none`: nessuna notifica viene inviata al proprietario PEC

  Tutte le notifiche verranno sempre inviate all'indirizzo configurato in "Indirizzo di notifica PEC Bridge", se configurato.

- `PECBRIDGE_FROM_ADDRESS`: l'indirizzo e-mail utilizzato come mittente delle notifiche PEC Bridge

Per configurare queste variabili, accedere al server WebTop tramite SSH ed eseguire i seguenti comandi:

    runagent -m webtop1
    echo PECBRIDGE_FROM_ADDRESS=no-reply@test.org >> environment
    echo PECBRIDGE_NOTIFY_OWNER=auth >> environment
    systemctl --user restart pecbridge

Sostituire `webtop1` con il nome effettivo dell'istanza WebTop.

Notare che il comando precedente aggiunge le variabili al file `environment`; utilizzarlo solo quando si personalizzano le variabili d'ambiente per la prima volta. Per le modifiche successive, modificare direttamente il file utilizzando un editor di testo come `nano` o `vi`.

## Integrazione rubrica NethVoice

All'interno dell'applicazione WebTop è presente un flusso di lavoro automatizzato che consente di:

- esportare i contatti WebTop nella rubrica centralizzata di NethVoice
- importare la rubrica centralizzata di NethVoice nei contatti WebTop

Il flusso di lavoro è disabilitato per impostazione predefinita; per abilitarlo:

- assicurarsi che almeno un'istanza di NethVoice sia installata nel cluster
- nella pagina `Impostazioni`, selezionare l'istanza NethVoice nel campo `Sincronizza rubrica con istanza NethVoice` all'interno della sezione `Avanzate`
- salvare le impostazioni

La sincronizzazione avviene ogni notte, garantendo che la rubrica centralizzata di NethVoice venga aggiornata regolarmente in WebTop. Questo processo automatizzato aiuta a mantenere coerenza e precisione tra i due sistemi, consentendo agli utenti di accedere alle informazioni di contatto più aggiornate senza intervento manuale.

### Da WebTop a NethVoice

Per aggiungere contatti da qualsiasi rubrica utente di WebTop 5 alla rubrica centralizzata di NethVoice, è sufficiente condividerla con l'utente **admin** di sistema denominato *Admin (NethServer)*.

Gli utenti possono scegliere volontariamente di condividere i propri contatti per l'importazione nella rubrica NethVoice. Questa operazione deve essere eseguita individualmente da ogni utente che desidera condividere i propri contatti.

L'utente deve seguire questi passaggi:

- aprire la sezione `Contatti`
- nella sezione `Le mie categorie`, scegliere una rubrica da condividere, quindi fare clic sul menu kebab (tre punti) e selezionare la voce `Condivisione e autorizzazioni`
- si aprirà un pannello laterale sul lato destro della schermata; fare clic sul pulsante **Aggiungi**
- nel campo di ricerca, digitare `admin` e selezionare l'utente dall'elenco

:::note

La rubrica deve essere condivisa direttamente con l'utente **admin**. Condividerla con un gruppo contenente l'utente **admin** non è sufficiente.

Assicurarsi di condividere solo le singole rubriche e non l'intera categoria, per evitare errori di sincronizzazione.

:::

### Da NethVoice a WebTop

Quando la sincronizzazione è attiva, la rubrica centralizzata di NethVoice viene importata in WebTop 5 ogni notte.

I contatti vengono importati in una rubrica di nuova creazione denominata *Rubrica Centralizzata*, nell'account dell'utente amministratore, denominato *Builtin Administrator user*. Il nome utente corrisponde a quello utilizzato per il provisioning del dominio utente associato al server di posta connesso a WebTop 5.

Per consentire ad altri utenti del groupware di accedere alla rubrica, accedere con l'utente amministratore e condividerla con gli utenti o i gruppi desiderati come *SOLA LETTURA*. Per condividerla con tutti gli utenti, selezionare il gruppo *Users*.

È possibile sovrascrivere sia il nome della rubrica che il nome utente impostando le seguenti variabili d'ambiente all'interno del file `phonebook.env`:

- `PHONEBOOK_WEBTOP_ADMIN`
- `PHONEBOOK_WEBTOP_FOLDER`

Per farlo, accedere alla shell ed entrare nell'ambiente dell'istanza WebTop, sostituendo *webtop1* con il nome effettivo dell'istanza WebTop:

    runagent -m webtop1
    echo "PHONEBOOK_WEBTOP_ADMIN=myuser" >> phonebook.env
    echo "PHONEBOOK_WEBTOP_FOLDER=MyPhonebook" >> phonebook.env

Alla successiva sincronizzazione, la rubrica verrà creata con il nome specificato e condivisa con l'utente specificato.

Notare che il comando precedente aggiunge le variabili al file `phonebook.env`; utilizzarlo solo quando si personalizzano le variabili d'ambiente per la prima volta. Per le modifiche successive, modificare direttamente il file utilizzando un editor di testo come `nano` o `vi`.

### Sincronizzazione manuale

Per forzare manualmente la sincronizzazione e verificare la configurazione corretta, eseguire il seguente comando dalla shell:

    runagent -m webtop1 systemctl --user start phonebook

Sostituire *webtop1* con il nome effettivo dell'istanza WebTop.
