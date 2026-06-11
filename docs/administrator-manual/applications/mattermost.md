---
title: Mattermost
sidebar_position: 8
---
# Mattermost

The Mattemost module installs [Mattermost Team Edition](https://mattermost.com) platform.

Mattermost is an Open Source, private cloud Slack-alternative. Check out the [official documentation](https://docs.mattermost.com/) for further details.

You can install multiple Mattermost instances on the same node from the [Software center](../installation/software_center.md).

## Configuration

Mattermost needs a dedicated virtual host, a FQDN like `chat.nethserver.org`.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server. If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

:::warning

Please note that the mobile app **cannot connect to servers with self-signed certificates**!

:::

How to configure:

1.  access the application configuration page and enter a valid FQDN inside `Mattermost FQDN` field
2.  enable `Let's Encrypt` and `HTTP to HTTPS` options accordingly to your needs
3.  Click the **Save** button
4.  open the entered host name inside the browser, eg: `https://chat.nethserver.org`. At first access, a wizard will create the administrator user

Mattermost authentication is *not* integrated with any user domain. The Mattermost administrator should take care of users and teams creation.

:::note

The administrator should always use Mattermost wizard to create the admin user, then send team invitation link to each user.

:::
