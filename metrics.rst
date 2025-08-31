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

The monitoring is always available and it will automatically reconfigure when
new nodes are added or removed from the cluster.
When a node is promoted to leader, the monitoring stack will be automatically installed to new leader node
and removed from the old one.

.. note:: Metrics and alerts are not preserved when the leader node is switched.


Metrics and alerts can be configured from the ``Settings`` page, under the ``Metrics`` section.
The page will allow you to configure the following parameters:

- :ref:`grafana_access-section`
- :ref:`Alert notifications <alerts_notifications-section>`

.. _alerts-section:

Alerts
======

Prometheus will automatically send alerts to the Alertmanager when a rule is triggered.
Current rules will send alerts for:

- No SWAP is configured
- SWAP space is nearly full
- One or more backups have failed
- Disk partitions are nearly full
- Software RAID (mdadm) is degraded

If the machine has a valid subscription, the alerts will be forwarded to the Nethesis portal like `my.nethesis.it <https://my.nethesis.it>`_
or `my.nethserver.com <https://my.nethserver.com>`_.

Still, you can configure the alerts to be sent to custom email addresses.

Alerts are also be visible inside in the :ref:`Grafana <grafana_access-section>`.

.. _alerts_notifications-section:

Alerts notifications
--------------------

Mail notifications can be sent to users when an alert is fired or resolved.

The cluster needs an SMTP server to send the notifications. So first, make sure to enable the :ref:`email-notifications` feature.

To configure alert notifications, access the ``Metrics`` section in the ``Settings`` page.
The page allows you to configure the following parameters:

- ``Sender email address``: the email address that will be used as the sender. The default is calculated from the
  leader FQDN.
- ``Recipient email addresses``: the email addresses to which alerts will be sent.
  Enter one address per line. Multiple recipients are supported.

Please note that if the cluster has a valid subscription, the alerts will also be sent to the Nethesis portals.

.. _grafana_access-section:

Grafana access
==============

Grafana is an open-source platform for monitoring and observability. It allows you to query, visualize
and understand your metrics no matter where they are stored.
Grafana provides you with tools to turn your time-series into insightful graphs and visualizations.

By default, Grafana is disabled. You can enable it using the ``Access Grafana`` option in the ``Settings`` page, under the ``Metrics`` section.

When enabled, Grafana will be accessible on the leader node at ``https://<leader-node>/grafana``.

To access Grafana, you need to authenticate with the cluster admin credentials.

Grafana will automatically display some default dashboards:

- *core* folder: it contains the default dashboards for the cluster.
  Available dashboards are:

  - a dashboard for all nodes metrics like CPU load, memory usage, and disk space
  - a dashboard for fired alerts
  - a dashboard about Loki statistics
  - a dashboard to execute query on Loki logs

- *modules* folder: it contains the default dashboards for the installed modules, like Samba Audit

.. warning::
    If the leader node is switched, Grafana will be accessible on the new leader node but dashboard customizations
    will be lost.

Access Prometheus web interface
===============================

By default, Prometheus web interface is not exposed to the public network.

If you need to troubleshoot the Prometheus configuration, you can enable it on ``https://<leader-node>/prometheus``.
As for Grafana, you will need to authenticate with cluster admin credentials.

To enable Prometheus web interface access, run the following command on the leader node: ::

  api-cli run module/metrics1/configure-module --data '{"prometheus_path": "prometheus", "grafana_path": "grafana"}'


