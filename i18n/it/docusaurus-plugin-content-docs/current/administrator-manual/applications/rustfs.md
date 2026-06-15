---
title: RustFS
sidebar_position: 16
---
# RustFS

[RustFS](https://rustfs.com/) offre uno storage a oggetti compatibile con S3 ad alte prestazioni.

Questa applicazione NS8 fornisce un'installazione RustFS di base su singolo nodo e singolo disco, adatta ai piccoli ambienti.

Puoi installare più istanze di RustFS sullo stesso nodo dal [Software center](../installation/software_center.md).

## Requisiti hardware

Le prestazioni del disco devono essere adeguate al carico di lavoro, altrimenti l'healthcheck automatico di RustFS contrassegna il disco come guasto. In una installazione a disco singolo questo significa che il servizio resta offline finché l'applicazione non viene riavviata dalla pagina Applicazioni di NS8.

Consulta la documentazione ufficiale di RustFS per una [checklist hardware di base](https://docs.rustfs.com/installation/checklists/hardware-checklists.html).

## Configurazione

Alcuni client S3 non supportano correttamente gli endpoint API esposti sotto un prefisso di percorso. Per una migliore compatibilità, è necessario assegnare due nomi server distinti: uno dedicato all'endpoint del protocollo S3 e un altro dedicato alla console amministrativa.

Prima di procedere con la configurazione, assicurati di creare i record di nome corrispondenti nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere i corrispondenti record DNS pubblici.

Come configurare:

1.  accedi alla pagina di configurazione dell'applicazione e inserisci il `API server host name`: sarà l'FQDN usato dagli host per connettersi ai servizi S3, ad esempio `s3.example.org`, `storage.example.org`
2.  compila il campo `Web interface host name`: potrai configurare la tua istanza RustFS da questo FQDN, ad esempio `rustfs.example.org`
3.  abilita l'opzione `Let's Encrypt` in base alle tue esigenze
4.  compila `rustfs root user name` e `rustfs root password`: sono le credenziali di accesso
5.  fai clic sul pulsante **Save**
6.  apri nel browser il nome host inserito, ad esempio `https://rustfs.example.org`.
