.. _netdata-section:

=======
Netdata
=======

This application installs and configures a Netdata Agent [#NDA]_ instance
on the chosen NethServer 8 cluster node.

A Netdata Agent collects and displays local system metrics in a web
user interface. Although it can be part of broad deployments, the provided
configuration is tailored for the local system only, aiming to assist in the
analysis of basic resource usage of the node (CPU, RAM, disks, network...)
and is not intended for monitoring specific applications or integration with
Netdata Cloud.

Configuration
=============

After installation, the application does not require any special
configuration. To access the Netdata web interface, navigate to the Status
page and follow the ``Application URL`` link.

The random URL path component is generated at installation time and never
changes. It can also be obtained from the cluster Settings page, under the
"HTTP routes" section, by searching for ``netdata``.

.. warning::

    The web interface has no authentication. While it does not contain any
    inherently sensitive information, be sure to keep the random URL path
    secret.

Metrics Storage
===============

The Netdata Agent configuration is derived from the stock Netdata official
Docker image. It has three tiers of storage with different metrics
resolution and retention policies: second, minute, hour. 

.. csv-table:: Retention policy per storage tier
   :header: "Tier", "Resolution", "Retention period", "Disk retention"

    "Tier 0", "1 second", "3 hours",  "268 MB"
    "Tier 1", "1 minute", "infinite", "268 MB"
    "Tier 2", "1 hour",   "infinite", "67 MB"

The stock configuration provides 3 hours of fine-grained metrics with one
second resolution. The minute-level tier should be sufficient to cover one day
of recordings, while the hour-level should cover a time range of weeks.
Actual retention may vary depending on system activity or the specific metrics
being collected.

.. rubric:: Footnotes

.. [#NDA] https://learn.netdata.cloud/docs/netdata-agent/
