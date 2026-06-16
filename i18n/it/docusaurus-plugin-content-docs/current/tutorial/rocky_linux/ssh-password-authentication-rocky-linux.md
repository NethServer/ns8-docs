---
title: "Abilitazione accesso SSH con password su Rocky Linux"
sidebar_position: 99
---
# Abilitazione accesso SSH con password su Rocky Linux

Spesso le istanze Rocky Linux usate per ospitare NS8 (incluse le immagini pre-built disponibili
per il download) adottano una configurazione del demone SSH che consente l'accesso solo tramite
una coppia di chiavi SSH.

Per consentire l'accesso con password in SSH ad utenti non privilegiati (che si possono creare
come documentato nella sezione delle immagini pre-built del manuale), esegui i seguenti comandi:

```bash
echo -e 'PasswordAuthentication yes' > /etc/ssh/sshd_config.d/00-custom.conf
systemctl restart sshd
```

Per consentire l'accesso via SSH anche a `root` con password, esegui:

```bash
echo -e 'PasswordAuthentication yes\nPermitRootLogin yes' > /etc/ssh/sshd_config.d/00-custom.conf
systemctl restart sshd
```

:::warning
Valuta con attenzione la possibilità di consentire all'utente `root` l'accesso SSH con password.
Una simile scelta **indebolisce sensibilmente il livello di robustezza** del sistema, esponendolo
a **potenziali problemi di sicurezza**, soprattutto nel caso in cui si tratti di una istanza
ospitata su provider cloud.
:::
