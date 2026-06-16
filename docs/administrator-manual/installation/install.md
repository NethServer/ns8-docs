---
title: Installation
sidebar_position: 2
---
# Installation

First, ensure that the [System requirements](system_requirements.md) are met.

You can install NethServer 8 on a supported distribution or use a pre-built image. Both methods require an active Internet connection.

## Standard procedure {#install_linux-section}

Pick your preferred Linux distribution between [supported ones](system_requirements.md#supported-distros-section).

Start the installation procedure as `root`:

    curl https://raw.githubusercontent.com/NethServer/ns8-core/ns8-stable/core/install.sh | bash

If the `curl` command is not available try to install it with:

    apt install curl || dnf install curl

The install script also applies the latest security distribution updates. Reboot the system at the end of the installation.

## Pre-built image {#install_image-section}

The pre-built virtual machine image is based on Rocky Linux 9 and comes preconfigured with the packages and NS8 core components installed by the standard installation procedure. It uses Cloud-init for network initialization. Refer to your virtualization platform documentation for more information about Cloud-init support.

| Platform | Format | Size | URL |
|----|----|----|----|
| [Proxmox](https://www.proxmox.com) (QEMU) | qcow2 | 1.4   GB | <https://tinyurl.com/ns8-rocky-qcow2> |
| [VMWare](https://www.vmware.com) ESXi 8+ | vmdk | 2.8   GB | <https://tinyurl.com/ns8-rocky-vmdk> |

NS8 image download links

If your platform is not in the above list the prebuilt image cannot be used. Please refer to [Standard procedure](#install_linux-section).

When the image download has completed verify the file integrity with the [sha256 checksum file](https://distfeed.nethserver.org/ns8-images/CHECKSUM). Download the checksum then run for example the following command:

    sha256sum --ignore-missing -c CHECKSUM

Virtualization platform-specific notes:

- For VMWare ESXi 8+, add a hard disk with existing image and select *IDE controller 1 (Master)*.
- On Proxmox, for maximum performance, select `host` as the CPU type. Avoid "kvm64", because Rocky Linux image does not support it. Refer to [Proxmox documentation](https://pve.proxmox.com/pve-docs/chapter-qm.html#qm_cpu) for further details about CPU selection.

Start the NS8 image within your virtualization platform. If Cloud-init does not find a network configuration, it attempts to obtain one via DHCP. After a few seconds, the system console displays a login prompt showing the assigned IP address.

Default OS administrative credentials are

- Username: `root`
- Password: `Nethesis,1234`

Log in using the default credentials. On the first login, you will be prompted to change the root password.

SSH access is disabled for root. To obtain administrative SSH access, create a personal user account in the `wheel` group and set a password. For example, run the following commands and enter the desired password:

    useradd -G wheel ethan.smith
    passwd ethan.smith

After logging in with the personal user account, gain root access by executing:

    sudo su -

Finally, apply the latest distribution security updates and reboot the system:

    dnf --refresh update -y
    reboot

:::warning

If DHCP was used to obtain the initial network configuration, change the Rocky Linux network settings and configure a static IP address. For more information refer to [Node network setup](../../tutorial/os_network.md).

:::

## Post-installation steps {#post-install-steps}

When the installation script completes or the pre-built image has started, access the Web user interface at:

    https://<server_ip_or_fqdn>/cluster-admin/

:::tip

If the node is unreachable, refer to [Node network setup](../../tutorial/os_network.md).

:::

The default credentials for logging in to the cluster-admin interface are:

- Username: `admin`
- Password: `Nethesis,1234`

Choose **Create cluster** and follow the procedure to set up a new single-node cluster. Alternatively, you can join the node to an existing cluster as described in [Cluster management](../configuration/cluster.md), or restore a cluster backup as detailed in [Disaster recovery](../configuration/backup.md#disaster_recovery-section).

For security reasons, change the admin password immediately if it is still set to the default value.

Ensure the node's Fully Qualified Domain Name (FQDN) is correct and meets the [DNS requirements](system_requirements.md#dns-reqs).

Even if running on a single node, the system will set up a Virtual Private Network (VPN) for the cluster. This VPN setup will allow you to add more nodes in the future. The proposed default values should be suitable for most environments, as it theoretically accommodates up to 254 cluster nodes. However, ensure that the `VPN network (CIDR)` does not conflict with your existing network environment, as it cannot be changed once set.

Finally, click the **Create cluster** button. Your NS8 is now ready.

By default, the new cluster is named `NethServer 8`. If you wish to change it:

- Go to the `Settings` page and click on the `Cluster` card.
- Enter a new name in the `Cluster label` field.
- Click the **Save settings** button.

Not sure where to go from here? You can:

- Install an [LDAP](user_domains.md#openldap-section) or [Active Directory](user_domains.md#active_directory-section) user domain.
- Read an introduction about [NS8 applications](modules.md).
- Take a look at [system logs](../configuration/log_server.md).
- Add [new nodes](../configuration/cluster.md).
- Set up a [metric dashboard](../configuration/metrics.md).
- Read [SSD space reclamation](../../tutorial/disk_usage.md#fstrim-periodic) section to enable periodic `fstrim` runs.

## Uninstall

You can uninstall NS8 from your Linux distribution.

The uninstall command attempts to stop and erase core components and additional modules. Handle it with care because it erases everything under `/home` and `/var/lib/nethserver` directories.

To uninstall NS8, execute:

    bash /var/lib/nethserver/node/uninstall.sh
