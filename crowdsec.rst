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
 
From the web interface you can configure:

* mail notification by adding one address per line inside ``Email notifications`` field:
  notifications will work only if :ref:`smarthost-section` has been configured

* IP and network which will never be blocked

* dynamic and static ban time

As default, CrowdSec will send some telemetry to remote CrowdSec-owned servers.
The servers use such data to compose a community blocklist which is sent back to your installation.
If you do not want to share such data and disable the community blocklist, you can do it by
disabling the ``Enable central API`` option under the ``Advanced`` section.

You can also connect your instance to `CrowdSec console <https://app.crowdsec.net>`_
by filling the ``Enroll the CrowdSec instance`` field.

* CrowdSec sends a daily notification email listing blocked IPs to the configured recipient. 
  To prevent mailbox flooding, you can set a notification threshold 
  (default: 100 blocked IPs per email, configurable between 1 and 500).

Community blocklist vs Community blocklist (Lite)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
CrowdSec provides a `community blocklist <https://docs.crowdsec.net/docs/next/central_api/community_blocklist>`_  that is shared among all users. To activate this feature, you need to:

- Enable the Central API option.
- Enroll your CrowdSec instance in the console.

To access the full community blocklist (beyond the Lite version), you must share at least some ban decisions with the Central API every 24 hours. 
If your server has few or no bans, it will be considered as a blocking state, preventing access to the complete blocklist.

Command-line interface
======================

The ``cscli`` command is a powerful command-line interface to access
advanced Crowdsec functions. To run ``cscli``, you have to enter the
application environment first. Type in a root shell the following command

::

  runagent -m crowdsec1 bash

Then the ``cscli`` command becomes available. For instance, print the help
message with

::

  cscli --help
