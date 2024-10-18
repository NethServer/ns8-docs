.. _webtop-section:

================
WebTop groupware
================

WebTop is a full-featured groupware which implements ActiveSync, CalDAV and CardDAV protocols.

You can install multiple WebTop instances on the same node from the :ref:`software_center-section`.

Configuration
=============

WebTop needs a dedicated virtual host, an FQDN like ``webtop.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the application configuration page and enter a valid FQDN inside ``WebTop virtual host`` field
2. enable ``Request Let's Encrypt certificate``
3. bind the WebTop instance to an existing ``Mail server``
4. select the ``Default locale`` and the ``Default timezone``
5. click the :guilabel:`Save` button

Inside the ``Advanced`` section, you can also configure:

* the debug mode
* log levels
* minimum and maximum memory
* :ref:`PEC Bridge <pec-bridge>` notify address (Nethesis Enterprise Only)

Authentication
==============

Always use the full user name format ``<user>@<domain>`` for login to the
web application and Active Sync.

**Example**

* Server name: mymail.mightydomain.com
* Alternative mail domain: baddomain.net
* User: goofy
* Login: goofy@mightydomain.com

.. note::
   Active Sync protocol is supported only on Android and iOS devices.
   Outlook is not supported.


.. _webtop5_admin-section:

Admin user
==========

After installation, WebTop will be accessible using the administrator user.
The administrator user can change global settings and login as any other user,
however, it's not a system user and can't access any other service like Mail, Calendar, etc.

Default credentials are:

* User: *admin*
* Password: *admin*

The administrator user's password must be changed from within the WebTop interface.

.. warning::
   Remember to change the admin password after installation!


To check the mail of the system's user admin account use the following login: admin@<domain> where ``<domain>`` is the
domain part of server FQDN.

**Example**

* Server name: mymail.mightydomain.com
* User: admin
* Login: admin@mightydomain.com

Change admin password
---------------------

.. |hamburger| image:: _static/webtop-hamburger.png

Access WebTop using the ``admin`` user, then open user settings by clicking on the |hamburger| menu in the top-right corner.

Go to :guilabel:`Settings` then click on :guilabel:`Change password`.


Changing the logo
=================

To modify and customize the initial logo that appears on the login page of WebTop,
you must upload the custom image file on the public images of the admin user and rename it ``login.png``.

Proceed as follows:

1. login with the WebTop user admin

2. select the cloud service and public images:

   .. image:: _static/webtop-public_images.png

3. upload the image (via the Upload button at the bottom left or simply dragging with a drag & drop)

4. rename the loaded image so that its name is **"login.png"** (use right click -> Rename):

   .. image:: _static/webtop-login_page.png

5. the next login will show the new logo on the login page

User settings management
========================

Most user settings can be directly managed by the user itself via the settings menu.
Locked settings require administrative privileges.

The administrator can :index:`impersonate` users, to check existing accounts using special login credentials:

* **User name**: ``admin!<username>``
* **Password**: ``<WebTop admin password>``

While impersonating you receive similar user privileges, allowing you to control exactly what the user can see.
Full administration of user settings is available directly in the administration interface, by right-clicking on a user: the settings menu will open the full user settings panel, with all options unlocked.

You can also change the email of all selected users: 

1. select the users (Click + CTRL for multiple selection)
2. right-click on :guilabel:`Bulk update email domain`

Two-factor authentication (2FA)
===============================

WebTop supports :index:`two factor authentication`.
The user can choose between:

- Google Authenticator app (`Android <https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2>`_, `iOS <https://apps.apple.com/it/app/google-authenticator/id388497605>`_)
- secondary mail address

To enable 2FA:

- click on the menu button on the top-right corner and select the :guilabel:`Settings` icon
- then select :guilabel:`Security` and click on the :guilabel:`Activate button`

.. image:: _static/webtop-2fa.png


ActiveSync (EAS) synchronization
================================

Mobile devices can be synchronized using ActiveSync.
:index:`ActiveSync` can be used only for **contacts** and **calendars**.

Apple iOS
---------

Access your :index:`iOS device`, navigate to Settings and add an Exchange account following the `official guide <https://support.apple.com/en-us/HT201729>`_.

Fill the required fields with:

- **E-mail**: add your mail address, eg: goofy@nethserver.org
- **Server**: add your server public name, eg: mail.nethserver.org
- **Domain**: leave blank
- **User name**: enter your full user name, eg: goofy@nethserver.org
- **Password**: enter your password

.. note::

   iOS devices require a valid SSL certificate on the server.
   See :ref:`certificate_manager-section`

Google Android
--------------

Access your :index:`Android device`, navigate to Settings, then select :guilabel:`Add account` -> :guilabel:`Exchange` (or `Company` for older releases).

Fill the required fields with:

- **User name**: enter your full user name, eg: goofy@nethserver.org
- **Password**: enter your password

Then select :guilabel:`Manual configuration` and change the name of the *Server* field accordingly
to your server public name.
Finally, if you have a self-signed certificate on your server, make sure to select :guilabel:`SSL/TLS (accept all certificates)` option.

.. note::

   On some Android releases (notably Samsung), the User name and Domain must be entered in the same line.
   In this case, leave blank the field before the backslash character ``\``, and enter the user name in the following format: ``\goofy@nethserver.org``

Multiple calendars and contacts
-------------------------------

Shared calendars and address books can be synchronized using the ActiveSync protocol.

Shared resources are displayed with the owner's name and category. The number in square brackets is the internal id.
Private events are not synchronized.

Mobile devices based on Apple iOS fully support folders/categories for calendars, contacts and activities (called reminders), including original colors.

Mobile devices based on Android support only calendars and contacts, activities are not supported.
Using the Google Calendar application all items will have the same color.

Installing and using the `CloudCal <https://pselis.com/cloudcal/>`_ application,
you can change the colors associated with each calendar, including shared ones.

On Android devices, contacts from shared phone books are merged with the personal phone book and displayed in
a single view. Contacts can be modified and changes will be saved in the original source.

.. note::

  In order to receive data via EAS on mobile devices, 
  shared resources (Calendars and Contacts) should have synchronization enabled (Full or Read-only):

  .. image:: _static/webtop-multiple_sync.png
               :alt: Multiple synchronization

It is possible to enable or disable the synchronization for each shared resource.

To do so, just right-click on the shared resource :menuselection:`Customize → Devices sync.`:

  .. image:: _static/webtop-sync_shared_eas.png
               :alt: Sync shared EAS

The default setting is ``Not active``.

CalDAV and CardDAV synchronization
==================================

Calendars and address books can be synchronized also through the :index:`CalDAV and CardDAV protocols`.

To synchronize a calendar, pick up its ``URL`` link right-clicking on the calendar and selecting :guilabel:`Links to this calendar`,
then use it to configure your third-party client.

To synchronize an address book, pick up its ``URL`` link right-clicking on the address book and selecting :guilabel:`Links to this address book`,
then use it to configure your third-party client.

To authenticate, provide your credentials in the following form:

- **User name**: enter your full user name (i.e. *goofy@nethserver.org*)
- **Password**: enter your password

Some third-party clients allow simplifying the configuration through the *auto-discovery* feature that automatically discovers the
synchronizable resources, as in the case of mobile devices (i.e. Android or iOS devices).


.. note::

   If you are using clients that do not support auto-discovery, you need to use the full URL: ``https://<server_name>/webtop-dav/server.php``

   If you are using clients that support auto-discovery use the URL: ``https://<server_name>``

Google Android
--------------

A good Android third-party client is `DAVx5 <https://www.davx5.com/>`_.

- add a new account clicking on :guilabel:`+` key and select :guilabel:`Login with URL and username` method
- insert the ``URL`` (``https://<server_name>``), full username (i.e. *goofy@nethserver.org*) and password
- click on the new profile and select the resources you want to synchronize

Apple iOS
---------

CalDAV/CardDAV support is built-in on iOS, so to configure it:

- go to :guilabel:`Settings` -> :guilabel:`Account and Password` -> :guilabel:`Add account`
- select :guilabel:`Other` -> Add :guilabel:`CalDAV` or :guilabel:`CardDAV` account
- insert the server name (i.e. *server.nethserver.org*), full username (i.e. *goofy@nethserver.org*) and password

Desktop clients
---------------

**Thunderbird**

Thunderbird already includes support for CalDAV calendars.
To synchronize the contacts with CardDAV you need a third-party add-on like `Cardbook <https://addons.thunderbird.net/it/thunderbird/addon/cardbook/>`_.

**Outlook**

The Open Source `CalDAV Synchronizer <https://caldavsynchronizer.org/>`_ plugin for Outlook supports both CardDAV and CalDAV.

.. warning::

   Webtop is a **client-less groupware**: its functionalities are fully available **only using the web interface**!

   The use of CalDAV/CardDAV through third-party clients **cannot be considered a web interface alternative**.


Sharing email
=============

It is possible to share a single folder or the entire account with all subfolders.
Select the folder to share -> right click -> :guilabel:`Manage sharing`:

.. image:: _static/webtop-sharing_mail_folder_1.png

- select the user to share the resource (1)
- select if you want to share your identity with the user and even to force your signature (2)
- choose the level of permissions associated with this share (3)
- if you need to further change permissions, select ``Advanced`` (4)
- finally, choose whether to apply sharing only to the folder from which you started, or only to the branch of subfolders or to the entire account (5)

.. image:: _static/webtop-sharing_mail_folder_2.png

.. note::

   The :guilabel:`Force mailcard` option can be used only if the mailcard has been associated to the mail address.

Sharing calendars and contacts
==============================

Sharing Calendar
----------------

You can share each personal calendar individually.
Select the calendar to share -> right click -> :guilabel:`Sharing and permissions`:

.. image:: _static/webtop-sharing_cal_1.png

Select the recipient user of the share (or Group) and enable permissions for both the folder and the individual items:

.. image:: _static/webtop-sharing_cal_2.png

Sharing Contacts
----------------

In the same way, you can share your contacts by selecting the directory you want to share -> right click -> :guilabel:`Sharing and permissions`.
Select the recipient user of the share (or Group), and enable permissions for both the folder and the individual items.


Custom labels
=============

It is possible to add one or more labels to an email, a calendar event or a task.

There are two types of labels:

- **Private**: not usable for custom fields and not visible to other users
- **Shared**: usable for custom field panels and visible to other users

The user can normally only manage Private labels.
In order to manage the Shared labels it is necessary to enable a specific authorization via the admin panel:

- go to the Administration menu, then choose :guilabel:`Domains` -> :guilabel:`NethServer` -> :guilabel:`Groups` -> :guilabel:`Users` -> :guilabel:`Authorization`
- add (+) -> :guilabel:`Services` -> :guilabel:`com.sonicle.webtop.core (WebTop)` -> :guilabel:`Resource` -> :guilabel:`TAGS` -> :guilabel:`Action` -> :guilabel:`MANAGE`
- click :guilabel:`OK` then :guilabel:`Save and exit`

.. |tools| image:: _static/webtop-tools.png

You can manage the labels from the tools |tools| button icon at the top right corner.

The same functionality can also be reached from the individual modules by right-clicking -> :guilabel:`Labels` -> :guilabel:`Manage labels`.

Visibility can be set only during label creation. To change the label visibility you need to delete the label and create it again.

The created labels can be used in any other module like Mail, Address Book, Calendar and Tasks.

.. _custom_fields-section:

Custom fields
=============

With custom fields, it is possible to provide information and additional data for each contact, event or activity.

Custom fields are only available for the Address Book, Calendar, and Tasks modules and are specific to each different module.

In order to manage custom fields and their panels, the user must have a specific authorization, obtained through the administration panel:

- go to the Administration menu, then choose :guilabel:`Domains` -> :guilabel:`NethServer` -> :guilabel:`Groups` -> :guilabel:`Users` -> :guilabel:`Authorization`
- add (+) -> :guilabel:`Services` -> :guilabel:`com.sonicle.webtop.core (WebTop)` -> :guilabel:`Resource` -> :guilabel:`CUSTOM_FIELDS` -> :guilabel:`Action` -> :guilabel:`MANAGE`
- click :guilabel:`OK` then save and exit

Users who have this authorization will find the specific button available at the top right:

.. image:: _static/webtop-cf1.png

To create a new custom field it is necessary to fill in at least the :guilabel:`Name` field and select the :guilabel:`Type`:

.. image:: _static/webtop-cf2.png

For the :guilabel:`Name` field only alphanumeric characters (including ``-`` and ``_``) are allowed. **Spaces are not allowed**.
The :guilabel:`Description` field is used to add details to the field and the :guilabel:`Label` field represents the label that will be shown along
with the field.

For each field it is possible to enable two options:

- :guilabel:`Show in search bar`: the field is added in the multiple search window (a new access will be required)
- :guilabel:`Show in preview`: the field is shown in the preview window of a contact

Additional specific properties, that are also customizable, are available for each type.

For the :guilabel:`List box` type it is necessary to fill in the values to be selected:

.. image:: _static/webtop-cf4.png

Using the :guilabel:`Clone` button you can copy the custom field to create similar ones:

.. image:: _static/webtop-cf5.png

.. note::
    With the **FREE version**, installed by default, it is possible to create up to a **maximum of 3 custom fields** for each different module (3 in Address Book + 3 in Calendar + 3 in Activities). To remove this limit it is necessary to upgrade to the **PREMIUM version** by purchasing a dedicated license on `Nethesis shop <https://nethshop.nethesis.it/product/campi-custom-webtop/>`_

Searches on custom fields
-------------------------

One of the best functionalities of custom fields is the possibility to perform multiple searches on all modules and fields for which the option :guilabel:`Show in search bar` has been activated.


Custom panels
=============

Custom panels display the :ref:`custom_fields-section` and associated them with resources.

Users with the authorization to manage custom fields can access the configuration panel using the button at the top right:

.. image:: _static/webtop-panels.png

When creating a new panel it is mandatory to indicate the :guilabel:`Name` that will appear in the resource. You can also insert a :guilabel:`Description` and a :guilabel:`Title`.

Using shared labels, you can easily assign panels to specific resource categories.
A panel without an associated label will be visible for every available resource: all contacts, all events or all activities.

Use the :guilabel:`Add` button to add a custom field inside the panel.

Mailcards
=========

One of the main features of managing signatures on WebTop is the opportunity to integrate images or custom fields profiled per user.

To use the images you need to upload them to the public cloud through the WebTop admin user like this:

.. image:: _static/webtop-public_images.png

You can use the :guilabel:`Upload` button to load an image which is at the bottom or simply via drag & drop.

.. note::

  Remember that the public images inserted in the signature are actually connected with a public link.
  To be visible to email recipients, the server must be reachable remotely on port 80 (http) and its FQDN name must be publicly resolvable.

Alternatively, you can configure a global setting to turn images automatically into inline attachments instead of public internet links.

It is possible to do this from web interface by accessing the administration panel -> :guilabel:`Properties (system)` -> :guilabel:`Add` -> select :guilabel:`com.sonicle.webtop.mail (Mail)` and enter the data in the :guilabel:`Key` and :guilabel:`Value` fields according to the key to be configured:

``public.resource.links.as.inline.attachments`` = true (default = false)


To change the signature, each user can access the :menuselection:`Settings --> Mail --> Editing --> Edit User mailcard`:

.. image:: _static/webtop-edit_mailcard.png

You can use the uploaded image inside the mailcard with this button:

.. image:: _static/webtop-public_signature.png

.. note::

   The personal mailcard can be associated with the user or the mail address.
   Users with access to the mail address will also be able to use the mailcard.

By accessing the user settings from the WebTop administration panel ( :menuselection:`Domains --> NethServer --> Users --> Right click on user` ) it is also possible to set up a general domain mailcard that will be automatically set for all users who have not configured their personal mailcard:

.. image:: _static/webtop-domain_mailcard.png

Furthermore, it will also be possible to modify personal details:

.. image:: _static/webtop-personal_information.png

that can be used within the template-based fields within the domain mailcard editor:

.. image:: _static/webtop-mailcard_editor.png

In this way it is possible to create a single mailcard that will be automatically customized for every user who does not use his own mailcard.

Multiple mailcards
------------------

It is possible to configure multiple mailcards (HTML signatures) for each user.

Access the :menuselection:`Settings --> Mail --> Identities` and create multiple identities:

.. image:: _static/webtop-sig_sig1.png

To edit every single signature select :menuselection:`Settings --> Mail --> Identities` then select each individual signature and click on the :guilabel:`edit mailcard` button

.. image:: _static/webtop-sig_sig2.png
.. image:: _static/webtop-sig_sig3.png

When finished, close the window and click YES:

.. image:: _static/webtop-sig_sig4.png

to use multiple mailcards, create a new email, and choose the signature:

.. image:: _static/webtop-sig_sig5.png

Mail inline preview
===================

By default, the mail page will display a preview of the content of the latest received messages.

This feature can be enabled or disabled from the :guilabel:`Settings` menu, under the :guilabel:`Mail` tab,
the check box is named :guilabel:`Show quick preview on message row`.

Mail archiving
==============

Archiving is useful for keeping your inbox folder organized by manually moving messages.

.. note::
    Mail archiving is not a backup.

The system automatically creates a new special Archives folder

.. image:: _static/webtop-archive_archive1.png

If the :guilabel:`Archives` folder does not appear immediately upon login, it will appear at the first archiving.

There are three archiving criteria:

* **Single folder:** a single root for all archived emails
* **Per year:** a root for each year
* **By year / month:** a root for each year and month

.. image:: _static/webtop-archive_archive2.png

To maintain the original structure of the folders is possible to activate :guilabel:`Keep folder structure`

.. image:: _static/webtop-archive_archive3.png

The archiving operation is accessible from the contextual menu (right-click). Click on :guilabel:`Archive`

.. image:: _static/webtop-archive_archive4.png

The system will process archiving according to the last settings chosen.

IMAP folders subscription
=========================

By default, all IMAP folders on the server are automatically subscribed and therefore visible since the first login.

If you want to hide some folders from the view, which is equivalent to removing the subscription,
you can simply right-click on the folder to hide and select from the interactive menu the item :guilabel:`Hide from the list`.

For example, if you want to hide the subfolder ``folder1`` from this list, just right-click on it and select :guilabel:`Hide from the list`:

.. image:: _static/webtop-sub_imap_folder1.png

It is possible to manage the visibility of hidden folders by selecting the :guilabel:`Manage visibility` function:

.. image:: _static/webtop-sub_imap_folder2.png

For example, if you want to restore the subscription of the :guilabel:`folder1` just hidden, just select it from the list of hidden folders
and click on the icon on the left:

.. image:: _static/webtop-sub_imap_folder3.png

Customize proactive security on emails
======================================

The Proactive Security module (PAS) warns the end user of possible security risks and suspicious senders inside the emails.
The user will also be warned when trying to open potentially dangerous attachments or links contained in emails.

The PAS function allows some customization both for the **end user** and the WebTop **admin**.

For the **end user** it is possible to mark a sender as trusted when it is recognized as such by the yellow shield.
To do so, it is possible to click directly on the shield or right click on the sender and select the :guilabel:`Mark as trusted` entry.

.. note::

   This type of customization is only valid for the user that performed the action.
   It is possible to mark a sender as trusted only if the shield is yellow.

The **admin user** can disable all or some of the rules that are part of the PAS (ProActive Security), both for single users and groups.
To do so, it is necessary to add a specific authorization (to the single user or the group of users) for the Service ``com.sonicle.webtop.mail (Mail)`` and for the ``PRO_ACTIVE_SECURITY`` resource:

.. image:: _static/webtop-pas1.png

Below is an explanation of every single entry available as ``Action`` :

* ``DISABLED``: completely disables PAS
* ``NO_LINK_DOMAIN_CHECK``: do not check domains different from the sender’s domain
* ``NO_MY_DOMAIN_CHECK``: do not verify if the sender’s domain is in my domain
* ``NO_FREQUENT_CONTACT_CHECK``: do not check if the sender is in my contacts which are saved automatically
* ``NO_ANY_CONTACTS_CHECK``: do not check if the sender is among one of my contacts
* ``NO_FAKE_PATTERNS_CHECK``: do not verify the presence of false patterns in the sender (e.g. email address of the name shown is different from the sender’s email address)
* ``NO_UNSUBSCRIBE_DIRECTIVES_CHECK``: do not check the entry for the unsubscribe directives to the mailing list (only if the spam status is green)
* ``NO_DISPLAYNAME_CHECK``: do not compare the contact’s display name with the contact in my address book with the same email
* ``NO_SPAM_SCORE_VISUALIZATION``: do not show/check the spam score displayed in the message header
* ``NO_LINK_CLICK_PROMPT``: do not check the click action on links
* ``NO_ZIP_CHECK``: do not give warning about zip attachments

This way it is possible to customize and create special profiles for some users who might not want all the actions to be active.

The administrator can also choose the list of **file extensions for attachments** which are considered a threat.
As default, these are the extensions that are considered dangerous: ``exe,bat,dll,com,cmd,bin,cab,js,jar``

To modify this list it is necessary to add this global setting:

* :guilabel:`Service` = ``com.sonicle.webtop.mail``
* :guilabel:`Key` = ``pas.dangerous.extensions``

For example, if you wanted to add the HTML extension among those that are considered dangerous, the value field should contain the following:

* :guilabel:`Value` = ``exe,bat,dll,com,cmd,bin,cab,js,jar,html`` (Values always need to be separated by a comma)


Export events (CSV)
===================

To export calendars events in CSV (Comma Separated Value) format, click on the |tools| button in the top right corner and select :guilabel:`ERP export (CSV)` 

Finally, select a time interval and click on :guilabel:`Next` to export into a CSV file.

Tasks
=====

Quick view filters
------------------

In the toolbar above the grid there are 7 buttons that allow you to select the most suitable quick view.
The first two buttons refer to today's activities or to those planned within the next 7 days:

.. image:: _static/webtop-task1.png

* **Today**: shows unfinished tasks without a start date or with a start date up to today (inclusive) and those completed with an end date up to today (inclusive)
* **Next 7 days**: shows uncompleted tasks with no start date or starting up to 7 days from today and completed tasks with completion date up to now (inclusive)

The remaining 5 buttons allow you to obtain these other types of quick views:

.. image:: _static/webtop-task2.png

* **Not started**: shows only activities with status "To be started" and starting today (inclusive)
* **Late**: shows only uncompleted tasks with start date up to today (inclusive) and completion date previous to the current one
* **Completed**: shows all activities with status completed and with any date range
* **Not completed**: shows all activities with status other than completed and start date within 1 year (for recurring tasks, only the first instance of the series still to be completed is shown)
* **All**: shows all activities in any status (for recurring tasks the series icon main is shown)

Recurring tasks
---------------

It is possible to configure any type of recurrence:

.. image:: _static/webtop-task3.png

Editing a recurring activity can be done in two different ways:

1.  on the individual task by opening it with a double click from a view other than :guilabel:`All`
    In this case the task will be **removed** from the recurrence and its icon will become this one:

.. image:: _static/webtop-task4.png

2.  on the entire series with a double click from the :guilabel:`All` view or by using the following button on the single task already open:

.. image:: _static/webtop-task5.png

Sub-tasks
---------

On any task it is always possible to add related sub-tasks (one Master/Slave level only) simply by using the right button and selecting :guilabel:`Add sub-task`
Within the connected tasks, both in the master and in the slave, a link is available at the bottom right to open the related tasks:

.. image:: _static/webtop-task6.png

It is possible to **Move** or **Copy** this type of activity (right click -> :guilabel:`Move/Copy`) by choosing to copy or move the sub-activities through an option active by default.

Multiple searches
-----------------

In the bar at the top there is a quick search that is executed on all fields.
You can also narrow the search by filling multiple search fields.

.. image:: _static/webtop-task7.png

Nextcloud integration
=====================

Before proceeding, verify that the **Nextcloud** module has been installed
from the :ref:`software_center-section`.

By default, Nextcloud integration is disabled for all users.
To enable it, use the administration panel which can be accessed using the webtop admin password

If you want to enable the service for all users, proceed as follows:

1. access the administrative panel and select :guilabel:`Groups`:

.. image:: _static/webtop-admin_panel_groups.png

2. modify the properties of the "users" group by double-clicking and selecting the button related to the Authorizations:

.. image:: _static/webtop-admin_panel_permission.png

3. add to existing authorizations those related to both the ``STORE_CLOUD`` and ``STORE_OTHER`` resources by selecting the items as shown below:

.. image:: _static/webtop-admin_panel_nextcloud_auth_1.png

.. image:: _static/webtop-admin_panel_nextcloud_auth_2.png


to get this:

.. image:: _static/webtop-admin_panel_nextcloud_auth_3.png


4. save and close.

Fron now on, any user it will be able to insert the Nextcloud resource (local or remote) in the personal Cloud.

To do this, simply select the Cloud button and add a new Nextcloud resource by right-clicking on :guilabel:`My resources` and then :guilabel:`Add resource` in this way:

.. image:: _static/webtop-nextcloud_1.png

A pre-filled wizard will open:

.. image:: _static/webtop-nextcloud_2.png

.. note::

   Remember to fill in the User name and Password fields related to access to the Nextcloud resource,
   otherwise it will not be possible to use the public link to the shared files

.. note::

   If Nextcloud has been configured with a custom virtual host (eg. ``nextcloud.mydomain.com``) the :guilabel:`Path` must be changed from `/nextcloud/remote.php/webdav` to `/remote.php/webdav`, please note that `/nextcloud` prefix has been removed. Also make sure to enter the name of the custom virtual host inside the :guilabel:`Host` (eg. ``nextcloud.mydomain.com``).
  
Proceed with the Next button until the Wizard is complete.

Personal Cloud
==============

The personal Cloud module allows you to send and receive documents via web links.

How to create a link to send a document
---------------------------------------

To create the link, select the button at the top right:

.. image:: _static/webtop-doc_cloud1.png

Follow the wizard to generate the link, use the field :guilabel:`date` to set the deadline.

.. image:: _static/webtop-doc_cloud2.png

you can create a :guilabel:`password` to protect it:

.. image:: _static/webtop-doc_cloud3.png

The link will be generated and will be inserted in the new mail:

.. image:: _static/webtop-doc_cloud4.png
.. image:: _static/webtop-doc_cloud5.png

Downloading the file generates a notification to the sender:

.. image:: _static/webtop-doc_cloud6.png

Request for a document
----------------------
To create the request, insert the subject of the email then select the button at the top right:

.. image:: _static/webtop-doc_cloud7.png

Follow the wizard. You can set both an expiration date and a password. The link will be automatically inserted into the message:

.. image:: _static/webtop-doc_cloud8.png

A request email will be sent to upload the document to the Cloud:

.. image:: _static/webtop-doc_cloud9.png

The sender will receive a notification for each file that will be uploaded:

.. image:: _static/webtop-doc_cloud10.png

To download the files just access your personal :menuselection:`Cloud --> Uploads --> Folder` with date and name:

.. image:: _static/webtop-doc_cloud11.png

.. _webtop-chat:

Chat integration
================

Web chat integration installation is disabled by default for all users.

To enable chat integration:

#. Install the "Ejabberd" application from the ``Software center`` page
   See :ref:`install-applications` and :ref:`ejabberd-section`.

#. In Ejabberd ``Settings`` page, the field ``Ejabberd domain (FQDN)``
   must match the value of ``Mail domain`` in Webtop's settings.

#. Access WebTop as admin user then enable the web chat authorization:

   - Access the :guilabel:`Administration` menu, then :menuselection:`Domains --> NethServer --> Groups --> Users --> Authorizations`
   - :menuselection:`Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource --> WEBCHAT --> Action --> ACCESS`
   - Click :guilabel:`OK` then save and close

Jitsi integration
=================

With this integration it is possible to start a new video conference and send the invitation via email, or schedule one by creating the event directly from the calendar.
To activate the integration it is necessary to configure the `Jitsi <https://jitsi.org/>`_ instance that you would like to use directly from admin panel by modifying the `documented global settings <https://www.sonicle.com/docs/webtop5/core.html#meeting-integration-settings>`_

By default, the videoconferencing service is disabled for all users.
To enable it, for all users it is necessary to add a specific authorization from the administration panel:

* Access the :guilabel:`Administration` menu, then :menuselection:`Domains --> NethServer --> Groups --> Users --> Authorizations`
* :menuselection:`Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource MEETING --> Action --> CREATE`
* Click :guilabel:`OK` then save and close

The conference will be available for the users after a new login.

To create a new video conference meeting, you can start from these two buttons:

(top left)

.. image:: _static/webtop_jitsi1.png

(top right)

.. image:: _static/webtop_jitsi2.png

It is also possible to do this from a new email window or a new calendar event.

For each new meeting you have to decide whether it should start immediately (instant meeting) or if it should be scheduled by invitation.

There are several ways to share the new meeting link:

.. image:: _static/webtop_jitsi3.png

* :guilabel:`Start now` allows you to immediately access the newly created meeting room and copy the link via the button available next to the URL
* :guilabel:`Send invitation` -> :guilabel:`Copy meeting invite`: in this case an invitation message, which also includes the meeting link, will be copied (e.g: To join the meeting on Jitsi Meet, click this link: …)
* :guilabel:`Send invitation` -> :guilabel:`Share by email`: you will be asked if you would like to change the subject and date of the meeting, which will then be inserted in the newly generated email:

.. image:: _static/webtop_jitsi4.png

* :guilabel:`Send invitation` -> :guilabel:`Plan event`: also in this case you will be asked if you would like to change the subject and date/time of the meeting before creating the calendar event that will allow you to invite other participants.

If an event contains a link to a third-party video conference, the buttons that will allow you to access the meeting directly:

.. image:: _static/webtop_jitsi5.png


Third-party video calls
-----------------------

The video conferencing services that are currently supported, in addition to Jitsi, are: Google Meet, MS Teams and Zoom.
It is possible to add additional platforms through a `global setting <https://www.sonicle.com/docs/webtop5/core.html#meeting-integration-settings>`_.


SMS integration
===============

It is possible to send SMS (Short Message Service) messages to a contact that has the mobile number in the address book.
To activate sending SMS, first you need to choose one of the two supported providers: `smshosting <https://www.smshosting.it/it>`_ or `twilio <https://www.twilio.com/>`_.

Once registered to the service of the chosen provider, retrieve the API keys (``AUTH_KEY`` and ``AUTH_SECRET``) to be inserted in the WebTop configuration db.
The settings to configure are those shown `here <https://www.sonicle.com/docs/webtop5/core.html#sms-settings>`_ .

You can do it by accessing the administration panel -> :guilabel:`Properties (system)` -> :guilabel:`Add` -> select :guilabel:`com.sonicle.webtop.core (WebTop)` and enter the data in the :guilabel:`Key` and :guilabel:`Value` fields according to the key to be configured:

``sms.provider`` = smshosting or twilio

``sms.provider.webrest.user`` = API AUTH_KEY

``sms.provider.webrest.password`` = API AUTH_SECRET

``sms.sender`` = (default optional)

The ``sms.sender`` key is optional and is used to specify the default sender when sending SMS.
It is possible to indicate a number (max 16 characters) or a text (max 11 characters).

.. note::

   Each user can overwrite the sender by customizing it as desired through its settings panel: :guilabel:`WebTop` -> :guilabel:`Switchboard VOIP and SMS` -> :guilabel:`SMS Hosting service configured` -> :guilabel:`Default sender`

To send an SMS from the address book, right-click on a contact that has the mobile field filled in -> :guilabel:`Send SMS`

Launcher customization
======================

The launcher is the icon-based menu on the left of the page.
You can add custom buttons to the launcher.

To configure the buttons, access the WebTop administration panel and select -> :guilabel:`Domains` -> :guilabel:`NethServer` ->  :guilabel:`Launcher` :

.. image:: _static/webtop_launchers.png


For each button, enter these three values

* ``Name`` : tab descriptive text that appears with mouse-over
* ``Link URL`` : URL to be opened in a new browser
* ``Icon URL`` : icon image URL, it should always be a publicly reachable address. To avoid scaling problems, use vector images

If you can't find a public URL for the icon image, you can upload the icon on Webtop public cloud.
WebTop public cloud already hosts mailcards images.
Access the administrator panel and click on :guilabel:`Cloud` -> :guilabel:`Public Images`,
then insert a URL like ``https://<public_name_server>/webtop/resources/156c0407/images/<icon.svg>``.

The configured custom link buttons will be shown to all users at the next login.


Browser notifications
=====================

WebTop can notify new mail messages and upcoming calendar events.

To activate it, simply access the general settings of your user:

.. image:: _static/webtop-desktop_notifications.png

It is possible to enable desktop notifications in two modes:

- :guilabel:`Always`: notifications will always be shown, even with the browser open
- :guilabel:`Auto (in background only)`: notifications will be shown only when the browser is in the background

Make sure to allow notifications inside your browser.

If you need to enable this consent later on a different browser just click on the appropriate button:

.. image:: _static/webtop-button_desktop_notifications.png


External IMAP accounts (Beta)
=============================

External IMAP accounts can be accessed in read-only mode.
Each user can have a maximum of 3 external accounts.

To enable the feature:

1. Access the administration panel, then selected :guilabel:`Properties (system)`
2. Click on :guilabel:`Add` button and select :guilabel:`com.sonicle.webtop.mail`
3. Create a new key named ``external-account.enabled`` with value ``true``
4. Give a specific authorization to the user by setting:

   - Service: ``com.sonicle.webtop-mail``
   - Resource: ``EXTERNAL_ACCOUNT_SETTINGS``
   - Action: ``CHANGE``

Users can now configure personal external accounts by accessing the :guilabel:`Settings` section.

Subscribing remote resources
============================

WebTop supports subscriptions to remote calendars and contacts (directory) using CardDAV, CalDAV and iCal.

Remote calendars
----------------

An Internet Calendar can be added and synchronized.
To do so just click the right button on personal calendars, :guilabel:`Add Internet Calendar`.
Two types of remote calendars are supported: WebCal (ICS format) and CalDAV.

.. note::

   Synchronization of Webcal calendars (ICS) is always done by downloading every event on the remote resource every time, while only the differences are synchronized with the CalDAV mode

Example of Google Cal remote calendar (Webcal only - ICS)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1) Take the public access ICS link from your Google calendar: :guilabel:`Calendar options -> Settings and sharing -> Secret address in iCal format`

2) On WebTop, add an Internet calendar of type Webcal and paste the copied URL without entering the authentication credentials in step 1 of the wizard.

3) The wizard will connect to the calendar, giving the possibility to change the name and color, and then perform the first synchronization.

.. note::

   The first synchronization may fail due to Google's security settings.
   If you receive a notification that warns you about accessing your resources you need to allow them to be used confirming that it is a legitimate attempt.

Remote contacts (directory)
---------------------------

Google CardDAV remote address book
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Steps:

* on Webtop, configure a new Internet address book, right-click on :guilabel:`Personal Categories -> Add Internet address book` and
  and enter a URL of this type in step 1 of the wizard: ``https://www.googleapis.com/carddav/v1/principals/XXXXXXXXXX@gmail.XXX/lists/default/``
  Replace the ``X`` with your GMail account

* enter the authentication credentials (as user name use the full address of gmail):

   .. image:: _static/webtop-remote_phonebook.png

* the wizard in the following steps will connect to the phonebook, giving the possibility to change the name and color, and then perform the first synchronization

You must enable the synchronization into your Google account and enable access for `App Password <https://support.google.com/accounts/answer/185833>`_.

Synchronization of remote resources can be performed manually or automatically.

Automatic synchronization
^^^^^^^^^^^^^^^^^^^^^^^^^

To synchronize automatically you can choose between three time intervals: 15, 30 and 60 minutes.
The choice of the time interval can be made in the creation phase or later by changing the options.
To do this, right-click on the phonebook (or on the calendar), :guilabel:`Edit Category`, :guilabel:`Internet Addressbook` (or :guilabel:`Internet Calendar`):

.. image:: _static/webtop-sync_automatic.png

Manual synchronization
^^^^^^^^^^^^^^^^^^^^^^

To update a remote address book, for example, click on it with the right mouse button and then select the item "Synchronize":

.. image:: _static/webtop-sync_google.png

For CardDAV address books, as well as for remote CalDAV calendars, you can select whether to perform a full synchronization or only for changes.
To do this, right-click on the phonebook (or on the calendar), :guilabel:`Edit Category`:

.. image:: _static/webtop-edit_sync_google.png

Select the desired mode next to the synchronization button:

.. image:: _static/webtop-edit_sync_google2.png

User access and user session logs
=================================

The table showing the entire log of accesses and sessions for each user is available under the administrator panel.
Access the :guilabel:`Administration` menu, then :guilabel:`Domains` --> :guilabel:`NethServer` --> :guilabel:`Audit (domain)` --> :guilabel:`Access log`.

For each access, the table reports the following data in columns: session ID, user name, date and time, session duration, authentication status and any login errors.

You can enable public IP geolocation. First, you need to register an account on `ipstack <https://ipstack.com/>`_ and obtain the ``API KEY`` to insert in the configuration db.

Login to the administration panel -> :guilabel:`Property (system)` -> :guilabel:`add` -> :guilabel:`com.sonicle.webtop.core (WebTop)` -> enter the following data in the fields :guilabel:`Key` e :guilabel:`Value` :

* ``geolocation.provider`` = ``ipstack``
* ``geolocation.ipstack.apikey``  = ``<API KEY FROM PROVIDER>``

Then, logout and a login again. To show the IP geolocation please click on the icon at the far right of the row:

.. image:: _static/webtop_geologip.png

**Impersonate login**

By default, the logins made through impersonate (``admin!<user>``) are not shown in the access logs table.
In order to also add this type of access, you need to add the following key for the core service:

   - ``key`` = ``audit.logimpersonated``
   - ``value`` = ``true``

New device notification
=======================

You can receive an email that notifies when a new device accesses the account for the first time.

By default, this feature is disabled for all users to avoid too many unintentional false positives on first login.

You can `customize this feature <https://www.sonicle.com/docs/webtop5/core.html#security-settings>`_ by accessing the administrator panel.

.. note::

  Accesses made through impersonate (``admin!<user>``) will never send an email notification

Maximum file size limit
=======================

There are pre-configured limits related to the maximum file size:

- Maximum file size for chat uploads (internal default = 10 MB)
- Maximum file size single message attachment (internal default = 10 MB)
- Maximum file size for cloud internal uploads (internal default = 500 MB)
- Maximum file size for cloud public uploads (internal default = 100 MB)

To change these default values for all users, the following keys can be added via the admin interface: :guilabel:`Properties (system) -> Add`.
The value must be expressed in ``bytes``. Example: ``10MB = 10485760 bytes``.

**Maximum file size for chat uploads**

* Service: ``com.sonicle.webtop.core``
* Key: ``im.upload.maxfilesize``

**Maximum file size for single message attachment**

* Service: ``com.sonicle.webtop.mail``
* Key: ``attachment.maxfilesize``

**Maximum file size for cloud internal uploads**

* Service: ``com.sonicle.webtop.vfs``
* Key: ``upload.private.maxfilesize``

**Maximum file size for cloud public uploads**

* Service: ``com.sonicle.webtop.vfs``
* Key: ``upload.public.maxfilesize``


Import contacts and calendars
=============================

WebTop supports importing contacts and calendars from various file formats.

Contacts
--------

Supported contacts format:

- CSV  - Comma Separated values (\*.txt, \*.csv)
- Excel (\.*xls, \*.xlsx)
- VCard (\*.vcf, \*.vcard)
- LDIF (\*.ldif)


To import contacts:

1. right click on the target phone book, then select :guilabel:`Import contacts`

   .. image:: _static/webtop-import_contacts1.png

2. select the import format and make sure that the fields on the file match the ones available on WebTop

   .. image:: _static/webtop-import_contacts2.png

If you are importing a phone book exported from Outlook, make sure to set :guilabel:`Text qualifier` to ``"`` value.


.. image:: _static/webtop-import_contacts3.png

Calendars
---------

Supported calendar format: iCalendar (\*.ics, \*.ical, \*.icalendar)

To import events:

1. right click on the target calendar, then select :guilabel:`Import events`

   .. image:: _static/webtop-import_calendars1.png

2. select the import format

   .. image:: _static/webtop-import_calendars2.png

3. then choose if you want to delete all existing events and import new ones, or just append imported data to existing calendar events

   .. image:: _static/webtop-import_calendars3.png


Mail composer customization
===========================

Hide auto-suggested recipient in lookups
----------------------------------------

You can disable the suggestion of automatically saved addresses.
Access the web administration panel -> :guilabel:`Properties (system)` -> :guilabel:`Add` ->,
select :guilabel:`com.sonicle.webtop.core (WebTop)` and enter the data in the :guilabel:`Key` and :guilabel:`Value` fields according to the key to be configured:

``recipient.provider.auto.enabled`` = false  (default is true)

Edit subject of a mail and save it
----------------------------------

To enable the modification of the subject for received and sent emails, access the web administration panel -> :guilabel:`Properties (system)` -> :guilabel:`Add` -> select :guilabel:`com.sonicle.webtop.mail (Mail)` and enter the data in the :guilabel:`Key` and :guilabel:`Value` fields according to the key to be configured:

``message.edit.subject`` = true  (default is false)

Delete automatically suggested email addresses
----------------------------------------------

When compiling the recipient of a mail, some automatically saved email addresses are suggested.
If you need to delete someone because it is wrong, move with the arrow keys until you select the one you want to delete
(without clicking on it), then delete it with :guilabel:`Shift + Canc`

.. _pec-bridge:

PEC Bridge
==========

.. note::

    Available in Nethesis Enterprise only

PEC (Posta Elettronica Certificata) is widely used in Italy as a virtual
substitute for registered mail, as it holds the same legal validity.

PEC Bridge is a WebTop feature that integrates external PEC mailboxes with
WebTop.

If your system has an active :ref:`Subscription <subscription-section>`
under the Nethesis Enterprise plan, you can purchase a PEC Bridge license
through the `NethService category`_ in the Nethesis online shop.

.. _NethService category: https://nethshop.nethesis.it/product-category/nethservice/

Once the purchase is completed, Nethesis will provide instructions to
activate the license and configure the PEC Bridge.
