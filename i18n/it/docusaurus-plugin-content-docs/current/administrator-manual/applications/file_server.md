---
title: Samba file server
sidebar_position: 3
---
# Samba file server

The [Samba](http://www.samba.org) file server application provides shared folders and home directories to users and groups within an Active Directory domain.

Before installing Samba file server in a cluster node, evaluate the available disk space and estimate space requirements. Refer to section [Utilizzo del disco](../../tutorial/disk_usage.md) for disk space management strategies. For example, if you mount an additional volume on `/mnt/disk1` or `/srv/disk1` directories, the install procedure will then ask if you want to use it for Samba.

Only one instance of Samba can be installed per NS8 node. The installation method depends on the role Samba will play in the Active Directory domain.

- **Domain Controller**: To install a Samba instance as an Active Directory Domain Controller, refer to [Active Directory](../installation/user_domains.md#active_directory-section). When configuring it as an account provider, ensure the `Provide shared folders and authentication to Windows clients` switch is enabled.

  Only one AD domain controller can be configured with a LAN IP address to serve Authentication, Shared folders, and DNS to Windows clients. Other DCs are bound to the cluster private VPN and are accessible only to cluster applications.

- **Domain Member**: To install a Samba instance as an Active Directory Domain Member, start from the Software Center as with any other application. A domain member can connect to both internal and external AD providers. See [Domini utente](../installation/user_domains.md).

## Configurazione {#samba-configuration}

When Samba is installed as a **domain member**, a first-time configuration procedure starts to collect essential information.

- **Domain**: Select an item from the list of available NS8 user domains. Only internal and external Active Directory domains are listed.
- **Admin credentials**: These are required to join Samba to the domain as a file server member. Enter the username and password of a member from the Active Directory "Domain Admins" group.
- **File server name and alias**: Assign a unique computer account name to Samba. Choose carefully, as this cannot be changed later. The alias name is optional and can be changed at any time.
- **File server IP address**: Select the IP address for the file server.

### File server alias {#file-server-alias}

Once the first-time configuration procedure is completed, use the `Settings` page from the left menu to modify the optional `File server alias` value. The server alias name is useful for migrating and consolidating shared folders from another server. The alias name is added to the Active Directory DNS as a CNAME record pointing to the Samba file server name. The alias name is also added as a Service Principal Name (SPN) to the computer account.

### File server IP address {#file-server-address}

In some cases, it is also possible to modify the `File server IP address` and choose a different private IP address from those assigned to the node. Note that a domain controller cannot change its IP address if there are other domain controllers in the same AD domain.

## Shared folders {#shared-folders-section}

Open the Samba application from the app drawer, select `Shared folders` from the left menu, and click on **Create shared folder**.

The following parameters are required to create a new shared folder:

- **Name**: The name of the shared folder. Avoid naming it after a domain user, as that user's home directory will be accessed instead of the shared folder.
- **Description**: Free text displayed to network clients as the "share comment".
- **Main group**: Select a domain group to assign initial permissions to the share.
- **Initial permissions**: Choose one of the three available options. Note that the `Domain Admins` group is initially granted full privileges in all cases.
  1.  Main group can read and write; everyone else can read.
  2.  Main group can read and write; everyone else has no access.
  3.  Everyone can read and write, including the main group.

:::note

To access the shared folder, you must provide valid domain credentials. Anonymous or guest access is not allowed for security reasons[^1].

:::

Once created, the following actions are available on the shared folder from the three-dots menu:

- **Edit**: Change the share description displayed to network clients as the "share comment".
- **Set permissions**: Remove any existing ACLs and recursively grant new initial ACLs.
- **Restore file or folder**: Search files and folders from a past backup snapshot and restore them. See [Restore a single file or folder from a shared folder backup](#share-selective-restore).
- **Delete**: Remove the shared folder and its contents.

The **Show ACLs** button displays the filesystem ACLs applied to the shared folder root directory. You can edit ACLs with an SMB client, such as the Windows Explorer application installed with Windows Pro editions, or the `smbcacls` command provided by the Samba project.

In both creation and edit workflows, some additional settings are available under the `Advanced` section and are described below.

### Audit logging {#share-audit-logging}

If the `Audit logging` switch is enabled for a shared folder, access operations and permission changes are recorded in a database. For troubleshooting purposes, you can enable the recording of failed operations with the `Log failed events` switch.

Recorded events are accessible from the `Samba Audit search` Grafana dashboard, as explained in [Grafana access](../configuration/metrics.md#grafana_access-section).

More information about the audit database is available from the `Samba Audit statistics` Grafana dashboard.

### Folder visibility {#share-browseable}

The `Make folder visible when browsing` switch controls whether the shared folder is listed from the network. If the switch is disabled, accessing the share is possible only by knowing its name and network path.

This feature is also referred to as a *hidden share* or the *share browseable/browsable* attribute.

### Recycle bin {#share-recycle}

The `Keep deleted files in a recycle bin` switch enables a special `.recycle` subfolder where files or directories are moved instead of being permanently deleted when users attempt to remove them from the share.

Deleted content is placed in a private subfolder automatically created under the `.recycle` subfolder. This private subfolder is named after the user and is accessible only to the user who deleted the content and the Administrator.

When the switch is enabled, two additional options become available:

- **Retention**: If a limit is set, a daily automated task removes items in the `.recycle` subfolder that are older than the specified number of days (default: 30).
- **When files with the same name are deleted**: Determines whether to keep only the latest version of a deleted file with the same name, or preserve multiple versions.

### Restore a single file or folder from a shared folder backup {#share-selective-restore}

Se l'applicazione ha una o più destinazioni di backup configurate e un backup è già stato eseguito, è possibile cercare e ripristinare un file o una cartella da un'istantanea di backup precedente di una specifica cartella condivisa.

:::warning

La procedura non calcola l'utilizzo dello spazio su disco necessario per il ripristino. Assicurare sufficiente spazio su disco è disponibile prima di procedere.

:::

1.  Navigare all'istanza di applicazione Samba e aprire la pagina cartelle condivise. Ogni cartella condivisa viene visualizzata come scheda. Dal menu a tre punti della cartella condivisa desiderata, selezionare `Ripristina file o cartella`.

2.  Scegliere la destinazione di backup da cui ripristinare il contenuto. Caricamento di destinazioni remote può richiedere un po 'di tempo.

3.  Selezionare la data dell'istantanea di backup da ripristinare. Le istanze sono elencate da più nuovo a più vecchio.

4.  Inizia a digitare il nome del file o della cartella da ripristinare. La ricerca corrisponde sia al nome che al percorso relativo, partendo dalla radice della cartella condivisa. I risultati sono ordinati con le partite di nome che appaiono prima delle partite del percorso. Selezionare un elemento dai risultati.

    Click **Restore** to initiate the restore process.

The selected item will be restored into a subfolder of the shared folder, named "Restored folder". This folder is readable by everyone, while its contents retain the ACLs from the backup.

## Clone a file server instance {#file-server-clone}

When Samba has the Domain Member role, it is possible to clone it as described in [Clone and move](../installation/modules.md#move_clone-section).

After the clone process finishes, navigate to the Samba application `Status` page. The first-configuration procedure will start to acquire the missing information. A new computer account is created in Active Directory. Follow the procedure as described in [Configurazione](#samba-configuration).

## Restore file server from backup {#file-server-restore}

First, follow the procedure described in [Restore applications](../configuration/backup.md#application_restore-section) by selecting the backup of the **Samba module**.

After the restoration process completes, further actions may be needed to start the file server, depending on the original Samba role: member or controller.

### Restore a domain member

To complete the restoration of a **domain member**, navigate to the Samba application `Status` page.

- If the original IP address and user domain were found, the restore procedure automatically starts the file server. No manual operations are needed.

- Otherwise, the first-configuration procedure will start to acquire the missing information. In this case, a new computer account is created in Active Directory. Follow the procedure as described in [Configurazione](#samba-configuration).

  If you manually remove the original computer account, you may set the original name as the `File server alias` to provide seamless access to shared folders from network clients.

  To manage computer accounts of an NS8 internal Active Directory domain, invoke the `samba-tool` command from an NS8 node that hosts a Samba Domain Controller. For example, this command prints an inline help message:

      runagent -m samba0 podman exec -ti samba-dc samba-tool computer

  Replace `samba0` with your correct DC module identifier.

### Restore a domain controller

If the restored **domain controller** is the first in the domain, there are two alternatives:

1.  If the system IP address is the same as the one used in the backup set, DC services are started automatically and no further actions are required.

2.  If the previous condition does not apply, DC services are started using the system VPN IP address as a fallback. A similar command is required to select another IP address at a later time:

        api-cli run module/samba0/set-ipaddress --data '{"ipaddress": "10.15.21.100"}'

    Replace `samba0` with the correct module identifier. Replace the `ipaddress` value with the correct IP address.

Otherwise, if one or more domain controllers already exist:

- Go to the `Domain and users` page and open the **Unconfigured
  provider** link.
- Fill the form to join a new DC to the domain.

**Footnotes**

[^1]: The guest access in SMB2 and SMB3 is disabled by default in Windows, see Microsoft [File server](##REF##File server) documentation.
