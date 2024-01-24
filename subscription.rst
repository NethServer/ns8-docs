.. _subscription-section:

============
Subscription
============

.. highlight:: bash

.. note::

   Available only on Rocky Linux based systems

A NethServer 8 cluster can be registered to a web portal to enable
additional services.

When a cluster has an active subscription, the following services are
enabled:

- Remote support by Nethesis
- Resources monitoring and alerting
- Upload of leader node inventory
- Automatic updates of core and applications
- Upload of cluster backup (Enterprise only)


Register the cluster
====================

Depending on your subscription type, log in to `my.nethserver.com
<https://my.nethserver.com>`_ or `my.nethesis.it
<https://my.nethesis.it>`_ and obtain a unique subscription token for the
cluster. Follow the portal-documented procedures to obtain it.

.. warning::

  The subscription token is a secret: never communicate or share it with
  someone else

Once you have copied the token to the clipboard, go to the ``Settings``
page and click the ``Subscription`` card. Paste the token in the
``Authentication token`` field, then click the :guilabel:`Register`
button.

If the procedure is successful the Subscription page displays the ``System
ID``, ``Plan`` type and ``Expiration`` date.


Remove the subscription
=======================

Go to the ``Settings`` page and click the ``Subscription`` card.
Alternatively, go to the cluster dashboard page and click the ``Go to
Subscription`` link.

In the ``Subscription`` page, click the :guilabel:`Remove subscription`
button. The action must be confirmed.

Remote support
==============

.. note::

    Available in Nethesis Enterprise only

Depending on the subscription type and plan, the ``Subscription`` page can
allow starting and controlling a remote support session:

- Click :guilabel:`Start session` to activate a special access for the
  Nethesis support team. Both SSH and cluster-admin administrative access
  are granted to the support team. Support connections are routed in a
  private VPN tunnel.

  When the access is granted, a unique ``Session ID`` secret is displayed:
  copy and paste it in your support request.

- To end the support session, close the VPN tunnel and revoke any granted
  access, click :guilabel:`End session`.

The support session is valid only to reach the leader node. The support
team can access worker nodes by starting individual support sessions in
the worker nodes. For example, if node 2 is a worker node, this is a
command to start a support session for it: ::

    api-cli run node/2/start-support-session

The Session ID is printed to the standard output. To stop the session: ::

    api-cli run node/2/stop-support-session

Check the support session status for any node with: ::

    api-cli run node/2/get-support-session

If a worker node (e.g., node 2) becomes unreachable from the leader node,
you can manually start a support session for it with the following
procedure:

1. Log in on the worker node, using the console or SSH access.

2. Run the following command to start the support session: ::

     systemctl start support

3. Obtain the session ID with: ::

     systemctl status support

   The Session ID is always recorded in the system journal and node log.

4. To end the support session: ::

     systemctl stop support
