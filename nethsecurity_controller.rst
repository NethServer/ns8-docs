.. _nethsecurity-controller-section:

=======================
NethSecurity Controller
=======================

The NethSecurity controller allows for remote management of multiple `NethSecurity <https://docs.nethsecurity.org>`_ installations, referred to as units.

The controller establishes a secure connection between the central server and the units.
Each firewall registers with the server using the ns-plug client. Once registered, the server generates a VPN configuration 
that enables secure communication between the controller and the unit.

Key features of the NethSecurity controller include:

- **Centralized Management**: Manage multiple firewalls from a single server.
- **Secure Communication**: Establish a secure OpenVPN connection between the server and the firewalls.
- **Easy Configuration**: Configure firewalls directly from the controller's user interface.
- **Monitoring and Logging**: Collect and analyze logs from the firewalls using Loki for troubleshooting and monitoring purposes.
- **Metrics Visualization**: Visualize metrics from the firewalls using the built-in Grafana dashboard. Metrics are collected using Prometheus.
- **Web-based SSH**: Access the firewalls' command-line interface using a web-based SSH client.

See the `NethSecurity controller documentation`_ to learn more about the controller's features
and how to set it up.

.. _NethSecurity controller documentation: https://docs.nethsecurity.org/en/latest/controller.html
