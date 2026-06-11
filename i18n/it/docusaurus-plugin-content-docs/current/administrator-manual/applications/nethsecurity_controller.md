---
title: Regolatore di sicurezza
sidebar_position: 12
---
# Regolatore di sicurezza

Il controller NethSecurity consente la gestione remota di più installazioni [NethSecurity](https://docs.nethsecurity.org), denominate unità.

The controller establishes a secure connection between the central server and the units. Each firewall registers with the server using the ns-plug client. Once registered, the server generates a VPN configuration that enables secure communication between the controller and the unit.

Le caratteristiche chiave del controller NethSecurity includono:

- \*\* Gestione centralizzata \*\* Gestisci più firewall da un singolo controller.
- **Secure Communication**: Stabilire una connessione OpenVPN sicura tra il server e i firewall.
- \*\* Configurazione semplice \*\* Configura i firewall direttamente dall'interfaccia utente del controller.
- **Monitoring and Logging**: Collect and analyze logs from the firewalls using Loki for troubleshooting and monitoring purposes.
- **Metrics Visualization**: Visualize metrics from the firewalls using the built-in Grafana dashboard. Metrics are collected using Prometheus and TimescaleDB.
- **SSH Web-based**: Accesso alla command line dei firewall utilizzando un client web SSH.

See the [NethSecurity controller documentation](https://docs.nethsecurity.org/en/latest/controller.html) to learn more about the controller's features and how to set it up.
