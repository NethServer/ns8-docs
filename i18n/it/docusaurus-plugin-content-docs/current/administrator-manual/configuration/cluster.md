---
title: Gestione cluster
sidebar_position: 1
---
# Gestione cluster

A NethServer 8 cluster[^1] is composed of one **leader** node and multiple **worker** nodes.

All nodes are managed through the Web user interface, which operates on the leader node.

An NS8 cluster consisting solely of the leader node is a fully functional system. Worker nodes can be added or removed at any time.

The VPN network chosen during the initial leader node setup determines the limit on the number of possible cluster nodes. Note that a node's VPN IP is never released once allocated: removing a node does not free its VPN IP address.

La rete VPN predefinita `10.5.4.0/24` supporta fino a 254 nodi di cluster.

In teoria, il numero massimo di nodi in un cluster NS8 è limitato solo dalla dimensione della rete VPN. Tuttavia, è consigliabile aggiungere nodi gradualmente per evitare di degradare le prestazioni del leader a causa dell'aumento del carico di lavoro.

## Node overview and details {#node-views}

The `Nodes` page displays an overview of the configured cluster nodes. Each card shows basic node attributes, the node alert counter, and node actions, which are explained in detail in the following sections.

- Cluster nodes are uniquely identified by an increasing number. They are named `Node 1`, `Node 2` and so on. Use the `Edit label` action from the three-dots menu to assign a custom name to the node. Note that this label is only for UI visualization; see [Cambiamento FQDN](#set-fqdn) to change the host name.
- `FQDN` is the fully qualified host name (including the DNS domain suffix) assigned to the node's operating system. It must meet the node [DNS requirements](../installation/system_requirements.md#dns-reqs).
- `IP address` is the main system address. It is the source address of the default IP route, selected among the available system IP addresses. To change basic network configuration refer to [Configurazione nodi della rete](../../tutorial/os_network.md).
- `Applications` is the number of applications installed on the node. It is a link to the [Applications page](../installation/modules.md), already filtered for the selected node.

If there is an ongoing NethServer 7 migration procedure, a special node representing the NethServer 7 system is shown. All actions related to this node must be executed from the NethServer 7 migration tool available on that system. During migration, some cluster and application actions are inhibited. Refer to [Migrazione da NethServer 7](../../tutorial/migration.md) for more information.

The **See details** button opens a detailed view of the selected node.

- `Applications` and `Network interfaces` link to pages that provide further details about the applications running on the node and the full list of IP addresses.
- `VPN` shows a summary of the node’s internal WireGuard network parameters. The `Endpoint` value is important in case of [new leader promotion](#node-promotion-section). To change the WireGuard listening port number, refer to [Configurazione personalizzata VPN](../../tutorial/vpn.md).
- The `Alerts` panel lists active node alerts, collected every minute. See how to configure email notifications in [Alerts](metrics.md#alerts-section).
- The following sections summarize CPU, load, memory, and disk usage. Metrics are collected every minute, and averages are calculated over a two-minute interval. For a detailed view of collected system metrics, refer to [Grafana access](metrics.md#grafana_access-section).

### Aggiungere un nodo

You can add (join) a worker node to an existing cluster. The process consists of the following steps:

- ensure the leader node is running the latest Core version
- install the new node using the same Core version installed on the leader node
- ottenere il codice di join dal nodo leader
- inserire il codice di join nel nodo worker

First, prepare a machine with the same Linux distribution and Core version as the leader node. Then follow the [install instruction](../installation/install.md) until the login to the Web user interface.

Dopo il login sul nodo worker, fare clic sul pulsante **Join cluster**.

Assicurarsi che il Fully Qualified Domain Name (FQDN) del nodo sia corretto e rispetti i [requisiti DNS](../installation/system_requirements.md#dns-reqs).

Sul nodo leader, accedere alla pagina `Nodi` e fare clic su **Aggiungi nodo al cluster**. Quindi copiare il codice di join dalla finestra di dialogo.

Return to the worker node and paste the code inside the `Join code` field and click the **Join cluster** button. If the leader node does not have a valid TLS certificate, remember to disable the `TLS certification validation` option before clicking the join button.

Quando la registrazione del nodo è completa, si può tornare alla interfaccia utente del nodo leader e installare applicazioni sul nuovo nodo worker.

### Rimuovere un nodo

I nodi worker possono essere rimossi dal cluster. Prima di rimuovere un nodo worker, assicurarsi che nessuna replica di account provider sia su di esso in esecuzione. Nella pagina `Domini e utenti`, per ogni dominio seguire il link `N provider` per vedere in quale nodo è installata la replica, quindi rimuoverla.

:::warning

Se il nodo non è raggiungibile, o non risponde, la rimozione della replica del provider deve essere completata manualmente dopo la rimozione del nodo.

:::

Accedere alla pagina `Nodi`, andare al menu a tre punti del nodo e cliccare su `Rimuovi dal cluster` per aprire una finestra di conferma. Le applicazioni installate sul nodo sono elencate: rivedere quella lista con attenzione perché la rimozione del nodo non è recuperabile.

Se la finestra di rimozione del nodo viene confermata premendo il pulsante **Sono consapevole, rimuovi il nodo**, il nodo e le sue applicazioni sono disconnessi, le loro autorizzazioni vengono revocate e non possono accedere più al cluster.

Quando un nodo viene rimosso dal cluster le applicazioni in esecuzione su di esso non sono influenzate e sono lasciate in esecuzione. Arrestare e spegnere il nodo per completarne la rimozione.

### Cambiamento FQDN {#set-fqdn}

FQDN di un nodo è tipicamente impostato durante le fasi di post-installazione. Se diventa necessario cambiare la FQDN in seguito, seguire questi passaggi:

1.  Accedere alla pagina `Nodes` e passare al menu a tre punti della scheda nodo corrispondente.
2.  Select the `Set FQDN` action.

Se si sta cambiando FQDN del nodo leader, una procedura di convalida aggiuntiva controllerà se il nuovo FQDN è correttamente risolto da tutti i nodi del lavoratore.

Se stai cambiando la FQDN di un nodo operaio, questa validazione non viene applicata. Tuttavia, è ancora necessario registrare correttamente il nuovo FQDN nel DNS come descritto in [Configurazione DNS](../installation/system_requirements.md#dns-reqs).

### Promuovere un nodo a leader {#node-promotion-section}

Adding and removing nodes may necessitate changing the cluster **leader node**.

A suitable leader node must be reachable by all other worker nodes.

Every worker node must correctly resolve the leader's FQDN, which must be consistent across all worker nodes.

Depending on the state of the current leader node, there are two procedures to promote a node to the leader role:

- Nodo leader raggiungibile
- Nodo leader irraggiungibile

After promoting a leader, it is necessary to perform these additional tasks:

- Reset the cluster backup password. For more information, see [Cluster backup](backup.md#cluster_backup-section).

Additionally, refer to the note in [Audit log](#audit-trail-section) regarding node promotion.

:::note

Promuovere un nuovo leader comporta modifiche alla configurazione dei registri di sistema. Per ulteriori dettagli, fare riferimento a [Log di persistenza](log_server.md#logs-persistence-section).

:::

#### Nodo leader raggiungibile

Se l'attuale nodo leader funziona correttamente, seguire questi passaggi:

1.  Access the `Nodes` page.
2.  Open the three-dots menu of the node to promote and click on `Promote to leader`.

The `Check node connectivity` checkbox verifies the connection of the old leader with the designated one. Since the VPN connection cannot be probed, only an HTTPS connection is attempted. This may fail due to intervening network devices (e.g., NAT and port-forwarding setups). If you are certain that the configuration is correct, you can disable the check, but proceed at your own risk!

When the confirmation string is typed, the **I understand,
promote the node** button becomes active, allowing you to complete the node promotion.

#### Nodo leader irraggiungibile

If the current leader node is not reachable, run a command on any other worker node. Be prepared for this situation by enabling SSH, console, or Cockpit **terminal root access** to the nodes.

For example, to promote the node with ID `3`, run the following command on every worker node:

    switch-leader --node 3

Se il comando fallisce perché il endpoint VPN del nodo 3 non è definito o non è corretto, utilizzare il parametro opzionale `--endpoint`, per esempio:

> switch-leader --node 3 --endpoint node3.example.net:55820

Il parametro endpoint VPN consiste in un prefisso indirizzo (nome o IP) e un suffisso del numero di porta UDP, separato da un colon `:`.

## Recover an offline node

If the leader node is offline, the cluster-admin interface is not accessible and it is not possible to issue commands to worker nodes. If there is no way to recover the leader, refer to [Promuovere un nodo a leader](#node-promotion-section) to select a new leader.

If a worker node is offline, the cluster can continue to operate. Cluster operations such as adding or removing worker nodes and applications are still possible.

When an offline node is recovered, in some cases it may be necessary to manually run the following command on the recovered node:

    apply-vpn-routes

The above command is required if, during the offline period, one or more of the following events occurred:

- A node was added to or removed from the cluster.
- Samba was added to or removed from the cluster.

The `apply-vpn-routes` command adjusts the current WireGuard runtime settings and the system routing table, and persists the changes to reflect the cluster configuration stored in the Redis database.

## Amministratori {#administrators-section}

Gli amministratori del cluster hanno il totale controllo del cluster. Si raccomanda di creare un utente personale per ogni amministratore del cluster. Tutte le azioni eseguite da un amministratore del cluster sono registrate all'interno di [Audit log](#audit-trail-section).

Per aggiungere un nuovo amministratore del cluster vai alla pagina `Impostazioni` e selezionare la scheda `Amministratori cluster`. Quindi fare clic su **Crea amministratore** e compilare i campi richiesti.

Un amministratore non può eliminare il proprio utente. Per eliminare un amministratore, è necessario accedere come un altro amministratore del cluster già esistente.

Gli amministratori possono cambiare la propria password dalla scheda `Account` all'interno della pagina `Impostazioni`.

### Autenticazione a due fattori (2FA) {#configure-2fa-section}

L'autenticazione a due fattori (2FA) può essere utilizzata per aggiungere un ulteriore livello di sicurezza necessario per accedere all'interfaccia utente di gestione del cluster.

L'amministratore può abilitare 2FA dalla scheda `Account` all'interno della pagina `Impostazioni` facendo clic sul pulsante **Abilita 2FA** .

L'utente dovrà:

1.  scaricare e installare l'applicazione 2FA preferita sullo smartphone
2.  eseguire la scansione del codice QR con l'applicazione 2FA
3.  generare un nuovo codice e copiarlo all'interno del campo di verifica, quindi fare clic su **Verifica codice**

#### Applicazioni smartphone

Ci sono diverse applicazioni commerciali e open source per 2FA:

Disponibile sia per Android che per iOS:

- [FreeOTP](https://freeotp.github.io/): disponibile sia per Android che per iOS
- [Authenticator](https://mattrubin.me/authenticator/): disponibile solo su iOS
- [2FAS](https://2fas.com/): disponibile sia per Android che per iOS

### Reimpostare la password dell'amministratore del cluster

If you are locked out of the web user interface but can still access a system command-line shell as `root` (e.g. through the system recovery console or SSH), run the following command **on the leader node** to disable 2FA and reset the password:

    api-cli run alter-user --data '{"user":"admin","set":{"password":"Nethesis,1234","2fa":false}}'

Replace the `admin` username and `Nethesis,1234` password with the desired credentials.

:::note

The above command fails with `AuthenticationError` if executed on a **worker node**. Run it only on the leader node.

:::

## Audit log {#audit-trail-section}

All'interno della pagina del percorso di audit, gli amministratori di cluster possono ispezionare tutte le azioni eseguite da qualsiasi altro amministratore. Ogni evento del percorso di audit contiene almeno:

- data e ora dell'azione
- nome utente dell'amministratore del cluster
- nome dell'azione

Gli eventi del log di audit possono essere filtrati per utente, data, tipo di azione e corrispondenza di testo personalizzata.

:::note

Le informazioni del log di audit vengono memorizzate nel disco del nodo leader. In caso di [new leader promotion](#node-promotion-section) le informazioni del log di audit nel vecchio leader non sono più accessibili.

:::

**Footnotes**

[^1]: <https://en.wikipedia.org/wiki/Computer_cluster>
