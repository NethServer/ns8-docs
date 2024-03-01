.. _nethvoice-section:

=========
NethVoice
=========

NethVoice module is split into seven main parts:

* `FreePBX <https://www.freepbx.org/>`_: a web-based open-source graphical user interface (GUI) that manages `Asterisk <https://www.asterisk.org>`_, a voice over IP and telephony server
* `NethVoice CTI Server <https://github.com/nethesis/nethcti-server>`_: a daemon that provides a set of api to perform common switchboard operations and a websocket streaming channel to listen for the events
* `NethVoice CTI Client <https://github.com/nethesis/nethcti>`_: a web application to manage the telephone switchboard via communication with NethVoice CTI Server
* `NethVoice Report <https://github.com/nethesis/nethvoice-report>`_: a `Asterisk <https://www.asterisk.org>`_ CDR and queues reporting system
* `Janus <https://janus.conf.meetecho.com/>`_: a WebRTC Server 
* `MariaDB <https://mariadb.org/>`_: a popular open source relational database 
* `Tancredi <https://nethesis.github.io/tancredi>`_: a phone provisioning engine ideal for internet deployments

NethVoice is a full-feature integrate voice, video, mobile communication systems.

You can install multiple NethVoice instances on the same node from the :ref:`software_center-section`, but the module requires :ref:`NethVoice proxy <nethvoice_proxy-section>` already configured and running.


Configuration
=============

The NethVoice module requires at least one :ref:`user domain <user-domains-section>` already configured and running.

NethVoice needs two dedicated virtual hosts, one for the NethVoice administration page and one for the NethVoice CTI web application, two FQDN like ``nethvoice.nethserver.org`` and ``cti.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server.

If you are planning to use a Let's Encrypt certificate as default, make also sure to have the corresponding public DNS records.

The first configuration wizard will require the following information:

* ``NethVoice base host``: insert a valid FQDN to access the application administration page
* ``NethVoice CTI base host``: insert a valid FQDN to access the NethVoice CTI web application
* ``User Domain``: choose one of the :ref:`user domain <user-domains-section>` already configured.
* ``Request Let's Encrypt certificate``: if enabled, a Let's Encrypt certificate will be asked for each of the two hosts
* ``Reports Prefix``: insert the international telephone prefix to be considered local in the reporting system 
* ``Reset NethVoice admin password to access user interface``: insert a valid password for the NethVoice administrator user (optional, default password is *Nethesis,1234*)

After saving the configuration parameters NethVoice will be accessible on his base host with the administration credentials:

* User: `admin`
* Password: `Nethesis,1234`, default password if not has been reset during the first configuration wizard

First configuration wizard
==========================

The initial configuration wizard facilitates the easy installation and setup of all NethVoice components.

Extensions
----------

The first step in configuring NethVoice is associating users with their telephone extensions.

You can manage users (create, update, reset passwords, delete) by accessing the dedicated section through the button :ref:`Link to the Portal <user-management-portal-section>`.

Enter the corresponding extensions for each user:

* Input the extension number (recommended starting from 200) in the text field.
* Click on Insert.
* The user is highlighted, and a green checkmark appears if everything has been successful.

Trunks
======

In the trunks section, you can configure gateways to manage physical lines or create VoIP trunks by specifying the credentials of SIP lines provided by the provider.

Trunks, used to connect gateways or VoIP lines, are created using the PJSIP library.

.. _fisici:

Physical
--------

This section allows you to configure a SIP gateway among those supported.
You need to enter:

* ``Vendor``: gateway manufacturer
* ``Model``: specify the gateway model
* ``IP``: ip to be assigned to the device
* ``Mac Address``: gateway identifier
* ``Network Mask``: network subnet
* ``Network Gateway``: network gateway
* ``PBX IP``: NethVoice IP

Dynamic settings based on the model:

* ``ISDN`` (Specify if the line is Point-to-Point or Point-to-Multipoint)
* ``PRI``
* ``FXS`` (Specify for each port, the extension to be assigned by choosing a user previously configured)
* ``FXO`` (Specify the number directly in the text field)

Once the settings are saved, you can download the configuration file to upload to the device through its interface.

VoIP
----

You can create VoIP trunks by selecting one of the supported providers and entering the necessary information.

* ``Provider``: choose the provider to use 
* ``Trunk Name``: specify name of the trunk
* ``Username``: username given by the provider
* ``Password``: password given by the provider
* ``Phone Number``: phone number given by the provider
* ``Allowed codec``: permitted codec
* ``Force codec``: allow only permitted codec

Press :guilabel:`Save` to create the configuration for that VoIP trunk.
