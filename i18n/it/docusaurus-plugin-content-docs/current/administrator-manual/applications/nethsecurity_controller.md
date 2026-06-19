---
title: Controller NethSecurity
---
# Controller NethSecurity

Il controller NethSecurity consente la gestione remota di più installazioni di [NethSecurity](https://docs.nethsecurity.org), chiamate unità.

Il controller stabilisce una connessione sicura tra il server centrale e le unità. Ogni firewall si registra sul server usando il client ns-plug. Una volta registrato, il server genera una configurazione VPN che consente la comunicazione sicura tra il controller e l'unità.

Le funzionalità principali del controller NethSecurity includono:

- **Gestione centralizzata**: gestisci più firewall da un unico server.
- **Comunicazione sicura**: stabilisci una connessione OpenVPN sicura tra il server e i firewall.
- **Configurazione semplice**: configura i firewall direttamente dall'interfaccia utente del controller.
- **Monitoraggio e log**: raccogli e analizza i log dei firewall con Loki per attività di troubleshooting e monitoraggio.
- **Visualizzazione delle metriche**: visualizza le metriche dei firewall con la dashboard Grafana integrata. Le metriche vengono raccolte usando Prometheus e TimescaleDB.
- **SSH via web**: accedi all'interfaccia a riga di comando dei firewall usando un client SSH via web.

Consulta la [documentazione del controller NethSecurity](https://docs.nethsecurity.org/en/latest/controller.html) per saperne di più sulle funzionalità del controller e su come configurarlo.
