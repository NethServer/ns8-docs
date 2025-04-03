.. _release-notes-section:

=============
Release notes
=============

NethServer 8 releases

- List of `known bugs`__ on GitHub

  __ https://github.com/NethServer/dev/issues?q=is%3Aissue%20is%3Aopen%20type%3Abug%20project%3ANethServer%2F8

- Discussions around `possible bugs`__ on our public forum

  __ http://community.nethserver.org/c/bug

Major changes on 2025-04-04
===========================

**Milestone 8.4**

- **Notify users of expiring passwords** -- Internal user domains with an
  enabled expiring password policy can now be configured to send email
  notifications to users approaching their password expiration date. See
  :ref:`password-warning`.

- **Modify external LDAP settings** -- Bind credentials and TLS settings
  of an external user domain can now be changed after domain creation. See
  :ref:`modify-external-ldap`.

- **Set up base home directory path for applications** -- The default
  application home directory base path is ``/home`` (per-distro default).
  It is now possible to specify and use a different base path, as documented
  in :ref:`disk-usage-section`, along with other techniques to expand
  available disk space.

- **Wildcard TLS certificate support** -- Wildcard certificates can be
  uploaded and distributed to cluster applications directly from the ``TLS
  certificates`` page. Refer to :ref:`certificate_manager-section` for
  more information. Mail, NethVoice, and NethVoice Proxy have been updated
  to support wildcard certificates. Support for Ejabberd is coming soon.

- **New TLS-ALPN-01 default ACME challenge format** -- Let's Encrypt TLS
  certificates are now obtained using the TLS-ALPN-01 challenge type through
  TCP port 443. Port 80 is no longer used by new installations of
  NethServer 8 core. Existing systems retain the previous HTTP-01 challenge
  type and still require port 80 to be open. It is possible to upgrade to
  the new default with the following command: ::

    api-cli run module/traefik1/set-acme-server --data '{"challenge":"TLS-ALPN-01","url":"https://acme-v02.api.letsencrypt.org/directory"}'

- **Traefik core module enhancements** -- The core Traefik instance,
  running on every cluster node, has been upgraded to Traefik version 3.
  The previous v2-compatible configuration is saved for reference under the
  Traefik "state/" directory in ``*.v2`` directories. These can be safely
  removed if desired.

  The Traefik restoration procedure has been fixed and no longer returns a
  conflicting Traefik instance. Instead, the backup contents are merged
  with the active Traefik instance on the node, allowing the restoration of
  custom HTTP routes and TLS certificates.

  Additionally, this release introduces two new advanced experimental
  features, accessible through API calls and manual configuration:

  1. Support for deploying NS8 behind a network HTTP L7 Proxy.
  2. Passing extra parameters to the Traefik container to configure custom
     CA certificates and DNS-01 challenges.

  Refer to available support channels for more information.

- **Per-IP access restrictions on HTTP routes** -- The ``HTTP routes``
  page now allows access restrictions for automatic and manually-created
  routes based on a list of IP addresses. Additionally, a ``cluster-admin``
  HTTP route entry is now displayed and can be used to restrict access to
  the Cluster Admin UI. Refer to the :ref:`traefik-section` for detailed
  information.

- **New Monitoring/Alarms stack** -- The Metrics core application,
  including a running Prometheus instance, is now part of the default core
  applications and is automatically installed on the leader node of existing
  clusters with a simple core update. Metrics can be easily integrated
  with other monitoring solutions and configured to send alert and
  resolution notifications. Read further details in :ref:`metrics-section`.

- **Migration tool enhancements** -- In addition to "Application
  conflict management," previously released, the NS7 migration tool now
  considers application instance conflicts, providing guidance to avoid
  misconfigurations during migration.

  Furthermore, for NethVoice migration, the NethVoice Proxy installation
  is now handled automatically by the migration tool.

- **Imapsync and Sieve filters** --  The Imapsync application can now be
  configured to execute the user's Sieve filter during "INBOX-only"
  synchronization. Additionally, it can be set to remove messages from the
  remote server after a specified number of days. See
  :ref:`imapsync-section` for more details. Recursive synchronization has
  also been optimized to reduce system load when handling multiple
  concurrent Imapsync tasks.

- **DNSMasq gateway option** -- The client gateway can now be set from the
  :ref:`DHCP section <dnsmasq-dhcp-section>` of DNSMasq. Additionally,
  selectable network interfaces are now limited to those with a private IP
  address to prevent configuration errors.

- **Webtop updates** -- Webtop has been updated to upstream release 5.27.3
  with the new Pecbridge component version 5.4.5. The memory limit has been
  raised to 4GB for better performance. This release also introduces
  automated TinyMCE Plugin Integration with an active subscription and
  enhanced contact sharing with the latest NethVoice application release.

- **Other application updates** -- Updated application versions:

  - Nextcloud 29 and Nextcloud 30
  - Collabora 24.04
  - Mattermost 10 ESR
  - Netdata 2
  - Crowdsec 1.6.4
  - Ejabberd 24.12



Major changes on 2024-12-20
===========================

**Milestone 8.3**

- **Selective restoration from backup** -- In the Mail and Samba File
  Server applications, it is possible to search and select specific
  content (IMAP folder, file, or directory) from backup snapshots and
  restore it under a user-accessible folder. See
  :ref:`selective-content-restore`.

- **Application conflict management** -- The Cluster Admin now enforces
  the instance limit per node during clone, move, and restore operations.
  This complements the existing enforcement during the install operation
  and simplifies the management of applications that use specific TCP/UDP
  ports, such as Mail, Ejabberd, NethVoice Proxy, Samba, and DNSMasq.
  Additionally, DNSMasq automatically disables its DNS service if it
  detects a conflict with a Samba instance on the same node.

- **System log forward filtering** -- The Syslog forwarder can be
  configured to send either the full stream of logs or only security log
  records. For performance reasons, the full stream export is no longer
  available in the Cloud Log Manager forwarder, which now supports
  security logs only.

- **Backup alert** -- Systems with an active :ref:`Subscription
  <subscription-section>` send an alert to the monitoring portal if a
  backup fails. The last backup status indicator has been fixed to
  correctly reflect failed backup instances on the Backup page.

- **Rename OpenLDAP "directory.nh" for NS7 migration** -- The NS7
  Migration Tool allows selecting the destination domain name (and the
  respective LDAP DB suffix), enabling the migration and consolidation of
  multiple NS7 systems on the same NS8 cluster. The LDAP domain name can
  only be set with a local OpenLDAP account provider, as Active Directory
  does not support domain renaming. See :ref:`migrate-account-provider`.

- **Updates are suspended during NS7 migration** -- The Software Center
  inhibits both manual and automatic updates if an NS7 node is added to
  the cluster with the Migration Tool. If updates are suspended, a banner
  is displayed in the Software Center.

  If your cluster displays this banner incorrectly (e.g., the migration
  has already finished), run the following manual procedure to clean up
  the Redis database of possible stale data from past migration attempts.

  Find the IDs of stale NS7 nodes: ::

    redis-cli --raw keys 'node/*/flags' | xargs -t -r -l1 -- redis-cli smembers
  
  Sample output: ::

    redis-cli smembers node/77/flags
    nomodules
  
  For example, to remove the bogus node 77: ::

    api-cli run remove-node --data '{"node_id":77}'

- **Unlimited user domains** -- Starting with Core 3.2.1 and Ldapproxy
  1.1.0, the limit of eight simultaneous user domains has been removed. It
  is now possible to install more user domains, provided that only one
  Samba DC can run on a node.

- **Improved user domain event handling in some applications** -- Changes
  to user domain configurations are now correctly applied to Nextcloud,
  Ejabberd, Mail, SOGo, and Roundcube applications. Configuration changes
  are propagated, and services are restarted automatically.


Major changes on 2024-10-16
===========================

**Milestone 8.2**

- **Disk minimum requirements increased** -- The :ref:`minimum disk
  requirements <system-requirements-section>` have been increased to a
  40GB SSD. The primary storage, which holds container images, must be
  fast, especially during read access, to prevent service startup errors.

- **Cluster node limit removed** -- The four-node cluster limit has been
  removed. More nodes can now be added, up to the VPN network size.
  However, keep in mind the increased system load on the leader node. See
  also :ref:`cluster-section`.

- **Progressive upgrades** -- Starting from Core 3.0.0, application images
  can be labeled with a new attribute, min-from_. This ensures that
  installed applications will ignore any updates with this label if their
  version is lower than the label value.

  Similarly, a min-core_ label can be applied to application images,
  requiring a minimum core version for installation or updates. If the
  core version is below the label value, the image will be ignored.

  These labels were developed with Nextcloud in mind, as it only allows
  upgrades to the next major version number. Application developers can
  use these labels to implement progressive upgrades for their
  applications.

- **Cluster log forwarding** -- The Log Settings page now allows
  configuring an outgoing stream of logs to an external Syslog server or
  the Nethesis Cloud Log Manager (available only with an active
  Enterprise Subscription plan).

  This feature centralizes external log archiving for all cluster nodes.
  Since log streams can be substantial in large clusters, future releases
  will include a stream filter to help tailor exported logs to relevant
  security events. See :ref:`logs-forwarding-section`.

- **Application certification level** -- The Software Center now displays
  a *level badge* for each application, indicating its :ref:`certification
  level <certification-levels>`. The application details section also
  includes information on the source repository and useful links.
  Developers can now use a new terms_url_ metadata attribute to provide a
  "Terms and Conditions" link, visible even after installation.

- **Application instance limit per node** -- The Software Center enforces
  limits on the number of application instances that can be installed per
  cluster node. Developers can define this limit using the max-per-node_
  image label. See :ref:`install-applications`.

- **Display of core modules** -- The Software Center now shows additional
  details for core components, including the core version of each cluster
  node. See :ref:`core_updates-section`.

- **Update application to testing version** -- With Core 3.0.0, the
  ``Testing`` switch under Settings > Software Repositories has been
  removed. This change reduces the risk of using pre-releases for new
  installations or updates. If the switch was previously enabled, existing
  NS8 installations will no longer receive pre-release versions as
  updates.

  However, it is still possible to upgrade an application instance to a
  testing version from its three-dots menu, by selecting the ``Update to
  testing version`` action under Software center > Installed > Instances.
  This new procedure allows early access to new features and bug fixes,
  but it must be used with caution to avoid data loss. Be sure to
  carefully read the pre-release documentation or contact the app
  developer before using it. See :ref:`application-instances`.

- **More "generic S3" cloud backup providers** -- The S3 Generic backup
  destination now supports additional cloud providers, including OVH,
  Wasabi, DigitalOcean, and Synology C2. See :ref:`backup-destination`.

- **Backup and snapshot selection** -- During the application restore
  process, users can now select from past backup snapshots generated
  according to the backup retention policy. See
  :ref:`application_restore-section`.

- **TCP and UDP port reallocation** -- Since Core 3.1.0, application
  developers can leverage new core functions that extend the range of TCP
  and UDP ports assigned to application instances. Similarly, they can
  obtain new ranges while preserving existing allocations, easing the
  introduction of new components during application upgrades. For more
  information, see `Port allocation`_ in the Developer's manual.

- **NethVoice application** -- :ref:`NethVoice <nethvoice-section>` is a
  professional IP telephony solution that offers a host of advanced
  features and an intuitive user interface.

- **Webtop application** -- :ref:`Webtop <webtop-section>` now features a
  new default UI theme, exclusively available on the NS8 platform.
  Administrators can choose to apply the new theme across existing
  installations or allow end-users to decide. Additionally, for those on
  the Enterprise Subscription plan, the :ref:`PEC bridge <pec-bridge>` is
  now available.

- **Nextcloud application** -- Nextcloud version 27 (NC 27), which was the
  last version available on NethServer 7, has reached End-of-Life (EOL).
  Although migrations will still install NC 27, an update to NC 28 will be
  immediately available after migration.

- **Mattermost application** -- Mattermost has been upgraded from the EOL
  version 8 to the latest major release, version 9.11 (ESR).

.. _terms_url: https://nethserver.github.io/ns8-core/modules/metadata
.. _max-per-node: https://nethserver.github.io/ns8-core/modules/images/#image-labels
.. _min-from: https://nethserver.github.io/ns8-core/modules/images/#image-labels
.. _min-core: https://nethserver.github.io/ns8-core/modules/images/#image-labels
.. _`Port allocation`: https://nethserver.github.io/ns8-core/modules/port_allocation/

Major changes on 2024-05-31
===========================

**Milestone 8.1**

- **Mail improvements** -- Added the :ref:`Relay rules
  <relay-rules-section>` feature, which allows configuration and use of a
  default smarthost for outgoing email messages, and more. A Mail instance
  can now be selected directly from the :ref:`Email notifications
  <email-notifications>` page to serve as the cluster's default mail
  gateway for other applications. Since release 1.4 Mail provides also
  Sender/login correspondence, configurable Queue lifetime, and IP-based
  relay policy, as described by :ref:`Mail settings
  <mail_settings-section>`.

- **Piler application** -- The new Piler application enhances Mail
  features with an email archiving solution. See :ref:`piler-section` for
  more information.

- **Netdata application** -- A new monitoring stack is available alongside
  Prometheus and Grafana. A Netdata instance can be installed with a click
  on a cluster node and immediately starts to collect metrics. See
  :ref:`netdata-section` for details.

- **Dnsmasq application** -- This new application provides a simple DNS
  and DHCP service for the local area network. See :ref:`dnsmasq-section`
  for details.

- **Display firewall open ports** -- The node firewall configuration is
  accessible from a new card under the Settings page. The same information
  is still available from the Nodes page. See the
  :ref:`node-firewall-section` for more information.

- **NethSecurity controller** -- This new application allows the remote
  control of multiple NethSecurity installations, called units. It
  provides enhanced management and monitoring capabilities for firewall
  units. Refer to the section :ref:`nethsecurity-controller-section` for
  more information.

- **System logs** -- Log records generated by any cluster node are
  collected and stored in the leader node for a configurable number of
  days. Since Core release 2.7.0, the component responsible for this is
  automatically started and configured when a new leader node is promoted.
  Refer to the section :ref:`system-logs-section` for more information.

- **Crowdsec bouncer container** -- Since Crowdsec release 1.0.7, the
  bouncer component runs inside a container and uses Netfilter tables to
  block IPs. Execute the following commands to clean up some files and
  resources left by previous versions.

  Run this command to remove the Firewalld ipset: ::

    firewall-cmd --permanent --delete-ipset=crowdsec-blacklists
    firewall-cmd --permanent --delete-ipset=crowdsec6-blacklists

  Additional packages and the software repository installed in the host
  system can also be removed.

  For Rocky Linux, run: ::

    dnf remove -y crowdsec-firewall-bouncer-iptables
    rm -rvf /etc/yum.repos.d/crowdsec_crowdsec.repo /etc/crowdsec /usr/local/sbin/cscli

  For Debian, run: ::

    apt-get -y remove crowdsec-firewall-bouncer-iptables
    rm -rvf /etc/apt/sources.list.d/crowdsec_crowdsec.list /etc/crowdsec /usr/local/sbin/cscli

- **Rocky Linux 9.4** -- Since Core release 2.8.1, the pre-built images
  are based on the official Rocky Linux 9.4 cloud image.


Major changes on 2024-02-13
===========================

**Stable release 8.0**

New features introduced by this release are:

- **Subscription** -- Nethesis Enterprise and Community Subscription plans
  are now available for NS8. See the details in
  :ref:`subscription-section` page.

- **User management portal** -- Members of the Domain Admins group can now
  create, edit and delete user accounts from the :ref:`User management
  portal <user-management-portal-section>`.  The login screen now displays
  the user domain name to distinguish which domain a user is logging in
  to.

- **Skip certificate validation** in HTTP routes -- When an HTTP route is
  created or edited in the :ref:`HTTP routes <traefik-section>` page, the
  ``Skip certificate validation`` option can be enabled over a trusted
  network if the server at the destination URL has no valid TLS
  certificate.

- **Cockpit removed from pre-built image** -- Cockpit is not required to
  run NS8, therefore it is no more available in the NS8 pre-built image.
  If desired, it can be manually installed and enabled with the following
  commands: ::

    dnf install -y cockpit
    systemctl enable --now cockpit.socket

  The default Cockpit configuration forbids ``root`` access: log in as a
  member of the ``wheel`` group, then enter the "administrative access"
  mode.

Known issues:

- **Core upgrade freezes Software Center page** -- The `bug 6778`_ has
  been fixed in core version 2.2.6. If the upgrade from RC1 starts from
  core version 2.2.5 or lower, when the task progress bar freezes reload
  the web page with ``CTRL + SHIFT + R`` or an equivalent procedure. The
  page reload has no impact with the underlying upgrade. Note: the upgrade
  download may be slow; avoid interrupting or rebooting until completion.

.. _`bug 6778`: https://github.com/NethServer/dev/issues/6778

Major changes on 2023-11-21
===========================

**Release Candidate 1**

New features introduced by RC1 are:

- **Password policy** -- Added a new configuration option to the ``Domains
  and users`` page. It is possible to modify the password complexity and
  expiration policies of Samba and OpenLDAP domains. Beta 2 installations
  with OpenLDAP domains require to run a manual procedure to enable the
  password policy. The upgrade procedure is detailed in the next notes.
  See also :ref:`password-policy-section`.

- **User management portal** -- Users of a domain can now access a web page to change
  their own password. The user portal is available at
  ``https://IP_OR_FQDN/users-admin/DOMAIN_NAME/``; a full link is shown in
  the ``Domains and users`` page, under the domain configuration settings.
  Beta 2 installations require to run a manual procedure to enable the
  user portal. See the upgrade procedure for Samba and OpenLDAP in the
  next notes, and the :ref:`user-management-portal-section` page.

- **Backup repositories** -- Beside existing cloud protocols, it is now
  easier to send backups to some local device. A backup repository can now
  be created in a *Windows file share* or in a *Local storage*, like a
  disk attached to a cluster node. See :ref:`backup-restore-section`
  for more information.

- **Fetch mail from other servers** -- :ref:`imapsync-section` is a new
  advanced application designed to retrieve email messages from remote
  IMAP servers at scheduled intervals and to synchronize entire IMAP
  accounts.

- **Mirror list for Rocky Linux nodes** -- If Rocky Linux is the node OS
  distribution, the default DNF configuration is overridden and mirrors
  are returned by ``mirrorlist.nethserver.org``. RPM packages from Rocky
  Linux will be hosted by NethServer specific mirrors in future releases.

Upgrade of existing Beta 2 installations can be started from the Software
center page as usual. After the core components are up-to-date, run the
following manual procedures to complete the upgrade.

- **Core upgrade procedure** -- To upgrade Beta 2 installations run the
  following command on the leader node. It defines the new ``tunadm``
  authorization role, available on new installations since core version
  2.1.0: ::

    redis-cli --raw hvals cluster/module_node | sort -n | uniq | xargs -I NODE_ID -- redis-cli SADD node/NODE_ID/roles/tunadm add-tun remove-tun add-public-service remove-public-service add-custom-zone remove-custom-zone

  For each cluster node, enable the local WebDAV service for backups: ::

    systemctl enable --now rclone-webdav.service

  Finally, only for Rocky Linux nodes, enable the NethServer default
  repositories: ::

    cp -v /etc/nethserver/nethserver.repo /etc/yum.repos.d/nethserver.repo
    dnf config-manager --save --set-disabled appstream baseos extras

- **Samba upgrade procedure** -- To upgrade Beta 2 installations run the
  following procedure for each Samba account provider instance. The list
  of instances can be obtained from the ``Domains and users`` page, under
  the domain configuration settings; **annotate for each provider**:

  * the module ID (string), for example ``samba1``
  * the node ID (number), for example ``1``
  * a free TCP port number, generated by executing on the leader node a command
    like this: ::

      node_id=1
      echo $((`redis-cli --raw INCR node/${node_id}/tcp_ports_sequence` - 1))

    In the above example set ``node_id`` with the correct node ID (number).
    Let's assume the above command prints the port number below: ::

      20013

  With the above annotations, run the following steps for each provider:

  1. Log on the cluster node where the provider instance runs.

  2. Apply the TCP port configuration and start the user portal service: ::

      runagent -m samba1 python3 - 20013 <<'EOF'
      import agent, os, sys
      user_portal_port = sys.argv[1]
      agent.assert_exp(int(user_portal_port) > 0, "ERROR: Bad TCP port argument")
      agent.assert_exp("IPADDRESS" in os.environ, "ERROR: Samba is not configured")
      agent.assert_exp(not "TCP_PORT" in os.environ, "ERROR: TCP_PORT is already set")
      os.environ["TCP_PORT"] = user_portal_port
      agent.set_env("TCP_PORT", user_portal_port)
      os.execl("../actions/configure-module/80start_amld", "80start_amld")
      EOF

- **OpenLDAP upgrade procedure** -- To upgrade Beta 2 installations run the
  following procedure for each OpenLDAP account provider instance. The list
  of instances can be obtained from the ``Domains and users`` page, under
  the domain configuration settings; **annotate for each provider**:

  * the module ID (string), for example ``openldap1``
  * the node ID (number), for example ``1``
  * a free TCP port number, generated by executing on the leader node a command
    like this: ::

      node_id=1
      echo $((`redis-cli --raw INCR node/${node_id}/tcp_ports_sequence` - 1))

    In the above example set ``node_id`` with the correct node ID (number).
    Let's assume the above command prints the port number below: ::

      20014

  With the above annotations, run the following steps for each provider:

  1. Log on the cluster node where the provider instance runs.

  2. Apply the TCP port configuration and start the user portal service: ::

      runagent -m openldap1 python3 - 20014 <<'EOF'
      import agent, os, sys
      user_portal_port = sys.argv[1]
      agent.assert_exp(int(user_portal_port) > 0, "ERROR: Bad TCP port argument")
      agent.assert_exp("LDAP_IPADDR" in os.environ, "ERROR: OpenLDAP is not configured")
      agent.assert_exp(not "," in os.environ["TCP_PORTS"], "ERROR: unexpected TCP_PORTS value")
      os.environ["TCP_PORTS"] = f'{os.environ["TCP_PORT"]},{user_portal_port}'
      agent.set_env("TCP_PORTS", os.environ["TCP_PORTS"])
      os.execl("../actions/configure-module/80start_amld", "80start_amld")
      EOF

  After repeating the above steps on each cluster node, run the following
  commands in one instance of your choice (the example is for
  ``openldap1``): ::

    runagent -m openldap1 podman exec -i openldap ash -c 'envsubst | ldapmodify -c ' <<'EOF'
    dn: olcDatabase={2}mdb,cn=config
    changetype: modify
    delete: olcAccess
    -
    add: olcAccess
    olcAccess: to attrs=userPassword by dn.base="
     gidNumber=101+uidNumber=100,cn=peercred,cn=external,cn=aut
     h" write by set="[cn=domain admins,ou=Groups,${LDAP_SUFFIX}
     ]/memberUid & user/uid" write by self write by * auth
    olcAccess: to * by dn.base="gidNumber=101+uidNumber=100,
     cn=peercred,cn=external,cn=auth" manage by set="[cn=do
     main admins,ou=Groups,${LDAP_SUFFIX}
     ]/memberUid & user/uid" write by * read

    dn: olcOverlay={1}ppolicy,olcDatabase={2}mdb,cn=config
    changetype: modify
    replace: olcPPolicyCheckModule
    olcPPolicyCheckModule: ppcheck.so

    dn: cn=default,ou=PPolicy,${LDAP_SUFFIX}
    changetype: modify
    add: objectClass
    objectClass: pwdPolicyChecker

    dn: cn=default,ou=PPolicy,${LDAP_SUFFIX}
    changetype: modify
    replace: pwdCheckQuality
    pwdCheckQuality: 2
    -
    replace: pwdMinAge
    pwdMinAge: 0
    -
    replace: pwdMaxAge
    pwdMaxAge: 15552000
    -
    replace: pwdMinLength
    pwdMinLength: 8
    -
    replace: pwdInHistory
    pwdInHistory: 12
    -
    replace: pwdLockout
    pwdLockout: FALSE
    -
    replace: pwdUseCheckModule
    pwdUseCheckModule: TRUE
    -
    replace: pwdCheckModuleArg
    pwdCheckModuleArg: default
    -
    replace: pwdExpireWarning
    pwdExpireWarning: 0
    EOF

    runagent -m openldap1 systemctl --user restart openldap

- **Mattermost upgrade procedure** -- Mattermost upgrade must be completed
  manually to allocate and open UDP ports required by the Calls plugin.
  From the ``Software center`` page, ensure Mattermost is at version
  ``2.0.0``. Then clone the running instance and after clone is complete,
  remove the old instance.

Major changes on 2023-09-13
===========================

**Beta 2**

- **Pre-built image** -- Images are based on Rocky Linux. Available
  formats are ``.qcow2`` for QEMU/Proxmox and ``.vmdk`` for VMware. See
  :ref:`install_image-section` for image download links.

- **FQDN requirement** -- The cluster creation procedure now asks to
  review and set the current system host name. The host name is expected
  in short form (a single word, with no domain suffix). The procedure also
  asks for the domain suffix and fixes the ``/etc/hosts`` file by adding a record to properly resolve the
  fully qualified domain name of the system (FQDN). For example ::

    127.0.1.1 node1.example.org node1

  See also :ref:`dns-reqs`.

- **WireGuard port 55820** -- The UDP port used by WireGuard in the
  creation of the cluster VPN is now fixed to ``55820``. Clusters already
  created with a custom port number must be fixed manually before updating
  the core to Beta 2. For example if the custom port is ``55821`` run on
  the leader node the following steps to fix it.

  1. Fix the VPN public endpoint address in Redis. For example, if the
     leader node is ``1`` and its FQDN is ``node1.example.org`` ::

      redis-cli hset node/1/vpn endpoint node1.example.org:55820

  2. Fix the firewall configuration ::

      firewall-cmd --permanent --service=ns-wireguard --remove-port=55821/udp
      firewall-cmd --permanent --service=ns-wireguard --add-port=55820/udp
      firewall-cmd --reload

  3. Change the running WireGuard listen port ::

      wg set wg0 listen-port 55820

  4. Make the change permanent, by setting ``ListenPort = 55820`` in
     ``/etc/wireguard/wg0.conf`` ::

      sed -ir 's/ListenPort.*/ListenPort = 55820/' /etc/wireguard/wg0.conf

  Repeat steps 2-4 on each worker node, too.

- **Debian upgrade** -- After running the core update, installations based
  on Debian 11 (Bullseye) must be manually upgraded to distribution
  version 12 (Bookworm).  ::

    rm -f '/etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list'
    sed -i 's/bullseye/bookworm/' /etc/apt/sources.list
    apt update && apt full-upgrade -y

  Follow also the instructions for Python 3.11 upgrade, then **reboot the
  system**. Apply the same procedure for each cluster node.

- **Python 3.11** -- After running the core update, installations based on
  Rocky Linux (and other EL-like distributions) must manually install
  Python 3.11: ::

     dnf install python3.11

  The following Bash script is required by Debian, too. Do not forget the round brackets! ::

    (
        set -e -x
        core_dir=/usr/local/agent/pyenv
        mv -v ${core_dir} ${core_dir}.bak
        python3.11 -mvenv ${core_dir} --upgrade-deps --system-site-packages
        ${core_dir}/bin/pip3 install -r /etc/nethserver/pyreq3_11.txt
        echo "/usr/local/agent/pypkg" >$(${core_dir}/bin/python3 -c "import sys; print(sys.path[-1] + '/pypkg.pth')")
        rm -rf ${core_dir}.bak
    )

  Check if the Python upgrade was successfull: ::

    runagent python3 --version # output should be 3.11

  Apply the same procedure for each cluster node.

- **UI security enhancements** -- Since the Beta 1 release an important
  security update has been released, and other security improvements are
  now available.  After running the core update, do an hard browser page
  reload with ``CTRL + Shift + R`` or any other equivalent method.

- **Logs backend improved** -- The Logs page backend has been improved to
  be faster and more accurate in capturing the logs of every cluster
  component. The core module now runs Promtail as a system service. After
  running the core update, it is safe to uninstall Promtail core modules
  by running this command on the leader node: ::

    api-cli run list-installed-modules | jq -r '.["ghcr.io/nethserver/promtail"] | .[].id' | xargs -l remove-module --no-preserve

  Note that the new Logs page cannot access old log entries. To see log
  entries before the Beta 2 upgrade, use the `logcli` command.

- **TLS certificate upload** -- The ``TLS certificates`` card under the
  ``Settings`` page was extended to allow the upload of a certificate and
  the private key associated to it. See the section
  :ref:`certificate_manager-section`.

- **Additional backup providers** -- Backup repositories can be created
  also on Microsoft Azure and S3-compatible cloud storage providers.

- **New Traefik configuration backend** -- The cluster Redis DB is not
  used any more by Traefik module instances as their dynamic configuration
  backend. Traefik configuration is now entirely stored under the module
  home directory. To improve Redis performance it is possible to disable a
  feature specific for Traefik with the following commands: ::

    podman exec redis sed -i.beta1 '/^notify-keyspace-events / d' /data/etc/redis.conf
    systemctl restart redis

  Apply the same procedure for each cluster node.

- **Mail module improvements**

  1. New installations of the Mail module have the ``Shared seen`` option
     enabled by default. Existing installations will find the switch
     disabled. See also the section about :ref:`settings for mailboxes
     <mail-mailboxes-settings>`.

  2. Added the open source Dovecot plugin *Flatcurve* to enable full text
     search (FTS) of email messages.  To massively rebuild the search
     indexes run the following command during system idle time: ::

       podman exec dovecot sh -c "doveadm index -A -q '*' ; pgrep indexer-worker | xargs -- renice"

     Only PDF attachments and the email itself are added to the index.
     In future releases more attachment formats will be supported.


Major changes on 2023-05-10
===========================

**Beta 1**

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

.. _releases-glossary:

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
