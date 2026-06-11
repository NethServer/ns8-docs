---
title: DNSMasq
sidebar_position: 13
---
# DNSMasq

Il modulo DNSMasq è un server DNS e DHCP leggero progettato per fornire i propri servizi all'interno di una rete privata. Non è raccomandato per l'uso come server DNS pubblico.

:::note

Do not configure Dnsmasq as the NS8 node name resolver in `/etc/resolv.conf`. For more information, see [Name resolution](../installation/system_requirements.md#resolv-conf).

:::

## Prerequisiti

L'unico prerequisito è una interfaccia di rete configurata. Ciò significa che la rete dovrebbe avere un indirizzo IPv4 valido e una maschera subnet valida. Si prega di fare riferimento alla documentazione distro su come configurare correttamente un'interfaccia di rete.

## Configurazione

Dopo aver installato il modulo, è possibile configurare sia il server DNS che il server DHCP attraverso l'interfaccia web.

Select in the `Interface` field the interface that you want to use for DNS and DHCP server, then press **Save**.

Una volta salvata la configurazione, ci saranno due switch per attivare/disattivare il server DNS e DHCP.

## DHCP {#dnsmasq-dhcp-section}

Il server DHCP può essere configurato con le seguenti opzioni:

- `IP range start`: The first IP address that will be assigned to clients.
- `IP range end`: L'ultimo indirizzo IP che verrà assegnato ai client.
- `Lease time`: The time that the IP address will be assigned to the client, expressed in hours.
- `Gateway`: The gateway IP address for client configuration (DHCP router option 3). If left empty, the gateway address configured for the local node is assigned to clients.

I campi vengono automaticamente riempiti con valori predefiniti alla prima configurazione, ma puoi cambiarli in base alle tue esigenze. Ulteriori opzioni possono essere configurate manualmente, fare riferimento alla sezione [Advanced Configuration](#advanced-configuration) .

## DNS

The DNS server can be configured with the following options:

- `Primary forwarding server`: Il server DNS primario che verrà utilizzato per risolvere le query.
- `Secondary forwarding server`: Il server DNS secondario che verrà utilizzato per risolvere le query.

Quando il server DNS è abilitato, tutti i nomi di dominio pienamente qualificati (FQDN) configurati all'interno del nodo saranno risolti utilizzando un record 'CNAME' che indica il nome host del nodo.

:::note

The DNS server will not automatically resolve the entries in the `/etc/hosts` file. To resolve the entries in the `/etc/hosts` file, you need to add them manually in the [DNS Records](#dns-records) section.

:::

## DNS Records

Additional DNS entries can be added in the `DNS Records` section. Simply press the **Add DNS Record** button and fill the fields with the desired values:

- `Hostname`: The hostname that will be resolved.
- `IP Indirizzo`: L'indirizzo IP che verrà risolto al nome host.

Gli indirizzi IP possono essere IPv4 o IPv6.

## Advanced Configuration

Il modulo fornisce ulteriori opzioni di configurazione che possono essere accessibili manualmente tramite i file di configurazione.

Le directory che accettano i file personalizzati si trovano nella directory root del modulo, sotto la directory `state`.

Le seguenti directory possono essere utilizzate per aggiungere file di configurazione personalizzati:

- `dnsmasq.d`: This directory is used to add custom configuration files for the DNSMasq service. The files must have the `.conf` extension. Please refer to the [DNSMasq documentation](https://dnsmasq.org/docs/dnsmasq-man.html) for more information on how to configure the service.
- `dnsmasq_hosts.d`: This directory is used to add custom hosts files that will be used by the DNSMasq service. The format of the file is the same as the `/etc/hosts` file. Refer to the [manual](https://man7.org/linux/man-pages/man5/hosts.5.html) for more information on how to write the file.

Dopo aver aggiunto i file personalizzati, è necessario riavviare il servizio per applicare le modifiche.

The custom files enrich the existing configuration. You can customize the provided DHCP instance without creating a custom one using the tag `default`, more info can be found in the [DNSMasq documentation](https://dnsmasq.org/docs/dnsmasq-man.html).

I file personalizzati sono inclusi nel backup del modulo.
