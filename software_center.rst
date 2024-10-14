.. _software_center-section:

===============
Software center
===============

The Software Center displays and manages applications available from all
configured repositories [#fileserver]_\ .

Application information
========================

Each application is represented by a card displaying its name, level of
certification, and category. Click on the application's name to view
detailed information such as screenshots, author, latest version,
container images, and links to documentation, source code, and bug
tracker.

Some applications may include additional Terms and Conditions; if present,
read them carefully.

.. hint::

  For detailed information about the installed core components refer to
  :ref:`core_updates-section`.

.. _certification-levels:

Levels of certification
=======================

Applications are certified at the following levels:

- **Level 1/5**: The application is hosted by a custom repository (or it
  is not part of any repository) and is not certified.
- **Level 2/5**: The application is hosted by the ``nethforge`` repository
  and certified by the NethServer community.
- **Level 3/5**: The application is hosted by the ``default`` or
  ``subscription`` repositories and is certified by Nethesis.
- **Level 4/5**: The application is developed and maintained by Nethesis
  developers.
- **Level 5/5**: The application is developed and maintained by Nethesis
  developers and is covered by Nethesis support.

Certification levels are determined based on the following factors:

1. **Repository**: To be listed in a public repository, an application
   must undergo a review process. Being listed in a public repository
   establishes the base certification level of the application.
2. **Origin**: The container image registry hosting the application
   identifies the person or organization distributing it. Currently, the
   recognized registries are ``ghcr.io/nethserver`` and
   ``ghcr.io/nethesis``.
3. **Support**: If the cluster has an active subscription and paid support
   is available for the application (whether included in the current
   subscription plan or not). See :ref:`subscription-section` for more
   information.

.. _install-applications:

Install applications
====================

To install a new application, simply click the :guilabel:`Install` button
of the application card. If your cluster has multiple nodes, you will also
need to select the target node.

To install an additional instance of an existing application, click on the
``Instances`` link within the application's card. Then, select
:guilabel:`Install new instance`. Note that in some cases, installation on
certain cluster nodes may be restricted due to application policies or
node resource limitations.

.. _application-instances:

Application instances
======================

Once an application has one or more installed instances, click on the
``Instances`` link within the application's card. You can perform various
actions on each instance by clicking on its three-dots menu:

- ``Update to testing version``: This action is visible only when a
  testing version is available as an instance update. Carefully review the
  pre-release documentation or consult the app developer before
  proceeding.
- ``Add to favorites``: The application will always be listed at the top
  of the application drawer.
- ``Edit instance label``: Add a custom name to the instance.
- ``Clone``: Clone the application. See :ref:`move_clone-section`.
- ``Move``: Move the application to another node. See
  :ref:`move_clone-section`.
- ``Uninstall``: Remove the application and all related data.

.. |bento| image:: _static/bento.png
           :alt: application drawer

Installed application instances are also accessible from the application
drawer by clicking on the |bento| menu in the top-right corner of the
screen.

.. _software_repositories-section:

Software repositories
=====================

An NS8 software repository is an index of applications and a collection of
their metadata.

You can access the list of configured repositories in several ways:

* In the ``Settings`` page: click the ``Software repositories`` card.
* In the ``Software Center`` page: click the ``Software repositories``
  item in the three-dots menu at the top-right corner.

NS8 includes a default set of software repositories, some enabled and
others disabled:

- ``default``: Contains applications developed and maintained mainly by
  NethServer developers. It also tracks updates for NS8 core modules and
  the core itself.
- ``nethforge``: A repository of applications built and maintained by the
  NethServer community. It is initially disabled.
- ``subscription``: Added and enabled when the cluster has an active
  subscription. It overrides the contents of the ``default`` repository
  with an update schedule managed by Nethesis. See
  :ref:`subscription-section` for details.

To add a custom repository, click on the :guilabel:`Add repository` button
and fill in the required fields:

- ``Name``: A unique name for the repository.
- ``URL``: The public URL of the repository. It must be a valid `NS8
  repository <https://nethserver.github.io/ns8-core/modules/metadata/>`_.
- ``Status``: Check this option to enable the repository.

Note that if the same application is listed in multiple repositories, the
one from the repository with the higher priority will be considered.
Repository priority is determined by the alphabetical order of the
repository names, with those later in the alphabet (e.g., "Z") having
higher priority than those earlier (e.g., "A").

You can refresh the metadata by clicking on the :guilabel:`Reload
repositories` button.


.. _updates-section:

Updates
=======

If the enabled repositories contain an update for an installed application
instance or any core component, a warning message is displayed at the top
of the Software center page. You can see if there are any available
updates also by accessing the ``Cluster status`` page.

NethServer 8 can handle two different types of updates:

* :ref:`core_updates-section`
* :ref:`module_updates-section`

:ref:`Operating system updates <os_updates-section>` are demanded to the
underlying Linux distribution.

If you have an active subscription, available updates are applied
automatically as described in :ref:`scheduled-updates`.

.. _core_updates-section:

Core updates
------------

NS8 consists of the core and several modules. Each core component has
its own version number, and the Software Center will display a warning
when an update is available.

- *Core* contains the web user interface, the API server, the agents
  that manage the containers and backup engines.
- *LDAP proxy* is a proxy server for LDAP TCP connections that handles all
  connections from applications to :ref:`User domain providers
  <user-domains-section>`.
- :ref:`Loki log server <loki-section>`
- :ref:`Traefik proxy <traefik-section>`
- :ref:`Samba Active Directory <active_directory-section>`
- :ref:`OpenLDAP <openldap-section>`

You can review the components currently installed in the cluster at any
time. To do this, click on the three-dots menu in the top-right corner of
the ``Software Center`` page, then select the ``Core apps`` option.
Click on :guilabel:`Update core` button to apply the updates.

Core module updates are always applied altogether to avoid version
mismatches.

.. _module_updates-section:

.. _application-updates:

Application updates
-------------------

The list of available updates is listed inside the ``Updates`` tab of
:ref:`software_center-section`. The software center displays a card for
each application with available updates.

You can apply all application updates by clicking the :guilabel:`Update all
apps` button.

By clicking the ``Update details`` link on the application card, you will
see all module instances that require an update. You can update each
instance separately by clicking on the :guilabel:`Update` button. If you
prefer to update all instances of the same module, just click
:guilabel:`Update all instances` button.


.. _move_clone-section:

Clone and move applications
===========================

An application instance can be cloned inside a cluster node. The clone
procedure creates a new application instance that is equivalent to the
source one.

The cluster node where the destination instance runs can be the same as
the source instance. Generally, there should be no limitation on running
multiple application instances on the same node. In some cases, the
services provided by the instance might require exclusive access to a
particular system resource, such as binding a fixed TCP port number. In
this case starting additional instances of the same service becomes
impossible.

In a nutshell the clone procedure:

1. Creates a new application instance for the destination.
2. Starts the data transfer between the instances, during this phase the
   source is still up and running.
3. Stops briefly the source instance.
4. Executes the final data synchronization.
5. Starts the source and the destination instances.

Instead, when moving an application, you must select a target node other
than the one where the instance is currently running.

The move procedure

1. Creates a new application instance for the destination.
2. Starts the data transfer between the instances, during this phase the
   source is still up and running.
3. Stops briefly the source instance.
4. Executes the final data synchronization.
5. Starts the destination instance and removes the source one.

If the moved application is referenced by a fully qualified domain name
(FQDN), ensure you update the DNS record to point to the address of the
target node.

To start moving/cloning an application instance see the
:ref:`application-instances` section.


.. rubric:: Footnotes

.. [#fileserver] Except for :ref:`file-server-section`, that is provided
   by a core module, installed with :ref:`active_directory-section`
