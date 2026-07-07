---
title: CrowdSec
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) is a malicious activity detection tool. It looks for known patterns, like malicious login attempts, inside the applications logs and blocks the attacker IP address.

You can install only one CrowdSec instance for each node.

## Default protections

Once installed, CrowdSec is already fully functional and starts protecting NS8 applications automatically, before any manual configuration:

- **Web applications (always on)**: every app served through the platform's reverse proxy gets generic HTTP protection regardless of which app it is — brute-force login detection (e.g. 5 `401`/`403` responses to `POST` requests in 10 seconds bans the IP), scan/probing detection, bad user-agents, sensitive-file probing (`.env`, `.git`, ...), path traversal, SQL injection, XSS probing, open-proxy abuse, admin-interface probing, and known-CVE exploitation probing (dozens of product CVEs, e.g. Log4j2, Spring4Shell, VMware vCenter, Fortinet, Pulse Secure).
- **Specific applications**: Nextcloud and WordPress get extra app-aware scenarios (brute force, user enumeration, `wp-config` scanning) on top of the generic ones above.
- **SSH**: brute force (including slow/time-based variants) and the CVE-2024-6387 (regreSSHion) check.
- **Mail**: Postfix (relay abuse, spam, invalid HELO/commands) and Dovecot (spam) brute-force/abuse detection.
- **Database**: MariaDB and PostgreSQL brute-force login detection.
- **FTP**: ProFTPD and vsftpd brute force and user enumeration.
- **Good-actor whitelist**: known legitimate crawlers/bots are automatically excluded from bans.

## Configuration

From the web interface you can configure:

- mail notification by adding one address per line inside `Email notifications` field: notifications will work only if [Email notifications](../configuration/email_notifications.md) has been configured
- IP and network which will never be blocked
- dynamic and static ban time

As default, CrowdSec will send some telemetry to remote CrowdSec-owned servers. The servers use such data to compose a community blocklist which is sent back to your installation. If you do not want to share such data and disable the community blocklist, you can do it by disabling the `Enable central API` option under the `Advanced` section.

You can also connect your instance to [CrowdSec console](https://app.crowdsec.net) by filling the `Enroll key` optional field.

CrowdSec sends a daily notification email listing newly blocked IPs to the configured recipients. If the default threshold of 100 new blocked IPs is reached before the daily report, the notification is sent immediately. The `Notification threshold` field, under the `Advanced` section, controls this value and can be set between 1 and 10000.

CrowdSec data is accessible from the `CrowdSec Overview` and `CrowdSec Metrics` Grafana dashboards, as explained in [Grafana access](../configuration/metrics.md#grafana_access-section).

### Community blocklist vs Community blocklist (Lite)

CrowdSec provides a [community blocklist](https://docs.crowdsec.net/docs/next/central_api/community_blocklist) that is shared among all users. To activate this feature, you need to:

- Enable the Central API option.
- Enroll your CrowdSec instance in the console.

To access the full community blocklist (beyond the Lite version), you must share at least some ban decisions with the Central API every 24 hours. If your server has few or no bans, it will be considered as a blocking state, preventing access to the complete blocklist.

## Command-line interface

The `cscli` command is a powerful command-line interface to access advanced Crowdsec functions. To run `cscli`, you have to enter the application environment first. Type in a root shell the following command

    runagent -m crowdsec1 bash

Then the `cscli` command becomes available. For instance, print the help message with

    cscli --help

You can also run a single command directly, without opening a shell, by prefixing it with `runagent -m crowdsec1`:

    runagent -m crowdsec1 cscli decisions list

Some useful commands:

- `cscli decisions list` — list current bans (IP, reason, duration, decision id)
- `cscli decisions delete --id <id>` — remove a ban by its decision id, e.g. `cscli decisions delete --id 630190`
- `cscli decisions delete --ip <ip>` — remove a ban by IP address
- `cscli decisions add --ip <ip> --duration 4h --reason "manual ban"` — manually ban an IP
- `cscli alerts list` — list triggered alerts (detected attacks), including ones that did not result in a ban
- `cscli bouncers list` — list registered bouncers (e.g. the firewall bouncer) and their status
- `cscli collections list` / `cscli scenarios list` — show which collections/scenarios are installed and enabled, useful to check what is being protected
- `cscli metrics` — show parser/bucket/bouncer metrics, useful to check CrowdSec is actually processing logs
- `cscli explain --file <logfile> --type <log-type>` — test a log line against parsers and scenarios, useful to debug why an attack was or wasn't detected
