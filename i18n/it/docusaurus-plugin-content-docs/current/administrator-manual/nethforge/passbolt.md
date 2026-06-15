---
title: Passbolt
sidebar_position: 5
---
# Passbolt

[Passbolt](https://www.passbolt.com/) è una piattaforma open source per la gestione delle credenziali destinata ai team moderni.

## Configurazione

Una volta installata, apri la pagina Settings dell'applicazione e compila i campi richiesti:

- **Passbolt FQDN**: inserisci il nome di dominio completo con cui sarà accessibile l'interfaccia web di Passbolt. Se l'FQDN è già registrato nel DNS pubblico, puoi abilitare l'opzione **Let's Encrypt certificate** per ottenere un certificato di cifratura valido.
- **Admin mail address**: inserisci l'indirizzo email dell'amministratore di Passbolt. Viene usato per il recupero della password. Per esempio, se l'FQDN cambia e vuoi accedere a Passbolt, all'utente viene inviata un'email con il link di recupero. Segui quel link per recuperare il tuo account.

:::warning

Se viene configurato un FQDN errato, non sarà più possibile ottenere il corretto link di registrazione dell'amministratore. Il modo consigliato per recuperare da questa situazione è rimuovere l'istanza Passbolt errata, quindi installare e configurare una nuova istanza.

:::

Dopo la prima configurazione viene mostrato il link di registrazione dell'amministratore. Segui il link per creare l'account admin, impostare una password e salvare le chiavi di Passbolt.

:::note

Valuta di conservare le chiavi di Passbolt in un luogo sicuro per poter ripristinare il tuo account se necessario.

:::

Per gestire Passbolt, consulta la [Documentazione](https://www.passbolt.com/docs/) ufficiale.

## Limitazioni note

1.  Dopo aver cambiato l'FQDN dell'app, è necessario recuperare la password.
2.  L'app NethServer include la Passbolt Community Edition (CE), che non supporta l'autenticazione LDAP.
