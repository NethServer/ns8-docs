---
title: Configurazione di rete del nodo
sidebar_position: 1
---
# Configurazione di rete del nodo

Una configurazione di rete funzionante potrebbe essere già fornita da una procedura automatica, come `cloud-init`. Se stai usando un VPS cloud, non modificare le impostazioni di rete del nodo e **leggi la documentazione del cloud provider** prima di cambiare il nome host del nodo.

Anche la **procedura di installazione del sistema operativo** può aiutarti a impostare una configurazione di rete funzionante per il tuo nodo. In questo caso fai riferimento alla documentazione del sistema operativo.

In ogni altro caso, se il nodo non è raggiungibile dalla rete, accedi alla console di sistema e prova a correggere la configurazione di rete con uno dei metodi seguenti.

I parametri di base per correggere la configurazione di rete del nodo sono:

1.  Il nome dell'interfaccia di rete pubblica, per esempio `eth0`
2.  Un indirizzo IP statico e una maschera di rete da assegnare, per esempio `192.168.12.3/24`
3.  L'indirizzo IP del gateway predefinito della rete. È un indirizzo IP nella stessa rete del tuo nodo, per esempio `192.168.12.1`
4.  L'indirizzo del server DNS. Può essere un servizio DNS pubblico, come Google `8.8.8.8` o `8.8.4.4`, Cloudflare `1.1.1.1`, oppure un server DNS privato. In ambienti piccoli potrebbe essere il gateway stesso.

## `nmtui`

`nmtui` (Text User Interface per controllare NetworkManager) è disponibile sulle distribuzioni EL, come CentOS Stream, Alma e Rocky Linux.

Avvia l'interfaccia testuale per modificare le connessioni di rete con:

    nmtui edit

Questo è un riepilogo delle funzioni da tastiera:

- Frecce e tasto Tab si spostano tra gli elementi dell'interfaccia (come pulsanti e campi del modulo)
- `Enter`, clic sul pulsante
- `Esc`, annulla e torna alla schermata precedente
- `Space`, modifica checkbox e selezione
- `Ctrl+C`, interrompe

Per applicare le modifiche, riavvia NetworkManager:

    systemctl restart NetworkManager
