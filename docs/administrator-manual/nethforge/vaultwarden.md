---
title: Vaultwarden
sidebar_position: 14
---
# Vaultwarden

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) is a lightweight, self-hosted, Bitwarden-compatible password manager server written in Rust. It supports all official Bitwarden desktop, browser, and mobile clients.

On NethServer 8, you can install it from the NethForge repository and deploy one or more instances.

## Configuration

Enable the NethForge repository from the [Software repositories](../installation/software_center.md#software_repositories-section) page if it is not already available, then install **Vaultwarden** from the [Software center](../installation/software_center.md).

Before proceeding with the configuration, make sure to create the corresponding DNS record pointing to your NethServer 8 node. If you plan to use a Let's Encrypt certificate, ensure that a public DNS record exists for the configured hostname.

:::note

Features that send emails — such as user invitations (manual or LDAP-synchronized), signup email verification, and password hints — require the cluster [Smarthost](../installation/smarthost.md) to be configured and enabled.

:::

How to configure:

1. Access the application **Settings** page and enter the required **Vaultwarden Hostname (FQDN)** (e.g. `vault.example.org`).
2. Enable **Request Let's Encrypt certificate** and **Redirect HTTP to HTTPS** according to your needs.
3. Configure the **Enable Admin Panel (`/admin`)** toggle and optionally set an **Admin Password / Token** (minimum 8 characters). Plain-text passwords are hashed into an Argon2id PHC string using Vaultwarden's OWASP preset and stored in `state/secrets.env` (mode `0600`); if Argon2id hashing fails, the configuration action aborts with an error rather than falling back to a plain-text token.
4. Configure user registration policies (**Allow open user registration**, **Require email verification on signup**, **Allowed email domains for self-registration**, and **Allow invitations by organization admins**).
5. Optionally select an **LDAP / Active Directory Domain** from the available [user domains](../installation/user_domains.md) to automatically send Vaultwarden email invitations to discovered domain users via `vaultwarden_ldap`.
6. Under **Advanced Settings**, you can customize **Enable Web Vault interface**, **Bitwarden Send**, **Emergency Access**, **Organization Event Audit Logging**, a custom **SMTP sender address** (outgoing mail uses the cluster [Smarthost](../installation/smarthost.md) automatically), and **Mobile Push Notifications** (using an Installation ID and Key from `https://bitwarden.com/host`, with automatic EU identity server selection when using `https://push.bitwarden.eu`).
7. Click **Save**.

## Backup and restore

When a cluster backup runs, the module performs an online SQLite backup (`VACUUM INTO`) inside the running container and Restic archives the `vaultwarden-data` volume, `state/secrets.env` (admin password/hash and push installation key), and the module configuration environment.

On restore, all module settings and secrets are restored, the online SQLite snapshot is promoted to `/data/db.sqlite3`, and `configure-module` re-applies the Traefik route, LDAP binding, and service configuration.

## Updating

To update your Vaultwarden instance to the latest available version, navigate to the [Software center](../installation/software_center.md) and check for available updates under the **Updates** tab.

## Known limitations

1. **Admin endpoint enabled when LDAP sync is active**: If an LDAP / Active Directory domain is selected, the `/admin` endpoint is enabled automatically even when the **Enable Admin Panel (`/admin`)** toggle is turned off, because the `vaultwarden_ldap` companion service requires the Vaultwarden Admin API to invite users.
2. **NethServer 8 UI is the single source of truth**: Settings managed by NethServer 8 (domain, admin token, signup and invitation policies, web vault toggle, Bitwarden Send, emergency access, organization event auditing, mobile push notifications, and SMTP settings) are stripped from `/data/config.json` on each configuration change or container restart. Any changes made to those settings inside Vaultwarden's `/admin` web page will be overwritten by the values configured in the NethServer 8 UI.
3. **LDAP integration sends invitations only**: Selecting an LDAP / Active Directory user domain synchronizes users by sending them Vaultwarden invitation emails via `vaultwarden_ldap`. It does not provide LDAP password authentication; users still create and log in with their own Bitwarden master password.
4. **Smarthost required for email delivery**: User invitations (manual or LDAP-synchronized) and signup email verification require the cluster [Smarthost](../installation/smarthost.md) to be configured.
