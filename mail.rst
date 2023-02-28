.. _email-section:

===========
Mail server
===========

The Email module is split into three main parts:

* `Postfix <https://www.postfix.org/>`_: `SMTP <https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol>`_ server for sending and receiving
* `Dovecot <https://www.dovecot.org/>`_: `IMAP <https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol>`_ 
  and `POP3 <https://en.wikipedia.org/wiki/Post_Office_Protocol>`_ server to read email,
  and `Sieve <https://en.wikipedia.org/wiki/Sieve_(mail_filtering_language)>`_ language to organize it
* `RSPAMD <https://rspamd.com/>`_: antispam filter, antivirus and attachments blocker

Benefits are:

* complete autonomy in electronic mail management
* avoid problems due to the Internet Service Provider
* ability to track the route of messages in order to detect errors
* optimized antivirus and antispam scan

See also the following related topics:

* How `electronic mail <https://en.wikipedia.org/wiki/Email>`_ works
* `MX DNS <https://en.wikipedia.org/wiki/MX_record>`_ record
* `Simple Mail Transfer Protocol <https://en.wikipedia.org/wiki/MX_record>`_ (SMTP)
* `Domain Keys Identified Mail signature <https://en.wikipedia.org/wiki/MX_record>`_ (DKIM)

You can install only one mail server per node from the :ref:`software_center-section`.

Configuration
=============

The mail module requires at least one :ref:`user domain <user-domains-section>` already configured.

The first configuration wizard will require the following information:

* ``Mail server hostname``: insert the mail server name, this should be the same name configured inside
  your MX DNS record
* ``Primary mail domain``: insert the mail domain, like ``nethserver.org``;
  you will be able to add more domains later

Then, select the user domain to be connected to the mail server.
An email address will be created for every user in the selected domain.


.. _email_domains:

Domains
=======

NethServer can handle an unlimited number of mail domains, configurable
from the ``Domains`` page.

.. note:: If a domain is deleted, email will not be deleted;
   any message already received is preserved.

You can add a new domain by clicking on the :guilabel:`Create domain` button and fill
the ``Name`` field with the mail domain, like ``mymail.org``.

If the first option is disabled, you can enable the ``Accept unknown recipients`` switch and select
a mailbox that will catch all messages sent to non-existing addresses.

NethServer allows storing a hidden copy of all messages
directed to a particular domain: they will be delivered to the final
recipient *and also* to a custom email address. The hidden copy is
enabled by the :guilabel:`Copy inbound messages` switch.

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

.. note:: DKIM is not currently configurable from the web user interface.

DomainKeys Identified Mail (DKIM) provides a way to validate the
sending MTA, which adds a cryptographic signature to the outbound message MIME
headers.

The DKIM signature headers are added only to messages sent through TCP ports 587
(submission) and 465 (smtps).

To work effectively, the public DNS must be configured properly. Refer to the
instructions of your DNS provider to run the following steps:

1. Add a TXT record to your public DNS service provider with key "default._domainKey"

2. Copy and paste the given key text in the DNS record data (RDATA) section


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

* ``Forward messages``: forward all messages to another mail address
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

A mail address can be bound to any mail domain or be specific to one mail domain.
For example:

* First domain: ``mydomain.net``
* Second domain: ``example.com``
* Email address *info* bound to any domain: ``info@mydomain.net``,
  ``info@example.com``
* Email address *goofy* specific to one domain: ``goofy@example.com``

Sometimes a company forbids communications from outside the organization
using personal email addresses. The ``Internal`` check box
blocks the possibility of an address to receive messages from the outside.
Still an *internal* address can be used to
exchange messages with other accounts of the system.

.. _email_filter:

Filter
======

All transiting email messages are subjected to a list of checks:

* Antivirus
* Antispam

.. _anti-virus:

Antivirus
---------

The antivirus component finds email messages containing
viruses. Infected messages are discarded. The virus signature database
is updated periodically.

.. _anti-spam:

Antispam
--------

The antispam component RSPAMD analyzes emails by detecting
and classifying `SPAM <https://en.wikipedia.org/wiki/Spamming>`_ messages using heuristic
criteria, predetermined rules and statistical evaluations of the
content of messages.

The filter can also check if the sending server is listed in one or more block lists
(`DNSBL <https://en.wikipedia.org/wiki/Spamming>`_). A score is associated with each rule.

Total spam score collected at the end of the analysis allows the server to
decide what to do with a message.

Statistical filters, called `Bayesian <https://www.blu-system.com/sicurezza-informatica-pavia-blu-system>`_,
are special rules that evolve and quickly adapt analyzing messages
marked as **spam** or **ham**.

.. _mail_settings-section:

Settings
========

From the ``Settings`` page, you can configure the ``Default mail quota``.
 
If the general mailbox quota is enabled, the ``Mailboxes`` page summarizes the quota usage for
each user. This summary is updated when a user logs in or a message is
delivered. 

Messages marked as **spam** (see :ref:`email_filter`) can be automatically
moved into the ``Junk`` folder by enabling the option ``Move spam to junk folder``.
Spam messages can be expunged automatically after a period of time.
You can configure it from the ``Default spam retention`` option.

From the ``Master users`` section, you can setup a user that can impersonate another user, gaining full rights
to any mailbox contents and folder permissions. 

Credentials are accepted by the IMAP server:

* user name of the master user, eg. ``master``
* master user password

For instance, to access as ``john`` with root password ``secr3t``,
use the following credentials:

* user name: ``john*master``
* password: ``secr3t``


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

Also the following SSL-enabled ports are available for legacy software
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
