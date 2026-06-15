---
title: MariaDB
sidebar_position: 4
---
# MariaDB

Questo modulo installa [MariaDB](https://mariadb.org/), un popolare database relazionale open source, e [phpMyAdmin](https://www.phpmyadmin.net/), uno strumento per gestire il database da un'interfaccia web.

Puoi installare più istanze di MariaDB sullo stesso nodo dal [Software center](../installation/software_center.md).

## Configurazione

Come configurare:

1.  accedi alla pagina di configurazione dell'applicazione e inserisci il percorso per phpMyAdmin, ad es. `/phpmyadmin`
2.  abilita l'opzione `HTTP to HTTPS` in base alle tue esigenze
3.  fai clic sul pulsante **Save**

Al termine della configurazione l'interfaccia web mostrerà la porta TCP pubblica per accedere all'istanza MariaDB.

L'istanza phpMyAdmin sarà disponibile all'indirizzo `https://<server_fqn>/<path>`. Le credenziali predefinite di phpMyAdmin sono:

- utente: `admin`
- password: `admin`

Cambiale dopo il primo accesso.

## Accedere al database

Per motivi di sicurezza, il database usa una porta TCP (\> 20000) che non è aperta nel firewall del server. Puoi trovare la porta TCP nel pannello di configurazione del modulo. Per accedere al database da un'applicazione web su un nodo NS8 puoi usare l'indirizzo IP dell'interfaccia VPN `wg0` con la porta personalizzata. La comunicazione è cifrata tramite la VPN WireGuard.

Per esempio: `10.5.4.1:20001`
