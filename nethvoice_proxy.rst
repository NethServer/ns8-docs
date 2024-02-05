.. _nethvoice_proxy-section:

===============
NethVoice Proxy
===============

NethVoice Proxy module is split into two main parts:

* `Kamalio <https://www.kamailio.org>`_: `SIP <https://en.wikipedia.org/wiki/Session_Initiation_Protocol>`_ proxy server for managing SIP connections
* `RTP Engine <https://github.com/sipwise/rtpengine/>`_: `RTP <https://en.wikipedia.org/wiki/Real-time_Transport_Protocol>`_ proxy for managing RTP connections

NethVoice Proxy allows you to manage all incoming and outgoing SIP and RTP connections.

It is necessary to install one or more :ref:`NethVoice <nethvoice-section>` per node.

.. note:: You can install only one NethVoice Proxy per node from the :ref:`software_center-section`.

Configuration
=============

NethVoice Proxy needs a virtual host, an FQDN like ``proxy.nethserver.org``, this virtual host may be dedicated or shared with the one used in a :ref:`NethVoice <nethvoice-section>` application.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.

If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the application configuration page and enter a valid FQDN inside ``Proxy Domain`` field
2. insert the IPv4/IPv6 address that will receive VoIP traffic

