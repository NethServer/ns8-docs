---
title: Aggiornamenti del sistema operativo
sidebar_position: 2
---
# Aggiornamenti del sistema operativo

NethServer 8 funziona su distribuzioni Linux standard e lascia la maggior parte della configurazione del sistema operativo sotto il controllo dell'amministratore di sistema.

L'amministratore di sistema può decidere come e quando applicare gli aggiornamenti del sistema operativo. In generale, è consigliabile installare gli aggiornamenti tempestivamente.

Se si dispone di un *abbonamento attivo*, il criterio predefinito di aggiornamento del sistema operativo applica gli aggiornamenti automaticamente come descritto nella sezione [Aggiornamenti programmati](../administrator-manual/about/subscription.md#scheduled-updates).

:::warning

Su Rocky Linux, non abilitare `dnf-automatic` o altro meccanismo di aggiornamento automatico se si dispone di un [abbonamento attivo](../administrator-manual/about/subscription.md). Utilizzare invece la funzione di aggiornamenti programmati. L'esecuzione di più meccanismi di aggiornamento può comportare l'applicazione degli aggiornamenti al di fuori della pianificazione prevista.

:::

## Aggiornamenti automatici

Per abilitare gli aggiornamenti automatici del sistema operativo, consultare la documentazione della distribuzione:

- Rocky Linux / AlmaLinux e similari: [Patching servers with dnf-automatic](https://docs.rockylinux.org/guides/security/dnf_automatic/)
- Debian: [Periodic updates](https://wiki.debian.org/PeriodicUpdates)

:::note

CentOS Stream segue un modello di rilascio continuo e può introdurre versioni software più recenti che possono portare a comportamenti inaspettati. Se si abilitano gli aggiornamenti automatici, seguire lo stesso approccio utilizzato per Rocky Linux.

:::

:::note

Per gli aggiornamenti a NS8 core e moduli, fare riferimento a [Aggiornamenti](../administrator-manual/installation/software_center.md#updates-section).

:::

## Aggiornamenti manuali

Il comando per aggiornare il sistema operativo dipende dalla distribuzione:

- [APT](https://www.debian.org/doc/manuals/debian-faq/pkgtools.en.html#apt-get) (Debian): ::

    apt update && apt upgrade

- [DNF](https://docs.rockylinux.org/9/guides/package_management/dnf_package_manager/#update-and-upgrade) (Rocky Linux, AlmaLinux e similari): ::

    dnf update

## Riavvio del nodo

Alcuni aggiornamenti, come gli aggiornamenti del kernel, possono richiedere il riavvio del nodo.

Dopo il completamento degli aggiornamenti (automatici o manuali), riavviare il sistema:

```
shutdown -r now
```

Per pianificare un riavvio tra 30 minuti:

```
shutdown -r +30 "System reboot in 30 minutes"
```

Per annullare un riavvio programmato:

```
shutdown -c
```

## Mirror gestito da Nethesis per Rocky Linux {#neth-mirror}

Quando NS8 è installato su Rocky Linux, la configurazione DNF viene regolata per utilizzare mirror gestiti da [Nethesis](https://www.nethesis.it).

- `ns-appstream` (NS8 Rocky Linux 9 - AppStream)
- `ns-baseos` (NS8 Rocky Linux 9 - BaseOS)

Questi mirror vengono sincronizzati settimanalmente con i repository ufficiali di Rocky Linux (venerdì alle 21:00 UTC) e fungono da snapshot controllata del contenuto upstream.

Questo ritardo consente di identificare e bloccare potenziali modifiche problematiche nei repository upstream prima che raggiungano i sistemi di produzione.

I mirror sono disponibili per tutte le installazioni NS8, indipendentemente dallo stato dell'abbonamento.

Con un abbonamento attivo, gli aggiornamenti vengono distribuiti progressivamente dall'ultimo snapshot in modo graduale. Questo approccio di distribuzione graduale riduce il rischio di problemi diffusi esponendo gradualmente gli aggiornamenti negli ambienti.

In caso di un fix di sicurezza importante o per qualsiasi altro motivo eccezionale, gli amministratori possono temporaneamente bypassare o disabilitare permanentemente i mirror gestiti da Nethesis per accedere ai repository ufficiali di Rocky Linux.

Verificare lo stato del repository upstream rispetto al mirror Nethesis:

```
dnf repolist -v --repo=*baseos
dnf repolist -v --repo=*appstream
```

Esecuzione singola di aggiornamenti dai repository ufficiali:

```
dnf --enablerepo=baseos,appstream --disablerepo=ns-baseos,ns-appstream update
```

Passaggio permanente ai repository ufficiali di Rocky Linux:

```
dnf config-manager --save --set-disabled ns-appstream ns-baseos
dnf config-manager --save --set-enabled appstream baseos
```

:::warning

Il passaggio ai repository bypassa il meccanismo di distribuzione graduale fornito dai mirror gestiti da Nethesis. Utilizzare solo quando strettamente necessario.

:::

Ripristino dei mirror gestiti da Nethesis (configurazione predefinita):

```
dnf config-manager --save --set-enabled ns-appstream ns-baseos
dnf config-manager --save --set-disabled appstream baseos
```
