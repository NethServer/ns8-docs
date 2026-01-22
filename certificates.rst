.. _certificate_manager-section:

================
TLS certificates
================

A TLS (or SSL) certificate is issued by a Certificate Authority (CA) and
is used by clients to establish an encrypted channel and verify the
server's identity.

In NethServer 8, applications do not handle TLS directly. Each cluster
node runs a Traefik HTTP proxy in front of local applications, receiving
TLS connections. Traefik presents the correct certificate based on the
requested site name (the "Host" header in HTTP). See
:ref:`http-routes-section` for details. Even non-HTTP services, such as
IMAP, rely on Traefik to store and distribute certificates.

Upon installation, Traefik generates a self-signed certificate and uses it
as the default for local applications, including the cluster web
interface.

The ``TLS certificates`` page lists certificates available on every node
and in use by its applications. The table can be filtered by ``Node``,
``Status``, ``Type``, or by typing a keyword that matches a certificate
attribute.

Certificates are not shared between cluster nodes. They are valid only on
the node where they are requested or uploaded.

The main **types** of certificates are:

- ``Uploaded``: custom certificates added through :ref:`Upload certificate
  <uploaded-certificates-section>`. They are not renewed automatically.

- ``Requested``: each cluster node can request one :ref:`Let's Encrypt
  certificate <lets-encrypt-requirements>` containing up to 100 names. Use
  the ``Manage names`` action to update the list of names; this issues a
  new request and marks the old certificate as ``Obsolete``. Let's Encrypt
  certificates are renewed automatically.

Other certificate types:

- ``Automatic``: a Let's Encrypt certificate requested and currently used
  by applications or :ref:`custom HTTP routes <custom-http-route-section>`
  for their host name.

- ``Obsolete``: a Let's Encrypt certificate that was obtained by an
  application, an HTTP route, or a user request, and is no longer in use.
  See also :ref:`delete-certificates-section`.

Both Automatic and Obsolete certificates are renewed automatically.


.. _lets-encrypt-requirements:

Let's Encrypt certificate requirements
======================================

`Let's Encrypt`_ is a nonprofit CA that issues TLS certificates for free.
NethServer 8 uses HTTP-based ACME challenges to obtain them, which require:

.. _`Let's Encrypt`: https://letsencrypt.org

1. **The cluster node must be publicly reachable on port 443**.

   - Ensure port 443 is open to the public internet. You can test it with
     sites like CSM_.

   - Ensure there are no IP-based firewall rules on the node's network.
     Let's Encrypt uses unpredictable IPs for the TLS-ALPN-01 challenge,
     which may be blocked by geographic or custom filters.

   Nodes installed before Traefik 3.0.0 used HTTP-01 challenges. In that
   case, port 80 must be open as well. See :ref:`release notes
   <release-notes-section>` for milestone 8.4.

2. Certificate names must be public domains pointing to the server's
   public IP. Ensure you have **DNS records for both IPv4 and IPv6
   addresses**. Sites like `VDNS <http://viewdns.info/>`_ can help verify
   DNS.

.. _CSM: http://www.canyouseeme.org/

.. note::

   Wildcard certificates (e.g. ``*.nethserver.org``) are **not supported**
   with HTTP-based ACME challenges.

Certificates obtained from Let's Encrypt are renewed automatically before
expiration. Renewal attempts run daily, starting 30 days before the
certificate expires.

If a certificate is marked as ``Expiring`` or ``Expired``, check that the
requirements above are still met and wait for the next renewal attempt.
Alternatively, remove the certificate as explained in
:ref:`delete-certificates-section`.

.. _lets-encrypt-request-section:

Request a Let's Encrypt certificate
===================================

If requirements are met, request a certificate as follows:

1. Go to ``Settings`` → ``TLS certificates``.

2. Click :guilabel:`Request certificate`.

3. Select the cluster node that will issue the request. Only this node can
   use the certificate.

4. Enter the list of names to include. Each must meet the requirements.

5. Click :guilabel:`Request certificate` to confirm.

Validation may take up to 60 seconds before a timeout.

Certificates are renewed automatically by a daily process that begins 30
days before expiration. If renewal fails, an expiration alert is triggered
(see :ref:`certificate-alerts-section`). See the :ref:`Let's Encrypt
requirements <lets-encrypt-requirements>` to identify the cause.

.. _custom-certificates-section:

.. _uploaded-certificates-section:

Upload custom TLS certificates
==============================

If you already have a certificate and private key, you can upload them to
a node:

1. Go to ``Settings`` → ``TLS certificates``.

2. Click :guilabel:`Upload certificate`.

3. Select the cluster node. Only this node and its applications can use
   the certificate.

4. Select the ``Certificate`` and ``Private key`` files. If provided by
   the CA, also select the ``Chain file``. Use drag-and-drop or the file
   picker. All files must be **PEM-encoded**.

5. Click :guilabel:`Upload`.

If the upload fails, an error is shown. Otherwise, the modal closes and
the list refreshes.

Common errors include wrong file order or mismatched certificate, private
key, and chain.

An application uses the uploaded certificate if it matches its configured
host name. Wildcard names are supported.

Uploaded certificates are added to Traefik's backup and can be restored
from it.

If the certificate is signed by a private/custom certification authority (CA),
it needs to be added to the OS certificate store to be trusted and to allow the upload:

- `RHEL distributions (Rocky) <https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/securing_networks/using-shared-system-certificates_securing-networks>`_

- `Debian <https://manpages.debian.org/stable/ca-certificates/update-ca-certificates.8.en.html>`_

.. _certificate-alerts-section:

Receive certificate expiration alerts
=====================================

If alert notifications are configured (see
:ref:`alerts_notifications-section`), the cluster sends an alert when a
certificate is nearing expiration or has already expired. Alerts begin
28 days before the expiration date.

- For an ``Uploaded`` certificate, resolve the alert by uploading a new
  certificate. The old one can then be deleted.

- For Let's Encrypt certificates (``Requested``, ``Automatic``,
  ``Obsolete``), an expiration alert indicates renewal has failed. Check
  that :ref:`requirements <lets-encrypt-requirements>` are still met.

  Common **renewal failure causes** include:

  - DNS records for a certificate name were changed or removed.
  - A firewall blocks HTTP challenges, either by network address or by
    geographic IP rules.


.. _delete-certificates-section:

Delete a TLS certificate
========================

You can delete a certificate if it is no longer needed. Do this with
caution, because removing a certificate can break applications. When you
delete a certificate:

- Traefik is restarted and HTTP connections are closed. For some
  applications this may lead to client data loss.

- If no alternative matches the host name, clients will fail to
  reconnect.

- Automatic renewal (for Let's Encrypt) stops.

If you delete an ``Automatic`` certificate, the related HTTP route is
modified and its Let's Encrypt switch is cleared.

Use :guilabel:`Delete obsolete certificates` to remove all obsolete
certificates of a node in a single operation. This limits Traefik
restarts.

Alternatively, to delete a single certificate:

1. Go to ``Settings`` → ``TLS certificates``.

2. Find the certificate to remove.

3. Click :guilabel:`Delete` and confirm.

.. note::

   Deletion is irreversible. Ensure no application depends on the
   certificate, or install a replacement first to avoid downtime.
