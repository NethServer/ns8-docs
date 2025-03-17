.. _traefik-section:

=====
Proxy
=====

`Traefik <https://traefik.io/>`_ proxy is part of NethServer core and it handles all HTTP routes.
The proxy is installed on each cluster node.

Access the ``HTTP routes`` card inside the ``Settings`` page to see all configured routes.
Applications usually automatically setup the proxy during the configuration phase.
Automatic routes can't be modified except for the allowed IPs.

Each route can have a list of special attributes visible from the list:

- ``automatic`` for created rules created by the applications
- ``access restricted`` if access is restricted to a specific network

You can add a custom route by clicking :guilabel:`Create route` button.
Then enter the following details:

- ``Name``: a unique name to identify the route
- ``Node``: the node where the proxy instance is running
- ``URL``: target URL of the route. It must correspond to a reachable
  backend HTTP server. It can be both internal or external to the cluster.
- ``Skip certificate validation``: if the URL starts with ``https://``,
  this switch disables the verification of the backend TLS certificate. If
  the backend is reached through a trusted network but it cannot provide a
  valid TLS certificate, it could be acceptable to skip the TLS
  verification.
- ``Host``: fill this field with a valid FQDN if you want a host-based route, sometimes also referred as virtual host;
  the application will be available on a URL like ``https://myapp.nethserver.org``
- ``Path``: fill this field with a valid path if you want a path-based route accessible from the cluster FQDN;
  the application will be available on a URL like ``https://cluster.nethserver.org/myapp``
- ``Strip URL path prefix``: when ``Path`` field is not empty, strip the path before routing the request to the target URL
- ``Request Let's Encrypt certificate`` enable this option to request a valid certificate, please remember :ref:`all requirements <certificate_manager-section>`
- ``Restrict access from``: restrict access to the route to a specific network, by default the route is accessible from any network.
  Enter a valid IPv4 address or CIDR network per line.
