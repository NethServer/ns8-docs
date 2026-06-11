---
title: Piler
sidebar_position: 15
---
# Piler

[Piler](https://www.mailpiler.org/) è una soluzione di archiviazione di posta aperta.

Questa applicazione Piler per NS8 configura un'istanza [Mail server](mail.md) che funge da archivio, registrando qualsiasi messaggio inviato o ricevuto dal server per una durata configurabile. Se un messaggio viene perso, gli utenti autorizzati (noti come "auditor") possono accedere al Piler UI, cercare il messaggio nell'archivio, e inviarlo al destinatario originale.

:::note

1.  Questa applicazione consente agli utenti revisori di visualizzare i messaggi di posta di altri utenti. Assicurarsi che il suo utilizzo sia conforme alle leggi sulla privacy del vostro paese, alle normative e alle politiche aziendali.
2.  Dopo la configurazione iniziale, Piler inizia con le credenziali di default. Per motivi di sicurezza, fare riferimento alla sezione [Default credentials](#default-piler-credentials) per modificare immediatamente le password di default.

:::

## Configurazione

Once installed, navigate to the application Settings page and fill in the required fields:

- **Piler FQDN**: Inserire il nome di dominio completamente qualificato dove l'interfaccia utente web Piler sarà accessibile. Se la FQDN è già registrata nel DNS pubblico, è possibile abilitare l'interruttore **Let's Encrypt certificate** per ottenere un certificato di crittografia valido.
- **HTTP a HTTPS**: Abilitare questo interruttore per garantire che tutte le comunicazioni con l'interfaccia utente Piler siano crittografate. Questo è consigliato se l'interfaccia utente è accessibile attraverso una rete pubblica o non attendibile.
- \*\* server di posta\*\* Scegli una delle istanze del server Mail nel cluster. Sono etichettate come segue:
  1.  *Archiving can be configured*: This means the Mail server currently has no archive configured and can be safely selected.
  2.  *The archive destination is…*: This indicates that the Mail server already copies any message sent or received to another archive or external email address. If such an entry is selected and the form is saved, the previous configuration is overwritten, so use it with caution. See also the Mail [Always BCC](mail.md#mail-archive-section) setting.
- \*\* Durata della conservazione \*\* Questo campo contiene il numero di giorni che un messaggio e-mail viene mantenuto nell'archivio. Dopo quel periodo, un lavoro di cron quotidiano purifica il messaggio dall'archivio.

It is important to understand that the Mail server selection is allowed only once during the configuration of a Piler instance. In other words, you cannot change the Mail server selection once the Piler instance is initially configured.

:::warning

Se viene selezionato un server Mail errato, non è possibile modificare la selezione. Il modo preferito per recuperare da questa situazione è quello di rimuovere l'istanza Piler errata, quindi installare e configurare una nuova.

:::

Other configuration settings can be changed as needed.

## Default credentials {#default-piler-credentials}

Dopo la configurazione iniziale, Piler inizia con le credenziali di default. Per motivi di sicurezza, le password predefinite devono essere immediatamente modificate per i due account predefiniti esistenti:

1.  User `admin@local`: This user has full administrative rights over the Piler application. They can create new user accounts and grant any kind of rights. However, they cannot read email messages archived in the Piler DB. The default password is `pilerrocks`.
2.  Utente `auditor@local`: Questo utente, come suggerisce il nome, ha il ruolo *auditor*. Possono cercare qualsiasi messaggio di posta elettronica nell'archivio e inviarlo al destinatario originale. La password predefinita è `auditor`.

Dopo aver effettuato l'accesso al sito web Piler, passare a Impostazioni sotto il menu nell'angolo in alto a destra dello schermo. Scorrere verso il basso della pagina Impostazioni personali, inserire la nuova password nei due campi di password (il secondo è per la conferma), e inviare il modulo.

Administrators can change the password of other users from the **Users** action under the Administration menu.

## Restore email messages

Gli utenti di Auditor possono cercare e recuperare i messaggi di posta elettronica archiviati.

Quando un messaggio viene gestito dal server Mail, viene inviata una copia all'archivio. Tuttavia, Piler non indicizza immediatamente i messaggi ricevuti. Sono inseriti in una coda di archivio, e ogni mezz'ora, un'attività pianificata indicizza un lotto di messaggi in coda. I messaggi duplicati contano come uno.

Una volta indicizzato un messaggio, gli auditor possono cercarlo. I messaggi trovati possono essere scaricati o inoltrati a un indirizzo e-mail arbitrario.

Se vengono selezionati più messaggi, vengono compressi in un archivio ZIP prima del download.

When one or more messages are forwarded to an email address, the message and its original headers are preserved. Therefore, when received, the message will be sorted with its original date. Furthermore, Piler adds a MIME header `X-piler-id` to forwarded messages.

## Importa email esistente

Existing email messages can be imported from the chosen Mail server instance into the Piler archive.

:::warning

Il processo di importazione può richiedere ore o anche giorni, a seconda del numero di utenti e della dimensione delle loro caselle di posta. Inoltre, l'indicizzazione dei messaggi è un'operazione a memoria e ad alta intensità di CPU che può influenzare le prestazioni dei nodi.

:::

Access a root terminal and run the following command:

    runagent -m piler1 import-emails --help

Sostituisci `piler1` con l'identificatore corretto dell'istanza dell'applicazione Piler, visibile nella pagina Stato. Il comando sopra stampa solo il testo di aiuto di comando.

The optional command arguments `-A` (after) and `-B` (before) can limit the time range for the import. As times must be expressed in Unix timestamp format, the `date` command can be invoked to obtain the desired timestamp from a date string, for example:

    date -d 2024-05-01 +%s

## Fine-tune Piler's configuration

Dopo che l'applicazione è stata configurata per la prima volta e protetta modificando le credenziali degli utenti predefiniti, Piler è pronto ad archiviare e-mail.

Si tratta di un breve elenco di compiti di configurazione comuni, con link alla documentazione ufficiale:

- **Amministrazione attività**, per gestire utenti, autorizzazioni e controllare il registro di audit.
- **Rules e policy**, per definire quali messaggi vengono archiviati e per quanto tempo rimarranno. Ad esempio, è possibile definire una politica speciale per i messaggi di spam.

Si noti che la documentazione ufficiale dell'amministrazione si riferisce alla "edizione intrapresa" di Piler; quindi, alcuni contenuti non sono rilevanti per la "edizione comunitaria", che è la base dell'applicazione NS8.

## Limitazioni conosciute

1.  I messaggi e-mail ricevuti con [Imapsync](imapsync.md) non sono archiviati.

2.  Some features are not active/effective but are still visible in the Piler UI.

    For administrators:

    - Nel menu Amministrazione, l'azione **Import**.
    - Nel menu Monitor, l'azione **Archive accounting**.

    Per i revisori:

    - Nell'area della schermata di anteprima del messaggio, il \*\* Ripristina all'azione mailbox\*\*.
