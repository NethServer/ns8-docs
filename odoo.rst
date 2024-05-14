
.. _odoo-section:

====
Odoo
====

Odoo is suite of business management software that includes customer
relationship management, e-commerce, billing, accounting, manufacturing,
warehouse, project management, and inventory management (source `Wikipedia`_).

This application integrates Odoo within NS8 and is developed, maintained
and supported by `Innovyou`_, an Italian IT company.

.. _Wikipedia: https://en.wikipedia.org/wiki/Odoo

.. _Innovyou: https://www.innovyou.it

Configuration
=============

Under the Settings page, fill the Odoo FQDN field with the DNS name
assigned to this Odoo instance. If you want to request a Let's Encrypt TLS
certificate, ensure the FQDN is recorded in the public DNS before
proceeding.

Odoo can be bound to an existing user domain. Users of the domain can log
on to this Odoo instance with the same credentials of other applications
in the same domain: choose the domain from the LDAP domain selector.

.. warning::

    The LDAP domain can be chosen only the first time. Once the
    :guilabel:`Save` button is pressed, the LDAP domain selection is
    disabled.

Once the application is configured for the first time, proceed to the
login page.

From the login screen, it will be possible to:

* Access Odoo.
* Manage databases.

.. warning::

  Change immediately the default passwod of ``admin`` user and the default
  DB master password, as explained in the next sections.

Access to Odoo
--------------

To perform the first login, simply use the following credentials:

* Username: ``admin``
* Password: ``admin``

After the first login, it is strongly recommended to change the Odoo
password by following these steps:

1. Click on "Administrator" in the top right corner, then on "Preferences".

2. Set your own email address.

3. Open the "Account Security" tab, click on "Change password", enter the
   current password.

4. Enter and confirm the new password.

The session will be closed, and you will need to log in again.


Database management
-------------------

From the login screen, it will be possible to manage databases by clicking
on the "Database Management" link.

The currently set master password is: ``adminmaster``.

The first step for the application's security will be to change the master
password by following these steps:

1. Click on "Set Master Password".
2. Write the current password and then the new password.
3. Click on "Continue".

Once the new Master Password is set, it will be possible to:

1. Perform a database backup.
2. Duplicate the database.
3. Create a new database.
4. Delete the database.

Note: The master password will always be necessary for the activities
listed below.

Database Backup
^^^^^^^^^^^^^^^

To perform a database backup, simply follow these steps:

1. Click on "Backup".
2. Enter the Master Password.
3. Click on Backup.

The database will be downloaded locally and can be used for restoration or
as a basis for creating a parallel production database.

Duplicate the database
^^^^^^^^^^^^^^^^^^^^^^

To create a copy of the production database, simply follow these steps:

1. Click on "Duplicate".
2. Enter the Master Password.
3. Enter the name of the new Database.
4. Check "Neutralize," which disables cron jobs and prevents the system
   from sending automatic notifications.
5. Click on Continue.

The new database will be displayed below the existing one.

Create a new database
^^^^^^^^^^^^^^^^^^^^^

To create a new database, simply follow these steps:

1. Click on "Create Database".
2. Enter the Master Password.
3. Enter the name of the new Database.
4. Enter Email and Password.
5. Select the language.

Note: The newly created database will be completely empty and devoid of
any configuration, module, or application.

Delete the database
^^^^^^^^^^^^^^^^^^^

To delete a database, simply follow these steps:

1. Click on "Delete".
2. Enter the Master Password.
3. Click on Delete.


Installation image
==================

The installation image was created by Innovyou for the following reasons:

1. The image contains Odoo core modules, OCA modules, and proprietary
   modules.

2. The official Odoo image is not versioned beyond V16; its content is
   overwritten periodically. This would prevent us from knowing for sure
   which code is being used in that particular installation and
   consequently would not allow us to provide proper support or debugging.

To request the source code and for information or support, you can visit
the page https://www.innovyou.it/supporto-odoo-nethserver/.

Updates and support
===================

* Application version 1.0.0 corresponds to Odoo Community version 16.0,
  end of support November 2025.

Updates for Odoo on NethServer 8 are manual.

For any support request, you can contact us through the page
https://www.innovyou.it/supporto-odoo-nethserver/.

Licenses
========

Nethserver 8 application has a GPL-3 license, Odoo Core modules have an
LGPL license.

OCA modules may have an AGPL or LGPL license. To view the license of each
module, you can do so by following the steps below:

1. Go to the "Applications" module.
2. Locate the application of interest and click on the three dots in the
   upper right corner.
3. Click on "module info" to access the desired information.


