.. _modules-section:

.. _applications-section:

============
Applications
============

The ``Applications`` page lists the applications installed in the cluster.
The list can be filtered by:

- ``Type``, for example to list only Nextcloud applications.
- ``Node``, to limit the list to applications installed on a specific
  cluster node.
- Free text, to display only applications matching a certain string.

A single click on the application **name** opens its configuration page.

A click on the application **type** shows detailed information about the
application itself. This information, including the **version**, is also
available from the :ref:`Software center <software_center-section>` page.

Each item in the list has a **three-dots menu** with the available
**actions** for that application.

.. |bento| image:: _static/bento.png
           :alt: application drawer

Installed applications are also listed in the **application drawer**, by
clicking the |bento| menu in the top-right corner of the screen. The
drawer shows only installed applications, not those available for
installation.

The application name
====================

Every time an application is added to the cluster, it is uniquely
identified by its name followed by a sequential number. Given the
application *Myapp*, installed instances will be named ``myapp1``,
``myapp2`` and so on.

This internal, unique identifier is assigned by the cluster and cannot be
changed, but the ``Edit label`` action allows assigning a custom label.

Furthermore, a small text note can be attached to the application with the
``Edit note`` action. When an application has an attached note, a small
circled *i* with a tooltip appears next to the application name.


.. _move_clone-section:

Clone and move
==============

The ``Clone`` and ``Move`` actions create a **destination** application
that is a copy of the **source** one.

The cluster node where the destination runs can be the same as the source.
Instead, when moving an application, you must select a target node
different from the one where the source is currently running.

Generally, there are no limitations on running multiple applications of
the same type on the same node. However, in some cases, cloning or moving
to certain nodes may be restricted due to application policies, node
resource limits (CPU, memory), or because the application requires
exclusive access to a system resource, such as binding a fixed TCP port.

Once started, ``Clone`` and ``Move`` actions run through these steps:

1. Create the destination application.
2. Start the data transfer between source and destination. During this
   step, the source remains up and running.
3. Briefly stop the source application (when required by its data
   synchronization strategy).
4. Execute the final data synchronization.
5. The final step differs between the two actions:

   - *For Clone*, start both the source and the destination applications. 

   - *For Move*, **start the destination** application and **remove the
     source** one.

If the moved application is referenced by a fully qualified domain name
(FQDN), ensure that external DNS records are updated to point to the
target node. The cluster reverse proxy is automatically reconfigured.

Restart application
===================

The ``Restart`` action fully stops the application and starts its services
again, performing the same operations normally executed at node boot time.

This action should be used sparingly and preferably during non-working
hours, as it interrupts application operation with unpredictable effects on
the end-user experience.

Some unpredictable events, such as lack of disk space or memory
exhaustion, may degrade application functionality. In these situations,
``Restart`` may resolve the issue, provided that sufficient resources are
available again.

Core apps
=========

From the ``Applications`` page, select the :guilabel:`Core apps` button to
see a full list of installed Core applications and their versions. Core
updates, when available, are always applied at the same time.

The *module* term
=================

The *module* term is often used by developers. An NS8 application is
implemented by a unit called a *module*. It is usually composed of one or
more Linux containers and a user interface for its configuration. A module
is the deployable unit managed by the cluster orchestrator.

The terms *application* and *module* are almost synonyms in the context of
NS8. However, some modules provide services to other modules and do not
include a configuration UI. For example, Core components such as
:ref:`Loki <logs-persistence-section>` and :ref:`Grafana
<grafana_access-section>` are implemented as modules running on the leader
node.
