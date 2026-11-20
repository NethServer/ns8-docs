---
title: Mattermost
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

## Ripristinare la password di un utente

Poiché l'autenticazione di Mattermost non è integrata con un dominio utenti, non esiste un recupero password self-service. Se la password dell'amministratore impostata durante la procedura guidata iniziale viene persa, o se è necessario reimpostare la password di un altro utente, usa lo strumento a riga di comando `mmctl`.

Mattermost offre anche un ripristino basato su email (`mmctl user reset-password`), ma richiede che l'SMTP sia già configurato sull'istanza, quindi non è utile in questo caso.

Esegui il seguente comando come `root` sul nodo NS8 che ospita l'istanza Mattermost:

    runagent -m mattermost0 podman exec -ti mattermost-app mmctl --local user change-password MY_USER --password NEW_PASSWORD

Sostituisci `mattermost0` con il nome effettivo dell'istanza Mattermost, `MY_USER` con il nome utente o l'indirizzo email di destinazione, e `NEW_PASSWORD` con la nuova password.

## Aggiornamento a Mattermost 11

Il modulo segue le versioni Extended Support Release (ESR) di Mattermost. Il supporto di Mattermost 10.11 ESR è terminato il 15 agosto 2026. L'aggiornamento del modulo installa Mattermost 11.7 ESR, supportato fino al 15 maggio 2027.

Mattermost 11 cambia i limiti della Team Edition. Verificali prima di aggiornare:

- La Team Edition consente al massimo 250 utenti attivati. Il limite precedente era 1000.
- Il single sign-on (SSO) con GitLab non è più disponibile.
- Il plugin Playbooks non funziona più.
- Il motore di ricerca Bleve è stato rimosso. Il modulo ora usa la ricerca nel database.

:::warning

L'aggiornamento non può essere annullato. Mattermost 11 converte le password degli utenti in un nuovo formato al loro accesso successivo. Dopo un ritorno alla versione 10.11, questi utenti non possono accedere finché un amministratore non reimposta la loro password. Esegui un [backup](../configuration/backup.md) prima di aggiornare il modulo.

:::

Per contare gli utenti attivati, esegui il seguente comando come `root` sul nodo:

    runagent -m mattermost1 podman exec mattermost-app mmctl --local --json user list --all | jq '[.[] | select(.delete_at == 0 and (.is_bot | not))] | length'

Sostituisci `mattermost1` con il nome effettivo dell'istanza Mattermost.

Dopo l'aggiornamento, il volume `mattermost-bleve-indexes` non è più usato. Puoi rimuoverlo per liberare spazio su disco:

    runagent -m mattermost1 podman volume rm mattermost-bleve-indexes

Consulta le [note di aggiornamento di Mattermost](https://docs.mattermost.com/administration-guide/upgrade/important-upgrade-notes) per l'elenco completo delle modifiche.
