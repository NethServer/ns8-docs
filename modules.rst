.. _modules-section:

.. _applications-section:

============
Applications
============

A NS8 application is implemented by a unit called *module*. It is usually
composed of one or more Linux containers and a user interface for its
configuration.

The terms *application* and *module* are almost synonims in the context of
NethServer 8, however there can be modules that actually do not implement
applications because they are just services for other modules, so they do
not provide any user configuration interface at all.

Every time a module instance is added to the cluster, the new instance is
named like the module itself followed by a progressive number starting
from 1. Given a module named ``myapp``, instances will be named
``myapp1``, ``myapp2`` and so on. It is possible to set a more meaningful
name for the instance from the :ref:`software_center-section` page.

Some applications or modules require specific resources that cannot be
shared among instances installed on the same cluster node. As an example,
the Mail application needs to reserve SMTP and IMAP well-known TCP ports.
You can install only one instance per node of this kind of applications.

On the contrary, applications that do not require exclusive access to
resources can be installed multiple times on the same node. As an example,
you can install multiple Nextcloud applications on a single node.

.. _move_clone-section:

Clone and move applications
===========================

An application instance can be cloned inside a cluster node.
The clone procedure creates a new application instance that is equivalent to the source one.

The cluster node where the destination instance runs can be the same as
the source instance. Generally, there should be no limitation on running
multiple application instances on the same node. In some cases, the services
provided by the instance might require exclusive access to a particular
system resource, such as binding a fixed TCP port number. In this case
cloning becomes impossible.

In a nutshell the clone procedure

1. creates a new application instance for the destination
2. starts the data transfer between the instances, during this phase the
   source is still up and running
3. stops briefly the source instance
4. executes the final data synchronization
5. starts the source and the destination instances

Instead, when moving an application, you must select a target node other
than the one where the instance is currently running.

The move procedure

1. creates a new application instance for the destination
2. starts the data transfer between the instances, during this phase the source is still up&running
3. stops briefly the source instance
4. executes the final data synchronization
5. starts the destination instance and removes the source one

If the moved application is referenced using an FQDN, remember also to change the DNS record and
point it to the address of the target node.

To start moving/cloning an application instance see the :ref:`software_center-section` page.
