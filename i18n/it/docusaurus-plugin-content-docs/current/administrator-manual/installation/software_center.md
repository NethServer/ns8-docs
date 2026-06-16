---
title: Centro software
sidebar_position: 4
---
# Centro software

La pagina Centro Software visualizza e gestisce le applicazioni disponibili da tutti i repository configurati.
## Informazioni sull'applicazione

Ogni applicazione è rappresentata da una scheda che mostra il suo nome, il livello di certificazione e la categoria. Fare clic sul nome dell'applicazione per visualizzare informazioni dettagliate come screenshot, autore, ultima versione, immagini del container e link alla documentazione, al codice sorgente e al bug tracker.

Alcune applicazioni potrebbero includere Termini e Condizioni aggiuntivi; se presenti, leggerli attentamente.

:::tip

Per informazioni dettagliate sui componenti core installati, fare riferimento a [Aggiornamenti core](#core_updates-section).

:::
## Livelli di certificazione {#certification-levels}

Le applicazioni sono certificate ai seguenti livelli:

- **Livello 1/5**: L'applicazione è ospitata da un repository personalizzato (o non fa parte di alcun repository) e non è certificata.
- **Livello 2/5**: L'applicazione è ospitata dal repository `nethforge` ed è certificata dalla comunità NethServer.
- **Livello 3/5**: L'applicazione è ospitata dai repository `default` o `subscription` ed è certificata da Nethesis.
- **Livello 4/5**: L'applicazione è sviluppata e mantenuta dagli sviluppatori di Nethesis.
- **Livello 5/5**: L'applicazione è sviluppata e mantenuta dagli sviluppatori di Nethesis ed è coperta dal supporto Nethesis.

I livelli di certificazione sono determinati in base ai seguenti fattori:

1.  **Repository**: Per essere elencata in un repository pubblico, un'applicazione deve superare un processo di revisione. L'inclusione in un repository pubblico stabilisce il livello base di certificazione dell'applicazione.
2.  **Origine**: Il registro delle immagini del container che ospita l'applicazione identifica la persona o l'organizzazione che la distribuisce. Attualmente, i registri riconosciuti sono `ghcr.io/nethserver` e `ghcr.io/nethesis`.
3.  **Supporto**: Se il cluster ha un abbonamento attivo e il supporto a pagamento è disponibile per l'applicazione (sia che sia incluso nel piano di abbonamento attuale o meno). Vedi [Abbonamento](../about/subscription.md) per ulteriori informazioni.
## Installare applicazioni {#install-applications}

Per installare una nuova applicazione, fare clic sul pulsante **Installa** della scheda dell'applicazione.

- Se il cluster ha più nodi, sarà necessario selezionare anche il nodo di destinazione.

- Alcune applicazioni -- come Samba, Nextcloud e Mail -- potrebbero richiedere un ampio spazio su disco e supportare la selezione di volumi aggiuntivi, se il nodo di destinazione ne fornisce uno, come spiegato nella sezione [Configurare volumi aggiuntivi](#additional-volumes-section).

  Il selettore di volumi mostra la directory di montaggio del volume, l'etichetta del filesystem e l'utilizzo dello spazio.

Per installare più applicazioni dello stesso tipo, fare clic sul link `Instances` all'interno della scheda dell'applicazione. Quindi, selezionare **Installa nuova istanza**. Si noti che in alcuni casi l'installazione su determinati nodi del cluster potrebbe essere limitata a causa di politiche dell'applicazione o limitazioni delle risorse del nodo.

### Configurare volumi aggiuntivi {#additional-volumes-section}

Le applicazioni che ospitano una grande quantità di dati potrebbero non essere compatibili con il *volume predefinito* dove solitamente risiede il filesystem root del nodo.

Quando NS8 installa un'applicazione che ha tali requisiti speciali di dati su un nodo che fornisce uno o più volumi aggiuntivi, l'amministratore di sistema può decidere quale utilizzare o scegliere il volume predefinito.

Il volume aggiuntivo deve essere configurato prima che l'applicazione venga installata.

:::warning

La procedura di configurazione di un volume aggiuntivo potrebbe causare la perdita di dati. Richiede una certa esperienza con la riga di comando di Linux, pertanto si consiglia vivamente di testare questa procedura su un sistema non di produzione.

:::

NFS non è supportato come volume aggiuntivo. A differenza di iSCSI o dei protocolli equivalenti di dischi di rete a blocchi, che si presentano come dispositivi a blocchi che puoi formattare localmente, NFS gestisce il filesystem in remoto e non gestisce il mapping degli ID utente richiesto dalle applicazioni containerizzate.

Quando si configura un volume aggiuntivo su un nodo NS8, seguire la seguente lista di controllo:

- Assicurarsi che il volume non sia già montato altrove. Più punti di montaggio per lo stesso disco potrebbero causare problemi di rilabeling SELinux. Il seguente comando elenca brevemente i punti di montaggio esistenti:

      findmnt --real

- Se il volume non esiste ancora, formattarlo con i filesystem `xfs` o `ext4`. Le loro caratteristiche e impostazioni predefinite corrispondono alle aspettative di NS8.

  Utilizzare `lsblk` per elencare i dispositivi a blocchi (dischi o partizioni) disponibili sul nodo e il comando `mkfs` per creare un nuovo filesystem su uno di essi. Prestare attenzione, formattare il dispositivo sbagliato distruggerà i dati.

- Impostare un'etichetta per il filesystem (ad esempio `LABDISK0`) per riconoscere facilmente il volume. Questo potrebbe anche semplificare la configurazione di `/etc/fstab` o dell'unità `.mount` di Systemd. I comandi correlati sono `xfs_admin`, `e2label`, `tune2fs`.

- Montare il volume sotto i percorsi base `/mnt` o `/srv`. Sono comunemente utilizzati per questo scopo. Ad esempio, creare una directory di punto di montaggio e montare il volume su di essa:

      mkdir /srv/disk0
      mount /dev/disk/by-label/LABDISK0 /srv/disk0

- Assicurarsi che il volume venga montato automaticamente all'avvio. Aggiungere una voce a `/etc/fstab` per il volume montato:

      findmnt -no SOURCE,TARGET,FSTYPE,OPTIONS /srv/disk0 >> /etc/fstab

  Si consiglia vivamente di eseguire un test di riavvio.

Il nodo leader del cluster NS8, dove è in esecuzione il Software Center, richiede alcuni minuti per registrare la modifica della configurazione e presentare la selezione del volume aggiuntivo la prossima volta che viene installata un'applicazione che lo supporta.

Per casi d'uso avanzati, in cui un'applicazione non abilita la selezione automatica del volume, è comunque possibile assegnare un volume arbitrario seguendo [Reindirizzare i punti di montaggio dei volumi denominati di Podman](../../tutorial/disk_usage.md#named-volume-disk).
## Applicazioni installate {#application-instances}

Una volta installata un'applicazione, fai clic sul link `Instances` all'interno della scheda dell'applicazione. È possibile eseguire varie azioni su ciascuna istanza facendo clic sul menu a tre punti:

- `Update to testing version`: Questa azione è visibile solo quando è disponibile una versione di testing. Esamina attentamente la documentazione pre-release o consulta lo sviluppatore dell'app prima di procedere.
- `Add to favorites`: Fissa l'applicazione in cima al **cassetto delle applicazioni**.
- `Edit instance label`: Aggiungi un nome personalizzato all'istanza.
- `Clone`: Clona l'applicazione. Vedi [Clone and move](modules.md#move_clone-section).
- `Move`: Sposta l'applicazione su un altro nodo. Vedi [Clone and move](modules.md#move_clone-section).
- `Restart instance`: arresta tutti i componenti dell'applicazione e riavviali, simile a un riavvio del sistema ma limitato all'applicazione.
- `Uninstall`: Rimuovi l'applicazione e tutti i dati correlati.

La [pagina delle applicazioni](modules.md) è un'alternativa completa per gestire le applicazioni installate nel cluster.

Le applicazioni installate sono elencate anche nel **cassetto delle applicazioni**, facendo clic sul menu ![application drawer](/_static/bento.png) nell'angolo in alto a destra dello schermo.
## Repository software {#software_repositories-section}

Un repository software di NS8 è un indice di applicazioni e una raccolta dei loro metadati.

Puoi accedere alla lista dei repository configurati in diversi modi:

- Nella pagina `Impostazioni`: clicca sulla scheda `Repository software`.
- Nella pagina `Centro software`: clicca sull'elemento `Repository software` nel menu a tre punti nell'angolo in alto a destra.

NS8 include un set predefinito di repository software, alcuni abilitati e altri disabilitati:

- `default`: Contiene applicazioni sviluppate e mantenute principalmente dagli sviluppatori di NethServer. Traccia anche gli aggiornamenti per i moduli core di NS8 e per il core stesso.
- `nethforge`: Un repository di applicazioni costruite e mantenute dalla comunità di NethServer. È inizialmente disabilitato.
- `subscription`: Aggiunto e abilitato quando il cluster ha un abbonamento attivo. Sovrascrive i contenuti del repository `default` con un programma di aggiornamenti gestito da Nethesis. Vedi [Abbonamento](../about/subscription.md) per dettagli.

Per aggiungere un repository personalizzato, clicca sul pulsante **Aggiungi repository** e compila i campi richiesti:

- `Nome`: Un nome univoco per il repository.
- `URL`: L'URL pubblico del repository. Deve essere un valido [repository NS8](https://nethserver.github.io/ns8-core/modules/metadata/).
- `Stato`: Seleziona questa opzione per abilitare il repository.

Nota che se la stessa applicazione è elencata in più repository, verrà considerata quella proveniente dal repository con la priorità più alta. La priorità del repository è determinata dall'ordine alfabetico dei nomi dei repository, con quelli più avanti nell'alfabeto (es. "Z") che hanno una priorità più alta rispetto a quelli più indietro (es. "A").

Puoi aggiornare i metadati cliccando sul pulsante **Ricarica repository**.
## Aggiornamenti {#updates-section}

Se i repository abilitati contengono un aggiornamento per un'istanza di applicazione installata o per qualsiasi componente principale, un messaggio di avviso viene visualizzato nella parte superiore della pagina del Software Center. È possibile verificare se ci sono aggiornamenti disponibili anche accedendo alla pagina `Cluster status`.

NethServer 8 può gestire due diversi tipi di aggiornamenti:

- [Aggiornamenti del core](#core_updates-section)
- [Aggiornamenti delle applicazioni](#module_updates-section)

Gli [aggiornamenti del sistema operativo](../../tutorial/os_updates.md) sono delegati alla distribuzione Linux sottostante.

Se si dispone di un abbonamento attivo, gli aggiornamenti disponibili (inclusi gli aggiornamenti del sistema operativo) vengono applicati automaticamente come descritto in [Aggiornamenti pianificati](../about/subscription.md#scheduled-updates).

### Aggiornamenti del core {#core_updates-section}

NS8 è composto dal core e da diversi moduli. Ogni componente del core ha il proprio numero di versione, e il Software Center mostrerà un avviso quando è disponibile un aggiornamento.

- *Core* contiene l'interfaccia utente web, il server API, gli agenti che gestiscono i container e i motori di backup.
- *LDAP proxy* è un server proxy per connessioni TCP LDAP che gestisce tutte le connessioni dalle applicazioni ai [provider di dominio utente](user_domains.md) (ogni nodo)
- [Traefik proxy](../configuration/proxy.md) (ogni nodo)
- [Loki log server](../configuration/log_server.md) (solo nodo leader)
- [Metrics](../configuration/metrics.md) (solo nodo leader)
- [Samba Active Directory](user_domains.md#active_directory-section) (opzionale)
- [OpenLDAP](user_domains.md#openldap-section) (opzionale)

È possibile esaminare in qualsiasi momento i componenti attualmente installati su ciascun nodo del cluster. Per farlo, cliccare sul menu a tre punti nell'angolo in alto a destra della pagina `Software Center`, quindi selezionare `Core apps`. Cliccare su **Update core** per applicare gli aggiornamenti.

Gli aggiornamenti dei moduli core vengono sempre applicati tutti insieme per evitare incongruenze di versione.

### Aggiornamenti delle applicazioni {#module_updates-section}

L'elenco degli aggiornamenti disponibili è visualizzato nella scheda `Updates` del [Software center](#). Il Software Center mostra una scheda per ogni applicazione con aggiornamenti disponibili.

È possibile applicare tutti gli aggiornamenti delle applicazioni cliccando sul pulsante **Update all apps**.

Cliccando sul pulsante **Review and update** nella scheda dell'applicazione, si vedranno tutte le istanze del modulo che richiedono un aggiornamento. È possibile aggiornare ogni istanza separatamente cliccando sul pulsante **Update**. Se si preferisce aggiornare tutte le istanze dello stesso modulo, basta cliccare sul pulsante **Update all instances**.
