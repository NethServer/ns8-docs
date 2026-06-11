---
title: Configurazione nodi della rete
sidebar_position: 1
---
# Configurazione nodi della rete

Una configurazione di rete funzionante potrebbe essere già fornita da una procedura automatica, come `cloud-init`. Se si esegue un VPS in cloud, non modificare le impostazioni di rete dei nodi, e **leggi la documentazione del cloud provider** prima di cambiare il nome dell'host del nodo.

Anche la **procedura di installazione del Sistema Operativo** può aiutare a configurare una rete funzionante per il nodo. In questo caso fare riferimento alla documentazione del sistema operativo.

In ogni altro caso, se il nodo non può essere raggiunto dalla rete, entrare nella console di sistema e cercare di correggere la configurazione di rete con uno dei seguenti metodi.

I parametri di base per correggere la configurazione di rete del nodo sono:

1.  Il nome dell'interfaccia di rete pubblica, per esempio `eth0`
2.  Un indirizzo IP statico e una maschera di rete da assegnare, ad esempio `192.168.12.3/24`
3.  L'indirizzo IP del gateway predefinito di rete. Si tratta di un indirizzo IP nella stessa rete del nodo, per esempio `192.168.12.1`
4.  L'indirizzo del server DNS. Può essere un servizio DNS pubblico, come Google `8.8.8.8` o `8.8.4.4`, Cloudflare `1.1.1.1`, o un server DNS privato. In piccoli ambienti potrebbe essere lo stesso host che funge da gateway.

## `nmtui`

La `nmtui` (Interfaccia utente testuale per il controllo di NetworkManager) è disponibile sulle distribuzioni EL, come CentOS Stream, Alma e Rocky Linux.

Avviare l'interfaccia di testo per modificare le connessioni di rete con:

    nmtui edit

Questo è un riassunto delle funzioni della tastiera:

- Le frecce e il tasto tabulatore muovono tra gli elementi dell' interfaccia (come pulsanti e campi del modulo)
- `Enter`, pulsante click
- `Esc`, annullare, tornare alla schermata precedente
- `Space`, modificare la casella di controllo, selezione
- `Ctrl+C`, abort

To apply the changes restart NetworkManager:

    systemctl restart NetworkManager
