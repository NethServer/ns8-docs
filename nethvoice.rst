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

.. _wizard-section:

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

.. _wizard-devices:

Devices
=======

During the initial configuration wizard, this section requires confirmation of some fundamental settings (press the :guilabel:`Modify default settings button`).

The settings are:

* ``Encryption`` requires a valid SSL/TLS certificate for the hostname entered in :guilabel:`PBX Address` to function correctly.
* ``PBX Address`` can be the IP address or the hostname of NethVoice, correctly entered in the DNS used by phones and in the SSL/TLS certificate used by the system.
* ``Admin Password`` will be the password to access the web interface of phones configured with the administrator user.
* ``User Password`` will be the password to access the web interface of phones configured with a non-administrative user.

The choice of the previous Encryption and PBX Address settings depends on how the phones will reach NethVoice.

If the phones are all in the same network as the PBX (LAN), ``Encryption`` can be disabled, and ``PBX Address`` can contain an IP address.

If one or more phones reach NethVoice via the public network (WAN), such as when the PBX is hosted on a cloud VPS, then ``Encryption`` must be enabled, and ``PBX Address`` must contain the fully qualified domain name present in the public DNS.

In any case, it is possible to choose on each individual phone whether encryption is used or not, provided that the SSL/TLS certificate of the system is valid. In this regard, refer to :ref:`wizard-configurations`.

Other settings that can be changed:

* :ref:`Preferences <panel-preferences>`
* :ref:`LDAP Phonebook <panel-phonebook>`

Once the settings are saved, they can be modified again from the :guilabel:`Devices > Models page`, :guilabel:`Default Settings`.

Phones
------

The page ``Devices > Phones`` allows the identification of phones by NethVoice by entering the MAC address. 
You can enter the MAC address using the following methods:

* :guilabel:`Paste from file` of multiple MAC addresses. Syntaxes separated by a hyphen - (e.g., AA-BB-CC-11-22-33), colons : (e.g., AA:BB:CC:11:22:33), or without a separator (e.g., AABBCC112233) are accepted. Letters can be either uppercase or lowercase.

* :guilabel:`Manual addition` of one MAC address at a time. Useful if you have a barcode reader.

In any case, after entering the MAC address, you can select the phone model. Selecting the exact model is required for the correct configuration of the phone.

.. warning::
   If the model is not selected or the wrong model is chosen, some phone functions, such as provisioning via RPS or line keys, may not be available.

.. _wizard-model:

Models
------

The page ``Devices > Models`` lists the basic models of the phones selected in ``Devices > Phones`` plus any custom models.

You can create a custom model based on an existing one through the :guilabel:`Create new model`.

On this page, some parameters inherited from all models can also be modified using the :guilabel:`Default Settings`. These parameters include ``Encryption`` and ``PBX Address``, already set during the initial configuration process as explained in :ref:`wizard-devices`.

Depending on the features specific to the model, panels and options described in :ref:`wizard-provisioning-section` may be available.

.. _wizard-configurazions:

Configurations
==============

Groups
------

You can create user groups that will be visible and usable in applications, such as NethVoice CTI.

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
* ``Privacy``: Enables the masking of the last 3 digits (modifiable from the command line) of the called and/or calling number of other users in NethVoice CTI.
* ``Physical Phone Buttons``: Enables the configuration of physical phone buttons by the user in NethVoice CTI.
  These correspond to the Line Keys shown on the :ref:`wizard-devices` pages.

Outbound Routes
^^^^^^^^^^^^^^^

All configured outbound routes in NethVoice are displayed, and you can enable/disable their usage individually.

NethVoice CTI
^^^^^^^^^^^^^

* ``NethVoice CTI``: Enables all the underlying permissions by activating the following functionalities on NethVoice CTI.

Address Book
^^^^^^^^^^^^

* ``Address Book``: The general permission enables the viewing of the address book in NethVoice CTI and the ability to add, modify, and delete own contacts.
* ``Advanced Address Book``: Enables the ability to modify/delete non-owned contacts in the address book in NethVoice CTI.

CDR
^^^

* ``CDR``: The general permission enables the viewing of the call history related to the user.
* ``PBX CDR``: Enables the viewing of the call history for the entire PBX.
* ``Group CDR``: Enables the viewing of call history for calls within one's assigned group.

Customer Cards
^^^^^^^^^^^^^^

* ``Customer Cards``: The general permission enables the ability to view the customer card on NethVoice CTI.
* For each section of the customer card, you can enable/disable visibility.

Presence Panel
^^^^^^^^^^^^^^

* The general permission enables the display of the operators panel in NethVoice CTI.
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
* ``Group``: Allows grouping users to facilitate the distribution of configurations through.
* ``Mobile``: Allows associating a mobile number with the user to display it in the operator panel of NethVoice CTI and use it in presence management.
* ``Voicemail Box``: Allows activating the voicemail box for the user as a destination for any failed calls within.
* ``Associate Device``: Allows selecting an unassociated phone and assigning it to the user among those managed with provisioning. It is possible to create credentials for use on a device not supported by provisioning. In this case, a custom device must be used.

Then, the devices associated with the user are displayed.
Devices can be of two types, software (Web Phone and Mobile App) or physical, tied to a phone configured with provisioning or a custom device.

You can associate up to 9 devices with each user:

* ``Web Phone`` activates the telephony client of NethVoice CTI to manage calls directly without the need for physical phones.
* ``Mobile App`` enables the configuration of a device on the smartphone.

For each physical device, the following is displayed:

Encryption: Indicates whether encryption is enabled or not. The initial setting depends on the NethVoice configuration made during the initial configuration process (see :ref:`wizard-devices`). If the PBX is reached via public network (WAN), encryption activation is required.

.. warning::
   If `Encryption` is enabled, make sure that the SSL/TLS certificate of the system is valid and contains the name of the PBX; otherwise, phones cannot establish a TLS connection

* ``Configuration Model``: you can change the configuration model among those offered.
* ``Edit Configuration``: you can modify the configuration of the individual phone by entering changes valid only for this device. The individual phone has the configuration of the model and default settings by default. Refer to :ref:wizard2-models for more details.
* ``Mac-Address``: Displays the MAC address of the associated device.
* ``Show Password`` for custom devices. The SIP password is shown, which, along with the internal and PBX address, can be used to manually configure the custom device.
* ``Restart``: If the device is registered, you can restart it.
* ``Disassociate``: You can disassociate the device from the user.

.. _provisioning-scopes-priority:

Phone Configuration Priority
============================

Configurations created by NethVoice provisioning for phone devices are derived by combining settings from:

- ``Default Settings``: these are found on the :ref:`wizard-model` page.
- ``Model Settings``: parameters are taken from the configuration of the model associated with the device, which is found on the :ref:`wizard-model` page.
- ``Phone Settings``: parameters are taken from the configuration of the individual phone, found on the :ref:`wizard-configurations` page.
- NethVoice CTI Settings where it's possible to configure parameters of the physical phone associated with the user.

In case there is a parameter with non-uniform configuration across the various sections listed above, this is the descending order of priority to be followed:

- ``Phone Settings`` and NethVoice CTI Settings are the settings with the highest priority, with the latter taking precedence if there is a conflict between the two.
- ``Model Settings``
- ``Default Settings``

Administration
==============

Languages
---------

In the Languages menu, it's possible to set the default NethVoice language.

Settings
--------

The Settings page allows managing various aspects of the configuration.

* ``Password``: It's possible to change the password for the admin user dedicated to accessing the web interface of NethVoice.

Advanced
--------

The Advanced section allows direct access to the advanced interface of NethVoice.

.. _wizard-provisioning-section:

Provisioning
============

What does Provisioning mean? Provisioning is configuring phones in automatic mode, minimizing the necessary operations.


Phones Provisioning
-------------------

Actions to be performed on NethVoice:

1. Identification of phones

2. Assignment of phones to users

Identification of phones
^^^^^^^^^^^^^^^^^^^^^^^^

The MAC address is fundamental to the **Provisioning** of NethVoice as it uniquely identifies the phone.

Entering the MAC address of the phones does not require connecting the phone to the network. It is indeed possible to enter the MAC addresses of phones that are still packaged.

In any case, entering the MAC addresses of the phones can be done typing or copying the MAC address from a spreadsheet, invoice, or other document.

Associating phones with users
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The configuration of a phone is complete when it is associated with a user.

Up to 8 telephone devices can be associated with each user.

NethVoice assigns a progressive number to each device associated with the user with the following criteria:

* ``Main Extension`` - main phone, for example ``201``

* ``91+Main Extension`` - phone 2, for example ``91201``

* ``92+Main Extension`` - phone 3, for example ``92201``

* ...

However, from the users' perspective, the Main Extension is the only important number to remember.

Actions to be performed on the phones
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note::

    Let's consider **first boot** the phones new, just taken out of the box, or those that have undergone a factory reset and have never been started up.

Phones at **first boot** are already able to reach NethVoice to retrieve their configuration using the supported methods.

The only action to be taken in these cases is to connect the Ethernet cable with PoE (Power over Ethernet) to the phone. If PoE is not available, it will be necessary to also connect the phone's power cable.

.. warning::

    Verify the compatibility of the phones with the supported provisioning methods. Read the following sections carefully.

If a phone is already in use, it is possible to prepare it for association with NethVoice through the **firmware upgrade** and **factory reset** procedures. Both procedures are available via the phone's web administration interface.

.. _provisioning-methods:

Provisioning methods
^^^^^^^^^^^^^^^^^^^^

Phones can access their configuration via standard web protocols, HTTP or HTTPS (TCP port 80 or 443).

When the MAC address of the phone is entered in NethVoice, a provisioning URL (address) is generated. 

For example: ::

    https://NethVoice base Host/provisioning/1234567890.1234/{mac}.cfg

This URL contains a secret (``1234567890.1234`` in the example) that authenticates and identifies the device that will use it.

To obtain the provisioning URL, the phone at first boot can use two methods, **RPS** and **DHCP**.

The **RPS** (Redirect & Provisioning Service) method involves entering the URL of provisioning on the manufacturer's website of the phone. NethVoice is capable of performing this insertion automatically. As soon as the phone is powered on at first boot, it attempts to contact the manufacturer's website to obtain the URL of provisioning.

The **DHCP** method is based on configuring OPTION 66 of the DHCP (Dynamic Host Configuration Protocol) protocol specifically for each brand of phone, it is necessary to configure the network DHCP server appropriately.

If neither RPS nor DHCP works, it is possible to access the web interface of the phone administration and enter the provisioning URL manually. Remember to disable other provisioning methods, such as DHCP and PNP.

The provisioning URL is displayed in the administration interface of NethVoice for each phone, via the :guilabel:`Info` button on the page :guilabel:`Devices > Phones`.

In any case, once the provisioning URL is obtained, the phone always uses this to access its configuration on NethVoice.

.. warning::

    Refer to section :ref:`provisioning-support-section` for further information on manufacturers' support for RPS and DHCP.

Phone configuration specifications
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you want to modify or customize the settings of phones configured via provisioning, access the web administration interface of NethVoice, modifying the settings at the *Default*, *Model*, or *individual phone* level.

The editable parameters include:

* Language
* Time zone
* Date/time format
* Tones
* Admin user password
* Call waiting
* Ringtone
* Transfer mode
* LDAP directory
* VLAN
* Soft keys
* Line keys
* Expansion keys
* Screen Saver and Background

Refer to :ref:`wizard-section` for more information.

.. warning::

   Do not change settings from the phone administration interface.

Upon restart, the phone retrieves the configurations from the provisioning URL.

Any changes made from the phone administration interface will be lost.

The following sections describe some settings provided by NethVoice.

Provisioned phones will automatically update their configuration even upon change of state (Available, Do Not Disturb, etc.) in NethVoice CTI of the connected user to maintain uniformity of state across all devices.

This configuration update does not cause any disruption or restart of the phone.

Admin password
^^^^^^^^^^^^^^

The phone web administration interface is accessible with username ``admin`` and a password generated randomly during the installation of NethVoice.

The password is available in the NethVoice administration interface, on the :guilabel:`Models > Default Settings` page.

.. _provisioning-automatic-updates:

Automatic updates
^^^^^^^^^^^^^^^^^

The phone automatically contacts NethVoice every night to update the configuration. It is possible to completely disable automatic updates.

In any case, the phone downloads the configuration every time it is restarted.

.. _provisioning-firmware-upgrade:

Firmware upgrade
^^^^^^^^^^^^^^^^

The phone manufacturer periodically publishes firmware updates for the various models of their phones on their website.

It is possible to distribute the updated firmware to all phones of the same model or to a single phone. 
The firmware file obtained from the manufacturer's website must be uploaded through the administration interface of NethVoice respectively in :guilabel:`Models > Preferences > Firmware` or in :guilabel:`Configuration > Associated Devices > Edit > Preferences`.

The filename can contain only letters, numbers, and the symbols ``._-()``.

The phones receive the update according to the times indicated in :ref:`provisioning-automatic-updates`.

.. hint::

    When the phones have received the update, deselect the firmware file in the NethVoice interface to reduce network traffic.

List of web pages for firmware download:

- `Yealink <http://support.yealink.com/documentFront/forwardToDocumentFrontDisplayPage>`_
- `Snom <https://service.snom.com/display/wiki/Firmware+Update+Center>`_
- `Fanvil <https://fanvil.com/Support/download.html>`_
- `Gigaset <https://teamwork.gigaset.com/gigawiki/pages/viewpage.action?pageId=37486876>`_

Supported phones
^^^^^^^^^^^^^^^^

NethPhone
~~~~~~~~~

**FIRMWARE Version 2.0 or higher**

* NP-X3
* NP-X5
* NP-X210

Fanvil
~~~~~~

**FIRMWARE Version 2.0 or higher**

* V62, V63, V64, V65, V67
* X1/S/SP
* X210
* X3/S/SP/G/SG, X3U, X3U Pro
* X4/G/SG, X4U, X4U-V2
* X5S, X5U, X5U-V2
* X6, X6U, X6U-V2
* X7A/C
* X301/P/G/W, X303/P/G/W
* H2U, H2U-V2, H5

Yealink
~~~~~~~

**FIRMWARE Version 0.86 or higher**

* T19(P) E2, T21(P) E2, T23P/G, T27G, T29G
* T30/P, T31/P/G/W, T33P/G, T34W
* T40P/G, T41P/S/U, T42G/S/U, T43U, T44U/W, T46G/S/U, T48G/S/U, T49G
* T52S, T53/W/C, T54S/W, T56A, T57W, T58V/A/W, VP59

Snom
~~~~

**FIRMWARE Version 8.7.5 or higher**

* D120, D140, D150
* D305, D315, D345, D375, D385
* D710, D712, D713, D715, D717, D725, D735, D745, D765, D785
* D862, D865

Gigaset
~~~~~~~

**FIRMWARE Version 3.15.9 or higher**

* Maxwell Basic, Maxwell 2, Maxwell 3, Maxwell 4

.. _provisioning-support-section:

Provisioning compatibility
^^^^^^^^^^^^^^^^^^^^^^^^^^

The following table summarizes the provisioning methods used by each manufacturer at the phone's first boot.

.. list-table:: Provisioning methods by manufacturer
    :widths: 5 5 5 5 10
    :header-rows: 1

    * - Manufacturer
      - Primary method
      - Secondary method
      - DHCP option
      - DHCP option value
    * - NethPhone
      - RPS
      - DHCP
      - 66
      - ``http://IP_PHONE_SYSTEM/provisioning/$mac.cfg``
    * - Fanvil
      - RPS
      - DHCP
      - 66
      - ``http://IP_PHONE_SYSTEM/provisioning/$mac.cfg``
    * - Yealink
      - RPS
      - DHCP
      - 66
      - ``http://IP_PHONE_SYSTEM/provisioning/$MAC.cfg``
    * - Snom
      - RPS
      - DHCP
      - 66 and 67
      - ``http://IP_PHONE_SYSTEM/provisioning/{mac}.xml``
    * - Gigaset
      - DHCP [#f1]_
      - RPS
      - 114
      - ``http://IP_PHONE_SYSTEM/provisioning/%MACD.xml``

.. [#f1] For Gigaset phones, make sure that the network DHCP server does not provide OPTION 66.

.. _provisioning-parameters: 

Provisioning Parameters Guide
-----------------------------

The functions of phones configurable through provisioning are collected in the panels of the NethVoice administration interface and described in the following sections.

Not all phone models have the same functions, so some parameters or entire panels may not be displayed.

In general, leaving a field empty or selecting the option - (minus sign) indicates the value inherited from the context with lower priority; the highest priority is for the phone settings, followed in descending order by model and default settings.
Refer to :ref:`Phone Configuration Priority <provisioning-scopes-priority>` for further information.

.. _panel-softkeys:

Soft key
^^^^^^^^

The ``soft keys`` are programmable phone keys specific for calling phone functions.

If the phone makes more keys available than those displayed in the NethVoice administration interface, there is a ``View more`` button to add more.

Depending on the ``Type``, the ``Value`` and ``Label`` fields may also need to be filled in, as indicated in the table below.

In the Label column, the term default indicates that leaving the Label field empty, the phone will assign a default ``label`` to the soft key.

.. list-table:: Soft key configuration
    :widths: 5 20 10 10
    :header-rows: 1

    * - Type
      - Description
      - Value
      - Label

    * - Forward
      - Enable/disable the forward state (unconditional forwarding). If enabled, all incoming calls are forwarded to the specified number
      - Phone number or extension
      - Yes (default)

    * - DND
      - Enable/disable the do not disturb state. If enabled, all incoming calls are rejected
      - No
      - No

    * - Recall
      - Call back the last dialed number
      - No
      - Yes (default)

    * - Pick up
      - Answer an ongoing call to the specified extension
      - Phone number
      - Yes

    * - Speed dial
      - Call the given number by pressing the key
      - Phone number
      - Yes

    * - Group pickup
      - Answer an ongoing call to the configured pickup group
      - No (The group is configured.)
      - No

    * - History
      - Display the call history screen
      - No
      - Yes (default)

    * - Menu
      - Show the phone configuration menu
      - No
      - Yes (default)

    * - Status
      - Display phone status information (e.g., firmware version, registration status...)
      - No
      - Yes (default)

    * - Prefix
      - Add the specified digits to the dialed number
      - The digits of the prefix
      - Yes (default)

    * - LDAP
      - Display the LDAP address book configured on the phone
      - No
      - Yes (default)

.. _panel-linekeys:

Line key
^^^^^^^^

The ``line keys`` are programmable phone keys similar to soft keys but more specific for call management and monitoring the status of extensions.

If the phone makes more keys available than those displayed in the NethVoice administration interface, there is a button ``View more`` to add more.

Depending on the ``Type``, the fields ``Value`` and ``Label`` may need to be filled in, as indicated in the table below.

In the Label column, the term default indicates that leaving the Label field blank, the phone will assign a default ``label`` to the line key.

.. list-table:: Line key configuration
   :widths: 5 20 10 10
   :header-rows: 1

   * - Type
     - Description
     - Value
     - Label

   * - Conference
     - Active calls are merged into a conference where each participant can listen and speak with others simultaneously
     - No
     - Yes (default)

   * - Forward
     - Enable/disable the forward state (unconditional forwarding). If enabled, all incoming calls are forwarded to the specified number
     - Phone number or extension
     - Yes (default)

   * - Call transfer
     - Transfers the current call to the selected number or another dialed number at the moment
     - Phone number or extension
     - Yes

   * - Hold
     - Places the current call on hold
     - No
     - Yes (default)

   * - DND
     - Enables/disables the Do Not Disturb (DND) status. If enabled, all incoming calls are rejected
     - No
     - No

   * - Recall
     - Dials the last dialed number again
     - No
     - Yes (default)

   * - Pick up
     - Answers an incoming call on the specified extension
     - Phone number
     - Yes

   * - DTMF
     - Executes a sequence of Dual-Tone Multi-Frequency (DTMF) tones during a call
     - Sequence of symbols or numbers.
     - Yes

   * - Login/logout dynamic agent
     - Login/login the call queue
     - No
     - Yes

   * - Voicemail
     - Check voicemail
     - No
     - Yes (default)

   * - Speed dial
     - Call the given number by pressing the key
     - Phone number
     - Yes

   * - Line
     - Select another line
     - No
     - Yes (default)

   * - BLF
     - Monitors the status of the selected extension and, depending on its status, performs either a pick up or speed dial when pressed
     - Phone number
     - Yes

   * - URL
     - Performs an HTTP GET request to the specified web address
     - Web address (URL)
     - Yes

   * - Group pickup
     - Answer a call in progress for the configured pickup group
     - No (the group is configured)
     - No

   * - Multicast paging
     - Send audio directly to the configured extension for multicast paging
     - Phone number
     - Yes (default)

   * - Record
     - Start audio recording of the active call
     - No
     - Yes (default)

   * - Prefix
     - Add the specified digits to the dialed number
     - The prefix digits
     - Yes (default)

   * - Phone lock
     - Activate the phone lock" enables the lock feature on the phone, 
       restricting access to the keys and interface. The unlock sequence needs to be configured according to the phone's documentation
     - No
     - Yes (default)

   * - LDAP
     - Show configured LDAP address book on the phone
     - No
     - Yes (default)

.. _panel-expkeys:

Exp key
^^^^^^^

The *Expansion keys* are programmable buttons on *expansion modules*, devices that can be connected to the phone to increase the number of available keys.

If the expansion module provides more keys than are displayed in the NethVoice administration interface, there is a ``View more`` button to add additional keys.

This type of key is configured like the :ref:`Line key <panel-linekeys>`.

.. _panel-display:

Screen and Ringtone
^^^^^^^^^^^^^^^^^^^

* ``Ringtone Selection`` Each phone has some predefined ringtones that can be selected based on the progressive number. Where supported, you can also choose a custom ringtone, which should then be loaded into the field described below.

* ``Custom Ringtone Management`` Select an audio file for the custom ringtone that has been previously uploaded, or upload a new one by opening the dedicated management module. The audio format must be compatible with the specifications of the phone manufacturer.

* ``Background Image`` ``Screensaver Image`` Select an image file for the phone screen background and screensaver, or upload a new one by opening the dedicated management panel. The image format must be compatible with the specifications of the phone manufacturer.

* ``Screensaver Activation`` Time interval after which the screensaver is activated.

* ``Backlight Off`` Time interval after which the screen lowers brightness or turns off the screen backlight.

* ``Screen Brightness`` ``Screen Contrast`` Select the brightness and contrast levels of the screen.

.. _panel-preferences:

Preferences
^^^^^^^^^^^

* ``NTP Server Address`` The hostname or IP address of the Network Time Protocol (NTP) server to automatically set the phone's time.

* ``Provisioning Schedule`` By selecting Only at startup, phones renew their configuration
  after turning on or restarting. Instead, by selecting Every day, phones autonomously renew
  their configuration at a random time during the night. See also :ref:`provisioning-automatic-updates`.

* ``Transfer Mode for Line Keys`` Specifies how line keys transfer the ongoing call to another extension.

  * **New Call** initiates a new call to the extension configured on the line key,
    placing thecurrent call on hold.

  * **Consultative** always places the current call on hold, and the transfer completion
    can occur while the extension configured on the line key is ringing or even after the answer.

  * **Blind/No Confirmation** immediately transfers the current call to the configured extension.

* ``Phone Language`` Language used by the phone's screen and its web interface.

* ``Timezone`` Sets the phone's timezone, necessary for daylight saving time adjustments.

* ``Ring Tones`` These are specific to each country and indicate the call status through
  an audible signal: free tone, busy tone, hang-up tone, etc.

* ``Time Format`` ``Date Format`` Choice of the time/date format displayed
  on the phone's screen.

* ``Firmware`` Upload and selection of a new firmware version for the phone.

See also :ref: `Firmware upgrade <provisioning-firmware-upgrade>`.

.. _panel-phonebook:

LDAP Phonebook
^^^^^^^^^^^^^^

The first two options in the ``Address Book Type`` do not allow further modifications. Phones will use the fixed and unmodifiable centralized phonebook of NethVoice. However, by selecting ``Custom phonebook`` you can modify the remaining fields in this panel to connect phones to a third-party LDAP server.

* ``Server Address`` Hostname or IP address of the LDAP server.

* ``Port Number`` TCP port used by the LDAP server.

* ``Username`` ``Password`` Authentication credentials for the LDAP service. The username might be specified as a Distinguished Name (DN) LDAP or in another format, depending on the requirements of the LDAP server.

* ``Encryption`` Protects the connection with TLS or STARTTLS. Caution! Some phones do not support encryption, and it's necessary to select None.

* ``Search Base (DN)`` Limits access to the branch of the LDAP database specified as the base. Usually, the search base is mandatory.

* ``Search Filter for Contact Name`` ``Search Filter for Phone Number`` LDAP search filters need to be specified with the syntax defined by RFC-4515 and later. The character % (percentage sign) can be used as a placeholder that the phone replaces with the dialed number.

* ``Attributes for Contact Name`` Separated by space, list the names of LDAP attributes that can contain the contact's name.

* ``Name Display Format`` Attributes' names preceded by the character % (percentage sign) can be composed to form the pattern with which the name is displayed on the phone screen.

* ``Attribute for Main Phone Number`` ``Attribute for Mobile Number`` ``Attribute for Other Phone Number`` These three fields contain names of LDAP attributes for the respective phone numbers.

Network
^^^^^^^

Phones use the DHCP protocol to receive network configuration: IP, subnet mask, DNS, and gateway. In some cases, DHCP is also used to obtain the provisioning URL (refer to :ref:`Provisioning methods <provisioning-methods>`).

However, the following parameters can be configured in this panel:

* ``VLAN Identifier (VID)`` By specifying a number between 1 and 4094, the phone will add VLAN tagging to the packets generated by the phone itself, according to the IEEE 802.1Q standard.

* ``VLAN Identifier for PC port`` By specifying a number between 1 and 4094, the phone will add VLAN tagging to packets coming from the PC port (or data port), following the IEEE 802.1Q standard.

In the VLAN fields, the value "" (empty string), as usual, considers the setting at a lower priority (model or default), while "0" (zero) corresponds to "disabled".

.. warning::

   Entering an incorrect VLAN identifier can render the phone unreachable.

Gateway Provisioning
--------------------

Supported Gateways
^^^^^^^^^^^^^^^^^^

GRANDSTREAM
~~~~~~~~~~~

* FXS Models HT801 and HT802
* FXS Models HT812 and HT814
* FXS Models GXW4216, GXW4224, GXW4232, and GXW4248

MEDIATRIX
~~~~~~~~~

* 4400 Series

PATTON
~~~~~~

* BRI SmartNode and Trinity Models
* PRI SmartNode and Trinity Models
* FXO SmartNode Models

Provisioning
^^^^^^^^^^^^

Gateway configuration is done in the Wizard.

Gateway provisioning follows the same rules as provisioning for phones with one fundamental difference:

unlike phones, the NethVoice directly connects to the gateway via telnet to upload the configuration without the gateway having to retrieve it.

Gateway configuration occurs with the gateway online; by default, gateways boot up in DHCP.

However, by clicking on :guilabel:`Add Gateway`, it is possible to create a configuration for a gateway not yet connected and then configure it by uploading the file from the gateway's web interface.

Configuring Gateways
^^^^^^^^^^^^^^^^^^^^

To configure the gateway is necessary to specify the few required configuration parameters:

1. Device IP address; gateway configuration requires a static IP.
2. Subnet mask.
3. Network gateway.
4. NethVoice IP address; in some installation scenarios, the gateway may reach NethVoice not via its local IP.
5. Any characteristics required for configuring connected lines (for ISDN lines, the mode of the ISDN terminal adapter; for analog lines, the dialed number of the line).

.. note:: For Grandstream models with 2 network interfaces, the LAN interface's MAC address must be indicated, but the configuration created by NethVoice uses the WAN interface, which is the one that will be used.

Download the gateway configuration to upload it via the web interface by clicking on the management button (symbol with three squares).

Dashboard
=========

The dashboard is the initial page of NethVoice after the first configuration.

It provides an overview of the elements involved in the operation of NethVoice.

Users
-----

The dashboard displays the users used in the NethVoice configuration along with the presence status and their telephone devices.

If the user's presence configuration is not set to default (Available), there is an option to reset it to the normal state by clicking on the eraser symbol.

Clicking to open information about an individual device shows the telephone device's details:

* Name
* Model
* IP Address: Clicking allows connection over the local network.
* SIP Port
* Codecs Used
* DND (Do Not Disturb)
* Call Forward

Trunks
------

The configured VoIP trunks in NethVoice are displayed along with their status, showing technology, IP, port, status, and codec.

.. _applications:

Applications
============


The *Applications* section allows you to create, modify, or delete certain features of the PBX, which are only created and configured in the wizard, but then used in the NethVoice CTI.

For example, customer cards, in the wizard, are configured to access the database and to practically display the obtained information, but the actual usage will be within the NethVoice CTI, during calls or when searching for specific information.

Customer Cards
^^^^^^^^^^^^^^

The *customer cards* section allows you to group the information present in external databases to the PBX and display them during calls. For example, on a call from a certain customer, retrieve information from the database related to their invoices or any outstanding payments and evaluate whether to provide assistance or not. 
To generate a new customer card, follow these steps:

Address Book Sources
--------------------

Click on the :guilabel:`Create New Source` and fill out the form that appears:

* ``Database Type``: Specify the type of database to retrieve information from
* ``Database Name``: Specify the name of the database to connect to
* ``Database Address``: Specify the address to connect to the database (localhost, socket, or external IP)
* ``Database Port``: Specify a port for the database different from the default one proposed
* ``Database User``: Specify the user used to connect to the database
* ``Database Password``: Specify the password to connect to the database
* ``Connection``: Press the "Verify" button to test that the information entered is correct for the connection

Press :guilabel:`Save` to add the database source. The newly created source will appear in the list of available sources.

Template
--------

Templates are the blueprint for your customer cards. They use the `ejs` engine, which has a JavaScript-like syntax, allowing you to write HTML code using specific directives that you can find on the website https://github.com/tj/ejs.

Click on the :guilabel:`Create New Template` button to start the creation process:

* ``Name``: Specify the name of the template.
* ``Results``: Contains the output of your query in JSON format. Use the text field to test and see how your HTML template will look with your data.
* ``Code (ejs)``: In this text field, enter the code of your template, respecting the ejs syntax, using the values mentioned above (which are nothing but the result columns of your query).
* ``Preview``: Combining the results and the ejs code, you will see the corresponding HTML output, which will be your customer card.

The PBX already provides some predefined templates with pre-written HTML code that you can duplicate and modify by changing the color.


Customer Cards
--------------

Once you have created the data source and the template for your card, in this section, you need to combine the two pieces of information to ensure that the card is created correctly. Click on the :guilabel:`Create New Card`` and fill out the form:

* ``Name``: Name of the customer card.
* ``Source``: Specify the previously created database source.
* ``Template``: Specify the template to associate with the one previously created.
* ``Profile``: Choose the type of user profile to which the customer card you are creating will be displayed.
* ``Query``: Enter the query that will return the relevant information.
* ``Render``: By pressing the button, the query will be executed on the specified source, and the data will be inserted into the selected template, producing the desired output.

Press the :guilabel:`Save` button to save your customer card.

.. warning:: 
   Once the query and card are created and verified that everything works, use the $NUMBER variable to replace the numerical parameters in your query.

*Example*:

If your query looks like this: ::

  select * from phonebook where homephone like '%150' or workphone like '%850' or cellphone like '%150' or fax like '%850'

It should become like this: ::

  select * from phonebook where homephone like '%$NUMBER' or workphone like '%$NUMBER' or cellphone like '%$NUMBER' or fax like '%$NUMBER'

The `$NUMBER` variable is nothing but the caller ID of the PBX to which the customer card refers to collect the data to be displayed.

Video Sources
^^^^^^^^^^^^^

In this section, you can configure video sources or IP cameras. By clicking the :guilabel:`Create New Source`, you can fill out a form for creation:

* ``Name``: Specify the name to give to the source.
* ``Extension``: Specify the extension related to the video source (previously created in the "Users" section).
* ``URL``: Specify the connection URL from which to retrieve the video frames to display.
* ``Opening Code``: Enter the DTMF tone related to any opening code (if the camera is connected to a gate, for example).
* ``Profile``: Specify the profile to assign to the source to filter the type of user that has access to the video source.
* ``Connection``: Press the "Verify" button and verify that the entered URL is correct, testing the connection and obtaining the relevant video frame.
Once the form is completed, press :guilabel:`Save` to save the information and create a new video source.

