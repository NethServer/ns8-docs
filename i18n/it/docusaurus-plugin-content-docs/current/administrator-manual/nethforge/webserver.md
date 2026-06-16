---
title: WebServer
sidebar_position: 7
---
# WebServer

Questa applicazione installa il server web [Nginx](https://www.nginx.com/), il linguaggio di programmazione [PHP](https://www.php.net/) e [SFTPGo](https://github.com/drakkan/sftpgo) per caricare i file.

Puoi installare più istanze di WebServer sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Come configurare:

1.  accedi alla pagina `Settings` dell'applicazione e inserisci il percorso per SFTPGo, ad es. `/sftpgo`
2.  scegli una porta TCP pubblica per il server sFTP
3.  abilita l'opzione `HTTP to HTTPS` in base alle tue esigenze
4.  fai clic sul pulsante **Save**

Al termine della configurazione l'interfaccia web mostrerà la porta TCP pubblica per accedere all'istanza MariaDB.

L'istanza SFTPGo sarà disponibile all'indirizzo `https://<server_fqn>/<path>`. Le credenziali predefinite per il `Web Admin` di SFTPGo sono:

- utente: `admin`
- password: `admin`

Cambiale dopo il primo accesso.

### Host virtuali

Puoi ospitare più siti creando un host virtuale per ciascun sito nella pagina `Virtual hosts`. Per creare un host virtuale fai clic sul pulsante **Create a virtual host**.

Verrà creato un nuovo utente SFTP per ogni host virtuale. Le credenziali predefinite dell'utente saranno mostrate nella scheda dell'host virtuale.

Ora puoi usare l'interfaccia web di SFTPGo, oppure un client sFTP, per caricare i file nel tuo host virtuale.
