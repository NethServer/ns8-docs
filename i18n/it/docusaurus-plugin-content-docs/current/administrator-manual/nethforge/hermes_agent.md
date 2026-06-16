---
title: Hermes Agent
sidebar_position: 12
---
# Hermes Agent

[Hermes Agent](https://hermes-agent.nousresearch.com/) è un agente AI autonomo di Nous Research. Su NethServer 8 puoi installarlo dal repository NethForge e distribuire una o più istanze. Ogni istanza ha un proprio host virtuale per la dashboard e può gestire uno o più agenti Hermes.

## Configurazione

Abilita il repository NethForge dalla pagina [Software repositories](../installation/software_center.md#software_repositories-section) se non è già disponibile, quindi installa Hermes Agent dal Software Center.

Dopo l'installazione, apri la pagina delle impostazioni dell'istanza e configura l'applicazione:

1.  Inserisci un host virtuale dedicato per la dashboard, per esempio `hermes.example.com`. Crea il record DNS corrispondente prima di pubblicare il servizio. Se il nome è raggiungibile pubblicamente, puoi abilitare l'opzione **Let's Encrypt certificate**.
2.  Seleziona uno dei [domini utente](../installation/user_domains.md) disponibili. L'istanza usa quel dominio per autenticare gli utenti sulla dashboard condivisa.
3.  Aggiungi uno o più agenti. Per ogni agente, inserisci un nome, scegli un ruolo e assegna un **Allowed user** dal dominio utente selezionato.
4.  Fai clic sul pulsante **Save**.

Ogni agente è assegnato a un utente e lo stesso utente non può essere assegnato a più agenti nella stessa istanza di Hermes Agent.

Dopo il salvataggio, apri `https://hermes.example.com`. La dashboard web di Hermes Agent viene pubblicata sull'host virtuale configurato. Gli utenti accedono con le credenziali del dominio utente selezionato e vengono indirizzati all'agente loro assegnato.

## Interfaccia a riga di comando

La configurazione iniziale di Hermes è spesso più semplice dalla riga di comando che dalla dashboard web.

Per aprire l'interfaccia testuale di Hermes per l'agente 1 dell'istanza `hermes-agent1`:

    runagent -m hermes-agent1 podman exec -it hermes-1 hermes

Per avviare la configurazione guidata dello stesso agente:

    runagent -m hermes-agent1 podman exec -it hermes-1 hermes setup

Per configurare Telegram o un altro gateway di messaggistica dalla riga di comando:

    runagent -m hermes-agent1 podman exec -it hermes-1 hermes gateway setup

Sostituisci `hermes-agent1` con il nome della tua istanza e `1` con l'ID dell'agente di destinazione.

## Documentazione ufficiale

Consulta la [documentazione ufficiale di Hermes Agent](https://hermes-agent.nousresearch.com/docs/) per dettagli su provider, gateway, comandi CLI e configurazione avanzata.
