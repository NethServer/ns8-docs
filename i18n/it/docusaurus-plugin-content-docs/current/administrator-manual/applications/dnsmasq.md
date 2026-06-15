---
title: DNSMasq
sidebar_position: 13
---
# DNSMasq

Il modulo DNSMasq è un server DNS e DHCP leggero progettato per fornire i propri servizi all'interno di una rete privata. Non è consigliato usarlo come server DNS pubblico.

:::note

Non configurare Dnsmasq come resolver dei nomi del nodo NS8 in `/etc/resolv.conf`. Per ulteriori informazioni, vedi [Risoluzione dei nomi](../installation/system_requirements.md#resolv-conf).

:::

## Prerequisiti

L'unico prerequisito è un'interfaccia di rete configurata. Questo significa che la rete deve avere un indirizzo IPv4 valido e una maschera di sottorete valida. Fai riferimento alla documentazione della tua distribuzione per configurare correttamente un'interfaccia di rete.

## Configurazione

Dopo aver installato il modulo, puoi configurare sia il server DNS sia il server DHCP tramite l'interfaccia web.

Seleziona nel campo `Interface` l'interfaccia che vuoi usare per il server DNS e DHCP, quindi premi **Save**.

Una volta salvata la configurazione, saranno disponibili due interruttori per abilitare o disabilitare il server DNS e DHCP.

## DHCP {#dnsmasq-dhcp-section}

Il server DHCP può essere configurato con le seguenti opzioni:

- `IP range start`: il primo indirizzo IP che verrà assegnato ai client.
- `IP range end`: l'ultimo indirizzo IP che verrà assegnato ai client.
- `Lease time`: il tempo per cui l'indirizzo IP verrà assegnato al client, espresso in ore.
- `Gateway`: l'indirizzo IP del gateway per la configurazione dei client (opzione router DHCP 3). Se lasciato vuoto, ai client viene assegnato l'indirizzo gateway configurato per il nodo locale.

I campi vengono compilati automaticamente con valori predefiniti alla prima configurazione, ma puoi modificarli in base alle tue esigenze. Ulteriori opzioni possono essere configurate manualmente; fai riferimento alla sezione [Configurazione avanzata](#advanced-configuration).

## DNS

Il server DNS può essere configurato con le seguenti opzioni:

- `Primary forwarding server`: il server DNS primario che verrà utilizzato per risolvere le query.
- `Secondary forwarding server`: il server DNS secondario che verrà utilizzato per risolvere le query.

Quando il server DNS è abilitato, tutti i nomi di dominio pienamente qualificati (FQDN) configurati nel nodo verranno risolti usando un record `CNAME` che punta al nome host del nodo.

:::note

Il server DNS non risolverà automaticamente le voci presenti nel file `/etc/hosts`. Per risolvere le voci del file `/etc/hosts`, devi aggiungerle manualmente nella sezione [Record DNS](#dns-records).

:::

## Record DNS

Puoi aggiungere ulteriori voci DNS nella sezione `DNS Records`. Premi semplicemente il pulsante **Add DNS Record** e compila i campi con i valori desiderati:

- `Hostname`: il nome host che verrà risolto.
- `IP Address`: l'indirizzo IP a cui verrà risolto il nome host.

Gli indirizzi IP possono essere sia IPv4 sia IPv6.

## Configurazione avanzata

Il modulo fornisce ulteriori opzioni di configurazione accessibili manualmente tramite i file di configurazione.

Le directory che accettano file personalizzati si trovano nella directory radice del modulo, sotto la directory `state`.

Le seguenti directory possono essere usate per aggiungere file di configurazione personalizzati:

- `dnsmasq.d`: questa directory viene usata per aggiungere file di configurazione personalizzati per il servizio DNSMasq. I file devono avere estensione `.conf`. Fai riferimento alla [documentazione di DNSMasq](https://dnsmasq.org/docs/dnsmasq-man.html) per maggiori informazioni su come configurare il servizio.
- `dnsmasq_hosts.d`: questa directory viene usata per aggiungere file hosts personalizzati che saranno usati dal servizio DNSMasq. Il formato del file è lo stesso del file `/etc/hosts`. Consulta il [manuale](https://man7.org/linux/man-pages/man5/hosts.5.html) per maggiori informazioni su come scrivere il file.

Dopo aver aggiunto i file personalizzati, devi riavviare il servizio per applicare le modifiche.

I file personalizzati arricchiscono la configurazione esistente. Puoi personalizzare l'istanza DHCP fornita senza crearne una personalizzata usando il tag `default`; maggiori informazioni sono disponibili nella [documentazione di DNSMasq](https://dnsmasq.org/docs/dnsmasq-man.html).

I file personalizzati sono inclusi nel backup del modulo.
