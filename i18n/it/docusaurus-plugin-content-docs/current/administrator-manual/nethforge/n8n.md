---
title: n8n
sidebar_position: 11
---
# n8n

[n8n](https://n8n.io/) è una piattaforma flessibile di automazione dei workflow AI per team tecnici. Consente di creare workflow flessibili incentrati su un'integrazione profonda dei dati.

## Configurazione

n8n richiede un host virtuale dedicato, un FQDN come `n8n.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record di nome corrispondente nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedi alla pagina di configurazione dell'applicazione e compila tutti i campi richiesti
2.  abilita le opzioni `Let's Encrypt` e `HTTP to HTTPS` in base alle tue esigenze
3.  fai clic sul pulsante **Save**
4.  usa il browser per raggiungere l'FQDN selezionato, ad es.: `https://n8n.nethserver.org`
5.  crea l'account amministratore di n8n
