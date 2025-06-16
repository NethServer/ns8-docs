.. _dependencytrack-section:

================
Dependency-Track
================

Dependency-Track is an intelligent Component Analysis platform that allows organizations to identify and reduce risk in the software supply chain

This application installs the `Dependency-Track <https://dependencytrack.org/>`_ server with
`Trivy <https://docs.dependencytrack.org/datasources/trivy/>`_ as the vulnerability data source.
It provides a web interface to manage components, vulnerabilities, and policies.

You can install multiple dependencytrack instances on the same node from the :ref:`software_center-section`.

Configuration
=============

How to configure:

1. Access the application ``Settings`` page and enter the FQDN for Dependency-Track, eg. ``sub.domain.com``
2. Enable ``Request LE Certificate`` option accordingly to your needs
3. Click the :guilabel:`Save` button

Default credentials of Dependency-Track are:

* user: ``admin``
* password: ``admin``

You can change them after the first login.

You can access the application at ``https://<FQDN>`` set in the settings.

Trivy security scanner
======================
To enable the Trivy security scanner, follow these steps:

1. Go to the Dependency-Track web interface.
2. Navigate to the :guilabel:`Administration` section.
3. Click on :guilabel:`Analysers`.
4. Click on :guilabel:`Trivy`.
5. Configure the Trivy data source settings as needed. with the following options:

* **Base URL**: ``http://127.0.0.1:8282``.
* **API Token**: You can retrieve the Trivy Token under the advanced section of the Settings page.

6. Click on :guilabel:`Save` to apply the changes.
