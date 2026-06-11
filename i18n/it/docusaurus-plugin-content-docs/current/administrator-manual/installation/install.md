---
title: Installazione
sidebar_position: 2
---
# Installazione

First, ensure that the [System requirements](system_requirements.md) are met.

You can install NethServer 8 on a supported distribution or use a pre-built image. Both methods require an active Internet connection.

## Standard procedure {#install_linux-section}

Scegliere la distribuzione Linux preferita tra [quelle supportate](system_requirements.md#supported-distros-section).

Avviare la procedura di installazione come `root`:

    curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash

Se il comando `curl` non fosse disponibile, sarà possibile installarlo con il comando:

    apt install curl || dnf install curl

The install script also applies the latest security distribution updates. Reboot the system at the end of the installation.

## Immagine pre-built {#install_image-section}

The pre-built virtual machine image is based on Rocky Linux 9 and comes preconfigured with the packages and NS8 core components installed by the standard installation procedure. It uses Cloud-init for network initialization. Refer to your virtualization platform documentation for more information about Cloud-init support.

| Platform | Format | Size | URL |
|----|----|----|----|
| [Proxmox](https://www.proxmox.com) (QEMU) | qcow2 | 1.4   GB | <https://tinyurl.com/ns8-rocky-qcow2> |
| [VMWare](https://www.vmware.com) ESXi 8+ | vmdk | 2.8   GB | <https://tinyurl.com/ns8-rocky-vmdk> |

NS8 image download links

If your platform is not in the above list the prebuilt image cannot be used. Please refer to [Standard procedure](#install_linux-section).

Completato il download dell'immagine, verificare la sua integrità con il file [sha256 checksum](https://distfeed.nethserver.org/ns8-images/CHECKSUM). Scaricare il checksum ed eseguire, per esempio, il seguente comando:

    sha256sum --ignore-missing -c CHECKSUM

Note specifiche per piattaforma di virtualizzazione:

- For VMWare ESXi 8+, add a hard disk with existing image and select *IDE controller 1 (Master)*.
- On Proxmox, for maximum performance, select `host` as the CPU type. Avoid "kvm64", because Rocky Linux image does not support it. Refer to [Proxmox documentation](https://pve.proxmox.com/pve-docs/chapter-qm.html#qm_cpu) for further details about CPU selection.

Start the NS8 image within your virtualization platform. If Cloud-init does not find a network configuration, it attempts to obtain one via DHCP. After a few seconds, the system console displays a login prompt showing the assigned IP address.

Le credenziali amministrative predefinite del sistema operativo sono

- Nome utente: `root`
- Password: `Nethesis,1234`

Log in using the default credentials. On the first login, you will be prompted to change the root password.

SSH access is disabled for root. To obtain administrative SSH access, create a personal user account in the `wheel` group and set a password. For example, run the following commands and enter the desired password:

    useradd -G wheel ethan.smith
    passwd ethan.smith

Dopo l'accesso con l'account utente personale, ottenere l'accesso root eseguendo:

    sudo su -

Finally, apply the latest distribution security updates and reboot the system:

    dnf --refresh update -y
    reboot

:::warning

Se fosse stato utilizzato il DHCP per ottenere la configurazione di rete iniziale, modificare le impostazioni di rete Rocky Linux e configurare un indirizzo IP statico. Per ulteriori informazioni si rimanda a [Configurazione nodi della rete](../../tutorial/os_network.md).

:::

## Passi post-installazione {#post-install-steps}

When the installation script completes or the pre-built image has started, access the Web user interface at:

    https://<server_ip_or_fqdn>/cluster-admin/

:::tip

If the node is unreachable, refer to [Configurazione nodi della rete](../../tutorial/os_network.md).

:::

The default credentials for logging in to the cluster-admin interface are:

- Nome utente: `admin`
- Password: `Nethesis,1234`

Scegliere **Create cluster** e seguire la procedura per impostare un nuovo cluster a singolo nodo. In alternativa, è possibile unire il nodo a un cluster esistente come descritto in [Gestione cluster](../configuration/cluster.md), o ripristinare un backup di cluster come dettagliato in [Disaster recovery](../configuration/backup.md#disaster_recovery-section).

For security reasons, change the admin password immediately if it is still set to the default value.

Ensure the node's Fully Qualified Domain Name (FQDN) is correct and meets the [DNS requirements](system_requirements.md#dns-reqs).

Even if running on a single node, the system will set up a Virtual Private Network (VPN) for the cluster. This VPN setup will allow you to add more nodes in the future. The proposed default values should be suitable for most environments, as it theoretically accommodates up to 254 cluster nodes. However, ensure that the `VPN network (CIDR)` does not conflict with your existing network environment, as it cannot be changed once set.

Finally, click the **Create cluster** button. Your NS8 is now ready.

By default, the new cluster is named `NethServer 8`. If you wish to change it:

- Go to the `Settings` page and click on the `Cluster` card.
- Enter a new name in the `Cluster label` field.
- Click the **Save settings** button.

Non sei sicuro di dove andare da qui? Potete:

- Installare un dominio utente [LDAP](user_domains.md#openldap-section) o [Active Directory](user_domains.md#active_directory-section).
- Leggi un'introduzione su [NS8 applications](modules.md).
- Take a look at [system logs](../configuration/log_server.md).
- Add [new nodes](../configuration/cluster.md).
- Impostare un [metric dashboard](../configuration/metrics.md).
- Read [SSD space reclamation](../../tutorial/disk_usage.md#fstrim-periodic) section to enable periodic `fstrim` runs.

## Rimozione

È possibile disinstallare NS8 dalla distribuzione Linux usata come base.

Il comando di rimozione tenta di fermare e cancellare componenti core e moduli aggiuntivi. L'attività va studiata con cura perché rimuove tutto ciò che si trova nelle directory `/home` e `/var/lib/nethserver`.

Per disinstallare NS8, eseguire:

    bash /var/lib/nethserver/node/uninstall.sh
