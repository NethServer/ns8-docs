---
title: "Samba: wide links and shared folders"
sidebar_position: 99
---
# Samba: wide links and shared folders

For security reasons, Samba disables wide links by default. A symbolic link that crosses
different paths (for example, from one share to another) generates a permission error.

:::warning
Enabling this configuration allows unprivileged users to **access filesystem areas outside
the share path**! Only enable this if you are fully aware of the possible consequences.
:::

To enable wide links, assuming the Samba module instance is named `samba1`
(adjust the command if your instance has a different name):

```bash
runagent -m samba1 podman exec -ti samba-dc bash -l

echo -e "\n[global]\nallow insecure wide links = yes\nfollow symlinks = yes\nwide links = yes\n" >>/etc/samba/include.conf

smbcontrol smbd reload-config
```
