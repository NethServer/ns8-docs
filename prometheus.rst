.. _metrics-section:

.. _prometheus-section

==========
Prometheus
==========

NethServer 8 uses a widely adopted monitoring stack composed by:

- `Prometheus <https://prometheus.io/>`_ scrapes all metrics endpoint and stores them on a local disk
- `Node exporter <https://prometheus.io/docs/guides/node-exporter/>`_ provides the node metrics endpoint
- `Grafana <https://grafana.com/>`_ visualizes the collected metrics


You can install only one instance of **Prometheus**, usually on the leader node.
Prometheus does not require any configuration and it will be exposed on a random URL.
The URL is available on the Prometheus instance ``Status`` page. You can access it from the software center or
from the application menu in the top-right corner.

You should install the **node exporter** on each cluster node.
To install it, access the :ref:`software_center-section` and look for the ``node_exporter`` application.
Each time a new node with the exporter is installed, Prometheus will automatically collect the node metrics.

**Grafana** can be installed only on the leader node.
After installation, you will need to configure the ``Host name`` with a valid FQDN to access the Grafana instance.
Enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs.

Grafana will automatically display metrics from Prometheus and :ref:`Loki <loki-section>`.
