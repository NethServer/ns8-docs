---
title: Mattermost
sidebar_position: 8
---
# Mattermost

Il modulo Mattermost installa la piattaforma [Mattermost Team Edition](https://mattermost.com).

Mattermost è un'alternativa Open Source e in cloud privato a Slack. Consulta la [documentazione ufficiale](https://docs.mattermost.com/) per maggiori dettagli.

Puoi installare più istanze Mattermost sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Mattermost richiede un host virtuale dedicato, un FQDN come `chat.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record corrispondente nel tuo server DNS. Se intendi usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

:::warning

Tieni presente che l'app mobile **non può connettersi a server con certificati autofirmati**!

:::

Come configurarlo:

1.  accedi alla pagina di configurazione dell'applicazione e inserisci un FQDN valido nel campo `Mattermost FQDN`
2.  abilita le opzioni `Let's Encrypt` e `HTTP to HTTPS` in base alle tue esigenze
3.  fai clic sul pulsante **Save**
4.  apri nel browser il nome host inserito, per esempio `https://chat.nethserver.org`. Al primo accesso, una procedura guidata creerà l'utente amministratore

L'autenticazione di Mattermost *non* è integrata con alcun dominio utenti. L'amministratore di Mattermost deve occuparsi della creazione di utenti e team.

:::note

L'amministratore dovrebbe sempre usare la procedura guidata di Mattermost per creare l'utente admin, quindi inviare il link di invito al team a ogni utente.

:::
