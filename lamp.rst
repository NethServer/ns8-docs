.. _lamp-section:

====
LAMP
====

NS8-LAMP is a containerized environment that encapsulates the LAMP stack, which includes 
Linux (Ubuntu), Apache (web server), MariaDB (database), and PHP (scripting language). 
This container allows for easy deployment and management of web applications, providing 
consistency, portability, and isolation across different environments.

Installation
============

The application can be installed from the :ref:`software_center-section`.

Configuration
=============

After installation, access the application settings page to configure your LAMP instance.

Main settings
-------------

The following settings are available during configuration:

* **Fully Qualified Domain Name (FQDN)**: set the domain name for your web application
* **HTTP to HTTPS**: enable automatic redirection from HTTP to HTTPS
* **Request Let's Encrypt certificate**: automatically obtain and configure a free SSL certificate
* **MySQL Configuration**:

  * **MySQL Admin Password**: password for the MySQL root user to manage all databases
  * **Create Database and User**: optionally create a database with a dedicated user during setup
  
    * **Database Name**: name of the database to create
    * **Database User**: username for database access
    * **Database User Password**: password for the database user

* **PHP Configuration**:

  * **PHP Version**: select the PHP version to use (customizable to match your application requirements)
  * **PHP Upload Max Filesize**: maximum allowed size for file uploads in megabytes (default: 100)
  * **PHP Memory Limit**: maximum amount of memory a PHP script can consume in megabytes
  * **PHP Max Execution Time Limit**: maximum time in seconds a PHP script is allowed to run before being terminated

After configuring these settings, click :guilabel:`Save` to apply the changes.

Usage
=====

Application deployment
----------------------

The LAMP stack provides a ``/app`` directory as the storage location for your web application files.

To access the application directory and deploy your files:

1. Connect to the server via SSH
2. Use the following command to access the Apache container::

     runagent -m lamp1 podman exec -ti apache2-app bash

   Replace ``lamp1`` with your actual module instance name.

3. Navigate to the ``/app`` directory and place your web application files there
4. The files will be automatically served through the FQDN configured in the web interface

.. warning::

   After deploying your web application, delete the default ``phpinfo.php`` file 
   in the ``/app`` folder to avoid exposing sensitive information about your server configuration.

Database management
-------------------

PhpMyAdmin is included and accessible through your domain at the ``/phpmyadmin`` path 
(e.g., ``https://yourdomain.com/phpmyadmin``).

Default credentials:

* Username: ``admin``
* Password: the MySQL admin password set during configuration

.. warning::

   Change the default PhpMyAdmin access credentials immediately after first login
   for security purposes.

Advanced configuration
======================

Environment access
------------------

To debug a container or view its environment variables::

  runagent -m lamp1

Replace ``lamp1`` with your actual module instance name.

Scheduled tasks
---------------

You can configure cron jobs for your LAMP instance using::

  runagent -m lamp1 apache2-app crontab -e

Example cron job to run a daily backup at 2:00 AM::

  0 2 * * * /path/to/backup-script.sh

To verify configured cron jobs::

  podman exec -ti apache2-app crontab -l
