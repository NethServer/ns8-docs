---
title: Subscription
sidebar_position: 3
---
# Subscription

:::note

Disponibile solo per sistemi basati su Rocky Linux

:::

Un cluster NethServer 8 può essere registrato su un portale web per abilitare servizi aggiuntivi.

[Nethesis](https://www.nethesis.it) offers two types of subscription services for NethServer, which provide additional benefits and features:

- **Community subscription**: self-service registration mostly suited for IT consultants. For more information, see the [subscription plans](https://www.nethserver.org/subscription) page.

  Community subscription portal is available at [my.nethserver.com](https://my.nethserver.com).

- **Enterprise subscription**: service reserved to Nethesis resellers, please contact the Sales Department at <info@nethesis.it>.

  Enterprise subscription portal is available at [my.nethesis.it](https://my.nethesis.it).

Quando un cluster ha una subscription attiva, i seguenti servizi vengono abilitati:

- Supporto remoto di Nethesis
- Resources [monitoring and alerting](../configuration/metrics.md)
- Upload inventario del nodo leader
- Aggiornamenti automatici per il sistema operativo dei nodi, i componenti core e le applicazioni
- Upload of cluster backup

Per quanto riguarda i repository software, resta attivo solo il repository `subscription`.

:::tip

È sconsigliato attivare repository di terze parti e installare software non coperti dal piano subscription attivo

:::

Refer to [External network connectivity](../installation/system_requirements.md#external-services) for a complete list of Nethesis service endpoints required by a cluster to activate and manage a subscription.

## Registrazione del cluster

A seconda del tipo di subscription, accedere al portale [my.nethserver.com](https://my.nethserver.com) o al portale [my.nethesis.it](https://my.nethesis.it) e generare un token univoco per il cluster seguendo la procedura specifica per il portale utilizzato.

:::warning

Il token di subscription è un segreto: non comunicarlo o condividerlo con qualcun altro

:::

Una volta copiato il token nella clipboard, spostarsi nella pagina `Impostazioni` e fare clic sulla scheda `Subscription`. Incollare il token nel campo `Token di autenticazione`, quindi fare clic sul pulsante **Registra**.

Se la procedura termina con successo, la pagina Subscription visualizza l'`ID Sistema`, il tipo di `Piano` e la data di `Scadenza`.

## Termini e Condizioni {#terms-and-conditions}

Si prega di leggere attentamente i Termini e Condizioni. Mantenendo un abbonamento attivo NethServer 8, si conferma di accettare i Termini e Condizioni e si accetta di rispettare da loro. Se non accetti i presenti Termini e Condizioni, non puoi attivare o continuare l'abbonamento.

Dettagli dei piani di abbonamento si possono trovare sul sito web [NethServer](https://www.nethserver.org).

Le informazioni di identificazione personale vengono memorizzate e trattate quando necessario per adempiere a un contratto a cui l'interessato è parte, o per prendere misure su richiesta dell'interessato prima di entrare in un contratto. Queste informazioni possono anche essere utilizzate per condividere aggiornamenti e notizie relative al servizio sottoscritto.

Il titolare del trattamento è Nethesis S.r.l unipersonale CF/PI/RI IT 02734760412, situato alla Strada degli Olmi 8 -- 61122 Pesaro (PU) -- Italia.

Eventuali richieste relative al trattamento delle informazioni di identificazione personale (PII) possono essere indirizzate a <privacy@nethesis.it>.

## Aggiornamenti programmati {#scheduled-updates}

A scheduled overnight task automatically installs software updates available from Nethesis-managed repositories. This task runs daily from Tuesday through Friday, within a randomly selected time slot between midnight and 6 AM. The randomization helps distribute the load on network and server resources. The updates include:

- **Operating system**: Updates are sourced from the DNF repositories labeled `ns-baseos` and `ns-appstream`. These repositories provide delayed snapshots of Rocky Linux repositories to avoid distributing updates that could cause unexpected issues.
- **Core components**: Updates are fetched from the `subscription` repository.
- **Applications**: Updates are also sourced from the `subscription` repository.

I repository gestiti seguono una politica di aggiornamento conservatrice per garantire stabilità e test approfonditi degli aggiornamenti, rendendoli adatti agli aggiornamenti automatizzati.

È possibile sovrascrivere la politica di aggiornamento gestita installando o aggiornando manualmente i componenti o le applicazioni core tramite la pagina Centro software. I metadati per applicazioni e componenti fondamentali del repository `subscription` sono aggiornati orariamente nel Software Center.

Gli aggiornamenti programmati vengono inibiti quando un nodo NS7 si unisce al cluster per migrare le applicazioni. Questo è necessario perché la procedura di migrazione richiede specifiche versioni di applicazione per funzionare correttamente. Gli aggiornamenti programmati saranno riattivati una volta terminata la migrazione NS7 e il nodo NS7 viene rimosso automaticamente dal cluster.

## Rimozione subscription

Spostarsi nella pagina `Impostazioni` e fare clic sulla scheda `Subscription`. In alternativa, dalla dashboard del cluster fare clic sul link `Vai a Subscription`.

Nella pagina `Subscription`, fare clic sul pulsante **Rimuovi subscription**. Verrà richiesta conferma dell'azione.

## Supporto remoto

:::note

Disponibile solo per Nethesis Enterprise

:::

Remote support is a service that allows Nethesis support team to access the cluster remotely to troubleshoot and resolve issues. Remote support sessions can be activated on demand by the user, and they expire after 24 hours.

Depending on the subscription type and plan, the `Subscription` page allows starting and controlling a remote support session, provided the [SSH service requirements](../installation/system_requirements.md#ssh-service-reqs) are met.

- Fare clic su **Avvia sessione** per attivare un accesso speciale per il team di supporto Nethesis. Al team di supporto sarà consentito l'accesso amministrativo sia SSH che al cluster-admin. Le connessioni di supporto sono veicolate attraverso un tunnel VPN privato.

  Quando l'accesso è consentito, viene visualizzato nella pagina un segreto denominato `ID sessione`: il segreto va copiato e incollato nella richiesta di supporto.

- Per terminare la sessione di supporto, chiudere il tunnel VPN e revocare qualsiasi accesso consentito, fare clic sul pulsante **Termina sessione**.

La sessione di supporto è valida solo per raggiungere il nodo leader. Il team di supporto può accedere agli altri nodi del cluster avviando sessioni di supporto individuali nei nodi worker. Per esempio, se il nodo 2 è un nodo worker, il comando per avviare una sessione di supporto per esso è il seguente:

    api-cli run node/2/start-support-session

L'ID sessione viene stampato sullo standard output. Per interrompere la sessione:

    api-cli run node/2/stop-support-session

È possibile verificare lo stato della sessione di supporto su un qualsiasi nodo con il comando:

    api-cli run node/2/get-support-session

Output example:

    {
      "session_id": "08e91254-4269-5c38-3120-a11e92f7699b",
      "active": true,
      "expires_at": "2026-04-03T06:41:32+00:00"
    }

Se un nodo worker (ad esempio, nodo 2) diventa irraggiungibile dal nodo leader, è possibile avviare manualmente una sessione di supporto per esso con la seguente procedura:

1.  Accedere al nodo worker, utilizzando la console o l'accesso SSH.

2.  Eseguire il seguente comando per avviare la sessione di supporto:

        systemctl start support

3.  Ottenere l'ID sessione con:

        runagent -m node grep VPN_PASSWORD support.env

4.  Per terminare una sessione di supporto:

        systemctl stop support

### Session expiration

The support session is automatically terminated after 24 hours. To avoid automatic termination and allow it to run up to the maximum allowed duration of 7 days, execute this command on the relevant node:

    systemctl stop support-expire.timer

After 7 days the session is terminated unconditionally.
