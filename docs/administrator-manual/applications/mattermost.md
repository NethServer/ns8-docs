---
title: Mattermost
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

## Reset a user password

Since Mattermost authentication is not integrated with a user domain, there is no self-service password recovery. If the administrator password set during the initial wizard is lost, or any other user's password needs to be reset, use the `mmctl` command-line tool.

Mattermost also provides an email-based reset (`mmctl user reset-password`), but it requires SMTP to be already configured on the instance, so it does not help in this case.

Run the following command as `root` on the NS8 node that hosts the Mattermost instance:

    runagent -m mattermost0 podman exec -ti mattermost-app mmctl --local user change-password MY_USER --password NEW_PASSWORD

Replace `mattermost0` with the actual Mattermost instance name, `MY_USER` with the target user name or email address, and `NEW_PASSWORD` with the new password.

## Upgrade to Mattermost 11

The module follows the Mattermost Extended Support Releases (ESR). Mattermost 10.11 ESR reached end of support on August 15, 2026. The module update installs Mattermost 11.7 ESR, which is supported until May 15, 2027.

Mattermost 11 changes the limits of Team Edition. Check them before you update:

- Team Edition allows up to 250 activated users. The previous limit was 1000.
- GitLab single sign-on (SSO) is no longer available.
- The Playbooks plugin no longer works.
- The Bleve search engine is removed.

To count the activated users, run the following command as `root` on the node:

    runagent -m mattermost1 podman exec mattermost-app mmctl --local --json user list --all | jq '[.[] | select(.delete_at == 0 and (.is_bot | not))] | length'

Replace `mattermost1` with the actual Mattermost instance name.

See the [Mattermost upgrade notes](https://docs.mattermost.com/administration-guide/upgrade/important-upgrade-notes) for the full list of changes.
