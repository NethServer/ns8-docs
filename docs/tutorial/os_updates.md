---
title: Operating system updates
sidebar_position: 2
---
# Operating system updates

NethServer 8 runs on top of standard Linux distributions and leaves most operating system configuration under the control of the system administrator.

The system administrator can decide how and when operating system updates are applied. In general, installing updates promptly is recommended.

If you have an *active subscription*, the default operating system update policy applies the updates automatically as described in the [Scheduled updates](../administrator-manual/about/subscription.md#scheduled-updates) section.

:::warning

On Rocky Linux, do not enable `dnf-automatic` or any other automatic update mechanism if you have an [active subscription](../administrator-manual/about/subscription.md). Use the scheduled updates feature instead. Running multiple update mechanisms may result in updates being applied outside the intended rollout schedule.

:::

## Automatic updates

To enable automatic operating system updates, refer to your distribution documentation:

- Rocky Linux / AlmaLinux and similar: [Patching servers with dnf-automatic](https://docs.rockylinux.org/guides/security/dnf_automatic/)
- Debian: [Periodic updates](https://wiki.debian.org/PeriodicUpdates)

:::note

CentOS Stream follows a rolling-release model and may introduce newer software versions that can lead to unexpected behavior. If enabling automatic updates, follow the same approach as for Rocky Linux.

:::

:::note

For updates to NS8 core and modules, refer to [Updates](../administrator-manual/installation/software_center.md#updates-section).

:::

## Manual updates

The command to update the operating system depends on the distribution:

- [APT](https://www.debian.org/doc/manuals/debian-faq/pkgtools.en.html#apt-get) (Debian): ::

    apt update && apt upgrade

- [DNF](https://docs.rockylinux.org/9/guides/package_management/dnf_package_manager/#update-and-upgrade) (Rocky Linux, AlmaLinux and similar): ::

    dnf update

## Node reboot

Some updates, such as kernel updates, may require a node reboot to take effect.

After completing updates (automatic or manual), reboot the system:

```
shutdown -r now
```

To schedule a reboot in 30 minutes:

```
shutdown -r +30 "System reboot in 30 minutes"
```

To cancel a scheduled reboot:

```
shutdown -c
```

## Nethesis-managed Rocky Linux mirror {#neth-mirror}

When NS8 is installed on Rocky Linux, the DNF configuration is adjusted to use mirrors managed by [Nethesis](https://www.nethesis.it).

- `ns-appstream` (NS8 Rocky Linux 9 - AppStream)
- `ns-baseos` (NS8 Rocky Linux 9 - BaseOS)

These mirrors are synchronized weekly with the official Rocky Linux repositories (Friday at 21:00 UTC) and act as a controlled snapshot of the upstream content.

This delay allows potential breaking changes in upstream repositories to be identified and blocked before they reach production systems.

The mirrors are available to all NS8 installations, regardless of subscription status.

With an active subscription, updates are progressively rolled out from the latest snapshot in a staged manner. This staged rollout reduces the risk of widespread issues by gradually exposing updates across environments.

In case of an important security fix or for any other exceptional need, administrators can temporarily bypass or permanently disable the Nethesis-managed mirrors in order to access the official Rocky Linux repositories.

Check the upstream repository status against the Nethesis mirror:

```
dnf repolist -v --repo=*baseos
dnf repolist -v --repo=*appstream
```

Single update run from official repositories:

```
dnf --enablerepo=baseos,appstream --disablerepo=ns-baseos,ns-appstream update
```

Permanently switch to official Rocky Linux repositories:

```
dnf config-manager --save --set-disabled ns-appstream ns-baseos
dnf config-manager --save --set-enabled appstream baseos
```

:::warning

Switching repositories bypasses the staged update mechanism provided by Nethesis-managed mirrors. Use this only when strictly necessary.

:::

Restore Nethesis-managed mirrors (default configuration):

```
dnf config-manager --save --set-enabled ns-appstream ns-baseos
dnf config-manager --save --set-disabled appstream baseos
```
