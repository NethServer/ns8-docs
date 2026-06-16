---
title: Domini utente
sidebar_position: 3
---
# Domini utente

Gli utenti, le password e i gruppi sono memorizzati nei database LDAP e costituiscono un **dominio utente**.

Un cluster NS8 può ospitare più domini utente *interni* con schemi LDAP differenti. È anche possibile configurare domini utente *esterni* che collegano NS8 a servizi LDAP in esecuzione al di fuori del cluster. Gli schemi LDAP supportati sono:

- Active Directory - [Samba](https://www.samba.org/)
- Attributi Unix [RFC2307](https://www.rfc-editor.org/rfc/rfc2307) - [OpenLDAP](https://www.openldap.org/)

Con un dominio utente *interno*, lo stesso database LDAP può essere replicato e fornito da più nodi del cluster per garantire la disponibilità delle applicazioni in esecuzione su tali nodi (vedere anche [Repliche del provider](#provider_replica-section)).

Con un dominio utente *esterno*, è comunque possibile configurare più repliche LDAP, ma devono essere raggiungibili da ogni nodo del cluster.

Una replica LDAP è chiamata **provider di account**.

Oltre a scegliere se collegare un provider esterno o installarne uno interno, considera che lo schema LDAP e la sua implementazione possono offrire funzionalità differenti. Alcuni esempi importanti:

- L'applicazione Samba File Server funziona solo con Active Directory.
- Con OpenLDAP, più provider possono essere ospitati sullo stesso nodo, mentre Samba può ospitare un solo dominio utente per nodo.
- I provider RFC2307 potrebbero non supportare completamente politiche avanzate per le password.
## Active Directory {#active_directory-section}

Per installare un nuovo dominio utente con un Samba Active Directory interno come provider:

- Accedi alla pagina `Domini e utenti`.
- Clicca sul pulsante **Crea dominio** e scegli `Interno`.
- Seleziona `Samba` nella finestra di dialogo e segui la procedura. Potrebbe essere richiesto di scegliere quale nodo installerà il provider e -- se il nodo selezionato ne dispone -- il volume aggiuntivo dove verranno archiviati le Cartelle condivise. Questa scelta è rilevante se abiliterai l'opzione `Fornisci cartelle condivise e autenticazione ai client Windows` nella fase post-installazione. Se prevedi di utilizzare Samba come file server, leggi ora la sezione [File server Samba](../applications/file_server.md) prima di procedere.
- Infine, clicca sul pulsante **Installa provider**.

Una volta installato il provider di dominio, ti verrà chiesto di inserire i seguenti parametri di Active Directory:

- `Dominio`: il dominio utente in forma FQDN. Definisce il suffisso DNS del nuovo dominio Active Directory. Se non sei sicuro, consulta la sezione successiva o mantieni il valore proposto.
- `Dominio NetBIOS`: un valido dominio [NetBIOS](https://en.wikipedia.org/wiki/NetBIOS) (noto anche come "nome breve del dominio", "nome dominio NT"), è l'identificatore alternativo del dominio Active Directory, compatibile con client più vecchi. La lunghezza massima è di 15 caratteri ASCII. Se non sei sicuro, mantieni il valore proposto.
- `Nome utente amministratore Samba` e `Password amministratore Samba`: imposta le credenziali dell'account amministrativo iniziale; è possibile utilizzare `administrator` (predefinito) o qualsiasi altro nome utente. In quest'ultimo caso, il nome utente fornito viene aggiunto al gruppo `Domain Admins`, mentre l'utente `administrator` viene disabilitato e gli viene assegnata una password casuale.

Nel gergo di Active Directory, un provider di dominio NS8 è un *Domain Controller* (DC). Funziona come server LDAP, controller di dominio Kerberos e server DNS autorevole per il nome di dominio scelto. Compila i seguenti campi relativi al DC:

- `Hostname`: il nome host del DC. Se non sei sicuro, mantieni il valore proposto.
- `Fornisci cartelle condivise e autenticazione ai client Windows`: se questo interruttore è abilitato, il DC sarà accessibile dalla rete locale (LAN). Nota la seguente limitazione: solo un DC per dominio può offrire cartelle condivise, autenticazione e servizi DNS. Consulta [File server](../applications/file_server.md) per ulteriori informazioni.

:::note

A parte le credenziali amministrative, gli altri parametri di Active Directory non possono essere modificati una volta creato il dominio.

:::

Alla fine, vedrai un nuovo dominio utente con un provider connesso. Ora puoi [gestire utenti e gruppi](#user_groups-section), [aggiungere una replica](#provider_replica-section) o copiare le [impostazioni di bind](#domain_bind-section) per connettere un'applicazione esterna.

### DNS e dominio AD

Un dominio Active Directory richiede un dominio DNS riservato per funzionare. È una buona scelta allocare un sottodominio del dominio DNS pubblico per esso. Il sottodominio AD può essere accessibile solo dalle reti locali.

Esempio:

- dominio pubblico (*esterno*): `nethserver.org`
- FQDN del server: `mail.nethserver.org`
- dominio Active Directory (*solo LAN interna*): `ad.nethserver.org`
- FQDN del controller di dominio: `dc1.ad.nethserver.org`

:::tip

Quando scegli un dominio per Active Directory utilizza un dominio *interno* che sia un sottodominio del dominio *esterno*[^1].

:::

I client Windows AD devono utilizzare un server DNS primario in grado di risolvere i nomi di dominio AD. Un server DNS secondario è opzionale, ma se configurato, deve essere anch'esso in grado di risolvere i nomi di dominio AD.

- **Reti piccole**: Utilizza Samba Active Directory come server DNS impostando l'indirizzo IP del controller di dominio nelle impostazioni DNS del client. Le query DNS non relative ad AD vengono automaticamente inoltrate ai server nel file `/etc/resolv.conf` del nodo NS8.
- **Reti più grandi**: Utilizza un server DNS dedicato con *inoltro condizionale*. Configuralo per inoltrare le richieste di dominio AD al server DNS Samba Active Directory, mentre indirizza altre richieste al tuo servizio DNS preferito (ISP o DNS pubblico).

:::note

Non configurare Samba Active Directory come risolutore di nomi del nodo NS8 in `/etc/resolv.conf`. Per ulteriori informazioni, consulta [Risoluzione dei nomi](system_requirements.md#resolv-conf).

:::
## LDAP server RFC2307 {#openldap-section}

Per installare un nuovo dominio utente con un OpenLDAP interno come provider:

- Accedi alla pagina `Domini e utenti`.
- Clicca su **Crea dominio** e scegli `Interno`.
- Nella finestra di dialogo, seleziona `OpenLDAP` e clicca su **Installa
  provider**.

Una volta installato il provider, ti verrà richiesto di inserire i seguenti parametri:

- `Dominio`: il dominio utente, deve essere un FQDN valido. Se non sei sicuro, mantieni il valore proposto.
- `Nome utente admin OpenLDAP` e `Password admin OpenLDAP`: credenziali amministrative

Infine, vedrai un nuovo dominio utente con un provider connesso. Ora puoi [gestire utenti e gruppi](#user_groups-section) o [aggiungere una replica](#provider_replica-section).

:::note

Il provider OpenLDAP non è attualmente accessibile dall'esterno del cluster.

:::
## Repliche del provider {#provider_replica-section}

Le repliche del provider implementano la tolleranza ai guasti per i domini utente. Per ottenere una reale tolleranza ai guasti, le repliche dovrebbero essere installate su nodi diversi.

È possibile aggiungere una replica dalla pagina `Domini e utenti` selezionando la scheda `Configurazione` nei dettagli del dominio. Quindi fare clic sul pulsante **Aggiungi provider**, selezionare il nodo di destinazione e procedere con l'installazione.

Le repliche sono configurate in modalità master-master.

:::note

Il provider Active Directory non replica il volume SysVol. Pertanto, gli oggetti Criteri di gruppo (GPO) di Microsoft non saranno sincronizzati tra le repliche.

:::
## Impostazioni di binding LDAP {#domain_bind-section}

Il binding è il processo in cui il server LDAP autentica il client e, se l'autenticazione ha esito positivo, il server consente l'accesso al client.

Molte applicazioni potrebbero richiedere di essere collegate a un dominio utente esistente di NethServer 8. Le impostazioni di binding sono accessibili dalla scheda `Configuration` nei dettagli del dominio.

Il provider Samba AD espone le porte LDAP e LDAPS standard (389/636) alle applicazioni esterne al cluster solo se è stato creato con l'opzione `Provide shared folders and authentication to Windows clients` (vedi [Active Directory](#active_directory-section)).

I provider OpenLDAP RFC2307 non espongono alcuna porta per le applicazioni esterne. Essi ascoltano su una singola porta LDAP in chiaro accessibile ai servizi all'interno della rete del cluster. Non sono necessarie configurazioni manuali.
## Server LDAP esterno {#ldap_proxy-section}

È possibile collegare il cluster NethServer 8 a un server LDAP esistente.

1.  Accedere alla pagina `Domains and users`.
2.  Fare clic sul pulsante **Create domain** e scegliere `External`.
3.  Compilare tutti i campi obbligatori. Tenere presente che, a parte "Host" e "Port", le impostazioni del dominio non possono essere modificate successivamente:
    - `Domain`: Questo dovrebbe essere in sintassi fully qualified domain name (FQDN), ma può essere qualsiasi nome logico che corrisponda alla struttura del base DN dell'LDAP. Ad esempio, se il base DN del tuo LDAP è `dc=example,dc=org`, un nome di dominio adatto sarebbe "example.org".
    - `Host`: Inserire l'indirizzo IP o il nome host del server LDAP.
    - `Port`: Specificare il numero di porta TCP del servizio LDAP remoto. I valori standard sono 389 per LDAP e 636 per LDAPS. Tuttavia, con Active Directory, alcune applicazioni come Mail[^2] potrebbero richiedere l'impostazione della porta LDAP 3268 o della porta LDAPS 3269. Questo perché non supportano i "LDAP subordinate referrals".
    - `Bind DN` e `Password`: Credenziali necessarie per accedere al server LDAP remoto.
    - `Base DN`: Definire il livello della gerarchia LDAP da utilizzare come base per la ricerca di utenti e gruppi. Lasciando vuoto questo campo, il valore corretto verrà recuperato direttamente dal server LDAP.
    - `TLS`: Abilitare questo interruttore per crittografare la connessione con TLS. Se il server non supporta TLS sulla porta specificata, si verificherà un errore.
    - `TLS verify`: Abilitare questo interruttore per garantire che il server LDAP fornisca un certificato TLS valido firmato da un'autorità fidata, con il nome del certificato corrispondente al nome host specificato nel campo "Host". Continuare a leggere per comprendere appieno le implicazioni di questa opzione.
4.  Una volta compilati tutti i campi, fare clic sul pulsante **Configure domain**.

### Modificare le impostazioni del server LDAP esterno {#modify-external-ldap}

Quando un dominio viene configurato per la prima volta, le impostazioni del server LDAP vengono salvate nella sua prima voce del provider. Le credenziali di bind e le impostazioni TLS possono essere modificate successivamente dalla scheda `Domain Settings`.

Se si sceglie di non verificare TLS, è possibile configurare host aggiuntivi come provider di backup. Il primo provider configurato è considerato il server backend LDAP primario. Se un nodo del cluster non riesce a raggiungerlo, passa a un altro provider. È fondamentale che tutti i provider di dominio siano accessibili da qualsiasi nodo del cluster.

L'abilitazione di "TLS verify" aggiunge maggiore sicurezza ma presenta limitazioni: solo il primo provider viene considerato. Se diventa irraggiungibile, non è possibile recuperare la connessione.

:::note

Assicurarsi che ogni provider sia accessibile da tutti i nodi del cluster per un funzionamento senza interruzioni.

:::
## Politica delle password {#password-policy-section}

La politica delle password è un insieme di regole che definisce la complessità delle password e il tempo di scadenza delle stesse. Puoi configurare la politica delle password dalla pagina `Domini e utenti` selezionando il dominio interessato e cliccando su **Modifica politica delle password** dal menu a tre punti della scheda `Password`.

Puoi configurare separatamente la durata e la complessità delle password.

### Durata delle password

Puoi attivare o disattivare la politica di durata delle password cliccando sull'interruttore `Durata password`. Se abilitata, puoi configurare i seguenti parametri:

- `Età minima password` (predefinito 0): il numero minimo di giorni che deve trascorrere prima di poter cambiare nuovamente la password.
- `Età massima password` (predefinito 180): il tempo di scadenza della password in giorni. Dopo questo periodo, la password non sarà più valida per l'accesso e dovrà essere cambiata. Gli utenti possono cambiare la loro password scaduta tramite il [portale di gestione utenti](#user-management-portal-section).

### Complessità delle password

Abilitando l'interruttore `Complessità password`, puoi configurare i seguenti parametri:

- `Lunghezza cronologia password`: il numero di vecchie password che non possono essere riutilizzate.
- `Lunghezza minima password`: il numero minimo di caratteri che una password deve avere.
- `Forza complessità password`: obbliga l'uso di password complesse, vedi la nota per maggiori dettagli.

:::note

Una password è considerata complessa se è sufficientemente lunga e soddisfa tre delle seguenti regole:

- La password deve contenere almeno una lettera maiuscola.
- La password deve contenere almeno una lettera minuscola.
- La password deve contenere almeno una cifra.
- La password deve contenere almeno un carattere speciale.

:::

Dopo aver modificato la politica delle password, puoi cliccare sul pulsante **Modifica politica delle password** per salvare le modifiche. Le modifiche alle impostazioni di complessità non influenzano le vecchie password: saranno valide da quel momento in poi. Le modifiche alle impostazioni di durata sono retroattive e si applicano anche alle password già impostate.

### Avviso di scadenza delle password {#password-warning}

Il sistema può inviare notifiche email agli utenti quando la loro password sta per scadere.

Questa funzionalità è disponibile **solo per i domini utente interni** e può essere abilitata per ciascun dominio utente.

Per abilitare questa funzionalità, assicurati che:

- l'invecchiamento delle password sia abilitato sul dominio utente
- il cluster sia configurato per inviare [notifiche email](../configuration/email_notifications.md)

La funzionalità può essere abilitata dalla pagina di configurazione del dominio utente cliccando sul pulsante **Modifica avviso password** nella scheda `Password`.

Dopo aver abilitato la funzionalità, compila i seguenti campi:

- `Giorni prima della scadenza`: il numero di giorni prima della scadenza della password in cui viene inviata la notifica. La notifica viene inviata ogni giorno fino alla scadenza della password.
- `Indirizzo email del mittente`: l'indirizzo email del mittente, assicurati che sia un indirizzo valido per evitare problemi con i filtri antispam.
- `Template email`: seleziona il template da utilizzare per l'email di notifica. Puoi scegliere tra i template predefiniti o uno personalizzato. I template predefiniti sono disponibili in inglese e italiano. Per utilizzare un template personalizzato, consulta [Template personalizzato](#password_warning_custom_template-section).

L'email di notifica viene inviata all'indirizzo email dell'utente, che può essere rilevato automaticamente o impostato manualmente da un amministratore, a seconda della configurazione del cluster.

#### Server SMTP interno

Quando è installata un'istanza di [server di posta interno](../applications/mail.md) e il cluster è configurato per inviare notifiche email utilizzandolo, l'indirizzo email dell'utente viene rilevato automaticamente e utilizzato per inviare la notifica di scadenza della password.

L'indirizzo email può essere sovrascritto da un amministratore impostando il campo `mail` all'interno del [portale di gestione utenti](#user-management-portal-section).

:::note

Se il cluster è configurato per inviare notifiche email utilizzando un server SMTP esterno, l'indirizzo email rilevato automaticamente non è valido perché il dominio utente non è noto al server esterno. In questo caso, è necessario impostare esplicitamente l'indirizzo email per l'utente.

:::

#### Server SMTP esterno

Quando il cluster è configurato per inviare notifiche email utilizzando un server SMTP esterno, l'indirizzo email dell'utente non viene rilevato automaticamente. Un amministratore deve impostarlo manualmente per ciascun utente utilizzando il [portale di gestione utenti](#user-management-portal-section).

Il campo dell'indirizzo email è disponibile sia per i domini utente OpenLDAP che Active Directory.

#### Template personalizzato {#password_warning_custom_template-section}

Dopo aver selezionato un template personalizzato nel campo `Template email`, puoi specificare altri 2 campi:

- `Oggetto email`: l'oggetto dell'email di notifica
- `Template email`: il corpo dell'email di notifica in HTML o testo semplice

Sia l'oggetto dell'email che il corpo dell'email possono includere i seguenti segnaposto:

- `$user`: il nome utente
- `$name`: il nome completo dell'utente
- `$domain`: il nome del dominio utente
- `$days`: il numero effettivo di giorni prima della scadenza della password
- `$portal_url`: l'URL del portale di gestione utenti

Esempio di template personalizzato in testo semplice:

    Gentile $user ($name) del dominio $domain.
    La tua password scadrà tra $days giorni.
    Cambiala qui: $portal_url

Se desideri creare un template HTML, puoi iniziare copiando uno di quelli predefiniti come `/etc/nethserver/password_warning/default_en.tmpl`. Copialo e incollalo nel campo `Template email`, quindi modificalo secondo le tue esigenze.
## Utenti e gruppi {#user_groups-section}

Puoi gestire gli utenti e i gruppi di un dominio cliccando sul link `User and groups` dalla pagina `Domains and users`.

Se è stato configurato un dominio utente esterno, la pagina mostra liste in sola lettura. Le modifiche alla base utenti devono essere effettuate sul server esterno.

D'altra parte, se è stato installato un provider di account AD locale o LDAP, la pagina consente di creare, modificare e eliminare utenti e gruppi.

### Creare utenti e gruppi {#create-users-and-groups-section}

Quando si crea un utente, i seguenti campi sono obbligatori:

- Nome utente
- Nome completo (nome e cognome)
- Password

Gli attributi opzionali sono:

- Indirizzo email -- Corrisponde all'attributo LDAP standard `mail`. Può essere impostato sull'indirizzo email personale dell'utente, dove vengono inviate le notifiche di scadenza della password. Alcune applicazioni possono anche utilizzarlo come nome utente valido per l'accesso.
- La password non scade mai (solo AD) -- Quando abilitato, la password dell'utente rimane valida indefinitamente, ignorando la politica di scadenza delle password del dominio.
- Cambio password obbligatorio / L'utente deve cambiare la password al prossimo accesso (solo AD) -- Quando abilitato, l'utente viene invitato a cambiare la propria password al prossimo accesso.

Un utente può essere aggiunto a uno o più gruppi.

A volte è necessario bloccare l'accesso ai servizi da parte di un utente senza eliminare l'account. L'approccio più sicuro è:

1.  (facoltativamente) cambiare la password dell'utente con una casuale
2.  disabilitare l'utente utilizzando l'azione `Disable` dal menu con tre punti

Quando un utente viene eliminato, i dati dell'utente non saranno rimossi. L'eliminazione di un utente non rimuove il contenuto della casella di posta, le directory personali o i dati specifici delle applicazioni. Questi devono essere puliti manualmente in base alle applicazioni installate.

I nomi utente devono essere univoci all'interno dello stesso dominio, ma possono essere riutilizzati tra domini diversi ospitati nel cluster.

### Importare ed esportare dati {#import-export-data-section}

Gli utenti e i gruppi possono essere gestiti in blocco con le azioni *import* e *export data*. Il formato dati supportato è [CSV](https://www.rfc-editor.org/rfc/rfc4180) (valori separati da virgola) con i seguenti campi:

1.  *username*
2.  *display_name* -- Un valore vuoto rimuove l'attributo LDAP `displayName`.
3.  *password* -- Se la password contiene una virgola (es. `Nethesis,1234`), racchiudi questo campo tra virgolette doppie. Un valore vuoto lascia la password invariata per gli utenti esistenti e imposta una password iniziale casuale per gli utenti appena creati.
4.  *mail* -- Un indirizzo email valido. Nota che, a differenza di Samba Active Directory, lo schema OpenLDAP RFC2307 non consente caratteri speciali. Un valore vuoto rimuove il corrispondente attributo LDAP `mail`.
5.  *groups* -- Un elenco di gruppi separati dal carattere `|` (pipe). Se un gruppo non esiste ancora, viene creato automaticamente durante l'importazione. Se questo campo è vuoto, l'utente viene rimosso da tutti i gruppi.
6.  *locked* (booleano)
7.  *must_change_password* (booleano)
8.  *no_password_expiration* (booleano)

I campi devono essere presenti nell'ordine esatto sopra indicato. Corrispondono agli attributi descritti nella sezione precedente; consulta [Creare utenti e gruppi](#create-users-and-groups-section) per maggiori informazioni.

Gli ultimi tre campi sono valori booleani. I valori accettati sono limitati alle stringhe `true` e `false`. La stringa vuota e qualsiasi valore diverso da `true` vengono interpretati come `false`.

Ad esempio, questo file CSV include una riga di intestazione opzionale con gli otto campi obbligatori, seguita da un record per l'utente `john`, che è membro dei gruppi `devs` e `web`.

    user,display_name,password,mail,groups,locked,must_change_password,no_password_expiration
    john,Johnny Smith,s3Cr3tXX,john@example.org,devs|web,false,true,false
## Portale di gestione utenti {#user-management-portal-section}

Il portale di gestione utenti è un'applicazione web che consente a qualsiasi utente non amministratore di cambiare la propria password senza necessità di intervento da parte dell'amministratore, anche se la password è scaduta.

I membri del gruppo Domain Admins possono anche gestire utenti e gruppi nel dominio, indipendentemente dall'interfaccia Cluster Admin.

Le possibili azioni amministrative sono:

- creazione/modifica di gruppi
- creazione/modifica di utenti
- disabilitazione/abilitazione di utenti
- cambio della password degli utenti

Durante la creazione di un utente, sono disponibili i seguenti campi:

- Nome utente
- Nome completo (nome e cognome)
- Password
- Gruppo (campo opzionale)
- Indirizzo email (campo opzionale)
- Password non scade mai (campo opzionale, solo AD)
- Cambio password richiesto / L'utente deve cambiare la password al prossimo accesso (campo opzionale, solo AD)

Il portale è configurato automaticamente su ogni istanza di [Active Directory](#active_directory-section) o del provider [LDAP server RFC2307](#openldap-section).

Il portale è disponibile al seguente URL:

    https://<fqdn_node>/users-admin/<domain_name>/

Dove `<fqdn_node>` è il FQDN del nodo in cui si trova il provider e `<domain_name>` è il nome del dominio fornito durante la configurazione del dominio.

Una volta raggiunta la pagina, all'utente viene richiesto di effettuare il login e può autenticarsi al dominio con nome utente e password.

Se il login ha successo, l'utente viene indirizzato alla pagina `Gestione Utenti`, dove può procedere al cambio della password. Durante questo processo, la password deve rispettare le politiche di sicurezza del dominio. L'elenco delle applicazioni in cui la nuova password sarà efficace viene visualizzato accanto al modulo per il cambio della password.

**Note**

[^1]: <https://social.technet.microsoft.com/wiki/contents/articles/34981.active-directory-best-practices-for-internal-domain-and-network-names.aspx#Recommendation>

[^2]: <https://doc.dovecot.org/2.3/configuration_manual/authentication/ldap/#active-directory>
