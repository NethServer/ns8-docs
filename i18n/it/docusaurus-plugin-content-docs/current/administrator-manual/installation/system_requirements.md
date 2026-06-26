---
title: Requisiti di sistema
sidebar_position: 1
---
# Requisiti di sistema

NethServer 8 (NS8) può essere distribuito su un singolo nodo o su più nodi. In entrambi i casi viene chiamato "cluster". Un nodo può essere una macchina fisica o virtuale. La distribuzione su soluzioni di virtualizzazione basate su container, come Proxmox LXC, non è supportata.

Requisiti hardware minimi per un'installazione su singolo nodo:

- 2 vCPU/core, architettura x86-64
- 2GB RAM
- 40GB unità a stato solido (SSD)

I requisiti sopra indicati devono essere aumentati per soddisfare le esigenze di utenti, applicazioni e carico.

È possibile aggiungere più nodi successivamente e, quando si aggiunge un nuovo nodo, si raccomanda di utilizzare hardware simile e la stessa distribuzione Linux installata sugli altri nodi, come spiegato nella sezione seguente.

## Distribuzione Linux {#supported-distros-section}

Installare NS8 su una distribuzione Linux server pulita, evitando l'installazione su sistemi desktop o server che eseguono già altri servizi. Se è necessario installare software non fornito da NS8 o dalle sue applicazioni, come uno strumento di monitoraggio o un agente di log o backup, preparare prima un'installazione di test con le applicazioni NS8 richieste e verificare che non vi siano conflitti di porte o risorse. NS8 riserva le porte nell'intervallo `20000-45000` per le applicazioni e le assegna dinamicamente. È possibile utilizzare porte al di sotto di `20000` per software aggiuntivo solo dopo aver verificato che le applicazioni installate non le richiedano già.

NS8 è compatibile con [Rocky Linux](https://rockylinux.org/) 9 e distribuzioni derivate da RHEL 9, come AlmaLinux o CentOS Stream 9, così come con [Debian](https://www.debian.org/) 13.

Mescolare distribuzioni o versioni di distribuzioni diverse tra i nodi del cluster è consentito temporaneamente — ad esempio durante la migrazione a una nuova distribuzione o l'aggiornamento a una nuova major release — ma le discrepanze a lungo termine possono causare problemi di aggiornamento imprevedibili a causa dei diversi cicli di rilascio e devono essere evitate.

* Puoi trovare supporto volontario nel forum pubblico della comunità NethServer per tutte le distribuzioni compatibili.

* La [Sottoscrizione Nethesis](../about/subscription.md#subscription-section) (incluso il piano "Enterprise") è disponibile solo per **Rocky Linux 9**.

Leggi la sezione [Aggiornamenti del sistema operativo](../../tutorial/os_updates.md#neth-mirror) per mantenere aggiornata la distribuzione Linux e per saperne di più sui repository DNF gestiti da Nethesis, che sono abilitati di default su Rocky Linux.

## Spazio di swap {#swap-reqs}

Configura una partizione di swap o un file di swap. Nella maggior parte degli ambienti, [4 GB di spazio di swap](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_storage_devices/getting-started-with-swap_managing-storage-devices#recommended-system-swap-space_getting-started-with-swap) offrono un buon equilibrio tra prestazioni e utilizzo delle risorse. La decisione di allocare più spazio dipende dal carico di lavoro della memoria del sistema.

L'[immagine preconfigurata di Rocky Linux](../installation/install.md#install_image-section) fornisce già un file di swap da 4 GB configurato come predefinito.

## Disco e partizioni {#disk-partitions}

Le prestazioni del disco dipendono dal carico del sistema, ma l'architettura di NS8 genera un elevato carico I/O grazie al suo design basato su container. Il disco principale deve essere abbastanza veloce da sostenerlo: usa un'unità a stato solido (SSD) di classe enterprise. Un sintomo tipico di un disco sottovalutato è il timeout nell'avvio dei servizi.

NS8 non ha requisiti speciali di partizionamento. L'[immagine preconfigurata](../installation/install.md#install_image-section) viene fornita con una singola partizione root che copre tutti i dati. Se lo desideri, `/home` può essere montata su un disco separato con gli stessi requisiti di velocità: per impostazione predefinita i dati delle applicazioni vengono salvati lì, quindi una partizione `/home` dedicata separa i dati dell'applicazione dal sistema operativo. È anche possibile aggiungere in un secondo momento un percorso home alternativo, come descritto in [Collegare un disco per le nuove applicazioni](../../tutorial/disk_usage.md#alt-home-section).

Le applicazioni che archiviano grandi quantità di dati possono essere configurate per usare un volume aggiuntivo come descritto in [Configurare volumi aggiuntivi](software_center.md#additional-volumes-section). Per i volumi aggiuntivi, i dischi meccanici e i dispositivi iSCSI sono scelte appropriate.

I filesystem locali supportati sono XFS ed EXT4. Anche iSCSI e i dispositivi di rete a blocchi equivalenti sono adatti, perché si presentano come dispositivi a blocchi che possono essere formattati localmente. NFS non è supportato: gestisce il filesystem in remoto e non gestisce il mapping degli ID utente richiesto dalle applicazioni containerizzate.

## Indirizzo IP statico {#static-ip-reqs}

È necessaria una connessione internet funzionante per l'installazione, la configurazione e l'aggiornamento del nodo. È richiesta anche in presenza di un [abbonamento](../about/subscription.md) attivo.

Assegna un indirizzo IP statico al nodo. DHCP e qualsiasi altro protocollo di rilevamento IP dinamico non sono consentiti.

## Risoluzione dei nomi {#resolv-conf}

Il risolutore dei nomi del nodo deve essere configurato per utilizzare server DNS che non siano forniti direttamente da NS8. Questo è necessario perché il file `/etc/resolv.conf` viene ereditato dai container delle applicazioni, i quali potrebbero utilizzare configurazioni di rete private che possono entrare in conflitto con il servizio DNS del nodo stesso.

Il file `/etc/resolv.conf` dovrebbe contenere una o più righe `nameserver` che specificano gli indirizzi IP dei server DNS disponibili per il nodo. Questi server possono trovarsi nella stessa LAN o su Internet pubblico. Se il file è gestito da strumenti come `NetworkManager` o `cloud-init`, non modificarlo direttamente. Segui invece le linee guida di configurazione fornite da tali strumenti.

Evitare le seguenti configurazioni:

- Non utilizzare `nameserver 127.0.0.1` o qualsiasi indirizzo IP assegnato al nodo stesso. Se la distribuzione Linux ha installato un servizio di risoluzione DNS locale, fare riferimento alla sua documentazione per disabilitarlo o rimuoverlo.
- Non utilizzare alcuna applicazione NS8 che fornisca un servizio DNS come risolutore dei nomi del nodo, ad esempio Samba Active Directory o DNSMasq. Questo potrebbe causare loop nella risoluzione dei nomi o impedire gli aggiornamenti del nodo.
- Non mescolare server DNS appartenenti a ambiti di rete diversi, ad esempio, `1.1.1.1` (pubblico, Cloudflare) e `192.168.1.1` (privato). Questo potrebbe portare a risultati incoerenti nelle query DNS.

## Configurazione DNS {#dns-reqs}

Per garantire che i client di rete possano connettersi al nodo, il suo fully qualified domain name (FQDN) deve risolversi in un indirizzo IP instradabile tramite DNS. Registra l'FQDN con un record DNS di tipo A per gli indirizzi IPv4 e di tipo AAAA per gli indirizzi IPv6.

Una configurazione corretta di FQDN e DNS è essenziale affinché la crittografia TLS funzioni correttamente. Una volta connessi al nodo, i client di rete verificano il certificato TLS rispetto all'FQDN fornito.

Per soddisfare questi requisiti, segui questi passaggi:

1.  **Determina il tuo provider DNS**: In base allo scopo del tuo nodo, il DNS può essere fornito da un servizio internet pubblico, da un dispositivo di rete privato o da una combinazione di entrambi. Consulta e comprendi la documentazione del provider DNS scelto.
2.  **Registra l'FQDN**: Scegli l'FQDN per il tuo nodo e registralo nel DNS con il suo indirizzo IP pubblico. Un FQDN è composto da un prefisso hostname (una singola parola) e un suffisso di dominio DNS. Ad esempio, se l'hostname è `jupiter` e il suffisso di dominio è `example.org`, l'FQDN risultante sarà `jupiter.example.org`.

## Requisiti del nodo worker {#worker-node-reqs}

Un nodo worker ha requisiti specifici per l'installazione e la configurazione.

Durante la procedura di join, il nodo worker si connette al leader al seguente URL:

    https://<leader_fqdn>/cluster-admin/

Stabilisce inoltre una connessione VPN WireGuard con il leader utilizzando la porta UDP predefinita 55820.

Assicurarsi che siano soddisfatti i seguenti requisiti:

1.  Il nodo worker deve risolvere l'FQDN del leader all'indirizzo raggiungibile corretto.
2.  Il server HTTPS (porta TCP 443) a quell'indirizzo deve gestire la richiesta API.
3.  La porta UDP della VPN (predefinita 55820) non deve essere bloccata da alcun dispositivo di rete.

## Requisiti del servizio SSH {#ssh-service-reqs}

Un servizio SSH in esecuzione non è strettamente richiesto da NS8, a meno che non sia attivo un [abbonamento](../about/subscription.md). In tal caso, `sshd` deve essere in ascolto sulla porta TCP standard 22 per integrarsi correttamente con il servizio di supporto remoto.

Se desideri modificare la porta pubblica SSH, configura un reindirizzamento di porta senza alterare la configurazione della porta di ascolto di `sshd`. Consulta [Gestire il reindirizzamento della porta SSH](../configuration/firewall.md#ssh-redirection) per le istruzioni.

## Connettività di rete esterna {#external-services}

Un nodo NethServer 8 (NS8) richiede connettività di rete in uscita verso una serie di servizi esterni per funzionare correttamente. Questi servizi sono utilizzati per aggiornamenti di sistema, distribuzione delle applicazioni, operazioni del cluster, gestione degli abbonamenti, backup, supporto e rilascio di certificati TLS.

Salvo diversa indicazione, le connessioni sono solo in uscita e utilizzano HTTPS sulla porta TCP 443.

| Scopo | Nome host | Porta | Protocollo | Note |
|----|----|----|----|----|
| Risoluzione dei nomi | \<Indirizzo del server dei nomi\> | 53 | UDP/TCP | Indirizzo IP del server DNS primario e, opzionalmente, secondario |
| VPN del cluster e comunicazione tra nodi | \<Indirizzo del nodo leader\> | 55820 | UDP | Traffico VPN tra nodi e del cluster |
| API del leader amministratore del cluster | \<Indirizzo del nodo leader\> | 443 | HTTPS | Aggiunta di un nuovo worker al cluster |
| Risoluzione dei mirror dei repository OS e NS8 | mirrorlist.nethserver.org | 80 | HTTP | Utilizzato per risolvere i mirror di Rocky Linux e NS8 |
| Repository DNF di Rocky Linux | u4.nethesis.it, u5.nethesis.it | 443 | HTTPS | Mirror gestito da Nethesis dei repository BaseOS e AppStream |
| Rilascio dei certificati TLS | acme-v02.api.letsencrypt.org | 443 | HTTPS | Endpoint ACME v2 di Let's Encrypt |
| Repository core e aggiornamenti di NS8 | distfeed.nethserver.org | 443 | HTTPS | Aggiornamenti e patch del core |
| Repository delle applicazioni della community | forge.nethserver.org | 443 | HTTPS | Moduli opzionali della community |
| Registro delle immagini dei container | ghcr.io | 443 | HTTPS | Immagini ufficiali delle applicazioni e dei container di NS8 |
| Registro delle immagini dei container | docker.io | 443 | HTTPS | Immagini di container di terze parti |
| Registro delle immagini dei container | quay.io | 443 | HTTPS | Immagini di container di terze parti |
| Servizio di phone-home del cluster | phonehome.nethserver.org | 443 | HTTPS | Registrazione del cluster e metadati |

Servizi ed endpoint esterni richiesti da NS8

| Scopo | Nome host | Porta | Protocollo | Note |
|----|----|----|----|----|
| Validazione abbonamenti e feed | subscription.nethserver.com | 443 | HTTPS | Aggiornamenti e patch del core per l'abbonamento |
| Portale abbonamenti | my.nethserver.com | 443 | HTTPS | Gestione del sistema e degli abbonamenti |
| Portale abbonamenti per rivenditori | my.nethesis.it | 443 | HTTPS | Inventario, heartbeat, controlli delle autorizzazioni |
| Peer VPN di supporto | sos.nethesis.it | 1194 | UDP | VPN di supporto remoto (opzionale) |
| Peer VPN di supporto | sos.nethesis.it | 443 | TCP | VPN di supporto remoto (opzionale) |
| Servizio di backup cloud | backupd.nethesis.it | 443 | HTTPS | Backup e ripristino off-site per la configurazione del cluster |
| Cloud Log Manager | nar.nethesis.it | 443 | HTTPS | Archiviazione e gestione cloud per i log di sicurezza (opzionale) |

Endpoint utilizzati dal nodo leader del cluster con un abbonamento attivo

Note

- Tutte le connessioni elencate sono avviate dal nodo NS8.
- Bloccare l'accesso a questi servizi può impedire aggiornamenti, installazione di applicazioni, backup, formazione del cluster o validazione degli abbonamenti.
- Potrebbero essere necessarie connessioni in uscita aggiuntive per funzionalità specifiche, come le notifiche email e i percorsi HTTP, e per le applicazioni installate, a seconda della loro configurazione e dei servizi upstream.

## Requisiti del browser web

Per accedere all'interfaccia web di amministrazione del cluster, è necessario disporre di una versione aggiornata del browser Firefox, Chrome o Chromium come client web.