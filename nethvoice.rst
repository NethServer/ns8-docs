.. _nethvoice-section:
=========
NethVoice
=========

NethVoice is a comprehensive communication system that integrates voice, video, and mobile capabilities.
The NethVoice module is divided into seven main parts:

* `FreePBX <https://www.freepbx.org/>`_: A web-based open-source graphical user interface (GUI) that manages `Asterisk <https://www.asterisk.org>`, a voice over IP and telephony server.
* `NethVoice CTI Server <https://github.com/nethesis/nethcti-server>`_: A daemon that provides a set of APIs to perform common switchboard operations and a WebSocket streaming channel to listen for events.
* `NethVoice CTI Client <https://github.com/nethesis/nethcti>`_: A web application to manage the telephone switchboard via communication with the NethVoice CTI Server.
* `NethVoice Report <https://github.com/nethesis/nethvoice-report>`_: An `Asterisk <https://www.asterisk.org>`_ CDR and queues reporting system.
* `Janus <https://janus.conf.meetecho.com/>`_: A WebRTC server.
* `MariaDB <https://mariadb.org/>`_: A popular open-source relational database.
* `Tancredi <https://nethesis.github.io/tancredi>`_: A phone provisioning engine ideal for internet deployments.

You can install multiple NethVoice instances on the same node from the :ref:`software_center-section`, but the module requires the :ref:`NethVoice proxy <nethvoice_proxy-section>` to be already configured and running.

Configuration
=============

The NethVoice module requires at least one :ref:`user domain <user-domains-section>` to be configured and running.

To set up NethVoice, you need to have two dedicated virtual hosts: one for the NethVoice administration page and one for the NethVoice CTI web application. 
These virtual hosts should have fully qualified domain names (FQDNs) like `nethvoice.nethserver.org` and `cti.nethserver.org`.

Before proceeding with the configuration, ensure that you have created the corresponding DNS records for these FQDNs in your DNS server.

If you plan to use a Let's Encrypt certificate as the default certificate, make sure you have the necessary public DNS records.

During the first configuration wizard, you will be prompted to provide the following information:

* ``NethVoice base host``: Insert a valid FQDN to access the application administration page.
* ``NethVoice CTI base host``: Insert a valid FQDN to access the NethVoice CTI web application.
* ``User Domain``: Choose one of the :ref:`user domain <user-domains-section>` already configured.
* ``Request Let's Encrypt certificate``: If enabled, a Let's Encrypt certificate will be requested for each of the two hosts.
* ``Reports Prefix``: Insert the international telephone prefix to be considered local in the reporting system.
* ``Reset NethVoice admin password to access user interface``: Insert a valid password for the NethVoice administrator user (optional, the default password is *Nethesis,1234*).

After saving the configuration parameters, NethVoice will be accessible on its base host with the administration credentials:

* User: `admin`
* Password: `Nethesis,1234`, the default password if it has not been reset during the first configuration wizard.

.. _wizard-section:

First Configuration Wizard
==========================

The initial configuration wizard facilitates easy installation and setup of all NethVoice components.

Extensions
----------

The first step in configuring NethVoice involves associating users with their telephone extensions.

You can manage users (create, update, reset passwords, delete) by accessing the dedicated section through the button :ref:`Link to the Portal <user-management-portal-section>`.

Enter the corresponding extensions for each user:

* Input the extension number (recommended starting from 200) in the text field.
* Click on Insert.
* The user is highlighted, and a green checkmark appears if everything has been successful.

Trunks
======

In the trunks section, you can configure gateways to manage physical lines or create VoIP trunks by specifying the credentials of SIP lines provided by the provider.

Trunks, used to connect gateways or VoIP lines, are created using the PJSIP library.

.. _physical:

Physical
--------

This section allows you to configure a SIP gateway among those supported.
You need to enter:

* ``Vendor``: Gateway manufacturer
* ``Model``: Specify the gateway model
* ``IP``: IP to be assigned to the device
* ``Mac Address``: Gateway identifier
* ``Network Mask``: Network subnet
* ``Network Gateway``: Network gateway
* ``PBX IP``: NethVoice IP

Dynamic settings based on the model:

* ``ISDN`` (Specify if the line is Point-to-Point or Point-to-Multipoint)
* ``PRI``
* ``FXS`` (Specify for each port the extension to be assigned by choosing a user previously configured)
* ``FXO`` (Specify the number directly in the text field)

Once the settings are saved, you can download the configuration file to upload to the device through its interface.

VoIP
----

You can create VoIP trunks by selecting one of the supported providers and entering the necessary information.

* ``Provider``: Choose the provider to use.
* ``Trunk Name``: Specify the name of the trunk.
* ``Username``: Username given by the provider.
* ``Password``: Password given by the provider.
* ``Phone Number``: Phone number given by the provider.
* ``Allowed codec``: Permitted codec.
* ``Force codec``: Allow only the permitted codec.

Press :guilabel:`Save` to create the configuration for that VoIP trunk.

Routes
======

In the Routes section, you can configure both inbound and outbound routes for your NethVoice system.

Inbound
-------

In this section, the list of already configured inbound routes is displayed, with options to edit or delete them.

By clicking on the :guilabel:`Create new route`, a new tab will open with the ``Visual Plan`` application, allowing you to create, modify, and connect components of NethVoice that will handle the call flow for the incoming number.

By clicking the checkmark symbol in the Visual Plan application, the configuration of your route will be saved.
From that moment on, you can receive calls following the configured flow.

Outbound
--------

In this section, you will find the list of outbound routes.
The first time you visit this page, the wizard proposes default outbound routes with specific call patterns for different languages.

You can also specify the order in which the previously created trunks will be used, thus having the option to customize the priority of various trunks.

By pressing :guilabel:`Save`, the configuration is written to NethVoice, and from that moment on, you can make calls to external numbers (having properly configured the trunks in the previous steps).

.. _wizard-devices:

Devices
=======

During the initial configuration wizard, in this section there are some fundamental settings (press the :guilabel:`Modify default settings button`).

The settings are:

* ``Admin Password`` will be the password to access the web interface of phones configured with the administrator user.
* ``User Password`` will be the password to access the web interface of phones configured with a non-administrative user.

The NethVoice address to be provided to the phones via configuration is obtained from the application settings.

The use of encryption in SIP connections for devices is enabled by default.

In any case, it is possible to choose on each individual phone whether encryption is used or not. In this regard, refer to :ref:`wizard-configurations`.

Other settings can be changed in :ref:`Preferences <panel-preferences>` section:

* :guilabel:`Phone languages`
* :guilabel:`Provisiong scheduling`
* :guilabel:`Tone zone`
  
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

.. _wizard-configurations:

Configurations
==============

Groups
------

You can create user groups that will be visible and usable in applications such as NethVoice CTI.

Click :guilabel:`Create new group`, specify a name, and :guilabel:`save`. 
The group will appear in the list.

Profiles
--------

NethVoice allows you to select the features each user can access, which are grouped into profiles.

By default, three profiles are created, each containing different levels of functionality:

* ``Basic``: Minimum functionality for the user.
* ``Standard``: Classic management functionalities for the user.
* ``Advanced``: Almost all functionalities are allowed, suitable for advanced users.

You can also create new profiles by duplicating an existing one or by creating new ones and specifying the various functionalities.

.. note::
   Remember to enable access to the user groups previously created on the profiles where necessary.

Permissions
-----------

Settings
^^^^^^^^

* General permission enables or disables access to all the functionalities of the section and general notification settings.
* ``DND``: Enables the configuration of Do Not Disturb.
* ``Call Forwarding``: Enables the configuration of call forwarding.
* ``Recording``: Enables the recording of own conversations. It is also possible to view, listen to, and delete own recordings.
* ``Parkings``: Enables the display of the status of parking spaces and the ability to pick up parked calls.
* ``Listening``: Enables listening to calls of other users.
* ``Intrusion``: Enables intrusion into another user's call (listening to both the caller and called, conversation only with the user).
* ``Pickup``: Enables call pickup for calls to other users.
* ``Privacy``: Enables the masking of the last three digits (modifiable from the command line) of the called and/or calling number of other users in NethVoice CTI.
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

* The general permission enables the display of the operators' panel in NethVoice CTI.
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

Phone Lines
^^^^^^^^^^^

* The general permission enables access to the after-hours section of NethVoice CTI, allowing the user to change the path of their incoming calls.
* ``Advanced After Hours``: Allows modifying the call path for incoming calls for the user and generic incoming routes.
* ``Complete After Hours``: Allows modification of all call paths for incoming calls.

Queue Manager
^^^^^^^^^^^^^

* The general permission enables access to the QManager section in NethVoice CTI.
* For each configured queue in NethVoice, you can enable/disable the visibility of the status and data.

Operator Station
^^^^^^^^^^^^^^^^

* The general permission grants access to the operator station section in NethVoice CTI.
* Only one configured queue in NethVoice needs to be enabled to serve as the source of calls to manage.

Users
-----

The ``Users`` page establishes, for each individual user, personal settings and associated devices.

The settings that can be modified are:
* ``Profile``: Determines the permissions the user has.
* ``Group``: Allows grouping of users to facilitate the distribution of configurations.
* ``Mobile``: Enables associating a mobile number with the user to display it in the operator panel of NethVoice CTI and use it in presence management.
* ``Voicemail Box``: Enables activating the voicemail box for the user as a destination for any failed calls.
* ``Associate Device``: Allows selecting an unassociated phone and assigning it to the user from those managed with provisioning. It is possible to create credentials for use on a device not supported by provisioning. In this case, a custom device must be used.

Then, the devices associated with the user are displayed.
Devices can be of two types: software (Web Phone and Mobile App) or physical, tied to a phone configured with provisioning or a custom device.

You can associate up to 9 devices with each user:

* ``Web Phone`` activates the telephony client of NethVoice CTI to manage calls directly without the need for physical phones.
* ``Mobile App`` enables the configuration of a device on the smartphone.
* ``Phone Link`` enables the configuration of a device on the personal computer.

For each physical device, the following is displayed:

Encryption: Indicates whether encryption is enabled. 
The initial setting depends on the NethVoice configuration made during the initial configuration process (see :ref:`wizard-devices`). If the PBX is accessed via a public network (WAN), activating encryption is required.

.. warning::
   If `Encryption` is enabled, ensure that the SSL/TLS certificate of the system is valid and contains the name of the PBX; otherwise, phones cannot establish a TLS connection.

* "Configuration Model": You can change the configuration model among those offered.
* "Edit Configuration": You can modify the configuration of the individual phone by entering changes valid only for this device. The individual phone defaults to the configuration of the model and default settings. Refer to :ref:`wizard-model` for more details.
* "Mac-Address": Displays the MAC address of the associated device.
* "Show Password" for custom devices. The SIP password is shown, which, along with the internal and PBX address, can be used to manually configure the custom device.
* "Restart": If the device is registered, you can restart it.
* "Disassociate": You can disassociate the device from the user.

.. _provisioning-scopes-priority:

Phone Configuration Priority
============================

Configurations created by NethVoice provisioning for phone devices are derived by combining settings from:

- ``Default Settings``: These are found on the :ref:`wizard-model` page.
- ``Model Settings``: Parameters are taken from the configuration of the model associated with the device, which is found on the :ref:`wizard-model` page.
- ``Phone Settings``: Parameters are taken from the configuration of the individual phone, found on the :ref:`wizard-configurations` page.
- NethVoice CTI Settings where it is possible to configure parameters of the physical phone associated with the user.

In case there is a parameter with non-uniform configuration across the various sections listed above, the following is the descending order of priority to be followed:

- ``Phone Settings`` and NethVoice CTI Settings are the settings with the highest priority, with the latter taking precedence if there is a conflict between the two.
- ``Model Settings``
- ``Default Settings``

Administration
==============

Languages
---------

In the Languages menu, you can set the default language for NethVoice.

Settings
--------

The Settings page allows you to manage various aspects of the configuration.

* ``Password``: You can change the password for the admin user who is dedicated to accessing the NethVoice web interface.

Advanced
--------

The Advanced section provides direct access to NethVoice's advanced interface.

.. _wizard-provisioning-section:

Provisioning
============

What does Provisioning mean? Provisioning involves configuring phones in automatic mode, minimizing the necessary operations.

Phones Provisioning
-------------------

Actions to be performed in NethVoice:

1. Identification of phones.

2. Assignment of phones to users.

Identification of Phones
^^^^^^^^^^^^^^^^^^^^^^^^

The MAC address is fundamental for the **Provisioning** of NethVoice as it uniquely identifies the phone.

Entering the MAC address of the phones does not require connecting the phone to the network. Indeed, it is possible to enter the MAC addresses of phones that are still packaged.

Regardless, you can enter the MAC addresses of the phones by typing or copying the MAC address from a spreadsheet, invoice, or other document.

Associating Phones with Users
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The configuration of a phone is complete when it is associated with a user.

Up to eight telephone devices can be associated with each user.

NethVoice assigns a progressive number to each device associated with the user using the following criteria:

* ``Main Extension`` - main phone, for example, ``201``

* ``91+Main Extension`` - phone 2, for example, ``91201``

* ``92+Main Extension`` - phone 3, for example, ``92201``

* ...

However, from the users' perspective, the Main Extension is the only important number to remember.

Actions to Be Performed on the Phones
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. note::

    Let's consider the **first boot** for phones that are new, just taken out of the box, or those that have undergone a factory reset and have never been started up.

Phones at **first boot** are already able to reach NethVoice to retrieve their configuration using supported methods.

The only action required in these cases is to connect the Ethernet cable with PoE (Power over Ethernet) to the phone. If PoE is not available, it will also be necessary to connect the phone's power cable.

.. warning::

    Verify the compatibility of the phones with supported provisioning methods. Please read the following sections carefully.

If a phone is already in use, it is possible to prepare it for association with NethVoice through **firmware upgrade** and **factory reset** procedures. Both procedures are accessible via the phone's web administration interface.

.. _provisioning-methods:

Provisioning Methods
^^^^^^^^^^^^^^^^^^^^

Phones can access their configuration via standard web protocols, HTTP or HTTPS (TCP port 80 or 443).

When the MAC address of the phone is entered into NethVoice, a provisioning URL (address) is generated.

For example:

    https://NethVoiceBaseHost/provisioning/1234567890.1234/{mac}.cfg

This URL contains a secret (``1234567890.1234`` in the example) that authenticates and identifies the device that will use it.

To obtain the provisioning URL, the phone, at its first boot, can use two methods: **RPS** and **DHCP**.

The **RPS** (Redirect & Provisioning Service) method involves entering the provisioning URL on the manufacturer's website for the phone. NethVoice is capable of performing this insertion automatically. As soon as the phone is powered on for the first time, it attempts to contact the manufacturer's website to obtain the provisioning URL.

The **DHCP** method is based on configuring OPTION 66 of the DHCP (Dynamic Host Configuration Protocol) protocol specifically for each brand of phone. It is necessary to configure the network's DHCP server appropriately.

If neither RPS nor DHCP works, it is possible to access the web interface of the phone's administration and manually enter the provisioning URL. Remember to disable other provisioning methods, such as DHCP and PNP.

The provisioning URL is displayed in the administration interface of NethVoice for each phone, via the :guilabel:`Info` button on the page :guilabel:`Devices > Phones`.

In any case, once the provisioning URL is obtained, the phone always uses this to access its configuration on NethVoice.

.. warning::

    Refer to section :ref:`provisioning-support-section` for further information on manufacturers' support for RPS and DHCP.

Phone Configuration Specifications
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

   Do not change settings from the phone's administration interface.

Upon restart, the phone retrieves the configurations from the provisioning URL.

Any changes made from the phone's administration interface will be lost.

The following sections describe some settings provided by NethVoice.

Provisioned phones will automatically update their configuration even upon a change of state (Available, Do Not Disturb, etc.) in NethVoice CTI of the connected user to maintain uniformity of state across all devices.

This configuration update does not cause any disruption or restart of the phone.

Admin Password
^^^^^^^^^^^^^^

The phone web administration interface is accessible with the username ``admin`` and a password generated randomly during the installation of NethVoice.

The password is available in the NethVoice administration interface, on the :guilabel:`Models > Default Settings` page.

.. _provisioning-automatic-updates:

Automatic Updates
^^^^^^^^^^^^^^^^^

The phone automatically contacts NethVoice every night to update its configuration. It is possible to completely disable automatic updates.

In any case, the phone downloads the configuration every time it is restarted.

.. _provisioning-firmware-upgrade:

Firmware upgrade
^^^^^^^^^^^^^^^^

The phone manufacturer periodically publishes firmware updates for the various models of their phones on their website.

It is possible to distribute the updated firmware to all phones of the same model or to a single phone. 
The firmware file obtained from the manufacturer's website must be uploaded through the administration interface of NethVoice, respectively in :guilabel:`Models > Preferences > Firmware` or in :guilabel:`Configuration > Associated Devices > Edit > Preferences`.

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

The functions of phones that can be configured through provisioning are grouped in the panels of the NethVoice administration interface and are described in the sections below.

Not all phone models offer the same functions, so some parameters or entire panels might not be displayed.

Generally, leaving a field empty or selecting the option - (minus sign) indicates that the value inherited from the context with lower priority is used; the highest priority is given to the phone settings, followed in descending order by model and default settings. 
Refer to :ref:`Phone Configuration Priority <provisioning-scopes-priority>` for more information.

.. _panel-softkeys:

Soft key
^^^^^^^^

The ``soft keys`` are programmable phone keys designated for calling phone functions.


If the phone provides more keys than those displayed in the NethVoice administration interface, a ``View more`` button is available to add additional keys.

Depending on the ``Type``, the ``Value`` and ``Label`` fields may also need to be completed, as indicated in the table below.

In the Label column, the term default signifies that if the Label field is left empty, the phone will assign a default ``label`` to the soft key.


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

The ``line keys`` are programmable phone keys that resemble soft keys but are more specifically designed for call management and monitoring the status of extensions.

If the phone provides more keys than those displayed in the NethVoice administration interface, there is a ``View more`` button to add additional keys.

Depending on the ``Type``, the fields ``Value`` and ``Label`` might need to be filled in, as outlined in the table below.

In the Label column, the term "default" signifies that if the Label field is left blank, the phone will assign a default ``label`` to the line key.

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

The *Expansion Keys* are programmable buttons on *expansion modules*, devices that can be connected to the phone to increase the number of available keys.

If the expansion module provides more keys than are displayed in the NethVoice administration interface, a ``View more`` button is available to add additional keys.

This type of key is configured similarly to the Line key.

This type of key is configured similarly to the :ref:`Line key <panel-linekeys>`.

.. _panel-display:

Screen and Ringtone
^^^^^^^^^^^^^^^^^^^

* ``Ringtone Selection``: Each phone has some predefined ringtones that can be selected based on their progressive number. Where supported, a custom ringtone can also be chosen, which should then be uploaded into the field described below.

* ``Custom Ringtone Management``: Select an audio file for the custom ringtone that has been previously uploaded, or upload a new one by opening the dedicated management module. The audio format must be compatible with the specifications of the phone manufacturer.

* ``Background Image" "Screensaver Image``: Select an image file for the phone screen background and screensaver, or upload a new one by opening the dedicated management panel. The image format must be compatible with the specifications of the phone manufacturer.

* ``Screensaver Activation``: Time interval after which the screensaver is activated.

* ``Backlight Off``: Time interval after which the screen lowers brightness or turns off the screen backlight.

* ``Screen Brightness`` "Screen Contrast": Select the brightness and contrast levels of the screen.

Preferences
^^^^^^^^^^^

* ``NTP Server Address``: The hostname or IP address of the Network Time Protocol (NTP) server to automatically set the phone's time.

* "Provisioning Schedule``: By selecting Only at startup, phones renew their configuration after turning on or restarting. Alternatively, by selecting Every day, phones autonomously renew their configuration at a random time during the night.

* ``Transfer Mode for Line Keys``: Specifies how line keys transfer the ongoing call to another extension.
  
  * **New Call** initiates a new call to the extension configured on the line key, placing the current call on hold.
  
  * **Consultative** always places the current call on hold, and the transfer completion can occur while the extension configured on the line key is ringing or even after the answer.
  
  * **Blind/No Confirmation** immediately transfers the current call to the configured extension.

* ``Phone Language``: Language used by the phone's screen and its web interface.

* ``Timezone``: Sets the phone's timezone, necessary for daylight saving time adjustments.

* ``Ring Tones``: These are specific to each country and indicate the call status through an audible signal: free tone, busy tone, hang-up tone, etc.

* ``Time Format`` "Date Format": Choice of the time/date format displayed on the phone's screen.

* ``Firmware``: Upload and selection of a new firmware version for the phone.

LDAP Phonebook
^^^^^^^^^^^^^^

The first two options in the ``Address Book Type`` do not allow further modifications. Phones will use the fixed and unmodifiable centralized phonebook of NethVoice. However, by selecting "Custom phonebook," you can modify the remaining fields in this panel to connect phones to a third-party LDAP server.

* ``Server Address``: Hostname or IP address of the LDAP server.

* ``Port Number``: TCP port used by the LDAP server.

* ``Username" "Password``: Authentication credentials for the LDAP service. The username might be specified as a Distinguished Name (DN) LDAP or in another format, depending on the requirements of the LDAP server.

* ``Encryption``: Protects the connection with TLS or STARTTLS. Caution! Some phones do not support encryption, and it is necessary to select None.

* ``Search Base (DN)``: Limits access to the branch of the LDAP database specified as the base. Usually, the search base is mandatory.

* ``Search Filter for Contact Name`` ``Search Filter for Phone Number``: LDAP search filters need to be specified with the syntax defined by RFC-4515 and later. The character % (percentage sign) can be used as a placeholder that the phone replaces with the dialed number.

* ``Attributes for Contact Name``: Separated by space, list the names of LDAP attributes that can contain the contact's name.

* ``Name Display Format``: Attributes' names preceded by the character % (percentage sign) can be composed to form the pattern with which the name is displayed on the phone screen.

* ``Attribute for Main Phone Number`` ``Attribute for Mobile Number`` ``Attribute for Other Phone Number``: These three fields contain names of LDAP attributes for the respective phone numbers.

Network
^^^^^^^

Phones use the DHCP protocol to receive network configuration: IP, subnet mask, DNS, and gateway. In some cases, DHCP is also used to obtain the provisioning URL (refer to "Provisioning methods").

However, the following parameters can be configured in this panel:

* ``VLAN Identifier (VID)``: By specifying a number between 1 and 4094, the phone will add VLAN tagging to the packets generated by the phone itself, according to the IEEE 802.1Q standard.

* ``VLAN Identifier for PC port``: By specifying a number between 1 and 4094, the phone will add VLAN tagging to packets coming from the PC port (or data port), following the IEEE 802.1Q standard.

In the VLAN fields, the value "" (empty string) usually considers the setting at a lower priority (model or default), while "0" (zero) corresponds to "disabled".

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

PATTON
~~~~~~

* BRI Trinity Models
* PRI Trinity Models
* FXO Trinity Models

Provisioning
^^^^^^^^^^^^

Gateway configuration is carried out in the Wizard.

Gateway provisioning adheres to the same guidelines as provisioning for phones, with one key distinction: unlike phones, NethVoice establishes a direct connection to the gateway via telnet to upload the configuration, eliminating the need for the gateway to fetch it.

Gateway configuration is performed with the gateway online; by default, gateways initiate in DHCP mode.

However, by selecting :guilabel:`Add Gateway`, it is feasible to generate a configuration for a gateway not yet connected and subsequently configure it by uploading the file through the gateway's web interface.

Configuring Gateways
^^^^^^^^^^^^^^^^^^^^

To configure the gateway, it is necessary to specify a few required configuration parameters:

1. Device IP address; gateway configuration necessitates a static IP.
2. Subnet mask.
3. Network gateway.
4. NethVoice IP address; in some installation scenarios, the gateway may connect to NethVoice via a non-local IP.
5. Any characteristics required for configuring connected lines (for ISDN lines, the ISDN terminal adapter's mode; for analog lines, the dialed number of the line).

.. note:: For Grandstream models with 2 network interfaces, the LAN interface's MAC address must be provided, but NethVoice's configuration utilizes the WAN interface, which will be the one used.

To download the gateway configuration for uploading via the web interface, click on the management button (symbol with three squares).

Dashboard
=========

The dashboard serves as the initial page of NethVoice following the first configuration.

It offers an overview of the elements involved in NethVoice's operation.

Users
-----

The dashboard showcases the users configured in NethVoice along with their presence status and telephone devices.

If a user's presence configuration deviates from the default (Available), an option exists to reset it to the normal state by clicking on the eraser symbol.

Clicking to view details about an individual device displays the telephone device's specifics:

* Name
* Model
* IP Address: Clicking facilitates connection over the local network.
* SIP Port
* Codecs Used
* DND (Do Not Disturb)
* Call Forward

Trunks
------

The configured VoIP trunks in NethVoice are displayed along with their status, indicating technology, IP, port, status, and codec.

.. _applications:

Applications
============

The *Applications* section allows for the creation, modification, or deletion of certain PBX features, which are initially created and configured in the wizard but subsequently utilized in the NethVoice CTI.

For instance, customer cards are set up in the wizard to access the database and to practically display the obtained information, but the actual usage occurs within the NethVoice CTI, during calls or when searching for specific information.

Customer Cards
--------------

The *customer cards* section enables the grouping of information from external databases to the PBX and its display during calls. For example, when receiving a call from a specific customer, retrieve information from the database related to their invoices or any outstanding payments and evaluate whether to provide assistance or not.
To create a new customer card, follow these steps:

Address Book Sources
^^^^^^^^^^^^^^^^^^^^

Click on :guilabel:`Create New Source` and complete the form that appears:

* ``Database Type``: Specify the type of database from which information will be retrieved.
* ``Database Name``: Specify the name of the database to connect to.
* ``Database Address``: Specify the address for connecting to the database (localhost, socket, or external IP).
* ``Database Port``: Specify a port for the database different from the default one proposed.
* ``Database User``: Specify the user for database connection.
* ``Database Password``: Specify the password for database connection.
* ``Connection``: Press the "Verify" button to test the accuracy of the entered connection information.

Press :guilabel:`Save` to add the database source. The newly created source will be listed among the available sources.

Template
^^^^^^^^

Templates serve as the blueprint for your customer cards. They utilize the `ejs` engine, which boasts a JavaScript-like syntax. This allows for the writing of HTML code using specific directives available on the website https://github.com/tj/ejs.

To begin the creation process, click on the :guilabel:`Create New Template` button:

* ``Name``: Specify the template's name.
* ``Results``: This field contains the output of your query in JSON format. Use the text field to test and see how your HTML template will appear with your data.
* ``Code (ejs)``: Enter your template's code in this text field, adhering to the ejs syntax and using the values mentioned above (which are essentially the result columns of your query).
* ``Preview``: By combining the results and the ejs code, you will see the corresponding HTML output, which will serve as your customer card.

The PBX already offers some predefined templates with pre-written HTML code that you can duplicate and modify by altering the color.

Customer Cards
^^^^^^^^^^^^^^

After creating the data source and the template for your card, this section requires you to merge the two pieces of information to ensure the card's correct creation. Click on the :guilabel:`Create New Card` button and fill out the form:

* ``Name``: Name of the customer card.
* ``Source``: Specify the previously created database source.
* ``Template``: Choose the template you previously created.
* ``Profile``: Select the type of user profile to which the customer card you are creating will be displayed.
* ``Query``: Input the query that will return the relevant information.
* ``Render``: By pressing this button, the query will execute on the specified source, and the data will be inserted into the selected template, producing the desired output.

Press the :guilabel:`Save` button to save your customer card.

.. warning:: 
   Once the query and card have been created and it is verified that everything works, use the `$NUMBER` variable to replace numerical parameters in your query.

Example:

If your query is as follows: ::

  select * from phonebook where homephone like '%150' or workphone like '%850' or cellphone like '%150' or fax like '%850'

It should be changed to::

  select * from phonebook where homephone like '%$NUMBER' or workphone like '%$NUMBER' or cellphone like '%$NUMBER' or fax like '%$NUMBER'

The `$NUMBER` variable represents the caller ID of the PBX, referring to collect the data to be displayed on the customer card.

.. _external-phonebook:
Phonebook Sources
-----------------
Adding External Address Books
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

From the menu :guilabel:`Applications -> Address Book Sources`, you can define an external source for the contacts NethVoice should use to resolve incoming and outgoing calls.
These contacts will be added to the NethVoice address book and made available for use in NethVoice CTI and NethVoice App.

To configure a new source, three steps are required:

* **Source**: Configure access to the source database of contacts.

* **Mapping**: Associate fields from the source database with those of the NethVoice address book.

* **Settings**: Choose the synchronization interval.

Phonebook Source
^^^^^^^^^^^^^^^^

A unique :guilabel:`Phonebook Name` must be assigned to the source to distinguish the origin of the contacts imported into the NethVoice phonebook.

Based on the :guilabel:`Source Type`, additional attributes need to be specified:

**MySQL**

Database name, server address/port, username, and password for the source database are required.

Additionally, in the Select query text area, the SQL query used to retrieve data to be imported into the centralized address book must be inserted. If present in the text area, replace the word ``[table]`` with the name of the source table.

**CSV**

In the :guilabel:`URL` field, you can specify the web address of a file in CSV format (Comma-Separated Values, values separated by commas and double quotes "" as text qualifiers, mandatory if the field contains a comma or space). Addresses starting with ``http://`` and ``https://`` are accepted.

Alternatively, you can upload a CSV file via the button to the right of the same text field. In this case, the :guilabel:`URL` field will be automatically populated.

The CSV file must be encoded in UTF-8 and contain column names on the first row.

The :guilabel:`Verify` button allows you to preview the data retrieved from the source.

Custom Name Resolution
^^^^^^^^^^^^^^^^^^^^^^

If you wish to use a source other than the centralized address book to resolve names, you can create a custom resolution script and place it in the *~/.local/share/containers/storage/volumes/lookup.d/_data/* directory.

In the Github repository `https://github.com/nethesis/ns8-nethvoice/tree/main/freepbx/usr/src/nethvoice/samples`, there are two example scripts: *lookup_dummy.php* and *lookup_vte.php*, which can serve as a starting point for creating your own custom script.

The *lookup_dummy.php* script returns a fake result for any number dialed or incoming call, while the lookup_vte.php script utilizes an external API.

.. list-table:: Fields of the Centralized Address Book
    :widths: 10 10
    :header-rows: 1
 
 * - owner_id
   - Owner of the contact

 * - type
   - Source of origin

 * - homeemail
   - Home email address

 * - workemail
   - Work email address

 * - homephone
   - Home phone number

 * - workphone
   - Work phone number

 * - cellphone
   - Cell phone number

 * - fax
   - Fax number

 * - title
   - Job title

 * - company
   - Company

 * - notes
   - Notes

 * - name
   - First and last name

 * - homestreet
   - Home address

 * - homepob
   - Home PO Box

 * - homecity
   - Home city

 * - homeprovince
   - Home province

 * - homepostalcode
   - Home postal code

 * - homecountry
   - Home country/region

 * - workstreet
   - Work address

 * - workpob
   - Work PO Box

 * - workcity
   - Work city

 * - workprovince
   - Work province

 * - workpostalcode
   - Work postal code

 * - workcountry
   _ Work country/region

 * - url
   - Website address

Settings
^^^^^^^^

You can choose the synchronization interval for contacts between:

* 15 minutes

* 30 minutes

* 1 hour

* 6 hours
  
* 24 hours

Once the source is created, you can:

* Immediately synchronize using the :guilabel:`Sync` button

* Enable/disable synchronization

Parameterized URLs
------------------

Allows the end user to invoke a parameterized URL upon receiving a call. The URL will be parameterized with caller data and can be "opened" in one of the following four scenarios:

* Never

* When the incoming call is ringing

* When the incoming call is answered

* By clicking the appropriate button in the call management box

To create a URL, two pieces of information are required:

* The URL itself

* The selection of a user profile

The composition of the URL can be done using these parameters, which are populated for each call:

* *$CALLER_NUMBER* (Caller Number)

* *$CALLER_NAME* (Name associated by NethVoice to the caller number)

* *$CALLED* (Called Number)

* *$UNIQUEID* (Unique identifier of the call)

It is possible to enable the option "Only calls on queues" to activate the parameterized URL only for calls that ring in a queue.

All users who have that profile will be enabled to use the newly created URL.
  
.. note::
  * Only one URL can be associated with a profile.
  * For the URL to be invoked, it is necessary for the end user to have enabled pop-up display in their browser!
