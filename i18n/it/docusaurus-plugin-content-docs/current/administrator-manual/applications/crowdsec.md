---
title: CrowdSec
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) è uno strumento di rilevamento di attività dannose. Cerca pattern conosciuti, come tentativi di accesso malevoli, nei log delle applicazioni e blocca l'indirizzo IP dell'attaccante.

Puoi installare una sola istanza di CrowdSec per ogni nodo.

## Protezioni predefinite {#default-protections}

Una volta installato, CrowdSec è già completamente funzionante e inizia a proteggere automaticamente le applicazioni NS8, prima di qualsiasi configurazione manuale:

- **Applicazioni web (sempre attive)**: ogni applicazione servita tramite il reverse proxy della piattaforma riceve una protezione HTTP generica indipendentemente dall'applicazione — inclusi gli endpoint HTTP di NethVoice — rilevamento di tentativi di accesso forzato (ad esempio, 5 risposte `401`/`403` a richieste `POST` in 10 secondi bloccano l'IP), rilevamento di scansioni/probing, user-agent malevoli, probing di file sensibili (`.env`, `.git`, ...), traversal di percorsi, SQL injection, probing XSS, abuso di proxy aperti, probing di interfacce amministrative e probing di exploit di CVE noti (decine di CVE di prodotti, ad esempio Log4j2, Spring4Shell, VMware vCenter, Fortinet, Pulse Secure).
- **Applicazioni specifiche**: Nextcloud e WordPress ricevono scenari aggiuntivi consapevoli dell'applicazione (tentativi di accesso forzato, enumerazione utenti, scansione di `wp-config`) oltre a quelli generici sopra indicati.
- **SSH**: tentativi di accesso forzato (inclusi varianti lente/basate sul tempo) e controllo della CVE-2024-6387 (regreSSHion).
- **Mail**: rilevamento di abuso/tentativi di accesso forzato per Postfix (abuso di relay, spam, HELO/comandi non validi) e Dovecot (spam).
- **Database**: rilevamento di tentativi di accesso forzato per MariaDB e PostgreSQL.
- **FTP**: rilevamento di tentativi di accesso forzato e enumerazione utenti per ProFTPD e vsftpd.
- **NethVoice**: forza bruta HTTP contro l'API middleware, l'API dei report e il login amministrativo, oltre alla scansione dei percorsi di exploit; forza bruta SIP contro Kamailio. Abilitato di default su una nuova installazione di NethVoice insieme a CrowdSec; in caso di aggiornamento, rimane disabilitato fino a quando non lo abiliti dalla pagina `Collections` (vedi sotto).
- **Whitelist di attori legittimi**: crawler/bot legittimi noti sono automaticamente esclusi dai blocchi.

## Interfaccia web

Il menu laterale del modulo offre accesso alle seguenti pagine: `Status`, `Detections`, `Collections`, `Blocklists`, `Settings` e `About`.

### Status

Mostra una panoramica dell'applicazione (azione di riavvio), il nodo di installazione, lo stato del backup e un link ai log.

### Rilevamenti

I rilevamenti sono attività sospette individuate da CrowdSec, come ripetuti fallimenti di login o schemi di attacco noti. Un rilevamento non comporta sempre il blocco di un IP.

La tabella elenca `Rilevato il`, `Scenario`, `IP sorgente`, `Paese`, `Azione` (`Blocked`, `Block expired` o `-` quando non è stata presa alcuna decisione) e il conteggio degli `Eventi`. Usa il campo di ricerca per filtrare per IP o scenario e il selettore `Eventi da mostrare` per limitare il numero di eventi recenti caricati. Ogni riga ha un link `Details` che apre il log completo degli eventi per quel rilevamento. Un pulsante `Delete all detections` cancella l'intero elenco. Questa pagina espone ciò che in precedenza era visibile solo con il comando `cscli alerts list`.

### Collezioni

Le collezioni aggiungono supporto per il rilevamento di servizi specifici, come SSH, Nginx o WordPress. Abilita solo le collezioni che corrispondono ai servizi installati su questo server; un link al [CrowdSec Hub](https://app.crowdsec.net/hub) consente di verificare cosa rileva ogni collezione prima di abilitarla.

La tabella elenca `Nome`, `Stato`, `Versione` e `Descrizione`, con un'azione `Enable`/`Disable` per riga. Ad esempio, la collezione `nethesis/nethvoice` rileva attacchi di forza bruta e scansioni di exploit contro l'applicazione NethVoice (SIP e HTTP); viene fornita disabilitata dopo un aggiornamento e deve essere abilitata da questa pagina.

### Liste di blocco

Questa pagina sostituisce la precedente pagina `Banned IP` ed è organizzata in tre schede.

#### Lista di blocco locale

Indirizzi IP attualmente bloccati da questo server in base alle decisioni locali di CrowdSec. La tabella elenca `Bloccato il`, `Indirizzo IP`, `Tempo rimanente` e `Motivo`, con un campo di ricerca e un'azione `Unblock` per riga, oltre a un'azione `Unblock all`.

#### Lista di blocco della community

Indirizzi IP condivisi dalla community di CrowdSec e ricevuti tramite l'API centrale (CAPI). Di default, CrowdSec invia alcune telemetrie ai server di proprietà di CrowdSec; i server utilizzano tali dati per comporre una lista di blocco della community che viene restituita alla tua installazione. Se non desideri condividere tali dati, disabilita l'interruttore `Central API and signal sharing` — ciò disabilita anche l'interruttore `Community blocklist` sottostante.

Puoi connettere la tua istanza alla [console di CrowdSec](https://app.crowdsec.net) compilando il campo opzionale `Enroll key`. Il tag `Central API status` mostra se l'istanza è connessa. Il numero di IP attualmente elencati nella lista di blocco della community è mostrato accanto a un campo di ricerca che consente di verificare se un determinato IP è incluso.

Disabilitare la Central API o la lista di blocco della community elimina automaticamente le decisioni provenienti dalla CAPI da questo server.

CrowdSec fornisce una [lista di blocco della community](https://docs.crowdsec.net/docs/next/central_api/community_blocklist) condivisa tra tutti gli utenti; abilitare `Central API and signal sharing` e iscrivere la tua istanza nella console la attiva. Per accedere alla lista di blocco completa (oltre alla versione Lite), devi condividere almeno alcune decisioni di blocco con la Central API ogni 24 ore. Se il tuo server ha pochi o nessun blocco, sarà considerato in uno stato di blocco, impedendo l'accesso alla lista di blocco completa.

#### Lista di permessi

Indirizzi IP, intervalli CIDR e nomi di dominio attendibili che non devono mai essere bloccati. Inserisci un elemento per riga, ad esempio:

```
192.168.1.10
192.168.1.0/24
trusted.example.com
```

### Impostazioni

- `Blocco della rete locale`: disabilitato di default, il traffico privato/LAN non viene mai bloccato. Abilita questo interruttore se desideri che CrowdSec blocchi anche gli IP offensivi sulle tue reti locali.
- `Durata del blocco`: scegli `Incremental` per aumentare la durata per rilevamenti ripetuti dallo stesso IP, oppure `Fixed` per utilizzare sempre la stessa durata. In entrambi i casi, inserisci la durata in minuti come testo libero.
- Notifica via email aggiungendo un indirizzo per riga nel campo `Email recipients for notifications`: le notifiche funzioneranno solo se [Email notifications](../configuration/email_notifications.md) è stato configurato — un link alle impostazioni email del cluster viene mostrato quando non è ancora configurato.
- `Notification threshold`: CrowdSec invia un'email di notifica giornaliera elencando i nuovi IP bloccati ai destinatari configurati. Se questa soglia di nuovi IP bloccati viene raggiunta prima del report giornaliero, la notifica viene inviata immediatamente. Può essere impostata tra 1 e 10000 (100 di default).

I dati di CrowdSec sono accessibili dalle dashboard `CrowdSec Overview` e `CrowdSec Metrics` di Grafana, come spiegato in [Accesso a Grafana](../configuration/metrics.md#grafana_access-section).

## Interfaccia a riga di comando

La maggior parte delle azioni sopra descritte è disponibile anche dalla riga di comando.

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