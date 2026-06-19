---
title: Roundcube
---
# Roundcube

[Roundcube](https://roundcube.net/) è un client di webmail. Le principali funzionalità di Roundcube sono:

- semplice e veloce
- rubrica integrata con LDAP interno
- supporto per i messaggi HTML
- supporto per le cartelle condivise
- plugin

Puoi installare più istanze di Roundcube sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Roundcube richiede un host virtuale dedicato, un FQDN come `webmail.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record di nome corrispondente nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

:::warning

Tieni presente che l'app mobile **non può connettersi a server con certificati autofirmati**!

:::

Come configurare:

1.  accedi alla pagina di configurazione dell'applicazione e inserisci un FQDN valido nel campo `Roundcube hostname`
2.  abilita le opzioni `Request LE certificate` e `HTTP to HTTPS` in base alle tue esigenze
3.  collega l'istanza di Roundcube a un `Mail server` esistente
4.  fai clic sul pulsante **Save**

All'interno della sezione `Advanced`, puoi anche configurare un elenco di [Plugin](#roundcube_plugins-section) e la `Maximum size for attachments`.

## Plugin {#roundcube_plugins-section}

Roundcube supporta molti plugin già inclusi nell'installazione.

I plugin abilitati per impostazione predefinita sono:

- archive
- Zip download
- Manage sieve: gestisce i filtri per la posta in arrivo
- Mark as junk: contrassegna i messaggi selezionati come Junk e li sposta nella cartella Junk configurata

Plugin consigliati:

- New mail notifier
- Emoticons
- VCard support

L'elenco completo dei plugin ufficiali è disponibile in [Roundcube plugins](https://github.com/roundcube/roundcubemail/tree/master/plugins).
