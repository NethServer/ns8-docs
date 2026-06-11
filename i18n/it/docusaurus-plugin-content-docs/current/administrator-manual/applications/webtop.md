---
title: WebTop groupware
sidebar_position: 5
---
# WebTop groupware

WebTop è un groupware completo che implementa Protocolli ActiveSync, CalDAV e CardDAV.

È possibile installare più istanze WebTop sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

WebTop ha bisogno di un host virtuale dedicato, un FQDN come `webtop.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedere alla pagina di configurazione dell'applicazione e inserire un FQDN valido all'interno del campo `Host virtuale WebTop (FQDN)`
2.  abilitare `Richiedi certificato Let's Encrypt`
3.  collegare l'istanza WebTop ad un `Mail server` esistente
4.  selezionare la `Localizzazione predefinita` e il `Fuso orario predefinito`
5.  cliccare sul pulsante **Save**

All'interno della sezione `Avanzate`, è inoltre possibile configurare:

- la modalità debug
- livelli di log
- memoria minima e massima
- [PEC Bridge](#pec-bridge) avvisare l'indirizzo (solo per le imprese)

## Utente amministratore {#webtop5_admin-section}

Dopo l'installazione, WebTop sarà accessibile utilizzando l'utente amministratore. L'utente amministratore può modificare le impostazioni globali e accedere come qualsiasi altro utente, tuttavia, non è un utente di sistema e non può accedere a qualsiasi altro servizio come Posta, Calendari, ecc.

Le credenziali di default sono:

- Utente: *admin*
- Password: *admin*

La password dell'utente dell'amministratore deve essere modificata dall'interfaccia di WebTop.

:::warning

Remember to change the admin password after installation!

:::

Per controllare la posta dell'account admin di sistema, utilizzare il seguente login: admin@\<dominio\> dove `<dominio>` è il TLD dell'FQDN.

**Esempio**

- Nome del server: mymail.mightydomain.com
- Utente: admin
- Login: <admin@mightydomain.com>

### Cambiare password di admin

Accedere a WebTop utilizzando l'utente `admin`, quindi aprire le impostazioni dell'utente facendo clic sul menu ![hamburger](/_static/webtop-hamburger.png) nell'angolo in alto a destra.

Andare in **Impostazioni** quindi fare clic su **Cambia password**.

## Modifica del logo

Per modificare e personalizzare il logo iniziale che appare nella pagina di login di WebTop, è necessario caricare il file immagine personalizzato sulle immagini pubbliche dell'utente amministratore e rinominarlo `login.png`.

Procedere come segue:

1.  login con l'utente admin di WebTop

2.  selezionare il servizio cloud e le immagini pubbliche:

    ![image](/_static/webtop-public_images.png)

3.  caricare l'immagine (tramite il pulsante Carica in basso a sinistra o semplicemente trascinando con un drag & drop)

4.  rename the loaded image so that its name is **"login.svg"** (use right click -\> Rename):

5.  il prossimo accesso mostrerà il nuovo logo nella pagina di login

### Custom logos for light and dark color schemes

It is possible to provide **custom logos for both light and dark modes** by uploading two different image files to the public cloud.

During the login process, the system looks for a custom login image using the following filename priority order:

1.  `login@{color-scheme}.svg`
2.  `login@{color-scheme}.png`
3.  `login@{color-scheme}.jpg`
4.  `login.svg`
5.  `login.jpg`
6.  `login.png`

Where `{color-scheme}` can be either `light` or `dark`.

Examples:

    login@dark.svg
    login@light.svg

If a color-scheme–specific image is not found, the system falls back to the generic `login.*` filenames.

## Automatic configuration of email clients {#email_autoconfig}

The [Autodiscover](https://learn.microsoft.com/en-us/previous-versions/office/office-2010/cc511507(v=office.14)#The%20Autodiscover%20XML%20schema) and [Autoconfig](https://wiki.mozilla.org/Thunderbird:Autoconfiguration) protocols allow email clients to automatically discover mail server settings, such as incoming and outgoing mail server addresses, ports, and authentication methods. This simplifies the configuration process for end users, as they do not need to manually enter server settings.

The Autodiscover and Autoconfig protocols are not supported by all email clients. For example, iOS devices do not support them, while clients like Thunderbird and Microsoft Outlook on Windows and Linux desktops, as well as Android devices, do support them. Some clients may still require manual configuration of server settings.

To enable automatic email client configuration, some DNS records and HTTP routes must be configured for the WebTop mail domain (e.g. `example.org`).

### A records

The A-type records are used by email clients to establish TLS connections, therefore their names must be associated with a valid TLS certificate.

- `mail.example.org`, `imap.example.org`, `smtp.example.org` must point to the public static IP of the **mail server**
- `autodiscover.example.org`, `autoconfig.example.org` must point to the public static IP of the **server hosting WebTop**.

### HTTP routes

To ensure that Autodiscover and Autoconfig requests are directed to the correct WebTop instance, you need to set up an HTTP route to the WebTop server. Navigate to **Settings** → **HTTP routes** from the [proxy page](../configuration/proxy.md). This configuration is necessary for A-type DNS records like `autodiscover.example.org` and `autoconfig.example.org` to be properly managed by the WebTop application.

Configure the HTTP route with the following parameters for both Autodiscover and Autoconfig:

- Name: `autodiscover_webtop` and `autoconfig_webtop`
- Node: Select the node where your WebTop instance is running
- URL: Copy the URL, including its specific port number, from the automatically generated WebTop HTTP route details (e.g. <http://127.0.0.1:20001>)
- Host: `autodiscover.example.org` and `autoconfig.example.org`
- Request Let's Encrypt certificate: Enable this option if you wish to use a Let's Encrypt certificate (optional)

### MX record

An MX-type record is also a Mail application requirement, as explained in [Impostazioni generali](mail.md#mail-general-settings). For the MX record of `example.org` Autodiscover prefers a name like `mail.example.org`.

### SRV record

This enables clients to locate the Autodiscover service using a SRV-type record.

- Name: `_autodiscover._tcp.example.org`
- Type: `SRV`
- Service: `_autodiscover`
- Protocol: `_tcp`
- TTL: `3600`
- Priority: `10`
- Weight: `10`
- Port: `443`
- Target: `autodiscover.example.org` -- the DNS A record pointing to the WebTop server.

## Etichette personalizzate

È possibile aggiungere una o più etichette nelle e-mail, in un evento di calendario o un'attività.

Ci sono due tipi di etichette:

- **Private**: non utilizzabile per campi personalizzati e non visibile ad altri utenti
- **Shared**: utilizzabile per pannelli di campi personalizzati e visibile ad altri utenti

L'utente può normalmente gestire solo etichette private. Per gestire le etichette condivise è necessario abilitare una specifica autorizzazione tramite il pannello di amministrazione:

- andare nel menù Amministrazione, quindi selezionare **Domini** - \> **NethServer** -\> **Gruppi** - \> **Utenti** - \> **Authorizzazioni**
- aggiungere (+) -\> **Servizio** -\> **com.sonicle.webtop.core (WebTop)** -\> **Contesto** -\> **TAGS** -\> **Azione** -\> **MANAGE**
- cliccare **OK** poi **Salve e chiudi**

È possibile gestire le etichette tramite il pulsante ![tools](/_static/webtop-tools.png) nell'angolo in alto a destra.

La stessa funzionalità può essere raggiunta anche dai singoli moduli facendo clic con il tasto destro -\> :guilabel: `Etichette` -\> **Gestisci etichette**.

La visibilità può essere impostata solo durante la creazione di etichette. Per modificare la visibilità dell'etichetta è necessario eliminare l'etichetta e crearla di nuovo.

Le etichette create possono essere utilizzate in qualsiasi altro modulo come Posta, Rubrica, Calendario e Attività.

## Campi personalizzati {#custom_fields-section}

Con i campi personalizzati, è possibile fornire informazioni e dati aggiuntivi per ogni contatto, evento o attività.

Custom fields are only available for the Address Book, Calendar, and Tasks modules and are specific to each different module.

In order to manage custom fields and their panels, the user must have a specific authorization, obtained through the administration panel:

- andare nel menù Amministrazione, quindi selezionare **Domini** - \> **NethServer** -\> **Gruppi** - \> **Utenti** - \> **Authorizzazioni**
- add (+) -\> **Services** -\> **com.sonicle.webtop.core (WebTop)** -\> **Resource** -\> **CUSTOM_FIELDS** -\> **Action** -\> **MANAGE**
- click **OK** then save and exit

Users who have this authorization will find the specific button available at the top right:

![image](/_static/webtop-cf1.png)

To create a new custom field it is necessary to fill in at least the **Name** field and select the **Type**:

![image](/_static/webtop-cf2.png)

For the **Name** field only alphanumeric characters (including `-` and `_`) are allowed. **Spaces are not allowed**. The **Description** field is used to add details to the field and the **Label** field represents the label that will be shown along with the field.

For each field it is possible to enable two options:

- **Show in search bar**: the field is added in the multiple search window (a new access will be required)
- **Show in preview**: the field is shown in the preview window of a contact

Additional specific properties, that are also customizable, are available for each type.

For the **List box** type it is necessary to fill in the values to be selected:

![image](/_static/webtop-cf4.png)

Using the **Clone** button you can copy the custom field to create similar ones:

![image](/_static/webtop-cf5.png)

:::note

With the **FREE version**, installed by default, it is possible to create up to a **maximum of 3 custom fields** for each different module (3 in Address Book + 3 in Calendar + 3 in Activities). To remove this limit it is necessary to upgrade to the **PREMIUM version** by purchasing a dedicated license on [Nethesis shop](https://nethshop.nethesis.it/product/campi-custom-webtop/)

:::

### Searches on custom fields

One of the best functionalities of custom fields is the possibility to perform multiple searches on all modules and fields for which the option **Show in search bar** has been activated.

## Custom panels

Custom panels display the [Campi personalizzati](#custom_fields-section) and associated them with resources.

Users with the authorization to manage custom fields can access the configuration panel using the button at the top right:

![image](/_static/webtop-panels.png)

When creating a new panel it is mandatory to indicate the **Name** that will appear in the resource. You can also insert a **Description** and a **Title**.

Using shared labels, you can easily assign panels to specific resource categories. A panel without an associated label will be visible for every available resource: all contacts, all events or all activities.

Use the **Add** button to add a custom field inside the panel.

## Mailcards

One of the main features of managing signatures on WebTop is the opportunity to integrate images or custom fields profiled per user.

To use the images you need to upload them to the public cloud through the WebTop admin user like this:

![image](/_static/webtop-public_images.png)

You can use the **Upload** button to load an image which is at the bottom or simply via drag & drop.

:::note

Remember that the public images inserted in the signature are actually connected with a public link. To be visible to email recipients, the server must be reachable remotely on port 80 (http) and its FQDN name must be publicly resolvable.

:::

Alternatively, you can configure a global setting to turn images automatically into inline attachments instead of public internet links.

It is possible to do this from web interface by accessing the administration panel -\> **Properties (system)** -\> **Add** -\> select **com.sonicle.webtop.mail (Mail)** and enter the data in the **Key** and **Value** fields according to the key to be configured:

`public.resource.links.as.inline.attachments` = true (default = false)

To change the signature, each user can access the `Settings --> Mail --> Editing --> Edit`:

![image](/_static/webtop-edit_mailcard.png)

You can use the uploaded image inside the mailcard with this button:

![image](/_static/webtop-public_signature.png)

:::note

The personal mailcard can be associated with the user or the mail address. Users with access to the mail address will also be able to use the mailcard.

:::

By accessing the user settings from the WebTop administration panel ( `Domains --> NethServer --> Users --> Right click on user` ) it is also possible to set up a general domain mailcard that will be automatically set for all users who have not configured their personal mailcard:

![image](/_static/webtop-domain_mailcard.png)

Furthermore, it will also be possible to modify personal details:

![image](/_static/webtop-personal_information.png)

that can be used within the template-based fields within the domain mailcard editor:

![image](/_static/webtop-mailcard_editor.png)

In this way it is possible to create a single mailcard that will be automatically customized for every user who does not use his own mailcard.

### Multiple mailcards

It is possible to configure multiple mailcards (HTML signatures) for each user.

Access the `Settings --> Mail --> Identities` and create multiple identities:

![image](/_static/webtop-sig_sig1.png)

To edit every single signature select `Settings --> Mail --> Identities` then select each individual signature and click on the **edit mailcard** button

![image](/_static/webtop-sig_sig2.png)

![image](/_static/webtop-sig_sig3.png)

to use multiple mailcards, create a new email, and choose the signature:

![image](/_static/webtop-sig_sig5.png)

## Customize proactive security on emails

The Proactive Security module (PAS) warns the end user of possible security risks and suspicious senders inside the emails. The user will also be warned when trying to open potentially dangerous attachments or links contained in emails.

The PAS function allows some customization both for the **end user** and the WebTop **admin**.

For the **end user** it is possible to mark a sender as trusted when it is recognized as such by the yellow shield. To do so, it is possible to click directly on the shield or right click on the sender and select the **Mark as trusted** entry.

:::note

This type of customization is only valid for the user that performed the action. It is possible to mark a sender as trusted only if the shield is yellow.

:::

The **admin user** can disable all or some of the rules that are part of the PAS (ProActive Security), both for single users and groups. To do so, it is necessary to add a specific authorization (to the single user or the group of users) for the Service `com.sonicle.webtop.mail (Mail)` and for the `PRO_ACTIVE_SECURITY` resource:

![image](/_static/webtop-pas1.png)

Below is an explanation of every single entry available as `Action` :

- `DISABLED`: completely disables PAS
- `NO_LINK_DOMAIN_CHECK`: do not check domains different from the sender’s domain
- `NO_MY_DOMAIN_CHECK`: do not verify if the sender’s domain is in my domain
- `NO_FREQUENT_CONTACT_CHECK`: do not check if the sender is in my contacts which are saved automatically
- `NO_ANY_CONTACTS_CHECK`: do not check if the sender is among one of my contacts
- `NO_FAKE_PATTERNS_CHECK`: do not verify the presence of false patterns in the sender (e.g. email address of the name shown is different from the sender’s email address)
- `NO_UNSUBSCRIBE_DIRECTIVES_CHECK`: do not check the entry for the unsubscribe directives to the mailing list (only if the spam status is green)
- `NO_DISPLAYNAME_CHECK`: do not compare the contact’s display name with the contact in my address book with the same email
- `NO_SPAM_SCORE_VISUALIZATION`: do not show/check the spam score displayed in the message header
- `NO_LINK_CLICK_PROMPT`: do not check the click action on links
- `NO_ZIP_CHECK`: do not give warning about zip attachments

This way it is possible to customize and create special profiles for some users who might not want all the actions to be active.

The administrator can also choose the list of **file extensions for attachments** which are considered a threat. As default, these are the extensions that are considered dangerous: `exe,bat,dll,com,cmd,bin,cab,js,jar`

To modify this list it is necessary to add this global setting:

- **Service** = `com.sonicle.webtop.mail`
- **Key** = `pas.dangerous.extensions`

For example, if you wanted to add the HTML extension among those that are considered dangerous, the value field should contain the following:

- **Value** = `exe,bat,dll,com,cmd,bin,cab,js,jar,html` (Values always need to be separated by a comma)

## Accesso utente e log di sessione utenti

La tabella che mostra l'intero registro di accessi e sessioni per ogni utente è disponibile sotto il pannello di amministratore. Accedere al menu: `Amministrazione`, poi **Domini** --\> **NethServer** --\> **Audit (dominio)** --\> **Log accessi**.

Per ogni accesso, la tabella riporta i seguenti dati nelle colonne: ID sessione, nome utente, data e ora, durata della sessione, stato di autenticazione ed eventuali errori di login.

È possibile abilitare la geolocalizzazione IP pubblica. In primo luogo, è necessario registrare un account su [ipstack](https://ipstack.com/) e ottenere la `API KEY` da inserire nel db di configurazione.

Login to the administration panel -\> **Properties (system)** -\> **add** -\> **com.sonicle.webtop.core (WebTop)** -\> enter the following data in the fields **Key** e **Value** :

- `geolocation.provider` = `ipstack`
- `geolocation.ipstack.apikey` = `<API KEY FROM PROVIDER>`

Poi, logout e un nuovo login. Per mostrare la geolocalizzazione IP cliccare sull'icona all'estrema destra della riga:

![image](/_static/webtop_geologip.png)

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

To change these default values for all users, the following keys can be added via the admin interface: **Properties (system) -> Add**. The value must be expressed in `bytes`. Example: `10MB = 10485760 bytes`.

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

## PECO Ponte {#pec-bridge}

:::note

Disponibile solo per Nethesis Enterprise

:::

PEC (Posta Elettronica Certificata) è ampiamente utilizzato in Italia come sostituto virtuale per posta raccomandata, in quanto detiene la stessa validità legale.

PECO Bridge è una funzione WebTop che integra caselle di posta PEC esterne con WebTop.

Se il sistema ha un attivo [Subscription](../about/subscription.md) sotto il piano Nethesis Enterprise, è possibile acquistare una licenza PEC Bridge attraverso la categoria **NethService** nel negozio online Nethesis.

Una volta completato l'acquisto, Nethesis fornirà istruzioni per attivare la licenza e configurare il ponte PEC.

Inside the Advanced settings of the WebTop administration panel, you can set the `PEC Bridge notify address` to receive notifications when a new PEC event is received.

### Customization

It's possible to customize the PEC Bridge behavior by setting the following environment variables:

- `PECBRIDGE_NOTIFY_OWNER`: indicates which notifications to send to the PEC account owner.  
  Possible values are:

  - `all`: all notifications sent to the PEC owner (this is the default if the variable is not set)
  - `auth`: only authentication failure notifications are sent to the PEC owner
  - `none`: no notifications are sent to the PEC owner

  All notifications will always be sent to the address configured in "PEC Bridge notify address", if configured.

- `PECBRIDGE_FROM_ADDRESS`: the email address used as the sender of the PEC Bridge notifications

To configure these variables, access the WebTop server via SSH and execute the following commands:

    runagent -m webtop1
    echo PECBRIDGE_FROM_ADDRESS=no-reply@test.org >> environment
    echo PECBRIDGE_NOTIFY_OWNER=auth >> environment
    systemctl --user restart pecbridge

Replace `webtop1` with the actual WebTop instance name.

Please note that the command above appends the variables to the `environment` file, use it only when customizing the environment variables for the first time. On next changes, edit the file directly using a text editor like `nano` or `vi`.

## NethVoice phonebook integration

Inside the WebTop application there is an automated workflow that allows to:

- export WebTop contacts to the NethVoice centralized phonebook
- import the NethVoice centralized phonebook to the WebTop contacts

The workflow is disabled by default, to enable it:

- make sure at least one NethVoice instance is installed inside the cluster
- in the `Settings` page, select the NethVoice instance from the `Synchronize Phonebook with NethVoice instance` field inside the `Advanced` section
- save the settings

The synchronization occurs every night, ensuring that the NethVoice centralized phonebook is regularly updated in WebTop. This automated process helps maintain consistency and accuracy between the two systems, allowing users to access the most current contact information without manual intervention.

### From WebTop to NethVoice

To add contacts from any WebTop 5 user address book to the NethVoice centralized phonebook, simply share it with the system **admin** user named *Admin (NethServer)*.

Users can voluntarily choose to share their contacts for import into the NethVoice phonebook. This operation must be performed individually by each user who wishes to share their contacts.

The user must follow these steps:

- open the `Contacts` section
- under the `My Categories` section, choose an address book to share, then click on the kebab menu (three dots) and select the `Sharing and Permissions` menu item
- a drawer will open on the right side of the screen, click the **Add** button
- in the search field, type `admin` and select the user from the list

:::note

The address book must be shared directly with the **admin** user. Sharing it with a group containing the **admin** user is not sufficient.

Ensure that only individual address books are shared and not the entire category, to prevent synchronization errors.

:::

### From NethVoice to WebTop

When the synchronization is active, the NethVoice centralized phonebook is imported into WebTop 5 every night.

Contacts are imported into a newly created address book named *Rubrica Centralizzata*, within the administrator user account, named *Builtin Administrator user*. The username corresponds to the one used to provision the user domain associated with the mail server connected to WebTop 5.

To allow other groupware users to access the address book, access with the administrator user and share it with the desired users or groups as *READ-ONLY*. To share it with all users, select the *Users* group.

It's possibile to override both the address book name and the user name by setting the following environment variables inside the `phonebook.env` file:

- `PHONEBOOK_WEBTOP_ADMIN`
- `PHONEBOOK_WEBTOP_FOLDER`

To do so, access the shell and enter the WebTop instance environment, replace *webtop1* with the actual WebTop instance name:

    runagent -m webtop1
    echo "PHONEBOOK_WEBTOP_ADMIN=myuser" >> phonebook.env
    echo "PHONEBOOK_WEBTOP_FOLDER=MyPhonebook" >> phonebook.env

On next synchronization, the address book will be created with the specified name and shared with the specified user.

Please note that the command above appends the variables to the `phonebook.env` file, use it only when customizing the environment variables for the first time. On next changes, edit the file directly using a text editor like `nano` or `vi`.

### Sincronizzazione manuale

To manually force synchronization and verify correct configuration, run the following command from the shell:

    runagent -m webtop1 systemctl --user start phonebook

Replace *webtop1* with the actual WebTop instance name.
