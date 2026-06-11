---
title: Mail
sidebar_position: 2
---
# Mail

The Mail application is split into four main parts:

- [Postfix](https://www.postfix.org), un server SMTP per l'invio e la ricezione di messaggi di posta.
- [Dovecot](https://www.dovecot.org), un server IMAP e POP3 per leggere e-mail, con lingua Sieve per organizzarlo.
- [Rspamd](https://rspamd.com), an antispam filter, antivirus and attachments blocker.
- [ClamAV](http://www.clamav.net), un motore antivirus.

I vantaggi sono:

- completa autonomia nella gestione elettronica della posta
- evitare problemi a causa del Servizio Provider internet
- capacità di tracciare il percorso dei messaggi al fine di rilevare errori
- antivirus ottimizzato e scansione antispam

:::warning

Anche se Software Center permette di installare più istanze di Mail sullo stesso nodo, è possibile configurare e avviare solo un'istanza di server di posta per nodo, altrimenti si verifica un errore di conflitto della porta TCP.

:::

Un'istanza Mail può essere integrata con altre applicazioni. Per esempio:

- [WebTop](webtop.md) groupware.
- [Roundcube](roundcube.md) web mail client.
- [Imapsync](imapsync.md) schedules periodical fetch jobs or migrates emails from external IMAP servers to local user mailboxes.
- [Piler](piler.md) archivia qualsiasi messaggio inviato o ricevuto da Mail con il protocollo SMTP.

## Configurazione

Mail requires at least one [user domain](../installation/user_domains.md) already configured.

La prima procedura guidata di configurazione richiederà le seguenti informazioni:

- `Mail server hostname`: insert the mail server name, this should be the same name configured inside your [MX DNS record](https://en.wikipedia.org/wiki/MX_record).
- `Primary mail domain`: insert the mail domain, like `nethserver.org`; you will be able to add more domains later.

Quindi, selezionare il dominio utente da collegare al server di posta. Un indirizzo email verrà creato per ogni utente del dominio selezionato.

## Domini {#email_domains}

Mail can handle an unlimited number of mail domains, which are configurable from the `Domains` page.

:::note

Deleting a domain does not delete any existing emails; all previously received messages are preserved.

:::

To add a new domain, click the **Create domain** button and enter the domain name, such as `mymail.org`, in the `Name` field.

You can define the domain’s email addresses by inheriting user and group names from the LDAP user domain using the following options:

- `Add user addresses from user domain`
- `Add group addresses from user domain`

If the corresponding option is enabled, user and group names are treated as valid email addresses. In the rare case where a user and a group share the same name, incoming messages addressed to that name are always delivered to the group members.

Additional email addresses for the domain can also be configured, as explained in section [Addresses](#email_addresses).

Under the `Advanced` section, the `Accept unknown recipients` switch controls how to handle messages addressed to undefined recipients within the domain. By default, such messages are rejected. However, in some scenarios—such as during a mail domain migration—it may be useful to accept these messages and deliver them silently to a catch-all mailbox. This behavior can be enabled by turning on the `Accept unknown recipients` option.

### DKIM signature

DomainKeys Identified Mail ([DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)) validates the identity of the sending MTA by adding a cryptographic signature to the message's MIME headers.

In the `Domains` page, click the three-dots menu on the domain card and select `Configure DKIM` to enable or disable the DKIM signature for messages. By default, DKIM signing is enabled for every domain, and the key value is displayed in both raw and Bind-compatible "zone file" formats.

DKIM signature headers are added only to messages sent through TCP ports 587 (submission) and 465 (smtps) when the "From" header matches one of the configured domains.

Per DKIM funzionare correttamente, assicurarsi che il DNS pubblico sia configurato come segue, utilizzando le istruzioni fornite dal provider DNS:

1.  Add a TXT record with the key `default._domainKey` to your public DNS service.
2.  Copy the key text provided and paste it into the DNS record data (RDATA) field.

Per proteggere ulteriormente dallo spoofing del dominio della posta, considerare l'aggiunta di record DNS per [DMARC](https://en.wikipedia.org/wiki/DMARC) (Autenticazione dei messaggi, Reporting e Conformance) e [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) (Sender Policy Framework).

## Mailboxes {#mail-mailboxes-settings}

Each user has a personal mailbox and any user name in the form *\<username\>@\<domain\>* is also a valid email address to deliver messages into it.

The list of mailboxes is shown on the `Mailboxes` page. There are two types of mailboxes: users and public mailboxes.

### Users mailboxes

You can disable each mailbox by selecting the `Disable` item from the three-dots menu on the mailbox line.

By clicking the `Edit` item from the three-dots menu it's possible to setup the following options:

- `Forward messages`: forward all messages to another email address
- `Custom mailbox quota`: override the quota configured from the [Settings](#mail_settings-section)
- `Custom spam retention`: override the retention configured from the [Settings](#mail_settings-section)

### Public mailboxes

Public mailboxes can be shared among groups of users. The **Create public mailbox** button allows creating a new public mailbox and defining one or more owning groups and users. Public mailboxes can also be created by any IMAP client supporting IMAP ACL protocol extension (RFC 4314).

When a new public mailbox is created, the mail server will automatically add a new address for all existing mail domains.

### Restore a mailbox folder from a backup {#mailbox-selective-restore}

Se l'applicazione ha una o più destinazioni di backup configurate e un backup è già stato eseguito, è possibile cercare e ripristinare una cartella casella di posta da un'istantanea di backup passata di un utente specifico o una casella di posta pubblica.

:::warning

La procedura non calcola l'utilizzo dello spazio su disco necessario per il ripristino. Assicurare sufficiente spazio su disco è disponibile prima di procedere.

:::

1.  Navigare all'istanza di applicazione Mail e aprire la pagina Mailboxes. Scegliere il `User mailboxes` o `Public mailboxes` scheda per visualizzare un elenco di caselle di posta. Dal menu a tre punti della casella di posta desiderata, selezionare `Restore folder`.

2.  Selezionare la destinazione di backup da cui ripristinare la cartella. Caricamento di destinazioni remote può richiedere un po 'di tempo.

3.  Scegliere la data dell'istantanea di backup da ripristinare. Le istanze sono elencate da più nuovo a più vecchio.

4.  Selezionare una cartella dall'elenco o iniziare a digitare il suo nome per filtrare l'elenco.

    Premere **Restore** per avviare il processo di ripristino.

La cartella selezionata verrà ripristinata in una sottocartella della casella di posta denominata "cartella ripristinata". Se la sottocartella già esiste, verrà rimossa prima del ripristino.

Se la quota della casella di posta viene superata durante il processo di ripristino, sarà impostata al illimitato.

## Addresses {#email_addresses}

In addition to the users, groups and public mailboxes addresses, described in the previous section, the system enables the creation of an unlimited number of email addresses, from the `Addresses` page. Each mail address is associated with one or more destinations. A destination can be of the following types:

- user mailbox
- public mailbox
- external email address

A mail address can be specific to one mail domain, or generic to all configured mail domains. In the latter case, we call it a "wildcard address". For example:

- Due domini sono configurati, *mydomain.net* e *example.com*
- A specific email address *goofy* for domain *example.com* corresponds to *goofy@example.com*.
- A wildcard email address *info* is bound to all domains: it is equivalent to both *info@mydomain.net* and *info@example.com*.

Sometimes a company forbids communications from outside the organization using personal email addresses. To change the *visibility* of an address, click on the three-dots menu and select the `Set as internal` action shortcut, or select `Edit` and enable the `Internal` check box under the `Advanced` section.

When an address is *internal* it cannot receive messages from the outside. Still an *internal* address can be used to exchange messages with other accounts of the system.

## Filter {#email_filter}

All transiting email messages are subjected to a list of checks that fall into two main categories, described in the following sections:

- Antivirus
- Antispam

Navigate to the `Filter` page to adjust their settings.

### Antivirus {#anti-virus}

The ClamAV antivirus component finds email messages containing viruses. Infected messages are discarded. The virus signature database is checked for updates every hour.

Il database delle firme ClamAV predefinito è normalmente disabilitato perché consuma una grande quantità di memoria. Selezionare la casella di controllo `Enable ClamAV firma ufficiale` se desiderato.

Le firme non ufficiali ClamAV sono sempre attive. È possibile scegliere il livello di punteggio di firma desiderato tra *Low*, *Medium*, *High*. Tenete a mente che le valutazioni superiori possono portare a false partite positive indesiderate, quindi i buoni messaggi possono essere bloccati.

Signature updates are fetched from third-party ClamAV signature sites; see [Mail outbound connections](#mail-outbound-connections).

### Antispam {#antispam-section}

The antispam component Rspamd analyzes emails by detecting and classifying [spam messages](https://en.wikipedia.org/wiki/Spamming) using heuristic criteria, predetermined rules and statistical evaluations of the content of messages.

The filter can also check if the sending server is listed in one or more DNS-based block lists (or [DNSBL](https://en.wikipedia.org/wiki/Domain_Name_System_blocklist)). A score is associated with each rule. The check generates outbound DNS queries to third-party DNS servers; see [Mail outbound connections](#mail-outbound-connections).

Statistical (or [Bayesian](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering)) filters, are special rules that evolve and quickly adapt analyzing messages marked as **spam** or **ham**.

Total spam score collected at the end of the analysis allows the server to decide what to do with a message.

Le soglie del punteggio spam possono essere configurate nella sezione `Antispam` della pagina `Filter`.

- `Spam soglia di bandiera` determina il valore del punteggio in cui un messaggio è contrassegnato come spam. Quando un messaggio ha la bandiera spam impostare la conseguente azione di consegna dipende dalle impostazioni generali di [mailboxes](#mail-mailboxes-settings).
- `Deny message spam threshold` instead regulates the score that is considered too high to accept a message. If the score exceeds this value, the filter rejects the message completely.
- Sotto la sezione `Advanced` è possibile abilitare la `Greylist soglia`. Quando il punteggio del messaggio supera questo limite il filtro chiede al mittente di riprovare la consegna del messaggio in un secondo momento. Il metodo di lotta antispam *Greylist* presuppone che gli spammer non gradiscano i retries di consegna. È disabilitato per impostazione predefinita perché introduce ritardi di consegna anche per i mittenti legittimi.

In alcuni casi, un client di posta elettronica, un destinatario o un mittente deve bypassare i controlli del filtro: la sezione `Bypass Rules` consente di definire un insieme di regole in base ai criteri di follwing:

- Invia indirizzo IP o rete (formato CIDR).
- Complete sender email address.
- Sender email domain (exact match).
- Complete recipient email address.
- Recipiente dominio e-mail (incontro esatto).

Note that address and domain-based rules match the *envelope sender address*, which may differ from the message's "From" address in some cases (e.g. mailing lists).

To view message details such as the envelope sender address, access advanced settings, or review recent Rspamd activity, see [Rspamd web interface](#rspamd-web-interface).

The Bayesian statistical filters can then be trained with any IMAP client by simply moving a message in and out of the Junk folder. As a prerequisite, the Junk folder must be enabled, as explained in [Mailboxes](#mail-mailboxes-settings).

- Con *putando un messaggio nella cartella Junk*, i filtri imparano che è spam e assegnerà un punteggio più alto a messaggi simili.
- Al contrario, con *getting un messaggio da Junk*, i filtri imparano che è prosciutto: la prossima volta verrà assegnato un punteggio più basso.

Tutti gli utenti possono formare i filtri utilizzando questa tecnica.

:::note

È una buona abitudine controllare frequentemente la cartella Junk al fine di non perdere email erroneamente riconosciuto come spam.

:::

La formazione del filtro baiese si applica a tutti gli utenti del sistema, non solo l'utente che ha segnato un'email come spam o prosciutto.

È importante capire come funzionano veramente i test Bayesian:

- Non contrassegna i messaggi come spam se contengono un soggetto specifico o un indirizzo del mittente. È solo la raccolta di caratteristiche specifiche del messaggio.

- Un messaggio può essere contrassegnato solo una volta. Se lo stesso messaggio è contrassegnato più volte, non influenzerà nulla come i test dinamici sono già stati addestrati da quel messaggio.

- The Bayesian filter **is not active until it has received enough information. This includes a minimum of 200 spams AND 200 hams (false positives).**

  Poiché il sistema riceve tali informazioni, il progresso della formazione del filtro bayesian può essere monitorato dall'interfaccia web Rspamd.

### Rspamd web interface {#rspamd-web-interface}

The Rspamd web interface can be opened by clicking the **Open Rspamd** button in the top-right corner of the Filter page or by browsing to `https://<yourIP>/rspamd` or `https://<yourFQDN>/rspamd`. You will need your cluster-admin credentials to log in.

It provides access to the advanced configurations and overviews of Rspamd, for example the **Scan/Learn** tab to train Rspamd or the **History** tab to view and analyze incoming emails.

The **Configuration** tab contains lists at the bottom. Rejecting emails can be configured here.

To reject emails by specific sender email addresses, the `/var/lib/rspamd/block_sender.map` list needs to be configured, for example to add `user@domain.tld`.

To reject emails by domain, add for example `domain.tld` to the `/var/lib/rspamd/block_sender_domain.map` list.

To reject emails by top-level domain or domain suffix, `.tld` or `.domain.tld` may be added to the `/var/lib/rspamd/block_sender_domain_suffix.map` list.

Do not modify the other lists, as they are preconfigured.

## Coda

The `Queue` page shows the status of the Postfix mail queue. Under normal conditions the queue should be empty because messages are immediately exchanged between mail servers.

Se la coda di posta contiene alcuni messaggi, cercare di fare clic sul pulsante **Refresh** per controllare rapidamente se la condizione è temporanea.

In alternativa, avviare un nuovo tentativo di consegna immediato con il pulsante **Resend all**, o rimuovere tutti i messaggi dalla coda con **Delete all**.

The same actions can be selectively executed for each message in the queue, from its three-dots menu. The message delay reason, queue ID, arrival time, size, sender, and recipients can be inspected with the `See details` action.

:::tip

The `Message ID` value can be used to search the message in both [Rspamd web interface](#antispam-section) and [System logs](../configuration/log_server.md).

:::

If the delay reason is not resolved, and the message is not deleted, the message is returned to the sender after a configurable amount of time. Click the **Settings** button to modify it. See [Queue settings](#queue-settings-section) for details.

## Relay {#relay-rules-section}

When a message is received from another mail server (MTA), or from a mail user agent (MUA), Postfix determines if and how to relay it towards its final destination. This decision is typically based on relay authorization and the domain suffix of the recipient address.

- Se il dominio è gestito da Postfix (cioè è elencato in [Domini](#email_domains)) il messaggio viene consegnato localmente.
- In caso contrario, se il dominio è esterno e l'autorizzazione a relè è valida, il server di destinazione (noto anche come server "next-hop") viene risolto utilizzando una query DNS MX.

La pagina `Relay` consente di configurare un insieme di regole che sovrascrive la risoluzione di dominio esterno basata su DNS.

Per configurare l'autorizzazione a relè basata su IP, vedere [Relay settings](#mail-relay-settings).

### Regole prioritarie

Le regole di relè possono essere di tre tipi:

1.  Regola sensibile.
2.  Regola del mittente.
3.  Regola di default. È consentita solo una regola predefinita.

L'ordine di valutazione delle regole è Recipiente, Sender, Default: viene applicata la prima regola corrispondente. Una corrispondenza si verifica in base al mittente o al destinatario del messaggio, o se viene definita una regola predefinita (che corrisponde a qualsiasi mittente e destinatario).

Le corrispondenze del mittente e del destinatario possono essere una corrispondenza esatta dell'indirizzo e-mail completo, o corrispondono solo al suffisso del dominio. Nell'ordine di valutazione delle regole, la corrispondenza esatta viene valutata prima della corrispondenza del suffisso di dominio.

### Gestione delle regole

Fare clic sul pulsante **Add relay rule** per definire un Sender o una regola Recipiente. Specificare il tipo di regola e il valore soggetto (sender o destinatario), quindi riempire i campi rimanenti:

- **Hostname**, il nome o l'indirizzo IP del server in cui il messaggio viene relè se la regola corrisponde.
- **Port**, the TCP port number used by the server.
- **Authentication**. If the server requires SMTP authentication provide the necessary credentials here.
- **TLS**. Enable this switch if the server expects TLS or STARTTLS encryption. It is recommended to enable it to encrypt both credentials and data during SMTP connections.

Il **Set default rule** definisce una regola che corrisponde se nessuna delle regole rimanenti fa, o se nessuna regola è definita affatto. Questo tipo di regola viene utilizzato per configurare un [smarthost](https://en.wikipedia.org/wiki/Smart_host), un server di posta in cui vengono trasmessi messaggi di posta per domini esterni.

Quando viene creata o modificata una regola Predefinita o Recipiente, vengono aggiornate automaticamente le regole esistenti dello stesso tipo con la stessa combinazione Hostname e Port. Le nuove impostazioni TLS e Authentication vengono applicate collettivamente a queste regole. Ciò garantisce che i messaggi inviati tramite un dato Hostname e Port utilizzino credenziali coerenti e preferenze TLS, indipendentemente dall'indirizzo di destinazione.

Once created, a rule can be edited, disabled or deleted from the three-dots menu. When a rule is edited, the rule type and subject cannot be changed: delete it instead.

Vedi anche [Relay settings](#mail-relay-settings) per altre configurazioni sul relè dei messaggi verso altri server di posta. Nella pagina `Relay`, il pulsante **Settings** porta a loro.

## Settings {#mail_settings-section}

Application settings are split up and accessible under the cards described by the following sections.

### Impostazioni generali {#mail-general-settings}

The following values are set at application first configuration time. They should not be changed in production:

- `Mail server hostname` configures how the MTA identifies itself with other MTAs. To successfully receive email messages, use this host name to configure the following DNS records:
  - `A` record, resolving the Mail server hostname to the public and static IP address of the server.
  - `PTR` record, resolving back the IP address to the Mail server hostname.
  - `MX` records, one for each mail domain handled by the Mail application instance.
  - `TXT` records, as specified by DKIM, SPF and DMARC.
- `User domain` selects a LDAP database with user, groups and passwords. If the DB is changed existing mailboxes are not removed! A mailbox is still accessible if the same user name is present in both the old and the new database.

### Mailboxes

Under the `Mailboxes` card you can configure the `Default mail quota`.

If the general mailbox quota is enabled, the `Mailboxes` page summarizes the quota usage for each user. This summary is updated when a user logs in or a message is delivered.

Under the `Shared mailboxes` section, `Shared seen` selects if the IMAP *seen* flag is shared or not with other users. In general, the *seen* flag is used to mark if a message has been read or not. In a shared mailbox, each user can access the same message.

- If users accessing the shared mailbox prefer to know if a mail has already been read by someone else, set `Shared seen` to `enabled` (default).
- If users accessing the shared mailbox are not interested if a message has been already read by someone else, set `Shared seen` to `disabled`.

Messages marked as **spam** (see [Filter](#email_filter)) can be automatically moved into the `Junk` folder by enabling the option `Move spam to junk folder`. Spam messages can be expunged automatically after a period of time. You can configure it from the `Default spam retention` option.

### Master users {#mail-master-users-settings}

Under the `Master users` card, you can setup a user that can impersonate another user, gaining full rights to any mailbox contents and folder permissions.

Credentials are accepted by the IMAP server:

- user name of the master user, e.g. `master`
- master user password

For instance, to access as `john` with root password `secr3t`, use the following credentials:

- user name: `john*master`
- password: `secr3t`

### Queue settings {#queue-settings-section}

The `Maximal queue lifetime` parameter defines how many hours a message can remain in the mail queue before it is returned to the sender.

Il valore predefinito, 120 ore (5 giorni), è il tempo di riprovazione suggerito da RFC5321. I valori più bassi potrebbero essere impostati per avvertire il mittente prima se si verifica un errore. Ad esempio, se il server di posta remota rifiuta un messaggio perché il nostro indirizzo IP è in un elenco di blocco pubblico, il mittente del messaggio verrà notificato dopo 5 giorni: potrebbe essere considerato troppo tardi.

### Relay settings {#mail-relay-settings}

Questa sezione controlla la configurazione dell'applicazione Mail per scenari speciali, descritti nelle sezioni seguenti.

#### Relè basato su IP

Alcuni vecchi client di posta, come gli scanner, che forniscono funzionalità software limitate, potrebbero non supportare l'autenticazione o la crittografia SMTP: in questo caso è possibile autorizzare il relè di messaggi a domini esterni guardando il loro indirizzo IP anziché il controllo delle solite credenziali.

Elenca l'indirizzo IP di tali dispositivi nel `Allow relay da questi indirizzi IP` campo. L'indirizzo può essere in formato IPv4 o IPv6. La politica basata su IP può essere diffusa in un'intera rete, specificandola in formato CIDR.

Ad esempio, un valore per il campo può essere

    192.168.12.42
    10.77.4.0/24

The IP address *192.168.12.42* (e.g. a document scanner) and the clients in the network subnet *10.77.4.0/24* can send mail messages without providing SMTP authentication.

#### Sender/login corrispondenza

To avoid the unauthorized use of email addresses and the sender address spoofing within the organization, enable the `Enforce sender/login match` switch.

Se l'interruttore è abilitato l'indirizzo del mittente di un messaggio deve corrispondere al nome di login utilizzato dal client di posta per connettersi con il server di posta. Cerca il nome di login nella pagina [Addresses](#email_addresses) per vedere quali sono gli indirizzi che può utilizzare.

For example, with that switch enabled, if user `john` has email address `john.doe@example.org` he cannot write an email message with a different sender address, like `sarah.smith@example.org`.

If the switch is disabled, as per default Mail configuration, an authenticated mail client is allowed to send messages using any sender address, so back to our example `john` could write the message also as `sarah.smith@example.org`.

:::warning

Se si decide di abilitare l'interruttore considerare che le caselle di posta pubbliche e gli indirizzi di gruppo LDAP non sono valutati per la corrispondenza login/indirizzo.

:::

#### Mail archive {#mail-archive-section}

The `Always BCC` switch controls a feature often required by mail archiving solutions.

The acronym BCC stands for Blind Carbon Copy. When the switch is enabled, enter a value in the `Always BCC address` field: this address will receive a hidden copy of any email message sent or received by the Mail server.

:::tip

Fare una copia nascosta di messaggi di posta elettronica privata è una funzione sensibile alla privacy. Assicurarsi che il suo utilizzo sia conforme alle leggi sulla privacy del vostro paese, alle normative e alle politiche aziendali.

:::

The [Piler application](piler.md) can automatically configure this field with the appropriate value, such as `archive@piler1` or similar. In this case, changing the address might prevent Piler from archiving new messages.

## Client configuration {#email_clients}

The server supports standard-compliant email clients using the following IANA ports:

- imap/143
- pop3/110
- smtp/587
- sieve/4190

Authentication requires the STARTTLS command and supports the following variants:

- LOGIN
- PLAIN

Also the following TLS-enabled ports are available for legacy software that still does not support STARTTLS:

- imaps/993
- pop3s/995
- smtps/465

:::note

The standard SMTP port 25 is reserved for mail transfers between MTA servers. Mail user agents (MUA) must use the submission port.

:::

Refer to the [Webtop application](webtop.md#email_autoconfig) for the implementation of automatic configuration protocols like Autodiscover and Autoconfig.

## Mail outbound connections {#mail-outbound-connections}

The Mail application generates outbound SMTP traffic towards other mail servers, as well as DNS, HTTPS, and RSYNC traffic for antispam and antivirus checks.

| Purpose | Host name | Port | Protocol | Notes |
|----|----|----|----|----|
| SMTP session | \<any\> | 25 | SMTP | Outbound connection to remote MTA |
| DNSBL queries | \<any\> | 53 | DNS | Rspamd DNS queries and resolver recursive DNS queries |
| DQS queries | \<any\> | 53 | DNS | Spamhaus Data Query Service DNS queries |
| ClamAV DB updates | database.clamav.net, sigs.interserver.net, cdn.rfxn.com, signatures.malware.expert, lists.malwarepatrol.net, www.sanesecurity.com, www.securiteinfo.com, urlhaus.abuse.ch, raw.githubusercontent.com | 443 | HTTPS | Fetch official and unofficial ClamAV signatures |
| ClamAV DB updates | rsync.sanesecurity.net | 873 | RSYNC | Fetch official and unofficial ClamAV signatures |

Summary of Mail outbound connections

Rotte

- The complete list of host names has been extracted from the [clamav-unofficial-sigs](https://github.com/extremeshok/clamav-unofficial-sigs) source code.

- Obtain a complete list of DNSBL/DQS servers with this command on the node where Mail is installed:

      runagent -m mail1 podman exec rspamd rspamadm configdump rbl | grep "rbl = "

  To resolve their IP addresses, the Rspamd DNS recursive resolver (Unbound) queries authoritative DNS servers directly.
