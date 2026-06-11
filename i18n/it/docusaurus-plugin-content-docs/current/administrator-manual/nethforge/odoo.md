---
title: Odoo
sidebar_position: 9
---
# Odoo

Odoo è una suite di software di gestione aziendale che comprende gestione delle relazioni con i clienti, e-commerce, fatturazione, contabilità, produzione, magazzino, gestione del progetto e gestione dell'inventario (fonte [Wikipedia](https://en.wikipedia.org/wiki/Odoo)).

This application integrates Odoo within NS8 and is developed, maintained and supported by [Innovyou](https://www.innovyou.it), an Italian IT company.

## Configurazione

Nella pagina Impostazioni, riempire il campo Odoo FQDN con il nome DNS assegnato a questa istanza Odoo. Se si desidera richiedere un certificato Let's Encrypt TLS, assicurarsi che il FQDN sia registrato nel DNS pubblico prima di procedere.

Odoo can be bound to an existing user domain. Users of the domain can log on to this Odoo instance with the same credentials of other applications in the same domain: choose the domain from the LDAP domain selector.

:::note

Il dominio LDAP può essere scelto solo la prima volta. Una volta premuto il tasto **Save**, la selezione del dominio LDAP è disattivata.

:::

Una volta configurata l'applicazione per la prima volta, procedere alla pagina di login.

Dalla schermata di login, sarà possibile:

- Accesso a Odoo.
- Gestisci i database.

:::warning

Change immediately the default passwod of `admin` user and the default DB master password, as explained in the next sections.

:::

### Accesso a Odoo

Per eseguire il primo login, è sufficiente utilizzare le seguenti credenziali:

- Nome utente: `admin`
- Password: `admin`

Dopo il primo login, si consiglia vivamente di modificare la password di Odoo seguendo questi passaggi:

1.  Fare clic su "Amministratore" nell'angolo in alto a destra, quindi su "Preferenze".
2.  Set your own email address.
3.  Aprire la scheda "Account Security", fare clic su "Change password", inserire la password corrente.
4.  Inserisci e conferma la nuova password.

La sessione sarà chiusa, e sarà necessario accedere di nuovo.

### Database management

Dalla schermata di login, sarà possibile gestire i database cliccando sul link "Database Management".

The default master password is: `adminmaster`.

Il primo passo per la sicurezza dell'applicazione sarà quello di cambiare la password master seguendo questi passaggi:

1.  Click on "Set Master Password".
2.  Scrivi la password corrente e poi la nuova password.
3.  Click on "Continue".

Una volta impostata la nuova password master, sarà possibile:

1.  Eseguire un backup del database.
2.  Duplica il database.
3.  Crea un nuovo database.
4.  Elimina il database.

**Note**: The master password will always be necessary for the activities listed below.

#### Database Backup

Per eseguire un backup del database, basta seguire questi passaggi:

1.  Click on "Backup".
2.  Enter the Master Password.
3.  Click on Backup.

Il database sarà scaricato localmente e può essere utilizzato per il restauro o come base per la creazione di un database di produzione parallela.

#### Duplicare il database

Per creare una copia del database di produzione, basta seguire questi passaggi:

1.  Click on "Duplicate".
2.  Enter the Master Password.
3.  Enter the name of the new Database.
4.  Controllare "Neutralize", che disabilita i lavori di cron e impedisce al sistema di inviare notifiche automatiche.
5.  Click on Continue.

The new database will be displayed below the existing one.

#### Creare un nuovo database

Per creare un nuovo database, basta seguire questi passaggi:

1.  Clicca su "Create Database".
2.  Enter the Master Password.
3.  Enter the name of the new Database.
4.  Enter Email and Password.
5.  Select the language.

Nota: Il database appena creato sarà completamente vuoto e privo di qualsiasi configurazione, modulo o applicazione.

#### Eliminare il database

Per eliminare un database, basta seguire questi passaggi:

1.  Click on "Delete".
2.  Enter the Master Password.
3.  Click on Delete.

## Installation image

L'immagine di installazione è stata creata da Innovyou per i seguenti motivi:

1.  L'immagine contiene moduli Odoo core, moduli OCA e moduli proprietari.
2.  L'immagine ufficiale di Odoo non è versioneta oltre V16; il suo contenuto è sovrascritto periodicamente. Questo ci impedisce di sapere per certo quale codice viene utilizzato in quella particolare installazione e di conseguenza non ci permetterebbe di fornire un supporto adeguato o debug.

To request the source code and for information or support, you can visit the page <https://www.innovyou.co/odoo-nethserver-support/>

## Updates and support

- La versione di applicazione 1.0.0 corrisponde alla versione di Odoo Community 16.0, fine del supporto novembre 2025.

Gli aggiornamenti per Odoo su NethServer 8 sono manuali.

Per qualsiasi richiesta di supporto, potete contattarci tramite la pagina <https://www.innovyou.co/odoo-nethserver-support/>

## Licenses

Nethserver 8 applicazione ha una licenza GPL-3, i moduli Odoo Core hanno una licenza LGPL.

I moduli OCA possono avere una licenza AGPL o LGPL. Per visualizzare la licenza di ogni modulo, è possibile farlo seguendo i passaggi seguenti:

1.  Go to the "Applications" module.
2.  Individuare l'applicazione di interesse e fare clic sui tre punti nell'angolo in alto a destra.
3.  Clicca su "module info" per accedere alle informazioni desiderate.
