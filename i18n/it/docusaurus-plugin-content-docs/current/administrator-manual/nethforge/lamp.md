---
title: Lamp
sidebar_position: 3
---
# Lamp

Lamp è un ambiente containerizzato che racchiude uno stack LAMP, composto da Linux (Ubuntu), Apache (server web), MariaDB (database) e PHP (linguaggio di scripting). Questo container consente una distribuzione e una gestione semplici delle applicazioni web, offrendo coerenza, portabilità e isolamento tra ambienti diversi.

## Installazione

L'applicazione può essere installata dal [Software center](../installation/software_center.md).

## Configurazione

Dopo l'installazione, accedi alla pagina delle impostazioni dell'applicazione per configurare la tua istanza Lamp.

### Impostazioni principali

:::note

Il DNS deve essere configurato presso il tuo provider DNS in modo che punti al tuo server, affinché sia l'FQDN sia il certificato Let's Encrypt funzionino correttamente.

:::

Durante la configurazione sono disponibili le seguenti impostazioni:

- **Fully Qualified Domain Name (FQDN)**: imposta il nome di dominio per la tua applicazione web, per esempio `webapp1.example.org`
- **Request Let's Encrypt certificate**: ottieni e configura automaticamente un certificato SSL gratuito
- **HTTP to HTTPS**: abilita il reindirizzamento automatico da HTTP a HTTPS
- **Enable phpMyAdmin**: abilita o disabilita l'interfaccia web di phpMyAdmin (abilitata per impostazione predefinita)
- **MySQL Configuration**:
  - **MySQL Admin Password**: password dell'utente root MySQL per gestire tutti i database
  - **Create Database and User**: crea facoltativamente un database con un utente dedicato durante la configurazione
    - **Database Name**: nome del database da creare
    - **Database User**: nome utente per l'accesso al database
    - **Database User Password**: password dell'utente del database
- **PHP Configuration**:
  - **PHP Version**: seleziona la versione di PHP da usare (personalizzabile per adattarsi ai requisiti della tua applicazione)
  - **PHP Upload Max Filesize**: dimensione massima consentita per i caricamenti di file in megabyte (predefinita: 100)
  - **PHP Memory Limit**: quantità massima di memoria, in megabyte, che uno script PHP può consumare
  - **PHP Max Execution Time Limit**: tempo massimo, in secondi, per cui uno script PHP può essere eseguito prima di essere terminato

Dopo aver configurato queste impostazioni, fai clic su **Save** per applicare le modifiche.

## Utilizzo

### Distribuzione dell'applicazione

Lamp fornisce una directory `/app` come posizione di archiviazione per i file della tua applicazione web.

Per accedere alla directory dell'applicazione e distribuire i tuoi file:

1.  Connettiti al server via SSH

2.  Usa il seguente comando per accedere al container Apache:

        runagent -m lamp1 podman exec -ti apache2-app bash

    Sostituisci `lamp1` con il nome reale della tua istanza del modulo.

3.  Posiziona i file della tua applicazione web nella directory di lavoro

4.  I file verranno serviti automaticamente tramite l'FQDN configurato nell'interfaccia web

#### Installare il codice sorgente PHP

Puoi scaricare i file della tua applicazione web usando uno dei seguenti metodi:

**Git**

Clona un repository Git per scaricare il codice della tua applicazione:

    git clone http://github.com/url/of/project

**Wget**

Scarica i file usando wget, uno strumento da riga di comando per scaricare file dal web:

    wget http://your-url

**Rsync**

Usa rsync per sincronizzare i file da un server remoto:

    rsync -avz user@hostname:/path .

**SFTP**

Apri una sessione SFTP interattiva per trasferire i file in modo sicuro:

    sftp user@hostname

**FTP**

Usa il protocollo FTP standard per il trasferimento dei file:

    ftp hostname

**FTP-SSL**

Usa FTP con cifratura SSL/TLS per un trasferimento sicuro dei file:

    ftp-ssl hostname

:::warning

Dopo aver distribuito la tua applicazione web, elimina il file predefinito `phpinfo.php` per evitare di esporre informazioni sensibili sulla configurazione del server.

:::

### Gestione del database

PhpMyAdmin è incluso ed è accessibile tramite il tuo dominio nel percorso `/phpmyadmin` (ad esempio `https://webapp1.example.org/phpmyadmin`).

Credenziali predefinite:

- Username: `admin`
- Password: la password amministrativa MySQL impostata durante la configurazione

:::warning

Per motivi di sicurezza, cambia immediatamente le credenziali di accesso predefinite di PhpMyAdmin dopo il primo login.

:::

Puoi anche collegarti direttamente al database dalla riga di comando:

    runagent -m lamp1 podman exec -ti apache2-app mysql

Sostituisci `lamp1` con il nome reale della tua istanza del modulo.

## Configurazione avanzata

### Attività pianificate

Puoi configurare cron job per la tua istanza Lamp usando:

    runagent -m lamp1 apache2-app crontab -e

Ecco alcuni esempi di cronjob:

    0 2 * * *  /app/maintenance.php # esegue lo script di manutenzione ogni giorno alle 2:00
    30 2 * * * rm -rf /app/temp/* # svuota i file temporanei dopo il backup
    0 3 * * *  find /app/logs -type f -mtime +30 -delete # elimina i file di log più vecchi di 30 giorni

Per verificare i cron job configurati:

    podman exec -ti apache2-app crontab -l

### Direttive PHP e Apache personalizzate

Un file `.htaccess` viene creato automaticamente nella directory `/app` al primo avvio, già popolato con esempi commentati di direttive comuni. Modificalo direttamente per applicare impostazioni PHP o Apache personalizzate: Apache lo leggerà e le applicherà di conseguenza:

    runagent -m lamp1 podman exec -ti apache2-app bash

Poi modifica il file:

    nano .htaccess

### Direttive MySQL personalizzate

Per ottimizzare MySQL, modifica i file di configurazione memorizzati nella cartella del modulo (sono inclusi nel backup). Entra prima nell'ambiente del modulo:

    runagent -m lamp1

Sono disponibili due file di configurazione:

- `conf.d/mysql.cnf`: opzioni client e server
- `conf.d/mysqldump.cnf`: opzioni per `mysqldump` (usato durante i backup)

Per esempio, per aumentare `max_allowed_packet` sia nel client sia nel server:

    nano conf.d/mysql.cnf

    [mysql]
    max_allowed_packet=500M

Dopo aver modificato la configurazione, riavvia il modulo:

    systemctl restart --user lamp

### Invio email

A ogni avvio, il modulo legge la configurazione smarthost del cluster e scrive nel container i corrispondenti parametri SMTP come variabili d'ambiente. Queste variabili sono disponibili per l'applicazione web, ma **l'applicazione stessa deve essere configurata per usarle** — non viene configurata automaticamente alcuna posta in uscita.

Per controllare le impostazioni SMTP disponibili nel container:

    runagent -m lamp1 podman exec -ti apache2-app env | grep -i smtp
