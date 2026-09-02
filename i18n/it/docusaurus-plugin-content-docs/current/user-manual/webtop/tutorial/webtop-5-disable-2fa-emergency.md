---
title: "WebTop-5: Come disabilitare la 2FA in caso di emergenza"
sidebar_position: 99
---
# WebTop-5: Come disabilitare la 2FA in caso di emergenza

Per disabilitare l'autenticazione a due fattori (2FA), usa il pannello di amministrazione e accedi alle impostazioni di ogni singolo utente:

**Domini** > **NethServer** > **Utente** > **Impostazioni** > **Sicurezza (OTP/2FA)** > **Disattiva**

In caso di necessità, puoi disabilitare la 2FA per l'utente `admin` dalla shell:

```bash
runagent -m webtopX podman exec -i postgres su - postgres -c "psql -d webtop5 -c \"DELETE FROM core.user_settings WHERE user_id='admin' AND key LIKE 'otp%';\""
```

Sostituisci `webtopX` con il nome reale dell'istanza WebTop, per esempio `webtop1`.

Riavvia l'applicazione per applicare la modifica:

```bash
runagent -m webtopX systemctl --user restart webapp
```
