.. _metrics-section:

==================
Metrics and alerts
==================

The monitoring stack is automatically installed on the leader node.

All nodes will run `Node exporter <https://prometheus.io/docs/guides/node-exporter/>`_ that provides the node metrics endpoint

The leader node will run:

- `Prometheus <https://prometheus.io/>`_ scrapes all node_exporter metrics endpoint and stores them on a local disk
- `Alertmanager <https://prometheus.io/docs/alerting/latest/alertmanager/>`_ sends alerts to the configured receivers
- `Grafana <https://grafana.com/>`_ visualizes the collected metrics, it is disabled by default

The monitoring stack does not require any configuration and it will automatically reconfigure when
new nodes are added or removed from the cluster.
When a node is promoted to leader, the monitoring stack will be automatically installed to new leader node
and removed from the old one.

.. note:: Metrics and alerts are not preserved when the leader node is switched.

Alerts
======

Prometheus will automatically send alerts to the Alertmanager when a rule is triggered.
Current rules will send alerts for:

- No SWAP is configured
- SWAP space is nearly full
- One or more backups have failed
- Disk partitions are nearly full

If the machine has a valid subscription, the alerts will be forwarded to the Nethesis portal like `my.nethesis.it <https://my.nethesis.it>`_
or `my.nethserver.com <https://my.nethserver.com>`_.

If the machine does not have a valid subscription, the alerts will be visible only in the Grafana dashboard.
Still you can configure the alerts to be sent to a specific email address. See :ref:`mail-notifications` section.

Enable Grafana
==============

Grafana is an open-source platform for monitoring and observability. It allows you to query, visualize, alert on,
and understand your metrics no matter where they are stored.
Grafana provides you with tools to turn your time-series into insightful graphs and visualizations.

By default, Grafana is not enabled. You can enable it by configuring a path where it will be exposed.

Grafana can be exposed on a path of your choice.
To enable Grafana access, run the following command on the leader node: ::

  api-cli run module/metrics1/configure-module --data '{"prometheus_path": "", "grafana_path": "grafana"}'

Grafana will be then accessible at the following URL: ``https://<leader-node>/grafana``.
If you switched the leader, please note that you may have to replace ``metrics1`` with actual metrics module instance name.

Default Grafana credentials are:

- username: ``admin``
- password: ``admin``

During the first login, you will be asked to change the password.

Grafana will automatically display:

- a dashboard for all nodes metrics like CPU load, memory usage, and disk space
- a dashboard for fired alerts

.. warning::
    If the leader node is switched, Grafana will be accessible on the new leader node but the configuration will be lost:
    you will need to reconfigure the admin password and customization to the dashboards.

Access Prometheus web interface
===============================

By default, Prometheus web interface is not exposed to the public network.

If you need to troubleshoot the Prometheus configuration, you can expose the Prometheus web interface on a path of your choice.

To enable Prometheus web interface access, run the following command on the leader node: ::

  api-cli run module/metrics1/configure-module --data '{"prometheus_path": "prometheus", "grafana_path": "grafana"}'

Prometheus will be then accessible at the following URL: ``https://<leader-node>/prometheus``.

.. note:: Prometheus web interface will be accessible from any IP address without authentication. Use with caution.

.. _mail-notifications:

Mail notifications
==================

Mail notifications can be sent to users when an alert is fired or resolved.
The cluster needs an SMTP server to send the notifications. So first, make sure to enable the :ref:`email-notifications` feature.
If mail notifications are not enabled, the alerts will be visible only in the Grafana dashboard and not sent to any email address.

Then, configure the mail notifications by running the following command on the leader node: ::

  api-cli run module/metrics1/configure-module --data '{"prometheus_path": "", "grafana_path": "grafana", "mail_to": ["alert@nethserver.org"], "mail_from": "no-reply@nethserver.org"}'

The ``mail_to`` parameter is a list of email addresses that will receive the alerts.
The ``mail_from`` parameter is the email address that will be used as the sender.
