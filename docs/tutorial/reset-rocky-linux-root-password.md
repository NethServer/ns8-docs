---
title: "Reset the root password on Rocky Linux 9"
sidebar_position: 99
---
# Reset the root password on Rocky Linux 9

Use this procedure to reset the `root` password on a Rocky Linux 9 system.

1. Start the machine. When the bootloader screen appears, press the **Up Arrow** or
   **Down Arrow** key to stop the boot countdown.
2. Select the most recent kernel and press **e** to edit the boot parameters.
3. Find the line that starts with `linux`, then modify it as follows:
   - remove the `console` directive and its value, for example `console=ttyS0,115200n8`
   - remove any other `console=...` or `vconsole=...` attributes
   - replace `ro` with `rw`
   - add `init=/bin/bash`

![Edit the Linux boot line](/_static/tutorial/reset-rocky-linux-root-password/edit-linux-line.png)

The modified `linux` line should look similar to this:

![Modified Linux boot line](/_static/tutorial/reset-rocky-linux-root-password/modified-linux-line.png)

4. Press **Ctrl-x** to boot the system with the modified parameters.
5. Wait until the boot process finishes and the shell prompt appears.

![Temporary root shell prompt](/_static/tutorial/reset-rocky-linux-root-password/root-shell-prompt.png)

6. Change the `root` password:

```bash
passwd
```

7. Force an SELinux relabel:

```bash
touch /.autorelabel
```

:::warning
Type the `touch /.autorelabel` command exactly as shown. If you make a mistake in the file
name or path, you must restart the whole procedure.
:::

8. Reboot the system:

```bash
/usr/sbin/reboot -f
```

The machine can reboot more than once. When the reboot sequence is complete, log in with the
new `root` password.
