---
title: RustFS
sidebar_position: 16
---
# RustFS

[RustFS](https://rustfs.com/) offers high-performance, S3 compatible object storage.

This NS8 application provides a basic single-node/single-disk RustFS installation that may fit small environments.

You can install multiple RustFS instances on the same node from the [Software center](../installation/software_center.md).

## Hardware requirements

Disk performance must match the workload, otherwise RustFS automated healthcheck marks the disk as failed. This means, for a single disk installation, that the service is offline until the application is restarted from NS8 Applications page.

Refer to RustFS official documentation for a [basic hardware checklist](https://docs.rustfs.com/installation/checklists/hardware-checklists.html).

## Configuration

Some S3 clients do not correctly support API endpoints exposed under a path prefix. For better compatibility, two distinct server names need to be assigned: one dedicated to the S3 protocol endpoint and another dedicated to the administrative console.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server. If you are planning to use a Let's Encrypt certificate as default, make also sure to have corresponding public DNS records.

How to configure:

1.  access the application configuration page and enter the `API server host name`: this will be the FQDN used by hosts to connect to S3 services, e.g. `s3.example.org`, `storage.example.org`
2.  fill the `Web interface host name`: you will be able to configure your RustFS instance from this FQDN, e.g. `rustfs.example.org`
3.  enable `Let's Encrypt` option accordingly to your needs
4.  fill the `rustfs root user name` and the `rustfs root password`: those are the login credentials
5.  click the **Save** button
6.  open the entered host name inside the browser, e.g. `https://rustfs.example.org`.
