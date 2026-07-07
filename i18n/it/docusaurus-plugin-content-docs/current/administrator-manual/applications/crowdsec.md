---
title: CrowdSec
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) è uno strumento di rilevamento di attività dannose. Cerca pattern conosciuti, come tentativi di accesso malevoli, nei log delle applicazioni e blocca l'indirizzo IP dell'attaccante.

Puoi installare una sola istanza di CrowdSec per ogni nodo.

## Protezioni predefinite {#default-protections}

Una volta installato, CrowdSec è già completamente funzionante e inizia a proteggere automaticamente le applicazioni NS8, prima di qualsiasi configurazione manuale:

- **Applicazioni web (sempre attive)**: ogni applicazione servita tramite il reverse proxy della piattaforma riceve una protezione HTTP generica indipendentemente dall'applicazione — rilevamento di tentativi di accesso forzato (ad esempio, 5 risposte `401`/`403` a richieste `POST` in 10 secondi bloccano l'IP), rilevamento di scansioni/probing, user-agent malevoli, probing di file sensibili (`.env`, `.git`, ...), traversal di percorsi, SQL injection, probing XSS, abuso di proxy aperti, probing di interfacce amministrative e probing di sfruttamento di CVE conosciuti (decine di CVE di prodotti, ad esempio Log4j2, Spring4Shell, VMware vCenter, Fortinet, Pulse Secure).
- **Applicazioni specifiche**: Nextcloud e WordPress ricevono scenari aggiuntivi specifici per l'applicazione (accesso forzato, enumerazione utenti, scansione di `wp-config`) oltre a quelli generici sopra menzionati.
- **SSH**: tentativi di accesso forzato (inclusi varianti lente/basate sul tempo) e controllo del CVE-2024-6387 (regreSSHion).
- **Mail**: rilevamento di abuso/tentativi di accesso forzato per Postfix (abuso di relay, spam, HELO/comandi non validi) e Dovecot (spam).
- **Database**: rilevamento di tentativi di accesso forzato per MariaDB e PostgreSQL.
- **FTP**: rilevamento di tentativi di accesso forzato e enumerazione utenti per ProFTPD e vsftpd.
- **Whitelist di attori legittimi**: crawler/bot legittimi conosciuti sono automaticamente esclusi dai blocchi.

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

Puoi anche eseguire un singolo comando direttamente, senza aprire una shell, anteponendolo con `runagent -m crowdsec1`:

    runagent -m crowdsec1 cscli decisions list

Alcuni comandi utili:

- `runagent -m crowdsec1 cscli decisions list` — elenca i blocchi correnti (IP, motivo, durata, ID decisione)
- `runagent -m crowdsec1 cscli decisions delete --id <id>` — rimuove un blocco tramite il suo ID decisione, ad esempio `runagent -m crowdsec1 cscli decisions delete --id 630190`
- `runagent -m crowdsec1 cscli decisions delete --ip <ip>` — rimuove un blocco tramite indirizzo IP
- `runagent -m crowdsec1 cscli decisions add --ip <ip> --duration 4h --reason "manual ban"` — blocca manualmente un indirizzo IP
- `runagent -m crowdsec1 cscli alerts list` — elenca gli avvisi attivati (attacchi rilevati), inclusi quelli che non hanno portato a un blocco
- `runagent -m crowdsec1 cscli bouncers list` — elenca i bouncers registrati (ad esempio il firewall bouncer) e il loro stato
- `runagent -m crowdsec1 cscli collections list` / `runagent -m crowdsec1 cscli scenarios list` — mostra quali collezioni/scenari sono installati e abilitati, utile per verificare cosa viene protetto
- `runagent -m crowdsec1 cscli metrics` — mostra le metriche di parser/bucket/bouncer, utile per verificare che CrowdSec stia effettivamente elaborando i log
- `runagent -m crowdsec1 cscli explain --file <logfile> --type <log-type>` — testa una riga di log contro parser e scenari, utile per diagnosticare perché un attacco è stato o non è stato rilevato