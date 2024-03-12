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

.. _provisioning_scopes_priority-section:


Phone Configuration Priority
============================

Configurations created by Nethvoice provisioning for phone devices are derived by combining settings from:

- ``Default Settings``: these are found on the :ref:`wizard-models` page.
- ``Model Settings``: parameters are taken from the configuration of the model associated with the device, which is found on the :ref:`wizard-models` page.
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

Provisioning Parameters Guide
=============================

The functions of phones configurable through provisioning are collected in the panels of the NethVoice administration interface and described in the following sections.

Not all phone models have the same functions, so some parameters or entire panels may not be displayed.

In general, leaving a field empty or selecting the option - (minus sign) indicates the value inherited from the context with lower priority; the highest priority is for the phone settings, followed in descending order by model and default settings.
Refer to :ref:`priority of phone configurations <provisioning-scopes-priority>` for further information.

.. _panel-softkeys:

Soft key
--------

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

Line key
--------

The ``line keys`` are programmable phone keys similar to soft keys but more specific for call management and monitoring the status of extensions.

If the phone makes more keys available than those displayed in the Nethvoice administration interface, there is a button ``View more`` to add more.

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
      - Activate the phone lock" enables the lock feature on the phone, restricting access to the keys and interface. The unlock sequence needs to be configured according to the phone's documentation
      - No
      - Sì (predefinita)

    * - LDAP
      - Show configured LDAP address book on the phone
      - No
      - Yes (default)

.. _panel-expkeys:

Exp key
-------

The *Expansion keys* are programmable buttons on *expansion modules*, devices that can be connected to the phone to increase the number of available keys.

If the expansion module provides more keys than are displayed in the Nethvoice administration interface, there is a ``View more`` button to add additional keys.

This type of key is configured like the :ref:`Line key <panel-linekeys>`.

.. _panel-display:

Screen and Ringtone
-------------------

* ``Ringtone Selection`` Each phone has some predefined ringtones that can be selected based on the progressive number. Where supported, you can also choose a custom ringtone, which should then be loaded into the field described below.

* ``Custom Ringtone Management`` Select an audio file for the custom ringtone that has been previously uploaded, or upload a new one by opening the dedicated management module. The audio format must be compatible with the specifications of the phone manufacturer.

* ``Background Image`` ``Screensaver Image`` Select an image file for the phone screen background and screensaver, or upload a new one by opening the dedicated management panel. The image format must be compatible with the specifications of the phone manufacturer.

* ``Screensaver Activation`` Time interval after which the screensaver is activated.

* ``Backlight Off`` Time interval after which the screen lowers brightness or turns off the screen backlight.

* ``Screen Brightness`` ``Screen Contrast`` Select the brightness and contrast levels of the screen.

.. _panel-preferences:

Preferences
-----------

* ``NTP Server Address`` The hostname or IP address of the Network Time Protocol (NTP) server to automatically set the phone's time.

* ``Provisioning Schedule`` By selecting Only at startup, phones renew their configuration after turning on or restarting. Instead, by selecting Every day, phones autonomously renew their configuration at a random time during the night. See also :ref:provisioning2-automatic-updates.

* ``Transfer Mode for Line Keys`` Specifies how line keys transfer the ongoing call to another extension.

  * **New Call** initiates a new call to the extension configured on the line key, placing the current call on hold.

  * **Consultative** always places the current call on hold, and the transfer completion can occur while the extension configured on the line key is ringing or even after the answer.

  * **Blind/No Confirmation** immediately transfers the current call to the configured extension.

* ``Phone Language`` Language used by the phone's screen and its web interface.

* ``Timezone`` Sets the phone's timezone, necessary for daylight saving time adjustments.

* ``Ring Tones`` These are specific to each country and indicate the call status through an audible signal: free tone, busy tone, hang-up tone, etc.

* ``Time Format`` ``Date Format`` Choice of the time/date format displayed on the phone's screen.

* ``Firmware`` Upload and selection of a new firmware version for the phone.
  See also :ref: `Firmware upgrade <provisioning2-firmware-upgrade>`.

.. _panel-phonebook:

LDAP Phonebook
--------------

The first two options in the ``Address Book Type`` do not allow further modifications. Phones will use the fixed and unmodifiable centralized phonebook of Nethvoice. However, by selecting ``Custom phonebook`` you can modify the remaining fields in this panel to connect phones to a third-party LDAP server.


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
-------

Phones use the DHCP protocol to receive network configuration: IP, subnet mask, DNS, and gateway. In some cases, DHCP is also used to obtain the provisioning URL (refer to :ref:`Provisioning methods <provisioning-methods>`).

However, the following parameters can be configured in this panel:

* ``VLAN Identifier (VID)`` By specifying a number between 1 and 4094, the phone will add VLAN tagging to the packets generated by the phone itself, according to the IEEE 802.1Q standard.

* ``VLAN Identifier for PC port`` By specifying a number between 1 and 4094, the phone will add VLAN tagging to packets coming from the PC port (or data port), following the IEEE 802.1Q standard.

In the VLAN fields, the value "" (empty string), as usual, considers the setting at a lower priority (model or default), while "0" (zero) corresponds to "disabled".

.. warning::
   Entering an incorrect VLAN identifier can render the phone unreachable.

.. _dashboard-ref-label:

Dashboard
=========

The dashboard is the initial page of Nethvoice after the first configuration.

It provides an overview of the elements involved in the operation of Nethvoice.

Users
-----

The dashboard displays the users used in the Nethvoice configuration along with the presence status and their telephone devices.

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

