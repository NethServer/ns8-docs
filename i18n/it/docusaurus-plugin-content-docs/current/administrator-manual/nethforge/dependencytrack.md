---
title: Dependency-Track
sidebar_position: 2
---
# Dependency-Track

Dependency-Track è una piattaforma intelligente di analisi dei componenti che consente alle organizzazioni di identificare e ridurre i rischi nella supply chain del software.

Questa applicazione installa il server [Dependency-Track](https://dependencytrack.org/) con [Trivy](https://docs.dependencytrack.org/datasources/trivy/) come origine dei dati sulle vulnerabilità. Fornisce un'interfaccia web per gestire componenti, vulnerabilità e criteri.

Puoi installare più istanze di Dependency-Track sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Come configurare:

1.  apri la pagina `Settings` dell'applicazione e inserisci l'FQDN per Dependency-Track, ad es. `sub.domain.com`
2.  abilita l'opzione `Request LE Certificate` in base alle tue esigenze
3.  fai clic sul pulsante **Save**

Le credenziali predefinite di Dependency-Track sono:

- utente: `admin`
- password: `admin`

Puoi cambiarle dopo il primo accesso.

Puoi accedere all'applicazione all'indirizzo `https://<FQDN>` impostato nelle impostazioni.

## Scanner di sicurezza Trivy

Per abilitare lo scanner di sicurezza Trivy, segui questi passaggi:

1.  Vai all'interfaccia web di Dependency-Track.
2.  Apri la sezione **Administration**.
3.  Fai clic su **Analysers**.
4.  Fai clic su **Trivy**.
5.  Configura le impostazioni della sorgente dati Trivy secondo necessità, con le seguenti opzioni:

- **Base URL**: `http://127.0.0.1:8282`.
- **API Token**: puoi recuperare il token Trivy nella sezione avanzata della pagina Settings.

6.  Fai clic su **Save** per applicare le modifiche.
