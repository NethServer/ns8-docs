============
Installation
============

.. highlight:: bash

Pick your preferred distribution between supported ones and make sure it's up to date. 
Also ensure that the system firewall is not blocking any connection.

First, ensure ``curl`` is installed:
- for Debian: ``apt-get install -y curl``
- for CentOS: ``dnf install -y curl``

Start the installation procedure as ``root``: ::

   curl https://raw.githubusercontent.com/NethServer/ns8-core/main/core/install.sh | bash

At the end of the install script the UI is available at **https://\<server_ip_or_fqdn\>/cluster-admin/**:

- default user: ``admin``
- default password: ``Nethesis,1234``

Some configuration tasks can be completed also by invoking additional
commands: follow on-screen instructions printed by ``install.sh``.

Run either new cluster initialization (``create-cluster``) or joining an existing cluster (``join-cluster``).

Install custom images
=====================

Advanced users may prefer to run ``install.sh`` with one or more images from a
development branch or alternative registries.

::

  bash install.sh ghcr.io/nethserver/core:latest ghcr.io/nethserver/traefik:mybranch

Install customization
---------------------

The install script also accepts the following environment variables:

- ``TESTING``: override testing flag inside the ``default`` repository. It can be ``0`` (disabled) or ``1`` (enabled), default is ``0``
- ``REPMOD``: override ``default`` software repository URL, it could be something like ``https://mycustomrrepo.server.test/repomd``
- ``ADMIN_PASSWORD``: override default admin password

Applications
============

Core applications installed by default:

- :ref:`traefik-section` and :ref:`certificate_manager-section`
- :ref:`Log server <loki-section>` only on leader node
- :ref:`LDAP connector <ldap_proxy-section>`

Other available core applications:

- :ref:`active_directory-section`
- :ref:`openldap-section`


Application installation
------------------------

Applications can be installed directly from the user interface.

If you prefer the command line, use the ``add-module`` command: ::

  add-module <module> <node_id>

The above command will try to install the latest stable version of the module.

Example to install Dokuwiki on node 1: ::

  add-module dokuwiki 1

You can also install an image which is not still available inside the repository by using
its URL.

Example to install Dokuwiki directly from the image registry: ::

  add-module ghcr.io/nethserver/dokuwiki:mydev 1

If the given image is already present in the local Podman storage, no
remote download occurs and the local image is used instead. During
development this might be unwanted and to work around this behavior
execute the following command in every cluster node, before ``add-module``: ::

  podman rmi ghcr.io/nethserver/dokuwiki:mydev

Many applications need a configuration step after install, for more info, 
please refer to the README of each application.

Uninstall
=========

The ``uninstall.sh`` script attempts to stop and erase core components and
additional modules. Handle it with care because it erases everything under ``/home/*`` and ``/var/lib/nethserver/*``!

::

    bash /var/lib/nethserver/node/uninstall.sh
