---
title: Firewall
sidebar_position: 6
---
# Firewall

NethServer 8 comes with a simple built-in firewall.

- L'interfaccia di rete VPN cluster `wg0` è parte di una zona di fiducia in cui tutto il traffico è consentito.
- Tutte le altre interfacce di rete fanno parte di una zona pubblica dove solo porte specifiche sono aperte.

Per impostazione predefinita, un nodo NS8 ha le seguenti porte aperte:

- Wireguard VPN, 55820 UDP
- HTTP and HTTPS, 80 and 443 TCP
- SSH, 22 TCP (see [Manage SSH port redirection](#ssh-redirection))
- Cockpit (not installed by default), 9090 TCP

Applications that require publicly open ports, such as the Mail server, will automatically configure the firewall.

## Review firewall settings

Nella pagina Impostazioni fare clic sulla scheda **Firewall** e selezionare un nodo del cluster.

- Per il nodo selezionato, una tabella riassume i servizi in esecuzione sul nodo e le porte TCP e UDP aperte. Se un porto non è elencato qui, è chiuso per i collegamenti dalla zona pubblica.
- Sotto la tabella dei servizi e delle porte aperte, c'è un elenco delle interfacce di rete del nodo.

The same page is accessible from the Nodes page by selecting the `Firewall` action from the three-dots menu of each node card.

## Manage ports manually

To allow connections to the listening port of a third-party service, use `firewall-cmd`. For instance, the following command opens TCP port 9000:

    firewall-cmd --add-port=9000/tcp

To close the same port, use:

    firewall-cmd --remove-port=9000/tcp

Changes to the firewall configuration are lost after a firewall restart or system reboot unless the same command is invoked a second time with the `--permanent` flag. Refer to the `firewall-cmd` manual page for more information.

To see the list of allowed services and ports, run:

    firewall-cmd --list-all

## Manage SSH port redirection {#ssh-redirection}

When a node is publicly accessible, such as a cloud VPS, it is desirable to change the default SSH port 22 to a custom port. However, changing the port at the `sshd` configuration level has two drawbacks:

1.  The default SELinux policy must be adjusted.
2.  The [Subscription](../about/subscription.md) remote support requirement does not work, because `sshd` must continue to accept local connections on port 22.

Since the Firewalld configuration must be changed in any case, the preferred approach is to configure only Firewalld with a *port forward* (or *port redirection*) and leave `sshd` unchanged.

The following commands open port 2222 and restrict access to port 22 to trusted interfaces:

    firewall-cmd --permanent --add-forward-port=port=2222:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --add-port=2222/tcp
    firewall-cmd --permanent --service=ssh --remove-port=22/tcp
    firewall-cmd --reload

If you later decide to change the port (for example, from 2222 to 2019), the old port forward must be removed first. The procedure is as follows:

    firewall-cmd --permanent --add-forward-port=port=2019:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --add-port=2019/tcp
    firewall-cmd --permanent --remove-forward-port=port=2222:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --remove-port=2222/tcp
    firewall-cmd --reload
