.. _software_center-section:

===============
Software center
===============

The software center lists applications available from all repositories
[#fileserver]_\ .

To install a new application just click on the :guilabel:`Install` button.
If the cluster has multiple nodes, you will be alse required to select the
target node.

To install another instance of an existing application, click on the
``Instances`` link inside the application card. Then click on
:guilabel:`Install new instance`.

.. note::

    Be careful! The user interface does not currently check if an
    application supports multiple instances on the same node.

.. |bento| image:: _static/bento.png

Installed applications are always available from the application drawer,
by clicking on the |bento| menu in the top right corner.

You can also perform multiple actions on installed applications by
clicking on the three-dots menu:

- ``Add to favorites``: the application will be always listed on top of
  the application drawer

-  ``Edit instance label``: add a name to the instance

- ``Clone``: clone the application, see :ref:`move_clone-section`

- ``Move``: move the application to another node, see
  :ref:`move_clone-section`

- ``Uninstall``: remove the application and all related data

.. _software_repositories-section:

Software repositories
=====================

Software repositories contain applications metadata, which is constituted
by the index of applications, along with their descriptions and additional
information on how to obtain them.

The list of configured repositories is accessible by different ways:

* In the ``Settings`` page: click the ``Software repositories`` card.

* In the ``Software Center`` page: click the ``Software repository`` item
  under the three-dots menu on the top right corner of the page.

NethServer comes with a default set of software repositories in both
enabled and disabled state.

NethForge is a repository of applications built by the NethServer
community, initially set in a disabled state.

To add your own repository click on the :guilabel:`Add repository` button.
Then fill all required fields:

- ``Name`` a unique name for the repository

- ``URL`` public URL of the repository, it must be a valid `NS8 repository
  <https://nethserver.github.io/ns8-core/modules/metadata/>`_

- ``Status`` check this option to enable the repository

- ``Testing`` check this option to access also non-stable releases of
  modules from this repository

You can force the metadata refresh by clicking on the :guilabel:`Reload
repositories` button.

.. rubric:: Footnotes

.. [#fileserver] Except for :ref:`file-server-section`, that is installed
    with :ref:`active_directory-section`
