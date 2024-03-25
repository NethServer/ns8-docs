.. _user-domains-section:

============
User domains
============

Users and groups are stored in an LDAP database, served by one **account
provider module**. Multiple modules can work together to serve the same
LDAP database as replicas. An LDAP database represents an account
**domain**.

The NS8 cluster can host multiple local account domains from different
implementations. It is possible to configure and connect external LDAP
services, too. Supported LDAP schemas are

* Active Directory - `Samba <https://www.samba.org/>`_
* Unix attributes `RFC2307 <https://www.rfc-editor.org/rfc/rfc2307>`_ - `OpenLDAP <https://www.openldap.org/>`_

Besides choosing to bind an external provider or install an internal one, the
administrator has to decide which backend type suits his needs.
The *File server* application 
can authenticate SMB/CIFS clients only when using an Active Directory domain.
On the other hand, the internal OpenLDAP provider is easier to install and
configure.
In the end, if the SMB file sharing protocol support is not required, an
LDAP provider is the best choice.

Also note that you can host multiple OpenLDAP instances on the same node,
while you can install only one Samba instance per node.

.. _active_directory-section:

Active Directory
================

To install a new user domain with a local Samba Active Directory as provider:

* access the ``Domains and users`` page
* click on :guilabel:`Create domain` button and choose ``Internal``
* select ``Samba`` on the dialog box and click :guilabel:`Install provider`

Once the provider is installed, you will be asked to enter the following parameters:

- ``Domain``: the user domain, it should be a valid FQDN. It defines the DNS suffix of the new domain.
  The Domain Controller (DC) acts as an authoritative DNS server for that domain. If unsure, keep the proposed value.

- ``NetBIOS domain``: a valid `NetBIOS <https://en.wikipedia.org/wiki/NetBIOS>`_ domain (also known as "domain short name", "NT
  domain name"), it is the alternative Active Directory domain identifier, compatible
  with older clients.  Maximum length is 15 ASCII characters. If unsure, keep the proposed value.

- ``Samba admin username`` and ``Samba admin password``: set the initial
  administrative account credentials; it is possible to use
  ``administrator`` (default) or any other user name.  In the latter case,
  the given user name is added to the ``Domain Admins`` group, whilst
  ``administrator`` user is disabled and a random password is set on it

- ``Hostname``: the Domain Controller (DC) hostname. If unsure, keep the proposed value.

- ``Provide file shares and authentication to Windows clients``. If
  enabled the DC shared folders are accessible from the local network.
  Only one DC of the Active Directory domain can offer shared folders,
  authentication and DNS services. See :ref:`File server
  <file-server-section>` for more information.

.. note::

    Apart from the administrative credentials, other Active Directory
    parameters cannot be changed once that the domain has been created

At the end, you will see a new user domain with one connected provider.
You can now :ref:`manage users and groups <user_groups-section>`, :ref:`add a replica <provider_replica-section>`
or copy the :ref:`bind settings <domain_bind-section>` to connect an external application.

DNS and AD domain
-----------------

An Active Directory domain requires a reserved DNS domain to work. It is a good
choice to allocate a sub-domain of the public DNS domain for it. The AD sub-domain
can be accessed only from local networks.

Example:

* public (*external*) domain: ``nethserver.org``
* server FQDN: ``mail.nethserver.org``
* Active Directory (*internal* LAN only) domain: ``ad.nethserver.org``
* domain controller FQDN: ``dc1.ad.nethserver.org``

.. tip::

    When choosing a domain for Active Directory use an *internal* domain which
    is a sub-domain of the *external* domain [#MsDnsBestPratices]_

.. [#MsDnsBestPratices] https://social.technet.microsoft.com/wiki/contents/articles/34981.active-directory-best-practices-for-internal-domain-and-network-names.aspx#Recommendation

Furthermore, the AD Windows clients must be configured to use the domain
controller as their DNS server for network name resolution. Set the IP
address of DC ``dc1.ad.nethserver.org`` in client DNS configuration.

The domain controller inherits the node DNS settings in
``/etc/resolv.conf`` for name resolution request forwarding.

.. _openldap-section:

LDAP server RFC2307
===================

To install a new user domain with a local OpenLDAP as provider:

* access the ``Domains and users`` page
* click on :guilabel:`Create domain` button and choose ``Internal``
* select ``OpenLDAP`` on the dialog box and click :guilabel:`Install provider`

Once the provider is installed, you will be asked to enter the following parameters:

- ``Domain``: the user domain, it should be a valid FQDN. If unsure, keep the proposed value.
- ``OpenLDAP admin username`` and ``OpenLDAP admin password``: admin credentials

Finally, you will see a new user domain with one connected provider.
You can now :ref:`manage users and groups <user_groups-section>` or :ref:`add a replica <provider_replica-section>`.

.. note:: OpenLDAP provider is not currently accessible from outside the cluster.

.. _provider_replica-section:

Provider replicas
=================

Provider replicas implement fault tolerance for user domains.
To achieve real fault tolerance, replicas should be installed on different nodes.

You can add a replica from the ``Domains and users`` page by selecting the ``Configuration`` link from the three-dots menu.
Then click the :guilabel:`Add provider` button, select the target node and proceed with the installation.

Replicas are configured in master-master mode.

.. warning:: Active Directory provider does not replicate the SysVol volume.
   Therefore Microsoft's Group Policy Object (GPO) will not be synchronized between replicas.

.. _domain_bind-section:

LDAP bind settings
==================

.. note:: External applications can connect only to a local Active Directory provider. 

Binding is the process where the LDAP server authenticates the client and, if the client is successfully authenticated, 
the server allows client access.

Many applications may require to be bound to an existing NethServer 8 user domain.
Bind settings can be accessed by selecting the ``Configuration`` link from the three-dots menu: user domain
details are displayed on the top of the page.

.. _ldap_proxy-section:

External LDAP server
====================

You can connect the NethServer 8 cluster to an existing LDAP server.

1. Access the ``Domains and users`` page.

2. Click on :guilabel:`Create domain` button and choose ``External``.

3. Fill all required fields. Bear in mind that apart from "Host" and
   "Port", the domain settings cannot be changed later:

   - ``Domain``: This should be in fully qualified domain name (FQDN)
     syntax, but it can be any logical name matching the LDAP base DN
     structure. For example, if your LDAP base DN is `dc=example,dc=org`,
     a suitable domain name would be "example.org".

   - ``Host``: Enter the IP address or hostname of the LDAP server.

   - ``Port``: Specify the TCP port number of the remote LDAP service.
     Standard values are 389 for LDAP and 636 for LDAPS. However, with
     Active Directory, certain applications like Mail [#admail]_ may
     require setting LDAP port 3268 or LDAPS port 3269. This is because
     they do not support "LDAP subordinate referrals".

   - ``Bind DN`` and ``Password``: Credentials required to access the
     remote LDAP server.

   - ``Base DN``: Define the level of the LDAP hierarchy to use as the
     base for user and group lookup. Leaving this field empty retrieves
     the correct value from the LDAP server itself.

   - ``TLS``: Enable this switch to encrypt the connection with TLS. If
     the server does not support TLS on the specified port, an error will
     occur.

   - ``TLS verify``: Enable this switch to ensure that the LDAP server
     provides a valid TLS certificate signed by a trusted authority, with
     the certificate name matching the hostname specified in the "Host"
     field. Continue reading to fully understand the implications of this
     option.

4. Once all fields are filled, click on the :guilabel:`Configure domain`
   button.

.. warning::

    Once configured, domain settings cannot be changed later!

If you choose not to verify TLS, you can configure additional hosts as
backup providers. The first configured provider is considered the primary
LDAP backend server. If a cluster node cannot reach it, it switches to
another provider. It's crucial that all domain providers are accessible
from any cluster node.

Enabling "TLS verify" adds extra security but has limitations: only the
first provider is considered. If it becomes unreachable, connection
recovery is not possible.

Ensure each provider is accessible from all cluster nodes for seamless
operation.

.. [#admail] https://doc.dovecot.org/configuration_manual/authentication/ldap/#active-directory

.. _password-policy-section:

Password policy
===============

The password policy is a set of rules that defines the password complexity and the password expiration time. You can configure the password policy from the ``Domains and users`` page by selecting the interested domain and clicking :guilabel:`Edit password policy` from the three-dots menu of the ``Password`` card.

You can configure password age and password strength policy separately.

Password age
------------

You can toggle password age policy by clicking on the ``Password age`` switch. If enabled, you can configure the following parameters:

* ``Minimum password age``: the minimum number of days that must pass before a new password change.
* ``Maximum password age``: password expiration time in days. After this period, the password is no longer valid for logins and must be changed. Users can change their expired password with :ref:`user-management-portal-section`.

Password strength
-----------------

By enabling the ``Password strength`` switch, you can configure the following parameters:

* ``Password history length``: the number of old passwords that cannot be reused.
* ``Minimum password length``: the minimum number of characters that a password must have.
* ``Enforce password complexity``: enforce use of complex password, see note for more details.

.. note:: A password is considered complex if it is long enough and meets three of the following rules:

    * The password must contain at least one uppercase letter.
    * The password must contain at least one lowercase letter.
    * The password must contain at least one digit.
    * The password must contain at least one special character.

After editing the password policy, you can click on :guilabel:`Edit password policy` button to save the changes. Strength setting changes do not affect old passwords: they are valid from now on. Age setting changes are retroactive and are applied to already set passwords, too.

.. _user_groups-section:

User and groups
===============

You can manage users and groups of a domain by clicking on ``User and groups`` link from the ``Domains and users`` page.

If an external user domain has been configured, the page shows read-only lists.
Changes to the user base must be done on the external server.

On the other hand, if a local AD or LDAP account provider has been installed, the page
allows to create, modify and delete users and groups.

When creating a user, the following fields are mandatory:

* User name
* Full name (name and surname)
* Password

A user can be added to one or more groups.

Sometimes you need to block user access to services without deleting the
account. The safest approach is:

1. (optionally) change the user's password with a random one
2. disable the user using the ``Disable`` action from the three-dots menu

When a user is deleted, user data will not be removed.

.. _user-management-portal-section:

User Management portal
======================

The user management portal is a web application that allows any non-administrator user to change their own password without the need for administrator intervention.

The portal is automatically configured on every instance of :ref:`active_directory-section` or :ref:`openldap-section` provider.

The portal is available at the following URL: ::

    https://<fqdn_node>/users-admin/<domain_name>/

Where ``<fqdn_node>`` is the FQDN of the node where the provider is and ``<domain_name>`` is the name of the domain provided while configuring the domain.

.. warning:: Without the trailing slash, the portal will not work.

Once reached the page, the user is prompted for login and they can authenticate to the domain with user name and password.

If the login is successful, the user is directed to the ``User Management`` page, where they can proceed to change the password. The password must comply with the domain password policy during this process.
The list of applications where the new password is effective is displayed next to the password changing form.
