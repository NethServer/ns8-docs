---
title: Odoo
sidebar_position: 9
---
# Odoo

Odoo è una suite di software per la gestione aziendale che include customer relationship management, e-commerce, fatturazione, contabilità, produzione, magazzino, gestione progetti e gestione dell'inventario (fonte [Wikipedia](https://en.wikipedia.org/wiki/Odoo)).

Questa applicazione integra Odoo in NS8 ed è sviluppata, mantenuta e supportata da [Innovyou](https://www.innovyou.it), un'azienda IT italiana.

## Configurazione

Nella pagina Settings, compila il campo Odoo FQDN con il nome DNS assegnato a questa istanza Odoo. Se vuoi richiedere un certificato TLS Let's Encrypt, assicurati che l'FQDN sia registrato nel DNS pubblico prima di procedere.

Odoo può essere associato a un dominio utente esistente. Gli utenti del dominio possono accedere a questa istanza Odoo con le stesse credenziali delle altre applicazioni nello stesso dominio: scegli il dominio dal selettore del dominio LDAP.

:::note

Il dominio LDAP può essere scelto solo la prima volta. Una volta premuto il pulsante **Save**, la selezione del dominio LDAP viene disabilitata.

:::

Una volta che l'applicazione è stata configurata per la prima volta, procedi alla pagina di login.

Dalla schermata di login sarà possibile:

- Accedere a Odoo.
- Gestire i database.

:::warning

Cambia immediatamente la password predefinita dell'utente `admin` e la password master predefinita del database, come spiegato nelle sezioni successive.

:::

### Accesso a Odoo

Per effettuare il primo accesso, usa semplicemente le seguenti credenziali:

- Username: `admin`
- Password: `admin`

Dopo il primo accesso, è fortemente consigliato cambiare la password di Odoo seguendo questi passaggi:

1.  Fai clic su "Administrator" nell'angolo in alto a destra, quindi su "Preferences".
2.  Imposta il tuo indirizzo email.
3.  Apri la scheda "Account Security", fai clic su "Change password" e inserisci la password corrente.
4.  Inserisci e conferma la nuova password.

La sessione verrà chiusa e dovrai effettuare nuovamente l'accesso.

### Gestione dei database

Dalla schermata di login sarà possibile gestire i database facendo clic sul collegamento "Database Management".

La password master predefinita è: `adminmaster`.

Il primo passo per la sicurezza dell'applicazione sarà cambiare la password master seguendo questi passaggi:

1.  Fai clic su "Set Master Password".
2.  Scrivi la password corrente e poi quella nuova.
3.  Fai clic su "Continue".

Una volta impostata la nuova Master Password, sarà possibile:

1.  Eseguire un backup del database.
2.  Duplicare il database.
3.  Creare un nuovo database.
4.  Eliminare il database.

**Nota**: la password master sarà sempre necessaria per le attività elencate di seguito.

#### Backup del database

Per eseguire un backup del database, segui semplicemente questi passaggi:

1.  Fai clic su "Backup".
2.  Inserisci la Master Password.
3.  Fai clic su Backup.

Il database verrà scaricato in locale e potrà essere usato per il ripristino o come base per creare un database di produzione parallelo.

#### Duplicare il database

Per creare una copia del database di produzione, segui semplicemente questi passaggi:

1.  Fai clic su "Duplicate".
2.  Inserisci la Master Password.
3.  Inserisci il nome del nuovo database.
4.  Seleziona "Neutralize", che disabilita i cron job e impedisce al sistema di inviare notifiche automatiche.
5.  Fai clic su Continue.

Il nuovo database verrà mostrato sotto quello esistente.

#### Creare un nuovo database

Per creare un nuovo database, segui semplicemente questi passaggi:

1.  Fai clic su "Create Database".
2.  Inserisci la Master Password.
3.  Inserisci il nome del nuovo database.
4.  Inserisci Email e Password.
5.  Seleziona la lingua.

Nota: il database appena creato sarà completamente vuoto e privo di qualsiasi configurazione, modulo o applicazione.

#### Eliminare il database

Per eliminare un database, segui semplicemente questi passaggi:

1.  Fai clic su "Delete".
2.  Inserisci la Master Password.
3.  Fai clic su Delete.

## Immagine di installazione

L'immagine di installazione è stata creata da Innovyou per i seguenti motivi:

1.  L'immagine contiene moduli core di Odoo, moduli OCA e moduli proprietari.
2.  L'immagine ufficiale di Odoo non è versionata oltre la V16; il suo contenuto viene sovrascritto periodicamente. Questo ci impedirebbe di sapere con certezza quale codice viene usato in una determinata installazione e, di conseguenza, non ci permetterebbe di fornire supporto o debug adeguati.

Per richiedere il codice sorgente e per informazioni o supporto, puoi visitare la pagina <https://www.innovyou.co/odoo-nethserver-support/>

## Aggiornamenti e supporto

- La versione 1.0.0 dell'applicazione corrisponde a Odoo Community versione 16.0, con fine supporto a novembre 2025.

Gli aggiornamenti di Odoo su NethServer 8 sono manuali.

Per qualsiasi richiesta di supporto, puoi contattarci tramite la pagina <https://www.innovyou.co/odoo-nethserver-support/>

## Licenze

L'applicazione Nethserver 8 ha licenza GPL-3, i moduli Odoo Core hanno licenza LGPL.

I moduli OCA possono avere licenza AGPL o LGPL. Per visualizzare la licenza di ogni modulo, puoi seguire i passaggi sotto:

1.  Vai al modulo "Applications".
2.  Individua l'applicazione di interesse e fai clic sui tre puntini nell'angolo in alto a destra.
3.  Fai clic su "module info" per accedere alle informazioni desiderate.
