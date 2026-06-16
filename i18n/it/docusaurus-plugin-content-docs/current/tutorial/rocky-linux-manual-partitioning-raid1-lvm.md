---
title: "Partizionamento manuale di Rocky Linux con RAID1 e LVM"
sidebar_position: 99
---
# Partizionamento manuale di Rocky Linux con RAID1 e LVM

Usa questa procedura per preparare un sistema Rocky Linux a un'installazione di NethServer 8
con due dischi in `RAID1` e `LVM`.

Questa guida e` valida sia per sistemi BIOS sia per sistemi EFI.

:::note
Sui sistemi EFI devi creare una partizione aggiuntiva `/boot/efi`. Sui sistemi BIOS, salta i
passi 8 e 9.
:::

## Avviare l'installer

1. Avvia il sistema dalla [ISO di Rocky Linux](https://rockylinux.org/it/download) e scegli
   **Install Rocky Linux**.

![Seleziona Install Rocky Linux](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step01-install-rocky.png)

2. Scegli la lingua di installazione e fai clic su **Continue**.

![Seleziona la lingua di installazione](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step02-language.png)

3. Apri **Installation Destination**.

![Apri Installation Destination](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step03-installation-destination.png)

4. Seleziona i due dischi da usare, scegli **Custom** nella sezione di configurazione dello
   storage e fai clic su **Done**.

![Seleziona i dischi e lo storage personalizzato](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step04-custom-storage.png)

## Creare il layout RAID1 e LVM

5. In **Manual Partitioning**, assicurati che lo schema di partizionamento sia **LVM**, poi
   fai clic sull'icona **+**.

![Apri il partizionamento manuale](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step05-manual-partitioning.png)

6. Crea il punto di mount `/boot` con dimensione `1024 MiB`, poi fai clic su **Add mount
   point**.

![Crea il punto di mount /boot](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step06-boot-mount.png)

7. Seleziona `/boot`, imposta **Device Type** su **RAID**, verifica che **RAID Level** sia
   `RAID1`, poi fai clic su **Update Settings**.

![Configura /boot come RAID1](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step07-boot-raid1.png)

8. Solo sui sistemi EFI, fai di nuovo clic su **+**, crea `/boot/efi` con dimensione
   `600 MiB`, poi fai clic su **Add mount point**.

![Crea il punto di mount /boot/efi](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step08-efi-mount.png)

9. Solo sui sistemi EFI, seleziona `/boot/efi`, imposta **Device Type** su **RAID**, verifica
   che **RAID Level** sia `RAID1`, poi fai clic su **Update Settings**.

![Configura /boot/efi come RAID1](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step09-efi-raid1.png)

10. Crea il punto di mount `swap`. Assegna una dimensione adeguata alla RAM del server. Fai
    riferimento alle [indicazioni Red Hat per la dimensione della swap](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/ch-swapspace#tb-recommended-system-swap-space),
    poi fai clic su **Add mount point**.

![Crea il punto di mount swap](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step10-swap-mount.png)

11. Seleziona `swap`, verifica che **Volume Type** sia `LVM`, poi fai clic su **Modify** nella
    sezione **Volume Group**.

![Apri le impostazioni del volume group di swap](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step11-swap-volume-group.png)

12. In **Configure Volume Group**, imposta **RAID Level** su `RAID1`, poi fai clic su
    **Save**.

![Imposta il volume group di swap su RAID1](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step12-swap-raid1.png)

13. Fai di nuovo clic su **+**, crea il punto di mount `/` e lascia vuota la dimensione, in
    modo che l'installer usi tutto lo spazio rimanente. Poi fai clic su **Add mount point**.

![Crea il punto di mount root](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step13-root-mount.png)

14. Fai clic su **Done**.

![Termina il partizionamento manuale](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step14-done-partitioning.png)

15. In **Summary of Changes**, fai clic su **Accept Changes**.

![Accetta le modifiche allo storage](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step15-accept-changes.png)

## Configurare rete e nome host

16. Torna a **Installation Summary** e apri **Network & Host Name**.

![Apri Network & Host Name](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step16-network-hostname.png)

17. Imposta l'FQDN del server nel campo **Host Name** e fai clic su **Apply**. Se serve, fai
    clic su **Configure** per modificare la rete.

![Imposta il nome host e apri la rete](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step17-configure-network.png)

18. Se vuoi usare un indirizzo statico, apri la scheda **IPv4 Settings**.

![Apri IPv4 Settings](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step18-ipv4-settings.png)

19. Cambia **Method** da **Automatic (DHCP)** a **Manual**, poi:

    - fai clic su **Add** e inserisci indirizzo IP, netmask in [notazione CIDR](./rocky-linux-network-configuration.md#cidr-notation) e gateway
    - aggiungi il server DNS nel campo **DNS servers**
    - fai clic su **Save**

![Configura i dettagli IPv4 statici](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step19-static-ip-details.png)

20. Quando hai finito di configurare rete e nome host, fai clic su **Done**.

![Termina la configurazione di rete](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step20-finish-network.png)

## Creare l'utente amministrativo

21. Apri **User Creation**.

![Apri User Creation](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step21-user-creation.png)

22. Crea l'utente privilegiato che userai per gestire il sistema operativo:

    - scegli il nome utente
    - abilita **Make this user administrator**
    - inserisci la password due volte

:::warning
Questo utente puo` elevare i privilegi con `sudo` e agire come `root`. Proteggilo con una
password robusta.
:::

Poi fai clic su **Done**.

![Crea l'utente amministrativo](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step22-admin-user.png)

23. Torna al menu principale e prosegui con l'installazione.

![Avvia l'installazione](/_static/tutorial/rocky-linux-manual-partitioning-raid1-lvm/step23-start-installation.png)

## Passo successivo

Quando l'installazione di Rocky Linux e` completata, continua con la configurazione di
NethServer 8 seguendo [Install NS8 on a supported distribution](../administrator-manual/installation/install.md#install_linux-section).

Per maggiori dettagli sull'installazione di Rocky Linux, consulta la [guida ufficiale di
installazione di Rocky Linux](https://docs.rockylinux.org/guides/installation/).
