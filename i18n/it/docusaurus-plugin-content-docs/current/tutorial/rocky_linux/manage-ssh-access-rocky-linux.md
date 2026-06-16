---
title: "Gestione dell'accesso SSH su Rocky Linux"
sidebar_position: 99
---
# Gestione dell'accesso SSH su Rocky Linux

Questa procedura spiega come limitare l'accesso SSH a specifici IP pubblici oppure come
esporre SSH su una porta pubblica personalizzata su un nodo Rocky Linux che esegue NethServer
8.

Con una subscription attiva, lascia il servizio SSH in ascolto sulla porta locale standard
`22/tcp`. Questo requisito e` necessario per il corretto funzionamento del servizio di
supporto remoto integrato.

## Limita l'accesso SSH a IP specifici sulla porta 22

Se vuoi consentire l'accesso SSH solo da specifici IP pubblici, aggiungi una regola rich di
Firewalld e rimuovi l'esposizione predefinita del servizio `ssh`.

Esegui:

```bash
REMOTEIP=<IP_REMOTO>
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} port port=22 protocol=tcp accept"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

Per esempio, per consentire l'accesso SSH solo da `99.88.77.66`:

```bash
REMOTEIP=99.88.77.66
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} port port=22 protocol=tcp accept"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

Per consentire un altro IP pubblico, ripeti gli stessi comandi con l'indirizzo aggiuntivo.

## Esporre SSH su una porta pubblica personalizzata

Se vuoi esporre SSH su una porta pubblica diversa senza limitare l'accesso per IP sorgente,
configura un redirect firewall verso la porta locale `22`.

Esegui:

```bash
SSHPORT=<PORTA_REDIRECT>
firewall-cmd --permanent --add-forward-port=port=${SSHPORT}:proto=tcp:toport=22
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

Per esempio, per esporre SSH sulla porta pubblica `2222`:

```bash
SSHPORT=2222
firewall-cmd --permanent --add-forward-port=port=${SSHPORT}:proto=tcp:toport=22
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

## Esporre SSH su una porta pubblica personalizzata e limitare l'accesso per IP

Se il nodo e` ospitato su un VPS o in un altro ambiente pubblico, puoi combinare il redirect
della porta con una limitazione per IP sorgente.

Esegui:

```bash
SSHPORT=<PORTA_REDIRECT>
REMOTEIP=<IP_REMOTO>
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} forward-port port=${SSHPORT} protocol=tcp to-port=22"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

Per esempio, per consentire l'accesso SSH da `99.88.77.66` sulla porta pubblica `2222`:

```bash
SSHPORT=2222
REMOTEIP=99.88.77.66
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} forward-port port=${SSHPORT} protocol=tcp to-port=22"
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --reload
```

Per consentire un IP pubblico aggiuntivo sulla stessa porta rediretta, esegui:

```bash
SSHPORT=2222
REMOTEIP=77.66.55.44
firewall-cmd --permanent --add-rich-rule="rule family=ipv4 source address=${REMOTEIP} forward-port port=${SSHPORT} protocol=tcp to-port=22"
firewall-cmd --reload
```
