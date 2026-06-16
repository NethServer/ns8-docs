---
title: "Change Rocky Linux network configuration"
sidebar_position: 99
---
# Change Rocky Linux network configuration

Change the Rocky Linux network configuration from the local terminal.

:::warning
Changing the network configuration restarts the selected connection. Perform this procedure
from the machine console and avoid remote sessions such as SSH.
:::

To open the text interface for network connections, run:

```bash
nmtui-edit
```

The screen lists the Ethernet connections available on the machine. Select the connection you
want to change, move to **Edit**, and press **Enter**.

![Select the connection to edit](/_static/tutorial/rocky-linux-network-configuration/select-connection.png)

The current configuration is usually **Automatic** (DHCP). Move to **Show** and press
**Enter**.

![Open the detailed settings](/_static/tutorial/rocky-linux-network-configuration/show-settings.png)

Use **Tab** to move between fields and **Enter** to edit and confirm values. Then:

1. Change the configuration type from **Automatic** to **Manual**.
2. Select **Add** next to **Address** and enter the IP address in [CIDR notation](#cidr-notation).
3. Select **Add** next to **Gateway** and enter the network gateway IP address.
4. Select **Add** next to **DNS servers** and add at least one DNS server.

After completing the configuration, move to **OK** and press **Enter**.

![Save the new settings](/_static/tutorial/rocky-linux-network-configuration/save-settings.png)

Back in the Ethernet connections menu, move to **Quit** and press **Enter**.

![Exit from the connections menu](/_static/tutorial/rocky-linux-network-configuration/quit-menu.png)

Back at the shell prompt, restart the modified network connection to apply the changes.
In this example, the connection name is `System eth0`:

```bash
nmcli connection down "System eth0" && nmcli connection up "System eth0"
```

To list the available connection names, run:

```bash
nmcli connection show
```

The network changes are applied after the connection restarts.

## CIDR notation {#cidr-notation}

CIDR notation writes an IP address together with its network prefix length, separated by a
slash. For example, `192.168.1.10/24` means:

- `192.168.1.10` is the host IP address
- `/24` means the first 24 bits identify the network

In a typical home or office network, `/24` usually corresponds to the netmask
`255.255.255.0`.