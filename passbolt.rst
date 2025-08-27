.. _passbolt-section:

========
Passbolt
========

Passbolt_ is an open source credential platform for modern teams.

.. _Passbolt: https://www.passbolt.com/

Configuration
=============

Once installed, navigate to the application Settings page and fill in the
required fields:

- **Passbolt FQDN**: Enter the fully-qualified domain name where the Passbolt
  web UI will be accessible. If the FQDN is already registered in the
  public DNS, you can enable the **Let's Encrypt certificate** switch to
  obtain a valid encryption certificate.

- **Admin mail address**: Enter the mail address of the Passbolt Admin. It's
  used for password recovery. For example, if the FQDN changes and you want to
  login to Passbolt, a recovery link mail is sent to the user. Follow that link
  to recover your account.

.. warning::

    If an incorrect FQDN is configured, there is no way to get the right Admin
    registration link anymore. The preferred way to recover from this situation is to
    remove the incorrect Passbolt instance, then install and configure a new
    one.

After first configuration, the Admin registration link is shown. Please follow 
the link to create the Admin account, set a password and save the Passbolt keys.

.. note::    
    Consider storing the Passbolt keys in a safe place to be able to restore your account if needed.

For managing Passbolt, please refer to the official `Documentation`_ 

.. _Documentation: https://www.passbolt.com/docs/

Known limitations
=================

1. After changing the app FQDN, the password needs to be recovered.
2. The NethServer app ships the Passbolt Community Edition (CE) which does not support LDAP authentication.
