---
title: DokuWiki
sidebar_position: 1
---
# DokuWiki

[DokuWiki](https://www.dokuwiki.org) è un wiki open source semplice e molto versatile.

Puoi installare più istanze di DokuWiki sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

DokuWiki richiede un host virtuale dedicato, un FQDN come `wiki.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record di nome corrispondente nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedi alla pagina di configurazione dell'applicazione e compila tutti i campi richiesti
2.  abilita le opzioni `Let's Encrypt` e `HTTP to HTTPS` in base alle tue esigenze
3.  fai clic sul pulsante **Save**
4.  usa il browser per raggiungere l'FQDN selezionato, ad es.: `https://wiki.nethserver.org`.
