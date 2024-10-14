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
