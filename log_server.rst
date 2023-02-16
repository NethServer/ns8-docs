.. _loki-section:

===========
System logs
===========

Almost everything is logged inside journalctl and sent to the local log server.

By default, `Grafana Loki <https://grafana.com/oss/loki/>`_ is installed inside the leader node, it collects the logs
from all cluster nodes.
A rootfull `Promtail <https://grafana.com/docs/loki/latest/clients/promtail/>`_ container runs on all nodes,
including the leader one. It sends all logs to the Loki server.

From the leader node, it is possible to query the logs of all nodes.

Logs are accessible from ``System logs`` page.
You can filter logs by date, a text query or context. Available contexts are:

* ``cluster``: all logs from any source
* ``node``: all logs from a given node
* ``app``: logs from a given application instance, regardless where it's currently running

You can see just a subset of the lines or follow the log to see what's happening in real time.

Sometimes is useful to compare the logs of two applications side-by-side.
You can do it by following these steps:

- setup the filter for a refined search
- click on :guilabel:`Add search` button
- setup the new filter
- select ``Vertical layout`` from the three-dots menu

Logs are now shown side-by-side to easily correlate events.

Command line
============

.. highlight:: bash

If you're familiar with the command line, recent logs are available using ``journalctl`` command
and services can be inspected using ``systemctl`` command.
As root use ``journalctl`` to see messages from agents, rootfull and rootless modules.

You can also use the ``api-server-logs`` to query directly the Loki server.
Example to inspect the log of `traefik1` module: ::

  api-server-logs logs -e module -n traefik1

You can also enable the automatic completion for the above command.
First, install the ``bash-completion`` package.

On RHEL-like distributions: ::

  dnf install bash-completion -y

On Debian distribution: ::

  apt-get install bash-completion -y

Then, generate the completion script: ::

  api-server-logs completion bash > /etc/bash_completion.d/api-server-logs.sh

Logout and login from the shell to enable the completion.
