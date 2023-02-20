=======
MariaDB
=======

This module installs `MariaDB <https://mariadb.org/>`_, a popular open source relational database,
and `phpMyAdmin <https://www.phpmyadmin.net/>`_ a tool to manage the database from a web interface.

You can install multiple MariaDB instances on the same node from the :ref:`software_center-section`.

Configuration
=============

How to configure:

1. access the application configuration page and enter the path for phpMyAdmin, eg. ``/phpmyadmin``
2. enable option accordingly to your needs
3. Click the :guilabel:`Save` button

At the end of the configuration the web interface will display the public TCP port to access
the MariaDB instance.

The phpMyAdmin instance will be available at the ``https://<server_fqn>/<path>``.
Default credentials for phpMyAdmin are:

* user: ``admin``
* password: ``admin``

Please change them after the first login.
