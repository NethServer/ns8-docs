---
title: Utilizzo del disco
sidebar_position: 3
---
# Utilizzo del disco

NethServer 8 usa [Podman](https://podman.io/) per gestire i container OCI.

- Le applicazioni rootless richiedono più spazio. Salvano i propri dati nella home directory dell'utente, ad esempio `/home/loki1/.local/share/containers/storage`, `/home/loki1/.config`
- Le applicazioni rootful in genere archiviano i dati nelle directory `/var/lib/containers/storage` e `/var/lib/nethserver`

Esamina le directory predefinite usate da Podman con comandi come questi:

    podman info -f json | jq -r '.store.graphRoot'
    podman info -f json | jq -r '.store.volumePath'

Per le applicazioni rootless, anteponi `runagent -m <module_id>`, ad esempio:

    runagent -m loki1 podman info -f json | jq -r '.store.graphRoot'
    runagent -m loki1 podman info -f json | jq -r '.store.volumePath'

Per ottenere l'elenco delle applicazioni in esecuzione sul nodo locale, esegui:

    runagent -l

I dati delle applicazioni includono:

- Immagini dei container, come codice binario, script, configurazione statica e tutto ciò che serve all'app per funzionare.
- Codice API, codice UI e la configurazione dinamica che generano per integrare l'applicazione con il resto del cluster.
- Dati degli utenti come file, messaggi e immagini, organizzati in *named volume* di Podman.

È sempre consigliabile **pianificare in anticipo dove archiviare i dati degli utenti**. Per decidere su quale disco risiederà un named volume prima di installare un'applicazione, consulta [Reindirizzare i punti di mount dei named volume di Podman](#named-volume-disk).

Tuttavia, quando NS8 esegue più applicazioni, l'utilizzo del disco aumenta rapidamente e potresti **esaurire lo spazio**. Se lo spazio disponibile diminuisce, valuta l'espansione del filesystem con i metodi descritti nelle sezioni seguenti.

## Espandere il filesystem con strumenti esterni

Come approccio generale, per espandere un filesystem devi prima ingrandire il dispositivo su cui è montato.

Spesso il dispositivo stesso è contenuto in un altro dispositivo, logico o fisico, come un volume logico o una partizione disco. In questo caso, bisogna espandere anche il volume logico o la partizione disco.

Su una macchina fisica, l'opzione migliore è configurare LVM durante l'installazione della distribuzione. LVM aiuta nella gestione dei dispositivi e sono disponibili molte guide pratiche che spiegano come raggiungere questo obiettivo.

Su una macchina virtuale, puoi espandere facilmente l'intero disco root e il filesystem. Se hai creato la VM con l'immagine precompilata, leggi la sezione seguente per i comandi dettagliati.

## Espandere il filesystem dell'immagine precompilata

Se NS8 è stato installato come macchina virtuale a partire dall'[immagine precompilata](../administrator-manual/installation/install.md#install_image-section) in formato QCOW2, segui questa procedura.

1.  Spegni il nodo e ridimensiona la sua immagine `.qcow2` dal sistema host. Per esempio:

        sudo qemu-img resize ns8-disk.qcow2 +50G

2.  Avvia il nodo ed espandi la sua quinta partizione (rimuovi l'opzione `--dry-run` quando sei sicuro):

        growpart --dry-run /dev/vda 5

3.  Espandi il filesystem root:

        xfs_growfs /

## Collegare un disco per le nuove applicazioni {#alt-home-section}

In qualsiasi momento della vita del nodo NS8, puoi montare un nuovo disco su un percorso alternativo, come `/home1`, e iniziare a installarvi applicazioni. Le applicazioni rootless esistenti continueranno a usare la loro home directory sul vecchio disco, mentre le nuove app verranno create sotto `/home1` e consumeranno il nuovo spazio disco.

1.  Crea il percorso base alternativo:

        mkdir -m 0755 /home1

2.  Monta il dispositivo sul nuovo percorso:

        mount /dev/some /home1

    Per rendere permanente il mount, modifica `/etc/fstab` oppure crea un'unità systemd `.mount`. Verifica che il dispositivo resti montato dopo un riavvio.

3.  Configura il node agent per usare `/home1` come directory base per le nuove applicazioni:

        runagent -m node configure-home-basedir --set /home1

## Migrare i dati di /home su un nuovo disco

Se la sezione precedente non è applicabile, valuta di aggiungere un nuovo disco e migrare i dati esistenti con uno script Bash incluso nel core: `migrate-home-disk.sh`. Questo script illustra i passaggi di base richiesti per la migrazione dei dati.

:::warning

Lo script incluso è solo un esempio e potrebbe non essere adatto al tuo sistema. USALO A TUO RISCHIO!

:::

Lo script:

- arresta tutte le applicazioni rootless
- copia tutte le applicazioni rootless sul nuovo disco
- recupera spazio dal filesystem root
- monta il nuovo disco sotto `/home`
- riavvia tutte le applicazioni rootless

Prima di eseguire lo script, assicurati di collegare il disco al nodo, formattarlo e montarlo in una posizione personalizzata come `/mnt/temp_disk`.

Quindi avvia lo script Bash passando come parametro il percorso di mount, ad esempio:

    bash /var/lib/nethserver/node/migrate-home-disk.sh /mnt/temp_disk

## Reindirizzare i punti di mount dei named volume di Podman {#named-volume-disk}

Le applicazioni organizzano i dati degli utenti con named volume di Podman, che normalmente risiedono sotto i percorsi predefiniti di Podman (vedi sopra).

Questa sezione spiega come preconfigurare i named volume in modo che vengano creati sotto percorsi base alternativi e quindi su dischi differenti. Lo stesso risultato può essere ottenuto anche dall'interfaccia cluster-admin, con più automazione e meno possibilità di scelta, quando un'applicazione viene installata per la prima volta (vedi [Installare applicazioni](../administrator-manual/installation/software_center.md#install-applications)), oppure quando viene ripristinata o clonata.

Qui consideriamo l'applicazione Mattermost, ma il metodo funziona per qualsiasi applicazione rootless NS8 che si affida ai named volume. Questo metodo non funziona con le applicazioni rootful.

Reindirizzare i named volume aiuta a ottenere una migliore organizzazione dello storage, riduce la pressione sul disco di sistema e allinea il posizionamento dei dati con le caratteristiche di prestazioni o capacità.

:::note

Configura l'assegnazione del named volume *prima* di installare, ripristinare o clonare l'applicazione rootless.

:::

Per esempio, l'applicazione Mattermost usa PostgreSQL come backend dati e potresti voler assegnare il named volume `postgres-data` a un disco veloce e dedicato per migliorare le prestazioni del database. Questo è uno scenario tipico in cui un disco ad alta velocità è dedicato ai carichi di lavoro del database, mentre il disco root gestisce il sistema operativo, le immagini dell'applicazione e gli altri dati.

Poiché NS8 non gestisce il mount dei dischi, l'amministratore di sistema deve garantirne l'affidabilità.

Ipotesi:

- Monta il disco sotto i percorsi base `/mnt` o `/srv`. Sono comunemente usati per questo scopo.
- Formatta il disco con filesystem `xfs` o `ext4`. Le loro funzionalità e impostazioni predefinite corrispondono alle aspettative di NS8.
- Imposta un'etichetta del filesystem (ad esempio `LABDISK0`) per riconoscere facilmente il disco. Può anche semplificare la configurazione di `/etc/fstab`.
- Dopo un riavvio del sistema, una voce in `/etc/fstab` oppure un'unità `.mount` di systemd monta correttamente il disco su `/srv/disk0`.
- Il disco non è montato altrove. Più punti di mount per lo stesso disco possono causare problemi di relabel SELinux.

Supponiamo che il disco sia già montato sotto `/srv/disk0` e formattato con un filesystem `xfs`. La configurazione del mount è persistente tramite una voce in `/etc/fstab` e sopravvive a un riavvio del sistema.

### Elencare i percorsi base disponibili

I punti di mount dei dischi costituiscono le directory base in cui i named volume verranno collocati con la configurazione personalizzata.

Ottieni l'elenco dei percorsi base con questo comando:

    volumectl list-base-paths
    /srv/disk0 (LABDISK0) size=2.0G available=1.9G used=46.5M

In questo esempio di output:

- Il primo campo, `/srv/disk0`, si riferisce al punto di mount del disco e sarà usato nei comandi successivi.
- `LABDISK0` è l'etichetta impostata durante la creazione del filesystem, se presente. È un'etichetta mnemonica che aiuta a identificare il disco. Se non è impostata alcuna etichetta, viene mostrata la directory base del punto di mount.
- I campi `size`, `available` e `used` si riferiscono alle informazioni sullo spazio disco.

### Usare il disco per volumi selezionati

Proseguiamo con l'esempio di Mattermost. La documentazione di ns8-mattermost descrive il named volume `postgres-data`, che contiene i file del database PostgreSQL usati da Mattermost.

Il comando seguente lo assegna a `LABDISK0` e ha effetto alla successiva installazione di Mattermost:

    volumectl add-volume postgres-data --for mattermost --target /srv/disk0

Controlla le assegnazioni visualizzando `/etc/nethserver/volumes.conf`. Questo file è in formato compatibile con INI:

    cat /etc/nethserver/volumes.conf

La prossima volta che Mattermost verrà installato sul nodo locale, il suo volume `postgres-data` sarà creato sotto `/srv/disk0`. La stessa configurazione viene applicata anche se Mattermost viene installato tramite le procedure di ripristino o clonazione.

### Cancellare le assegnazioni dei named volume

Per rimuovere un'assegnazione, elimina la riga corrispondente da `/etc/nethserver/volumes.conf` con un editor di testo, oppure esegui il comando seguente:

    volumectl remove-volume --for mattermost postgres-data

La rimozione dell'assegnazione non elimina alcun dato; aggiorna solo il file `volumes.conf`.

### Spostare i dati di un named volume su un nuovo disco

:::note

Il comando `volumectl` non supporta ancora lo spostamento dei dati di un volume su un disco diverso. Questa funzionalità è prevista per versioni future.

:::

## Recupero dello spazio SSD {#fstrim-periodic}

Sui sistemi basati su SSD o su storage thin-provisioned, i blocchi inutilizzati possono essere recuperati periodicamente con l'utilità `fstrim`. Questa operazione informa lo storage sottostante che determinati blocchi non sono più in uso, aiutando a mantenere costanti nel tempo le prestazioni di scrittura.

NS8 non abilita automaticamente il trimming per impostazione predefinita, perché la sua efficacia dipende dalla configurazione dello stack di storage (ad esempio LVM, VDO, RAID o dispositivi a blocchi virtualizzati). In alcuni ambienti, le operazioni di discard possono essere ignorate o non supportate.

Per abilitare il trimming periodico, attiva il timer systemd:

    systemctl enable --now fstrim.timer

Il timer viene eseguito settimanalmente per impostazione predefinita, con un ritardo casuale per evitare esecuzioni concorrenti su più sistemi.

Per verificare la prossima esecuzione pianificata:

    systemctl status fstrim.timer

È possibile anche eseguire l'operazione manualmente; tuttavia, poiché `fstrim` può generare un picco temporaneo di I/O durante l'esecuzione, conviene pianificarla nei periodi di bassa attività sui sistemi sensibili alle prestazioni. Eseguila manualmente con:

    fstrim -av

Assicurati che le operazioni di discard siano supportate e propagate attraverso i livelli di storage in uso. Nelle configurazioni complesse (ad esempio LVM, dm-crypt, VDO), potrebbe essere richiesta una configurazione aggiuntiva. Verifica il supporto con:

    lsblk --discard

Le colonne `DISC-GRAN` e `DISC-MAX` indicano la granularità del discard (TRIM) e la dimensione massima supportata da ciascun dispositivo. Valori diversi da zero significano che il discard è supportato, mentre `0B` indica che il dispositivo non supporta il discard oppure che non viene propagato attraverso lo stack di storage.
