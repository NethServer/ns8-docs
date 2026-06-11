---
title: Collaborare online
sidebar_position: 7
---
# Collaborare online

Collabora Online is a powerful LibreOffice-based online office that supports all major document, spreadsheet and presentation file formats, which you can integrate in your own infrastructure. Please see the [official website](https://www.collaboraoffice.com/collabora-online/).

È possibile installare più istanze Collabora Online sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Collabora ha bisogno di un host virtuale dedicato, un FQDN come `collabora.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedere alla pagina `Impostazioni` dell'istanza appena installata
2.  inserire un FQDN valido all'interno del campo `Collabora FQDN`
3.  inserire una password forte per l'utente `admin` che può essere utilizzato per accedere alla console di amministrazione
4.  abilitare `Let's Encrypt` e le opzioni `HTTP a HTTPS` di conseguenza alle vostre esigenze
5.  cliccare sul pulsante **Save**

È possibile accedere alla console di amministrazione accedendo alla pagina `Status` e cliccando sul link `Apri console`.

Per integrare Collabora con Nextcloud, vedere [Collaborare online](nextcloud.md#collabora-integration-section).
