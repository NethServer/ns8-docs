---
title: Email notifications
sidebar_position: 7
---
# Email notifications

Molte applicazioni, come Nextcloud e Mattermost, richiedono la configurazione del server SMTP per inviare messaggi di notifica agli utenti e agli amministratori di servizio.

You can configure the same SMTP server for all installed applications by accessing the `Email notifications` card inside the `Settings` page.

To enable the feature, click on `Send notifications with an SMTP server` and fill the required details.

Se un'istanza di applicazione Mail è già installato nel cluster, scegliere l'opzione `Usa istanza dell'app Mail`. Quindi fare riferimento alla sezione [Relay](../applications/mail.md#relay-rules-section) per ulteriori informazioni sulla configurazione di Mail.

Instead, choose `Manual configuration` to specify SMTP server parameters in this form. Available fields are:

- **SMTP server**: The host name or IP address of the SMTP server
- \*\* Numero porta SMTP\*\*: Numero di porta TCP del server. I valori comuni sono 587, 25, 465, 2525.
- **Codifica SMTP** Crittografia utilizzata dal server. TLS è un protocollo di crittografia ampiamente usato che crittografa una connessione dal momento in cui è stabilito. STARTTLS è il metodo di crittografia standard per SMTP. Se sia il client che il server lo supportano, la connessione viene crittografata dopo che entrambi i lati accettano di utilizzarla.
- **Verificare il certificato TLS**: Se viene utilizzata la crittografia, questo switch controlla se il certificato utilizzato per crittografare la connessione deve essere firmato da un'autorità attendibile o meno. Se il server presenta un certificato autofirmato, spegnere questo interruttore per accettarlo.
- **Username** and **Password**: If the server requires SMTP authentication, fill the credential fields; otherwise leave them blank.

Dopo aver salvato le impostazioni, viene avviata immediatamente una connessione SMTP per convalidare i parametri del modulo. In alcuni casi, la convalida ha successo, ma i messaggi possono ancora non essere consegnati. Si raccomanda di verificare che le singole applicazioni possano inviare con successo messaggi con le nuove impostazioni.
