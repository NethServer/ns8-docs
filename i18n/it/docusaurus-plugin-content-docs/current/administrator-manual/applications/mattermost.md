---
title: Mattermost
sidebar_position: 8
---
# Mattermost

The Mattemost module installs [Mattermost Team Edition](https://mattermost.com) platform.

Mattermost is an Open Source, private cloud Slack-alternative. Check out the [official documentation](https://docs.mattermost.com/) for further details.

You can install multiple Mattermost instances on the same node from the [Software center](../installation/software_center.md).

## Configurazione

Mattermost needs a dedicated virtual host, a FQDN like `chat.nethserver.org`.

Prima di procedere con la configurazione, assicurarsi di creare il relativo record all'interno del server DNS. Se hai intenzione di utilizzare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

:::warning

Please note that the mobile app **cannot connect to servers with self-signed certificates**!

:::

Come configurare:

1.  access the application configuration page and enter a valid FQDN inside `Mattermost FQDN` field
2.  abilitare `Let's Encrypt` e le opzioni `HTTP a HTTPS` di conseguenza alle vostre esigenze
3.  Click the **Save** button
4.  open the entered host name inside the browser, eg: `https://chat.nethserver.org`. At first access, a wizard will create the administrator user

Mattermost authentication is *not* integrated with any user domain. The Mattermost administrator should take care of users and teams creation.

:::note

The administrator should always use Mattermost wizard to create the admin user, then send team invitation link to each user.

:::
