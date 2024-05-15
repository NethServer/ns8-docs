.. _smarthost-section:

.. _email-notifications:

===================
Email notifications
===================

Many applications, such as Nextcloud and Mattermost, require SMTP server
configuration to send notification messages to users and service
administrators.

You can configure the same SMTP server for all installed applications by
accessing the ``Email notifications`` card inside the ``Settings`` page.

To enable the feature, click on ``Send notifications with an SMTP
server`` and fill the required details.

If a Mail application instance is already installed in the cluster, choose
the ``Use Mail app instance`` option. Then refer to the section
:ref:`relay-rules-section` for further information about the configuration
of Mail.

Instead, choose ``Manual configuration`` to specify SMTP server parameters
in this form. Available fields are:

- **SMTP server**: The host name or IP address of the SMTP server

- **SMTP port number**: TCP port number of the server. Common values are
  587, 25, 465, 2525.

- **SMTP encryption**: Encryption used by the server. TLS is a widely used
  encryption protocol that encrypts a connection from the moment it is
  established. STARTTLS is the standard encryption method for SMTP. If
  both the client and server support it, the connection is encrypted after
  both sides agree to use it.

- **Verify the TLS certificate**: If encryption is used, this switch
  controls if the certificate used to encrypt the connection must be
  signed by a trusted authority or not. If the server presents a
  self-signed certificate, turn off this switch to accept it.

- **Username** and **Password**: If the server requires SMTP
  authentication, fill the credential fields; otherwise leave them blank.

After saving the settings, a SMTP connection to validate the form
parameters is immediately started. In some cases, validation is
successful, but messages may still fail to be delivered. It is recommended
to check that individual applications can successfully send messages with
the new settings.
