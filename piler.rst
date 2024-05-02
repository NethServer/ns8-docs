.. _piler-section:

=====
Piler
=====

Piler_ is an open-source mail archiving solution.

.. _Piler: https://www.mailpiler.org/

This Piler application for NS8 configures a :ref:`Mail server
<email-section>` instance to act as its archive, recording any message
sent or received by the server for a configurable duration. If a message
is lost, authorized users (known as "auditors") can access the Piler UI,
search for the message in the archive, and send it back to the original
recipient.

.. note::

  1. This application allows auditor users to view other users' mail
     messages. Ensure its use complies with your country's privacy laws,
     regulations, and company policies.

  2. After the initial configuration, Piler starts with default
     credentials. For security reasons, refer to section
     :ref:`default-piler-credentials` to change the default passwords
     immediately.

Configuration
=============

Once installed, navigate to the application Settings page and fill in the
required fields:

- **Piler FQDN**: Enter the fully-qualified domain name where the Piler
  web UI will be accessible. If the FQDN is already registered in the
  public DNS, you can enable the **Let's Encrypt certificate** switch to
  obtain a valid encryption certificate.

- **HTTP to HTTPS**: Enable this switch to ensure that all communications
  with the Piler UI are encrypted. This is recommended if the UI is
  accessed through a public or untrusted network.

- **Mail server**: Choose one of the Mail server instances in the cluster.
  They are labeled as follows:

  a. *Archiving can be configured*: This means the Mail server currently
     has no archive configured and can be safely selected.

  b. *The archive destination is…*: This indicates that the Mail server
     already copies any message sent or received to another archive or
     external email address. If such an entry is selected and the form is
     saved, the previous configuration is overwritten, so use it with
     caution.

- **Retention duration**: This field contains the number of days an email
  message is retained in the archive. After that period, a daily cron job
  purges the message from the archive.

It is important to understand that the Mail server selection is allowed
only once during the configuration of a Piler instance. In other words,
you cannot change the Mail server selection once the Piler instance is
initially configured.

.. warning::

    If an incorrect Mail server is selected, there is no way to change the
    selection. The preferred way to recover from this situation is to
    remove the incorrect Piler instance, then install and configure a new
    one.

Other configuration settings can be changed as needed.

.. _default-piler-credentials:

Default credentials
===================

After the initial configuration, Piler starts with default credentials.
For security reasons, the default passwords must be immediately changed
for the two existing default accounts:

1. User ``admin@local``: This user has full administrative rights over the
   Piler application. They can create new user accounts and grant any kind
   of rights. However, they cannot read email messages archived in the
   Piler DB. The default password is ``pilerrocks``.

2. User ``auditor@local``: This user, as the name suggests, has the
   *auditor* role. They can search for any email message in the archive
   and send it back to the original recipient. The default password is
   ``auditor``.

After logging into the Piler website, navigate to Settings under the menu
in the upper right corner of the screen. Scroll down to the bottom of the
personal Settings page, enter the new password in the two password fields
(the second one is for confirmation), and submit the form.

Get back email messages
=======================

Auditor users can search for and recover archived email messages.

When a message is handled by the Mail server, a copy is sent to the
archive. However, Piler does not index the received messages immediately.
They are placed in an archive queue, and every half hour, a scheduled task
indexes a batch of queued messages. Duplicate messages count as one.

Once a message is indexed, auditors can search for it. Found messages can
be downloaded or forwarded to an arbitrary email address.

If multiple messages are selected, they are compressed into a ZIP archive
before download.

When one or more messages are forwarded to an email address, the message
and its original headers are preserved. Therefore, when received, the
message will be sorted with its original date. Furthermore, Piler adds a
MIME header ``X-piler-id`` to forwarded messages.

Import existing email
=====================

Existing email messages can be imported from the chosen Mail server
instance into the Piler archive.

Access a root terminal and run the following command:

    runagent -m piler1 import-email --help

Replace ``piler1`` with the correct Piler application instance identifier,
visible on the Status page.

The command arguments ``-A`` (after) and ``-B`` (before) can limit the
time range for the import.

Disabled features
=================

Some features are not active/effective but are still visible in the Piler
UI.

For administrators:

- In the Administration menu, the **Import** action.
- In the Monitor menu, the **Archive accounting** action.

For auditors:

- In the message preview screen area, the **Restore to mailbox** action.
