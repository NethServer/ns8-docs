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
services, too. Supported LDAP schema are

* Active Directory - `Samba <https://www.samba.org/>`_
* Unix attributes `RFC2307 <https://www.rfc-editor.org/rfc/rfc2307>`_ - `OpenLDAP <https://www.openldap.org/>`_

Besides choosing to bind an external provider or install a internal one, the
administrator has to decide which backend type suits his needs.
The *File server* (coming soon) application 
can authenticate SMB/CIFS clients only when using an Active Directory domain.
On the other hand, the internal OpenLDAP provider is more easy to install and
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
- ``Samba admin username`` and ``Samba admin password``: admin credentials
- ``IP address``: select an available network controller; choose a physical network interface if you are going to join machines to
  the Active Directory, otherwise you can select the VPN interface ``wg0``
- ``Hostname``: the Domain Controller (DC) host name. If unsure, keep the proposed value.

.. note::

    The Active Directory :guilabel:`Domain name` and  :guilabel:`NetBIOS
    domain name` values cannot be changed once that the domain has been created

At the end, you will see a new user domain with one connected provider.
You can now :ref:`manage users and groups <user_groups-section>`, :ref:`add a replica <provider_replica-section>`
or copy the :ref:`bind settings <domain_bind-section>` to connect an external application.

DNS and AD domain
-----------------

An Active Directory domain requires a reserved DNS domain to work. It is a good
choice to allocate a sub-domain of the public DNS domain for it. The AD sub-domain
can be accessible only from LAN networks.

Example:

* public (*external*) domain: ``nethserver.org``
* server FQDN: ``mail.nethserver.org``
* Active Directory (*internal* LAN only) domain: ``ad.nethserver.org``
* domain controller FQDN: ``dc.ad.nethserver.org``

.. tip::

    When choosing a domain for Active Directory use an *internal* domain which
    is a sub-domain of the *external* domain [#MsDnsBestPratices]_

.. [#MsDnsBestPratices] https://social.technet.microsoft.com/wiki/contents/articles/34981.active-directory-best-practices-for-internal-domain-and-network-names.aspx#Recommendation

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

At the end, you will see a new user domain with one connected provider.
You can now :ref:`manage users and groups <user_groups-section>` or :ref:`add a replica <provider_replica-section>`.

.. note:: OpenLDAP provider is not currently accessible from outside the cluster.

.. _provider_replica-section:

Provider replicas
=================

Provider replicas implement the fault tolerance for user domains.
To achieve real fault tolerance, replicas should be installed on different nodes.

You can add a replica from the ``Domains and users`` page by selecting the ``Configuration`` link from the three-dots menu.
Then click the :guilabel:`Add provider` button, select the target node and proceed with installation.

Replicas are configured in master-master mode.

.. warning:: Active Directory provider do not replicate SysVol volume.
   Therefore Microsoft's Group Policy Object (GPO) will not be synchronized between replicas.

.. _domain_bind-section:

LDAP bind settings
==================

.. note:: External applications can connect only to a local Active Directory provider. 

Binding is the process where the LDAP server authenticates the client and, if the client is successfully authenticated, 
the server allows the client access.

Many applications may require to be bound to an existing NethServer 8 user domain.
Bind settings can be accessed by selecting the ``Configuration`` link from the three-dots menu: user domain
details are displayed on the top of the page.

.. _ldap_proxy-section:

External LDAP server
====================

You can connect the NethServer 8 cluster to an existing LDAP server:

* access the ``Domains and users`` page
* click on :guilabel:`Create domain` button and choose ``External``
* fill all required fields
* click on :guilabel:`Configure domain` button

At the end, you will be able to bind locally installed applications with the external LDAP server.

.. _user_groups-section:

User and groups
===============

You can mange user and groups of a domain by clicking on ``User and groups`` link from the ``Domains and users`` page.

If an external user domain was configured, the page shows read-only lists.
Changes to the user base must be done on the original server.

On the other hand, if a local AD or LDAP account provider was installed, the page
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
