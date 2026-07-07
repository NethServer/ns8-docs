---
title: WebTop
sidebar_position: 2
---
# WebTop user guide

End-user features of the WebTop groupware.

WebTop modules in this manual:

- [Mail](./mail.md)
- [Calendar](./calendar.md)
- [Contacts](./contacts.md)
- [Tasks](./tasks.md)
- [Cloud](./cloud.md)

## Authentication

Always use the full user name format `<user>@<domain>` for login to the web application and Active Sync.

**Example**

- Server name: mymail.mightydomain.com
- Alternative mail domain: baddomain.net
- User: goofy
- Login: <goofy@mightydomain.com>

:::note

Active Sync protocol is supported only on Android and iOS devices. Outlook is not supported.

:::

## User settings management

Most user settings can be directly managed by the user itself via the settings menu. Locked settings require administrative privileges.

The administrator can impersonate users, to check existing accounts using special login credentials:

- **User name**: `admin!<username>`
- **Password**: `<WebTop admin password>`

While impersonating you receive similar user privileges, allowing you to control exactly what the user can see. Full administration of user settings is available directly in the administration interface, by right-clicking on a user: the settings menu will open the full user settings panel, with all options unlocked.

You can also change the email of all selected users:

1.  select the users (Click + CTRL for multiple selection)
2.  right-click on **Bulk update email domain**

## Two-factor authentication (2FA)

WebTop supports two factor authentication. The user can choose between:

- Google Authenticator app ([Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2), [iOS](https://apps.apple.com/it/app/google-authenticator/id388497605))
- secondary mail address

To enable 2FA:

- click on the menu button on the top-right corner and select the **Settings** icon
- then select **Security** and click on the **Activate button**

![image](/_static/user-manual/webtop/screenshots/webtop-2fa.png)

## New device notification

You can receive an email that notifies when a new device accesses the account for the first time.

By default, this feature is disabled for all users to avoid too many unintentional false positives on first login.

You can [customize this feature](https://www.sonicle.com/docs/webtop5/core.html#security-settings) by accessing the administrator panel.

:::note

Accesses made through impersonate (`admin!<user>`) will never send an email notification

:::
