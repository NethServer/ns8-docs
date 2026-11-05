---
title: Nextcloud
---
# Nextcloud

[Nextcloud](http://nextcloud.com/) provides universal access to your files via the web, your computer or your mobile devices wherever you are. It also provides a platform to easily view and synchronize your contacts, calendars and bookmarks across all your devices and enables basic editing right on the web.

**Key features:**

- configure Nextcloud with MariaDB and Redis cache
- integration with NethServer 8 [User domains](../installation/user_domains.md)
- automatic backup

You can install multiple Nextcloud instances on the same node from the [Software center](../installation/software_center.md).

## Configuration

Nextcloud needs a dedicated virtual host, an FQDN like `nextcloud.nethserver.org`.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server. If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

After the installation:

1.  access the `Settings` page of the newly installed instance
2.  enter a valid FQDN inside the `Host name` field
3.  enable `Let's Encrypt` option accordingly to your needs
4.  setup a `Password for user 'admin'`, or leave the default one (`Nethesis,1234`)
5.  enable `Manage email sending from Nextcloud admin panel` to override the cluster smarthost settings
6.  click the **Save** button

As default, Nextcloud has its own user database. You can also connect the instance to an existing [user domain](../installation/user_domains.md): all users from the domain will be able to login with their own credentials. The built-in `admin` user is always enabled.

If you want to integrate with Collabora (CODE) online see [below](#collabora-integration-section), The option will be available after Nextcloud has been initialized on first start-up: it usually takes less then a minute.

:::note

Nextcloud update/upgrade procedure may disable the apps to avoid incompatibility problems. Server logs keep track of which apps were disabled. After a successful update/upgrade procedure you can use the Applications page to update and re-enable the apps.

:::

### User list

All users are listed inside the administrator panel of Nextcloud using a unique identifier containing letters and numbers. This is because the system ensures that there are no duplicate internal user names as reported in section `Internal Username` of [Official Nextcloud documentation](https://docs.nextcloud.com).

### Two-factor authentication (TOTP)

Nextcloud supports two-factor authentication with a TOTP authenticator app. Users enable it from **Personal settings > Security**.

Log in as root on the node where the Nextcloud application is installed. In the following commands, replace `nextcloud1` with your application identifier.

To require two-factor authentication for all users, run:

    runagent -m nextcloud1 occ twofactorauth:enforce --on

Users without a second factor must set up TOTP at their next login. Use `--off` to stop enforcing it.

The Nextcloud administrator can also enforce it globally from the web interface: go to **Administration settings > Security** and enable **Enforce two-factor authentication**. This page can also limit the requirement to some groups or exclude some groups.

If a user lost their authenticator app, the administrator can disable TOTP for that user. LDAP users have an internal identifier, as explained in the [User list](#user-list) section, so find it first:

    runagent -m nextcloud1 occ user:list

Then disable TOTP and check the result:

    runagent -m nextcloud1 occ twofactorauth:disable <user_id> totp
    runagent -m nextcloud1 occ twofactorauth:state <user_id>

This also deletes the old TOTP secret. The user then sets up TOTP again with a new QR code: at the next login if 2FA is enforced, otherwise from **Personal settings > Security**. Backup codes do not count as a second factor, so they do not bypass this step.

Do not use `occ twofactorauth:cleanup totp`: it removes TOTP data for all users.

See the [module README](https://github.com/NethServer/ns8-nextcloud#two-factor-authentication-totp) for command output examples, and the [official Nextcloud documentation](https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/two_factor-auth.html) for all options.

### Alternative LDAP mail field (Samba AD)

When the account provider is an Active Directory, you can change the mail field used by Nextcloud with an environment variable. The default LDAP mail field is `userPrincipalName`, which corresponds to the AD domain name and not the user's email address (e.g. `user@ad.example.org` vs `user@example.org`). This can be confusing for users, as they will have to use the `userPrincipalName` to login instead of their email address. The Email address field can be set in the [User and groups](../installation/user_domains.md#user_groups-section) page if the Samba AD is configured as the local account provider.

By adding `LDAP_MAIL_ATTRIBUTE` your users will be able to login with:

- `sAMAccountName`: eg `john`
- `userPrincipalName`: eg `john@ad.domain.com`
- `mail`: eg `john@domain.com`

Log in as root on the node where the Nextcloud application is installed. Execute the following commands, replacing `nextcloud1` with your application identifier:

    runagent -m nextcloud1 python3 -c 'import agent ; agent.set_env("LDAP_MAIL_ATTRIBUTE", "mail")'
    runagent -m nextcloud1 systemctl --user restart nextcloud

### Collabora Online {#collabora-integration-section}

:::note

Collabora Online is provided by the NethForge repository and is not included in the [Subscription plans](../about/subscription.md).

:::

First, install and configure a [Collabora Online](../nethforge/collabora.md) instance.

Then, access the `Settings` page of Nextcloud module.

You will find an option named `CODE server host name`. Select one of the existing Collabora instances or enter a domain of another Collabora installation.

The Collabora instance will be accessed using HTTPS protocol, so remember to disable the `Verify TLS certification` option if the Collabora does not have a valid TLS certificate.

Finally, click the **Save** button. You will now be able to edit documents directly inside Nextcloud.

## Data retention policy

When it comes to account deletion in Nextcloud, a specific data retention policy is employed based on the user's account origin:

- if the account originates from the LDAP account provider, its data isn't subject to automatic removal. You can find detailed information about this policy in the documentation: [LDAP Cleanup](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_auth_ldap_cleanup.html).
- in the case of accounts stored within the internal Nextcloud database, their associated data is immediately and automatically removed upon deletion. Further insights can be accessed here: [Deleting Users](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_configuration.html#deleting-users).

## Database optimization command {#nextcloud-db-optimize-section}

Nextcloud requires manual database fixes that cannot be automated during upgrade, as operations may take a long time with large amounts of data. In such cases, the `nextcloud-db-optimize` command can be run manually to optimize the Nextcloud database outside production hours.

Execute the following command in a root shell, replacing `nextcloud1` with the correct application identifier:

    runagent -m nextcloud1 nextcloud-db-optimize
