---
title: "WebTop-5: Disable 2FA in an emergency"
sidebar_position: 99
---
# WebTop-5: Disable 2FA in an emergency

To disable two-factor authentication (2FA), use the administration panel and access the settings of each individual user:

**Domains** > **NethServer** > **Users** > **Settings** > **Security (OTP/2FA)** > **Disable**

If needed, you can disable 2FA for the `admin` user from the shell:

```bash
runagent -m webtopX podman exec -i postgres su - postgres -c "psql -d webtop5 -c \"DELETE FROM core.user_settings WHERE user_id='admin' AND key LIKE 'otp%';\""
```

Replace `webtopX` with the actual WebTop instance name, for example `webtop1`.

Restart the application to apply the change:

```bash
runagent -m webtopX systemctl --user restart webapp
```
