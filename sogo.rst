.. _sogo-section:

====
SOGo
====

`SOGo <https://www.sogo.nu/>`_  is a web mail client.

SOGo's main features are:

* simple and fast
* support for HTML messages
* shared folders support
* Shared caldav/carddav support

You can install multiple SOGo instances on the same node from the :ref:`software_center-section`.

.. note::

  SOGo provides EAS (Exchange ActiveSync) support, but not EWS (Exchange Web Service).
  Outlook 2013, 2016 for Windows works well with EAS.
  Mainstream mobile devices (iOS, Android, BlackBerry 10) work well with EAS, they can sync mails, calendars, contacts, tasks.
  Apple Mail.app, and Outlook for Mac support EWS. But not EAS.
  **Clients work very well with POP3/IMAP account, caldav/carddav account**

Official documentation
======================

Please read `official documentation <https://sogo.nu/files/docs/SOGoInstallationGuide.html>`_ for more informations.

Migration from NethServer 7
===========================

The application can be migrated from NethServer 7 to NethServer 8, but it requires some manual steps. Please refer to the section :ref:`migration-section` for more information.

The NethForge repository must be enabled in the NS8 cluster before proceeding with the migration.

Configuration
=============

SOGo needs a dedicated virtual host, a FQDN like ``sogo.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name record inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the application configuration page and enter a valid FQDN inside ``SOGo hostname`` field
2. enable ``Request LE certificate`` option accordingly to your needs
3. bind the SOGo instance to an existing ``Mail server``
4. Select the LDAP user Domain to identify users
5. click the :guilabel:`Save` button

Usage
=====

The URL of the groupware is https://yourdomain.com/ (same as ``SOGo hostname`` field). You must use the short format ``username`` for login.


Advanced settings
=================

The following settings are available Inside the ``Advanced`` section:

- Administrator list of SOGo: When enabled, the SOGo administrator can manage all users' preferences.
- Auxiliary email accounts : When enabled, users can add other IMAP accounts that will be visible from the SOGo Webmail interface.
- Enable DAV: When enable the shared calendars and address books are available through DAV.
- Enable Active Sync: When enabled, users can sync their mail, calendars, contacts, tasks with mobile devices.
- Workers count: Number of SOGo workers, you need to adjust it according to the number of users.

.. warning::

  The default value is 3, but you need to increase it if you have more than 20 users.

Manual parameters
=================

Some parameters cannot be modified from the user interface, please follow the instructions `README <https://github.com/NethServer/ns8-sogo/blob/main/README.md>`_

Clients
=======

Android
-------

Currently you have 2 ways to integrate your Android device with Sogo.

Integration via Caldav /Cardav/imap
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. note::

  The drawback is that you need to set all settings (Url/Username/Password) in each application.

* Email

Imaps(over ssl) is a good choice, you can use the K9-mail software to retrieve your email or the default email application

* Contacts and calendars

There are various working clients, including `DAVdroid <https://davdroid.bitfire.at>`_ (open-source) and `CalDAV-Sync/CardDav-Sync <http://dmfs.org/>`_.
Advantages Full integration into Android, so that almost all calendar and contacts apps can access synchronized data. 

Integration via ExchangeActiveSync
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. note::

  The advantage is that you set the Url/Username/Password only in one location

Step-by-step configuration
^^^^^^^^^^^^^^^^^^^^^^^^^^

* Open the account menu, choose add an exchange account
* Fill your full email address and password in Account Setup page:
* If it asks you to choose Account Type, please choose Exchange:
* In detailed account setup page, fill up the form with your server address and email account credential

  * Domain\Username: your username in short format
  * Password: password of your account
  * Server: your server name
  * Port: 443

.. note::

    Please also check Use secure connection (SSL) and Accept all SSL certificates


* In Account Settings page, you can choose Push. it's all up to you.
* Choose a name for your Exchange account.
* Click Next to finish account setup. That's all.


Mozilla Thunderbird and Lightning
---------------------------------

Alternatively, you can access SOGo with a GroupDAV and a CalDAV client. A typical well-integrated setup is to use Mozilla Thunderbird and Mozilla Lightning along with Inverse’s SOGo Connector plug in to synchronize your address books and the Inverse’s SOGo Integrator plug in to provide a complete integration of the features of SOGo into Thunderbird and Lightning. Refer to the documentation of Thunderbird to configure an initial IMAP account pointing to your SOGo server and using the user name and password mentioned above.

With the `SOGo Integrator plug in <https://sogo.nu/download.html#/frontends>`_, your calendars and address books will be automatically discovered when you login in Thunderbird. This plug in can also propagate specific extensions and default user settings among your site. However, be aware that in order to use the SOGo Integrator plug in, you will need to repackage it with specific modifications. Please refer to the `documentation published online <http://sogo.nu/downloads/documentation.html>`_.

If you only use the SOGo Connector plug in, you can still easily access your data.

* To access your personal address book:
* Choose Go > Address Book.
* Choose File > New > Remote Address Book.
* Enter a significant name for your calendar in the Name field.
* Type the following URL in the URL field: http://localhost/SOGo/dav/jdoe/Contacts/personal/
* Click on OK.

To access your personal calendar:

* Choose Go > Calendar.
* Choose Calendar > New Calendar.
* Select On the Network and click on Continue.
* Select CalDAV.
* Type the following URL in the URL field: http://localhost/SOGo/dav/jdoe/Calendar/personal/
* Click on Continue.

Outlook
-------

You can use it with

* IMAP + commercial plugin as `cfos <https://www.cfos.de/en/cfos-outlook-dav/cfos-outlook-dav.htm?__ntrack_pv=1>`_ or `outlookdav <http://www.outlookdav.com/>`_ for calendars/contacts
* ActiveSync since Outlook 2013

There is no support for Openchange/OutlookMAPI.
