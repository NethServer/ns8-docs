---
title: "Manage SSH access on Rocky Linux"
sidebar_position: 99
---
# Manage SSH access on Rocky Linux

This procedure explains how to limit SSH access to specific public IP addresses or expose SSH
 on a custom public port on a Rocky Linux node running NethServer 8.

With an active subscription, keep the SSH service listening on its standard local port
`22/tcp`. This is required for the integrated remote support service to work correctly.

## Limit SSH access to specific IP addresses on port 22

If you want to allow SSH access only from specific public IP addresses, add a Firewalld rich
rule and remove the default `ssh` service exposure.

Run:

```bash
REMOTEIP=<REMOTE_IP>
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} port port=22 protocol=tcp accept"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

For example, to allow SSH access only from `99.88.77.66`:

```bash
REMOTEIP=99.88.77.66
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} port port=22 protocol=tcp accept"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

To allow another public IP, repeat the same commands with the additional address.

## Expose SSH on a custom public port

If you want to expose SSH on a different public port without limiting access by source IP,
configure a firewall redirect to local port `22`.

Run:

```bash
SSHPORT=<REDIRECT_PORT>
firewall-cmd --permanent --add-forward-port=port=${SSHPORT}:proto=tcp:toport=22
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

For example, to expose SSH on public port `2222`:

```bash
SSHPORT=2222
firewall-cmd --permanent --add-forward-port=port=${SSHPORT}:proto=tcp:toport=22
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

## Expose SSH on a custom public port and limit access by IP

If the node is hosted on a VPS or another public environment, you can combine port redirection
with a source IP restriction.

Run:

```bash
SSHPORT=<REDIRECT_PORT>
REMOTEIP=<REMOTE_IP>
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} forward-port port=${SSHPORT} protocol=tcp to-port=22"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

For example, to allow SSH access from `99.88.77.66` on public port `2222`:

```bash
SSHPORT=2222
REMOTEIP=99.88.77.66
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} forward-port port=${SSHPORT} protocol=tcp to-port=22"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

To allow an additional public IP on the same redirected port, run:

```bash
SSHPORT=2222
REMOTEIP=77.66.55.44
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} forward-port port=${SSHPORT} protocol=tcp to-port=22"
firewall-cmd --reload
```
