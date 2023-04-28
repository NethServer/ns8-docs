========
CrowdSec
========

`CrowdSec <https://www.crowdsec.net/>`_ is a malicious activity detection tool.
It looks for known patterns, like malicious login attempts, inside the applications logs
and blocks the attacker IP address.

You can install only one CrowdSec instance for each node.
 

Configuration
=============

Once installed, CrowdSec is already fully functional and protect many NS8 applications.

To get a list of protected applications, access the server using SSH and type:

::

  cscli bouncer list
 
From the web interface you can configure:

* mail notification by adding one address per line inside ``Email notifications`` field:
  notifications will work only if :ref:`smarthost-section` has been configured

* IP and network which will never be blocked

* dynamic and static ban time

As default, CrowdSec will send some telemetry to remote CrowdSec-owned servers.
The servers use such data to compose a community blocklist which is sent back to your installation.
If you do not want to share such data and disable the community blocklist, you can do it by
enabling the ``Disable central API`` option under the ``Advanced`` section.

You can also connect your instance to `CrowdSec console <https://app.crowdsec.net>`_
by filling the ``Enroll the CrowdSec instance`` field.
