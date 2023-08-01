.. _ejabberd-section: 

==========
Ejabberd
==========

The Ejabberd module installs the ejabberd Community Server Docker Image (standard protocol Jabber/XMPP) and supports TLS on standard ports (5222 or 5223).

.. warning::
   Only one instance of Ejabberd can run in a node because of TCP port requirements

.. note::
   Ejabberd does not expose anymore the BOSH protocol (NethCTI and other browser-based applications might not work)



The Ejabberd module installs `ejabberd Community Server <https://hub.docker.com/r/ejabberd/ecs>`_ Docker Image.

Ejabberd is an Open Source chat server directly integrated to Webtop and for networks client. Check out the `official documentation <https://docs.ejabberd.im/>`_ 
for further details.

Configuration
=============

Ejabberd needs a dedicated virtual host name, a FQDN like ``ejabberd.nethserver.org``. A self-signed TLS certificate could be used but a trusted Let's Encrypt certificate is recommended.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.

.. warning::
   Let's Encrypt certificate is a mandatory for file sharing clients. Such clients refuse to connect to the server if the certificate is self-signed

How to configure:

1. Access the application configuration page and enter a valid FQDN inside ``Ejabberd FQDN`` field
2. Enable ``Let's Encrypt`` option accordingly to your needs
3. Select the LDAP user Domain to identify users
4. Click the :guilabel:`Save` button
5. Connect a XMMP client with a valid user on the domain to the entered host name, e.g.: ``https://ejabberd.nethserver.org``.
  
.. note::
   Ejabberd authentication is integrated with LDAP user domain that you can configure at :ref:`user-domains-section`.

The Ejabberd administrators are allowed to use the web admin page on port 5280.

Under the Advanced options section, the administrator can also configure:

* enable built-in web administration interface
* S2S federation
* message archive management
* file upload to exchange data among clients using URL
* file transfer speed

Server to server (S2S)
----------------------

The XMPP system is federated by nature. If :index:`S2S` is enabled, users with accounts on one server
can communicate with users on remote servers.
S2S allows for servers communicating seamlessly with each other, forming a global 'federated' IM network.

For this purpose, the SRV DNS record must be configured for your domain (https://wiki.xmpp.org/web/SRV_Records#XMPP_SRV_records)
and the server must have a valid SSL/TLS certificate.

Message Archive Management
--------------------------

Message Archive Management (mod_mam) implements Message Archive Management as described in `XEP-0313 <http://xmpp.org/extensions/xep-0313.html>`_.
When enabled, all messages will be stored inside the server and compatible XMPP clients can use it to store their chat history on the server.

The database can store a maximum of 2GB of messages, archived messages can be purged automatically.
To configure message retention policy, set :guilabel:`Clean messages older than X days` option.

.. note::

   If enabled, this module will store every message sent between users.
   This behavior will affect the privacy of your users.


Administrators
--------------

All users listed in the text area are considered administrators of the chat server. 

Administrators can: 

* Send broadcast messages 
* Check the status of connected users 

Clients
=======

Jabber clients are available for all desktop and mobile platforms. 

Some widespread clients:

* Pidgin is available for Windows and Linux 
* Adium for Mac OS X 
* BeejibelIM for Android and iOS, Xabber only for Android

When you configure the client, make sure TLS (or SSL) is enabled.
Enter the user name and the domain of the machine. 

With TLS capabilities, strictly configured servers or clients could reject connections with your Ejabberd server 
if the SSL/TLS certificate doesn't match the domain name.
Also, the certificate should contain two sub-domains ``pubsub.*`` and ``conference.*``.
This certificate can be obtained for free with Let's Encrypt.