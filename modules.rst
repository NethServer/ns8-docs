.. _modules-section:

=======
Modules
=======

A module is a NS8 application which is usually composed of a backend and a frontend.
An application backend can contain one or more containers.

Every time a module instance is added to the cluster, the new instance is named as the module itself followed by
a progressive number starting from 1. Given a module named ``myapp``, instances will be named ``myapp1``, ``myapp2``
and so on.
You can add a more meaningful label to the instance from the software center.

Some modules require specific resources that cannot be shared.
As an example, the Samba module needs to reserve DNS and SMB well-known TCP ports.
You can install only one instance per node of this type of modules.

Modules that don't require exclusive access to resources can be installed multiple times on the same node.
As an example, you can install multiple OpenLDAP server on a single node.

.. |bento| image:: _static/bento.png

Installed applications are always available from the application drawer,
by clicking on the |bento| menu on the top right corner.

.. _software_center-section:

Software center
===============

The software center lists all available modules from repositories.

To install a new application just click on the :guilabel:`Install` button.
If the cluster has multiple nodes, you will be required also to select the target node.

To install another instance of an existing application, click on the ``Instances`` link inside the application card.
Then click on :guilabel:`Install new instance`.

.. note:: Be careful! The user interfaces currently does not check if an application supports multiple instances on the same node.

You can also perform multiple actions on installed applications by clicking on the three-dots menu:

- ``Add to favorites``: the application will be always listed on top of the application drawer
-  ``Edit instance label``: add a name to the instance
- ``Clone``: clone the application, see :ref:`move_clone-section`
- ``Move``: move the application to another node, see :ref:`move_clone-section`
- ``Uninstall``: remove the application and all related data

.. _move_clone-section:

Clone and move applications
===========================

A module instance can be cloned inside a cluster node.
The clone procedure creates a new module instance that is equivalent to the source one.

The cluster node where the destination instance runs can be the same of the source instance. 
Generally there should be no limitation on running multiple module instances on the same node.
In some cases the services provided by the instance might require exclusive access to a particular system resource, as binding a fixed TCP port number.
In this case cloning becomes impossible.

In a nutshell the clone procedure

1. creates a new module instance for the destination
2. starts the data transfer between the instances, during this phase the source is still up&running
3. stops briefly the source instance
4. executes the final data synchronization
5. starts the source and the destination instances

Instead, when moving an application, you must select a target node other the one where the instance
is currently running.

The move procedure

1. creates a new module instance for the destination
2. starts the data transfer between the instances, during this phase the source is still up&running
3. stops briefly the source instance
4. executes the final data synchronization
5. starts the destination instance and removes the source one

If the moved application is referenced using an FQDN, remember also to change the DNS record and
point it to the address of the target node.

.. _software_repositories-section:

Software repositories
---------------------

Software repositories are the sources of modules metadata.

The list of configured repositories is accessible by clicking on the ``Software repository`` item
under the three-dots menu on the top right corner of the software center.

NethServer comes with a set of software repositories.
To add your own repository click on the :guilabel:`Add repository` button.
Then fill all required fields:

- ``Name`` a unique name for the repository
- ``URL`` public URL of the repository, it must be a valid `NS8 repository <https://nethserver.github.io/ns8-core/modules/metadata/>`_
- ``Status`` check this option to enable the repository
- ``Testing`` check this option to access also non-stable releases of modules from this repository

You can force the metadata refresh by clicking on the :guilabel:`Reload repositories` button.

.. _smarthost-section:

SMTP smarthost
==============

Many applications requires access to a SMTP server to send mails.

You can configure a smarthost for all installed applications by accessing the ``Smarthost``
card inside the ``Settings`` page.

Then, enable the feature by clicking on ``Smarthost provider`` and fill the required details.
