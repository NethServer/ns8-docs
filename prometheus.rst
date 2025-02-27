.. _prometheus-section:

==========
Prometheus
==========

.. note::
    The Prometheus module is different from the one in :ref:`metrics-section`. This module is focused on monitoring
    external services and applications.

NethServer 8 includes a widely adopted monitoring stack composed by:

- `Prometheus <https://prometheus.io/>`_ scrapes all metrics endpoint and stores them on a local disk
- `Grafana <https://grafana.com/>`_ visualizes the collected metrics

This is the same stack used by :ref:`metrics-section`, but this module is focused on monitoring 
external services and applications.

You can install only one instance of **Prometheus**, usually on the leader node.
Prometheus does not require any configuration and it will be exposed on a random URL.
The URL is available on the Prometheus instance ``Status`` page. You can access it from the software center or
from the application menu in the top-right corner.

Since core 3.5.0, the node_exporter is already installed as core module on all nodes.
Prometheus will automatically scrape metrics from all nodes.

**Grafana** can be installed only on the leader node.
After installation, you will need to configure the ``Host name`` with a valid FQDN to access the Grafana instance.
Enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs.

Grafana will automatically display metrics from Prometheus and :ref:`Loki <loki-section>`.
