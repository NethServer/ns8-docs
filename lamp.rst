.. _lamp-section:

====
Lamp
====

Lamp is a containerized environment that encapsulates the Lamp stack, which includes 
Linux (Ubuntu), Apache (web server), MariaDB (database), and PHP (scripting language). 
This container allows for easy deployment and management of web applications, providing 
consistency, portability, and isolation across different environments.

Installation
============

The application can be installed from the :ref:`software_center-section`.

Configuration
=============

After installation, access the application settings page to configure your Lamp instance.

Main settings
-------------

.. note::

   DNS must be configured with your DNS provider to point to your server for both the FQDN and Let's Encrypt certificate to work properly.

The following settings are available during configuration:

* **Fully Qualified Domain Name (FQDN)**: set the domain name for your web application, for example, ``webapp1.example.org``
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

The Lamp stack provides a ``/app`` directory as the storage location for your web application files.

To access the application directory and deploy your files:

1. Connect to the server via SSH
2. Use the following command to access the Apache container::

     runagent -m lamp1 podman exec -ti apache2-app bash

   Replace ``lamp1`` with your actual module instance name.

3. Place your web application files in the working directory
4. The files will be automatically served through the FQDN configured in the web interface

Install your PHP source code
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can download your web application files using one of the following methods:

**Git**

Clone a Git repository to download your application code::

  git clone http://github.com/url/of/project

**Wget**

Download files using wget, a command-line tool for downloading files from the web::

  wget http://your-url

**Rsync**

Use rsync to synchronize files from a remote server::

  rsync -avz user@hostname:/path .

**SFTP**

Open an interactive SFTP session to transfer files securely::

  sftp user@hostname

**FTP**

Use standard FTP protocol for file transfer::

  ftp hostname

**FTP-SSL**

Use FTP with SSL/TLS encryption for secure file transfer::

  ftp-ssl hostname

.. warning::

   After deploying your web application, delete the default ``phpinfo.php`` file 
   to avoid exposing sensitive information about your server configuration.

Database management
-------------------

PhpMyAdmin is included and accessible through your domain at the ``/phpmyadmin`` path 
(e.g., ``https://webapp1.example.org/phpmyadmin``).

Default credentials:

* Username: ``admin``
* Password: the MySQL admin password set during configuration

.. warning::

   Change the default PhpMyAdmin access credentials immediately after first login
   for security purposes.

Advanced configuration
======================

Scheduled tasks
---------------

You can configure cron jobs for your Lamp instance using::

  runagent -m lamp1 apache2-app crontab -e

Example cron job to run a daily backup at 2:00 AM::

  0 2 * * * /path/to/backup-script.sh

To verify configured cron jobs::

  podman exec -ti apache2-app crontab -l
