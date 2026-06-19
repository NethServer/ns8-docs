---
title: Imapsync
---
# Imapsync

[Imapsync](https://imapsync.lamiral.info/) è uno strumento di trasferimento IMAP usato per copiare e spostare email tra server IMAP.

Sebbene Imapsync abbia un'ampia gamma di casi d'uso, l'applicazione Imapsync di NS8 si concentra sul trasferimento di email da server IMAP remoti a un'istanza dell'applicazione [Mail](mail.md). Serve a due scopi principali:

1.  **Migrazione di account IMAP**: i messaggi di un account IMAP remoto possono essere importati in un account Mail locale. L'importazione è ricorsiva, incrementale e può essere ripetuta quando necessario.
2.  **Recupero della INBOX**: i messaggi ricevuti nella cartella INBOX di un account IMAP remoto possono essere trasferiti periodicamente nella cartella INBOX di un account Mail locale. Vedi [Comprendere l'opzione "Only INBOX"](#only-inbox-mode) per i dettagli sul funzionamento di questo processo.

## Configurazione

Imapsync deve essere configurato per usare un modulo Mail esistente nel cluster NethServer 8. A questo scopo, deve ricevere l'accesso master user al modulo Mail. Vai alla pagina `Settings` e seleziona un'istanza Mail dal menu a discesa.

Dopo la configurazione, passa alla pagina `Tasks` e crea una o più attività di sincronizzazione. Fai clic su **Create task** e completa i campi del modulo come segue:

- **Local user**: seleziona l'account utente NS8 che riceverà le email sincronizzate.
- **Remote user**: inserisci il nome utente o l'indirizzo email da usare per autenticarti sul server IMAP remoto.
- **Remote password**: inserisci la password dell'account IMAP remoto. Se necessario, fai clic sull'icona dell'occhio per mostrarla.
- **IMAP server**: inserisci il nome host o l'indirizzo IP del server IMAP remoto, ad esempio `imap.example.org`.
- **IMAP TCP Port**: specifica il numero di porta del server IMAP:
  - `143` (predefinita) per la cifratura STARTTLS
  - `993` per la cifratura SSL/TLS
- **Select encryption**: scegli il metodo di cifratura richiesto dal server IMAP remoto:
  - `STARTTLS (default 143/tcp)`: aggiorna una connessione non cifrata a una connessione sicura.
  - `SSL/TLS (993/tcp)`: usa una connessione cifrata fin dall'inizio.
  - `None`: si connette senza cifratura (non consigliato).
- **Folder synchronization**: scegli quali cartelle sincronizzare dal server remoto:
  - `Only INBOX`: sincronizza solo la posta in arrivo principale. Questa opzione consente al filtro Sieve dell'utente di elaborare i messaggi durante ogni esecuzione dell'attività. Vedi [Comprendere l'opzione "Only INBOX"](#only-inbox-mode) per una spiegazione dettagliata.
  - `All folders`: sincronizza ricorsivamente tutte le cartelle disponibili.
  - `All except selected`: sincronizza tutte le cartelle tranne quelle specificate. Inserisci un nome di cartella per riga nell'area di testo. Le voci sono interpretate come espressioni regolari che corrispondono ai nomi delle cartelle remote.
- **Remote server messages deletion**: configura come gestire i messaggi sul server remoto dopo la sincronizzazione:
  - `Do not delete any message` (predefinito)
  - `Delete messages from the server after each sync`
  - `Delete messages older than a specified number of days` (comparirà un campo per specificare il periodo di conservazione)
- **Task frequency**: definisci la frequenza di esecuzione dell'attività:
  - `Not scheduled, manual execution only`: viene eseguita solo quando avviata manualmente.
  - `Run at a fixed interval (in minutes)`: viene eseguita automaticamente all'intervallo specificato.

Dopo aver compilato tutti i campi, fai clic su **Create task** per creare l'attività. Per annullare le modifiche, fai clic su **Cancel**.

### Comprendere l'opzione "Only INBOX" {#only-inbox-mode}

:::note

Per evitare modifiche impreviste al flag "Seen" richiesto da Imapsync, non accedere all'account IMAP remoto con altri client IMAP.

:::

Quando un messaggio viene trasferito da un'attività che usa l'opzione di sincronizzazione cartelle `Only INBOX`, viene contrassegnato nell'account remoto con il flag IMAP "Seen". I client IMAP mostrano comunemente i messaggi senza il flag "Seen" come "Nuovi" o "Non letti".

I messaggi con il flag "Seen" vengono ignorati da Imapsync nei trasferimenti successivi. Questo evita di trasferire di nuovo messaggi che sono stati spostati dalla INBOX locale nel Cestino o in un'altra cartella.

Usare il flag "Seen" come condizione di trasferimento consente anche di applicare in sicurezza il filtro Sieve dell'utente ai messaggi trasferiti.

### NethServer come server IMAP remoto

Se il server IMAP remoto è un'istanza NethServer, puoi configurare l'attività di sincronizzazione usando un normale account utente oppure la password del master user IMAP. Il master user semplifica la migrazione, perché evita di dover conoscere la password di ogni singolo account.

In NethServer 7 la password del master user `vmail` può essere recuperata da `/var/lib/nethserver/secrets/vmail`.

In NethServer 8 la password del master user `vmail` può essere ottenuta con un comando come questo:

    runagent -m mail1 grep DOVECOT_VMAIL_PASS dovecot.env

Aggiungi il suffisso `*vmail` al valore del campo `Remote user` dell'attività.

Per esempio:

- `ns8user` diventa `ns8user*vmail`
- `ns7user@example.org` diventa `ns7user@example.org*vmail`

### Importare attività da CSV

Per creare più attività di sincronizzazione in una sola volta, usa un file CSV con lo script di utilità `import-csv-tasks`. È ideale per migrazioni massive di più account email.

**Formato del file CSV:**

Il file CSV deve contenere una riga di intestazione con queste 6 colonne obbligatorie:

    localusername,remoteusername,remotepassword,remotehostname,remoteport,security
    user1,user1@example.org,"password123",imap.example.org,993,ssl
    user2,user2@example.org,"password456",imap.example.org,143,tls

Colonne obbligatorie:

- `localusername` – nome dell'account utente locale (deve esistere sul server Mail)
- `remoteusername` – nome utente o email dell'account IMAP remoto
- `remotepassword` – password dell'account IMAP remoto (mettila tra virgolette se contiene caratteri speciali)
- `remotehostname` – nome host o indirizzo IP del server IMAP remoto
- `remoteport` – porta del server IMAP remoto (in genere `993` per SSL/TLS, `143` per STARTTLS)
- `security` – protocollo di sicurezza: `ssl` per la cifratura IMAPS implicita (la connessione parte cifrata sulla porta 993), `tls` per la cifratura STARTTLS (connessione in chiaro sulla porta 143 poi aggiornata a TLS), oppure stringa vuota per nessuna cifratura

Tutti i campi tranne `security` sono obbligatori. L'ordine delle colonne non è importante.

**Uso di base:**

Importa attività da un file CSV:

    runagent -m imapsync1 import-csv-tasks < users.csv

**Convalidare il formato CSV senza creare attività:**

    runagent -m imapsync1 import-csv-tasks -c < users.csv

Questo convalida la struttura del CSV, le colonne richieste, i valori obbligatori dei campi e i numeri di porta senza effettuare chiamate API.

**Mostrare l'aiuto:**

    runagent -m imapsync1 import-csv-tasks -h

## Limitazioni conosciute

- I messaggi copiati da Imapsync aggirano i controlli antispam e antivirus. Per garantire la sicurezza, abilita queste protezioni sul server IMAP remoto prima della sincronizzazione.
- Imapsync non si integra con [Piler](piler.md), quindi i messaggi trasferiti tramite Imapsync non vengono archiviati.
- I messaggi copiati da Imapsync non attivano la risposta automatica di ferie (fuori sede) di Dovecot. Se l'account locale ha il plugin vacation abilitato, i mittenti remoti non riceveranno una risposta automatica di ferie, perché i messaggi consegnati tramite Imapsync non hanno gli attributi di envelope necessari per comporre e inviare correttamente la risposta automatica.
