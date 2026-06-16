---
title: Certificati TLS
sidebar_position: 4
---
# Certificati TLS

Un certificato TLS (o SSL) è emesso da un'Autorità di Certificazione (CA) ed è utilizzato dai client per stabilire un canale criptato e verificare l'identità del server.

In NethServer 8, le applicazioni non gestiscono direttamente TLS. Ogni nodo del cluster esegue un proxy HTTP Traefik davanti alle applicazioni locali, ricevendo connessioni TLS. Traefik presenta il certificato corretto in base al nome del sito richiesto (l'intestazione "Host" in HTTP). Vedi [Rotte HTTP](proxy.md) per ulteriori dettagli. Anche i servizi non HTTP, come IMAP, si affidano a Traefik per archiviare e distribuire i certificati.

Durante l'installazione, Traefik genera un certificato autofirmato e lo utilizza come predefinito per le applicazioni locali, inclusa l'interfaccia web del cluster.

La pagina `Certificati TLS` elenca i certificati disponibili su ogni nodo e utilizzati dalle sue applicazioni. La tabella può essere filtrata per `Nodo`, `Stato`, `Tipo` o digitando una parola chiave che corrisponde a un attributo del certificato.

I certificati non sono condivisi tra i nodi del cluster. Sono validi solo sul nodo in cui sono stati richiesti o caricati.

I principali **tipi** di certificati sono:

- `Caricati`: certificati personalizzati aggiunti tramite [Carica certificato](#custom-certificates-section). Non vengono rinnovati automaticamente.
- `Richiesti`: ogni nodo del cluster può richiedere un [certificato Let's Encrypt](#lets-encrypt-requirements) contenente fino a 100 nomi. Utilizza l'azione `Gestisci nomi` per aggiornare l'elenco dei nomi; ciò genera una nuova richiesta e contrassegna il vecchio certificato come `Obsoleto`. I certificati Let's Encrypt vengono rinnovati automaticamente.

Altri tipi di certificati:

- `Automatico`: un certificato Let's Encrypt richiesto e attualmente utilizzato dalle applicazioni o dalle [rotte HTTP personalizzate](proxy.md#custom-http-route-section) per il loro nome host.
- `Obsoleto`: un certificato Let's Encrypt ottenuto da un'applicazione, una rotta HTTP o una richiesta utente, che non è più in uso. Vedi anche [Elimina un certificato TLS](#delete-certificates-section).

Sia i certificati Automatici che quelli Obsoleti vengono rinnovati automaticamente.
## Requisiti per i certificati Let's Encrypt {#lets-encrypt-requirements}

[Let's Encrypt](https://letsencrypt.org) è un'autorità di certificazione senza scopo di lucro che emette certificati TLS gratuitamente. NethServer 8 utilizza le sfide ACME basate su HTTP per ottenerli, che richiedono:

1.  **Il nodo del cluster deve essere raggiungibile pubblicamente sulla porta 443**.

    - Assicurarsi che la porta 443 sia aperta verso Internet pubblico. È possibile testarla con siti come [CSM](http://www.canyouseeme.org/).
    - Verificare che non ci siano regole firewall basate su IP nella rete del nodo. Let's Encrypt utilizza IP imprevedibili per la sfida TLS-ALPN-01, che potrebbero essere bloccati da filtri geografici o personalizzati.

    I nodi installati prima di Traefik 3.0.0 utilizzavano le sfide HTTP-01. In tal caso, anche la porta 80 deve essere aperta. Consultare le [note di rilascio](../about/release_notes.md) per il traguardo 8.4.

2.  I nomi dei certificati devono essere domini pubblici che puntano all'IP pubblico del server. Assicurarsi di avere **record DNS per indirizzi IPv4 e IPv6**. Siti come [VDNS](http://viewdns.info/) possono aiutare a verificare i DNS.

:::note

I certificati wildcard (ad esempio `*.nethserver.org`) **non sono supportati** con le sfide ACME basate su HTTP.

:::

I certificati ottenuti da Let's Encrypt vengono rinnovati automaticamente prima della scadenza. I tentativi di rinnovo vengono eseguiti quotidianamente, a partire da 30 giorni prima della scadenza del certificato.

Se un certificato è contrassegnato come `Expiring` o `Expired`, verificare che i requisiti sopra indicati siano ancora soddisfatti e attendere il prossimo tentativo di rinnovo. In alternativa, rimuovere il certificato come spiegato in [Eliminare un certificato TLS](#delete-certificates-section).
## Richiedere un certificato Let's Encrypt {#lets-encrypt-request-section}

Se i requisiti sono soddisfatti, richiedere un certificato come segue:

1.  Accedere a `Impostazioni` → `Certificati TLS`.
2.  Fare clic su **Richiedi certificato**.
3.  Selezionare il nodo del cluster che emetterà la richiesta. Solo questo nodo può utilizzare il certificato.
4.  Inserire l'elenco dei nomi da includere. Ognuno deve soddisfare i requisiti.
5.  Fare clic su **Richiedi certificato** per confermare.

La validazione può richiedere fino a 60 secondi prima di un timeout.

I certificati vengono rinnovati automaticamente da un processo giornaliero che inizia 30 giorni prima della scadenza. Se il rinnovo fallisce, viene generato un avviso di scadenza (vedere [Ricevere avvisi di scadenza dei certificati](#certificate-alerts-section)). Consultare i [requisiti di Let's Encrypt](#lets-encrypt-requirements) per identificare la causa.
## Caricare certificati TLS personalizzati {#custom-certificates-section}

Se si dispone già di un certificato e di una chiave privata, è possibile caricarli su un nodo:

1.  Accedere a `Impostazioni` → `Certificati TLS`.
2.  Fare clic su **Carica certificato**.
3.  Selezionare il nodo del cluster. Solo questo nodo e le sue applicazioni potranno utilizzare il certificato.
4.  Selezionare i file `Certificate` e `Private key`. Se fornito dall'autorità di certificazione (CA), selezionare anche il file `Chain file`. Utilizzare il trascinamento o il selettore di file. Tutti i file devono essere **codificati in PEM**.
5.  Fare clic su **Carica**.

Se il caricamento non riesce, viene mostrato un errore. In caso contrario, la finestra modale si chiude e l'elenco si aggiorna.

Gli errori comuni includono l'ordine errato dei file o una mancata corrispondenza tra certificato, chiave privata e chain. La chiave non deve essere crittografata con una passphrase.

Un'applicazione utilizza il certificato caricato se corrisponde al nome host configurato. Sono supportati i nomi wildcard.

I certificati caricati vengono aggiunti al backup di Traefik e possono essere ripristinati da esso.

Se il certificato è firmato da un'autorità di certificazione (CA) privata/personalizzata, deve essere aggiunto all'archivio certificati del sistema operativo per essere considerato attendibile e consentire il caricamento:

- [Distribuzioni RHEL (Rocky)](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/securing_networks/using-shared-system-certificates_securing-networks)
- [Debian](https://manpages.debian.org/stable/ca-certificates/update-ca-certificates.8.en.html)
## Ricevere avvisi di scadenza dei certificati {#certificate-alerts-section}

Se le notifiche di avviso sono configurate (vedere [Notifiche di avviso](metrics.md#alerts_notifications-section)), il cluster invia un avviso quando un certificato sta per scadere o è già scaduto. Gli avvisi iniziano 28 giorni prima della data di scadenza.

- Per un certificato `Uploaded`, risolvi l'avviso caricando un nuovo certificato. Quello vecchio può quindi essere eliminato.

- Per i certificati Let's Encrypt (`Requested`, `Automatic`, `Obsolete`), un avviso di scadenza indica che il rinnovo è fallito. Verifica che i [requisiti](#lets-encrypt-requirements) siano ancora soddisfatti.

  Cause comuni di **fallimento del rinnovo** includono:

  - I record DNS per un nome di certificato sono stati modificati o rimossi.
  - Un firewall blocca le sfide HTTP, sia per indirizzo di rete che per regole IP geografiche.
## Eliminare un certificato TLS {#delete-certificates-section}

È possibile eliminare un certificato se non è più necessario. Eseguire questa operazione con cautela, poiché la rimozione di un certificato può compromettere il funzionamento delle applicazioni. Quando si elimina un certificato:

- Traefik viene riavviato e le connessioni HTTP vengono chiuse. Per alcune applicazioni, ciò potrebbe comportare la perdita di dati dei client.
- Se non esiste una corrispondenza alternativa per il nome host, i client non riusciranno a riconnettersi.
- Il rinnovo automatico (per Let's Encrypt) si interrompe.

Se si elimina un certificato `Automatic`, il percorso HTTP correlato viene modificato e l'opzione di Let's Encrypt viene disattivata.

Utilizzare **Elimina certificati obsoleti** per rimuovere tutti i certificati obsoleti di un nodo in un'unica operazione. Questo limita i riavvii di Traefik.

In alternativa, per eliminare un singolo certificato:

1.  Accedere a `Impostazioni` → `Certificati TLS`.
2.  Individuare il certificato da rimuovere.
3.  Fare clic su **Elimina** e confermare.

:::note

L'eliminazione è irreversibile. Assicurarsi che nessuna applicazione dipenda dal certificato o installare prima un certificato sostitutivo per evitare interruzioni del servizio.

:::
