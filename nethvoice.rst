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

You can install multiple NethVoice instances on the same node from the :ref:`software_center-section`, but the module requires ref:`NethVoice proxy <nethvoice_proxy-section>` already configured and running.


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

Routes
======

In the routes section, you can configure both inbound and outbound routes for your NethVoice system.

Inbound
-------

In this section, the list of already configured inbound routes is displayed, with the option to edit or delete them.

By clicking the :guilabel:`Create new route`, a new tab will open with the ``Visual Plan`` application, allowing you to create, modify, and connect the components of the NethVoice that will handle the call flow for the incoming number.

By clicking the checkmark symbol in the Visual Plan application, the configuration of your route will be saved, and from that moment on, you can receive calls following the configured flow.

Outbound
--------

In this section, you will find the list of outbound routes. The first time you visit this page, the wizard proposes default outbound routes, with specific call patterns for different languages.

You can also specify the order in which the previously created trunks will be used, thus having the option to customize the priority of various trunks.

By pressing the :guilabel:`Save`, the configuration is written to the NethVoice, and from that moment on, you can make calls to external numbers (having properly configured the trunks in the previous steps).

.. _wizard-dispositivi:

Devices
=======

During the initial configuration wizard, this section requires confirmation of some fundamental settings (press the :guilabel:`Modify default settings button`).

The settings are:

* ``Encryption`` requires a valid SSL/TLS certificate for the hostname entered in :guilabel:PBX Address to function correctly.
* ``PBX Address`` can be the IP address or the hostname of Nethvoice, correctly entered in the DNS used by phones and in the SSL/TLS certificate used by the system.
* ``Admin Password`` will be the password to access the web interface of phones configured with the administrator user.
* ``User Password`` will be the password to access the web interface of phones configured with a non-administrative user.

The choice of the previous Encryption and PBX Address settings depends on how the phones will reach NethVoice.

If the phones are all in the same network as the PBX (LAN), ``Encryption`` can be disabled, and ``PBX Address`` can contain an IP address.

If one or more phones reach NethVoice via the public network (WAN), such as when the PBX is hosted on a cloud VPS, then ``Encryption`` must be enabled, and ``PBX Address`` must contain the fully qualified domain name present in the public DNS.

In any case, it is possible to choose on each individual phone whether encryption is used or not, provided that the SSL/TLS certificate of the system is valid. In this regard, refer to :ref:`wizard-configurations`.

Other settings that can be changed:

* :ref:`Preferences <panel-preferences>`
* :ref:`LDAP Phonebook <panel-phonebook>`

Once the settings are saved, they can be modified again from the :guilabel:Devices > Models page, :guilabel:`Default Settings`.

Phones
------

The page ``Devices > Phones`` allows the identification of phones by NethVoice by entering the MAC address. 
You can enter the MAC address using the following methods:

* :guilabel:`Paste from file` of multiple MAC addresses. Syntaxes separated by a hyphen - (e.g., AA-BB-CC-11-22-33), colons : (e.g., AA:BB:CC:11:22:33), or without a separator (e.g., AABBCC112233) are accepted. Letters can be either uppercase or lowercase.

* :guilabel:`Manual addition` of one MAC address at a time. Useful if you have a barcode reader.

In any case, after entering the MAC address, you can select the phone model. Selecting the exact model is required for the correct configuration of the phone.

.. warning::
   If the model is not selected or the wrong model is chosen, some phone functions, such as provisioning via RPS or line keys, may not be available.

.. _wizard-modelli:

Models
------

The page ``Devices > Models`` lists the basic models of the phones selected in ``Devices > Phones`` plus any custom models.

You can create a custom model based on an existing one through the :guilabel:`Create new model`.

On this page, some parameters inherited from all models can also be modified using the :guilabel:`Default Settings`. These parameters include ``Encryption`` and ``PBX Address``, already set during the initial configuration process as explained in :ref:`wizard-devices`.

Depending on the features specific to the model, panels and options described in :ref:wizard-provisioning-section may be available.

.. _wizard-configurazioni:

Configurations
==============

Groups
------

You can create user groups that will be visible and usable in applications, such as NethVoiceCTI.

Click the :guilabel:`Create new group`.
Specify a name and :guilabel:`save`.
The group will appear in the list.

Profiles
--------

NethVoice allows you to select the features that each user can access, and these are grouped into profiles.

By default, 3 profiles are created, each containing different levels of functionality:

* ``Basic``: Minimum functionality for the user.
* ``Standard``: Classic management functionalities for the user.
* ``Advanced``: Almost all functionalities are allowed, suitable for advanced users.
You can also create new profiles by duplicating an existing one or creating new ones and specifying the various functionalities.

.. note::
   Remember to enable access to the user groups previously created on the profiles where necessary.

Permissions
-----------

Settings
^^^^^^^^

* General permission enables or disables access to all the functionalities of the section and general notification settings.
* ``DND``: Enables the configuration of Do Not Disturb.
* ``Call Forwarding``: Enables the configuration of call forwarding (diversion).
* ``Recording``: Enables recording of own conversations. It is also possible to view/listen/delete own recordings.
* ``Parkings``: Enables the display of the status of parkings and the ability to pick up parked calls.
* ``Listening``: Enables listening to calls of other users.
* ``Intrusion``: Enables intrusion into another user's call (listening to both caller and called, conversation only with the user).
* ``Pickup``: Enables call pickup for calls to other users.
* ``Privacy``: Enables the masking of the last 3 digits (modifiable from the command line) of the called and/or calling number of other users in NethVoiceCTI.
* ``Physical Phone Buttons``: Enables the configuration of physical phone buttons by the user in NethVoiceCTI. These correspond to the Line Keys shown on the :ref:wizard-devices pages.

Outbound Routes
^^^^^^^^^^^^^^^

All configured outbound routes in NethVoice are displayed, and you can enable/disable their usage individually.

NethVoice CTI
^^^^^^^^^^^^^

* ``NethVoice CTI``: Enables all the underlying permissions by activating the following functionalities on NethVoice CTI.

Address Book
^^^^^^^^^^^^

* ``Address Book``: The general permission enables the viewing of the address book in NethVoiceCTI and the ability to add, modify, and delete own contacts.
* ``Advanced Address Book``: Enables the ability to modify/delete non-owned contacts in the address book in NethVoiceCTI.

CDR
^^^

* ``CDR``: The general permission enables the viewing of the call history related to the user.
* ``PBX CDR``: Enables the viewing of the call history for the entire PBX.
* ``Group CDR``: Enables the viewing of call history for calls within one's assigned group.

Customer Cards
^^^^^^^^^^^^^^

* ``Customer Cards``: The general permission enables the ability to view the customer card on NethVoiceCTI.
* For each section of the customer card, you can enable/disable visibility.

Presence Panel
^^^^^^^^^^^^^^

* The general permission enables the display of the operators panel in NethVoiceCTI.
* ``Advanced Recording``: Enables recording of calls from other users.
* ``Call Transfer``: Enables call transfer for calls from other users.
* ``Advanced Parking``: Enables the ability to park calls from other users and retrieve them.
* ``Hang Up``: Enables the ability to hang up calls from other users.
* ``Advanced Phone``: Enables phone functionalities (hang up, call, answer) on conversations that do not belong to the user.
* For each configured user group in NethVoice, you can enable/disable visibility.

Queue Agent Panel
^^^^^^^^^^^^^^^^^

* The general permission enables the Queue section in NethVoice CTI with information about the assigned queues, the ability to log in/out, and enter/exit break.
* ``Advanced Queue Agent Panel``: Enables advanced information about the status of queues and agents.
* ``Unhandled Calls``: Enables access to the unhandled calls section.

Phone lines
^^^^^^^^^^^

* The general permission enables access to the after hours section of NethVoice CTI, allowing the user to change the path of their incoming calls.
* ``Advanced After Hours``: Allows modifying the call path for incoming calls for the user and generic incoming routes.
* ``Complete After Hours``: Allows modification of all call paths for incoming calls.

Queue Manager
^^^^^^^^^^^^^

* The general permission enables access to the QManager section in NethVoice CTI.
* For each configured queue in NethVoice, you can enable/disable the visibility of the status and data.

Operator Station
^^^^^^^^^^^^^^^^

* The general permission enables access to the operator station section in NethVoice CTI.
* Only one configured queue in NethVoice needs to be enabled to use it as the source of calls to manage.


Users
-----

The ``Users`` page establishes, for each individual user, personal settings, and associated devices.

The settings that can be modify are:
* ``Profile``: Determines the permissions the user has.
* ``Group``: Allows grouping users to facilitate the distribution of configurations through :ref:wizard-multiple-phones.
* ``Mobile``: Allows associating a mobile number with the user to display it in the operator panel of NethVoice CTI and use it in presence management.
* ``Voicemail Box``: Allows activating the voicemail box for the user as a destination for any failed calls within.
* ``Associate Device``: Allows selecting an unassociated phone and assigning it to the user among those managed with provisioning. It is possible to create credentials for use on a device not supported by provisioning. In this case, a custom device must be used.

Then, the devices associated with the user are displayed.
Devices can be of two types, software (Web Phone and Mobile App) or physical, tied to a phone configured with provisioning or a custom device.

You can associate up to 9 devices with each user:

* ``Web Phone`` activates the telephony client of NethVoice CTI to manage calls directly without the need for physical phones.
* ``Mobile App`` enables the configuration of a device on the smartphone (see :ref:nethcti_mobile).

For each physical device, the following is displayed:

Encryption: Indicates whether encryption is enabled or not. The initial setting depends on the NethVoice configuration made during the initial configuration process (see :ref:wizard-devices). If the PBX is reached via public network (WAN), encryption activation is required.

.. warning::
   If `Encryption` is enabled, make sure that the SSL/TLS certificate of the system is valid and contains the name of the PBX; otherwise, phones cannot establish a TLS connection

* ``Configuration Model``: you can change the configuration model among those offered.
* ``Edit Configuration``: you can modify the configuration of the individual phone by entering changes valid only for this device. The individual phone has the configuration of the model and default settings by default. Refer to :ref:wizard2-models for more details.
* ``Mac-Address``: Displays the MAC address of the associated device.
* ``Show Password`` for custom devices. The SIP password is shown, which, along with the internal and PBX address, can be used to manually configure the custom device.
* ``Restart``: If the device is registered, you can restart it.
* ``Disassociate``: You can disassociate the device from the user.
