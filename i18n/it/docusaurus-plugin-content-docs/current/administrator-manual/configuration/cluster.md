---
title: Gestione del cluster
sidebar_position: 1
---
# Gestione del cluster

Un cluster NethServer 8[^1] è composto da un nodo **leader** e da più nodi **worker**.

Tutti i nodi sono gestiti tramite l'interfaccia utente Web, che opera sul nodo leader.

Un cluster NS8 composto unicamente dal nodo leader è un sistema completamente funzionale. I nodi worker possono essere aggiunti o rimossi in qualsiasi momento.

La rete VPN scelta durante la configurazione iniziale del nodo leader determina il limite sul numero di nodi del cluster. Si noti che l'indirizzo IP VPN di un nodo non viene mai rilasciato una volta assegnato: la rimozione di un nodo non libera il suo indirizzo IP VPN.

La rete VPN predefinita `10.5.4.0/24` supporta fino a 254 nodi del cluster.

In teoria, il numero massimo di nodi in un cluster NS8 è limitato solo dalla dimensione della rete VPN. Tuttavia, è consigliabile aggiungere i nodi gradualmente per evitare un degrado delle prestazioni del leader a causa dell'aumento del carico di lavoro.
## Panoramica e dettagli dei nodi {#node-views}

La pagina `Nodes` mostra una panoramica dei nodi del cluster configurati. Ogni scheda visualizza gli attributi di base del nodo, il contatore degli avvisi del nodo e le azioni relative al nodo, che sono spiegate in dettaglio nelle sezioni seguenti.

- I nodi del cluster sono identificati univocamente da un numero progressivo. Sono denominati `Node 1`, `Node 2` e così via. Utilizzare l'azione `Edit label` dal menu a tre punti per assegnare un nome personalizzato al nodo. Si noti che questa etichetta è solo per la visualizzazione nell'interfaccia utente; consultare [Modifica FQDN](#set-fqdn) per modificare il nome host.
- Il `FQDN` è il nome host completamente qualificato (incluso il suffisso del dominio DNS) assegnato al sistema operativo del nodo. Deve soddisfare i [requisiti DNS](../installation/system_requirements.md#dns-reqs) del nodo.
- L'`IP address` è l'indirizzo principale del sistema. È l'indirizzo sorgente della rotta IP predefinita, selezionato tra gli indirizzi IP di sistema disponibili. Per modificare la configurazione di rete di base, fare riferimento a [Configurazione di rete del nodo](../../tutorial/os_network.md).
- Le `Applications` rappresentano il numero di applicazioni installate sul nodo. È un collegamento alla [pagina delle Applicazioni](../installation/modules.md), già filtrata per il nodo selezionato.

Se è in corso una procedura di migrazione di NethServer 7, viene mostrato un nodo speciale che rappresenta il sistema NethServer 7. Tutte le azioni relative a questo nodo devono essere eseguite dallo strumento di migrazione di NethServer 7 disponibile su quel sistema. Durante la migrazione, alcune azioni relative al cluster e alle applicazioni sono inibite. Fare riferimento a [Migrazione di NethServer 7](../../tutorial/migration.md) per ulteriori informazioni.

Il pulsante **See details** apre una vista dettagliata del nodo selezionato.

- `Applications` e `Network interfaces` sono collegamenti a pagine che forniscono ulteriori dettagli sulle applicazioni in esecuzione sul nodo e l'elenco completo degli indirizzi IP.
- `VPN` mostra un riepilogo dei parametri di rete interni di WireGuard del nodo. Il valore `Endpoint` è importante in caso di [promozione di un nuovo leader](#node-promotion-section). Per modificare il numero di porta di ascolto di WireGuard, fare riferimento a [Configurazione personalizzata VPN](../../tutorial/vpn.md).
- Il pannello `Alerts` elenca gli avvisi attivi del nodo, raccolti ogni minuto. Vedere come configurare le notifiche email in [Alerts](metrics.md#alerts-section).
- Le sezioni seguenti riassumono l'utilizzo di CPU, carico, memoria e disco. Le metriche vengono raccolte ogni minuto e le medie sono calcolate su un intervallo di due minuti. Per una vista dettagliata delle metriche di sistema raccolte, fare riferimento a [Accesso a Grafana](metrics.md#grafana_access-section).

### Aggiungere un nodo

È possibile aggiungere (unire) un nodo worker a un cluster esistente. Il processo consiste nei seguenti passaggi:

- assicurarsi che il nodo leader stia eseguendo l'ultima versione di Core
- installare il nuovo nodo utilizzando la stessa versione di Core installata sul nodo leader
- ottenere il codice di unione dal nodo leader
- inserire il codice di unione nel nodo worker

Per prima cosa, preparare una macchina con la stessa distribuzione Linux e versione di Core del nodo leader. Quindi seguire le [istruzioni di installazione](../installation/install.md) fino al login nell'interfaccia utente Web.

Dopo il login sul nodo worker, fare clic sul pulsante **Join cluster**.

Assicurarsi che il Fully Qualified Domain Name (FQDN) del nodo sia corretto e rispetti i [requisiti DNS](../installation/system_requirements.md#dns-reqs).

Sul nodo leader, accedere alla pagina `Nodes`, fare clic su **Add node to cluster** e copiare il codice di unione dalla finestra di dialogo.

Tornare al nodo worker, incollare il codice nel campo `Join code` e fare clic sul pulsante **Join cluster**. Se il nodo leader non dispone di un certificato TLS valido, ricordarsi di disabilitare l'opzione `TLS certification validation` prima di fare clic sul pulsante di unione.

Quando la registrazione del nodo è completata, è possibile tornare all'interfaccia utente del leader e installare applicazioni in esecuzione sul nuovo nodo worker.

### Rimuovere un nodo

I nodi worker possono essere rimossi dal cluster. Prima di rimuovere un determinato nodo worker, assicurarsi che nessuna replica del provider di account sia in esecuzione su di esso. Nella pagina `Domains and users`, per ogni dominio seguire il collegamento `N providers` per vedere il nodo su cui è installata una replica del provider, quindi rimuoverla.

:::warning

Se il nodo non è raggiungibile o non risponde, la rimozione della replica del provider deve essere completata manualmente dopo la rimozione del nodo.

:::

Accedere alla pagina `Nodes`, andare al menu a tre punti del nodo e fare clic su `Remove from cluster` per aprire una finestra di conferma. Le applicazioni installate sul nodo sono elencate: esaminare attentamente tale elenco poiché la rimozione del nodo non è recuperabile.

Se la finestra di rimozione del nodo viene confermata premendo il pulsante **I understand, remove node**, il nodo e le sue applicazioni vengono disconnessi, le loro autorizzazioni vengono revocate e non possono più accedere al cluster.

Quando un nodo viene rimosso dal cluster, le applicazioni in esecuzione su di esso non vengono influenzate e rimangono in esecuzione. Spegnere e disattivare il nodo per completare la rimozione del nodo.

### Modifica FQDN {#set-fqdn}

Il FQDN di un nodo viene generalmente impostato durante i passaggi post-installazione. Se diventa necessario modificare il FQDN in un secondo momento, seguire questi passaggi:

1. Accedere alla pagina `Nodes` e navigare nel menu a tre punti della scheda del nodo corrispondente.
2. Selezionare l'azione `Set FQDN`.
---
id: cluster
title: Configurazione del Cluster
---

Se si sta modificando l'FQDN del nodo leader, una procedura di validazione aggiuntiva verificherà se il nuovo FQDN è correttamente risolto da tutti i nodi worker.

Se si sta modificando l'FQDN di un nodo worker, questa validazione non viene applicata. Tuttavia, è comunque necessario registrare correttamente il nuovo FQDN nel DNS come descritto in [Configurazione DNS](../installation/system_requirements.md#dns-reqs).

### Promuovere un nodo a leader {#node-promotion-section}

L'aggiunta e la rimozione di nodi possono rendere necessario cambiare il **nodo leader** del cluster.

Un nodo leader adeguato deve essere raggiungibile da tutti gli altri nodi worker.

Ogni nodo worker deve risolvere correttamente l'FQDN del leader, che deve essere coerente su tutti i nodi worker.

A seconda dello stato del nodo leader attuale, esistono due procedure per promuovere un nodo al ruolo di leader:

- Nodo leader raggiungibile
- Nodo leader non raggiungibile

Dopo aver promosso un leader, è necessario eseguire queste attività aggiuntive:

- Resettare la password di backup del cluster. Per maggiori informazioni, vedere [Backup del cluster](backup.md#cluster_backup-section).

Inoltre, fare riferimento alla nota in [Audit trail](#audit-trail-section) riguardante la promozione del nodo.

:::note

La promozione di un nuovo leader comporta modifiche alla configurazione dei log di sistema. Per maggiori dettagli, consultare [Persistenza dei log](log_server.md#logs-persistence-section).

:::

#### Nodo leader raggiungibile

Se il nodo leader attuale funziona correttamente, seguire questi passaggi:

1. Accedere alla pagina `Nodes`.
2. Aprire il menu a tre punti del nodo da promuovere e fare clic su `Promote to leader`.

La casella di controllo `Check node connectivity` verifica la connessione del vecchio leader con quello designato. Poiché la connessione VPN non può essere verificata, viene tentata solo una connessione HTTPS. Questo potrebbe fallire a causa di dispositivi di rete intermedi (ad esempio, configurazioni NAT e di port forwarding). Se si è certi che la configurazione sia corretta, è possibile disabilitare il controllo, ma procedere a proprio rischio!

Quando viene digitata la stringa di conferma, il pulsante **I understand, promote the node** diventa attivo, consentendo di completare la promozione del nodo.

#### Nodo leader non raggiungibile

Se il nodo leader attuale non è raggiungibile, eseguire un comando su qualsiasi altro nodo worker. Prepararsi a questa situazione abilitando l'accesso **root terminal** tramite SSH, console o Cockpit sui nodi.

Ad esempio, per promuovere il nodo con ID `3`, eseguire il seguente comando su ogni nodo worker:

    switch-leader --node 3

Se il comando fallisce perché l'endpoint VPN del nodo 3 non è definito o è errato, utilizzare il parametro opzionale `--endpoint`, ad esempio:

    switch-leader --node 3 --endpoint node3.example.net:55820

Il parametro endpoint VPN consiste in un indirizzo (nome o IP) come prefisso e un numero di porta UDP come suffisso, separati da due punti `:`.
## Recuperare un nodo offline

Se il nodo leader è offline, l'interfaccia di amministrazione del cluster non è accessibile e non è possibile inviare comandi ai nodi worker. Se non è possibile recuperare il leader, fare riferimento a [Promuovere un nodo a leader](#node-promotion-section) per selezionare un nuovo leader.

Se un nodo worker è offline, il cluster può continuare a funzionare. Operazioni sul cluster come l'aggiunta o la rimozione di nodi worker e applicazioni sono ancora possibili.

Quando un nodo offline viene recuperato, in alcuni casi potrebbe essere necessario eseguire manualmente il seguente comando sul nodo recuperato:

    apply-vpn-routes

Il comando sopra è richiesto se, durante il periodo offline, si è verificato uno o più dei seguenti eventi:

- Un nodo è stato aggiunto o rimosso dal cluster.
- Samba è stato aggiunto o rimosso dal cluster.

Il comando `apply-vpn-routes` regola le impostazioni runtime correnti di WireGuard e la tabella di routing del sistema, e persiste le modifiche per riflettere la configurazione del cluster memorizzata nel database Redis.
## Amministratori {#administrators-section}

Gli amministratori del cluster possono gestire completamente il cluster. Si consiglia di creare un utente personale per ciascun amministratore del cluster. Tutte le azioni eseguite da un amministratore del cluster vengono raccolte all'interno di un [Audit trail](#audit-trail-section) di sicurezza.

Per aggiungere un nuovo amministratore del cluster, accedere alla pagina `Impostazioni` e selezionare la scheda `Amministratori del cluster`. Quindi fare clic sul pulsante **Crea admin** e compilare i campi richiesti.

Un amministratore non può eliminare il proprio utente. Per eliminare un amministratore, è necessario accedere con un altro amministratore del cluster esistente.

Gli amministratori possono modificare la propria password dalla scheda `Account` all'interno della pagina `Impostazioni`.

### Autenticazione a due fattori (2FA) {#configure-2fa-section}

L'autenticazione a due fattori (2FA) può essere utilizzata per aggiungere un ulteriore livello di sicurezza necessario per accedere all'interfaccia utente di gestione del cluster.

L'amministratore può abilitare la 2FA dalla scheda `Account` all'interno della pagina `Impostazioni`, facendo clic sul pulsante **Abilita 2FA**.

L'utente dovrà:

1. scaricare e installare l'applicazione 2FA preferita sullo smartphone
2. scansionare il codice QR con l'applicazione 2FA
3. generare un nuovo codice e copiarlo nel campo di verifica, quindi fare clic su **Verifica codice**

#### Applicazioni per smartphone

Esistono diverse applicazioni 2FA commerciali e open source:

Disponibili sia per Android che per iOS:

- [FreeOTP](https://freeotp.github.io/): disponibile sia per Android che per iOS
- [Authenticator](https://mattrubin.me/authenticator/): disponibile solo per iOS
- [2FAS](https://2fas.com/): disponibile sia per Android che per iOS

### Reimpostare la password dell'amministratore del cluster

Se si è bloccati fuori dall'interfaccia utente web ma si può ancora accedere a una shell della riga di comando del sistema come `root` (ad esempio tramite la console di ripristino del sistema o SSH), eseguire il seguente comando **sul nodo leader** per disabilitare la 2FA e reimpostare la password:

    api-cli run alter-user --data '{"user":"admin","set":{"password":"Nethesis,1234","2fa":false}}'

Sostituire il nome utente `admin` e la password `Nethesis,1234` con le credenziali desiderate.

:::note

Il comando sopra riportato fallisce con `AuthenticationError` se eseguito su un **nodo worker**. Eseguirlo solo sul nodo leader.

:::
## Traccia di controllo {#audit-trail-section}

Nella pagina della traccia di controllo, gli amministratori del cluster possono ispezionare tutte le azioni eseguite da qualsiasi altro amministratore. Ogni evento della traccia di controllo contiene almeno:

- data e ora dell'azione
- nome utente dell'amministratore del cluster
- nome dell'azione

Gli eventi della traccia di controllo possono essere filtrati per utente, data, tipo di azione e corrispondenza di testo personalizzata.

:::note

Le informazioni della traccia di controllo sono memorizzate nel disco del nodo leader. In caso di [promozione di un nuovo leader](#node-promotion-section), le informazioni della traccia di controllo nel vecchio leader non saranno più accessibili.

:::

**Note a piè di pagina**

[^1]: <https://en.wikipedia.org/wiki/Computer_cluster>
