.. _traefik-section:

.. _http-routes-section:

===========
HTTP routes
===========

The ``HTTP routes`` section of the Settings page shows how each cluster
node routes HTTP traffic received on standard TCP ports 80 (HTTP) and 443
(HTTPS) to applications installed in the cluster or towards custom network
destinations.

The core component that implements HTTP routes is the Traefik_ HTTP proxy.
Each cluster node runs its own Traefik instance and acts as an independent
web server. Traefik terminates TLS connections and works as the reverse
proxy for applications typically hosted on that node.

.. _Traefik: https://traefik.io/

Routes can be managed automatically by installed applications. In that
case, they are marked with the ``Automatic`` badge. Alternatively, you can
create custom routes and define their properties as needed.

A route is defined by a match rule for incoming requests, based on the
HTTP **host name** and/or the **request path**. It also specifies the
destination URL where matching traffic is forwarded.

Automatic routes usually point their destination URL to local services
(often using ``http://127.0.0.1``), so their traffic does not cross the
cluster network. Custom routes, instead, can be configured with any
reachable destination URL, including services in the node’s LAN or even on
another cluster node if desired.

There is no special HTTP traffic handling for the cluster leader node:
all nodes behave in the same way.

Each route can have special attributes, visible in the main table:

- ``Automatic`` for rules created and managed by applications
- ``Access restricted`` if access is limited to specific IP addresses

Automatic routes cannot be modified except for the list of allowed IPs.
When IP restrictions are added, they also gain the ``Access restricted``
attribute.

.. note::

   The route named ``cluster-admin`` is an automatic route, created during
   node setup. On the leader node it provides access to the cluster
   administration interface. On worker nodes it is required to elect a new
   cluster leader. If you restrict access to this route:

   - You may prevent a new worker from joining the cluster.
   - You may lose access to the cluster configuration if your own IP
     address is not allowed.

   Refer to :ref:`clear-cluster-admin-restrictions` to restore access if
   needed.

You can view the detailed attributes of any route by clicking its
``Name``.

.. _custom-http-route-section:

Create a custom HTTP route
==========================

To add a custom route, click the :guilabel:`Create route` button and enter
the following details:

- ``Name``: a unique identifier for the route

- ``Node``: the node where the rule applies

- ``URL``: the target URL of the route. It must point to a reachable
  backend HTTP server, either inside or outside the cluster. For better
  performance, use the local host address ``127.0.0.1`` without encryption
  for local applications, or ``https://`` for external applications in the
  node’s LAN. In the latter case, encrypting the backend connection is
  strongly recommended.

- ``Skip certificate validation``: if the URL starts with ``https://``,
  this option disables verification of the backend TLS certificate.
  Skipping validation may be acceptable only if the backend is in a
  trusted network and cannot provide a valid TLS certificate.

- ``Host``: set a valid FQDN to create a host-based route (virtual host).
  The rule matches requests where the ``Host`` header equals the given FQDN.
  Example: with host ``myapp.nethserver.org`` the route matches
  ``https://myapp.nethserver.org``.

- ``Path``: set a valid URL path starting with ``/`` (slash) to create a
  path-based route. The rule matches any request path that begins with it,
  regardless of the host name. For example, with path ``/myapp`` the route
  matches both ``https://ns8leader.nethserver.org/myapp`` and
  ``https://192.168.6.3/myapp/contents.html``.

- ``Host`` + ``Path``: if both fields are set, the request must match
  both the host name and the path. For example, with host
  ``myapp.nethserver.org`` and path ``/mypath``, the route matches
  ``https://myapp.nethserver.org/mypath/contents.html`` but not
  ``https://ns8leader.nethserver.org/mypath/contents.html``.

- ``Strip URL path prefix``: when ``Path`` is set, remove the prefix
  before routing the request to the target URL.

- ``Request Let's Encrypt certificate``: enable this option to
  automatically obtain a valid TLS certificate. See
  :ref:`lets_encrypt_routes` for important details if you disable this
  option later.

- ``Allow access from`` (optional): restrict access to the route by
  listing allowed IPv4 addresses or CIDR networks, one per line. By
  default, the route is open to all networks.

.. _lets_encrypt_routes:

Let's Encrypt certificate for HTTP routes
=========================================

The ``Request Let's Encrypt certificate`` option enables automatic
provisioning of a TLS certificate for the ``Host`` name, signed by the
Let's Encrypt Certificate Authority. Once obtained, the certificate is
periodically renewed by Traefik. Refer to :ref:`lets-encrypt-requirements`
for details about requirements and how the process works.

When this option is disabled, the old TLS certificate is automatically
removed from Traefik’s internal certificate storage, and Traefik is
restarted after clicking the :guilabel:`Save` button.

.. warning::

  Restarting Traefik can forcibly disconnect users from applications.
  Avoid disabling the ``Request Let's Encrypt certificate`` option during
  office hours.

.. _clear-cluster-admin-restrictions:

Clear IP restrictions on cluster-admin route
============================================

If you lose access to the cluster administration interface due to IP
restrictions, you can remove them from the command line:

1. Connect to the cluster leader node via SSH with root privileges and get
   the Traefik module identifier: ::

     runagent -l | grep traefik        # prints: traefik1

2. Run the following command to clear restrictions on the
   ``cluster-admin`` route of module ``traefik1``: ::

     api-cli run module/traefik1/set-route --data '{"instance": "cluster-admin", "ip_allowlist": []}'
