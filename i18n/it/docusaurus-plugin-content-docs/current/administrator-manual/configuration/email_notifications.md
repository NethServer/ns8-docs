---
title: Notifiche email
sidebar_position: 7
---
# Notifiche email

Molte applicazioni, come Nextcloud e Mattermost, richiedono la configurazione di un server SMTP per inviare messaggi di notifica agli utenti e agli amministratori di servizio.

È possibile configurare lo stesso server SMTP per tutte le applicazioni installate accedendo alla scheda `Notifiche email` nella pagina `Impostazioni`.

Per abilitare la funzionalità, fare clic su `Invia notifiche con un server SMTP` e compilare i dettagli richiesti.

Se un'istanza dell'applicazione Mail è già installata nel cluster, scegliere l'opzione `Usa l'istanza dell'app Mail`. Fare quindi riferimento alla sezione [Relay](../applications/mail.md#relay-rules-section) per ulteriori informazioni sulla configurazione di Mail.

In alternativa, scegliere `Configurazione manuale` per specificare i parametri del server SMTP in questo modulo. I campi disponibili sono:

- **Server SMTP**: Il nome host o l'indirizzo IP del server SMTP
- **Numero di porta SMTP**: Numero di porta TCP del server. I valori comuni sono 587, 25, 465, 2525.
- **Crittografia SMTP**: Crittografia utilizzata dal server. TLS è un protocollo di crittografia ampiamente utilizzato che cripta una connessione dal momento in cui viene stabilita. STARTTLS è il metodo di crittografia standard per SMTP. Se sia il client che il server lo supportano, la connessione viene criptata dopo che entrambe le parti concordano di utilizzarlo.
- **Verifica del certificato TLS**: Se viene utilizzata la crittografia, questo interruttore controlla se il certificato utilizzato per criptare la connessione deve essere firmato da un'autorità fidata o meno. Se il server presenta un certificato autofirmato, disattivare questo interruttore per accettarlo.
- **Nome utente** e **Password**: Se il server richiede l'autenticazione SMTP, compilare i campi delle credenziali; altrimenti lasciarli vuoti.

Dopo aver salvato le impostazioni, viene immediatamente avviata una connessione SMTP per convalidare i parametri del modulo. In alcuni casi, la convalida può avere successo, ma i messaggi potrebbero comunque non essere consegnati. Si consiglia di verificare che le singole applicazioni possano inviare correttamente i messaggi con le nuove impostazioni.
