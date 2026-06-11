---
title: Aggiornamenti del sistema operativo
sidebar_position: 2
---
# Aggiornamenti del sistema operativo

NethServer 8 è installato in cima alle distribuzioni Linux e si sforza il più possibile di preservare le configurazioni di default. L'amministratore di sistema ha la flessibilità di scegliere come vengono applicati gli aggiornamenti del sistema operativo.

È generalmente consigliabile applicare prontamente gli aggiornamenti del sistema operativo. Se si dispone di un abbonamento attivo, gli aggiornamenti vengono applicati automaticamente come descritto nella sezione: `scheduled-updates`. In caso contrario, consultare la guida della documentazione della distribuzione:

- [Rocky Linux/AlmaLinux](https://docs.rockylinux.org/guides/security/dnf_automatic/)
- [Debian](https://wiki.debian.org/UnattendedUpgrades)

CentOS Stream è considerato come un'anteprima del prossimo rilascio stabile RHEL. Gli aggiornamenti possono introdurre nuove versioni del software che potrebbero potenzialmente causare problemi inaspettati. Per attivare gli aggiornamenti automatici su CentOS Stream, basta seguire le stesse istruzioni indicate per Rocky Linux.

Per gli aggiornamenti al core e ai moduli, fare riferimento a:ref: `updates-section`.
