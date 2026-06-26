---
title: Installazione
sidebar_position: 2
---
# Installazione

Innanzitutto, assicurati che i [Requisiti di sistema](system_requirements.md) siano soddisfatti.

Puoi installare NethServer 8 su una distribuzione supportata oppure utilizzare un'immagine pre-costruita. Entrambi i metodi richiedono una connessione Internet attiva.
## Procedura standard {#install_linux-section}

Scegli la tua distribuzione Linux preferita tra quelle [supportate](system_requirements.md#supported-distros-section).

Avvia la procedura di installazione come `root`:

    curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash

Se il comando `curl` non è disponibile, prova a installarlo con:

    apt install curl || dnf install curl

Lo script di installazione applica anche gli aggiornamenti di sicurezza più recenti della distribuzione. Riavvia il sistema al termine dell'installazione.
## Immagine preconfigurata {#install_image-section}

L'immagine della macchina virtuale preconfigurata si basa su Rocky Linux 9 e viene fornita preconfigurata con i pacchetti e i componenti principali di NS8 installati tramite la procedura di installazione standard. Utilizza Cloud-init per l'inizializzazione della rete. Consulta la documentazione della tua piattaforma di virtualizzazione per ulteriori informazioni sul supporto di Cloud-init.

| Piattaforma | Formato | Dimensione | URL |
|----|----|----|----|
| [Proxmox](https://www.proxmox.com) (QEMU) | qcow2 | 1,7   GB | <https://tinyurl.com/ns8-rocky-qcow2> |
| [VMWare](https://www.vmware.com) ESXi 8+ | vmdk | 3,5   GB | <https://tinyurl.com/ns8-rocky-vmdk> |

Link per il download dell'immagine NS8

Se la tua piattaforma non è inclusa nell'elenco sopra, l'immagine preconfigurata non può essere utilizzata. Consulta la [Procedura standard](#install_linux-section).

Dopo aver completato il download dell'immagine, verifica l'integrità del file utilizzando il [file checksum sha256](https://distfeed.nethserver.org/ns8-images/CHECKSUM). Scarica il checksum e poi esegui, ad esempio, il seguente comando:

    sha256sum --ignore-missing -c CHECKSUM

Note specifiche per le piattaforme di virtualizzazione:

- Per VMWare ESXi 8+, aggiungi un disco rigido con immagine esistente e seleziona *IDE controller 1 (Master)*.
- Su Proxmox, per ottenere prestazioni massime, seleziona `host` come tipo di CPU. Evita "kvm64", poiché l'immagine Rocky Linux non lo supporta. Consulta la [documentazione di Proxmox](https://pve.proxmox.com/pve-docs/chapter-qm.html#qm_cpu) per ulteriori dettagli sulla selezione della CPU.

Avvia l'immagine NS8 all'interno della tua piattaforma di virtualizzazione. Se Cloud-init non trova una configurazione di rete, tenterà di ottenerne una tramite DHCP. Dopo alcuni secondi, la console di sistema mostrerà un prompt di accesso con l'indirizzo IP assegnato.

Le credenziali amministrative predefinite del sistema operativo sono:

- Nome utente: `root`
- Password: `Nethesis,1234`

Accedi utilizzando le credenziali predefinite. Al primo accesso, ti verrà richiesto di cambiare la password di root.

L'accesso SSH per root è disabilitato. Per ottenere l'accesso amministrativo SSH, crea un account utente personale nel gruppo `wheel` e imposta una password. Ad esempio, esegui i seguenti comandi e inserisci la password desiderata:

    useradd -G wheel ethan.smith
    passwd ethan.smith

Dopo aver effettuato l'accesso con l'account utente personale, ottieni l'accesso root eseguendo:

    sudo su -

Infine, applica gli ultimi aggiornamenti di sicurezza della distribuzione e riavvia il sistema:

    dnf --refresh update -y
    reboot

:::warning

Se DHCP è stato utilizzato per ottenere la configurazione di rete iniziale, modifica le impostazioni di rete di Rocky Linux e configura un indirizzo IP statico. Per ulteriori informazioni, consulta [Configurazione della rete del nodo](../../tutorial/os_network.md).

:::
## Passaggi post-installazione {#post-install-steps}

Quando lo script di installazione si completa o l'immagine preconfigurata è stata avviata, accedi all'interfaccia utente Web all'indirizzo:

    https://<server_ip_or_fqdn>/cluster-admin/

:::tip

Se il nodo non è raggiungibile, consulta [Configurazione della rete del nodo](../../tutorial/os_network.md).

:::

Le credenziali predefinite per accedere all'interfaccia cluster-admin sono:

- Nome utente: `admin`
- Password: `Nethesis,1234`

Seleziona **Crea cluster** e segui la procedura per configurare un nuovo cluster a nodo singolo. In alternativa, puoi unire il nodo a un cluster esistente come descritto in [Gestione del cluster](../configuration/cluster.md), oppure ripristinare un backup del cluster come dettagliato in [Recupero di emergenza](../configuration/backup.md#disaster_recovery-section).

Per motivi di sicurezza, modifica immediatamente la password dell'admin se è ancora impostata sul valore predefinito.

Assicurati che il Fully Qualified Domain Name (FQDN) del nodo sia corretto e soddisfi i [requisiti DNS](system_requirements.md#dns-reqs).

Anche se in esecuzione su un singolo nodo, il sistema configurerà una Virtual Private Network (VPN) per il cluster. Questa configurazione VPN ti consentirà di aggiungere più nodi in futuro. I valori predefiniti proposti dovrebbero essere adatti alla maggior parte degli ambienti, poiché teoricamente supportano fino a 254 nodi del cluster. Tuttavia, assicurati che la `VPN network (CIDR)` non entri in conflitto con il tuo ambiente di rete esistente, poiché non può essere modificata una volta impostata.

Infine, clicca sul pulsante **Crea cluster**. Il tuo NS8 è ora pronto.

Per impostazione predefinita, il nuovo cluster è denominato `NethServer 8`. Se desideri cambiarlo:

- Vai alla pagina `Impostazioni` e clicca sulla scheda `Cluster`.
- Inserisci un nuovo nome nel campo `Etichetta del cluster`.
- Clicca sul pulsante **Salva impostazioni**.

Non sai da dove iniziare? Puoi:

- Installare un dominio utente [LDAP](user_domains.md#openldap-section) o [Active Directory](user_domains.md#active_directory-section).
- Leggere un'introduzione sulle [applicazioni NS8](modules.md).
- Dare un'occhiata ai [log di sistema](../configuration/log_server.md).
- Aggiungere [nuovi nodi](../configuration/cluster.md).
- Configurare un [cruscotto di metriche](../configuration/metrics.md).
- Leggere la sezione [Recupero spazio SSD](../../tutorial/disk_usage.md#fstrim-periodic) per abilitare esecuzioni periodiche di `fstrim`.
## Disinstallazione

È possibile disinstallare NS8 dalla propria distribuzione Linux.

Il comando di disinstallazione tenta di arrestare ed eliminare i componenti principali e i moduli aggiuntivi. Usarlo con cautela, poiché elimina tutto il contenuto delle directory `/home` e `/var/lib/nethserver`.

Per disinstallare NS8, eseguire:

    bash /var/lib/nethserver/node/uninstall.sh