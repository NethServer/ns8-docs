---
title: MariaDB
sidebar_position: 4
---
# MariaDB

This module installs [MariaDB](https://mariadb.org/), a popular open source relational database, and [phpMyAdmin](https://www.phpmyadmin.net/) a tool to manage the database from a web interface.

You can install multiple MariaDB instances on the same node from the [Software center](../installation/software_center.md).

## Configurazione

Come configurare:

1.  access the application configuration page and enter the path for phpMyAdmin, eg. `/phpmyadmin`
2.  enable `HTTP to HTTPS` option accordingly to your needs
3.  Click the **Save** button

At the end of the configuration the web interface will display the public TCP port to access the MariaDB instance.

The phpMyAdmin instance will be available at the `https://<server_fqn>/<path>`. Default credentials for phpMyAdmin are:

- user: `admin`
- password: `admin`

Please change them after the first login.

## Database di accesso

The database uses a TCP port (\> 20000) that is not opened in the firewall of the server for security reason. You can find the TCP port inside the configuration panel of the module To access the database from a web application with a NS8 node you can use the IP of the VPN wg0 interface with the custom port. The communication is encrypted with the wireguard VPN.

Per esempio: 10.5.4.1:20001
