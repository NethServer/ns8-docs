.. _updates-section:

=======
Updates
=======

NethServer 8 can handle two different types of updates:

* :ref:`core updates <core_updates-section>`
* :ref:`module updates <module_updates-section>`

:ref:`Operating system updates <os_updates-section>` are demanded to the underlying Linux distribution.

You can see if there are any available updates by accessing the ``Cluster status`` page.
Updates are applied from the :ref:`software_center-section`.

.. _core_updates-section:

Core updates
============

The core is composed by the following modules:

- ``core`` contains the web user interface, the API server, the agents that manage the containers and backup engines
- ``LDAP proxy`` it's an `NGINX <https://www.nginx.com/>`_ instance that handles all connections from applications to :ref:`user-domains-section`
- :ref:`Loki log server <loki-section>`
- :ref:`Promtail <loki-section>`
- :ref:`Traefik proxy <traefik-section>`
- :ref:`active_directory-section`
- :ref:`openldap-section`

Core module updates are always applied altogether to avoid version mismatch.

When a core update is available, it will be listed on the top of ``Updates`` tab inside the :ref:`software_center-section`.
Click on ``Update details`` to see the list of modules that require an update. Click on :guilabel:`Update core` button to apply the updates.

.. _module_updates-section:

Module updates
==============

The list of available updates is listed inside the ``Updates`` tab of :ref:`software_center-section`.
The software center displays a card for each application with available updates.

You can apply all module updates by clicking the :guilabel:`Update all apps` button.

By clicking the ``Update details`` link on the application card, you will see all module instances that require an update.
You can update each instance separately by clicking on the :guilabel:`Update` button.
If you prefer to update all instances of the same module, just click :guilabel:`Update all instances` button.
