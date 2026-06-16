---
title: Abbonamento
sidebar_position: 3
---
<a id="subscription-section"></a>

# Abbonamento {#subscription-section}

:::note

Disponibile solo su sistemi basati su Rocky Linux

:::

Un cluster NethServer 8 può essere registrato su un portale web per abilitare servizi aggiuntivi.

[Nethesis](https://www.nethesis.it) offre due tipi di servizi di abbonamento per NethServer, che forniscono vantaggi e funzionalità aggiuntive:

- **Abbonamento Community**: registrazione self-service principalmente adatta ai consulenti IT. Per ulteriori informazioni, consultare la pagina dei [piani di abbonamento](https://www.nethserver.org/subscription).

  Il portale per l'abbonamento Community è disponibile su [my.nethserver.com](https://my.nethserver.com).

- **Abbonamento Enterprise**: servizio riservato ai rivenditori Nethesis, si prega di contattare il Dipartimento Vendite all'indirizzo <info@nethesis.it>.

  Il portale per l'abbonamento Enterprise è disponibile su [my.nethesis.it](https://my.nethesis.it).

Quando un cluster ha un abbonamento attivo, i seguenti servizi sono abilitati:

- Supporto remoto da parte di Nethesis
- [Monitoraggio e avvisi](../configuration/metrics.md) delle risorse
- Caricamento dell'inventario del nodo leader
- [Aggiornamenti programmati](../about/subscription.md#scheduled-updates) per i sistemi operativi dei nodi, i componenti core e le applicazioni
- Caricamento del backup del cluster

Per quanto riguarda i repository software, rimane abilitato solo il repository `subscription`.

:::tip

Si prega di evitare di abilitare repository di terze parti e di non installare software non coperto dal piano di abbonamento

:::

Fare riferimento a [Connettività di rete esterna](../installation/system_requirements.md#external-services) per un elenco completo degli endpoint di servizio Nethesis richiesti da un cluster per attivare e gestire un abbonamento.
## Registra il cluster

A seconda del tipo di abbonamento, accedi a [my.nethserver.com](https://my.nethserver.com) o [my.nethesis.it](https://my.nethesis.it) e ottieni un token di abbonamento unico per il cluster. Segui le procedure documentate nel portale per ottenerlo.

:::warning

Il token di abbonamento è un segreto: non comunicarlo o condividerlo con nessun altro

:::

Una volta copiato il token negli appunti, vai alla pagina `Settings` e clicca sulla scheda `Subscription`. Incolla il token nel campo `Authentication token`, quindi clicca sul pulsante **Register**.

Se la procedura ha successo, la pagina Subscription mostrerà il `System ID`, il tipo di `Plan` e la data di `Expiration`.
## Termini e Condizioni {#terms-and-conditions}

Si prega di leggere attentamente i Termini e Condizioni. Mantenendo un abbonamento attivo a NethServer 8, confermate di accettare i Termini e Condizioni e di rispettarli. Se non accettate questi Termini e Condizioni, non potrete attivare o continuare il vostro abbonamento.

I dettagli sui piani di abbonamento sono disponibili sul [sito web di NethServer](https://www.nethserver.org/subscription).

Le informazioni personali identificative vengono archiviate e trattate quando necessario per adempiere a un contratto di cui l'interessato è parte, o per intraprendere azioni su richiesta dell'interessato prima di stipulare un contratto. Queste informazioni possono anche essere utilizzate per condividere aggiornamenti e notizie relative al servizio sottoscritto.

Il titolare del trattamento dei dati è Nethesis S.r.l unipersonale CF/PI/RI IT 02734760412, con sede in Strada degli Olmi 8 -- 61122 Pesaro (PU) -- Italia.

Qualsiasi richiesta relativa al trattamento delle informazioni personali identificative (PII) può essere indirizzata a <privacy@nethesis.it>.
## Aggiornamenti pianificati {#scheduled-updates}

Un'attività pianificata notturna installa automaticamente gli aggiornamenti software disponibili dai repository gestiti da Nethesis. Questa attività viene eseguita quotidianamente dal martedì al venerdì, in una fascia oraria selezionata casualmente tra mezzanotte e le 6 del mattino. La randomizzazione aiuta a distribuire il carico sulle risorse di rete e server. Gli aggiornamenti includono:

- **Sistema operativo**: Gli aggiornamenti provengono dai repository DNF denominati `ns-baseos` e `ns-appstream`. Questi repository forniscono snapshot ritardati dei repository di Rocky Linux per evitare la distribuzione di aggiornamenti che potrebbero causare problemi imprevisti (vedi [Mirror Rocky Linux gestito da Nethesis](../../tutorial/os_updates.md#neth-mirror)).
- **Componenti principali**: Gli aggiornamenti vengono recuperati dal repository `subscription`.
- **Applicazioni**: Gli aggiornamenti provengono anch'essi dal repository `subscription`.

:::note

Con un abbonamento attivo, non utilizzare procedure personalizzate per aggiornare il sistema operativo, i componenti principali o le applicazioni. Questo include la funzione di aggiornamento software di Cockpit e `dnf-automatic`, che potrebbe eseguire aggiornamenti non controllati in background. Tali procedure creano una configurazione non supportata e possono causare instabilità del sistema. Lascia che sia l'attività pianificata a gestire tutti gli aggiornamenti.

:::

I repository gestiti seguono una politica di aggiornamento conservativa per garantire stabilità e un accurato testing degli aggiornamenti, rendendoli adatti per aggiornamenti automatizzati.

È possibile ignorare la politica di aggiornamento gestita installando o aggiornando manualmente i componenti principali o le applicazioni tramite la pagina del Software Center. I metadati per le applicazioni e i componenti principali provenienti dal repository `subscription` vengono aggiornati ogni ora nel Software Center.

Gli aggiornamenti pianificati vengono inibiti quando un nodo NS7 si unisce al cluster per migrare le applicazioni. Questo è necessario poiché la procedura di migrazione richiede versioni specifiche delle applicazioni per funzionare correttamente. Gli aggiornamenti pianificati saranno riattivati una volta completata la migrazione di NS7 e il nodo NS7 sarà automaticamente rimosso dal cluster.
## Rimuovere l'abbonamento

Accedi alla pagina `Settings` e clicca sulla scheda `Subscription`. In alternativa, vai alla pagina del dashboard del cluster e clicca sul link `Go to Subscription`.

Nella pagina `Subscription`, clicca sul pulsante **Remove subscription**. L'azione deve essere confermata.
## Supporto remoto

:::note

Disponibile solo in Nethesis Enterprise

:::

Il supporto remoto è un servizio che consente al team di supporto Nethesis di accedere al cluster da remoto per diagnosticare e risolvere problemi. Le sessioni di supporto remoto possono essere attivate su richiesta dall'utente e scadono dopo 24 ore.

A seconda del tipo e del piano di sottoscrizione, la pagina `Subscription` consente di avviare e controllare una sessione di supporto remoto, a condizione che siano soddisfatti i [requisiti del servizio SSH](../installation/system_requirements.md#ssh-service-reqs).

- Fare clic su **Start session** per attivare un accesso speciale per il team di supporto Nethesis. Sia l'accesso SSH che l'accesso amministrativo cluster-admin vengono concessi al team di supporto. Le connessioni di supporto sono instradate in un tunnel VPN privato.

  Quando l'accesso è concesso, viene visualizzato un segreto univoco `Session ID`: copialo e incollalo nella tua richiesta di supporto.

- Per terminare la sessione di supporto, chiudere il tunnel VPN e revocare qualsiasi accesso concesso, fare clic su **End session**.

La sessione di supporto è valida solo per accedere al nodo leader. Il team di supporto può accedere ai nodi worker avviando sessioni di supporto individuali sui nodi worker. Ad esempio, se il nodo 2 è un nodo worker, questo è un comando per avviare una sessione di supporto per esso:

    api-cli run node/2/start-support-session

L'ID della sessione viene stampato sull'output standard. Per interrompere la sessione:

    api-cli run node/2/stop-support-session

Controllare lo stato della sessione di supporto per qualsiasi nodo con:

    api-cli run node/2/get-support-session

Esempio di output:

    {
      "session_id": "08e91254-4269-5c38-3120-a11e92f7699b",
      "active": true,
      "expires_at": "2026-04-03T06:41:32+00:00"
    }

Se un nodo worker (ad esempio, il nodo 2) diventa irraggiungibile dal nodo leader, è possibile avviare manualmente una sessione di supporto per esso seguendo questa procedura:

1.  Accedere al nodo worker utilizzando la console o l'accesso SSH.

2.  Eseguire il seguente comando per avviare la sessione di supporto:

        systemctl start support

3.  Ottenere l'ID della sessione con:

        runagent -m node grep VPN_PASSWORD support.env

4.  Per terminare la sessione di supporto:

        systemctl stop support

### Scadenza della sessione

La sessione di supporto viene automaticamente terminata dopo 24 ore. Per evitare la terminazione automatica e consentire che rimanga attiva fino alla durata massima consentita di 7 giorni, eseguire questo comando sul nodo interessato:

    systemctl stop support-expire.timer

Dopo 7 giorni la sessione viene terminata incondizionatamente.
