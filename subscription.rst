.. _subscription-section:

============
Subscription
============

.. note::

   Available only on Rocky Linux based systems

A NethServer 8 cluster can be registered to a web portal to enable
additional services.

Nethesis_ offers two types of subscription services for NethServer, which
provide additional benefits and features:

- **Community subscription**: self-service registration mostly suited for
  IT consultants. For more information, see the `subscription plans`_ page.

  Community subscription portal is available at `my.nethserver.com`_.

- **Enterprise subscription**: service reserved to Nethesis resellers,
  please contact the Sales Department at info@nethesis.it.

  Enterprise subscription portal is available at `my.nethesis.it`_.

.. _Nethesis: https://www.nethesis.it
.. _`subscription plans`: https://www.nethserver.org/subscription
.. _`my.nethserver.com`: https://my.nethserver.com
.. _`my.nethesis.it`: https://my.nethesis.it

When a cluster has an active subscription, the following services are
enabled:

- Remote support by Nethesis
- Resources :ref:`monitoring and alerting <metrics-section>`
- Upload of leader node inventory
- Scheduled updates for node operating systems, core components, and
  applications
- Upload of cluster backup (Enterprise only)

Regarding software repositories, only the ``subscription`` repository
remains enabled.

.. hint::

  Please avoid enabling third-party repositories and refrain from
  installing software not covered by the subscription plan


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

.. _terms-and-conditions:

Terms and Conditions
====================

Please read the Terms and Conditions carefully. By maintaining an active
NethServer 8 subscription, you confirm that you accept the Terms and
Conditions and agree to abide by them. If you do not agree to these Terms
and Conditions, you may not activate or continue your subscription.

Details of subscription plans can be found on the `NethServer website`_.

.. _NethServer website: https://www.nethserver.org/subscription

Personal identification information is stored and processed when necessary
to fulfill a contract to which the data subject is a party, or to take
steps at the request of the data subject prior to entering into a
contract. This information may also be used to share updates and news
related to the subscribed service.

The data controller is Nethesis S.r.l unipersonale CF/PI/RI IT
02734760412, located at Strada degli Olmi 8 -- 61122 Pesaro (PU) -- Italy.

Any requests concerning the processing of personal identification
information (PII) may be addressed to privacy@nethesis.it.


.. _scheduled-updates:

Scheduled updates
=================

A scheduled overnight task automatically installs software updates
available from Nethesis-managed repositories. This task runs daily from
Tuesday through Friday, within a randomly selected time slot between
midnight and 6 AM. The randomization helps distribute the load on network
and server resources. The updates include:

- **Operating system**: Updates are sourced from the DNF repositories
  labeled ``ns-baseos`` and ``ns-appstream``. These repositories provide
  delayed snapshots of Rocky Linux repositories to avoid distributing
  updates that could cause unexpected issues.

- **Core components**: Updates are fetched from the ``subscription``
  repository.

- **Applications**: Updates are also sourced from the ``subscription``
  repository.

Managed repositories follow a conservative update policy to ensure
stability and thorough testing of updates, making them suitable for
automated updates.

It is possible to override the managed update policy by manually
installing or updating core components or applications via the Software
Center page. The metadata for applications and core components from the
``subscription`` repository is refreshed hourly in the Software Center.

Scheduled updates are inhibited when an NS7 node joins the cluster to
migrate applications. This is necessary because the migration procedure
requires specific application versions to function correctly. Scheduled
updates will be re-enabled once the NS7 migration is finished and the NS7
node is automatically removed from the cluster.

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
