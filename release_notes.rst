=============
Release notes
=============

.. highlight:: text

NethServer 8 releases

- List of `known bugs <https://github.com/NethServer/dev/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Abug>`_
- Discussions around `possible bugs <http://community.nethserver.org/c/bug>`_

Major changes on 2023-09-13
===========================

Project milestone **Beta 2**

- **Pre-built image** -- Images are based on Rocky Linux. Available
  formats are ``.qcow2`` for QEMU/Proxmox and ``.vmdk`` for VMware. See
  :ref:`install_image-section` for image download links.

- **FQDN requirement** -- The cluster creation procedure now asks to
  review and set the current system host name. The host name is expected
  in short form (a single word, with no domain suffix). The procedure also
  fixes the ``/etc/hosts`` file by adding a record to properly resolve the
  fully qualified domain name of the system (FQDN). For example ::

    127.0.1.1 node1.example.org node1

  See also :ref:`dns-reqs`.

Major changes on 2023-05-10
===========================

Project milestone **Beta 1**

Main core features include:

- Node management: add and remove nodes from the system
- Centralized logging: collect all logs in one place for easy monitoring
- Configuration and data backups: regularly save cluster settings and application data to remote providers like Amazon S3 and Backblaze B2
- Authentication: support for both Active Directory and LDAP (RFC2307) user directories
- File server: implement an SMB (Server Message Block) file server that enables seamless integration with Windows-based networks
- Auditing: track changes made within the system to ensure security and accountability
- Email relay: use a smart host to route outgoing emails  through a trusted server
- Custom web routing: define custom URLs to handle specific requests
- Multi-factor authentication: enable two-step verification for administrator accounts
- Built-in firewall: protect against unauthorized access at the network level by implementing a local firewall
- Migration: :ref:`Cockpit module <migration-section>` to import NethServer 7 applications

Additional modules:

- Collaborative tools: includes Dovecot/Postfix/Rspamd mail server, WebTop, Roundcubemail, Nextcloud, Collabora Online, Dokuwiki, ejabberd, Mattermost
- Development utilities: features MariaDB and NGINX web server for creating dynamic applications and services
- Monitoring and analysis: offers Grafana, Prometheus, and node_exporter for tracking performance metrics and identifying potential issues
- Data storage: offers MinIO for managing large amounts of structured and unstructured data
- Network defense: implements CrowdSec for protecting local applications against remote attacks

The following known limitations will be resolved in future updates:

- currently, the system only uses TLS certificates issued by Let's Encrypt or self-signed certificates generated locally
- user login is not supported on worker nodes
- the mail module does not offer sender-based or destination-based message relay options
- only a limited number of cloud storage providers are available for backing up data

Releases glossary
=================

The software release cycle includes four stages: Alpha, Beta, Release Candidate (RC), and Stable.

During the **Alpha** stage, the software is not thoroughly tested and may not include all planned features.
This release is not suitable for production environments. However, it can be used to preview what's coming in the upcoming version.
Please note that updates from an Alpha release to other releases are not supported.

The **Beta** stage indicates that the software is mostly feature complete, but it may still contain many known and unknown bugs.
This release should not be used on production environments. However, it can be used to test the software before deploying it to production.
Updates from a Beta release to an RC or Stable release are supported but may require a manual procedure.

During the **Release Candidate (RC)** stage, the software is feature complete, and it contains no known bugs.
If no major issues arise, it can be promoted to Stable. Updates from an RC release to a Stable release are supported
and should be almost automatic.
However, if you're new to the software, it's best to use it in production only if you already have some experience with it.

The **Stable** release is the most reliable and safe to use in production environments.
It has been thoroughly tested and is considered to be free of major bugs.
