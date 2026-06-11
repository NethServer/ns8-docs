---
title: n8n
sidebar_position: 11
---
# n8n

[n8n](https://n8n.io/) is a flexible AI workflow automation for technical teams. It allows you to build flexible workflows focused on deep data integration.

## Configurazione

n8n needs a dedicated virtual host, an FQDN like `n8n.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  access the application configuration page and enter all required fields
2.  abilitare `Let's Encrypt` e le opzioni `HTTP a HTTPS` di conseguenza alle vostre esigenze
3.  cliccare sul pulsante **Save**
4.  use your browser to go to the selected FQDN, eg: `https://n8n.nethserver.org`
5.  create the n8n admin account
