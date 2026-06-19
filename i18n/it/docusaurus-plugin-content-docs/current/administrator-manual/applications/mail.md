---
title: Mail
---
# Mail

L'applicazione Mail è suddivisa in quattro parti principali:

- [Postfix](https://www.postfix.org), un server SMTP per inviare e ricevere messaggi di posta.
- [Dovecot](https://www.dovecot.org), un server IMAP e POP3 per leggere la posta elettronica, con il linguaggio Sieve per organizzarla.
- [Rspamd](https://rspamd.com), un filtro antispam, antivirus e blocco degli allegati.
- [ClamAV](http://www.clamav.net), un motore antivirus.

I vantaggi sono:

- completa autonomia nella gestione della posta elettronica
- evitare problemi dovuti al provider di connettività Internet
- possibilità di tracciare il percorso dei messaggi per individuare gli errori
- scansione antivirus e antispam ottimizzata

:::warning

Anche se Software Center permette di installare più istanze di Mail sullo stesso nodo, puoi configurare e avviare una sola istanza di server di posta per nodo, altrimenti si verifica un errore di conflitto sulle porte TCP.

:::

Un'istanza Mail può essere integrata con altre applicazioni. Per esempio:

- [WebTop](webtop.md) groupware.
- [Roundcube](roundcube.md) client webmail.
- [Imapsync](imapsync.md) pianifica recuperi periodici o migra email da server IMAP esterni alle caselle di posta locali degli utenti.
- [Piler](piler.md) archivia qualsiasi messaggio inviato o ricevuto da Mail tramite il protocollo SMTP.

## Configurazione

Mail richiede almeno un [dominio utenti](../installation/user_domains.md) già configurato.

La prima procedura guidata di configurazione richiederà le seguenti informazioni:

- `Mail server hostname`: inserisci il nome del server di posta; deve essere lo stesso nome configurato nel tuo [record DNS MX](https://en.wikipedia.org/wiki/MX_record).
- `Primary mail domain`: inserisci il dominio di posta, come `nethserver.org`; potrai aggiungere altri domini in seguito.

Quindi seleziona il dominio utenti da collegare al server di posta. Verrà creato un indirizzo email per ogni utente del dominio selezionato.

## Domini {#email_domains}

Mail può gestire un numero illimitato di domini di posta, configurabili dalla pagina `Domains`.

:::note

L'eliminazione di un dominio non cancella alcuna email esistente; tutti i messaggi ricevuti in precedenza vengono conservati.

:::

Per aggiungere un nuovo dominio, fai clic sul pulsante **Create domain** e inserisci il nome del dominio, ad esempio `mymail.org`, nel campo `Name`.

Puoi definire gli indirizzi email del dominio ereditando nomi utenti e gruppi dal dominio utenti LDAP usando le seguenti opzioni:

- `Add user addresses from user domain`
- `Add group addresses from user domain`

Se l'opzione corrispondente è abilitata, i nomi di utenti e gruppi vengono trattati come indirizzi email validi. Nel raro caso in cui un utente e un gruppo abbiano lo stesso nome, i messaggi in ingresso indirizzati a quel nome vengono sempre consegnati ai membri del gruppo.

Gli indirizzi email aggiuntivi per il dominio possono essere configurati come spiegato nella sezione [Indirizzi](#email_addresses).

Nella sezione `Advanced`, l'opzione `Accept unknown recipients` controlla come gestire i messaggi indirizzati a destinatari non definiti all'interno del dominio. Per impostazione predefinita, questi messaggi vengono rifiutati. In alcuni scenari, però, ad esempio durante la migrazione di un dominio di posta, può essere utile accettarli e recapitarli in modo silenzioso a una casella catch-all. Questo comportamento può essere abilitato attivando l'opzione `Accept unknown recipients`.

### Firma DKIM

DomainKeys Identified Mail ([DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)) convalida l'identità dell'MTA mittente aggiungendo una firma crittografica alle intestazioni MIME del messaggio.

Nella pagina `Domains`, fai clic sul menu a tre punti della scheda del dominio e seleziona `Configure DKIM` per abilitare o disabilitare la firma DKIM dei messaggi. Per impostazione predefinita, la firma DKIM è abilitata per ogni dominio e il valore della chiave viene mostrato sia in formato grezzo sia nel formato "zone file" compatibile con Bind.

Le intestazioni della firma DKIM vengono aggiunte solo ai messaggi inviati tramite le porte TCP 587 (submission) e 465 (smtps) quando l'intestazione "From" corrisponde a uno dei domini configurati.

Perché DKIM funzioni correttamente, assicurati che il DNS pubblico sia configurato come segue, usando le istruzioni fornite dal tuo provider DNS:

1.  Aggiungi un record TXT con la chiave `default._domainKey` al tuo servizio DNS pubblico.
2.  Copia il testo della chiave fornito e incollalo nel campo dati (RDATA) del record DNS.

Per proteggerti ulteriormente dalla falsificazione del dominio di posta, valuta l'aggiunta di record DNS per [DMARC](https://en.wikipedia.org/wiki/DMARC) (Domain-based Message Authentication, Reporting, and Conformance) e [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) (Sender Policy Framework).

## Caselle di posta {#mail-mailboxes-settings}

Ogni utente ha una casella di posta personale e qualsiasi nome utente nel formato *\<username\>@\<domain\>* è anch'esso un indirizzo email valido al quale recapitare messaggi.

L'elenco delle caselle di posta è mostrato nella pagina `Mailboxes`. Esistono due tipi di caselle di posta: utenti e pubbliche.

### Caselle di posta degli utenti

Puoi disabilitare ogni casella di posta selezionando la voce `Disable` dal menu a tre punti della riga corrispondente.

Facendo clic sulla voce `Edit` del menu a tre punti, puoi configurare le seguenti opzioni:

- `Forward messages`: inoltra tutti i messaggi a un altro indirizzo email
- `Custom mailbox quota`: sostituisce la quota configurata nelle [Impostazioni](#mail_settings-section)
- `Custom spam retention`: sostituisce la retention configurata nelle [Impostazioni](#mail_settings-section)

### Caselle di posta pubbliche

Le caselle di posta pubbliche possono essere condivise tra gruppi di utenti. Il pulsante **Create public mailbox** consente di creare una nuova casella di posta pubblica e definire uno o più gruppi e utenti proprietari. Le caselle di posta pubbliche possono essere create anche da qualsiasi client IMAP che supporti l'estensione del protocollo IMAP ACL (RFC 4314).

Quando viene creata una nuova casella di posta pubblica, il server di posta aggiunge automaticamente un nuovo indirizzo per tutti i domini di posta esistenti.

### Ripristinare una cartella della casella di posta da un backup {#mailbox-selective-restore}

Se l'applicazione ha una o più destinazioni di backup configurate e almeno un backup è già stato eseguito, puoi cercare e ripristinare una cartella della casella di posta da una precedente istantanea di backup di una specifica casella utente o pubblica.

:::warning

La procedura non calcola lo spazio su disco richiesto per il ripristino. Assicurati che ci sia spazio su disco sufficiente prima di procedere.

:::

1.  Vai all'istanza dell'applicazione Mail e apri la pagina Mailboxes. Scegli la scheda `User mailboxes` oppure `Public mailboxes` per visualizzare l'elenco delle caselle di posta. Dal menu a tre punti della casella desiderata, seleziona `Restore folder`.

2.  Seleziona la destinazione di backup da cui ripristinare la cartella. Il caricamento delle destinazioni remote può richiedere un po' di tempo.

3.  Scegli la data dell'istantanea di backup da ripristinare. Le istantanee sono elencate dalla più recente alla più vecchia.

4.  Seleziona una cartella dall'elenco oppure inizia a digitare il nome per filtrare la lista.

    Premi **Restore** per avviare il processo di ripristino.

La cartella selezionata verrà ripristinata in una sottocartella della casella di posta chiamata "Restored folder". Se la sottocartella esiste già, verrà rimossa prima del ripristino.

Se la quota della casella di posta viene superata durante il processo di ripristino, verrà impostata su illimitata.

## Indirizzi {#email_addresses}

Oltre agli indirizzi di utenti, gruppi e caselle di posta pubbliche descritti nella sezione precedente, il sistema consente di creare un numero illimitato di indirizzi email dalla pagina `Addresses`. Ogni indirizzo email è associato a una o più destinazioni. Una destinazione può essere di uno dei seguenti tipi:

- casella di posta utente
- casella di posta pubblica
- indirizzo email esterno

Un indirizzo email può essere specifico per un dominio di posta oppure generico per tutti i domini di posta configurati. In quest'ultimo caso, lo chiamiamo "indirizzo wildcard". Per esempio:

- Sono configurati due domini, *mydomain.net* e *example.com*
- Un indirizzo email specifico *goofy* per il dominio *example.com* corrisponde a *goofy@example.com*.
- Un indirizzo email wildcard *info* è associato a tutti i domini: equivale sia a *info@mydomain.net* sia a *info@example.com*.

A volte un'azienda vieta le comunicazioni dall'esterno dell'organizzazione usando indirizzi email personali. Per cambiare la *visibilità* di un indirizzo, fai clic sul menu a tre punti e seleziona l'azione rapida `Set as internal`, oppure seleziona `Edit` e abilita la casella `Internal` nella sezione `Advanced`.

Quando un indirizzo è *internal*, non può ricevere messaggi dall'esterno. Un indirizzo *internal* può comunque essere usato per scambiare messaggi con altri account del sistema.

## Filtro {#email_filter}

Tutti i messaggi email in transito sono sottoposti a un elenco di controlli che rientrano in due categorie principali, descritte nelle sezioni seguenti:

- Antivirus
- Antispam

Vai alla pagina `Filter` per modificarne le impostazioni.

### Antivirus {#anti-virus}

Il componente antivirus ClamAV individua i messaggi email che contengono virus. I messaggi infetti vengono scartati. Il database delle firme dei virus viene controllato ogni ora per gli aggiornamenti.

Il database predefinito delle firme ufficiali di ClamAV è normalmente disabilitato perché consuma molta memoria. Se vuoi usarlo, seleziona la casella `Enable ClamAV official signatures`.

Le firme non ufficiali di ClamAV sono invece sempre attive. Puoi scegliere il livello di valutazione delle firme tra *Low*, *Medium* e *High*. Tieni presente che livelli più alti possono portare a falsi positivi indesiderati e quindi bloccare anche messaggi legittimi.

Gli aggiornamenti delle firme vengono scaricati da siti di terze parti che distribuiscono firme per ClamAV; vedi [Connessioni in uscita di Mail](#mail-outbound-connections).

### Antispam {#antispam-section}

Il componente antispam Rspamd analizza le email rilevando e classificando i [messaggi spam](https://en.wikipedia.org/wiki/Spamming) usando criteri euristici, regole predefinite e valutazioni statistiche del contenuto dei messaggi.

Il filtro può anche controllare se il server mittente è elencato in una o più block list basate su DNS (o [DNSBL](https://en.wikipedia.org/wiki/Domain_Name_System_blocklist)). A ogni regola è associato un punteggio. Il controllo genera query DNS in uscita verso server DNS di terze parti; vedi [Connessioni in uscita di Mail](#mail-outbound-connections).

I filtri statistici (o [bayesiani](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering)) sono regole speciali che evolvono e si adattano rapidamente analizzando i messaggi contrassegnati come **spam** o **ham**.

Il punteggio spam totale raccolto al termine dell'analisi consente al server di decidere cosa fare con un messaggio.

Le soglie del punteggio spam possono essere configurate nella sezione `Antispam` della pagina `Filter`.

- `Spam flag threshold` determina il valore di punteggio oltre il quale un messaggio viene contrassegnato come spam. Quando un messaggio ha il flag spam attivo, l'azione di consegna conseguente dipende dalle impostazioni generali delle [caselle di posta](#mail-mailboxes-settings).
- `Deny message spam threshold` regola invece il punteggio considerato troppo alto per accettare un messaggio. Se il punteggio supera questo valore, il filtro rifiuta completamente il messaggio.
- Nella sezione `Advanced` è possibile abilitare `Greylist threshold`. Quando il punteggio del messaggio supera questo limite, il filtro chiede al mittente di ritentare la consegna più tardi. Il metodo antispam *Greylist* presuppone che gli spammer non gradiscano i nuovi tentativi di consegna. È disabilitato per impostazione predefinita perché introduce ritardi di consegna anche per i mittenti legittimi.

In alcuni casi un client email, un destinatario o un mittente devono bypassare i controlli del filtro: la sezione `Bypass rules` consente di definire un insieme di regole basate sui seguenti criteri:

- indirizzo IP o rete del mittente (formato CIDR)
- indirizzo email completo del mittente
- dominio email del mittente (corrispondenza esatta)
- indirizzo email completo del destinatario
- dominio email del destinatario (corrispondenza esatta)

Tieni presente che le regole basate su indirizzo e dominio corrispondono all'*envelope sender address*, che in alcuni casi può differire dall'indirizzo "From" del messaggio, ad esempio nelle mailing list.

Per visualizzare dettagli del messaggio come l'envelope sender address, per accedere alle impostazioni avanzate o per controllare l'attività recente di Rspamd, consulta [Interfaccia web di Rspamd](#rspamd-web-interface).

I filtri statistici bayesiani possono poi essere addestrati con qualsiasi client IMAP semplicemente spostando un messaggio dentro e fuori dalla cartella Junk. Come prerequisito, la cartella Junk deve essere abilitata, come spiegato in [Caselle di posta](#mail-mailboxes-settings).

- Spostando un messaggio nella cartella Junk, i filtri imparano che è spam e assegneranno un punteggio più alto a messaggi simili.
- Al contrario, togliendo un messaggio da Junk, i filtri imparano che è ham: la volta successiva verrà assegnato un punteggio più basso.

Tutti gli utenti possono addestrare i filtri usando questa tecnica.

:::note

È buona abitudine controllare spesso la cartella Junk per non perdere email riconosciute erroneamente come spam.

:::

L'addestramento del filtro bayesiano si applica a tutti gli utenti del sistema, non solo all'utente che ha contrassegnato un'email come spam o ham.

È importante capire come funzionano davvero i test bayesiani:

- Non contrassegnano automaticamente i messaggi come spam se contengono un determinato oggetto o indirizzo del mittente. Raccolgono solo caratteristiche specifiche del messaggio.

- Un messaggio può essere contrassegnato una sola volta. Se lo stesso messaggio viene contrassegnato più volte, non cambia nulla perché i test dinamici sono già stati addestrati da quel messaggio.

- Il filtro bayesiano **non è attivo finché non ha ricevuto informazioni sufficienti. Questo include un minimo di 200 spam E 200 ham (falsi positivi).**

  Man mano che il sistema riceve queste informazioni, l'avanzamento dell'addestramento del filtro bayesiano può essere monitorato dall'interfaccia web di Rspamd.

### Interfaccia web di Rspamd {#rspamd-web-interface}

L'interfaccia web di Rspamd può essere aperta facendo clic sul pulsante **Open Rspamd** nell'angolo in alto a destra della pagina Filter oppure visitando `https://<yourIP>/rspamd` o `https://<yourFQDN>/rspamd`. Per accedere ti serviranno le credenziali di cluster-admin.

Fornisce accesso alle configurazioni avanzate e a una panoramica di Rspamd, per esempio alla scheda **Scan/Learn** per addestrare Rspamd oppure alla scheda **History** per visualizzare e analizzare le email in ingresso.

La scheda **Configuration** contiene degli elenchi nella parte inferiore. Qui puoi configurare il rifiuto delle email.

Per rifiutare email da specifici indirizzi email mittenti, devi configurare l'elenco `/var/lib/rspamd/block_sender.map`, per esempio aggiungendo `user@domain.tld`.

Per rifiutare email in base al dominio, aggiungi per esempio `domain.tld` all'elenco `/var/lib/rspamd/block_sender_domain.map`.

Per rifiutare email in base al dominio di primo livello o al suffisso del dominio, puoi aggiungere `.tld` oppure `.domain.tld` all'elenco `/var/lib/rspamd/block_sender_domain_suffix.map`.

Non modificare gli altri elenchi, perché sono preconfigurati.

## Coda

La pagina `Queue` mostra lo stato della coda di posta di Postfix. In condizioni normali la coda dovrebbe essere vuota, perché i messaggi vengono scambiati immediatamente tra i server di posta.

Se la coda di posta contiene alcuni messaggi, prova a fare clic sul pulsante **Refresh** per controllare rapidamente se la condizione è temporanea.

In alternativa, avvia subito un nuovo tentativo di consegna con il pulsante **Resend all**, oppure rimuovi tutti i messaggi dalla coda con **Delete all**.

Le stesse azioni possono essere eseguite selettivamente per ogni messaggio in coda, dal relativo menu a tre punti. Puoi ispezionare il motivo del ritardo del messaggio, l'ID della coda, l'orario di arrivo, la dimensione, il mittente e i destinatari con l'azione `See details`.

:::tip

Il valore `Message ID` può essere usato per cercare il messaggio sia nell'[interfaccia web di Rspamd](#antispam-section) sia nei [log di sistema](../configuration/log_server.md).

:::

Se il motivo del ritardo non viene risolto e il messaggio non viene eliminato, il messaggio viene restituito al mittente dopo un intervallo di tempo configurabile. Fai clic sul pulsante **Settings** per modificarlo. Vedi [Impostazioni della coda](#queue-settings-section) per i dettagli.

## Relay {#relay-rules-section}

Quando un messaggio viene ricevuto da un altro server di posta (MTA) o da un client di posta (MUA), Postfix determina se e come inoltrarlo verso la destinazione finale. Questa decisione si basa tipicamente sull'autorizzazione al relay e sul suffisso di dominio dell'indirizzo del destinatario.

- Se il dominio è gestito da Postfix, cioè è elencato in [Domini](#email_domains), il messaggio viene consegnato localmente.
- In caso contrario, se il dominio è esterno e l'autorizzazione al relay è valida, il server di destinazione, detto anche server "next-hop", viene risolto tramite una query DNS MX.

La pagina `Relay` consente di configurare un insieme di regole che sostituisce la risoluzione del dominio esterno basata su DNS.

Per configurare l'autorizzazione al relay basata su IP, vedi [Impostazioni del relay](#mail-relay-settings).

### Priorità delle regole

Le regole di relay possono essere di tre tipi:

1.  Regola destinatario.
2.  Regola mittente.
3.  Regola predefinita. È consentita una sola regola predefinita.

L'ordine di valutazione delle regole è Destinatario, Mittente, Predefinita: viene applicata la prima regola corrispondente. Una corrispondenza si verifica in base al mittente o al destinatario del messaggio, oppure se è definita una regola predefinita, che corrisponde a qualsiasi mittente e destinatario.

Le corrispondenze di mittente e destinatario possono essere un match esatto dell'indirizzo email completo oppure solo del suffisso di dominio. Nell'ordine di valutazione delle regole, la corrispondenza esatta viene valutata prima di quella sul suffisso di dominio.

### Gestione delle regole

Fai clic sul pulsante **Add relay rule** per definire una regola Mittente o Destinatario. Specifica il tipo di regola e il valore oggetto, mittente o destinatario, quindi compila i campi rimanenti:

- **Hostname**, il nome o l'indirizzo IP del server verso cui il messaggio viene inoltrato se la regola corrisponde.
- **Port**, il numero di porta TCP usato dal server.
- **Authentication**. Se il server richiede autenticazione SMTP, inserisci qui le credenziali necessarie.
- **TLS**. Abilita questa opzione se il server richiede la cifratura TLS o STARTTLS. È consigliato abilitarla per cifrare sia le credenziali sia i dati durante le connessioni SMTP.

**Set default rule** definisce una regola che corrisponde se nessuna delle altre regole corrisponde, oppure se non è definita alcuna regola. Questo tipo di regola viene usato per configurare uno [smarthost](https://en.wikipedia.org/wiki/Smart_host), cioè un server di posta al quale vengono inoltrati i messaggi destinati a domini esterni.

Quando viene creata o modificata una regola Predefinita o Destinatario, le regole esistenti dello stesso tipo con la stessa combinazione Hostname e Port vengono aggiornate automaticamente. Le nuove impostazioni TLS e Authentication vengono applicate in modo collettivo a queste regole. Questo garantisce che i messaggi inviati tramite un determinato Hostname e Port usino credenziali coerenti e preferenze TLS uniformi, indipendentemente dall'indirizzo di destinazione.

Una volta creata, una regola può essere modificata, disabilitata o eliminata dal menu a tre punti. Quando una regola viene modificata, il tipo di regola e il soggetto non possono essere cambiati: in quel caso eliminala e ricreala.

Vedi anche [Impostazioni del relay](#mail-relay-settings) per altre configurazioni sull'inoltro dei messaggi verso altri server di posta. Nella pagina `Relay`, il pulsante **Settings** porta a quelle impostazioni.

## Impostazioni {#mail_settings-section}

Le impostazioni dell'applicazione sono suddivise e accessibili nelle schede descritte dalle sezioni seguenti.

### Impostazioni generali {#mail-general-settings}

I seguenti valori vengono impostati al momento della prima configurazione dell'applicazione. Non dovrebbero essere cambiati in produzione:

- `Mail server hostname` configura il modo in cui l'MTA si identifica verso gli altri MTA. Per ricevere correttamente i messaggi email, usa questo nome host per configurare i seguenti record DNS:
  - record `A`, che risolve il nome host del server Mail nell'indirizzo IP pubblico e statico del server.
  - record `PTR`, che risolve l'indirizzo IP nel nome host del server Mail.
  - record `MX`, uno per ogni dominio di posta gestito dall'istanza dell'applicazione Mail.
  - record `TXT`, come specificato da DKIM, SPF e DMARC.
- `User domain` seleziona un database LDAP con utenti, gruppi e password. Se il DB viene cambiato, le caselle di posta esistenti non vengono rimosse. Una casella di posta è ancora accessibile se lo stesso nome utente è presente sia nel vecchio sia nel nuovo database.

### Caselle di posta

Nella scheda `Mailboxes` puoi configurare la `Default mail quota`.

Se la quota generale delle caselle di posta è abilitata, la pagina `Mailboxes` riepiloga l'utilizzo della quota per ogni utente. Questo riepilogo viene aggiornato quando un utente accede o quando un messaggio viene consegnato.

Nella sezione `Shared mailboxes`, `Shared seen` seleziona se il flag IMAP *seen* è condiviso o meno con gli altri utenti. In generale, il flag *seen* viene usato per indicare se un messaggio è stato letto oppure no. In una casella condivisa, ogni utente può accedere allo stesso messaggio.

- Se gli utenti che accedono alla casella condivisa preferiscono sapere se un'email è già stata letta da qualcun altro, imposta `Shared seen` su `enabled` (predefinito).
- Se gli utenti che accedono alla casella condivisa non sono interessati a sapere se un messaggio è già stato letto da qualcun altro, imposta `Shared seen` su `disabled`.

I messaggi contrassegnati come **spam** (vedi [Filtro](#email_filter)) possono essere spostati automaticamente nella cartella `Junk` abilitando l'opzione `Move spam to junk folder`. I messaggi spam possono essere rimossi automaticamente dopo un certo periodo di tempo. Puoi configurarlo con l'opzione `Default spam retention`.

### Utenti master {#mail-master-users-settings}

Nella scheda `Master users`, puoi configurare un utente che può impersonare un altro utente, ottenendo pieni diritti sul contenuto di qualsiasi casella di posta e sui permessi delle cartelle.

Le credenziali accettate dal server IMAP sono:

- nome utente del master user, per esempio `master`
- password del master user

Per esempio, per accedere come `john` con password del master user `secr3t`, usa le seguenti credenziali:

- nome utente: `john*master`
- password: `secr3t`

### Impostazioni della coda {#queue-settings-section}

Il parametro `Maximal queue lifetime` definisce per quante ore un messaggio può rimanere nella coda di posta prima di essere restituito al mittente.

Il valore predefinito, 120 ore (5 giorni), è il tempo di ritentativo suggerito da RFC5321. Potresti impostare valori più bassi per avvisare prima il mittente se si verifica un errore. Per esempio, se il server di posta remoto rifiuta un messaggio perché il nostro indirizzo IP è presente in una block list pubblica, il mittente verrà avvisato dopo 5 giorni: potrebbe essere considerato troppo tardi.

### Impostazioni del relay {#mail-relay-settings}

Questa sezione controlla la configurazione dell'applicazione Mail per scenari speciali, descritti nelle sezioni seguenti.

#### Relay basato su IP

Alcuni vecchi client di posta, come gli scanner, che offrono funzionalità software limitate, potrebbero non supportare l'autenticazione SMTP o la cifratura. In questo caso è possibile autorizzare il relay dei messaggi verso domini esterni in base al loro indirizzo IP invece del consueto controllo delle credenziali.

Elenca gli indirizzi IP di tali dispositivi nel campo `Allow relay from these IP addresses`. L'indirizzo può essere in formato IPv4 o IPv6. La policy basata su IP può essere estesa a un'intera rete specificandola in formato CIDR.

Per esempio, un valore del campo può essere:

    192.168.12.42
    10.77.4.0/24

L'indirizzo IP *192.168.12.42* (per esempio uno scanner documentale) e i client della sottorete *10.77.4.0/24* possono inviare messaggi email senza fornire autenticazione SMTP.

#### Corrispondenza mittente/login

Per evitare l'uso non autorizzato degli indirizzi email e la falsificazione dell'indirizzo del mittente all'interno dell'organizzazione, abilita l'opzione `Enforce sender/login match`.

Se l'opzione è abilitata, l'indirizzo del mittente di un messaggio deve corrispondere al nome di login usato dal client di posta per connettersi al server di posta. Cerca il nome di login nella pagina [Indirizzi](#email_addresses) per vedere quali indirizzi può usare.

Per esempio, con questa opzione abilitata, se l'utente `john` ha l'indirizzo email `john.doe@example.org`, non può scrivere un messaggio con un indirizzo mittente diverso, come `sarah.smith@example.org`.

Se l'opzione è disabilitata, come nella configurazione predefinita di Mail, un client di posta autenticato può inviare messaggi usando qualsiasi indirizzo mittente; quindi, tornando all'esempio, `john` potrebbe scrivere il messaggio anche come `sarah.smith@example.org`.

:::warning

Se decidi di abilitare questa opzione, considera che le caselle di posta pubbliche e gli indirizzi di gruppo LDAP non vengono valutati per la corrispondenza login/indirizzo.

:::

#### Archivio mail {#mail-archive-section}

L'opzione `Always BCC` controlla una funzionalità spesso richiesta dalle soluzioni di archiviazione della posta.

L'acronimo BCC significa Blind Carbon Copy. Quando l'opzione è abilitata, inserisci un valore nel campo `Always BCC address`: questo indirizzo riceverà una copia nascosta di qualsiasi messaggio email inviato o ricevuto dal server Mail.

:::tip

Creare una copia nascosta di messaggi email privati è una funzionalità sensibile dal punto di vista della privacy. Assicurati che il suo uso sia conforme alle leggi sulla privacy, ai regolamenti e alle policy aziendali del tuo paese.

:::

L'applicazione [Piler](piler.md) può configurare automaticamente questo campo con il valore appropriato, come `archive@piler1` o simile. In questo caso, cambiare l'indirizzo potrebbe impedire a Piler di archiviare i nuovi messaggi.

## Configurazione dei client {#email_clients}

Il server supporta client email conformi agli standard usando le seguenti porte IANA:

- imap/143
- pop3/110
- smtp/587
- sieve/4190

L'autenticazione richiede il comando STARTTLS e supporta le seguenti varianti:

- LOGIN
- PLAIN

Sono disponibili anche le seguenti porte con TLS abilitato per software legacy che non supportano ancora STARTTLS:

- imaps/993
- pop3s/995
- smtps/465

:::note

La porta SMTP standard 25 è riservata ai trasferimenti di posta tra server MTA. I mail user agent (MUA) devono usare la porta submission.

:::

Fai riferimento all'applicazione [Webtop](webtop.md#email_autoconfig) per l'implementazione dei protocolli di configurazione automatica come Autodiscover e Autoconfig.

## Connessioni in uscita di Mail {#mail-outbound-connections}

L'applicazione Mail genera traffico SMTP in uscita verso altri server di posta, oltre a traffico DNS, HTTPS e RSYNC per i controlli antispam e antivirus.

| Scopo | Nome host | Porta | Protocollo | Note |
|----|----|----|----|----|
| Sessione SMTP | \<any\> | 25 | SMTP | Connessione in uscita verso l'MTA remoto |
| Query DNSBL | \<any\> | 53 | DNS | Query DNS di Rspamd e query DNS ricorsive del resolver |
| Query DQS | \<any\> | 53 | DNS | Query DNS del servizio Spamhaus Data Query Service |
| Aggiornamenti DB di ClamAV | database.clamav.net, sigs.interserver.net, cdn.rfxn.com, signatures.malware.expert, lists.malwarepatrol.net, www.sanesecurity.com, www.securiteinfo.com, urlhaus.abuse.ch, raw.githubusercontent.com | 443 | HTTPS | Scarica firme ufficiali e non ufficiali di ClamAV |
| Aggiornamenti DB di ClamAV | rsync.sanesecurity.net | 873 | RSYNC | Scarica firme ufficiali e non ufficiali di ClamAV |

Riepilogo delle connessioni in uscita di Mail

Note

- L'elenco completo dei nomi host è stato estratto dal codice sorgente di [clamav-unofficial-sigs](https://github.com/extremeshok/clamav-unofficial-sigs).

- Ottieni l'elenco completo dei server DNSBL/DQS con questo comando sul nodo in cui è installata Mail:

      runagent -m mail1 podman exec rspamd rspamadm configdump rbl | grep "rbl = "

  Per risolvere i loro indirizzi IP, il resolver DNS ricorsivo di Rspamd (Unbound) interroga direttamente i server DNS autorevoli.
