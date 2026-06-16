---
title: SOGo
sidebar_position: 8
---
# SOGo

[SOGo](https://www.sogo.nu/) è un client di webmail.

Le principali funzionalità di SOGo sono:

- semplice e veloce
- supporto per i messaggi HTML
- supporto per le cartelle condivise
- supporto condiviso per caldav/carddav

Puoi installare più istanze di SOGo sullo stesso nodo dal [Software center](../installation/software_center.md).

:::note

SOGo fornisce supporto EAS (Exchange ActiveSync), ma non EWS (Exchange Web Service). Outlook 2013 e 2016 per Windows funzionano bene con EAS. I principali dispositivi mobili (iOS, Android, BlackBerry 10) funzionano bene con EAS e possono sincronizzare email, calendari, contatti e attività. Apple Mail.app e Outlook per Mac supportano EWS, ma non EAS. **I client funzionano molto bene con account POP3/IMAP e account caldav/carddav**

:::

## Documentazione ufficiale

Leggi la [documentazione ufficiale](https://sogo.nu/files/docs/SOGoInstallationGuide.html) per maggiori informazioni.

## Migrazione da NethServer 7

L'applicazione può essere migrata da NethServer 7 a NethServer 8, ma richiede alcuni passaggi manuali. Per maggiori informazioni fai riferimento alla sezione [Migrazione da NethServer 7](../../tutorial/migration.md).

Il repository NethForge deve essere abilitato nel cluster NS8 prima di procedere con la migrazione.

## Configurazione

SOGo richiede un host virtuale dedicato, un FQDN come `sogo.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare il record di nome corrispondente nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedi alla pagina di configurazione dell'applicazione e inserisci un FQDN valido nel campo `SOGo hostname`
2.  abilita l'opzione `Request LE certificate` in base alle tue esigenze
3.  collega l'istanza SOGo a un `Mail server` esistente
4.  seleziona il dominio utente LDAP per identificare gli utenti
5.  fai clic sul pulsante **Save**

## Utilizzo

L'URL del groupware è <https://yourdomain.com/> (lo stesso del campo `SOGo hostname`). Per l'accesso devi usare il formato breve `username`.

## Impostazioni avanzate

Le seguenti impostazioni sono disponibili nella sezione `Advanced`:

- Administrator list of SOGo: quando abilitato, l'amministratore SOGo può gestire le preferenze di tutti gli utenti.
- Auxiliary email accounts: quando abilitato, gli utenti possono aggiungere altri account IMAP visibili dall'interfaccia di webmail di SOGo.
- Enable DAV: quando abilitato, i calendari condivisi e le rubriche condivise sono disponibili tramite DAV.
- Enable Active Sync: quando abilitato, gli utenti possono sincronizzare email, calendari, contatti e attività con i dispositivi mobili.
- Workers count: numero di worker SOGo; devi regolarlo in base al numero di utenti.

:::warning

Il valore predefinito è 3, ma devi aumentarlo se hai più di 20 utenti.

:::

## Parametri manuali

Alcuni parametri non possono essere modificati dall'interfaccia utente, segui le istruzioni nel [README](https://github.com/NethServer/ns8-sogo/blob/main/README.md).

## Client

### Android

Attualmente hai 2 modi per integrare il tuo dispositivo Android con SOGo.

#### Integrazione tramite Caldav /Cardav/imap

:::note

Lo svantaggio è che devi impostare tutte le impostazioni (Url/Username/Password) in ogni applicazione.

:::

- Email

Imaps (over ssl) è una buona scelta; puoi usare il software K9-mail per recuperare la tua posta oppure l'applicazione email predefinita.

- Contatti e calendari

Esistono vari client funzionanti, tra cui [DAVdroid](https://davdroid.bitfire.at) (open-source) e [CalDAV-Sync/CardDav-Sync](http://dmfs.org/). Vantaggi: integrazione completa in Android, così quasi tutte le app di calendario e contatti possono accedere ai dati sincronizzati.

#### Integrazione tramite ExchangeActiveSync

:::note

Il vantaggio è che imposti Url/Username/Password in un solo punto.

:::

##### Configurazione passo passo

- Apri il menu account e scegli di aggiungere un account Exchange
- Compila il tuo indirizzo email completo e la password nella pagina Account Setup:
- Se viene chiesto di scegliere Account Type, seleziona Exchange:
- Nella pagina di configurazione dettagliata dell'account, compila il modulo con l'indirizzo del server e le credenziali dell'account email
  - DomainUsername: il tuo nome utente in formato breve
  - Password: la password del tuo account
  - Server: il nome del tuo server
  - Port: 443

:::note

Assicurati anche di selezionare Use secure connection (SSL) e Accept all SSL certificates

:::

- Nella pagina Account Settings puoi scegliere Push. Dipende tutto da te.
- Scegli un nome per il tuo account Exchange.
- Fai clic su Next per completare la configurazione dell'account. È tutto.

### Mozilla Thunderbird and Lightning

In alternativa, puoi accedere a SOGo con un client GroupDAV e un client CalDAV. Una configurazione tipica e ben integrata consiste nell'usare Mozilla Thunderbird e Mozilla Lightning insieme al plug-in SOGo Connector di Inverse per sincronizzare le rubriche e al plug-in SOGo Integrator di Inverse per fornire un'integrazione completa delle funzionalità di SOGo in Thunderbird e Lightning. Fai riferimento alla documentazione di Thunderbird per configurare inizialmente un account IMAP che punti al tuo server SOGo usando il nome utente e la password indicati sopra.

Con il [plug-in SOGo Integrator](https://sogo.nu/download.html#/frontends), i tuoi calendari e le tue rubriche verranno rilevati automaticamente quando effettui il login in Thunderbird. Questo plug-in può anche propagare estensioni specifiche e impostazioni utente predefinite nel tuo sito. Tuttavia, tieni presente che per usare il plug-in SOGo Integrator dovrai ripacchettarlo con modifiche specifiche. Fai riferimento alla [documentazione pubblicata online](http://sogo.nu/downloads/documentation.html).

Se usi solo il plug-in SOGo Connector, puoi comunque accedere facilmente ai tuoi dati.

- Per accedere alla tua rubrica personale:
- Scegli Go \> Address Book.
- Scegli File \> New \> Remote Address Book.
- Inserisci un nome significativo per il tuo calendario nel campo Name.
- Digita il seguente URL nel campo URL: <http://localhost/SOGo/dav/jdoe/Contacts/personal/>
- Fai clic su OK.

Per accedere al tuo calendario personale:

- Scegli Go \> Calendar.
- Scegli Calendar \> New Calendar.
- Seleziona On the Network e fai clic su Continue.
- Seleziona CalDAV.
- Digita il seguente URL nel campo URL: <http://localhost/SOGo/dav/jdoe/Calendar/personal/>
- Fai clic su Continue.

### Outlook

Puoi usarlo con

- IMAP + plugin commerciali come [cfos](https://www.cfos.de/en/cfos-outlook-dav/cfos-outlook-dav.htm?__ntrack_pv=1) o [outlookdav](http://www.outlookdav.com/) per calendari/contatti
- ActiveSync da Outlook 2013 in poi

Non esiste supporto per Openchange/OutlookMAPI.
