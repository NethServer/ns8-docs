---
title: "FAQ: Domande frequenti"
sidebar_position: 7
---
# FAQ: Domande frequenti

## Che cos'è NethServer 8 (NS8)?

NethServer 8, noto anche come NS8, è un orchestratore di container semplice da usare. È pensato per gli amministratori Linux che hanno bisogno della flessibilità dei container, ma non vogliono avere a che fare con strumenti complessi come Kubernetes.

Come NethServer 7, NS8 nasconde la complessità del sistema dietro un'interfaccia web pronta all'uso e gradevole da utilizzare.

Vuoi gestire facilmente le applicazioni senza preoccuparti dei dettagli di installazione? NS8 fa per te.

## Qual è lo stato di NS8?

NethServer 8 ha raggiunto lo stato [stable](../administrator-manual/about/release_notes.md#releases-glossary): leggi le [note di rilascio](../administrator-manual/about/release_notes.md).

## Qual è la differenza tra NethServer 7 (NS7) e NethServer 8?

NethServer 7 è un sistema operativo costruito sopra CentOS 7. È fortemente accoppiato al sistema operativo sottostante. Installa le applicazioni tramite pacchetti RPM e le configura con un sistema di gestione della configurazione chiamato e-smith.

NethServer 8 può essere eseguito su diverse [distribuzioni Linux](../administrator-manual/installation/system_requirements.md#supported-distros-section). Installa le applicazioni tramite container e le configura usando un'architettura multi-nodo.

Come NS7, anche NS8 è perfettamente adatto a piccoli uffici e medie imprese.

## Cosa posso fare con NethServer 8?

Puoi fornire un dominio Active Directory con Samba 4 oppure un semplice server OpenLDAP. Puoi ospitare più istanze della stessa applicazione collegate a diversi domini utenti locali o remoti.

Se hai bisogno di un nuovo dominio utenti, ti basta creare un nuovo nodo e unirlo al cluster esistente: puoi distribuire il carico su più macchine. Naturalmente, hai tutto sotto controllo dall'interfaccia del nodo principale. Che i nodi siano locali o remoti, sono collegati in modo sicuro tramite una VPN cifrata.

Se preferisci un server all-in-one, puoi fare anche questo.

## Posso migrare da NethServer 7 a NethServer 8?

La migrazione alla release principale successiva è un obiettivo primario, come è sempre stato. La procedura di migrazione è documentata [qui](migration.md). Stiamo lavorando duramente per renderla *sicura* e *indolore*.

## Come posso installare NethServer 8?

Vedi il [capitolo sull'installazione](../administrator-manual/installation/install.md).

## Dove posso scaricarlo?

Puoi scaricare un'[immagine precompilata](../administrator-manual/installation/install.md#install_image-section) oppure semplicemente [installarlo](../administrator-manual/installation/install.md#install_linux-section) su una distribuzione supportata.

## Posso installare NethServer su una macchina virtuale?

Sì. Puoi scegliere qualsiasi hypervisor o cloud provider che supporti [queste distribuzioni](../administrator-manual/installation/system_requirements.md#supported-distros-section) oppure le [immagini precompilate](../administrator-manual/installation/install.md#install_image-section).

## Posso installarlo su hardware fisico?

Certo. Vedi la domanda seguente.

## Quale hardware è supportato?

Qualsiasi hardware supportato dalla distribuzione che hai scelto. Assicurati di consultare i [requisiti di sistema](../administrator-manual/installation/system_requirements.md).

## NethServer 8 include Cockpit?

No, NethServer 8 ha una User Interface completamente nuova. Puoi comunque [installare Cockpit](https://cockpit-project.org/running.html) per gestire il sistema sottostante, ad esempio cambiando la configurazione di rete.

## Posso usare NethServer 8 come firewall UTM?

No. NethServer 8 ha un firewall integrato limitato, usato solo per proteggere i servizi in esecuzione localmente.

Se stai cercando un buon progetto firewall, [NethSecurity](https://docs.nethsecurity.org) è il successore delle funzionalità firewall di NethServer 7.
