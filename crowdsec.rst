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

You can browse the collections and install new parsers and scenarios to protect the services of your server

::

  cscli collections list

to install a collection

::

  cscli collections install <collections>

to remove a collection

::

  cscli collections remove <collections>