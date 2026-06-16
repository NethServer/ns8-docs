---
title: "Enable SSH password authentication on Rocky Linux"
sidebar_position: 99
---
# Enable SSH password authentication on Rocky Linux

Rocky Linux instances used to host NS8 (including the pre-built images available for download)
are often configured to allow SSH access only via an SSH key pair.

To allow password-based SSH login for non-privileged users (which can be created as documented
in the pre-built images section of the installation manual), run the following commands:

```bash
echo -e 'PasswordAuthentication yes' > /etc/ssh/sshd_config.d/00-custom.conf
systemctl restart sshd
```

To also allow `root` to log in via SSH with a password, run:

```bash
echo -e 'PasswordAuthentication yes\nPermitRootLogin yes' > /etc/ssh/sshd_config.d/00-custom.conf
systemctl restart sshd
```

:::warning
Carefully evaluate whether to allow `root` SSH password access. This choice
**significantly weakens the security** of the system, exposing it to **potential security
issues** — especially if the instance is hosted on a cloud provider.
:::
