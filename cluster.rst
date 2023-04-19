.. _cluster-section:

==================
Cluster management
==================

A NethServer 8 `cluster <https://en.wikipedia.org/wiki/Computer_cluster>`_ is composed of one **leader** node
and multiple **worker** nodes.

An NS8 cluster composed only of the leader node, is a fully functional system.
Worker nodes can be added or removed at any time.
NS8 clusters support a maximum of 4 nodes.

All nodes are managed by the Web user interface running on the leader node.

Add a node
==========

You can add (join) a worker node to an existing cluster.
The process consists of three steps:

* install the new node
* obtain the join code from the leader node
* enter the join code into the worker node

First, prepare a machine with the same Linux distribution used for the leader node, then follow the :ref:`install instruction <install-section>`
until the login to the Web user interface.

On the leader node, access the ``Nodes`` page and click on :guilabel:`Add node to cluster` and copy the join code from the dialog box.

Return to the worker node and click the :guilabel:`Join cluster` button. Then paste the code inside the ``Join code`` field and click the
:guilabel:`Join cluster` button.
If the leader node does not have a valid TLS certificate, remember to disable the ``TLS certification validation`` option before
clicking the join button.
When the node registration is complete, you can return to the leader user interface and install applications running on the new worker node.

Remove a node
=============

Worker nodes can be removed from the cluster. Before removing a given
worker node, ensure no account provider replica is running on it. In the
``Domains and users`` page, for each domain follow the ``N providers``
link to see the node where a provider replica is installed on, then remove
it.

.. warning::

    If the node is not reachable or is not responding the provider replica
    removal must be completed manually after the node removal.

Access the ``Nodes`` page, go to the three-dots menu of the node and click
on ``Remove from cluster`` to open a confirmation window. Applications
installed on the node are listed: review that list carefully because node
removal is not recoverable.

If the node removal window is confirmed by pushing the :guilabel:`I
understand, remove node` button, the node and its applications are
disconnected, their authorizations are revoked and they cannot access the
cluster any more.

When a node is removed from the cluster the applications running on it are
not affected and they are left in a running state. Shutdown and switch
off the node to finalize the node removal.


Promote a node to leader
========================

Adding and removing nodes might raise the need of changing the cluster
**leader node**.

A good leader node

* never changes its IP address(es)
* must be reachable by any other worker node

If DNS is used to find the leader IP address, every worker node must
properly resolve the leader host name and that must be the same for every
worker node.

Depending on the current leader node state there are two possible
procedures:

* Reachable leader node
* Unreachable leader node

Reachable leader node
---------------------

If the current leader node is working properly, access the ``Nodes`` page,
go to the three-dots menu of the node to promote and click on ``Promote to
leader``.

Confirm or enter the leader host name in the ``VPN endpoint address``
field. An IP address is accepted, too.

Confirm or enter the ``VPN endpoint port`` number. Every worker node will
connect the leader on that UDP port number.

When the confirmation string is typed, the :guilabel:`I understand,
promote the node` button becomes active and it is possible to complete the
node promotion.

The ``Check node connectivity`` checkbox verifies the connection of every
node with the selected one.  The check might fail due to settings of other
network devices. In this case, if you are sure the entered configuration
is correct, it is possible to disable the check: do it at your own risk!

Unreachable leader node
-----------------------

If the current leader node is not reachable, it is necessary to run a
command on any other worker node.  Be prepared in advance for this
situation by enabling SSH, console or Cockpit **terminal root access** to
the nodes.

For example, to promote node with ID ``3``, VPN endpoint
``node3.example.com`` UDP port ``55820``, run the following command on
every worker node: ::

  switch-leader --node 3 --endpoint node3.example.com:55820

.. _administrators-section:

Administrators
==============

Cluster administrators can fully manage the cluster.
It's recommended to create a personal user for each cluster administrator.
All actions executed by a cluster administrator are collected inside a security :ref:`audit-trail-section`.

To add a new cluster administrator go to the ``Settings`` page and select the ``Cluster administrators`` card.
Then click on :guilabel:`Create admin` button and fill the required fields.

An administrator can't delete its own user. To delete an administrator, you must log in with another
existing cluster administrator.

Administrators can change their own password from the ``Account`` card inside the ``Settings`` page.

Two-factor authentication (2FA)
-------------------------------

Two-factor authentication (2FA) can be used to add an extra layer of security required to access the cluster
management user interface.

The administrator can enable 2FA from the ``Account`` card inside the ``Settings`` page by clicking
the :guilabel:`Enable 2FA` button.

The user will have to:

1. download and install the preferred 2FA application on the smartphone
2. scan the QR code with the 2FA application
3. generate a new code and copy it inside the verification field, then click :guilabel:`Verify code`

Smartphone applications
^^^^^^^^^^^^^^^^^^^^^^^

There are several commercial and open source 2FA applications:

Available for both Android and iOS:

- `FreeOTP <https://freeotp.github.io/>`_: available for both Android and iOS
- `Authenticator <https://mattrubin.me/authenticator/>`_: available on iOS only
- `2FAS <https://2fas.com/>`_: available for both Android and iOS

.. _audit-trail-section:

Audit trail
===========

Inside the audit trail page, cluster administrators can inspect all actions executed by any other administrator.
Each event of the audit trail contains at least:

* date and time of the action
* user name of the cluster administrator
* name of the action

Audit trail events can be filtered by user, date, action type, and custom text match.
