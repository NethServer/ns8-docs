.. _email-section:

.. _mail-section:

====
Mail
====

The Mail application is split into four main parts:

* `Postfix`__, an SMTP server for sending and receiving mail messages.

  __ https://www.postfix.org

* `Dovecot`__, an IMAP and POP3 server to read email, with Sieve language to organize it.

  __ https://www.dovecot.org

* `Rspamd`__, an antispam filter, antivirus and attachments blocker.

  __ https://rspamd.com

* `ClamAV`__, an antivirus engine.

  __ http://www.clamav.net

Benefits are:

* complete autonomy in electronic mail management
* avoid problems due to the Internet Service Provider
* ability to track the route of messages in order to detect errors
* optimized antivirus and antispam scan

.. warning::

  Even if Software Center allows to install multiple instances of Mail on
  the same node, you can configure and start only one mail server instance
  per node, otherwise a TCP port conflict error occurs.

A Mail instance can be integrated with other applications. For example:

- :ref:`WebTop <webtop-section>` groupware.

- :ref:`roundcube-section` web mail client.

- :ref:`Imapsync <imapsync-section>` schedules periodical fetch jobs or
  migrates emails from external IMAP servers to local user mailboxes.

- :ref:`Piler <piler-section>` archives any message sent or received by
  Mail with the SMTP protocol.


Configuration
=============

Mail requires at least one :ref:`user domain <user-domains-section>` already configured.

The first configuration wizard will require the following information:

* ``Mail server hostname``: insert the mail server name, this should be the same name configured inside
  your `MX DNS record`__.

  __ https://en.wikipedia.org/wiki/MX_record

* ``Primary mail domain``: insert the mail domain, like ``nethserver.org``;
  you will be able to add more domains later.

Then, select the user domain to be connected to the mail server.
An email address will be created for every user in the selected domain.


.. _email_domains:

Domains
=======

Mail can handle an unlimited number of mail domains, which are
configurable from the ``Domains`` page.

.. note:: Deleting a domain does not delete any existing emails;
   all previously received messages are preserved.

To add a new domain, click the :guilabel:`Create domain` button and enter
the domain name, such as ``mymail.org``, in the ``Name`` field.

You can define the domain’s email addresses by inheriting user and group
names from the LDAP user domain using the following options:

- ``Add user addresses from user domain``
- ``Add group addresses from user domain``

If the corresponding option is enabled, user and group names are treated as valid
email addresses. In the rare case where a user and a group share the same name,
incoming messages addressed to that name are always delivered to the group members.

Additional email addresses for the domain can also be configured, as explained
in section :ref:`email_addresses`.

Under the ``Advanced`` section, the ``Accept unknown recipients`` switch controls
how to handle messages addressed to undefined recipients within the domain.
By default, such messages are rejected. However, in some scenarios—such as during
a mail domain migration—it may be useful to accept these messages and deliver them
silently to a catch-all mailbox. This behavior can be enabled by turning on the
``Accept unknown recipients`` option.


DKIM signature
--------------

DomainKeys Identified Mail (DKIM__) validates the identity of the sending
MTA by adding a cryptographic signature to the message's MIME headers.

__ https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail

In the ``Domains`` page, click the three-dots menu on the domain card and
select ``Configure DKIM`` to enable or disable the DKIM signature for
messages. By default, DKIM signing is enabled for every domain, and the
key value is displayed in both raw and Bind-compatible "zone file"
formats.

DKIM signature headers are added only to messages sent through TCP ports
587 (submission) and 465 (smtps) when the "From" header matches one of the
configured domains.

For DKIM to function correctly, ensure your public DNS is configured as
follows, using the instructions provided by your DNS provider:

1. Add a TXT record with the key ``default._domainKey`` to your public DNS
   service.
2. Copy the key text provided and paste it into the DNS record data
   (RDATA) field.

To further protect against mail domain spoofing, consider adding DNS
records for DMARC_ (Domain-based Message Authentication, Reporting, and
Conformance) and SPF_ (Sender Policy Framework).

.. _DMARC: https://en.wikipedia.org/wiki/DMARC
.. _SPF: https://en.wikipedia.org/wiki/Sender_Policy_Framework

.. _email_mailboxes:

Mailboxes
=========

Each user has a personal mailbox and any user name in the form
*<username>@<domain>* is also a valid email address to deliver messages into it.

The list of mailboxes is shown on the ``Mailboxes`` page. There
are two types of mailboxes: users and public mailboxes.

Users mailboxes
---------------

You can disable each mailbox by selecting the ``Disable`` item from the three-dots menu on the mailbox line.

By clicking the ``Edit`` item from the three-dots menu it's possible to setup the following options:

* ``Forward messages``: forward all messages to another email address
* ``Custom mailbox quota``: override the quota configured from the :ref:`mail_settings-section`
* ``Custom spam retention``: override the retention configured from the :ref:`mail_settings-section`

Public mailboxes
----------------

Public mailboxes can be shared among groups of users. The :guilabel:`Create public mailbox`
button allows creating a new public mailbox
and defining one or more owning groups and users. Public mailboxes can also be created by
any IMAP client supporting IMAP ACL protocol extension (RFC 4314).

When a new public mailbox is created, the mail server will automatically add a new address
for all existing mail domains.


.. _mailbox-selective-restore:

Restore a mailbox folder from a backup
--------------------------------------

If the application has one or more backup destinations configured and a
backup has already been executed, you can search for and restore a mailbox
folder from a past backup snapshot of a specific user or public mailbox.

.. warning::

  The procedure does not calculate the disk space usage required for the
  restore. Ensure sufficient disk space is available before proceeding.

#. Navigate to the Mail application instance and open the Mailboxes page.
   Choose the ``User mailboxes`` or ``Public mailboxes`` tab to view a
   list of mailboxes. From the three-dots menu of the desired mailbox,
   select ``Restore folder``.

#. Select the backup destination from which to restore the folder. Loading
   remote destinations may take some time.

#. Choose the date of the backup snapshot to restore. Snapshots are listed
   from newest to oldest.

#. Select a folder from the list or start typing its name to filter the
   list.

   Press :guilabel:`Restore` to begin the restore process.

The selected folder will be restored into a subfolder of the mailbox named
"Restored folder". If the subfolder already exists, it will be removed
before restoring.

If the mailbox quota is exceeded during the restore process, it will be
set to unlimited.


.. _email_addresses:

Addresses
=========

In addition to the users, groups and public mailboxes addresses, described in the
previous section, the system enables the creation of an unlimited number of email
addresses, from the ``Addresses`` page. Each
mail address is associated with one or more destinations. A
destination can be of the following types:

* user mailbox
* public mailbox
* external email address

A mail address can be specific to one mail domain, or generic to all
configured mail domains. In the latter case, we call it a "wildcard
address". For example:

* Two domains are configured, *mydomain.net* and *example.com*
* A specific email address *goofy* for domain *example.com* corresponds
  to *goofy@example.com*.
* A wildcard email address *info* is bound to all domains: it is
  equivalent to both *info@mydomain.net* and *info@example.com*.

Sometimes a company forbids communications from outside the organization
using personal email addresses. To change the *visibility* of an address,
click on the three-dots menu and select the ``Set as internal`` action
shortcut, or select ``Edit`` and enable the ``Internal`` check box under
the ``Advanced`` section.

When an address is *internal* it cannot receive messages from the outside.
Still an *internal* address can be used to exchange messages with other
accounts of the system.

.. _email_filter:

Filter
======

All transiting email messages are subjected to a list of checks that fall
into two main categories, described in the following sections:

* Antivirus
* Antispam

Navigate to the ``Filter`` page to adjust their settings.

.. _anti-virus:

Antivirus
---------

The ClamAV antivirus component finds email messages containing
viruses. Infected messages are discarded. The virus signature database
is checked for updates every hour.

The default ClamAV signatures database is normally disabled because it
consumes a large amount of memory. Select the ``Enable ClamAV official
signatures`` checkbox if desired.

ClamAV unofficial signatures are always active instead. It is possible to
choose the desired signature rating level among *Low*, *Medium*, *High*.
Bear in mind that higher ratings may lead to unwanted false positive
matches, therefore good messages can be blocked.

.. _antispam-section:

.. _anti-spam:

Antispam
--------

The antispam component Rspamd analyzes emails by detecting and classifying
`spam messages`__ using heuristic criteria, predetermined rules and
statistical evaluations of the content of messages.

__ https://en.wikipedia.org/wiki/Spamming

The filter can also check if the sending server is listed in one or more
DNS-based block lists (or `DNSBL`__). A score is associated with each
rule.

__ https://en.wikipedia.org/wiki/Domain_Name_System_blocklist

Statistical (or `Bayesian`__) filters,
are special rules that evolve and quickly adapt analyzing messages
marked as **spam** or **ham**.

__ https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering

Total spam score collected at the end of the analysis allows the server to
decide what to do with a message.

The spam score thresholds can be configured under the ``Antispam`` section
of the ``Filter`` page.

* ``Spam flag threshold`` determines the score value where a message is
  marked as spam. When a message has the spam flag set the consequent
  delivery action depends on the general settings of :ref:`mailboxes
  <mail-mailboxes-settings>`.

* ``Deny message spam threshold`` instead regulates the score that is
  considered too high to accept a message. If the score exceeds this
  value, the filter rejects the message completely.

* Under the ``Advanced`` section it is possible to enable the ``Greylist
  threshold``. When the message score exceeds this limit the filter asks
  the sender to try again the message delivery at later time. The
  *Greylist* spam-fighting method assumes that spammers dislike delivery
  retries. It is disabled by default because it introduces delivery delays
  also for legitimate senders.

In some cases an email client, recipient, or sender must bypass the filter
checks: the ``Bypass rules`` section allows to define a set of rules based
on the follwing criteria:

* Sender IP address or network (CIDR format).

* Complete sender email address.

* Sender email domain (exact match).

* Complete recipient email address.

* Recipient email domain (exact match).

Note that address and domain-based rules match the *envelope sender
address*, which may differ from the message's "From" address in some cases
(e.g., mailing lists).

To view message details such as the envelope sender address, access
advanced settings, or review recent Rspamd activity, open the Rspamd web
interface by clicking the :guilabel:`Open Rspamd` button in the top-right
corner of the Filter page. You will need your cluster-admin credentials to
log in.

The Bayesian statistical filters can then be trained with any IMAP client
by simply moving a message in and out of the Junk folder. As a
prerequisite, the Junk folder must be enabled, as explained in
:ref:`mail-mailboxes-settings`.

* By *putting a message into the Junk folder*, the filters learn
  it is spam and will assign an higher score to similar messages.

* On the contrary, by *getting a message out of Junk*, the filters
  learn it is ham: next time a lower score will be assigned.

All users can train the filters using this technique.

.. note::

  It is a good habit to frequently check the Junk folder in order not to
  lose email wrongly recognized as spam.

The bayesian filter training applies to all users on the system, not only
the user that marked an email as spam or ham.

It is important to understand how the Bayesian tests really work:

* It does not outright flag messages as spam if they contain a specific
  subject, or sender address. It is only collecting specific
  characteristics of the message.

* A message can only be flagged one time. If the same message is flagged
  multiple times, it will not affect anything as the dynamic tests have
  already been trained by that message.

* The Bayesian filter **is not active until it has received enough
  information. This includes a minimum of 200 spams AND 200 hams (false
  positives).**

  As the system receives that information, the progress of bayesian filter
  training can be monitored from the Rspamd web UI.


Queue
=====

The ``Queue`` page shows the status of the Postifx mail queue. Under
normal conditions the queue should be empty because messages are
immediately exchanged between mail servers.

If the mail queue contains some messages, try to click the
:guilabel:`Refresh` button to quickly check if the condition is temporary.

As alternative, trigger an immediate new delivery attempt with the button
:guilabel:`Resend all`, or remove all messages from the queue with
:guilabel:`Delete all`.

The same actions can be selectively executed for each message in the
queue, from its three-dots menu. The message delay reason, queue ID,
arrival time, size, sender, and recipients can be inspected with the ``See
details`` action.

.. hint::

  The ``Message ID`` value can be used to search the message in both
  :ref:`Rspamd web interface <antispam-section>` and
  :ref:`system-logs-section`.

If the delay reason is not resolved, and the message is not deleted, the
message is returned to the sender after a configurable amount of time.
Click the :guilabel:`Settings` button to modify it. See
:ref:`queue-settings-section` for details.


.. _relay-rules-section:

Relay
=====

When a message is received from another mail server (MTA), or from a mail
user agent (MUA), Postfix determines if and how to relay it towards its
final destination. This decision is typically based on relay authorization
and the domain suffix of the recipient address.

* If the domain is handled by Postfix (i.e. it is listed in
  :ref:`email_domains`) the message is delivered locally.

* Otherwise, if the domain is external and relay authorization is valid,
  the destination server (also known as the "next-hop" server) is resolved
  using an MX DNS query.

The ``Relay`` page allows to configure a set of rules that overrides the
external domain resolution based on DNS.

To configure IP-based relay authorization, see :ref:`mail-relay-settings`.

Rules priority
--------------

Relay rules can be of three types:

1. Recipient rule.

2. Sender rule.

3. Default rule. Only one default rule is allowed.

The rules evaluation order is Recipient, Sender, Default: the first
matching rule is applied. A match occurs based on the message sender or
recipient, or if a default rule (that one matching any sender and
recipient) is defined.

Sender and Recipient matches can be an exact correspondence of the full
email address, or match only the domain suffix. In the rules evaluation
order, exact match is evaluated before the domain suffix match.

Managing rules
--------------

Click on button :guilabel:`Add relay rule` to define a Sender or a
Recipient rule. Specify the rule type and subject value (sender or
recipient), then fill the remaining fields:

- **Hostname**, the name or IP address of the server where the message is relayed if the rule match.

- **Port**, the TCP port number used by the server.

- **Authentication**. If the server requires SMTP authentication provide the necessary credentials here.

- **TLS**. Enable this switch if the server expects TLS or STARTTLS
  encryption. It is recommended to enable it to encrypt both credentials
  and data during SMTP connections.

The :guilabel:`Set default rule` defines a rule that matches if none of
the remaining rules do, or if no rule is defined at all. This type of rule
is used to configure a `smarthost`__, a mail server where mail messages
for external domains is relayed.

__ https://en.wikipedia.org/wiki/Smart_host

When a Default or Recipient rule is created or modified, existing rules of
the same type with the same Hostname and Port combination are updated
automatically. The new TLS and Authentication settings are applied
collectively to these rules. This ensures that messages sent through a
given Hostname and Port use consistent credentials and TLS preferences,
regardless of the destination address.

Once created, a rule can be edited, disabled or deleted from the
three-dots menu. When a rule is edited, the rule type and subject cannot
be changed: delete it instead.

See also :ref:`mail-relay-settings` for other configurations about the
relay of messages towards other mail servers. In the ``Relay`` page, the
:guilabel:`Settings` button leads to them.


.. _mail_settings-section:

Settings
========

Application settings are split up and accessible under the cards described
by the following sections.

.. _mail-general-settings:

General settings
----------------

The following values are set at application first configuration time. They
should not be changed in production:

* ``Mail server hostname`` configures how the MTA identifies itself with
  other MTAs. To successfully receive email messages, use this host name
  to configure the following DNS records:

  - `A` record, resolving the Mail server hostname to the public and
    static IP address of the server.

  - `PTR` record, resolving back the IP address to the Mail server
    hostname.

  - `MX` records, one for each mail domain handled by the Mail application
    instance.

  - `TXT` records, as specified by DKIM, SPF and DMARC.

* ``User domain`` selects a LDAP database with user, groups and passwords.
  If the DB is changed existing mailboxes are not removed! A mailbox is
  still accessible if the same user name is present in both the old and
  the new database.

.. _mail-mailboxes-settings:

Mailboxes
---------

Under the ``Mailboxes`` card you can configure the ``Default mail quota``.

If the general mailbox quota is enabled, the ``Mailboxes`` page summarizes the quota usage for
each user. This summary is updated when a user logs in or a message is
delivered.

Under the ``Shared mailboxes`` section, ``Shared seen`` selects if the
IMAP *seen* flag is shared or not with other users. In general, the *seen*
flag is used to mark if a message has been read or not. In a shared
mailbox, each user can access the same message.

*  If users accessing the shared mailbox prefer to know if a mail has
   already been read by someone else, set ``Shared seen`` to ``enabled``
   (default).

* If users accessing the shared mailbox are not interested if a message
  has been already read by someone else, set ``Shared seen`` to
  ``disabled``.

Messages marked as **spam** (see :ref:`email_filter`) can be automatically
moved into the ``Junk`` folder by enabling the option ``Move spam to junk folder``.
Spam messages can be expunged automatically after a period of time.
You can configure it from the ``Default spam retention`` option.


.. _mail-master-users-settings:

Master users
------------

Under the ``Master users`` card, you can setup a user that can impersonate another user, gaining full rights
to any mailbox contents and folder permissions.

Credentials are accepted by the IMAP server:

* user name of the master user, e.g. ``master``
* master user password

For instance, to access as ``john`` with root password ``secr3t``,
use the following credentials:

* user name: ``john*master``
* password: ``secr3t``

.. _queue-settings-section:

Queue settings
--------------

The ``Maximal queue lifetime`` parameter defines how many hours a message
can remain in the mail queue before it is returned to the sender.

The default value, 120 hours (5 days), is the retry time suggested by
RFC5321. Lower values might be set to warn the sender early if some error
occurs. For example, if the remote mail server refuses a message because
our IP address is in a public block list, the message sender will be
notified after 5 days: it might be considered too late.

.. _mail-relay-settings:

Relay settings
--------------

This section controls the Mail application configuration for special
scenarios, described in the following sections.

IP-based relay
^^^^^^^^^^^^^^

Some old mail clients, like scanners, which provide limited software
capabilities, might not support SMTP authentication or encryption: in this
case it is possible to authorize the relay of messages to external domains
by looking at their IP address instead of the usual credentials check.

List the IP address of such devices in the ``Allow relay from these IP
addresses`` field. The address can be in IPv4 or IPv6 format. The IP based
policy can be spread to a whole network, specifying it in CIDR format.

For example, a value for the field can be

::

  192.168.12.42
  10.77.4.0/24

The IP address *192.168.12.42* (e.g. a document scanner) and the clients
in the network subnet *10.77.4.0/24* can send mail messages without
providing SMTP authentication.

Sender/login correspondence
^^^^^^^^^^^^^^^^^^^^^^^^^^^

To avoid the unauthorized use of email addresses and the sender address
spoofing within the organization, enable the ``Enforce sender/login
match`` switch.

If the switch is enabled the sender address of a message must correspond
to the login name used by the mail client to connect with the mail server.
Search the login name in the :ref:`email_addresses` page to see what are
the addresses it can use.

For example, with that switch enabled, if user ``john`` has email address
``john.doe@example.org`` he cannot write an email message with a different
sender address, like ``sarah.smith@example.org``.

If the switch is disabled, as per default Mail configuration, an
authenticated mail client is allowed to send messages using any sender
address, so back to our example ``john`` could write the message also as
``sarah.smith@example.org``.

.. warning::

  If you decide to enable the switch consider that public mailboxes and
  LDAP group addresses are not evaluated for the login/address
  correspondence.

.. _mail-archive-section:

Mail archive
^^^^^^^^^^^^

The ``Always BCC`` switch controls a feature often required by mail
archiving solutions.

The acronym BCC stands for Blind Carbon Copy. When the switch is enabled,
enter a value in the ``Always BCC address`` field: this address will
receive a hidden copy of any email message sent or received by the Mail
server.

.. hint::

  Making a hidden copy of private email messages is a privacy-sensitive
  feature. Ensure its use complies with your country's privacy laws,
  regulations, and company policies.

The :ref:`Piler application <piler-section>` can automatically configure
this field with the appropriate value, such as ``archive@piler1`` or similar.
In this case, changing the address might prevent Piler from archiving new
messages.


.. _email_clients:

Client configuration
====================

The server supports standard-compliant email clients using the
following IANA ports:

* imap/143
* pop3/110
* smtp/587
* sieve/4190

Authentication requires the STARTTLS command and supports the
following variants:

* LOGIN
* PLAIN

Also the following TLS-enabled ports are available for legacy software
that still does not support STARTTLS:

* imaps/993
* pop3s/995
* smtps/465

.. note::

    The standard SMTP port 25 is reserved for mail transfers between MTA
    servers. Mail user agents (MUA) must use the submission port.

Refer to the :ref:`Webtop application <email_autoconfig>` for the
implementation of automatic configuration protocols like Autodiscover and
Autoconfig.
