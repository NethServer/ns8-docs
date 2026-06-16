---
title: "Modifica configurazione di rete di Rocky Linux"
sidebar_position: 99
---
# Modifica configurazione di rete di Rocky Linux

Modifica la configurazione di rete di Rocky Linux dal terminale locale.

:::warning
La modifica della configurazione di rete riavvia la connessione selezionata. Esegui la
procedura dalla console della macchina ed evita sessioni remote come SSH.
:::

Per aprire l'interfaccia testuale delle connessioni di rete, esegui:

```bash
nmtui-edit
```

La schermata mostra le connessioni Ethernet disponibili sulla macchina. Seleziona la
connessione da modificare, spostati su **Edit** e premi **Invio**.

![Seleziona la connessione da modificare](/_static/tutorial/rocky-linux-network-configuration/select-connection.png)

La configurazione attuale in genere e` **Automatic** (DHCP). Spostati su **Show** e premi
**Invio**.

![Apri le impostazioni dettagliate](/_static/tutorial/rocky-linux-network-configuration/show-settings.png)

Usa **Tab** per spostarti tra i campi e **Invio** per modificare e confermare i valori. Poi:

1. Cambia il tipo di configurazione da **Automatic** a **Manual**.
2. Seleziona **Add** accanto a **Address** e inserisci l'indirizzo IP in [notazione CIDR](#cidr-notation).
3. Seleziona **Add** accanto a **Gateway** e inserisci l'indirizzo IP del gateway di rete.
4. Seleziona **Add** accanto a **DNS servers** e aggiungi almeno un server DNS.

Dopo aver completato la configurazione, spostati su **OK** e premi **Invio**.

![Salva le nuove impostazioni](/_static/tutorial/rocky-linux-network-configuration/save-settings.png)

Tornato al menu delle connessioni Ethernet, spostati su **Quit** e premi **Invio**.

![Esci dal menu delle connessioni](/_static/tutorial/rocky-linux-network-configuration/quit-menu.png)

Tornato al prompt della shell, riavvia la connessione di rete modificata per applicare le
modifiche. In questo esempio, il nome della connessione e` `System eth0`:

```bash
nmcli connection down "System eth0" && nmcli connection up "System eth0"
```

Per elencare i nomi delle connessioni disponibili, esegui:

```bash
nmcli connection show
```

Le modifiche di rete vengono applicate dopo il riavvio della connessione.

## Notazione CIDR {#cidr-notation}

La notazione CIDR scrive un indirizzo IP insieme alla lunghezza del prefisso di rete,
separata da una barra. Per esempio, `192.168.1.10/24` significa:

- `192.168.1.10` e` l'indirizzo IP dell'host
- `/24` significa che i primi 24 bit identificano la rete

In una tipica rete domestica o da ufficio, `/24` di solito corrisponde alla netmask
`255.255.255.0`.