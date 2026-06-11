---
title: Roundcube
sidebar_position: 4
---
# Roundcube

[Roundcube](https://roundcube.net/) is a web mail client. Roundcube's main features are:

- simple and fast
- built-in address book integrated with internal LDAP
- support for HTML messages
- shared folders support
- plugins

You can install multiple Roundcube instances on the same node from the [Software center](../installation/software_center.md).

## Configurazione

Roundcube needs a dedicated virtual host, a FQDN like `webmail.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

:::warning

Please note that the mobile app **cannot connect to servers with self-signed certificates**!

:::

Come configurare:

1.  access the application configuration page and enter a valid FQDN inside `Roundcube hostname` field
2.  enable `Request LE certificate` and `HTTP to HTTPS` options accordingly to your needs
3.  bind the Roundcube instance to an existing `Mail server`
4.  cliccare sul pulsante **Save**

Inside the `Advanced` section, you can also configure a list of [Plugins](#roundcube_plugins-section) and the `Maximum size for attachments`.

## Plugins {#roundcube_plugins-section}

Roundcube supports many plugins that are already bundled within the installation.

The plugins that are enabled by default are:

- archive
- Zip download
- Manage sieve: manage filters for incoming mail
- Mark as junk: mark the selected messages as Junk and move them to the configured Junk folder

Recommended plugins:

- New mail notifier
- Emoticons
- VCard support

The complete list of official plugin could be find at [Roundcube plugins](https://github.com/roundcube/roundcubemail/tree/master/plugins).
