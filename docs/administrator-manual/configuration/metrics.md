---
title: Metrics and alerts
sidebar_position: 8
---
# Metrics and alerts

The monitoring stack is automatically installed on the leader node.

All nodes will run [Node exporter](https://prometheus.io/docs/guides/node-exporter/) that provides the node metrics endpoint

The leader node will run:

- [Prometheus](https://prometheus.io/) scrapes all node_exporter metrics endpoint and stores them on a local disk
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) sends alerts to the configured receivers
- [Grafana](https://grafana.com/) visualizes the collected metrics, it is disabled by default

The monitoring is always available and it will automatically reconfigure when new nodes are added or removed from the cluster. When a node is promoted to leader, the monitoring stack will be automatically installed to new leader node and removed from the old one.

:::note

Metrics and alerts are not preserved when the leader node is switched.

:::

Metrics and alerts can be configured from the `Settings` page, under the `Metrics` section. The page will allow you to configure the following parameters:

- [Grafana access](#grafana_access-section)
- [Alert notifications](#alerts_notifications-section)

## Alerts {#alerts-section}

Prometheus automatically sends alerts to the Alertmanager when a rule is triggered. The current rules generate alerts for:

- No swap space configured
- Swap space nearly full
- One or more backup failures
- Disk partitions nearly full
- Software RAID (mdadm) degraded
- TLS certificate expired or expiring within 28 days
- Cluster node offline for more than 5 minutes
- Loki log server offline for more than 5 minutes

If the cluster has an Enterprise subscription, alerts are also forwarded to [my.nethesis.it](https://my.nethesis.it). Clusters with a Community subscription do not forward alerts.

Still, you can configure the alerts to be sent to custom email addresses.

Alerts are also visible from the Grafana `Alerting` menu. See [Grafana dashboards](#grafana_access-section).

### Alerts notifications {#alerts_notifications-section}

Mail notifications can be sent to users when an alert is fired or resolved.

The cluster needs an SMTP server to send the notifications. So first, make sure to enable the [Email notifications](email_notifications.md) feature.

To configure alert notifications, access the `Metrics` section in the `Settings` page. The page allows you to configure the following parameters:

- `Sender email address`: the email address that will be used as the sender. The default is calculated from the leader FQDN.
- `Recipient email addresses`: the email addresses to which alerts will be sent. Enter one address per line. Multiple recipients are supported.

If the cluster has an Enterprise subscription, alerts are also sent to [my.nethesis.it](https://my.nethesis.it).

## Grafana dashboards {#grafana_access-section}

Grafana is an open-source platform for monitoring and observability. It allows you to query, visualize and understand your metrics no matter where they are stored. Grafana provides you with tools to turn your time-series into insightful graphs and visualizations.

By default, Grafana is disabled. You can enable it using the `Access Grafana` option in the `Settings` page, under the `Metrics` section.

When enabled, Grafana will be accessible on the leader node at `https://<leader-node>/grafana`.

To access Grafana, you need to authenticate with the cluster admin credentials.

NS8 pre-configures only the Grafana dashboards. Other Grafana features, like alerts, alert rules, notifications and silences, are not controlled by NS8.

Dashboards are organized in two folders:

- `core`: dashboards of the cluster itself
- `modules`: dashboards of the installed applications (or "modules" in this context, see [The module term](../installation/modules.md#the-module-term)). When an application is installed, its dashboards appear in this folder.

`core` folder:

- `Node Exporter Full`: hardware and OS metrics of each node
  - CPU, memory, disk space, disk I/O, network, systemd units
  - Pick the node with the `Host` selector. Nodes are listed by VPN IP address and port, for example `10.5.4.1:9100`
- `Containers`: CPU, memory, network and disk usage of each module and its containers. See [Containers dashboard](#containers-dashboard-section)
- `Logs`: search the cluster logs stored in Loki. See [Log server](log_server.md)
  - Filter by `Node ID`, `Module`, `Category`
  - Free-text search
- `Loki metrics`: health and throughput of the Loki log server

`modules` folder examples:

- Samba: `Samba Audit search`, `Samba Audit statistics`. See [File server](../applications/file_server.md)
- CrowdSec: `CrowdSec Overview`, `CrowdSec Metrics`. See [CrowdSec](../applications/crowdsec.md)

### Containers dashboard {#containers-dashboard-section}

Use the `Containers` dashboard to find which application (or "module" in this context) container uses most CPU, memory or disk on a node.

Selectors at the top:

- `Node`
- `Module`

Both accept multiple values. `All` is allowed.

Summary at the top, for the selected time range:

- Number of modules and containers
- Total CPU (1.0 = one core fully busy)
- Total memory (page cache included)
- Total disk
- OOM kills (processes killed for out of memory)

Rows:

- `Modules`: table with one row per module and node, plus CPU, memory and network graphs by module
  - `core` is the core itself: Redis, promtail, node_exporter, rclone-gateway, shared rootfull image store, cluster, node and api-server state
  - `unknown` is a container whose owner cannot be found, for example started by hand or exiting
  - If a module shows disk usage but zero containers, the module is installed but not running
- `Containers`: table and graphs for the modules chosen in `Module`
  - CPU and memory top 10, block I/O, network
  - Container names are unique per module, not per node. For example `traefik` exists in both `traefik1` and `loki1`. Always read module and container together
- `Disk`: top 10 modules by disk usage (volumes, images, module state), disk growth over the last 14 days, volumes table
- `Collector health` (collapsed): age and duration of the last collection, skipped containers and modules

:::note

Limits:

- Disk figures are refreshed once a day, so they can be up to one day old. Right after install or update, disk panels can be empty until the first daily run.
- Network graphs show only containers with their own network. Most NS8 containers use the host network: their traffic is in the node network graphs of `Node Exporter Full`.
- A file hardlinked across two modules is counted for both, so the sum can exceed the real used space.

:::

To refresh disk data immediately, run on the node:

    systemctl start refresh-volume-metrics.service

:::warning

If the leader node is switched, Grafana will be accessible on the new leader node but dashboard customizations will be lost.

:::

## Access Prometheus web interface

By default, Prometheus web interface is not exposed to the public network.

If you need to troubleshoot the Prometheus configuration, you can enable it on `https://<leader-node>/prometheus`. As for Grafana, you will need to authenticate with cluster admin credentials.

To enable Prometheus web interface access, run the following command on the leader node:

    api-cli run module/metrics1/configure-module --data '{"prometheus_path": "prometheus", "grafana_path": "grafana"}'
