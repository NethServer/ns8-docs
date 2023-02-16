.. _metrics-section:

=======
Metrics
=======

NethServer 8 uses a widely adopted stack composed by:

- `Node exporter <https://prometheus.io/docs/guides/node-exporter/>`_ gathers all system metrics from nodes
- `Prometheus <https://prometheus.io/>`_ scrapes all metrics endpoint and store them on local disk
- `Grafana <https://grafana.com/>`_ visualizes the collected metrics


You can install only one instance of Prometheus, usually on the leader node.
Prometheus does not require any configuration and it will be exposed on a random URL.
The URL is available at Prometheus instance ``Status`` page. You can access it from the software center or
from the application menu on the top-right corner.

You should install the node exporter on each cluster node.
To install it, access the :ref:`software_center-section` and look for the ``node_exporter`` application.
Each time a new node with the exporter is installed, Prometheus will automatic collect the node metrics.

Grafana can be installed only on the leader node.
After install, you will need to configure the ``Host name`` with a valid FQDN to access the Grafana instance.
Enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs.

Grafana will automatically display metrics from Prometheus and :ref:`Loki <loki-section>`.
