---
title: CrowdSec
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) è uno strumento di rilevamento di attività dannose. Cerca pattern conosciuti, come tentativi di accesso malevoli, nei log delle applicazioni e blocca l'indirizzo IP dell'attaccante.

Puoi installare una sola istanza di CrowdSec per ogni nodo.

## Protezioni predefinite {#default-protections}

Una volta installato, CrowdSec è già completamente funzionante e inizia a proteggere automaticamente le applicazioni NS8, prima di qualsiasi configurazione manuale:

- **Applicazioni web (sempre attive)**: ogni applicazione servita tramite il reverse proxy della piattaforma riceve una protezione HTTP generica indipendentemente dall'applicazione — rilevamento di tentativi di accesso forzato (ad esempio, 5 risposte `401`/`403` a richieste `POST` in 10 secondi bloccano l'IP), rilevamento di scansioni/probing, user-agent malevoli, probing di file sensibili (`.env`, `.git`, ...), traversal di percorsi, SQL injection, probing XSS, abuso di proxy aperti, probing di interfacce amministrative e probing di exploit di CVE noti (decine di CVE di prodotti, ad esempio Log4j2, Spring4Shell, VMware vCenter, Fortinet, Pulse Secure).
- **Applicazioni specifiche**: Nextcloud e WordPress ricevono scenari aggiuntivi consapevoli dell'applicazione (tentativi di accesso forzato, enumerazione utenti, scansione di `wp-config`) oltre a quelli generici sopra indicati.
- **SSH**: tentativi di accesso forzato (inclusi varianti lente/basate sul tempo) e controllo della CVE-2024-6387 (regreSSHion).
- **Mail**: rilevamento di abuso/tentativi di accesso forzato per Postfix (abuso di relay, spam, HELO/comandi non validi) e Dovecot (spam).
- **Database**: rilevamento di tentativi di accesso forzato per MariaDB e PostgreSQL.
- **FTP**: rilevamento di tentativi di accesso forzato e enumerazione utenti per ProFTPD e vsftpd.
- **Whitelist di attori legittimi**: crawler/bot legittimi noti sono automaticamente esclusi dai blocchi.

## Configurazione {#configuration}

Dall'interfaccia web puoi configurare:

- le notifiche email aggiungendo un indirizzo per riga nel campo `Email notifications`: le notifiche funzionano solo se [Email notifications](../configuration/email_notifications.md) è stato configurato
- gli IP e le reti che non verranno mai bloccati
- la durata dei ban dinamici e statici

Per impostazione predefinita, CrowdSec invia alcuni dati di telemetria a server remoti gestiti da CrowdSec. I server usano questi dati per comporre una community blocklist che viene poi inviata alla tua installazione. Se non vuoi condividere questi dati e vuoi disabilitare la community blocklist, puoi farlo disabilitando l'opzione `Enable central API` nella sezione `Advanced`.

Puoi anche collegare la tua istanza alla [CrowdSec console](https://app.crowdsec.net) compilando il campo facoltativo `Enroll key`.

CrowdSec invia ai destinatari configurati un'email di notifica giornaliera con l'elenco dei nuovi IP bloccati. Se la soglia predefinita di 100 nuovi IP bloccati viene raggiunta prima del report giornaliero, la notifica viene inviata immediatamente. Il campo `Notification threshold`, nella sezione `Advanced`, controlla questo valore e può essere impostato tra 1 e 10000.

I dati di CrowdSec sono accessibili dalle dashboard Grafana `CrowdSec Overview` e `CrowdSec Metrics`, come spiegato in [accesso a Grafana](../configuration/metrics.md#grafana_access-section).

### Community blocklist vs Community blocklist (Lite)

CrowdSec fornisce una [community blocklist](https://docs.crowdsec.net/docs/next/central_api/community_blocklist) condivisa tra tutti gli utenti. Per attivare questa funzionalità, devi:

- abilitare l'opzione Central API
- registrare la tua istanza CrowdSec nella console

Per accedere alla community blocklist completa, oltre alla versione Lite, devi condividere almeno alcune decisioni di ban con la Central API ogni 24 ore. Se il tuo server ha pochi o nessun ban, verrà considerato in stato di blocco, impedendo l'accesso alla blocklist completa.

## Interfaccia a riga di comando

Il comando `cscli` è una potente interfaccia a riga di comando per accedere alle funzioni avanzate di CrowdSec. Per eseguire `cscli`, devi prima entrare nell'ambiente dell'applicazione. Digita il seguente comando in una shell di root

    runagent -m crowdsec1 bash

A questo punto il comando `cscli` diventa disponibile. Per esempio, puoi stampare il messaggio di aiuto con

    cscli --help

Puoi anche eseguire un singolo comando direttamente, senza aprire una shell, prefissandolo con `runagent -m crowdsec1`:

    runagent -m crowdsec1 cscli decisions list

Alcuni comandi utili:

- `cscli decisions list` — elenca i divieti attuali (IP, motivo, durata, ID decisione)
- `cscli decisions delete --id <id>` — rimuove un divieto tramite il suo ID decisione, ad esempio `cscli decisions delete --id 630190`
- `cscli decisions delete --ip <ip>` — rimuove un divieto tramite indirizzo IP
- `cscli decisions add --ip <ip> --duration 4h --reason "manual ban"` — vieta manualmente un indirizzo IP
- `cscli alerts list` — elenca gli avvisi attivati (attacchi rilevati), inclusi quelli che non hanno portato a un divieto
- `cscli bouncers list` — elenca i bouncer registrati (ad esempio il bouncer del firewall) e il loro stato
- `cscli collections list` / `cscli scenarios list` — mostra quali collezioni/scenari sono installati e abilitati, utile per verificare cosa viene protetto
- `cscli metrics` — mostra le metriche di parser/bucket/bouncer, utile per verificare che CrowdSec stia effettivamente elaborando i log
- `cscli explain --file <logfile> --type <log-type>` — testa una riga di log contro parser e scenari, utile per eseguire il debug del motivo per cui un attacco è stato rilevato o meno