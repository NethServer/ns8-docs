.. _webserver-section:

=========
WebServer
=========

This application installs the `Nginx <https://www.nginx.com/>`_ web server with
`PHP <https://www.php.net/>`_ programming language and `SFTPGo
<https://github.com/drakkan/sftpgo>`_ to upload files.

You can install multiple WebServer instances on the same node from the :ref:`software_center-section`.

Configuration
=============

How to configure:

1. access the application ``Settings`` page and enter the path for SFTPGo, eg. ``/sftpgo``
2. choose a public TCP port for the sFTP server 
3. enable ``HTTP to HTTPS`` option accordingly to your needs
4. Click the :guilabel:`Save` button

At the end of the configuration the web interface will display the public TCP port to access
the MariaDB instance.

The SFTPGo instance will be available at the ``https://<server_fqn>/<path>``.
Default credentials for ``Web Admin`` of SFTPGo are:

* user: ``admin``
* password: ``admin``

Please change them after the first login.

Virtual hosts
-------------

You can host multiple sites by creating a virtual host for each site inside the ``Virtual hosts`` page.
To create a virtual host click on :guilabel:`Create a virtual host` button.

A new SFTP user will be created for each virtual host.
Default user credentials will be displayed inside the virtual host card.

You can now use the SFTPGo web interface, or a sFTP client, to upload files to your virtual host.
