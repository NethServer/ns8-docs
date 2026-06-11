---
title: Migrazione da NethServer 7
sidebar_position: 4
---
# Migrazione da NethServer 7

Migration is the process to convert a NethServer 7 machine (*source* NS7) into a NethServer 8 (*destination* NS8).

Prima di iniziare avrete bisogno di:

- SSH and Cockpit access to the source NS7 machine.
- A new server containing a [freshly installed NS8 cluster](../administrator-manual/installation/install.md).

Also check the following requirements:

1.  The NS8 cluster VPN address must be resolved correctly by NS7 and the VPN port must not be blocked by intermediate network appliances. The VPN address and port were configured during the cluster creation: by default the address is the leader node FQDN and the port number is 55820.
2.  If NS7 is connected to an external account provider, you must configure NS8 with the same account provider, as explained in [Account provider](#migrate-account-provider).
3.  You must be granted access to your authoritative DNS server. Applications in NS8 have a dedicated virtual host name, a FQDN that must be registered in the DNS. You will need to add or change a DNS CNAME for each of them.
4.  The `nethforge` repository must be enabled in NS8 to migrate SOGo.

## Connect to NS8

La procedura di migrazione aggiungerà NS7 come nodo speciale del cluster NethServer 8. Se un provider di account è configurato sul sistema NS7, sarà collegato al cluster NS8 come provider di account esterno prima dell'inizio del processo di migrazione.

1.  Install the migration tool on the source machine. Access Cockpit on the source server and install "Migration to NS8" from the Software Center.
2.  Open the just installed `NS8 migration` application.
3.  Connect the NethServer 7 server to an existing new NethServer 8 cluster by entering the following fields:
    - `LDAP user domain`: Questo campo è disponibile quando NS7 utilizza un provider di account OpenLDAP locale. Assicurarsi che il nome del dominio utente sia unico nel cluster NS8. Il database locale LDAP di NS7 verrà rinominato a questo nuovo nome di dominio durante la migrazione al cluster NS8.
    - `NS8 leader node`: il nome host o l'indirizzo IP del nodo leader NethServer 8
    - `NS8 admin username` and `NS8 admin password`: administrator credentials for the leader node. These credentials are solely used to create a `ns7admin1` admin account in NS8 (note that the trailing '1' may actually be any number), reserved for the NS7 migration tool. Ensure that this account is automatically removed at the end of the migration.
    - deselezionare l'opzione `TLS validation` se il nodo leader non ha un certificato TLS valido
4.  Click the **Connect** button.

If NS8 has an active subscription plan, automated updates are inhibited until the NS7 node is automatically removed from the cluster at migration completion. See also [Aggiornamenti programmati](../administrator-manual/about/subscription.md#scheduled-updates).

## Migrate an application

The web interface will display the list of all applications installed inside NethServer 7.

:::tip

If NS7 has a remote account provider and an error message is displayed instead, see [Account provider](#migrate-account-provider).

:::

1.  Choose an application and click on the **Start migration** button. In this phase the migration process will install the application into the NethServer 8 cluster and start the first data synchronization. If the NethServer 8 cluster is composed by 2 or more nodes, you will be asked to select a destination node.
2.  Click the **Sync data** button multiple time to keep in sync the application data between NethServer 7 and NethServer 8. If something goes wrong at this point, click the **Abort
   migration** button to remove the NS8 application instance and start over with it.
3.  When you are ready for the final migration, click the **Finish
   migration** button. If the migrated application requires extra parameters, the system will display a dialog box before proceeding.

Please note that most web application will need a dedicated FQDN (virtual host) after finishing the migration. Make sure the DNS record points to the NS8 node. In NS8, you can still configure [custom HTTP routes](#migrated_routes-section) for the migrated applications.

At the end of each application migration the following happens:

- The application in NS8 is configured and started with the migrated data.
- The application in NS7 is stopped and disabled.
- The migration tool configures an HTML page with a link pointing to the new application virtual host name served by NS8. End-users will see that link instead of the old application. See also [Rotte HTTP manuali](#migrated_routes-section).
- If the NS7 application was connected to the local account provider, the NS8 application still uses it, through a temporary external account provider and the cluster VPN. See [Account provider](#migrate-account-provider) for more information.

As alternative, the migration of an application can be skipped with the **Skip migration** button.

## Complete the migration

When the account provider is finally migrated, the migration procedure disconnects NS7 from the NS8 cluster and the initial connection page appears again.

If NS7 needs to use NS8 as remote account provider, read carefully the section [Account provider](#migrate-account-provider).

## Log

- La UI dello strumento di migrazione ha una pagina `Logs` per la lettura del log `/var/log/ns8-migration.log`. La procedura di migrazione di ogni applicazione invia una traccia della sua attività a quel file.
- Inoltre, quando ci si unisce o si abbandona il cluster NS8 e quando i servizi NS7 vengono modificati, alcune informazioni possono essere registrate in `/var/log/messages` come al solito.
- Lato NS8, il log delle applicazioni contiene la traccia dell'attività `import-module`.

## Account provider {#migrate-account-provider}

Your action is required if the NS7 system is configured with a **remote account provider**. The migration tool expects to find in NS8 an external user domain matching the `BaseDN` value of the remote account provider. For example, in NS7 under the `Users & Groups` page, look at the `Account provider` details: if the `BaseDN` value is `dc=directory,dc=nh`, then the NS8 external user domain name must be set to `directory.nh`. Apart from the matching name, the external user domain of NS8 must point to the same LDAP database of NS7 (regardless its implementation). Bear in mind that every node of the NS8 cluster must reach the same LDAP database, now and in the future.

If the NS7 system uses a **local account provider**, ensure its domain name is unique within the NS8 cluster and does not conflict with any existing user domain name. This is particularly important for AD domains, as they cannot be renamed in the migration tool's connection form. When connected to the NS8 cluster, a temporary external user domain is created to allow migrated applications to access the NS7 local account provider until its migration is complete. Once the local account provider is migrated, the temporary external user domain is automatically removed.

Refer to the next sections for specific information about the local account provider migration.

### Samba DC

Completa la migrazione DC facendo clic sul pulsante: `Finish migrazione` . La procedura chiede di selezionare un indirizzo IP: diventerà l'IP della destinazione DC.

:::warning

Windows clients might not know how to reach the new DC

:::

1.  If DNS configuration of Windows clients is controlled by a DHCP server, set the NS8 DC IP address as the new DNS server.
2.  If Windows clients use an external DNS, it must be configured to forward the requests for the Active Directory DNS zone to the NS8 DC IP address.
3.  If Windows clients have a manual DNS configuration and use the NS7 DC IP address as DNS and authentication server, consider to transfer the NS7 DC IP address to the NS8 DC.

In the last case, transferring the IP avoids the reconfiguration of DNS settings for each Windows client. This can be preferable over an external DNS server, if it blocks dynamic DNS update requests (DDNS).

Per trasferire l'indirizzo IP del DC sorgente al DC destinazione, alcuni passaggi devono essere effettuati manualmente dopo il completamento della migrazione.

1.  Controllare che la migrazione degli account abbia avuto successo. Gli utenti e i gruppi devono essere elencati correttamente nella pagina `Domains and users`.

2.  Al termine della migrazione l'indirizzo IP del DC sorgente è libero e può essere assegnato al nodo di destinazione. Fare riferimento alla documentazione del sistema operativo del nodo per assegnare un indirizzo IP secondario (alias) al nodo di destinazione.

3.  Change the IP address of the DC. For example, if DC instance is `samba1` and the new IP is `192.168.1.123`, run the following command:

        api-cli run module/samba1/set-ipaddress --data '{"ipaddress":"192.168.1.123"}'

Il Samba DC di NS8 può essere configurato come account provider esterno per NS7. Tenere presente che NS7 deve essere in grado di accedere all'[IP address](../administrator-manual/installation/user_domains.md#active_directory-section) legato all'account provider Samba cui è destinato. Questa configurazione potrebbe essere utile se si dispone ancora di moduli in esecuzione su NS7 che richiedono l'accesso all'account provider.

Le impostazioni di scadenza della password sono conservate durante la migrazione. La politica di forza della password, se abilitata, viene convertita per la compliancy con i requisiti di complessità del server Windows 2003+[^1] ed è applicata per le modifiche future della password. Vedi anche: ref: `password-policy-sezione`.

### OpenLDAP

Complete the OpenLDAP migration by clicking on the **Finish
migration** button.

:::warning

L'istanza OpenLDAP in esecuzione in NS8 non è attualmente accessibile come account provider esterno per NS7 e altri dispositivi di rete.

:::

L'età della password e le informazioni di stato bloccate del conto sono conservate dalla procedura di migrazione.

However, password policy settings (strength and expiration) are not migrated. To re-enable them, navigate to the domain settings of the `Domains and users` page. See also [Password policy](../administrator-manual/installation/user_domains.md#password-policy-section).

## Mail {#mail-migration-section}

La procedura di migrazione conserva sia i dati che le configurazioni dell'applicazione NS7 Email, salvo diversa indicazione in questa sezione o in [Nextcloud](#config-excluded-migration).

I messaggi di posta vengono copiati a NS8 con Rsync. Dopo che **Finish migration** viene cliccato, alcune operazioni che richiedono tempo vengono eseguite.

- **IMAP ACL Format Conversion**: Il formato nome utente e gruppo in IMAP ACLs viene modificato rimuovendo il suffisso di dominio. Ad esempio, una voce ACL che si riferisce all'utente IMAP `john.doe@server.example.org` diventa `john.doe`. IMAP login accetta ancora entrambi i formati.
- **Quota Recalculation**: If IMAP quota is enabled, mailbox sizes are recalculated in the background. During this time, disk usage of mailboxes might not be available.
- **Messages and Attachments Reindexing**: The full-text search engine of NS8 runs in the background to reindex all messages and attachments. During this time, full-text searches might not work. To check if the reindexing process is still running, use the command `pgrep dovecot-index`.

Remember to update the DNS records or transfer the IP address to the NS8 node at the end of the migration.

### Smart host

La configurazione intelligente host del sistema NS7 viene convertita in un [default relay rule](../administrator-manual/applications/mail.md#relay-rules-section). L'applicazione Mail NS8 viene quindi configurata come server SMTP per ogni applicazione del cluster: vedi [Email notifications](../administrator-manual/configuration/email_notifications.md).

### Connettore POP3 {#getmail_migration-section}

The migration transfers POP3 Connector settings to the NS8 [Imapsync application](../administrator-manual/applications/imapsync.md).

- Accounts configured with IMAP are automatically converted into working Imapsync tasks.
- Accounts using POP3 require manual review and adjustment before starting synchronization.

In both cases, the Imapsync task is created with the `Sieve filter` option disabled.

:::note

Messages copied by Imapsync bypass anti-spam and anti-virus checks. To ensure security, enable these protections on the remote IMAP server before synchronization.

:::

## NethVoice {#migrated_nethvoice-section}

La procedura di migrazione richiede due FQDN da assegnare:

- uno per l'interfaccia di amministrazione dell'applicazione **NethVoice**
- one for **NethVoice CTI**.

I dati NethVoice (registrazione di file, file audio, database CDR) vengono copiati a NS8 con Rsync. Dopo che **Finish migration** viene cliccato, alcune operazioni che richiedono tempo vengono eseguite.

Ricorda di aggiornare i record DNS se si prevede di utilizzare lo stesso FQDN di NethVoice su NS7 alla fine della migrazione.

More information are available inside: [NethVoice Documentation](https://docs.nethvoice.com/).

## Rotte HTTP manuali {#migrated_routes-section}

In NethServer 7, la maggior parte delle applicazioni web erano accessibili utilizzando rotte in stile percorso. Per esempio, dato un server chiamato `server.nethserver.org` l'installazione WebTop era disponibile presso `https://server.nethserver.org/webtop`.

Dall'altra parte, quando l'applicazione viene migrata, verrà chiesto di inserire un FQDN in modo che WebTop sarà disponibile su un URL del tipo `https://webtop.nethserver.org`.

Se hai già migrato il record DNS FQDN al nuovo server, puoi anche ricreare manualmente i vecchi percorsi HTTP da[proxy page](../administrator-manual/configuration/proxy.md).

Esempio per l'aggiunta di percorsi WebTop:

1.  aprire la sezione `HTTP routes` dalla pagina `Impostazioni`
2.  cliccare sul nome dell'istanza WebTop, tipo `webtop1`, una finestra di dialogo modale mostrerà i dettagli del percorso
3.  copiare il valore dal campo `URL`, tipo `http://127.0.0.1:20033`
4.  cliccare sul pulsante :guilabel: `Create route`
5.  scegliere un `Name` per la radice e selezionare il `Node` dove l'istanza WebTop è in esecuzione
6.  paste the value copied before (`http://127.0.0.1:20033`) inside the `URL` field
7.  lasciare il campo `Host` vuoto e inserire `/webtop` all'interno del campo `Path`
8.  ripetere i passaggi da 4 a 7 per tutti gli altri percorsi WebTop:
    - `/Microsoft-Server-ActiveSync`
    - `/.well-known`
    - `/webtop-dav`

## Nextcloud {#config-excluded-migration}

After upgrading to Nextcloud 31, installations originally deployed with Nextcloud 24 or earlier may display a warning in the administration settings about the database row format. In this case the database can be optimized with the database optimization command, more information can be found on the [Nextcloud page](../administrator-manual/applications/nextcloud.md#nextcloud-db-optimize-section).

## Limitations

Lo strumento di migrazione supporta una serie limitata di applicazioni. Se un'applicazione è installata ma non elencata nella pagina degli strumenti di migrazione, non sarà coperta dal processo di migrazione.

The following configurations are not migrated:

- Custom templates
- Account provider password policy settings (see [Account provider](#migrate-account-provider))
- Impostazioni host intelligenti di sistema, se l'applicazione NS7 Email non è installata o non migrata
- L'impostazione `Accetta destinatari sconosciuti` del server di posta, che cattura i messaggi inviati a indirizzi non esistenti. Vedere [Domini](../administrator-manual/applications/mail.md#email_domains) per i dettagli.

The following data is not migrated:

- System logs
- Samba Audit DB
- Shared folders (if NS7 uses a remote account provider)

[^1]: [Passwords must meet complexity requirements](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc786468(v=ws.10)#password-must-meet-complexity-requirements) from *learn.microsoft.com* website.
