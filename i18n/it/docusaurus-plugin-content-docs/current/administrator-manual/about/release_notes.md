---
title: Note di rilascio
sidebar_position: 2
---
# Note di rilascio

Rilasci NethServer 8

- Elenco dei [conosciuti bug](https://github.com/NethServer/dev/issues?q=is%3Aissue%20is%3Aopen%20type%3Abug%20project%3ANethServer%2F8) su GitHub
- Discussione su [possibile bug](http://community.nethserver.org/c/bug) sul nostro forum pubblico

## Major changes on 2026-03-27

**Milestone 8.8**

- **Low-contrast UI notification** \[Core 3.18\] -- The cluster-admin UI notification style is now low-contrast, as mandated by the Carbon Design System guidelines.

- **Cancelable backup runs** \[Core 3.18\] -- It is now possible to cancel a backup run, provided it was started from cluster-admin UI.

- **Import backup destinations and UI adjustments** \[Core 3.18\] -- In the `Backup and restore` page, separate sections and clear text labels improve navigation across the different actions.

  Configuring a backup destination is a prerequisite for application restoration. A new **Import destinations** action quickly sets up a backup destination starting from a cluster backup file. The backup encryption password is required to complete the action.

- **Debian 13 (Trixie)** \[Core 3.17\] -- Installation of NethServer 8 is now available on Debian 13 (Trixie). Starting from the next milestone 8.9, Debian 12 will no longer be compatible with the NS8 installer. This is a summary of the commands required to upgrade an NS8 node from Debian 12.

  Check the distro name and version:

      cat /etc/os-release

  Make sure the node is running on Debian 12, then fix APT references and upgrade the system:

      sed -i 's/bookworm/trixie/' /etc/apt/sources.list /etc/apt/sources.list.d/*
      apt update && apt full-upgrade -y

  If asked, restart services and keep local config file versions.

  Upgrade NS8 Python 3 virtual environment:

      (
        set -e -x
        core_dir=/usr/local/agent/pyenv
        mv -v ${core_dir} ${core_dir}.bak
        python3.13 -mvenv ${core_dir} --upgrade-deps --system-site-packages
        ${core_dir}/bin/pip3 install -r /etc/nethserver/pyreq3_13.txt
        echo "/usr/local/agent/pypkg" >$(${core_dir}/bin/python3 -c "import sys; print(sys.path[-1] + '/pypkg.pth')")
        rm -rf ${core_dir}.bak
      )
      runagent python3 --version # output should be 3.13.5

  Upgrade APT sources to deb822 (optional):

      apt modernize-sources

  Finally, reboot the node. Repeat the same procedure on every node of the cluster.

- **Additional volume selection** \[Core 3.17\] -- When an application is restored, cloned, or installed for the first time, the UI may ask to select the volume for the data. The selection is available on nodes with an additional volume and for applications that support it. See [Install applications](../installation/software_center.md#install-applications).

- **Samba TLS certificates** \[Samba 3.4.2\] -- Samba LDAP is integrated with the `TLS certificates` page. An uploaded or obtained certificate, matching Samba's FQDN, is used for the LDAP service.

- **RustFS replaces MinIO** \[RustFS 1.0\] -- A new S3-compatible application replaces MinIO in the Software Center. Existing MinIO installations are advised to migrate to RustFS. See [RustFS](../applications/rustfs.md) for more information.

- **Application upgrades** -- Mattermost 10.11 ESR, Ejabberd 26.02.

## Major changes on 2025-12-17

**Milestone 8.7**

- **Import/export data** \[Core 3.16\] -- Users and groups can be imported/exported with a file in CSV format, containing username, password, groups and other details. The import/export procedure can be executed also from cluster-admin and user portal APIs. Refer to [Import and export data](../installation/user_domains.md#import-export-data-section) for more information.
- **Firewalld rich rules** \[Core 3.16\] -- Application developers can configure arbitrary Firewalld rich rules to cover complex network routing use cases.
- **Applications page** \[Core 3.15\] -- A new [Applications page](../installation/modules.md) was added to quickly gather information about applications installed in the cluster, their installation node, type, version and links to act on them.
- **Nodes page** \[Core 3.14\] -- The [Nodes page](../configuration/cluster.md#node-views) was streamlined to make it easier to identify cluster nodes also by FQDN, while resource usage metrics were moved into the node detailed view, along with node alerts and links to detailed IP addresses and applications. If an NS7 migration is in progress, the NS7 system is displayed as a special node.
- **Additional disks management** \[Core 3.14\] -- Added support for [assigning Podman named volumes to additional disks](../../tutorial/disk_usage.md#named-volume-disk). Administrators can now preconfigure the base path used when creating named volumes for rootless applications. This allows redirecting application data to alternative disks, improving storage organization and reducing pressure on the system disk. This feature is especially useful for data-intensive applications such as the Samba File Server. A new command, `volumectl`, provides the ability to list available base paths, assign volumes to a selected disk, and remove existing assignments. The configuration is applied when applications are installed, restored, or cloned; relocation of existing volumes is not supported yet. A future update will extend this functionality to the cluster-admin UI, allowing disk selection during application installation, clone, and restore operations.
- **Boot load shaping** \[Core 3.14\] -- The system load at boot time is dynamically optimized based on the number of available processors. The load is distributed in a sequential way over a longer time span, reducing application concurrency and preventing resource bottlenecks.
- **Reduced Audit trail size** \[Core 3.14\] -- The event types stored in the [Audit log](../configuration/cluster.md#audit-trail-section) have been reduced to limit the volume of api-server writes. Only `create-tasks` and `login-ok` (successful logins) events are stored. Note that failed login events are still logged.
- **Limited agent worker processes** \[Core 3.12\] -- The default number of simultaneous processes spawned by agents is now limited to 32. Subsequent tasks are rejected with *Agent is busy* until the number of running processes falls below the limit.
- **Cloud Log Manager (CLM) login records** \[Core 3.12\] -- Cluster-admin login events are marked with *security* category and sent to [Cloud Log Manager](../configuration/log_server.md#clm-section), if enabled.
- **Samba \[homes\] customization** \[3.2.0\] -- The Samba core application supports `[homes]` section customization in the `include.conf` file, consistent with other sections.
- **Piler update** \[1.1.0\] -- Piler has been updated to upstream version 1.4.8, providing new features, performance improvements, and many bug and security fixes.
- **Nextcloud 32 / HUB 25 Autumn** \[1.6.0\] -- Updated to the latest major Nextcloud release.

## Major changes on 2025-09-30

**Milestone 8.6**

- **Default password expiration age change** -- Both Samba AD and OpenLDAP user domains are now created with a default password age between 0 and 180 days. These settings can be adjusted after domain creation. See [Password policy](../installation/user_domains.md#password-policy-section) for details. The previous default policy for Samba AD was between 1 and 42 days.
- **Samba AD password attributes** -- For internal AD domains, two new attributes can be controlled from the cluster-admin and user portal web interfaces: `Required password change` and `Password never expires`. See [User and groups](../installation/user_domains.md#user_groups-section).
- **New TLS certificates page** -- The [TLS certificates](../configuration/certificates.md) UI page has completed its enhancement cycle started in previous releases, providing full management of Let's Encrypt certificates with clear validation and deletion procedures.
- **Expiring TLS certificate alert** -- An automated alert message is sent when a TLS certificate is due to expire within 28 days. See [Metrics and alerts](../configuration/metrics.md) to configure alerts.
- **Application restart action** -- An application instance can now be fully restarted from the [Software Center page](../installation/software_center.md#application-instances). The effect is similar to a node reboot but limited to the application: all its components are completely stopped and then started again.
- **Disabled application UI during migration** -- The cluster admin UI of an application is disabled while migration is in progress. This is a safety measure to prevent accidental actions that could disrupt the migration process.
- **Reduced CrowdSec email notifications** -- The notification volume has been reduced to one daily message containing a summary of CrowdSec ban decisions. If the number of decisions exceeds a given threshold (500 by default), the notification is sent immediately. The notification sender can now be customized to improve message quality and better pass anti-spam filters. The message body also features an enhanced layout and style.
- **Cluster configuration backup on my.nethserver.com** -- The cluster configuration backup of systems with an active *my.nethserver.com* subscription is checked, encrypted, and uploaded every night to the cloud. It can be downloaded with the following procedure.
  1.  Obtain the cluster **System ID** and **Secret** from my.nethserver.com.

  2.  List the available cloud backups:

          curl -u SYSTEM_ID:SECRET https://backupd.nethesis.it/community/api/v2/backup/ | jq

      Example output:

          {
            "backups": [
              {
                "id": "7791926e6cee5455e06eb59e645737ae6a4b542a4f6014a213cb00648789b043.gpg",
                "name": "7791926e6cee5455e06eb59e645737ae6a4b542a4f6014a213cb00648789b043.gpg",
                "created": 1756213506,
                "size": 755,
                "mimetype": "application/pgp-encrypted"
              }
            ]
          }

  3.  Note the backup `id` value and download it:

          curl -f -O -u SYSTEM_ID:SECRET https://backupd.nethesis.it/community/api/v2/backup/7791926e6cee5455e06eb59e645737ae6a4b542a4f6014a213cb00648789b043.gpg
- **Nextcloud DB optimizer** -- After NS7 migration or other major updates, Nextcloud may require manual database fixes that cannot be automated during the upgrade, as these operations may take a long time with large datasets. In such cases, the `nextcloud-db-optimize` command can be run manually to optimize the Nextcloud database outside production hours. Refer to [Database optimization command](../applications/nextcloud.md#nextcloud-db-optimize-section).
- **WebTop updates** -- WebTop 5.29.2 (app version 1.4.4) introduces a refreshed user interface with streamlined layouts, new quick-access buttons, and updated icons. Key new features include delayed email sending, with the ability to cancel before delivery, and automatic IMAP/SMTP configuration for easier setup on mobile devices (see [Automatic configuration of email clients](../applications/webtop.md#email_autoconfig)). The update also brings numerous usability improvements, bug fixes, and security enhancements.
- **NethVoice updates** -- NethVoice 1.4.0 introduces real-time JPG video streaming for intercoms, with previews directly in call notifications and Phone Island. The release also delivers an improved operator panel design, enhanced dashboard accessibility, and better SRTP handling in NethVoice Proxy. Numerous fixes improve reliability and usability across CTI, VoIP trunks, conferencing, voicemail, and call transfers.
- **Other application updates** -- Several applications were updated to include the latest upstream changes. This is a brief list from the Default repository:
  - Mattermost 10.5.11 ESR
  - Ejabberd 25.07
  - Nextcloud 31.0.7
  - CrowdSec 1.16.11

## Major changes on 2025-07-08

**Milestone 8.5** -- Dedicated to the memory of [Andy Wismer](https://community.nethserver.org/t/in-memory-of-andy-wismer/25698)

- **Worker node version check** -- A safety check has been added when a new worker node joins the cluster: its core version is now compared with that of the leader node to ensure compatibility. Before joining the cluster, always update the cluster core and ensure the latest core version is used on new worker nodes.

- **Hetzner S3 backup support** -- Added support for configuring Hetzner S3 as a custom backup destination. Also fixed a bug that prevented renaming custom S3 backup destinations.

- **Samba domain member role and new features** -- The core Samba application can now be installed from the Software Center and configured as an Active Directory domain member, providing shared folders in a domain File Server role. See [Samba file server](../applications/file_server.md).

  It is now possible to assign an alias name to Samba using the File Server user interface (see [File server alias](../applications/file_server.md#file-server-alias)). This feature helps simplify the migration of existing SMB file servers to the NS8 Samba application.

  The **WSDD service** has been added to make the Samba file server discoverable in the local network neighborhood using a modern multicast protocol that replaces the legacy NetBIOS name resolution.

  Samba shared folders now offer three new advanced features: Recycle bin, audit logging with a centralized Grafana dashboard, and folder visibility control. For more information, refer to [Shared folders](../applications/file_server.md#shared-folders-section).

- **Metrics Settings** -- A new "Metrics" section has been added under the cluster settings page, allowing configuration of the Grafana web interface and cluster alert notifications via email. See [Metrics and alerts](../configuration/metrics.md) for details.

- **Promtail replaced by Alloy** -- The Promtail node service, previously used to forward node logs to the central Loki log collector (now upgraded to version 3), has reached EOL and is replaced by **Alloy**, its upstream successor.

- **Mail domain catch-all and other fixes** -- Since version 1.7, the Mail application can deliver messages sent to unknown domain addresses to a special **catch-all** destination—either an individual user or a group— regardless of other domain settings. This resolves a limitation in earlier versions where the `Add user addresses from user domain` setting was incompatible with the catch-all feature.

  A bug affecting sender-based relay rules and remote SMTP server credentials has also been fixed.

  Lastly, a configuration limitation was acknowledged: in the rare case where a user and a group share the same name, incoming messages sent to that name will always be delivered to the group members. See [Domini](../applications/mail.md#email_domains).

- **TLS certificates page enhancements** -- The **Request certificate** procedure now includes a validation check to prevent requesting names already configured as HTTP routes. ACME errors are now displayed as inline notifications during certificate validation before the new configuration is applied.

- **HTTP routes and slash redirect** -- The HTTP routes table under the Settings page now shows the **host and path** under a new **Route** column for better route identification.

  A new **automatic trailing slash redirect** has been added for path-based routes. This benefits applications with web interfaces that do not handle trailing slashes, such as the User portal.

  New installations already include this feature. To enable it on older User portal instances, run a command like:

      api-cli run module/traefik1/set-route --data '{"name":"samba1-amld","slash_redirect":true}'

  Replace `"traefik1"` and `"samba1"` with the actual module identifiers, which can be found in the HTTP routes page. Search for `"amld"` and check the route details.

- **WebTop updates** -- The WebTop application has been updated to the latest upstream version 5.28.6, along with the new PEC Bridge 5.4.8 that features custom notifications.

  Integration with the centralized NethVoice address book has been restored, and the *click2call* feature has been updated to use the `tel:` protocol with NethLink.

  WebTop now supports [Autoconfig and Autodiscovery](../applications/webtop.md#email_autoconfig), simplifying mail account setup on mobile devices.

  Other improvements include:

  - Faster mail search with attachments
  - Improved grouping by discussion
  - Ability to load custom JAR files at startup
  - New login page for OTP and maintenance mode

- **NethVoice 1.3.4** -- New Features and Improvements:

  - Advanced Interface Enhancements: Asterisk CLI and log viewer directly in the UI
  - New Phone Island: Call recording support, Device switching functionality
  - Collaboration Tools: Audio conferencing, Video calling, Screen sharing
  - NethVoice Hotel Module: Integration with hotel systems via FIAS protocol
  - NethVoice CTI Improvements: Updated user interface and graphics, Call pickup functionality, Collapsible side drawer for enhanced usability
  - Streaming Management: Video stream display within NethVoice CTI (e.g., for intercoms)

- **Debian Bookworm missing package** -- Some Debian installations may lack the `gettext-base` package. Ensure it is installed with:

      apt-get update
      apt install gettext-base

- **Other application updates** -- Updated application versions:

  - Nextcloud 31
  - Collabora 25
  - Roundcube 1.6.11
  - SOGo 5.12
  - Mattermost 10.5.5 with PostgreSQL 17.5
  - Netdata 2.4
  - CrowdSec 1.6.8
  - Ejabberd 25.4

## Major changes on 2025-04-04

**Milestone 8.4**

- **Notify users of expiring passwords** -- Internal user domains with an enabled expiring password policy can now be configured to send email notifications to users approaching their password expiration date. See [Password expiration warning](../installation/user_domains.md#password-warning).

- **Modify external LDAP settings** -- Bind credentials and TLS settings of an external user domain can now be changed after domain creation. See [Modify external LDAP settings](../installation/user_domains.md#modify-external-ldap).

- **Set up base home directory path for applications** -- The default application home directory base path is `/home` (per-distro default). It is now possible to specify and use a different base path, as documented in [Utilizzo del disco](../../tutorial/disk_usage.md), along with other techniques to expand available disk space.

- **Wildcard TLS certificate support** -- Wildcard certificates can be uploaded and distributed to cluster applications directly from the `TLS certificates` page. Refer to [Certificati TLS](../configuration/certificates.md) for more information. Mail, NethVoice, and NethVoice Proxy have been updated to support wildcard certificates. Support for Ejabberd is coming soon.

- **New TLS-ALPN-01 default ACME challenge format** -- Let's Encrypt TLS certificates are now obtained using the TLS-ALPN-01 challenge type through TCP port 443. Port 80 is no longer used by new installations of NethServer 8 core. Existing systems retain the previous HTTP-01 challenge type and still require port 80 to be open. It is possible to upgrade to the new default with the following command:

      api-cli run module/traefik1/set-acme-server --data '{"challenge":"TLS-ALPN-01","url":"https://acme-v02.api.letsencrypt.org/directory"}'

- **Traefik core module enhancements** -- The core Traefik instance, running on every cluster node, has been upgraded to Traefik version 3. The previous v2-compatible configuration is saved for reference under the Traefik "state/" directory in `*.v2` directories. These can be safely removed if desired.

  The Traefik restoration procedure has been fixed and no longer returns a conflicting Traefik instance. Instead, the backup contents are merged with the active Traefik instance on the node, allowing the restoration of custom HTTP routes and TLS certificates.

  Additionally, this release introduces two new advanced experimental features, accessible through API calls and manual configuration:

  1.  Support for deploying NS8 behind a network HTTP L7 Proxy.
  2.  Passing extra parameters to the Traefik container to configure custom CA certificates and DNS-01 challenges.

  Refer to available support channels for more information.

- **Per-IP access restrictions on HTTP routes** -- The `HTTP routes` page now allows access restrictions for automatic and manually-created routes based on a list of IP addresses. Additionally, a `cluster-admin` HTTP route entry is now displayed and can be used to restrict access to the Cluster Admin UI. Refer to the [HTTP routes](../configuration/proxy.md) for detailed information.

- **New Monitoring/Alarms stack** -- The Metrics core application, including a running Prometheus instance, is now part of the default core applications and is automatically installed on the leader node of existing clusters with a simple core update. Metrics can be easily integrated with other monitoring solutions and configured to send alert and resolution notifications. Read further details in [Metrics and alerts](../configuration/metrics.md).

- **Migration tool enhancements** -- In addition to "Application conflict management," previously released, the NS7 migration tool now considers application instance conflicts, providing guidance to avoid misconfigurations during migration.

  Furthermore, for NethVoice migration, the NethVoice Proxy installation is now handled automatically by the migration tool.

- **Imapsync and Sieve filters** -- The Imapsync application can now be configured to execute the user's Sieve filter during "INBOX-only" synchronization. Additionally, it can be set to remove messages from the remote server after a specified number of days. See [Imapsync](../applications/imapsync.md) for more details. Recursive synchronization has also been optimized to reduce system load when handling multiple concurrent Imapsync tasks.

- **DNSMasq gateway option** -- The client gateway can now be set from the [DHCP section](../applications/dnsmasq.md#dnsmasq-dhcp-section) of DNSMasq. Additionally, selectable network interfaces are now limited to those with a private IP address to prevent configuration errors.

- **WebTop updates** -- WebTop has been updated to upstream release 5.27.3 with the new Pecbridge component version 5.4.5. The memory limit has been raised to 4GB for better performance. This release also introduces automated TinyMCE Plugin Integration with an active subscription and enhanced contact sharing with the latest NethVoice application release.

- **NethVoice enhancements** -- Version 1.2 introduces new CTI features, including audio conferencing, video calls, screen sharing, and voicemail management. A new permission allows viewing all users in the CTI interface. Device settings now include video options, and the provisioning process has been improved with two-phase support for all methods (HTTPS, DHCP). Additional updates:

  - Support for the new NP-X5 phone model.
  - Improved TLS certificate management and wildcard certificates support.
  - Phone-island updated to version 0.13.0.
  - Logging verbosity reduced in NethVoice Proxy.
  - Fixes for SRTP on Yealink phones (firmware \> 86), REINVITE with TLS on SNOM phones, phone reconfiguration issues, call-back on busy, and CTI interface problems, including user group display and call recording deletion.
  - Resolved an audio issue in CTI caused by an initial misconfiguration of NethVoice Proxy.

- **Other application updates** -- Updated application versions:

  - Nextcloud 29 and Nextcloud 30
  - Collabora 24.04
  - Mattermost 10 ESR
  - Netdata 2
  - CrowdSec 1.6.4
  - Ejabberd 24.12

## Major changes on 2024-12-20

**Milestone 8.3**

- **Selective restoration from backup** -- In the Mail and Samba File Server applications, it is possible to search and select specific content (IMAP folder, file, or directory) from backup snapshots and restore it under a user-accessible folder. See [Selective content restore](../configuration/backup.md#selective-content-restore).

- \*\* Gestione dei conflitti di applicazione \*\* -- Il Cluster Admin ora applica il limite di istanza per nodo durante le operazioni di clone, spostare e ripristinare. Questo integra l'applicazione esistente durante l'operazione di installazione e semplifica la gestione delle applicazioni che utilizzano specifiche porte TCP/UDP, come Mail, Ejabberd, NethVoice Proxy, Samba e DNSMasq. Inoltre, DNSMasq disabilita automaticamente il suo servizio DNS se rileva un conflitto con un'istanza Samba sullo stesso nodo.

- **Filtro in avanti del registro di sistema** -- L'inoltro Syslog può essere configurato per inviare sia l'intero flusso di log che solo i record di registro di sicurezza. Per ragioni di performance, l'esportazione a flusso completo non è più disponibile nell'inoltro Cloud Log Manager, che ora supporta solo i log di sicurezza.

- **Backup alert** -- Systems with an active [Subscription](subscription.md) send an alert to the monitoring portal if a backup fails. The last backup status indicator has been fixed to correctly reflect failed backup instances on the Backup page.

- **Rinominare OpenLDAP "directory.nh" per la migrazione NS7** -- Lo strumento di migrazione NS7 consente di selezionare il nome di dominio di destinazione (e il relativo suffisso LDAP DB), consentendo la migrazione e il consolidamento di più sistemi NS7 sullo stesso cluster NS8. Il nome di dominio LDAP può essere impostato solo con un provider di account OpenLDAP locale, in quanto Active Directory non supporta il rinominazione del dominio. [Account provider](../../tutorial/migration.md#migrate-account-provider).

- **Gli aggiornamenti sono sospesi durante la migrazione NS7** -- Il Software Center inibisce gli aggiornamenti manuali e automatici se un nodo NS7 viene aggiunto al cluster con lo strumento di migrazione. Se gli aggiornamenti sono sospesi, un banner viene visualizzato nel Centro Software.

  Se il cluster visualizza questo banner in modo errato (ad esempio, la migrazione è già terminata), eseguire la seguente procedura manuale per pulire il database Redis di eventuali dati stanti dai tentativi di migrazione precedenti.

  Find the IDs of stale NS7 nodes:

      redis-cli --raw keys 'node/*/flags' | xargs -t -r -l1 -- redis-cli smembers

  Produzione del campione:

  > redis-cli smembers node/77/flags nomodules

  Per esempio, per rimuovere il nodo fasullo 77:

      api-cli run remove-node --data '{"node_id":77}'

- \*\* Domini utente unlimitati\*\* -- A partire da Core 3.2.1 e Ldapproxy 1.1.0, il limite di otto domini utente simultanei è stato rimosso. Ora è possibile installare più domini utente, a condizione che solo un Samba DC possa essere eseguito su un nodo.

- \*\* Gestione degli eventi di dominio utente migliorata in alcune applicazioni\*\* -- Le modifiche alle configurazioni di dominio utente vengono applicate correttamente alle applicazioni Nextcloud, Ejabberd, Mail, SOGo e Roundcube. Le modifiche di configurazione vengono propagate e i servizi vengono riavviati automaticamente.

## Major changes on 2024-10-16

**Milestone 8.2**

- **I requisiti minimi aumentati** -- Il [minimum disk requirements](../installation/system_requirements.md) è stato aumentato a un SSD da 40 GB. Lo storage primario, che contiene immagini dei container, deve essere veloce, soprattutto durante l'accesso a lettura, per evitare errori di avvio del servizio.

- **Cluster node limit rimosso** -- Il limite di cluster a quattro nodi è stato rimosso. Ulteriori nodi possono essere aggiunti, fino alla dimensione della rete VPN. Tuttavia, tenere a mente il carico di sistema aumentato sul nodo leader. Vedi anche [Gestione cluster](../configuration/cluster.md).

- **Progressive upgrades** -- Starting from Core 3.0.0, application images can be labeled with a new attribute, [min-from](https://nethserver.github.io/ns8-core/modules/images/#image-labels). This ensures that installed applications will ignore any updates with this label if their version is lower than the label value.

  Allo stesso modo, un'etichetta [min-core](https://nethserver.github.io/ns8-core/modules/images/#image-labels) può essere applicata alle immagini dell'applicazione, richiedendo una versione di base minima per l'installazione o gli aggiornamenti. Se la versione core è sotto il valore dell'etichetta, l'immagine verrà ignorata.

  Queste etichette sono state sviluppate con Nextcloud in mente, in quanto consente solo aggiornamenti al prossimo numero di versione principale. Gli sviluppatori di applicazioni possono utilizzare queste etichette per implementare aggiornamenti progressivi per le loro applicazioni.

- **Inoltro di registro del cluster** -- La pagina Impostazioni di registro consente ora di configurare un flusso di log in uscita su un server Syslog esterno o su Nethesis Cloud Log Manager (disponibile solo con un piano di abbonamento Enterprise attivo).

  Questa funzione centralizza l'archiviazione di registro esterno per tutti i nodi di cluster. Poiché i flussi di registro possono essere sostanziali in grandi cluster, le versioni future includono un filtro di flusso per aiutare i registri esportati su misura per gli eventi di sicurezza rilevanti. Vedi [Logs forwarding](../configuration/log_server.md#logs-forwarding-section).

- \*\* Livello di certificazione di applicazione\*\* -- Il Software Center ora visualizza un *level badge* per ogni applicazione, indicandone il [certification level](../installation/software_center.md#certification-levels). La sezione dettagli dell'applicazione include anche informazioni sul repository sorgente e link utili. Gli sviluppatori possono ora utilizzare un nuovo attributo `terms_url` nei metadati per fornire un link "Termini e Condizioni", visibile anche dopo l'installazione.

- \*\* Limiti di istanza di applicazione per nodo \*\* -- Il Software Center applica limiti al numero di istanze applicative che possono essere installate per nodo di cluster. Gli sviluppatori possono definire questo limite utilizzando l'etichetta immagine [max-per-node](https://nethserver.github.io/ns8-core/modules/images/#image-labels). Vedi [Install applications](../installation/software_center.md#install-applications).

- **Visualizzazione dei moduli core** -- Il Software Center ora mostra ulteriori dettagli per i componenti core, inclusa la versione core di ogni nodo cluster. Vedi [Core updates](../installation/software_center.md#core_updates-section).

- **Update application to testing version** -- With Core 3.0.0, the `Testing` switch under Settings \> Software Repositories has been removed. This change reduces the risk of using pre-releases for new installations or updates. If the switch was previously enabled, existing NS8 installations will no longer receive pre-release versions as updates.

  Tuttavia, è ancora possibile aggiornare un'istanza di applicazione a una versione di prova dal suo menu a tre punti, selezionando l'azione `Aggiorna alla versione di prova` sotto il centro software \> Indagini installate. Questa nuova procedura consente l'accesso anticipato a nuove funzionalità e correzioni di bug, ma deve essere utilizzato con cautela per evitare la perdita di dati. Assicurati di leggere attentamente la documentazione pre-rilascio o contattare lo sviluppatore dell'app prima di utilizzarla. Vedi [Installed applications](../installation/software_center.md#application-instances).

- **More "generic S3" cloud backup providers** -- The S3 Generic backup destination now supports additional cloud providers, including OVH, Wasabi, DigitalOcean, and Synology C2. See [Backup destination](../configuration/backup.md#backup-destination).

- \*\* Selezione di backup e snapshot\*\* -- Durante il processo di ripristino dell'applicazione, gli utenti possono ora selezionare le istantanee di backup passate generate secondo la politica di conservazione di backup. Vedi [Restore applications](../configuration/backup.md#application_restore-section).

- **TCP and UDP port reallocation** -- Since Core 3.1.0, application developers can leverage new core functions that extend the range of TCP and UDP ports assigned to application instances. Similarly, they can obtain new ranges while preserving existing allocations, easing the introduction of new components during application upgrades. For more information, see [Port allocation](https://nethserver.github.io/ns8-core/modules/port_allocation/) in the Developer's manual.

- **NethVoice application** -- [NethVoice](../applications/nethvoice.md) is a professional IP telephony solution that offers a host of advanced features and an intuitive user interface.

- **WebTop application** -- [WebTop](../applications/webtop.md) now features a new default UI theme, exclusively available on the NS8 platform. Administrators can choose to apply the new theme across existing installations or allow end-users to decide. Additionally, for those on the Enterprise Subscription plan, the [PEC bridge](../applications/webtop.md#pec-bridge) is now available.

- **Nextcloud application** -- Nextcloud version 27 (NC 27), which was the last version available on NethServer 7, has reached End-of-Life (EOL). Although migrations will still install NC 27, an update to NC 28 will be immediately available after migration.

- **Applicazione massima** -- Mattermost è stato aggiornato dalla versione EOL 8 all'ultima versione importante, versione 9.11 (ESR).

## Major changes on 2024-05-31

**Milestone 8.1**

- **Mail improvements** -- Added the [Relay rules](../applications/mail.md#relay-rules-section) feature, which allows configuration and use of a default smarthost for outgoing email messages, and more. A Mail instance can now be selected directly from the [Email notifications](../configuration/email_notifications.md) page to serve as the cluster's default mail gateway for other applications. Since release 1.4 Mail provides also Sender/login correspondence, configurable Queue lifetime, and IP-based relay policy, as described by [Mail settings](../applications/mail.md#mail_settings-section).

- **Applicazione del personale** -- La nuova applicazione Piler migliora le funzionalità Mail con una soluzione di archiviazione e-mail. Vedere [Piler](../applications/piler.md) per ulteriori informazioni.

- **Netdata application** -- A new monitoring stack is available alongside Prometheus and Grafana. A Netdata instance can be installed with a click on a cluster node and immediately starts to collect metrics. See [Dati di rete](../applications/netdata.md) for details.

- **Applicazione Dnsmasq** -- Questa nuova applicazione fornisce un semplice servizio DNS e DHCP per la rete locale. Vedere [DNSMasq](../applications/dnsmasq.md) per i dettagli.

- **Display firewall open ports** -- La configurazione del nodo firewall è accessibile da una nuova scheda nella pagina Impostazioni. Le stesse informazioni sono ancora disponibili dalla pagina Nodes. Vedere [Firewall](../configuration/firewall.md) per ulteriori informazioni.

- **NethSecurity controller** -- This new application allows the remote control of multiple NethSecurity installations, called units. It provides enhanced management and monitoring capabilities for firewall units. Refer to the section [Regolatore di sicurezza](../applications/nethsecurity_controller.md) for more information.

- **Diario di sistema** -- I record di registro generati da qualsiasi nodo di cluster vengono raccolti e memorizzati nel nodo leader per un numero di giorni configurabile. Da Core release 2.7.0, il componente responsabile di questo è automaticamente avviato e configurato quando viene promosso un nuovo nodo leader. Fare riferimento alla sezione [System logs](../configuration/log_server.md) per ulteriori informazioni.

- **CrowdSec bouncer container** -- Since CrowdSec release 1.0.7, the bouncer component runs inside a container and uses Netfilter tables to block IPs. Execute the following commands to clean up some files and resources left by previous versions.

  Eseguire questo comando per rimuovere il ipset Firewalld:

      firewall-cmd --permanent --delete-ipset=crowdsec-blacklists
      firewall-cmd --permanent --delete-ipset=crowdsec6-blacklists

  I pacchetti aggiuntivi e il repository software installato nel sistema host possono anche essere rimossi.

  Per Rocky Linux, eseguire:

      dnf remove -y crowdsec-firewall-bouncer-iptables
      rm -rvf /etc/yum.repos.d/crowdsec_crowdsec.repo /etc/crowdsec /usr/local/sbin/cscli

  Per Debian, eseguire:

  > apt-get -y remove crowdsec-firewall-bouncer-iptables rm -rvf /etc/apt/sources.list.d/crowdsec_crowdsec.list /etc/crowdsec /usr/local/sbin/cscli

- **Rocky Linux 9.4**... Da Core release 2.8.1, le immagini pre-costruite si basano sull'immagine cloud ufficiale Rocky Linux 9.4.

## Principali cambiamenti del 2024-02-13

**Stable release 8.0**

Le nuove funzionalità introdotte in questa release sono:

- **Abbonamento** -- I piani di abbonamento Nethesis Enterprise e Community Subscription sono ora disponibili per NS8. Maggiori dettagli nella pagina [Subscription](subscription.md).

- **Portale di gestione degli utenti** -- I membri del gruppo Domain Admins possono ora creare, modificare ed eliminare gli account utente dal [Portale di gestione utente](../installation/user_domains.md#user-management-portal-section). La schermata di login ora visualizza il nome del dominio dell'utente per distinguere a quale dominio utente si accede.

- **Salta la verifica del certificato** nelle rotte HTTP -- quando viene creata o modificata una rotta HTTP nella pagina [rotte HTTP](../configuration/proxy.md), l'opzione `Salta la verifica del certificato` può essere abilitata per una rete fidata nel caso in cui il server all'URL di destinazione non abbia un certificato TLS valido.

- **Cockpit rimosso dall'immagine pre-built** -- Cockpit non è necessario per NS8, quindi non è più disponibile nell'immagine pre-built di NS8. Se lo si desidera, può essere installato e abilitato manualmente con i seguenti comandi:

      dnf install -y cockpit
      systemctl enable --now cockpit.socket

  La configurazione predefinita di Cockpit proibisce l'accesso a `root`: accedere con un utente membro del gruppo `wheel`, quindi attivare la modalità "accesso amministrativo".

Problemi noti:

- **Core upgrade congela la pagina Software Center** -- Il [bug 6778](https://github.com/NethServer/dev/issues/6778) è stato fissato nella versione core 2.2.6. Se l'aggiornamento da RC1 inizia dalla versione core 2.2.5 o inferiore, quando la barra di avanzamento dell'attività si blocca, ricaricare la pagina web con `CTRL + SHIFT + R` o una procedura equivalente. La ricarica della pagina non ha alcun impatto sull'aggiornamento in corso. Nota: il download dell'aggiornamento può essere lento; evitare di interrompere o riavviare fino al completamento.

## Cambiamenti principali del 2023-11-21

**Release Candidate 1**

Nuove funzionalità introdotte dalla RC1:

- **Policy delle password** -- Aggiunta una nuova opzione di configurazione nella pagina `Domini e utenti`. È possibile modificare la complessità delle password e le politiche di scadenza dei domini Samba e OpenLDAP. Le installazioni Beta 2 con i domini OpenLDAP richiedono di eseguire una procedura manuale per abilitare le password policy. La procedura di aggiornamento è dettagliata nelle note successive. Vedi anche [Password policy](../installation/user_domains.md#password-policy-section).
- **Portale di gestione degli utenti** -- Gli utenti di un dominio possono ora accedere a una pagina web per modificare la propria password. Il portale dell'utente è disponibile all'indirizzo `https://IP_OR_FQDN/users-admin/DOMAIN_NAME/`; un link completo viene visualizzato nella pagina `Domini e utenti`, sotto le impostazioni di configurazione del dominio. Le installazioni Beta 2 richiedono di eseguire una procedura manuale per abilitare il portale utente. Vedere la procedura di aggiornamento per Samba e OpenLDAP nelle note successive, e la pagina: `user-management-portal-section` .
- **Repository backup** -- Oltre ai protocolli cloud esistenti, è ora più facile inviare i backup ad alcuni dispositivi locali. Un repository di backup può ora essere creato in una *share Windows* o in uno *Storage locale*, come un disco attaccato a un nodo di cluster. Vedi [Backup e ripristino](../configuration/backup.md) per maggiori informazioni.
- **Raccolta mail da altri server** -- [Imapsync](../applications/imapsync.md) è una nuova applicazione avanzata progettata per recuperare i messaggi e-mail da server IMAP remoti a intervalli programmati e sincronizzare interi account IMAP.
- **Lista mirror per i nodi Rocky Linux** -- Se Rocky Linux è la distribuzione OS usata in un nodo, la configurazione predefinita DNF viene sovrascritta e i mirror vengono gestiti da `mirrorlist.nethserver.org`. Nelle future versioni i pacchetti RPM di Rocky Linux saranno ospitati da mirror specifici di NethServer.

L'aggiornamento delle installazioni Beta 2 esistenti può essere avviato dalla pagina Software center come al solito. Dopo che i componenti principali sono aggiornati, eseguire le seguenti procedure manuali per completare l'aggiornamento.

- **Procedura di aggiornamento del core** -- Per aggiornare le installazioni Beta 2 eseguire il seguente comando sul nodo leader. Definisce il nuovo ruolo di autorizzazione `tunadm`, disponibile su nuove installazioni dalla versione core 2.1.0:

      redis-cli --raw hvals cluster/module_node | sort -n | uniq | xargs -I NODE_ID -- redis-cli SADD node/NODE_ID/roles/tunadm add-tun remove-tun add-public-service remove-public-service add-custom-zone remove-custom-zone

  Per ogni nodo del cluster, abilitare il servizio WebDAV locale per i backup:

      systemctl enable --now rclone-webdav.service

  Infine, solo per i nodi Rocky Linux, abilitare i repository di default NethServer:

      cp -v /etc/nethserver/nethserver.repo /etc/yum.repos.d/nethserver.repo
      dnf config-manager --save --set-disabled appstream baseos extras

- **Procedura aggiornamento Samba** -- Per aggiornare le installazioni Beta 2 eseguire la procedura seguente per ogni istanza dell'account provider Samba. L'elenco delle istanze può essere ottenuto dalla pagina `Domini e utenti`, sotto le impostazioni di configurazione del dominio; **annotare per ogni provider**:

  - L'ID del modulo (stringa), per esempio `samba1`

  - L'ID del nodo (numero), per esempio `1`

  - il numero di una porta TCP disponibile, generato eseguendo sul nodo leader questo comando:

        node_id=1
        echo $((`redis-cli --raw INCR node/${node_id}/tcp_ports_sequence` - 1))

    Nell'esempio sopra è necessario assegnare a `node_id` il corretto ID del nodo (numero). Supponiamo che il comando stampi il seguente numero di porta:

        20013

  Con le annotazioni recuperate precedentemente, eseguire i seguenti passaggi per ogni provider:

  1.  Accedere al nodo del cluster in cui viene eseguita l'istanza del provider.

  2.  Applicare la configurazione della porta TCP e avviare il servizio del portale utente:

          runagent -m samba1 python3 - 20013 <<'EOF'
          import agent, os, sys
          user_portal_port = sys.argv[1]
          agent.assert_exp(int(user_portal_port) > 0, "ERROR: Bad TCP port argument")
          agent.assert_exp("IPADDRESS" in os.environ, "ERROR: Samba is not configured")
          agent.assert_exp(not "TCP_PORT" in os.environ, "ERROR: TCP_PORT is already set")
          os.environ["TCP_PORT"] = user_portal_port
          agent.set_env("TCP_PORT", user_portal_port)
          os.execl("../actions/configure-module/80start_amld", "80start_amld")
          EOF

- **Procedura di aggiornamento OpenLDAP** -- Per aggiornare le installazioni Beta 2 eseguire la procedura seguente per ogni istanza dell'account provider OpenLDAP. L'elenco delle istanze può essere ottenuto dalla pagina `Domini e utenti`, sotto le impostazioni di configurazione del dominio; **annotare per ogni provider**:

  - L'ID del modulo (stringa), per esempio `openldap1`

  - L'ID del nodo (numero), per esempio `1`

  - il numero di una porta TCP disponibile, generato eseguendo sul nodo leader questo comando:

        node_id=1
        echo $((`redis-cli --raw INCR node/${node_id}/tcp_ports_sequence` - 1))

    Nell'esempio sopra è necessario assegnare a `node_id` il corretto ID del nodo (numero). Supponiamo che il comando stampi il seguente numero di porta:

        20014

  Con le annotazioni recuperate precedentemente, eseguire i seguenti passaggi per ogni provider:

  1.  Accedere al nodo del cluster in cui viene eseguita l'istanza del provider.

  2.  Applicare la configurazione della porta TCP e avviare il servizio del portale utente:

          runagent -m openldap1 python3 - 20014 <<'EOF'
          import agent, os, sys
          user_portal_port = sys.argv[1]
          agent.assert_exp(int(user_portal_port) > 0, "ERROR: Bad TCP port argument")
          agent.assert_exp("LDAP_IPADDR" in os.environ, "ERROR: OpenLDAP is not configured")
          agent.assert_exp(not "," in os.environ["TCP_PORTS"], "ERROR: unexpected TCP_PORTS value")
          os.environ["TCP_PORTS"] = f'{os.environ["TCP_PORT"]},{user_portal_port}'
          agent.set_env("TCP_PORTS", os.environ["TCP_PORTS"])
          os.execl("../actions/configure-module/80start_amld", "80start_amld")
          EOF

  Dopo aver ripetuto i passaggi sopra per ogni nodo del cluster, eseguire i seguenti comandi in un'istanza a scelta (l'esempio è per `openldap1`):

      runagent -m openldap1 podman exec -i openldap ash -c 'envsubst | ldapmodify -c ' <<'EOF'
      dn: olcDatabase={2}mdb,cn=config
      changetype: modify
      delete: olcAccess
      -
      add: olcAccess
      olcAccess: to attrs=userPassword by dn.base="
       gidNumber=101+uidNumber=100,cn=peercred,cn=external,cn=aut
       h" write by set="[cn=domain admins,ou=Groups,${LDAP_SUFFIX}
       ]/memberUid & user/uid" write by self write by * auth
      olcAccess: to * by dn.base="gidNumber=101+uidNumber=100,
       cn=peercred,cn=external,cn=auth" manage by set="[cn=do
       main admins,ou=Groups,${LDAP_SUFFIX}
       ]/memberUid & user/uid" write by * read

      dn: olcOverlay={1}ppolicy,olcDatabase={2}mdb,cn=config
      changetype: modify
      replace: olcPPolicyCheckModule
      olcPPolicyCheckModule: ppcheck.so

      dn: cn=default,ou=PPolicy,${LDAP_SUFFIX}
      changetype: modify
      add: objectClass
      objectClass: pwdPolicyChecker

      dn: cn=default,ou=PPolicy,${LDAP_SUFFIX}
      changetype: modify
      replace: pwdCheckQuality
      pwdCheckQuality: 2
      -
      replace: pwdMinAge
      pwdMinAge: 0
      -
      replace: pwdMaxAge
      pwdMaxAge: 15552000
      -
      replace: pwdMinLength
      pwdMinLength: 8
      -
      replace: pwdInHistory
      pwdInHistory: 12
      -
      replace: pwdLockout
      pwdLockout: FALSE
      -
      replace: pwdUseCheckModule
      pwdUseCheckModule: TRUE
      -
      replace: pwdCheckModuleArg
      pwdCheckModuleArg: default
      -
      replace: pwdExpireWarning
      pwdExpireWarning: 0
      EOF

      runagent -m openldap1 systemctl --user restart openldap

- **Procedura di aggiornamento Mattermost** -- l'aggiornamento di Mattermost deve essere completato manualmente per assegnare e aprire le porte UDP richieste dal plugin Calls. Dalla pagina `Software center`, assicurarsi che la versione di Mattermost sia la `2.0.0`. Clonare quindi l'istanza in esecuzione e, completato il clone, rimuovere la vecchia istanza.

## Principali cambiamenti del 2023-09-13

**Beta 2**

- **Immagine pre-built** -- Le immagini si basano su Rocky Linux. I formati disponibili sono `.qcow2` per QEMU/Proxmox e `.vmdk` per VMware. Fare riferimento a [Immagine pre-built](../installation/install.md#install_image-section) per i link di download dell e immagini.

- **Requisiti FQDN** -- La procedura di creazione del cluster richiede ora di rivedere e impostare il nome host del sistema. Il nome host deve essere fornito in forma breve (una sola parola, senza suffisso di dominio). La procedura richiede anche il suffisso di dominio e manipola il file `/etc/hosts` aggiungendo un record per risolvere correttamente il fully qualified domain name (FQDN). Per esempio:

  > 127.0.1.1 node1.example.org node1

  Vedi anche [Configurazione DNS](../installation/system_requirements.md#dns-reqs).

- **Porta WireGuard 55820** -- La porta UDP utilizzata da WireGuard nella creazione del cluster VPN è ora fissata a `55820`. La configurazione dei cluster già creati con un numero di porta personalizzato dovrà essere corretta manualmente prima di aggiornare il core a Beta 2. Ad esempio, se la porta personalizzata è `55821` eseguire sul nodo leader i seguenti passaggi per risolvere il problema.

  1.  Correggere l'indirizzo di endpoint pubblico VPN in Redis. Ad esempio, se il nodo leader è `1` e il suo FQDN è `node1.example.org`:

          redis-cli hset node/1/vpn endpoint node1.example.org:55820

  2.  Correggere la configurazione del firewall :

          firewall-cmd --permanent --service=ns-wireguard --remove-port=55821/udp
          firewall-cmd --permanent --service=ns-wireguard --add-port=55820/udp
          firewall-cmd --reload

  3.  Modificare la porta di ascolto dell'istanza WireGuard in esecuzione :

          wg set wg0 listen-port 55820

  4.  Rendere le modifiche permanenti, impostando `ListenPort = 55820` nel file `/etc/wireguard/wg0.conf` :

          sed -ir 's/ListenPort.*/ListenPort = 55820/' /etc/wireguard/wg0.conf

  Ripetere i passi da 2 a 4 anche su ogni nodo worker.

- **Aggiornamento Debian** -- Dopo aver eseguito l'aggiornamento del core, le installazioni basate su Debian 11 (Bullseye) devono essere aggiornate manualmente alla versione di distribuzione 12 (Bookworm) :

      rm -f '/etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list'
      sed -i 's/bullseye/bookworm/' /etc/apt/sources.list
      apt update && apt full-upgrade -y

  Seguire le istruzioni per aggiornare Python alla versione 3.11, poi **riavviare il sistema**. Applicare la stessa procedura per ogni nodo del cluster.

- **Python 3.11** -- Dopo aver eseguito l'aggiornamento del core, le installazioni basate su Rocky Linux (e altre distribuzioni EL-like) devono installare manualmente Python 3.11:

      dnf install python3.11

  Debian necessita anche l'esecuzione del seguente script Bash. Non tralasciare le parentesi tonde! :

      (
          set -e -x
          core_dir=/usr/local/agent/pyenv
          mv -v ${core_dir} ${core_dir}.bak
          python3.11 -mvenv ${core_dir} --upgrade-deps --system-site-packages
          ${core_dir}/bin/pip3 install -r /etc/nethserver/pyreq3_11.txt
          echo "/usr/local/agent/pypkg" >$(${core_dir}/bin/python3 -c "import sys; print(sys.path[-1] + '/pypkg.pth')")
          rm -rf ${core_dir}.bak
      )

  Controllare se l'aggiornamento Python ha avuto successo:

      runagent python3 --version # output should be 3.11

  Applicare la stessa procedura per ogni nodo del cluster.

- **Miglioramenti di sicurezza UI** -- Con la versione Beta 1 è stato rilasciato un importante aggiornamento di sicurezza, e altri miglioramenti di sicurezza sono ora disponibili. Dopo aver eseguito l'aggiornamento del core, ricaricare la pagina del browser con `CTRL + Shift + R` o altro metodo equivalente.

- **Logs backend improved** -- The Logs page backend has been improved to be faster and more accurate in capturing the logs of every cluster component. The core module now runs Promtail as a system service. After running the core update, it is safe to uninstall Promtail core modules by running this command on the leader node:

      api-cli run list-installed-modules | jq -r '.["ghcr.io/nethserver/promtail"] | .[].id' | xargs -l remove-module --no-preserve

  Attenzione: la nuova pagina dei log non può accedere alle vecchie voci di registro. Per visualizzare le voci di registro precedenti all'aggiornamento Beta 2, utilizzare il comando `logcli`.

- **Caricamento certificato TLS** -- Il menu `Certificati TLS` nella pagina `Impostazioni` è stato esteso per consentire il caricamento di un certificato e della chiave privata ad esso associata. Si veda la sezione [Certificati TLS](../configuration/certificates.md).

- **Repositori di backup aggiuntivi** -- I repository di backup possono essere creati anche su cloud storage provider compatibili con Microsoft Azure e S3.

- **Nuova configurazione backend Traefik** -- Il cluster Redis DB non viene più utilizzato come backend di configurazione dinamica dalle istanze dei moduli Traefik. La configurazione Traefik è ora interamente memorizzata nella home directory del modulo. Per migliorare le prestazioni Redis è possibile disabilitare una funzione specifica per Traefik con i seguenti comandi:

      podman exec redis sed -i.beta1 '/^notify-keyspace-events / d' /data/etc/redis.conf
      systemctl restart redis

  Applicare la stessa procedura per ogni nodo del cluster.

- **Miglioramenti modulo mail**

  1.  Le nuove installazioni del modulo Mail hanno l'opzione `Shared visto` abilitata per impostazione predefinita. Gli impianti esistenti troveranno l'interruttore disabilitato. Vedi anche la sezione relativa a [impostazioni caselle e-mail](../applications/mail.md#mail-mailboxes-settings).

  2.  Aggiunto a Dovecot il plugin open source *Flatcurve* per abilitare la ricerca full-text (FTS) nei messaggi e-mail. Per ricostruire massicciamente gli indici di ricerca eseguire il seguente comando durante il tempo di inattività del sistema:

          podman exec dovecot sh -c "doveadm index -A -q '*' ; pgrep indexer-worker | xargs -- renice"

      Solo gli allegati PDF e l'e-mail stessa vengono aggiunti all'indice. In futuro saranno supportati più formati di allegati.

## Principali cambiamenti del 2023-05-10

**Beta 1**

Le caratteristiche principali del core includono:

- Gestione dei nodi: aggiunta e rimozione di nodi dal sistema
- Centralizzazione log: raccolta di tutti i log in un unico posto per un monitoraggio semplificato
- Backup configurazione e dati: salva regolarmente le impostazioni del cluster e i dati delle applicazioni in provider remoti come Amazon S3 e Backblaze B2
- Autenticazione: supporto per le directory utente Active Directory e LDAP (RFC2307)
- File server: implementazione di un file server SMB (Server Message Block) che consente l'integrazione senza soluzione di continuità con le reti basate su Windows
- Auditing: tracciatura delle modifiche apportate all'interno del sistema per garantire sicurezza e responsabilità
- Relay e-mail: utilizzo di uno smart host per l'invio delle e-mail in uscita tramite un server affidabile
- Web routing personalizzato: definire URL personalizzati per gestire richieste specifiche
- Autenticazione multifattore: abilitare la verifica a due fasi per gli account amministratore
- Firewall integrato: proteggere dall'accesso non autorizzato a livello di rete implementando un firewall locale
- Migrazione: [Modulo Cockpit](../../tutorial/migration.md) per importare applicazioni da NethServer 7

Moduli aggiuntivi:

- Strumenti di collaborazione: include mail server con Dovecot/Postfix/Rspamd, WebTop, Roundcubemail, Nextcloud, Collabora Online, Dokuwiki, ejabberd, Mattermost
- Utility di sviluppo: funzionalità MariaDB e web server NGINX per la creazione di applicazioni e servizi dinamici
- Monitoraggio e analisi: offre Grafana, Prometheus e node_exporter per il monitoraggio delle metriche delle prestazioni e l'individuazione di potenziali problemi
- Memorizzazione dati: offre MinIO per la gestione di grandi quantità di dati strutturati e non strutturati
- Protezione di rete: implementa CrowdSec per proteggere le applicazioni locali da attacchi remoti

Le seguenti limitazioni note saranno risolte negli aggiornamenti futuri:

- attualmente, il sistema è in grado di utilizzare solo certificati TLS rilasciati da Let's Encrypt o certificati auto-firmati generati localmente
- il login utente non è supportato su nodi worker
- il modulo di posta non offre opzioni di relay dei messaggi basati sul mittente o sulla destinazione
- solo un numero limitato di cloud storage provider sono disponibili per il backup dei dati

## Glossario rilasci {#releases-glossary}

Il ciclo di rilascio del software comprende quattro fasi: Alpha, Beta, Release Candidate (RC), e Stable.

Durante la fase **Alpha**, il software non è completamente testato e non può includere tutte le funzionalità pianificate. Questa versione non è adatta per ambienti di produzione. Tuttavia, può essere utilizzata per provare in anteprima ciò che sarà rilasciato nella successiva versione. Gli aggiornamenti da un rilascio Alpha ad altre versioni non sono supportati.

La fase **Beta** indica che il software è per lo più completo, ma può ancora contenere diversi bug noti e sconosciuti. Questa versione non dovrebbe essere utilizzata negli ambienti di produzione. Tuttavia, può essere utilizzata per testare il software prima di distribuirlo in produzione. Gli aggiornamenti da un rilascio Beta a un rilascio RC o stabile sono supportati ma possono richiedere una procedura manuale.

Durante la fase **Release Candidate (RC)**, il software è completo e non contiene bug noti. Se non si presentano grandi problemi, può essere promosso a Stable. Gli aggiornamenti da un rilascio RC a un rilascio stabile sono supportati e dovrebbero essere pressoché automatici. Tuttavia è meglio utilizzarlo in produzione solo se hai già esperienza con il software.

Il rilascio **Stable** è il più affidabile e sicuro da utilizzare in ambienti di produzione. È stato accuratamente testato ed è considerato privo di gravi bug.
