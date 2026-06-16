---
title: "Manual partitioning of Rocky Linux with a single disk and LVM"
sidebar_position: 99
---
# Manual partitioning of Rocky Linux with a single disk and LVM

Use this procedure to prepare a Rocky Linux system for a NethServer 8 installation with a
single disk and `LVM`.

This setup is suitable, for example, for virtualized environments.

This guide works for both BIOS and EFI systems.

:::note
On EFI systems, you must create an additional `/boot/efi` partition. On BIOS systems, skip
step 7.
:::

## Start the installer

1. Boot the system from the [Rocky Linux ISO](https://rockylinux.org/it/download) and choose
   **Install Rocky Linux**.

![Select Install Rocky Linux](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step01-install-rocky.png)

2. Choose the installation language and click **Continue**.

![Select the installation language](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step02-language.png)

3. Open **Installation Destination**.

![Open Installation Destination](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step03-installation-destination.png)

4. Make sure the disk to use is selected, choose **Custom** in the storage configuration
   section, and click **Done**.

![Select disk and custom storage](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step04-custom-storage.png)

## Create the LVM layout

5. In **Manual Partitioning**, make sure the partitioning scheme is **LVM**, then click the
   **+** icon.

![Open manual partitioning](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step05-manual-partitioning.png)

6. Create the `/boot` mount point with size `1024 MiB`, then click **Add mount point**.

![Create the /boot mount point](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step06-boot-mount.png)

7. On EFI systems only, click **+** again, create `/boot/efi` with size `600 MiB`, then click
   **Add mount point**.

![Create the /boot/efi mount point](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step07-efi-mount.png)

8. Create the `swap` mount point. Assign a size appropriate for the server RAM. Refer to the
   [Red Hat swap size guidance](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/ch-swapspace#tb-recommended-system-swap-space),
   then click **Add mount point**.

![Create the swap mount point](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step08-swap-mount.png)

9. Click **+** again, create the `/` mount point, and leave the size empty so the installer
   uses all remaining space. Then click **Add mount point**.

![Create the root mount point](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step09-root-mount.png)

10. Click **Done**.

![Finish manual partitioning](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step10-done-partitioning.png)

11. In **Summary of Changes**, click **Accept Changes**.

![Accept the storage changes](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step11-accept-changes.png)

## Configure network and host name

12. Back in **Installation Summary**, open **Network & Host Name**.

![Open Network & Host Name](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step12-network-hostname.png)

13. Set the server FQDN in **Host Name** and click **Apply**. If needed, click **Configure**
    to change the network settings.

![Set host name and open network settings](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step13-configure-network.png)

14. If you want a static address, open the **IPv4 Settings** tab.

![Open IPv4 Settings](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step14-ipv4-settings.png)

15. Change **Method** from **Automatic (DHCP)** to **Manual**, then:

    - click **Add** and enter the IP address, netmask in [CIDR notation](./rocky-linux-network-configuration.md#cidr-notation), and gateway
    - add the DNS server in the **DNS servers** field
    - click **Save**

![Configure static IPv4 settings](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step15-static-ip-details.png)

16. When network and host name configuration is complete, click **Done**.

![Finish network configuration](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step16-finish-network.png)

## Create the administrative user

17. Open **User Creation**.

![Open User Creation](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step17-user-creation.png)

18. Create the privileged user that will manage the operating system:

    - choose the username
    - enable **Make this user administrator**
    - enter the password twice

:::warning
This user can escalate privileges with `sudo` and act as `root`. Protect it with a strong
password.
:::

Then click **Done**.

![Create the administrative user](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step18-admin-user.png)

19. Back in the main menu, continue with the installation.

![Start the installation](/_static/tutorial/rocky-linux-manual-partitioning-single-disk-lvm/step19-start-installation.png)

## Next step

When the Rocky Linux installation is complete, continue with the NethServer 8 setup by
following [Install NS8 on a supported distribution](../administrator-manual/installation/install.md#install_linux-section).

For more details about Rocky Linux installation, see the [official Rocky Linux installation
guide](https://docs.rockylinux.org/guides/installation/).
