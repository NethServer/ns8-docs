---
title: CrowdSec
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) è uno strumento di rilevamento di attività dannose. Cerca pattern conosciuti, come tentativi di accesso malevoli, nei log delle applicazioni e blocca l'indirizzo IP dell'attaccante.

Puoi installare una sola istanza di CrowdSec per ogni nodo.

## Configurazione

Una volta installato, CrowdSec è già completamente funzionale e protegge molte applicazioni NS8.

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
