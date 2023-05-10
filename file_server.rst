.. _file-server-section:

===========
File server
===========

The ``File server`` application is built with `Samba
<http://www.samba.org>`_. It provides shared folders and home directories to
users and groups of an Active Directory domain.

This application is available by installing a Samba account provider (see
:ref:`active_directory-section`) with the ``Provide file shares and
authentication to Windows clients`` switch enabled.

Shared folders
==============

Open Samba application from the app drawer, select ``Shared folders`` from
the left menu and click on :guilabel:`Create shared folder`.

The following parameters are required to create the new shared folder:

- ``Name``: the name of the shared folder

- ``Description``: free text, displayed to SMB clients as the "share comment"

- ``Main group``: select a domain group to assign initial permissions to the share

- ``Initial permissions``: pick one of the three available choices. Note
  that in any case the ``Domain Admins`` group is initially 
  granted full privileges.

  1. Main group can read and write, everyone else can read

  2. Main group can read and write, everyone else has no access

  3. Everyone can read and write, main group included

.. note::

    To access the shared folder it is necessary to provide valid domain
    credentials. Anonymous or guest access is not allowed for security
    reasons [#anon]_\ .

Once created, from the three-dots menu, the following actions are available on the
shared folder:

- ``Edit description``: change the share descriptive text

- ``Set permissions``: remove any existing ACLs and recursively grant new
  initial ACLs

- ``Delete``: remove the shared folder and its contents

The :guilabel:`Show ACLs` button displays the filesystem ACLs applied to
the shared folder root directory. It is possible to edit ACLs with a SMB
client, like the Windows Explorer application installed with Windows Pro
flavours, or the ``smbcacls`` command provided by the Samba project.

.. rubric:: Footnotes

.. [#anon] *Guest access in SMB2 and SMB3 disabled by default in Windows*
    `link to learn.microsoft.com
    <https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/guest-access-in-smb2-is-disabled-by-default>`_