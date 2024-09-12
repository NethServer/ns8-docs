.. _software_center-section:

===============
Software Center
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


.. _certification-levels:

Levels of certification
=======================

Applications are certified at the following levels:

- **Level 1/5**: The application is hosted by a custom repository and is
  not certified.
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

Application instances
======================

Once an application has one or more installed instances, click on the
``Instances`` link within the application's card. You can perform various
actions on each instance by clicking on its three-dots menu:

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

You can refresh the metadata by clicking on the :guilabel:`Reload
repositories` button.

Core applications
=================

NS8 consists of the core and several applications. Each core component has
its own version number, and the Software Center will display a warning
when an update is available.

You can review the components currently installed in the cluster at any
time. To do this, click on the three-dots menu in the top-right corner of
the ``Software Center`` page, then select the ``Core apps`` option.


.. rubric:: Footnotes

.. [#fileserver] Except for :ref:`file-server-section`, that is provided
   by a core module, installed with :ref:`active_directory-section`
