---
title: Applicazioni
sidebar_position: 5
---
# Applicazioni

La pagina `Applicazioni` elenca le applicazioni installate nel cluster. L'elenco può essere filtrato per:

- `Tipo`, ad esempio per elencare solo le applicazioni Nextcloud.
- `Nodo`, per limitare l'elenco alle applicazioni installate su un nodo specifico del cluster.
- Testo libero, per visualizzare solo le applicazioni che corrispondono a una determinata stringa.

Un singolo clic sul **nome** dell'applicazione apre la sua pagina di configurazione.

Un clic sul **tipo** dell'applicazione mostra informazioni dettagliate sull'applicazione stessa. Queste informazioni, inclusa la **versione**, sono disponibili anche nella pagina [Centro software](software_center.md).

Ogni elemento nell'elenco dispone di un **menu a tre punti** con le **azioni** disponibili per quella specifica applicazione.

Le applicazioni installate sono elencate anche nel **cassetto delle applicazioni**, cliccando sul menu ![cassetto delle applicazioni](/_static/bento.png) nell'angolo in alto a destra dello schermo. Il cassetto mostra solo le applicazioni installate, non quelle disponibili per l'installazione.
## Il nome dell'applicazione

Ogni volta che un'applicazione viene aggiunta al cluster, viene identificata in modo univoco dal suo nome seguito da un numero sequenziale. Data l'applicazione *Myapp*, le istanze installate saranno denominate `myapp1`, `myapp2` e così via.

Questo identificativo interno e univoco viene assegnato dal cluster e non può essere modificato, ma l'azione `Edit label` consente di assegnare un'etichetta personalizzata.

Inoltre, è possibile allegare una breve nota di testo all'applicazione tramite l'azione `Edit note`. Quando un'applicazione ha una nota allegata, accanto al nome dell'applicazione appare una piccola *i* cerchiata con un tooltip.
## Clona e sposta {#move_clone-section}

Le azioni `Clone` e `Move` creano un'applicazione **di destinazione** che è una copia di quella **di origine**.

Il nodo del cluster su cui viene eseguita l'applicazione di destinazione può essere lo stesso di quello di origine. Tuttavia, quando si sposta un'applicazione, è necessario selezionare un nodo di destinazione diverso da quello su cui l'origine è attualmente in esecuzione.

In generale, non ci sono limitazioni nell'esecuzione di più applicazioni dello stesso tipo sullo stesso nodo. Tuttavia, in alcuni casi, la clonazione o lo spostamento su determinati nodi potrebbe essere limitato a causa di politiche applicative, limiti di risorse del nodo (CPU, memoria) o perché l'applicazione richiede accesso esclusivo a una risorsa di sistema, come il binding a una porta TCP fissa.

Una volta avviate, le azioni `Clone` e `Move` seguono questi passaggi:

1. Creare l'applicazione di destinazione. Questo passaggio può includere la selezione di un volume aggiuntivo per i dati dell'applicazione, come spiegato in [Installare applicazioni](software_center.md#install-applications).
2. Avviare il trasferimento dei dati tra origine e destinazione. Durante questo passaggio, l'applicazione di origine rimane attiva.
3. Arrestare brevemente l'applicazione di origine (quando richiesto dalla sua strategia di sincronizzazione dei dati).
4. Eseguire la sincronizzazione finale dei dati.
5. L'ultimo passaggio differisce tra le due azioni:
   - *Per Clone*, avviare sia l'applicazione di origine che quella di destinazione.
   - *Per Move*, **avviare l'applicazione di destinazione** e **rimuovere quella di origine**.

Se l'applicazione spostata è referenziata da un fully qualified domain name (FQDN), assicurarsi che i record DNS esterni siano aggiornati per puntare al nodo di destinazione. Il reverse proxy del cluster viene riconfigurato automaticamente.
## Riavvia applicazione

L'azione `Restart` interrompe completamente l'applicazione e riavvia i suoi servizi, eseguendo le stesse operazioni normalmente effettuate al momento dell'avvio del nodo.

Questa azione dovrebbe essere utilizzata con parsimonia e preferibilmente al di fuori degli orari lavorativi, poiché interrompe il funzionamento dell'applicazione con effetti imprevedibili sull'esperienza dell'utente finale.

Alcuni eventi imprevedibili, come la mancanza di spazio su disco o l'esaurimento della memoria, possono degradare la funzionalità dell'applicazione. In queste situazioni, `Restart` potrebbe risolvere il problema, a condizione che le risorse sufficienti siano nuovamente disponibili.
## Applicazioni principali

Dalla pagina `Applications`, seleziona il pulsante **Core apps** per visualizzare un elenco completo delle applicazioni principali installate e delle loro versioni. Gli aggiornamenti delle applicazioni principali, quando disponibili, vengono sempre applicati contemporaneamente.
## Il termine *modulo*

Il termine *modulo* è spesso utilizzato dagli sviluppatori. Un'applicazione NS8 è implementata da un'unità chiamata *modulo*. Di solito è composta da uno o più container Linux e da un'interfaccia utente per la sua configurazione. Un modulo è l'unità distribuibile gestita dall'orchestratore del cluster.

I termini *applicazione* e *modulo* sono quasi sinonimi nel contesto di NS8. Tuttavia, alcuni moduli forniscono servizi ad altri moduli e non includono un'interfaccia utente per la configurazione. Ad esempio, i componenti Core come [Loki](../configuration/log_server.md#logs-persistence-section) e [Grafana](../configuration/metrics.md#grafana_access-section) sono implementati come moduli in esecuzione sul nodo leader.
