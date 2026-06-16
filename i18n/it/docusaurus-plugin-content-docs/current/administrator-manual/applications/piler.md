---
title: Piler
sidebar_position: 15
---
# Piler

[Piler](https://www.mailpiler.org/) è una soluzione open source per l'archiviazione della posta.

Questa applicazione Piler per NS8 configura un'istanza di [Mail server](mail.md) come archivio, registrando ogni messaggio inviato o ricevuto dal server per una durata configurabile. Se un messaggio viene perso, gli utenti autorizzati (detti "auditor") possono accedere all'interfaccia di Piler, cercare il messaggio nell'archivio e reinviarlo al destinatario originale.

:::note

1.  Questa applicazione consente agli utenti auditor di visualizzare i messaggi di posta di altri utenti. Assicurati che il suo utilizzo sia conforme alle leggi sulla privacy, alle normative e alle politiche aziendali del tuo Paese.
2.  Dopo la configurazione iniziale, Piler parte con credenziali predefinite. Per motivi di sicurezza, fai riferimento alla sezione [Credenziali predefinite](#default-piler-credentials) per cambiare immediatamente le password predefinite.

:::

## Configurazione

Una volta installata, apri la pagina Settings dell'applicazione e compila i campi richiesti:

- **Piler FQDN**: inserisci il nome di dominio completo con cui sarà accessibile l'interfaccia web di Piler. Se l'FQDN è già registrato nel DNS pubblico, puoi abilitare l'opzione **Let's Encrypt certificate** per ottenere un certificato di cifratura valido.
- **HTTP to HTTPS**: abilita questa opzione per garantire che tutte le comunicazioni con l'interfaccia di Piler siano cifrate. È consigliato se l'interfaccia è accessibile tramite una rete pubblica o non attendibile.
- **Mail server**: scegli una delle istanze di Mail server nel cluster. Sono etichettate come segue:
  1.  *Archiving can be configured*: significa che il Mail server al momento non ha alcun archivio configurato e può essere selezionato in sicurezza.
  2.  *The archive destination is…*: indica che il Mail server sta già copiando ogni messaggio inviato o ricevuto verso un altro archivio o indirizzo email esterno. Se selezioni una voce di questo tipo e salvi il modulo, la configurazione precedente viene sovrascritta, quindi usala con cautela. Vedi anche l'impostazione Mail [Always BCC](mail.md#mail-archive-section).
- **Retention duration**: questo campo contiene il numero di giorni per cui un messaggio email viene conservato nell'archivio. Dopo quel periodo, un cron job giornaliero elimina il messaggio dall'archivio.

È importante capire che la selezione del Mail server è consentita una sola volta durante la configurazione di un'istanza Piler. In altre parole, non puoi cambiare la selezione del Mail server una volta completata la configurazione iniziale dell'istanza Piler.

:::warning

Se viene selezionato un Mail server errato, non esiste alcun modo per cambiare la selezione. Il modo preferito per recuperare da questa situazione è rimuovere l'istanza Piler errata, quindi installare e configurare una nuova istanza.

:::

Le altre impostazioni di configurazione possono essere modificate secondo necessità.

## Credenziali predefinite {#default-piler-credentials}

Dopo la configurazione iniziale, Piler parte con credenziali predefinite. Per motivi di sicurezza, le password predefinite devono essere cambiate immediatamente per i due account predefiniti esistenti:

1.  Utente `admin@local`: questo utente ha pieni diritti amministrativi sull'applicazione Piler. Può creare nuovi account utente e assegnare qualsiasi tipo di permesso. Tuttavia, non può leggere i messaggi email archiviati nel database di Piler. La password predefinita è `pilerrocks`.
2.  Utente `auditor@local`: questo utente, come suggerisce il nome, ha il ruolo di *auditor*. Può cercare qualsiasi messaggio email nell'archivio e reinviarlo al destinatario originale. La password predefinita è `auditor`.

Dopo aver effettuato l'accesso al sito web di Piler, apri Settings dal menu nell'angolo in alto a destra dello schermo. Scorri fino in fondo alla pagina delle impostazioni personali, inserisci la nuova password nei due campi password (il secondo serve per la conferma) e invia il modulo.

Gli amministratori possono cambiare la password di altri utenti tramite l'azione **Users** nel menu Administration.

## Ripristinare i messaggi email

Gli utenti auditor possono cercare e recuperare i messaggi email archiviati.

Quando un messaggio viene gestito dal Mail server, una copia viene inviata all'archivio. Tuttavia, Piler non indicizza immediatamente i messaggi ricevuti. Vengono inseriti in una coda di archiviazione e, ogni mezz'ora, un'attività pianificata indicizza un lotto di messaggi in coda. I messaggi duplicati contano come uno solo.

Una volta che un messaggio è stato indicizzato, gli auditor possono cercarlo. I messaggi trovati possono essere scaricati oppure inoltrati a un indirizzo email arbitrario.

Se vengono selezionati più messaggi, vengono compressi in un archivio ZIP prima del download.

Quando uno o più messaggi vengono inoltrati a un indirizzo email, il messaggio e le intestazioni originali vengono preservati. Di conseguenza, quando il messaggio viene ricevuto, sarà ordinato con la sua data originale. Inoltre, Piler aggiunge un'intestazione MIME `X-piler-id` ai messaggi inoltrati.

## Importare email esistenti

I messaggi email esistenti possono essere importati dall'istanza di Mail server scelta nell'archivio Piler.

:::warning

Il processo di importazione può richiedere ore o persino giorni, a seconda del numero di utenti e della dimensione delle loro caselle di posta. Inoltre, l'indicizzazione dei messaggi è un'operazione intensiva in termini di memoria e CPU e può influire sulle prestazioni del nodo.

:::

Accedi a un terminale root ed esegui il seguente comando:

    runagent -m piler1 import-emails --help

Sostituisci `piler1` con l'identificatore corretto dell'istanza applicativa Piler, visibile nella pagina Status. Il comando sopra stampa solo il testo di aiuto del comando.

Gli argomenti facoltativi `-A` (after) e `-B` (before) possono limitare l'intervallo temporale dell'importazione. Poiché i tempi devono essere espressi nel formato timestamp Unix, puoi usare il comando `date` per ottenere il timestamp desiderato da una stringa data, per esempio:

    date -d 2024-05-01 +%s

## Ottimizzare la configurazione di Piler

Dopo che l'applicazione è stata configurata per la prima volta e messa in sicurezza cambiando le credenziali degli utenti predefiniti, Piler è pronto per archiviare le email.

Questo è un breve elenco di attività di configurazione comuni, con link alla documentazione ufficiale:

- [Attività di amministrazione](https://docs.mailpiler.com/piler-ee/administering/#administrator-tasks), per gestire utenti, permessi e controllare l'audit log.
- [Regole e criteri](https://docs.mailpiler.com/piler-ee/administering/#rules-and-policies), per definire quali messaggi vengono archiviati e per quanto tempo restano nell'archivio. Per esempio, puoi definire un criterio speciale per i messaggi spam.

Tieni presente che la documentazione ufficiale di amministrazione fa riferimento alla "enterprise edition" di Piler; di conseguenza, alcuni contenuti non sono pertinenti per la "community edition", che è la base dell'applicazione NS8.

## Limitazioni note

1.  I messaggi email ricevuti con [Imapsync](imapsync.md) non vengono archiviati.

2.  Alcune funzionalità non sono attive/efficaci, ma sono ancora visibili nell'interfaccia di Piler.

    Per gli amministratori:

    - Nel menu Administration, l'azione **Import**.
    - Nel menu Monitor, l'azione **Archive accounting**.

    Per gli auditor:

    - Nell'area di anteprima del messaggio, l'azione **Restore to mailbox**.
