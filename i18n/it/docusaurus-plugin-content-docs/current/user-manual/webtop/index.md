---
title: WebTop
sidebar_position: 2
---
# Guida utente di WebTop

Funzionalità per gli utenti finali del groupware WebTop.

Moduli WebTop in questo manuale:

- [Mail](./mail.md)
- [Calendario](./calendar.md)
- [Contatti](./contacts.md)
- [Attività](./tasks.md)
- [Cloud](./cloud.md)

## Autenticazione

Usa sempre il formato completo del nome utente `<user>@<domain>` per accedere all'applicazione web e ad ActiveSync.

**Esempio**

- Nome del server: mymail.mightydomain.com
- Dominio di posta alternativo: baddomain.net
- Utente: goofy
- Login: <goofy@mightydomain.com>

:::note

Il protocollo ActiveSync è supportato solo sui dispositivi Android e iOS. Outlook non è supportato.

:::

## Gestione delle impostazioni utente

La maggior parte delle impostazioni utente può essere gestita direttamente dall'utente tramite il menu delle impostazioni. Le impostazioni bloccate richiedono privilegi amministrativi.

L'amministratore può impersonare gli utenti per verificare gli account esistenti usando credenziali di accesso speciali:

- **User name**: `admin!<username>`
- **Password**: `<WebTop admin password>`

Durante l'impersonificazione ottieni privilegi simili a quelli dell'utente, quindi puoi controllare esattamente ciò che l'utente può vedere. L'amministrazione completa delle impostazioni utente è disponibile direttamente nell'interfaccia di amministrazione, facendo clic con il tasto destro su un utente: il menu delle impostazioni aprirà il pannello completo delle impostazioni utente, con tutte le opzioni sbloccate.

Puoi anche cambiare l'indirizzo email di tutti gli utenti selezionati:

1.  seleziona gli utenti (Click + CTRL per la selezione multipla)
2.  fai clic con il tasto destro su **Bulk update email domain**

## Autenticazione a due fattori (2FA)

WebTop supporta l'autenticazione a due fattori. L'utente può scegliere tra:

- app Google Authenticator ([Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), [iOS](https://apps.apple.com/it/app/google-authenticator/id388497605))
- indirizzo email secondario

Per abilitare la 2FA:

- fai clic sul pulsante del menu nell'angolo in alto a destra e seleziona l'icona **Settings**
- quindi seleziona **Security** e fai clic sul pulsante **Activate**

![image](/_static/user-manual/webtop/screenshots/webtop-2fa.png)

## Notifica di un nuovo dispositivo

Puoi ricevere un'email che ti avvisa quando un nuovo dispositivo accede all'account per la prima volta.

Per impostazione predefinita, questa funzione è disabilitata per tutti gli utenti, per evitare troppi falsi positivi involontari al primo accesso.

Puoi [personalizzare questa funzione](https://www.sonicle.com/docs/webtop5/core.html#security-settings) accedendo al pannello di amministrazione.

:::note

Gli accessi effettuati tramite impersonificazione (`admin!<user>`) non invieranno mai una notifica email.

:::
