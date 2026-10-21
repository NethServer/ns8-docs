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

How to configure:

1. Access the application **Settings** page and enter the required **Vaultwarden Hostname (FQDN)** (e.g. `vault.example.org`).
2. Enable **Request Let's Encrypt certificate** and **Redirect HTTP to HTTPS** according to your needs.
3. Configure the **Admin Panel (`/admin`)** toggle and optionally set an **Admin Password / Token** (minimum 8 characters; automatically converted to an Argon2id PHC hash).
4. Configure user registration policies (**Allow open user registration**, **Require email verification on signup**, **Allowed email domains for self-registration**, and **Allow invitations by organization admins**).
5. Optionally select an **LDAP / Active Directory Domain** from the available [user domains](../installation/user_domains.md) to automatically send Vaultwarden email invitations to discovered domain users via `vaultwarden_ldap`.
6. Under **Advanced Settings**, you can customize **Bitwarden Send**, **Emergency Access**, **Organization Event Audit Logging**, a custom **SMTP sender address** (outgoing mail uses the cluster [Smarthost](../installation/smarthost.md) automatically), and **Mobile Push Notifications** (using an Installation ID and Key from `https://bitwarden.com/host`).
7. Click **Save**.

## Updating

To update your Vaultwarden instance to the latest available version, navigate to the [Software center](../installation/software_center.md) and check for available updates under the **Updates** tab.
