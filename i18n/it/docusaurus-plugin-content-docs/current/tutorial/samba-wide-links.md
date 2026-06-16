---
title: "Samba: wide links e cartelle condivise"
sidebar_position: 99
---
# Samba: wide links e cartelle condivise

Per motivi di sicurezza Samba ha i wide links disabilitati di default, quindi un link simbolico
che collega path diversi (per esempio da una share ad un'altra) genera un errore a causa di
mancanza di permessi.

:::warning
Abilitare questa configurazione consentirà agli utenti non privilegiati di **raggiungere zone
del filesystem al di fuori del percorso delle share**! È opportuno abilitare questa
configurazione solo se si è ben consci delle possibili conseguenze.
:::

Per attivare la funzionalità, supponendo che il modulo che ospita il file server sia `samba1`
(altrimenti adatta il comando in base al nome della tua istanza):

```bash
runagent -m samba1 podman exec -ti samba-dc bash -l

echo -e "\n[global]\nallow insecure wide links = yes\nfollow symlinks = yes\nwide links = yes\n" >>/etc/samba/include.conf

smbcontrol smbd reload-config
```
