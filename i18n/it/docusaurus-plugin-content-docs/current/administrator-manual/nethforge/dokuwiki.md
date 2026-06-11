---
title: DokuWiki
sidebar_position: 1
---
# DokuWiki

[DokuWiki](https://www.dokuwiki.org) is a simple and highly versatile open source Wiki.

You can install multiple DokuWiki instances on the same node from the [Software center](../installation/software_center.md).

## Configurazione

DokuWiki needs a dedicated virtual host, an FQDN like `wiki.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  access the application configuration page and enter all required fields
2.  abilitare `Let's Encrypt` e le opzioni `HTTP a HTTPS` di conseguenza alle vostre esigenze
3.  cliccare sul pulsante **Save**
4.  use your browser to go to the selected FQDN, eg: `https://wiki.nethserver.org`.
