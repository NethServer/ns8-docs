---
title: CrowdSec
sidebar_position: 10
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) è un tool di rilevamento attività sospette. Cerca pattern conosciuti, come tentativi di login malevoli, nei log delle applicazioni e blocca l'indirizzo IP dell'attaccante.

È possibile installare solo un'istanza CrowdSec per ogni nodo.

## Configurazione

Una volta installato, CrowdSec è già completamente funzionale e protegge molte applicazioni NS8.

Dall'interfaccia web è possibile configurare:

- mail notification by adding one address per line inside `Email notifications` field: notifications will work only if [Email notifications](../configuration/email_notifications.md) has been configured
- IP e rete che non saranno mai bloccati
- tempo di divieto dinamico e statico

As default, CrowdSec will send some telemetry to remote CrowdSec-owned servers. The servers use such data to compose a community blocklist which is sent back to your installation. If you do not want to share such data and disable the community blocklist, you can do it by disabling the `Enable central API` option under the `Advanced` section.

You can also connect your instance to [CrowdSec console](https://app.crowdsec.net) by filling the `Enroll key` optional field.

CrowdSec sends a daily notification email listing newly blocked IPs to the configured recipients. If the default threshold of 100 new blocked IPs is reached before the daily report, the notification is sent immediately. The `Notification threshold` field, under the `Advanced` section, controls this value and can be set between 1 and 10000.

CrowdSec data is accessible from the `CrowdSec Overview` and `CrowdSec Metrics` Grafana dashboards, as explained in [Grafana access](../configuration/metrics.md#grafana_access-section).

### Community blocklist vs Community blocklist (Lite)

CrowdSec provides a [community blocklist](https://docs.crowdsec.net/docs/next/central_api/community_blocklist) that is shared among all users. To activate this feature, you need to:

- Enable the Central API option.
- Enroll your CrowdSec instance in the console.

To access the full community blocklist (beyond the Lite version), you must share at least some ban decisions with the Central API every 24 hours. If your server has few or no bans, it will be considered as a blocking state, preventing access to the complete blocklist.

## Command-line interface

The `cscli` command is a powerful command-line interface to access advanced Crowdsec functions. To run `cscli`, you have to enter the application environment first. Type in a root shell the following command

    runagent -m crowdsec1 bash

Then the `cscli` command becomes available. For instance, print the help message with

    cscli --help
