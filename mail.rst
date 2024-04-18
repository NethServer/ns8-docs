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

The optional :ref:`imapsync-section` application can be connected to Mail. It
allows scheduling periodical fetch jobs or migrating emails from external IMAP
servers to local user mailboxes.


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

Mail can handle an unlimited number of mail domains, configurable
from the ``Domains`` page.

.. note:: If a domain is deleted, email will not be deleted;
   any message already received is preserved.

You can add a new domain by clicking on the :guilabel:`Create domain` button and fill
the ``Name`` field with the mail domain, like ``mymail.org``.

If the ``Add user addresses from user domain`` option is disabled, you can enable the ``Accept unknown recipients`` switch and select
a mailbox that will catch all messages sent to non-existing addresses.

Mail allows storing a hidden copy of all messages
directed to a particular domain: they will be delivered to the final
recipient *and also* to a custom email address. The hidden copy is
enabled by the ``Copy inbound messages`` switch.

.. warning:: On some countries, enabling the *Copy inbound messages*
             switch can be against privacy laws.

If the final recipient cannot be reached (i.e. the recipient address does
not exist), the message is normally rejected. Sometimes (i.e. when a mail domain
is migrated) it could be useful to accept it and silently deliver the message to
a catch-all mailbox. This behavior can be achieved by enabling the
``Accept unknown recipients`` option.
This configuration is available only if ``Add user address from user domain`` option is disabled.

DKIM signature
--------------

DomainKeys Identified Mail (`DKIM`__) provides a way to validate the
sending MTA, which adds a cryptographic signature to the outbound message MIME
headers.

__ https://it.wikipedia.org/wiki/DomainKeys_Identified_Mail

In the ``Domains`` page, click on the three-dots menu near the domain card
and select the ``Configure DKIM`` action, to enable or disable the message
DKIM signature.

The DKIM signature headers are added only to messages sent through TCP ports 587
(submission) and 465 (smtps).

To work effectively, the public DNS must be configured properly. Refer to the
instructions of your DNS provider to run the following steps:

1. Add a TXT record to your public DNS service provider with key
   ``default._domainKey``.

2. Copy and paste the given key text in the DNS record data (RDATA)
   section.


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

Total spam score collected at the end of the analysis allows the server to
decide what to do with a message.

Statistical (or `Bayesian`__) filters,
are special rules that evolve and quickly adapt analyzing messages
marked as **spam** or **ham**.

__ https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering

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

For more advance settings, it is possible to access the web interface of
Rspamd by clicking the :guilabel:`Open Rspamd` button on the top right
corner of the ``Filter`` page.

In some cases an email client, recipient, or sender must bypass the filter
checks: the ``Bypass rules`` section allows to define a set of rules based
on the follwing criteria:

* Sender IP address or network (CIDR format).

* Complete sender email address.

* Sender email domain.

* Complete recipient email address.

* Recipient email domain.


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

.. warning::

    The standard SMTP port 25 is reserved for mail transfers between MTA
    servers. Mail user agents (MUA) must use the submission port.

If you're looking for web email clients, take a look to:

- :ref:`roundcube-section`
- :ref:`webtop-section`
