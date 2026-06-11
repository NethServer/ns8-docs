---
title: Operating system updates
sidebar_position: 2
---
# Operating system updates

NethServer 8 is installed on top of Linux distributions and strives to preserve default configurations as much as possible. The system administrator has the flexibility to choose how operating system updates are applied.

It is generally advisable to apply operating system updates promptly. If you have an active subscription, updates are automatically applied as described in the [Scheduled updates](../administrator-manual/about/subscription.md#scheduled-updates) section. Otherwise, consult your distribution documentation for guidance:

- [Rocky Linux/AlmaLinux](https://docs.rockylinux.org/guides/security/dnf_automatic/)
- [Debian](https://wiki.debian.org/UnattendedUpgrades)

CentOS Stream is regarded as a preview of the next stable RHEL release. Updates may introduce new software versions that could potentially cause unexpected issues. To enable automatic updates on CentOS Stream, simply follow the same instructions as outlined for Rocky Linux.

For updates to core and modules, refer to [Updates](../administrator-manual/installation/software_center.md#updates-section).
