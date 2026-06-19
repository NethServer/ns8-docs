---
title: Ejabberd
---
# Ejabberd

Il modulo Ejabberd installa l'immagine Docker di ejabberd Community Server (protocollo standard Jabber/XMPP) e supporta TLS sulle porte standard (5222 o 5223).

Solo un'istanza di Ejabberd può essere eseguita su un nodo, per evitare conflitti sulle porte TCP.

:::note

Ejabberd non espone più il protocollo BOSH (NethCTI e altre applicazioni basate su browser potrebbero non funzionare).

:::

Il modulo Ejabberd installa l'immagine Docker di [ejabberd Community Server](https://hub.docker.com/r/ejabberd/ecs).

Ejabberd è un server di chat Open Source integrato direttamente con Webtop e con i client di rete. Consulta la [documentazione ufficiale](https://docs.ejabberd.im/) per ulteriori dettagli.

## Configurazione

Ejabberd richiede un nome host virtuale dedicato, un FQDN come `nethserver.org`. Questo dominio verrà usato per l'autenticazione degli utenti (`foo@nethserver.org`). Puoi usare un certificato TLS autofirmato, ma è consigliato un certificato Let's Encrypt attendibile.

Prima di procedere con la configurazione, assicurati di creare il corrispondente record di nome nel tuo server DNS.

Se vuoi usare l'istanza Ejabberd come [motore chat di Webtop](../../user-manual/webtop/index.md#webtop-chat), assicurati di inserire lo stesso nome di dominio usato da Webtop nel campo `Mail domain` della sua pagina `Settings`.

:::note

Un certificato Let's Encrypt è obbligatorio per i client di condivisione file. Questi client rifiutano la connessione al server se il certificato è autofirmato.

:::

Come configurare:

1.  Accedi alla pagina di configurazione dell'applicazione e inserisci un FQDN valido nel campo `Ejabberd FQDN`.
2.  Abilita l'opzione `Let's Encrypt` in base alle tue esigenze.
3.  Seleziona il dominio utenti LDAP per identificare gli utenti.
4.  Fai clic sul pulsante **Save**.
5.  Collega un client XMPP con un utente valido del dominio al nome host inserito, ad esempio: `https://ejabberd.nethserver.org`.

:::note

L'autenticazione di Ejabberd è integrata con il dominio utenti LDAP che puoi configurare in [Domini utente](../installation/user_domains.md).

:::

Gli amministratori di Ejabberd possono usare la pagina di amministrazione web sulla porta 5280. ejabberd Web Admin consente di amministrare alcune parti di ejabberd tramite browser web: account, Shared Roster Groups, gestione del database Mnesia, creazione e ripristino di backup, visualizzazione delle statistiche del server, …

La pagina di amministrazione è disponibile all'indirizzo `https://IP_OR_FQDN:5280/admin`.

Nella sezione delle opzioni avanzate, l'amministratore può inoltre configurare:

- abilitazione dell'interfaccia di amministrazione web integrata
- federazione S2S
- gestione dell'archivio dei messaggi
- caricamento di file per scambiare dati tra i client tramite URL
- velocità di trasferimento dei file

### Da server a server (S2S)

Il sistema XMPP è federato per natura. Se S2S è abilitato, gli utenti con account su un server possono comunicare con utenti su server remoti. S2S consente ai server di comunicare senza interruzioni tra loro, formando una rete IM globale "federata".

A questo scopo, il record DNS SRV deve essere configurato per il tuo dominio (<https://wiki.xmpp.org/web/SRV_Records#XMPP_SRV_records>) e il server deve avere un certificato SSL/TLS valido.

### Gestione archivio messaggi

Message Archive Management (`mod_mam`) implementa la gestione dell'archivio dei messaggi come descritto in [XEP-0313](http://xmpp.org/extensions/xep-0313.html). Quando è abilitato, tutti i messaggi vengono memorizzati nel server e i client XMPP compatibili possono usarlo per conservare sul server la cronologia delle chat.

Il database può memorizzare un massimo di 2 GB di messaggi; i messaggi archiviati possono essere eliminati automaticamente. Per configurare la policy di conservazione dei messaggi, imposta l'opzione **Clean messages older than X days**.

:::note

Se abilitato, questo modulo memorizzerà ogni messaggio inviato tra gli utenti. Questo comportamento inciderà sulla privacy dei tuoi utenti.

:::

### Amministratori

Tutti gli utenti elencati nell'area di testo sono considerati amministratori del server di chat.

Gli amministratori possono:

- inviare messaggi broadcast
- controllare lo stato degli utenti connessi

## Client

I client Jabber sono disponibili per tutte le piattaforme desktop e mobili.

Alcuni client diffusi:

- Pidgin è disponibile per Windows e Linux
- Adium per Mac OS X
- BeejibelIM per Android e iOS, Xabber solo per Android

Quando configuri il client, assicurati che TLS (o SSL) sia abilitato. Inserisci il nome utente e il dominio della macchina.

:::note

Con le funzionalità TLS, server o client configurati in modo restrittivo (ad esempio Gajim) potrebbero rifiutare le connessioni al tuo server Ejabberd se il certificato SSL/TLS non corrisponde al nome di dominio.

:::

Questo è un problema comune con i certificati autofirmati. Il client rifiuterà la connessione al server perché il certificato non corrisponde al Common Name.

Possibili soluzioni:

- disabilitare il controllo del certificato lato client
- caricare un certificato valido sul server (vedi [Caricare certificati TLS personalizzati](../configuration/certificates.md#custom-certificates-section))
- richiedere un certificato valido da un'autorità attendibile (ad esempio Let's Encrypt). Questo certificato può essere ottenuto gratuitamente con Let's Encrypt

Inoltre, il certificato dovrebbe contenere due sottodomini: `pubsub.*` e `conference.*`.
