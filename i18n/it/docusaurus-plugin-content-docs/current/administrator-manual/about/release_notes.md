---
title: Note di rilascio
sidebar_position: 2
---
# Note di rilascio

Rilasci di NethServer 8

- Elenco dei [bug conosciuti](https://github.com/NethServer/dev/issues?q=is%3Aissue%20is%3Aopen%20type%3Abug%20project%3ANethServer%2F8) su GitHub
- Discussioni sui [possibili bug](http://community.nethserver.org/c/bug) nel nostro forum pubblico
## Modifiche principali del 27-03-2026

**Milestone 8.8**

- **Notifica UI a basso contrasto** \[Core 3.18\] -- Lo stile di notifica dell'interfaccia cluster-admin è ora a basso contrasto, come richiesto dalle linee guida del Carbon Design System.

- **Esecuzioni di backup annullabili** \[Core 3.18\] -- È ora possibile annullare un'esecuzione di backup, a condizione che sia stata avviata dall'interfaccia cluster-admin.

- **Importazione delle destinazioni di backup e regolazioni UI** \[Core 3.18\] -- Nella pagina `Backup e ripristino`, sezioni separate e etichette di testo chiare migliorano la navigazione tra le diverse azioni.

  Configurare una destinazione di backup è un prerequisito per il ripristino delle applicazioni. Una nuova azione **Importa destinazioni** consente di configurare rapidamente una destinazione di backup partendo da un file di backup del cluster. È necessaria la password di crittografia del backup per completare l'azione.

- **Debian 13 (Trixie)** \[Core 3.17\] -- L'installazione di NethServer 8 è ora disponibile su Debian 13 (Trixie). A partire dal prossimo milestone 8.9, Debian 12 non sarà più compatibile con l'installer di NS8. Ecco un riepilogo dei comandi necessari per aggiornare un nodo NS8 da Debian 12.

  Verificare il nome e la versione della distribuzione:

      cat /etc/os-release

  Assicurarsi che il nodo stia utilizzando Debian 12, quindi correggere i riferimenti APT e aggiornare il sistema:

      sed -i 's/bookworm/trixie/' /etc/apt/sources.list /etc/apt/sources.list.d/*
      apt update && apt full-upgrade -y

  Se richiesto, riavviare i servizi e mantenere le versioni dei file di configurazione locali.

  Aggiornare l'ambiente virtuale Python 3 di NS8:

      (
        set -e -x
        core_dir=/usr/local/agent/pyenv
        mv -v ${core_dir} ${core_dir}.bak
        python3.13 -mvenv ${core_dir} --upgrade-deps --system-site-packages
        ${core_dir}/bin/pip3 install -r /etc/nethserver/pyreq3_13.txt
        echo "/usr/local/agent/pypkg" >$(${core_dir}/bin/python3 -c "import sys; print(sys.path[-1] + '/pypkg.pth')")
        rm -rf ${core_dir}.bak
      )
      runagent python3 --version # output dovrebbe essere 3.13.5

  Aggiornare le sorgenti APT a deb822 (opzionale):

      apt modernize-sources

  Infine, riavviare il nodo. Ripetere la stessa procedura su ogni nodo del cluster.

- **Selezione di volumi aggiuntivi** \[Core 3.17\] -- Quando un'applicazione viene ripristinata, clonata o installata per la prima volta, l'interfaccia potrebbe richiedere di selezionare il volume per i dati. La selezione è disponibile sui nodi con un volume aggiuntivo e per le applicazioni che lo supportano. Vedere [Installare applicazioni](../installation/software_center.md#install-applications).

- **Certificati TLS per Samba** \[Samba 3.4.2\] -- Samba LDAP è integrato con la pagina `Certificati TLS`. Un certificato caricato o ottenuto, corrispondente al FQDN di Samba, viene utilizzato per il servizio LDAP.

- **RustFS sostituisce MinIO** \[RustFS 1.0\] -- Una nuova applicazione compatibile con S3 sostituisce MinIO nel Software Center. Si consiglia di migrare le installazioni esistenti di MinIO a RustFS. Vedere [RustFS](../applications/rustfs.md) per ulteriori informazioni.

- **Aggiornamenti delle applicazioni** -- Mattermost 10.11 ESR, Ejabberd 26.02.
## Principali modifiche del 2025-12-17

**Milestone 8.7**

- **Importazione/esportazione dati** \[Core 3.16\] -- Utenti e gruppi possono essere importati/esportati con un file in formato CSV, contenente nome utente, password, gruppi e altri dettagli. La procedura di importazione/esportazione può essere eseguita anche tramite le API del cluster-admin e del portale utente. Fare riferimento a [Importazione ed esportazione dati](../installation/user_domains.md#import-export-data-section) per maggiori informazioni.
- **Regole avanzate di Firewalld** \[Core 3.16\] -- Gli sviluppatori di applicazioni possono configurare regole avanzate di Firewalld per gestire casi d'uso complessi di instradamento di rete.
- **Pagina Applicazioni** \[Core 3.15\] -- È stata aggiunta una nuova [Pagina Applicazioni](../installation/modules.md) per raccogliere rapidamente informazioni sulle applicazioni installate nel cluster, il loro nodo di installazione, tipo, versione e collegamenti per interagire con esse.
- **Pagina Nodi** \[Core 3.14\] -- La [Pagina Nodi](../configuration/cluster.md#node-views) è stata semplificata per facilitare l'identificazione dei nodi del cluster anche tramite FQDN, mentre le metriche di utilizzo delle risorse sono state spostate nella vista dettagliata del nodo, insieme agli avvisi del nodo e ai collegamenti agli indirizzi IP dettagliati e alle applicazioni. Se è in corso una migrazione NS7, il sistema NS7 viene visualizzato come un nodo speciale.
- **Gestione dischi aggiuntivi** \[Core 3.14\] -- Aggiunto il supporto per [assegnare volumi denominati Podman a dischi aggiuntivi](../../tutorial/disk_usage.md#named-volume-disk). Gli amministratori possono ora preconfigurare il percorso base utilizzato durante la creazione di volumi denominati per applicazioni rootless. Questo consente di reindirizzare i dati delle applicazioni verso dischi alternativi, migliorando l'organizzazione dello storage e riducendo la pressione sul disco di sistema. Questa funzionalità è particolarmente utile per applicazioni ad alta intensità di dati come il server file Samba. Un nuovo comando, `volumectl`, consente di elencare i percorsi base disponibili, assegnare volumi a un disco selezionato e rimuovere assegnazioni esistenti. La configurazione viene applicata durante l'installazione, il ripristino o la clonazione delle applicazioni; il trasferimento di volumi esistenti non è ancora supportato. Un futuro aggiornamento estenderà questa funzionalità all'interfaccia utente del cluster-admin, consentendo la selezione del disco durante le operazioni di installazione, clonazione e ripristino delle applicazioni.
- **Ottimizzazione del carico all'avvio** \[Core 3.14\] -- Il carico di sistema all'avvio viene ottimizzato dinamicamente in base al numero di processori disponibili. Il carico viene distribuito in modo sequenziale su un periodo di tempo più lungo, riducendo la concorrenza delle applicazioni e prevenendo colli di bottiglia delle risorse.
- **Riduzione delle dimensioni del registro di controllo** \[Core 3.14\] -- I tipi di eventi memorizzati nel [Registro di controllo](../configuration/cluster.md#audit-trail-section) sono stati ridotti per limitare il volume delle scritture dell'api-server. Vengono memorizzati solo gli eventi `create-tasks` e `login-ok` (accessi riusciti). Si noti che gli eventi di accesso non riusciti continuano a essere registrati.
- **Processi limitati degli agenti** \[Core 3.12\] -- Il numero predefinito di processi simultanei avviati dagli agenti è ora limitato a 32. I compiti successivi vengono rifiutati con il messaggio *Agent is busy* fino a quando il numero di processi in esecuzione non scende al di sotto del limite.
- **Registri di accesso del Cloud Log Manager (CLM)** \[Core 3.12\] -- Gli eventi di accesso del cluster-admin sono contrassegnati con la categoria *security* e inviati al [Cloud Log Manager](../configuration/log_server.md#clm-section), se abilitato.
- **Personalizzazione di Samba \[homes\]** \[3.2.0\] -- L'applicazione core Samba supporta la personalizzazione della sezione `[homes]` nel file `include.conf`, in linea con altre sezioni.
- **Aggiornamento di Piler** \[1.1.0\] -- Piler è stato aggiornato alla versione upstream 1.4.8, fornendo nuove funzionalità, miglioramenti delle prestazioni e numerose correzioni di bug e di sicurezza.
- **Nextcloud 32 / HUB 25 Autumn** \[1.6.0\] -- Aggiornato all'ultima versione principale di Nextcloud.
## Modifiche principali del 30-09-2025

**Milestone 8.6**

- **Modifica dell'età di scadenza predefinita delle password** -- I domini utente Samba AD e OpenLDAP vengono ora creati con un'età predefinita delle password compresa tra 0 e 180 giorni. Queste impostazioni possono essere modificate dopo la creazione del dominio. Vedi [Politica delle password](../installation/user_domains.md#password-policy-section) per i dettagli. La politica predefinita precedente per Samba AD era compresa tra 1 e 42 giorni.
- **Attributi delle password di Samba AD** -- Per i domini AD interni, due nuovi attributi possono essere gestiti dalle interfacce web del cluster-admin e del portale utente: `Required password change` e `Password never expires`. Vedi [Utenti e gruppi](../installation/user_domains.md#user_groups-section).
- **Nuova pagina dei certificati TLS** -- La pagina UI [Certificati TLS](../configuration/certificates.md) ha completato il ciclo di miglioramento iniziato nelle versioni precedenti, fornendo una gestione completa dei certificati Let's Encrypt con procedure chiare di validazione e cancellazione.
- **Avviso di scadenza dei certificati TLS** -- Un messaggio di avviso automatico viene inviato quando un certificato TLS è in scadenza entro 28 giorni. Vedi [Metriche e avvisi](../configuration/metrics.md) per configurare gli avvisi.
- **Azione di riavvio delle applicazioni** -- Ora è possibile riavviare completamente un'istanza applicativa dalla [pagina del Software Center](../installation/software_center.md#application-instances). L'effetto è simile a un riavvio del nodo ma limitato all'applicazione: tutti i suoi componenti vengono completamente arrestati e poi riavviati.
- **UI delle applicazioni disabilitata durante la migrazione** -- L'interfaccia utente dell'amministratore del cluster di un'applicazione viene disabilitata durante la migrazione. Questa è una misura di sicurezza per prevenire azioni accidentali che potrebbero interrompere il processo di migrazione.
- **Riduzione delle notifiche email di CrowdSec** -- Il volume delle notifiche è stato ridotto a un messaggio giornaliero contenente un riepilogo delle decisioni di blocco di CrowdSec. Se il numero di decisioni supera una soglia prestabilita (500 di default), la notifica viene inviata immediatamente. Ora è possibile personalizzare il mittente della notifica per migliorare la qualità del messaggio e superare meglio i filtri antispam. Il corpo del messaggio presenta anche un layout e uno stile migliorati.
- **Backup della configurazione del cluster su my.nethserver.com** -- Il backup della configurazione del cluster dei sistemi con un abbonamento attivo a *my.nethserver.com* viene verificato, crittografato e caricato ogni notte sul cloud. Può essere scaricato seguendo la procedura seguente.
  1.  Ottieni il **System ID** e il **Secret** del cluster da my.nethserver.com.

  2.  Elenca i backup disponibili nel cloud:

          curl -u SYSTEM_ID:SECRET https://backupd.nethesis.it/community/api/v2/backup/ | jq

      Esempio di output:

          {
            "backups": [
              {
                "id": "7791926e6cee5455e06eb59e645737ae6a4b542a4f6014a213cb00648789b043.gpg",
                "name": "7791926e6cee5455e06eb59e645737ae6a4b542a4f6014a213cb00648789b043.gpg",
                "created": 1756213506,
                "size": 755,
                "mimetype": "application/pgp-encrypted"
              }
            ]
          }

  3.  Prendi nota del valore `id` del backup e scaricalo:

          curl -f -O -u SYSTEM_ID:SECRET https://backupd.nethesis.it/community/api/v2/backup/7791926e6cee5455e06eb59e645737ae6a4b542a4f6014a213cb00648789b043.gpg
- **Ottimizzatore DB di Nextcloud** -- Dopo la migrazione da NS7 o altri aggiornamenti principali, Nextcloud potrebbe richiedere correzioni manuali del database che non possono essere automatizzate durante l'aggiornamento, poiché queste operazioni potrebbero richiedere molto tempo con dataset di grandi dimensioni. In tali casi, il comando `nextcloud-db-optimize` può essere eseguito manualmente per ottimizzare il database di Nextcloud al di fuori degli orari di produzione. Consulta [Comando di ottimizzazione del database](../applications/nextcloud.md#nextcloud-db-optimize-section).
- **Aggiornamenti WebTop** -- WebTop 5.29.2 (versione app 1.4.4) introduce un'interfaccia utente rinnovata con layout semplificati, nuovi pulsanti di accesso rapido e icone aggiornate. Le principali nuove funzionalità includono l'invio ritardato delle email, con la possibilità di annullare prima della consegna, e la configurazione automatica IMAP/SMTP per una configurazione più semplice sui dispositivi mobili (vedi [Configurazione automatica dei client email](../applications/webtop.md#email_autoconfig)). L'aggiornamento porta anche numerosi miglioramenti di usabilità, correzioni di bug e miglioramenti della sicurezza.
- **Aggiornamenti NethVoice** -- NethVoice 1.4.0 introduce lo streaming video JPG in tempo reale per i videocitofoni, con anteprime direttamente nelle notifiche di chiamata e Phone Island. La versione offre anche un design migliorato del pannello operatore, una maggiore accessibilità della dashboard e una gestione migliorata di SRTP in NethVoice Proxy. Numerose correzioni migliorano l'affidabilità e l'usabilità in CTI, trunk VoIP, conferenze, segreteria telefonica e trasferimenti di chiamata.
- **Altri aggiornamenti delle applicazioni** -- Diverse applicazioni sono state aggiornate per includere le ultime modifiche upstream. Ecco un breve elenco dal repository predefinito:
  - Mattermost 10.5.11 ESR
  - Ejabberd 25.07
  - Nextcloud 31.0.7
  - CrowdSec 1.16.11
## Modifiche principali del 2025-07-08

**Milestone 8.5** -- Dedicato alla memoria di [Andy Wismer](https://community.nethserver.org/t/in-memory-of-andy-wismer/25698)

- **Controllo della versione del nodo worker** -- È stato aggiunto un controllo di sicurezza quando un nuovo nodo worker si unisce al cluster: la sua versione core viene ora confrontata con quella del nodo leader per garantire la compatibilità. Prima di unirsi al cluster, aggiornare sempre il core del cluster e assicurarsi che sui nuovi nodi worker sia utilizzata l'ultima versione del core.

- **Supporto per il backup Hetzner S3** -- Aggiunto il supporto per la configurazione di Hetzner S3 come destinazione di backup personalizzata. Inoltre, è stato corretto un bug che impediva la rinomina delle destinazioni di backup personalizzate S3.

- **Ruolo di membro di dominio Samba e nuove funzionalità** -- L'applicazione core Samba può ora essere installata dal Software Center e configurata come membro di dominio Active Directory, fornendo cartelle condivise in un ruolo di File Server di dominio. Vedi [Samba file server](../applications/file_server.md).

  È ora possibile assegnare un nome alias a Samba utilizzando l'interfaccia utente del File Server (vedi [Alias del file server](../applications/file_server.md#file-server-alias)). Questa funzionalità semplifica la migrazione dei server di file SMB esistenti all'applicazione Samba di NS8.

  È stato aggiunto il **servizio WSDD** per rendere il file server Samba individuabile nella rete locale utilizzando un moderno protocollo multicast che sostituisce la risoluzione dei nomi NetBIOS legacy.

  Le cartelle condivise di Samba ora offrono tre nuove funzionalità avanzate: Cestino, registrazione degli audit con una dashboard centralizzata di Grafana e controllo della visibilità delle cartelle. Per ulteriori informazioni, consulta [Cartelle condivise](../applications/file_server.md#shared-folders-section).

- **Impostazioni Metriche** -- È stata aggiunta una nuova sezione "Metriche" nella pagina delle impostazioni del cluster, consentendo la configurazione dell'interfaccia web di Grafana e delle notifiche di allerta del cluster via email. Vedi [Metriche e avvisi](../configuration/metrics.md) per i dettagli.

- **Promtail sostituito da Alloy** -- Il servizio nodo Promtail, precedentemente utilizzato per inoltrare i log dei nodi al collettore centrale Loki (ora aggiornato alla versione 3), ha raggiunto l'EOL ed è stato sostituito da **Alloy**, il suo successore upstream.

- **Catch-all del dominio di posta e altre correzioni** -- Dalla versione 1.7, l'applicazione Mail può consegnare i messaggi inviati a indirizzi di dominio sconosciuti a una destinazione **catch-all** speciale—un singolo utente o un gruppo—indipendentemente dalle altre impostazioni del dominio. Questo risolve una limitazione delle versioni precedenti in cui l'impostazione `Add user addresses from user domain` era incompatibile con la funzionalità catch-all.

  È stato inoltre corretto un bug che interessava le regole di relay basate sul mittente e le credenziali del server SMTP remoto.

  Infine, è stata riconosciuta una limitazione di configurazione: nel raro caso in cui un utente e un gruppo condividano lo stesso nome, i messaggi in arrivo inviati a quel nome saranno sempre consegnati ai membri del gruppo. Vedi [Domini](../applications/mail.md#email_domains).

- **Miglioramenti alla pagina dei certificati TLS** -- La procedura **Richiedi certificato** ora include un controllo di validazione per impedire la richiesta di nomi già configurati come rotte HTTP. Gli errori ACME vengono ora visualizzati come notifiche inline durante la validazione del certificato prima che venga applicata la nuova configurazione.

- **Rotte HTTP e reindirizzamento con slash** -- La tabella delle rotte HTTP nella pagina delle Impostazioni ora mostra l'**host e il percorso** in una nuova colonna **Route** per una migliore identificazione delle rotte.

  È stato aggiunto un nuovo **reindirizzamento automatico con slash finale** per le rotte basate su percorso. Questo è utile per le applicazioni con interfacce web che non gestiscono gli slash finali, come il portale utente.

  Le nuove installazioni includono già questa funzionalità. Per abilitarla su istanze più vecchie del portale utente, eseguire un comando come:

      api-cli run module/traefik1/set-route --data '{"name":"samba1-amld","slash_redirect":true}'

  Sostituire `"traefik1"` e `"samba1"` con gli identificatori effettivi dei moduli, che possono essere trovati nella pagina delle rotte HTTP. Cercare `"amld"` e controllare i dettagli della rotta.

- **Aggiornamenti WebTop** -- L'applicazione WebTop è stata aggiornata all'ultima versione upstream 5.28.6, insieme al nuovo PEC Bridge 5.4.8 che include notifiche personalizzate.

  L'integrazione con la rubrica centralizzata di NethVoice è stata ripristinata e la funzionalità *click2call* è stata aggiornata per utilizzare il protocollo `tel:` con NethLink.

  WebTop ora supporta [Autoconfig e Autodiscovery](../applications/webtop.md#email_autoconfig), semplificando la configurazione degli account di posta sui dispositivi mobili.

  Altri miglioramenti includono:

  - Ricerca email più veloce con allegati
  - Miglioramento del raggruppamento per discussione
  - Possibilità di caricare file JAR personalizzati all'avvio
  - Nuova pagina di login per OTP e modalità di manutenzione

- **NethVoice 1.3.4** -- Nuove funzionalità e miglioramenti:

  - Miglioramenti dell'interfaccia avanzata: CLI di Asterisk e visualizzatore di log direttamente nell'interfaccia utente
  - Nuova Phone Island: Supporto alla registrazione delle chiamate, Funzionalità di cambio dispositivo
  - Strumenti di collaborazione: Conferenze audio, Videochiamate, Condivisione dello schermo
  - Modulo Hotel NethVoice: Integrazione con sistemi alberghieri tramite protocollo FIAS
  - Miglioramenti al CTI di NethVoice: Interfaccia utente e grafica aggiornate, Funzionalità di risposta alle chiamate, Cassetto laterale comprimibile per una migliore usabilità
  - Gestione dello streaming: Visualizzazione dei flussi video all'interno del CTI di NethVoice (ad esempio, per citofoni)
- **Pacchetto mancante in Debian Bookworm** -- Alcune installazioni di Debian potrebbero non includere il pacchetto `gettext-base`. Assicurarsi che sia installato con:

      apt-get update
      apt install gettext-base

- **Aggiornamenti di altre applicazioni** -- Versioni delle applicazioni aggiornate:

  - Nextcloud 31
  - Collabora 25
  - Roundcube 1.6.11
  - SOGo 5.12
  - Mattermost 10.5.5 con PostgreSQL 17.5
  - Netdata 2.4
  - CrowdSec 1.6.8
  - Ejabberd 25.4
## Modifiche principali del 2025-04-04

**Milestone 8.4**

- **Notifica agli utenti delle password in scadenza** -- I domini utenti interni con una politica di scadenza delle password abilitata possono ora essere configurati per inviare notifiche email agli utenti che si avvicinano alla data di scadenza della password. Vedi [Avviso di scadenza password](../installation/user_domains.md#password-warning).

- **Modifica delle impostazioni LDAP esterne** -- Le credenziali di bind e le impostazioni TLS di un dominio utente esterno possono ora essere modificate dopo la creazione del dominio. Vedi [Modifica delle impostazioni LDAP esterne](../installation/user_domains.md#modify-external-ldap).

- **Configurazione del percorso base della directory home per le applicazioni** -- Il percorso base predefinito della directory home delle applicazioni è `/home` (predefinito per distribuzione). Ora è possibile specificare e utilizzare un percorso base diverso, come documentato in [Utilizzo del disco](../../tutorial/disk_usage.md), insieme ad altre tecniche per espandere lo spazio su disco disponibile.

- **Supporto per certificati TLS wildcard** -- I certificati wildcard possono essere caricati e distribuiti alle applicazioni del cluster direttamente dalla pagina `Certificati TLS`. Per ulteriori informazioni, consulta [Certificati TLS](../configuration/certificates.md). Mail, NethVoice e NethVoice Proxy sono stati aggiornati per supportare i certificati wildcard. Il supporto per Ejabberd sarà disponibile a breve.

- **Nuovo formato di challenge ACME predefinito TLS-ALPN-01** -- I certificati TLS di Let's Encrypt vengono ora ottenuti utilizzando il tipo di challenge TLS-ALPN-01 tramite la porta TCP 443. La porta 80 non è più utilizzata dalle nuove installazioni del core di NethServer 8. I sistemi esistenti mantengono il precedente tipo di challenge HTTP-01 e richiedono ancora che la porta 80 sia aperta. È possibile aggiornare al nuovo predefinito con il seguente comando:

      api-cli run module/traefik1/set-acme-server --data '{"challenge":"TLS-ALPN-01","url":"https://acme-v02.api.letsencrypt.org/directory"}'

- **Miglioramenti al modulo core di Traefik** -- L'istanza core di Traefik, in esecuzione su ogni nodo del cluster, è stata aggiornata alla versione 3 di Traefik. La configurazione compatibile con la versione precedente (v2) è salvata per riferimento nella directory "state/" di Traefik in directory `*.v2`. Queste possono essere rimosse in sicurezza se desiderato.

  La procedura di ripristino di Traefik è stata corretta e non restituisce più un'istanza di Traefik in conflitto. Invece, i contenuti del backup vengono uniti con l'istanza attiva di Traefik sul nodo, consentendo il ripristino di rotte HTTP personalizzate e certificati TLS.

  Inoltre, questa release introduce due nuove funzionalità avanzate sperimentali, accessibili tramite chiamate API e configurazione manuale:

  1. Supporto per il deployment di NS8 dietro un proxy HTTP L7 di rete.
  2. Passaggio di parametri extra al container Traefik per configurare certificati CA personalizzati e challenge DNS-01.

  Consulta i canali di supporto disponibili per ulteriori informazioni.

- **Restrizioni di accesso per IP sulle rotte HTTP** -- La pagina `Rotte HTTP` consente ora di impostare restrizioni di accesso per rotte create automaticamente e manualmente basate su un elenco di indirizzi IP. Inoltre, è ora visibile una voce di rotta HTTP `cluster-admin` che può essere utilizzata per limitare l'accesso all'interfaccia Cluster Admin. Consulta [Rotte HTTP](../configuration/proxy.md) per informazioni dettagliate.

- **Nuovo stack di monitoraggio/allarmi** -- L'applicazione core Metrics, inclusa un'istanza di Prometheus in esecuzione, fa ora parte delle applicazioni core predefinite ed è installata automaticamente sul nodo leader dei cluster esistenti con un semplice aggiornamento del core. Metrics può essere facilmente integrato con altre soluzioni di monitoraggio e configurato per inviare notifiche di allarme e risoluzione. Leggi ulteriori dettagli in [Metriche e allarmi](../configuration/metrics.md).

- **Miglioramenti allo strumento di migrazione** -- Oltre alla "Gestione dei conflitti delle applicazioni" precedentemente rilasciata, lo strumento di migrazione NS7 ora considera i conflitti delle istanze delle applicazioni, fornendo indicazioni per evitare configurazioni errate durante la migrazione.

  Inoltre, per la migrazione di NethVoice, l'installazione di NethVoice Proxy è ora gestita automaticamente dallo strumento di migrazione.

- **Imapsync e filtri Sieve** -- L'applicazione Imapsync può ora essere configurata per eseguire il filtro Sieve dell'utente durante la sincronizzazione "solo INBOX". Inoltre, può essere impostata per rimuovere i messaggi dal server remoto dopo un numero specificato di giorni. Vedi [Imapsync](../applications/imapsync.md) per ulteriori dettagli. La sincronizzazione ricorsiva è stata ottimizzata per ridurre il carico di sistema durante la gestione di più attività Imapsync simultanee.

- **Opzione gateway DNSMasq** -- Il gateway client può ora essere impostato dalla [sezione DHCP](../applications/dnsmasq.md#dnsmasq-dhcp-section) di DNSMasq. Inoltre, le interfacce di rete selezionabili sono ora limitate a quelle con un indirizzo IP privato per prevenire errori di configurazione.

- **Aggiornamenti WebTop** -- WebTop è stato aggiornato alla release upstream 5.27.3 con la nuova versione del componente Pecbridge 5.4.5. Il limite di memoria è stato aumentato a 4GB per migliorare le prestazioni. Questa release introduce anche l'integrazione automatizzata del Plugin TinyMCE con un abbonamento attivo e una condivisione dei contatti migliorata con l'ultima release dell'applicazione NethVoice.

- **Miglioramenti NethVoice** -- La versione 1.2 introduce nuove funzionalità CTI, tra cui conferenze audio, videochiamate, condivisione dello schermo e gestione della segreteria telefonica. Una nuova autorizzazione consente di visualizzare tutti gli utenti nell'interfaccia CTI. Le impostazioni dei dispositivi ora includono opzioni video e il processo di provisioning è stato migliorato con il supporto in due fasi per tutti i metodi (HTTPS, DHCP). Ulteriori aggiornamenti:
- Supporto per il nuovo modello di telefono NP-X5.  
- Gestione migliorata dei certificati TLS e supporto per certificati wildcard.  
- Phone-island aggiornato alla versione 0.13.0.  
- Ridotta la verbosità dei log nel NethVoice Proxy.  
- Correzioni per SRTP sui telefoni Yealink (firmware \> 86), REINVITE con TLS sui telefoni SNOM, problemi di riconfigurazione dei telefoni, call-back su occupato e problemi dell'interfaccia CTI, inclusi la visualizzazione dei gruppi utente e l'eliminazione delle registrazioni delle chiamate.  
- Risolto un problema audio in CTI causato da una configurazione iniziale errata del NethVoice Proxy.  

- **Altri aggiornamenti delle applicazioni** -- Versioni delle applicazioni aggiornate:  

  - Nextcloud 29 e Nextcloud 30  
  - Collabora 24.04  
  - Mattermost 10 ESR  
  - Netdata 2  
  - CrowdSec 1.6.4  
  - Ejabberd 24.12
## Modifiche principali del 2024-12-20

**Milestone 8.3**

- **Ripristino selettivo dal backup** -- Nelle applicazioni Mail e Samba File Server, è possibile cercare e selezionare contenuti specifici (cartella IMAP, file o directory) dagli snapshot di backup e ripristinarli in una cartella accessibile all'utente. Vedi [Ripristino selettivo dei contenuti](../configuration/backup.md#selective-content-restore).

- **Gestione dei conflitti delle applicazioni** -- L'Admin del Cluster ora applica il limite di istanze per nodo durante le operazioni di clonazione, spostamento e ripristino. Questo si aggiunge all'applicazione esistente durante l'operazione di installazione e semplifica la gestione delle applicazioni che utilizzano porte TCP/UDP specifiche, come Mail, Ejabberd, NethVoice Proxy, Samba e DNSMasq. Inoltre, DNSMasq disabilita automaticamente il proprio servizio DNS se rileva un conflitto con un'istanza Samba sullo stesso nodo.

- **Filtraggio dell'inoltro dei log di sistema** -- Il forwarder Syslog può essere configurato per inviare l'intero flusso di log o solo i record di sicurezza. Per motivi di prestazioni, l'esportazione del flusso completo non è più disponibile nel forwarder del Cloud Log Manager, che ora supporta solo i log di sicurezza.

- **Avviso di backup** -- I sistemi con un [Abbonamento](subscription.md) attivo inviano un avviso al portale di monitoraggio se un backup fallisce. L'indicatore di stato dell'ultimo backup è stato corretto per riflettere correttamente le istanze di backup fallite nella pagina Backup.

- **Rinominare OpenLDAP "directory.nh" per la migrazione di NS7** -- Lo Strumento di Migrazione NS7 consente di selezionare il nome di dominio di destinazione (e il rispettivo suffisso del database LDAP), abilitando la migrazione e la consolidazione di più sistemi NS7 nello stesso cluster NS8. Il nome di dominio LDAP può essere impostato solo con un provider di account OpenLDAP locale, poiché Active Directory non supporta la rinomina dei domini. Vedi [Provider di account](../../tutorial/migration.md#migrate-account-provider).

- **Gli aggiornamenti sono sospesi durante la migrazione di NS7** -- Il Software Center inibisce sia gli aggiornamenti manuali che quelli automatici se un nodo NS7 viene aggiunto al cluster con lo Strumento di Migrazione. Se gli aggiornamenti sono sospesi, viene visualizzato un banner nel Software Center.

  Se il tuo cluster visualizza questo banner in modo errato (ad esempio, la migrazione è già terminata), esegui la seguente procedura manuale per ripulire il database Redis da eventuali dati obsoleti derivanti da tentativi di migrazione precedenti.

  Trova gli ID dei nodi NS7 obsoleti:

      redis-cli --raw keys 'node/*/flags' | xargs -t -r -l1 -- redis-cli smembers

  Esempio di output:

      redis-cli smembers node/77/flags
      nomodules

  Ad esempio, per rimuovere il nodo errato 77:

      api-cli run remove-node --data '{"node_id":77}'

- **Domini utente illimitati** -- A partire da Core 3.2.1 e Ldapproxy 1.1.0, il limite di otto domini utente simultanei è stato rimosso. È ora possibile installare più domini utente, a condizione che solo un Samba DC possa essere eseguito su un nodo.

- **Gestione migliorata degli eventi dei domini utente in alcune applicazioni** -- Le modifiche alle configurazioni dei domini utente sono ora applicate correttamente alle applicazioni Nextcloud, Ejabberd, Mail, SOGo e Roundcube. Le modifiche alla configurazione vengono propagate e i servizi vengono riavviati automaticamente.
## Modifiche principali del 2024-10-16

**Milestone 8.2**

- **Requisiti minimi del disco aumentati** -- I [requisiti minimi del disco](../installation/system_requirements.md) sono stati aumentati a un SSD da 40GB. Lo storage primario, che contiene le immagini dei container, deve essere veloce, specialmente durante l'accesso in lettura, per prevenire errori di avvio dei servizi.

- **Rimosso il limite di nodi del cluster** -- Il limite di quattro nodi per cluster è stato rimosso. Ora è possibile aggiungere più nodi, fino alla dimensione della rete VPN. Tuttavia, tenere presente il carico di sistema aumentato sul nodo leader. Vedi anche [Gestione del cluster](../configuration/cluster.md).

- **Aggiornamenti progressivi** -- A partire da Core 3.0.0, le immagini delle applicazioni possono essere etichettate con un nuovo attributo, [min-from](https://nethserver.github.io/ns8-core/modules/images/#image-labels). Questo garantisce che le applicazioni installate ignorino eventuali aggiornamenti con questa etichetta se la loro versione è inferiore al valore dell'etichetta.

  Allo stesso modo, un'etichetta [min-core](https://nethserver.github.io/ns8-core/modules/images/#image-labels) può essere applicata alle immagini delle applicazioni, richiedendo una versione minima del core per l'installazione o gli aggiornamenti. Se la versione del core è inferiore al valore dell'etichetta, l'immagine verrà ignorata.

  Queste etichette sono state sviluppate pensando a Nextcloud, poiché consente solo aggiornamenti alla versione principale successiva. Gli sviluppatori di applicazioni possono utilizzare queste etichette per implementare aggiornamenti progressivi per le loro applicazioni.

- **Inoltro dei log del cluster** -- La pagina Impostazioni Log consente ora di configurare un flusso in uscita di log verso un server Syslog esterno o il Nethesis Cloud Log Manager (disponibile solo con un piano di abbonamento Enterprise attivo).

  Questa funzionalità centralizza l'archiviazione esterna dei log per tutti i nodi del cluster. Poiché i flussi di log possono essere consistenti nei cluster di grandi dimensioni, le versioni future includeranno un filtro per i flussi, per personalizzare i log esportati in base agli eventi di sicurezza rilevanti. Vedi [Inoltro dei log](../configuration/log_server.md#logs-forwarding-section).

- **Livello di certificazione delle applicazioni** -- Il Software Center ora mostra un *badge di livello* per ogni applicazione, che indica il suo [livello di certificazione](../installation/software_center.md#certification-levels). La sezione dei dettagli dell'applicazione include anche informazioni sul repository di origine e link utili. Gli sviluppatori possono ora utilizzare un nuovo attributo di metadati [terms_url](https://nethserver.github.io/ns8-core/modules/metadata) per fornire un link ai "Termini e Condizioni", visibile anche dopo l'installazione.

- **Limite di istanze per nodo** -- Il Software Center impone limiti sul numero di istanze di applicazioni che possono essere installate per nodo del cluster. Gli sviluppatori possono definire questo limite utilizzando l'etichetta immagine [max-per-node](https://nethserver.github.io/ns8-core/modules/images/#image-labels). Vedi [Installare applicazioni](../installation/software_center.md#install-applications).

- **Visualizzazione dei moduli core** -- Il Software Center ora mostra dettagli aggiuntivi per i componenti core, inclusa la versione del core di ciascun nodo del cluster. Vedi [Aggiornamenti del core](../installation/software_center.md#core_updates-section).

- **Aggiornamento delle applicazioni alla versione di testing** -- Con Core 3.0.0, l'opzione `Testing` sotto Impostazioni \> Repositories Software è stata rimossa. Questo cambiamento riduce il rischio di utilizzo di versioni pre-release per nuove installazioni o aggiornamenti. Se l'opzione era precedentemente abilitata, le installazioni esistenti di NS8 non riceveranno più versioni pre-release come aggiornamenti.

  Tuttavia, è ancora possibile aggiornare un'istanza di applicazione a una versione di testing dal menu a tre punti, selezionando l'azione `Aggiorna alla versione di testing` sotto Software Center \> Installate \> Istanze. Questa nuova procedura consente un accesso anticipato a nuove funzionalità e correzioni di bug, ma deve essere utilizzata con cautela per evitare perdite di dati. Assicurarsi di leggere attentamente la documentazione della pre-release o contattare lo sviluppatore dell'app prima di utilizzarla. Vedi [Applicazioni installate](../installation/software_center.md#application-instances).

- **Più provider di backup "S3 generico"** -- La destinazione di backup S3 Generico ora supporta ulteriori provider cloud, inclusi OVH, Wasabi, DigitalOcean e Synology C2. Vedi [Destinazione di backup](../configuration/backup.md#backup-destination).

- **Selezione di backup e snapshot** -- Durante il processo di ripristino delle applicazioni, gli utenti possono ora selezionare tra i precedenti snapshot di backup generati secondo la politica di conservazione dei backup. Vedi [Ripristinare applicazioni](../configuration/backup.md#application_restore-section).

- **Riassegnazione delle porte TCP e UDP** -- A partire da Core 3.1.0, gli sviluppatori di applicazioni possono sfruttare nuove funzioni del core che estendono l'intervallo di porte TCP e UDP assegnate alle istanze delle applicazioni. Allo stesso modo, possono ottenere nuovi intervalli preservando le allocazioni esistenti, facilitando l'introduzione di nuovi componenti durante gli aggiornamenti delle applicazioni. Per maggiori informazioni, vedi [Allocazione delle porte](https://nethserver.github.io/ns8-core/modules/port_allocation/) nel manuale dello sviluppatore.

- **Applicazione NethVoice** -- [NethVoice](../applications/nethvoice.md) è una soluzione professionale di telefonia IP che offre una vasta gamma di funzionalità avanzate e un'interfaccia utente intuitiva.

- **Applicazione WebTop** -- [WebTop](../applications/webtop.md) presenta ora un nuovo tema UI predefinito, disponibile esclusivamente sulla piattaforma NS8. Gli amministratori possono scegliere di applicare il nuovo tema alle installazioni esistenti o consentire agli utenti finali di decidere. Inoltre, per coloro che dispongono di un piano di abbonamento Enterprise, è ora disponibile il [PEC bridge](../applications/webtop.md#pec-bridge).
- **Applicazione Nextcloud** -- La versione 27 di Nextcloud (NC 27), che era l'ultima versione disponibile su NethServer 7, ha raggiunto la fine del ciclo di vita (EOL). Sebbene le migrazioni installeranno ancora NC 27, un aggiornamento a NC 28 sarà immediatamente disponibile dopo la migrazione.

- **Applicazione Mattermost** -- Mattermost è stato aggiornato dalla versione EOL 8 all'ultima release principale, la versione 9.11 (ESR).
## Modifiche principali del 31-05-2024

**Milestone 8.1**

- **Miglioramenti Mail** -- Aggiunta la funzionalità [Relay rules](../applications/mail.md#relay-rules-section), che consente la configurazione e l'utilizzo di uno smarthost predefinito per i messaggi email in uscita, e altro ancora. Ora è possibile selezionare un'istanza di Mail direttamente dalla pagina [Email notifications](../configuration/email_notifications.md) per servire come gateway email predefinito del cluster per altre applicazioni. Dalla versione 1.4, Mail fornisce anche la corrispondenza Mittente/login, la configurazione della durata della coda e la policy di relay basata su IP, come descritto in [Mail settings](../applications/mail.md#mail_settings-section).

- **Applicazione Piler** -- La nuova applicazione Piler migliora le funzionalità di Mail con una soluzione di archiviazione delle email. Consulta [Piler](../applications/piler.md) per maggiori informazioni.

- **Applicazione Netdata** -- È disponibile un nuovo stack di monitoraggio accanto a Prometheus e Grafana. Un'istanza di Netdata può essere installata con un clic su un nodo del cluster e inizia immediatamente a raccogliere metriche. Consulta [Netdata](../applications/netdata.md) per i dettagli.

- **Applicazione Dnsmasq** -- Questa nuova applicazione fornisce un servizio DNS e DHCP semplice per la rete locale. Consulta [DNSMasq](../applications/dnsmasq.md) per i dettagli.

- **Visualizzazione delle porte aperte del firewall** -- La configurazione del firewall del nodo è accessibile da una nuova scheda nella pagina Impostazioni. Le stesse informazioni sono ancora disponibili nella pagina Nodes. Consulta [Firewall](../configuration/firewall.md) per maggiori informazioni.

- **Controller NethSecurity** -- Questa nuova applicazione consente il controllo remoto di più installazioni di NethSecurity, chiamate unità. Fornisce capacità avanzate di gestione e monitoraggio per le unità firewall. Consulta la sezione [NethSecurity Controller](../applications/nethsecurity_controller.md) per maggiori informazioni.

- **Log di sistema** -- I registri generati da qualsiasi nodo del cluster vengono raccolti e archiviati nel nodo leader per un numero configurabile di giorni. Dalla versione Core 2.7.0, il componente responsabile di questa funzione viene avviato e configurato automaticamente quando un nuovo nodo leader viene promosso. Consulta la sezione [System logs](../configuration/log_server.md) per maggiori informazioni.

- **Container CrowdSec bouncer** -- Dalla versione CrowdSec 1.0.7, il componente bouncer viene eseguito all'interno di un container e utilizza le tabelle Netfilter per bloccare gli IP. Esegui i seguenti comandi per pulire alcuni file e risorse lasciati dalle versioni precedenti.

  Esegui questo comando per rimuovere l'ipset di Firewalld:

      firewall-cmd --permanent --delete-ipset=crowdsec-blacklists
      firewall-cmd --permanent --delete-ipset=crowdsec6-blacklists

  È possibile rimuovere anche pacchetti aggiuntivi e il repository software installato nel sistema host.

  Per Rocky Linux, esegui:

      dnf remove -y crowdsec-firewall-bouncer-iptables
      rm -rvf /etc/yum.repos.d/crowdsec_crowdsec.repo /etc/crowdsec /usr/local/sbin/cscli

  Per Debian, esegui:

      apt-get -y remove crowdsec-firewall-bouncer-iptables
      rm -rvf /etc/apt/sources.list.d/crowdsec_crowdsec.list /etc/crowdsec /usr/local/sbin/cscli

- **Rocky Linux 9.4** -- Dalla versione Core 2.8.1, le immagini precompilate si basano sull'immagine cloud ufficiale di Rocky Linux 9.4.
## Modifiche principali del 2024-02-13

**Rilascio stabile 8.0**

Le nuove funzionalità introdotte in questa versione sono:

- **Subscription** -- I piani di abbonamento Nethesis Enterprise e Community sono ora disponibili per NS8. Vedi i dettagli nella pagina [Subscription](subscription.md).

- **Portale di gestione utenti** -- I membri del gruppo Domain Admins possono ora creare, modificare ed eliminare account utente dal [Portale di gestione utenti](../installation/user_domains.md#user-management-portal-section). La schermata di accesso ora mostra il nome del dominio utente per distinguere a quale dominio un utente sta accedendo.

- **Salta la validazione del certificato** nelle rotte HTTP -- Quando una rotta HTTP viene creata o modificata nella pagina [Rotte HTTP](../configuration/proxy.md), l'opzione `Skip certificate validation` può essere abilitata su una rete fidata se il server all'URL di destinazione non dispone di un certificato TLS valido.

- **Cockpit rimosso dall'immagine predefinita** -- Cockpit non è richiesto per eseguire NS8, pertanto non è più disponibile nell'immagine predefinita di NS8. Se desiderato, può essere installato e abilitato manualmente con i seguenti comandi:

      dnf install -y cockpit
      systemctl enable --now cockpit.socket

  La configurazione predefinita di Cockpit impedisce l'accesso come `root`: accedere come membro del gruppo `wheel`, quindi entrare in modalità "accesso amministrativo".

Problemi noti:

- **L'aggiornamento del core blocca la pagina del Software Center** -- Il [bug 6778](https://github.com/NethServer/dev/issues/6778) è stato risolto nella versione core 2.2.6. Se l'aggiornamento dalla RC1 parte dalla versione core 2.2.5 o inferiore, quando la barra di avanzamento del task si blocca, ricaricare la pagina web con `CTRL + SHIFT + R` o una procedura equivalente. Il ricaricamento della pagina non ha alcun impatto sull'aggiornamento in corso. Nota: il download dell'aggiornamento potrebbe essere lento; evitare di interrompere o riavviare fino al completamento.
## Modifiche principali del 2023-11-21

**Release Candidate 1**

Le nuove funzionalità introdotte con RC1 sono:

- **Politica delle password** -- Aggiunta una nuova opzione di configurazione alla pagina `Domini e utenti`. È possibile modificare la complessità e le politiche di scadenza delle password per i domini Samba e OpenLDAP. Le installazioni Beta 2 con domini OpenLDAP richiedono l'esecuzione di una procedura manuale per abilitare la politica delle password. La procedura di aggiornamento è descritta nelle note successive. Vedi anche [Politica delle password](../installation/user_domains.md#password-policy-section).
- **Portale di gestione utenti** -- Gli utenti di un dominio possono ora accedere a una pagina web per modificare la propria password. Il portale utenti è disponibile all'indirizzo `https://IP_OR_FQDN/users-admin/DOMAIN_NAME/`; un link completo è mostrato nella pagina `Domini e utenti`, sotto le impostazioni di configurazione del dominio. Le installazioni Beta 2 richiedono l'esecuzione di una procedura manuale per abilitare il portale utenti. Consulta la procedura di aggiornamento per Samba e OpenLDAP nelle note successive e la pagina [Portale di gestione utenti](../installation/user_domains.md#user-management-portal-section).
- **Repository di backup** -- Oltre ai protocolli cloud esistenti, ora è più facile inviare backup a un dispositivo locale. Un repository di backup può essere creato in una *condivisione file Windows* o in una *memoria locale*, come un disco collegato a un nodo cluster. Vedi [Backup e ripristino](../configuration/backup.md) per ulteriori informazioni.
- **Recupero email da altri server** -- [Imapsync](../applications/imapsync.md) è una nuova applicazione avanzata progettata per recuperare i messaggi email da server IMAP remoti a intervalli programmati e per sincronizzare interi account IMAP.
- **Lista mirror per i nodi Rocky Linux** -- Se Rocky Linux è la distribuzione del sistema operativo del nodo, la configurazione DNF predefinita viene sovrascritta e i mirror vengono restituiti da `mirrorlist.nethserver.org`. I pacchetti RPM di Rocky Linux saranno ospitati da mirror specifici di NethServer nelle versioni future.

L'aggiornamento delle installazioni Beta 2 esistenti può essere avviato dalla pagina del Centro Software come di consueto. Dopo che i componenti principali sono aggiornati, eseguire le seguenti procedure manuali per completare l'aggiornamento.

- **Procedura di aggiornamento del core** -- Per aggiornare le installazioni Beta 2, eseguire il seguente comando sul nodo leader. Questo definisce il nuovo ruolo di autorizzazione `tunadm`, disponibile nelle nuove installazioni dalla versione core 2.1.0:

      redis-cli --raw hvals cluster/module_node | sort -n | uniq | xargs -I NODE_ID -- redis-cli SADD node/NODE_ID/roles/tunadm add-tun remove-tun add-public-service remove-public-service add-custom-zone remove-custom-zone

  Per ciascun nodo del cluster, abilitare il servizio locale WebDAV per i backup:

      systemctl enable --now rclone-webdav.service

  Infine, solo per i nodi Rocky Linux, abilitare i repository predefiniti di NethServer:

      cp -v /etc/nethserver/nethserver.repo /etc/yum.repos.d/nethserver.repo
      dnf config-manager --save --set-disabled appstream baseos extras

- **Procedura di aggiornamento Samba** -- Per aggiornare le installazioni Beta 2, eseguire la seguente procedura per ciascuna istanza del provider di account Samba. L'elenco delle istanze può essere ottenuto dalla pagina `Domini e utenti`, sotto le impostazioni di configurazione del dominio; **annotare per ciascun provider**:

  - l'ID del modulo (stringa), ad esempio `samba1`

  - l'ID del nodo (numero), ad esempio `1`

  - un numero di porta TCP libero, generato eseguendo sul nodo leader un comando come il seguente:

        node_id=1
        echo $((`redis-cli --raw INCR node/${node_id}/tcp_ports_sequence` - 1))

    Nell'esempio sopra, impostare `node_id` con il corretto ID del nodo (numero). Supponiamo che il comando sopra riporti il numero di porta seguente:

        20013

  Con le annotazioni sopra, eseguire i seguenti passaggi per ciascun provider:

  1. Accedere al nodo cluster in cui è in esecuzione l'istanza del provider.

  2. Applicare la configurazione della porta TCP e avviare il servizio del portale utenti:

          runagent -m samba1 python3 - 20013 <<'EOF'
          import agent, os, sys
          user_portal_port = sys.argv[1]
          agent.assert_exp(int(user_portal_port) > 0, "ERROR: Bad TCP port argument")
          agent.assert_exp("IPADDRESS" in os.environ, "ERROR: Samba is not configured")
          agent.assert_exp(not "TCP_PORT" in os.environ, "ERROR: TCP_PORT is already set")
          os.environ["TCP_PORT"] = user_portal_port
          agent.set_env("TCP_PORT", user_portal_port)
          os.execl("../actions/configure-module/80start_amld", "80start_amld")
          EOF

- **Procedura di aggiornamento OpenLDAP** -- Per aggiornare le installazioni Beta 2, eseguire la seguente procedura per ciascuna istanza del provider di account OpenLDAP. L'elenco delle istanze può essere ottenuto dalla pagina `Domini e utenti`, sotto le impostazioni di configurazione del dominio; **annotare per ciascun provider**:

  - l'ID del modulo (stringa), ad esempio `openldap1`

  - l'ID del nodo (numero), ad esempio `1`

  - un numero di porta TCP libero, generato eseguendo sul nodo leader un comando come il seguente:

        node_id=1
        echo $((`redis-cli --raw INCR node/${node_id}/tcp_ports_sequence` - 1))

    Nell'esempio sopra, impostare `node_id` con il corretto ID del nodo (numero). Supponiamo che il comando sopra riporti il numero di porta seguente:

        20014

  Con le annotazioni sopra, eseguire i seguenti passaggi per ciascun provider:
1. Accedi al nodo del cluster in cui è in esecuzione l'istanza del provider.

  2. Applica la configurazione della porta TCP e avvia il servizio del portale utente:

          runagent -m openldap1 python3 - 20014 <<'EOF'
          import agent, os, sys
          user_portal_port = sys.argv[1]
          agent.assert_exp(int(user_portal_port) > 0, "ERROR: Bad TCP port argument")
          agent.assert_exp("LDAP_IPADDR" in os.environ, "ERROR: OpenLDAP is not configured")
          agent.assert_exp(not "," in os.environ["TCP_PORTS"], "ERROR: unexpected TCP_PORTS value")
          os.environ["TCP_PORTS"] = f'{os.environ["TCP_PORT"]},{user_portal_port}'
          agent.set_env("TCP_PORTS", os.environ["TCP_PORTS"])
          os.execl("../actions/configure-module/80start_amld", "80start_amld")
          EOF

  Dopo aver ripetuto i passaggi sopra descritti su ciascun nodo del cluster, eseguire i seguenti comandi in un'istanza a scelta (l'esempio è per `openldap1`):

      runagent -m openldap1 podman exec -i openldap ash -c 'envsubst | ldapmodify -c ' <<'EOF'
      dn: olcDatabase={2}mdb,cn=config
      changetype: modify
      delete: olcAccess
      -
      add: olcAccess
      olcAccess: to attrs=userPassword by dn.base="
       gidNumber=101+uidNumber=100,cn=peercred,cn=external,cn=aut
       h" write by set="[cn=domain admins,ou=Groups,${LDAP_SUFFIX}
       ]/memberUid & user/uid" write by self write by * auth
      olcAccess: to * by dn.base="gidNumber=101+uidNumber=100,
       cn=peercred,cn=external,cn=auth" manage by set="[cn=do
       main admins,ou=Groups,${LDAP_SUFFIX}
       ]/memberUid & user/uid" write by * read

      dn: olcOverlay={1}ppolicy,olcDatabase={2}mdb,cn=config
      changetype: modify
      replace: olcPPolicyCheckModule
      olcPPolicyCheckModule: ppcheck.so

      dn: cn=default,ou=PPolicy,${LDAP_SUFFIX}
      changetype: modify
      add: objectClass
      objectClass: pwdPolicyChecker

      dn: cn=default,ou=PPolicy,${LDAP_SUFFIX}
      changetype: modify
      replace: pwdCheckQuality
      pwdCheckQuality: 2
      -
      replace: pwdMinAge
      pwdMinAge: 0
      -
      replace: pwdMaxAge
      pwdMaxAge: 15552000
      -
      replace: pwdMinLength
      pwdMinLength: 8
      -
      replace: pwdInHistory
      pwdInHistory: 12
      -
      replace: pwdLockout
      pwdLockout: FALSE
      -
      replace: pwdUseCheckModule
      pwdUseCheckModule: TRUE
      -
      replace: pwdCheckModuleArg
      pwdCheckModuleArg: default
      -
      replace: pwdExpireWarning
      pwdExpireWarning: 0
      EOF

      runagent -m openldap1 systemctl --user restart openldap

- **Procedura di aggiornamento di Mattermost** -- L'aggiornamento di Mattermost deve essere completato manualmente per allocare e aprire le porte UDP richieste dal plugin Calls. Dalla pagina del `Software center`, assicurarsi che Mattermost sia alla versione `2.0.0`. Quindi clonare l'istanza in esecuzione e, una volta completata la clonazione, rimuovere l'istanza precedente.
## Modifiche principali del 2023-09-13

**Beta 2**

- **Immagine preconfigurata** -- Le immagini sono basate su Rocky Linux. I formati disponibili sono `.qcow2` per QEMU/Proxmox e `.vmdk` per VMware. Consulta [Immagine preconfigurata](../installation/install.md#install_image-section) per i link di download delle immagini.

- **Requisito FQDN** -- La procedura di creazione del cluster ora richiede di verificare e impostare il nome host attuale del sistema. Il nome host deve essere in forma breve (una sola parola, senza suffisso di dominio). La procedura richiede anche il suffisso di dominio e aggiorna il file `/etc/hosts` aggiungendo un record per risolvere correttamente il nome di dominio completo del sistema (FQDN). Ad esempio:

      127.0.1.1 node1.example.org node1

  Consulta anche [Configurazione DNS](../installation/system_requirements.md#dns-reqs).

- **Porta WireGuard 55820** -- La porta UDP utilizzata da WireGuard per la creazione della VPN del cluster è ora fissata a `55820`. I cluster già creati con un numero di porta personalizzato devono essere corretti manualmente prima di aggiornare il core alla Beta 2. Ad esempio, se la porta personalizzata è `55821`, eseguire i seguenti passaggi sul nodo leader per correggerla.

  1. Correggere l'indirizzo endpoint pubblico della VPN in Redis. Ad esempio, se il nodo leader è `1` e il suo FQDN è `node1.example.org`:

          redis-cli hset node/1/vpn endpoint node1.example.org:55820

  2. Correggere la configurazione del firewall:

          firewall-cmd --permanent --service=ns-wireguard --remove-port=55821/udp
          firewall-cmd --permanent --service=ns-wireguard --add-port=55820/udp
          firewall-cmd --reload

  3. Modificare la porta di ascolto di WireGuard in esecuzione:

          wg set wg0 listen-port 55820

  4. Rendere permanente la modifica impostando `ListenPort = 55820` in `/etc/wireguard/wg0.conf`:

          sed -ir 's/ListenPort.*/ListenPort = 55820/' /etc/wireguard/wg0.conf

  Ripetere i passaggi 2-4 anche su ciascun nodo worker.

- **Aggiornamento Debian** -- Dopo aver eseguito l'aggiornamento del core, le installazioni basate su Debian 11 (Bullseye) devono essere aggiornate manualmente alla versione 12 della distribuzione (Bookworm):

      rm -f '/etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list'
      sed -i 's/bullseye/bookworm/' /etc/apt/sources.list
      apt update && apt full-upgrade -y

  Seguire anche le istruzioni per l'aggiornamento a Python 3.11, quindi **riavviare il sistema**. Applicare la stessa procedura per ciascun nodo del cluster.

- **Python 3.11** -- Dopo aver eseguito l'aggiornamento del core, le installazioni basate su Rocky Linux (e altre distribuzioni simili a EL) devono installare manualmente Python 3.11:

      dnf install python3.11

  Anche Debian richiede il seguente script Bash. Non dimenticare le parentesi tonde!:

      (
          set -e -x
          core_dir=/usr/local/agent/pyenv
          mv -v ${core_dir} ${core_dir}.bak
          python3.11 -mvenv ${core_dir} --upgrade-deps --system-site-packages
          ${core_dir}/bin/pip3 install -r /etc/nethserver/pyreq3_11.txt
          echo "/usr/local/agent/pypkg" >$(${core_dir}/bin/python3 -c "import sys; print(sys.path[-1] + '/pypkg.pth')")
          rm -rf ${core_dir}.bak
      )

  Verificare se l'aggiornamento di Python è stato completato con successo:

      runagent python3 --version # l'output dovrebbe essere 3.11

  Applicare la stessa procedura per ciascun nodo del cluster.

- **Miglioramenti alla sicurezza dell'interfaccia utente** -- Dalla versione Beta 1 è stato rilasciato un importante aggiornamento di sicurezza e sono ora disponibili altri miglioramenti di sicurezza. Dopo aver eseguito l'aggiornamento del core, effettuare un aggiornamento forzato della pagina del browser con `CTRL + Shift + R` o un altro metodo equivalente.

- **Miglioramento del backend dei log** -- Il backend della pagina Log è stato migliorato per essere più veloce e accurato nel catturare i log di ogni componente del cluster. Il modulo core ora esegue Promtail come servizio di sistema. Dopo aver eseguito l'aggiornamento del core, è possibile disinstallare in sicurezza i moduli core di Promtail eseguendo questo comando sul nodo leader:

      api-cli run list-installed-modules | jq -r '.["ghcr.io/nethserver/promtail"] | .[].id' | xargs -l remove-module --no-preserve

  Si noti che la nuova pagina Log non può accedere alle voci di log precedenti all'aggiornamento a Beta 2. Per visualizzare le voci di log precedenti all'aggiornamento a Beta 2, utilizzare il comando `logcli`.

- **Caricamento del certificato TLS** -- La scheda `Certificati TLS` nella pagina `Impostazioni` è stata estesa per consentire il caricamento di un certificato e della chiave privata associata. Consulta la sezione [Certificati TLS](../configuration/certificates.md).

- **Provider di backup aggiuntivi** -- I repository di backup possono essere creati anche su Microsoft Azure e provider di storage cloud compatibili con S3.

- **Nuovo backend di configurazione Traefik** -- Il database Redis del cluster non è più utilizzato dalle istanze del modulo Traefik come backend di configurazione dinamica. La configurazione di Traefik è ora interamente memorizzata nella directory home del modulo. Per migliorare le prestazioni di Redis è possibile disabilitare una funzionalità specifica per Traefik con i seguenti comandi:

      podman exec redis sed -i.beta1 '/^notify-keyspace-events / d' /data/etc/redis.conf
      systemctl restart redis

  Applicare la stessa procedura per ciascun nodo del cluster.

- **Miglioramenti al modulo Mail**

  1. Le nuove installazioni del modulo Mail hanno l'opzione `Shared seen` abilitata per impostazione predefinita. Le installazioni esistenti troveranno l'opzione disabilitata. Consulta anche la sezione relativa alle [impostazioni delle caselle di posta](../applications/mail.md#mail-mailboxes-settings).
2.  Aggiunto il plugin open source Dovecot *Flatcurve* per abilitare la ricerca full-text (FTS) nei messaggi email. Per ricostruire massivamente gli indici di ricerca, eseguire il seguente comando durante i periodi di inattività del sistema:

          podman exec dovecot sh -c "doveadm index -A -q '*' ; pgrep indexer-worker | xargs -- renice"

      Solo gli allegati PDF e l'email stessa vengono aggiunti all'indice. In future versioni saranno supportati più formati di allegati.
## Modifiche principali del 2023-05-10

**Beta 1**

Le principali funzionalità del core includono:

- Gestione dei nodi: aggiungere e rimuovere nodi dal sistema
- Registrazione centralizzata: raccogliere tutti i log in un unico luogo per un monitoraggio semplificato
- Backup di configurazioni e dati: salvare regolarmente le impostazioni del cluster e i dati delle applicazioni su provider remoti come Amazon S3 e Backblaze B2
- Autenticazione: supporto per directory utenti Active Directory e LDAP (RFC2307)
- File server: implementazione di un file server SMB (Server Message Block) che consente un'integrazione senza soluzione di continuità con reti basate su Windows
- Audit: tracciare le modifiche apportate all'interno del sistema per garantire sicurezza e responsabilità
- Relay email: utilizzare uno smart host per instradare le email in uscita attraverso un server fidato
- Routing web personalizzato: definire URL personalizzati per gestire richieste specifiche
- Autenticazione multi-fattore: abilitare la verifica in due passaggi per gli account amministrativi
- Firewall integrato: proteggere contro accessi non autorizzati a livello di rete implementando un firewall locale
- Migrazione: [modulo Cockpit](../../tutorial/migration.md) per importare applicazioni di NethServer 7

Moduli aggiuntivi:

- Strumenti collaborativi: include server di posta Dovecot/Postfix/Rspamd, WebTop, Roundcubemail, Nextcloud, Collabora Online, Dokuwiki, ejabberd, Mattermost
- Utility di sviluppo: include MariaDB e server web NGINX per creare applicazioni e servizi dinamici
- Monitoraggio e analisi: offre Grafana, Prometheus e node_exporter per monitorare metriche di performance e identificare potenziali problemi
- Archiviazione dati: offre MinIO per gestire grandi quantità di dati strutturati e non strutturati
- Difesa della rete: implementa CrowdSec per proteggere le applicazioni locali da attacchi remoti

Le seguenti limitazioni note saranno risolte in futuri aggiornamenti:

- attualmente, il sistema utilizza solo certificati TLS emessi da Let's Encrypt o certificati autofirmati generati localmente
- il login utente non è supportato sui nodi worker
- il modulo di posta non offre opzioni di relay dei messaggi basate sul mittente o sulla destinazione
- è disponibile solo un numero limitato di provider di archiviazione cloud per il backup dei dati
## Glossario delle release {#releases-glossary}

Il ciclo di rilascio del software include quattro fasi: Alpha, Beta, Release Candidate (RC) e Stable.

Durante la fase **Alpha**, il software non è stato testato a fondo e potrebbe non includere tutte le funzionalità pianificate. Questa release non è adatta per ambienti di produzione. Tuttavia, può essere utilizzata per avere un'anteprima delle novità della versione futura. Si noti che gli aggiornamenti da una release Alpha ad altre release non sono supportati.

La fase **Beta** indica che il software è per lo più completo in termini di funzionalità, ma potrebbe ancora contenere numerosi bug noti e sconosciuti. Questa release non dovrebbe essere utilizzata in ambienti di produzione. Tuttavia, può essere utilizzata per testare il software prima di implementarlo in produzione. Gli aggiornamenti da una release Beta a una release RC o Stable sono supportati, ma potrebbero richiedere una procedura manuale.

Durante la fase **Release Candidate (RC)**, il software è completo in termini di funzionalità e non contiene bug noti. Se non emergono problemi significativi, può essere promosso a Stable. Gli aggiornamenti da una release RC a una release Stable sono supportati e dovrebbero essere quasi automatici. Tuttavia, se sei nuovo al software, è consigliabile utilizzarlo in produzione solo se hai già una certa esperienza con esso.

La release **Stable** è la più affidabile e sicura da utilizzare in ambienti di produzione. È stata testata a fondo ed è considerata priva di bug significativi.
