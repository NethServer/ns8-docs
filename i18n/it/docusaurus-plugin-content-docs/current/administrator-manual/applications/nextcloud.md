---
title: Nextcloud
---
# Nextcloud

[Nextcloud](http://nextcloud.com/) fornisce accesso universale ai tuoi file tramite web, computer o dispositivi mobili ovunque ti trovi. Offre inoltre una piattaforma per visualizzare e sincronizzare facilmente contatti, calendari e segnalibri su tutti i tuoi dispositivi e consente modifiche di base direttamente sul web.

**Caratteristiche principali:**

- configurare Nextcloud con MariaDB e cache Redis
- integrazione con i [domini utente](../installation/user_domains.md) di NethServer 8
- backup automatico

Puoi installare più istanze di Nextcloud sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Nextcloud richiede un host virtuale dedicato, un FQDN come `nextcloud.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record di nome corrispondente nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Dopo l'installazione:

1.  accedi alla pagina `Settings` dell'istanza appena installata
2.  inserisci un FQDN valido nel campo `Host name`
3.  abilita l'opzione `Let's Encrypt` in base alle tue esigenze
4.  imposta una `Password for user 'admin'`, oppure lascia quella predefinita (`Nethesis,1234`)
5.  abilita `Manage email sending from Nextcloud admin panel` per sovrascrivere le impostazioni smarthost del cluster
6.  fai clic sul pulsante **Save**

Per impostazione predefinita, Nextcloud ha un proprio database utenti. Puoi anche collegare l'istanza a un [dominio utente](../installation/user_domains.md) esistente: tutti gli utenti del dominio potranno accedere con le proprie credenziali. L'utente integrato `admin` resta sempre abilitato.

Se vuoi integrare Collabora (CODE) online, vedi [sotto](#collabora-integration-section). L'opzione sarà disponibile dopo che Nextcloud sarà stato inizializzato al primo avvio: di solito richiede meno di un minuto.

:::note

La procedura di aggiornamento/upgrade di Nextcloud può disabilitare le app per evitare problemi di incompatibilità. I log del server tengono traccia delle app disabilitate. Dopo una procedura di aggiornamento/upgrade completata con successo puoi usare la pagina Applications per aggiornare e riabilitare le app.

:::

### Elenco utenti

Tutti gli utenti sono elencati nel pannello amministratore di Nextcloud usando un identificatore univoco contenente lettere e numeri. Questo perché il sistema garantisce che non esistano nomi utente interni duplicati, come riportato nella sezione `Internal Username` della [documentazione ufficiale di Nextcloud](https://docs.nextcloud.com).

### Campo email LDAP alternativo (Samba AD)

Quando il provider di account è un Active Directory, puoi cambiare il campo email usato da Nextcloud tramite una variabile d'ambiente. Il campo email LDAP predefinito è `userPrincipalName`, che corrisponde al nome di dominio AD e non all'indirizzo email dell'utente (ad esempio `user@ad.example.org` invece di `user@example.org`). Questo può creare confusione per gli utenti, perché dovranno usare `userPrincipalName` per accedere invece del proprio indirizzo email. Il campo Email address può essere impostato nella pagina [Utenti e gruppi](../installation/user_domains.md#user_groups-section) se Samba AD è configurato come provider account locale.

Aggiungendo `LDAP_MAIL_ATTRIBUTE`, i tuoi utenti potranno accedere con:

- `sAMAccountName`: ad es. `john`
- `userPrincipalName`: ad es. `john@ad.domain.com`
- `mail`: ad es. `john@domain.com`

:::note

Il comando `runagent` è disponibile solo sul nodo NethServer 8 dove è installata l'applicazione.

:::

Digita in una shell root il seguente comando:

    runagent -m nextcloud1 python3 -c 'import agent ; agent.set_env("LDAP_MAIL_ATTRIBUTE", "mail")'
    runagent -m nextcloud1 systemctl --user restart nextcloud

### Collabora Online {#collabora-integration-section}

Per prima cosa, installa e configura un'istanza di [Collabora Online](collabora.md).

Poi accedi alla pagina `Settings` del modulo Nextcloud.

Troverai un'opzione chiamata `CODE server host name`. Seleziona una delle istanze Collabora esistenti oppure inserisci il dominio di un'altra installazione Collabora.

L'istanza Collabora verrà raggiunta usando il protocollo HTTPS, quindi ricordati di disabilitare l'opzione `Verify TLS certification` se Collabora non dispone di un certificato TLS valido.

Infine, fai clic sul pulsante **Save**. Ora potrai modificare i documenti direttamente dentro Nextcloud.

## Criteri di conservazione dei dati

Per quanto riguarda l'eliminazione degli account in Nextcloud, viene applicata una specifica politica di conservazione dei dati in base all'origine dell'account dell'utente:

- se l'account proviene dal provider LDAP, i suoi dati non sono soggetti a rimozione automatica. Puoi trovare informazioni dettagliate su questa politica nella documentazione: [Pulizia LDAP](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_auth_ldap_cleanup.html).
- nel caso di account memorizzati nel database interno di Nextcloud, i dati associati vengono rimossi immediatamente e automaticamente al momento dell'eliminazione. Ulteriori dettagli sono disponibili qui: [Eliminazione degli utenti](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_configuration.html#deleting-users).

## Comando di ottimizzazione del database {#nextcloud-db-optimize-section}

Nextcloud richiede correzioni manuali del database che non possono essere automatizzate durante l'upgrade, perché le operazioni possono richiedere molto tempo con grandi quantità di dati. In questi casi, il comando `nextcloud-db-optimize` può essere eseguito manualmente per ottimizzare il database di Nextcloud fuori dagli orari di produzione.

Esegui il seguente comando in una shell root, sostituendo `nextcloud1` con l'identificatore corretto dell'applicazione:

    runagent -m nextcloud1 nextcloud-db-optimize
