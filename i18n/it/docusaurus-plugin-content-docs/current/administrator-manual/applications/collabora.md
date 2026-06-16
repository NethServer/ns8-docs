---
title: Collabora Online
sidebar_position: 7
---
# Collabora Online

Collabora Online è una potente suite per ufficio online basata su LibreOffice che supporta tutti i principali formati di file per documenti, fogli di calcolo e presentazioni e che puoi integrare nella tua infrastruttura. Consulta il [sito ufficiale](https://www.collaboraoffice.com/collabora-online/).

Puoi installare più istanze di Collabora Online sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Collabora ha bisogno di un host virtuale dedicato, un FQDN come `collabora.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record di nome corrispondente nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedi alla pagina `Settings` dell'istanza appena installata
2.  inserisci un FQDN valido nel campo `Collabora FQDN`
3.  inserisci una password robusta per l'utente `admin`, che può essere usata per accedere alla console di amministrazione
4.  abilita le opzioni `Let's Encrypt` e `HTTP to HTTPS` in base alle tue esigenze
5.  fai clic sul pulsante **Save**

Puoi accedere alla console di amministrazione aprendo la pagina `Status` e facendo clic sul link `Open console`.

Per integrare Collabora con Nextcloud, consulta [Collabora Online](nextcloud.md#collabora-integration-section).
