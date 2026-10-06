---
title: CrowdSec
---
# CrowdSec

[CrowdSec](https://www.crowdsec.net/) is a malicious activity detection tool. It looks for known patterns, like malicious login attempts, inside the applications logs and blocks the attacker IP address.

You can install only one CrowdSec instance for each node.

## Default protections

Once installed, CrowdSec is already fully functional and starts protecting NS8 applications automatically, before any manual configuration:

- **Web applications (always on)**: every app served through the platform's reverse proxy gets generic HTTP protection regardless of which app it is — including NethVoice's HTTP endpoints — brute-force login detection (e.g. 5 `401`/`403` responses to `POST` requests in 10 seconds bans the IP), scan/probing detection, bad user-agents, sensitive-file probing (`.env`, `.git`, ...), path traversal, SQL injection, XSS probing, open-proxy abuse, admin-interface probing, and known-CVE exploitation probing (dozens of product CVEs, e.g. Log4j2, Spring4Shell, VMware vCenter, Fortinet, Pulse Secure).
- **Specific applications**: Nextcloud and WordPress get extra app-aware scenarios (brute force, user enumeration, `wp-config` scanning) on top of the generic ones above.
- **SSH**: brute force (including slow/time-based variants) and the CVE-2024-6387 (regreSSHion) check.
- **Mail**: Postfix (relay abuse, spam, invalid HELO/commands) and Dovecot (spam) brute-force/abuse detection.
- **Database**: MariaDB and PostgreSQL brute-force login detection.
- **FTP**: ProFTPD and vsftpd brute force and user enumeration.
- **NethVoice**: HTTP brute force against the middleware API, reports API, and admin login, plus exploit-path scanning; SIP brute force against Kamailio. Enabled by default on a fresh install of NethVoice alongside CrowdSec; on an upgrade it stays off until you enable it from the `Collections` page (see below).
- **Good-actor whitelist**: known legitimate crawlers/bots are automatically excluded from bans.

## Web interface

The module's side menu gives access to the following pages: `Status`,
`Detections`, `Collections`, `Blocklists`, `Threat Shield`, `Settings`, and
`About`.

### Status

Shows an overview of the application (restart action), the installation node,
backup status, and a link to the logs.

### Detections

Detections are suspicious activities found by CrowdSec, such as repeated login
failures or known attack patterns. A detection does not always result in a
blocked IP.

The table lists `Detected at`, `Scenario`, `Source IP`, `Country`,
`Action` (`Blocked`, `Block expired`, or `-` when no decision was taken), and
`Events` count. Use the search box to filter by IP or scenario, and the
`Events to show` selector to limit how many recent events are loaded. Each
row has a `Details` link that opens the full event log for that detection.
A `Delete all detections` button clears the whole list. This page exposes
what was previously only visible with `cscli alerts list`.

### Collections

Collections add detection support for specific services, such as SSH, Nginx,
or WordPress. Enable only the collections that match the services installed
on this server; a link to the [CrowdSec Hub](https://app.crowdsec.net/hub)
lets you check what each collection detects before enabling it.

The table lists `Name`, `Status`, `Version`, and `Description`, with
an `Enable`/`Disable` action per row. For example, the `nethesis/nethvoice`
collection detects brute-force and exploit-scan attacks against the NethVoice
application (SIP and HTTP); it ships disabled after an upgrade and must be
enabled from this page.

### Blocklists

This page replaces the former `Banned IP` page and is organized in three tabs.

#### Local blocklist

IP addresses currently blocked by this server based on local CrowdSec
decisions. The table lists `Blocked at`, `IP address`, `Time remaining`,
and `Reason`, with a search box and per-row `Unblock`, plus an
`Unblock all` action.

#### Community blocklist

IP addresses shared by the CrowdSec community and received through the
Central API (CAPI). As default, CrowdSec will send some telemetry to remote
CrowdSec-owned servers; the servers use such data to compose a community
blocklist which is sent back to your installation. If you do not want to
share such data, disable the `Central API and signal sharing` toggle — this
also disables the `Community blocklist` toggle below it.

You can connect your instance to the [CrowdSec console](https://app.crowdsec.net)
by filling the `Enroll key` optional field. The `Central API status` tag
shows whether the instance is connected. The number of IPs currently listed in
the community blocklist is shown next to a search box that lets you check
whether a given IP is included.

Disabling the Central API or the community blocklist purges the CAPI-sourced
decisions from this server automatically.

CrowdSec provides a [community blocklist](https://docs.crowdsec.net/docs/next/central_api/community_blocklist) that is shared among all users; enabling `Central API and signal sharing` plus enrolling your instance in the console activates it. To access the full community blocklist (beyond the Lite version), you must share at least some ban decisions with the Central API every 24 hours. If your server has few or no bans, it will be considered as a blocking state, preventing access to the complete blocklist.

#### Allowlist

Trusted IP addresses, CIDR ranges, and domain names that should never be
blocked. Enter one entry per line, for example:

```
192.168.1.10
192.168.1.0/24
trusted.example.com
```

### Threat Shield {#threat-shield}

Threat Shield adds blocklists maintained by Nethesis to CrowdSec. CrowdSec
downloads the enabled blocklists every 30 minutes and blocks their IP
addresses in the firewall.

Threat Shield requires a [subscription](../about/subscription.md) that
includes the Threat Shield add-on:

- Without a subscription, the page shows `Subscription required` and all
  controls are disabled.
- With a subscription but without the add-on, the page shows
  `Threat Shield add-on required` and all controls are disabled. If you lose
  the add-on, the addresses imported from the blocklists are removed.

When the system has a subscription, even without the add-on:

- CrowdSec sends the IP addresses it blocks to Nethesis. Nethesis collects
  them from all NethServer and NethSecurity systems with a subscription. When
  enough systems report the same address, it goes into the
  `Nethesis community - Level 2` blocklist. You cannot turn this off.
- CrowdSec applies the Nethesis global allowlist. The addresses in this list,
  such as the Nethesis subscription servers, are never blocked.

#### Blocklist

The table lists the available blocklists with `Status`, `Confidence`,
`Entries` and `Last update`. Select the blocklists to enable and click
`Save`. The import starts right after you save. Disabling a blocklist removes
its addresses from the firewall.

| Blocklist | Confidence |
|---|---|
| `Yoroi malware - Level 1` | 10 |
| `Yoroi malware - Level 2` | 8 |
| `Yoroi suspicious - Level 1` | 10 |
| `Yoroi suspicious - Level 2` | 8 |
| `Nethesis suspicious - Level 3` | 6 |
| `Nethesis community - Level 2` | 8 |

Confidence goes from 1 to 10. A higher value means a lower risk of blocking
a legitimate address.

The `Nethesis community - Level 2` blocklist contains the attackers blocked
by NethServer and NethSecurity systems, as described above.

:::note
CrowdSec cannot block whole networks with its firewall component, so only
single addresses are imported. Network entries in the blocklists are skipped:
for example, the `Nethesis suspicious - Level 3` blocklist contains about 3,000
networks that are not imported. The `Entries` count and the search below
cover single addresses only.
:::

#### Search IP in Threat Shield blocklists

Enter an IP address and click `Search` to check whether it is blocked by an
enabled Threat Shield blocklist. If it is, the result names the blocklists
that contain it.

### Settings

- `Local network blocking`: disabled as default, private/LAN traffic is
  never banned. Enable this toggle if you also want CrowdSec to block
  offending IPs on your local networks.
- `Block duration`: choose `Incremental` to increase the duration for
  repeated detections from the same IP, or `Fixed` to always use the same
  duration. Either way, enter the duration in minutes as free text.
- mail notification by adding one address per line inside the `Email recipients for notifications` field: notifications will work only if [Email notifications](../configuration/email_notifications.md) has been configured — a link to the cluster email settings is shown when none is configured yet.
- `Notification threshold`: CrowdSec sends a daily notification email listing newly blocked IPs to the configured recipients. If this threshold of new blocked IPs is reached before the daily report, the notification is sent immediately. Can be set between 1 and 10000 (100 as default).

CrowdSec data is accessible from the `CrowdSec Overview` and `CrowdSec Metrics` Grafana dashboards, as explained in [Grafana access](../configuration/metrics.md#grafana_access-section).

## Command-line interface

Most of the actions above are also available from the command line.

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

### Threat Shield {#threat-shield-cli}

Threat Shield can also be managed with `api-cli`. Run the commands below in a
root shell.

Enable some blocklists:

    api-cli run module/crowdsec1/set-threat-shield --data '{"feeds": ["yoroimallvl1", "nethesislvl3", "nethesis-insights"]}'

Disable all blocklists:

    api-cli run module/crowdsec1/set-threat-shield --data '{"feeds": []}'

The blocklist keys are: `yoroimallvl1`, `yoroimallvl2`, `yoroisusplvl1`,
`yoroisusplvl2`, `nethesislvl3` and `nethesis-insights`
(`Nethesis community - Level 2`).

Show the blocklists, their entry counts and last update:

    api-cli run module/crowdsec1/list-threat-shield

Check whether an IP address is blocked:

    api-cli run module/crowdsec1/search-threat-shield-decision --data '{"ip": "203.0.113.5"}'

Show the addresses imported from the blocklists into the firewall:

    nft list set crowdsec crowdsec-blacklists-cscli-import

Show the Nethesis global allowlist:

    runagent -m crowdsec1 cscli allowlists inspect nethesis_threat_shield

If an address of yours is wrongly listed in the `Nethesis community - Level 2`
blocklist, ask Nethesis to remove it. This is available only from the command
line and requires the Threat Shield add-on:

    api-cli run module/crowdsec1/request-allowlist --data '{"cidr": "203.0.113.7", "reason": "This is our office public IP"}'

- `cidr`: an IP address or a network, at most `/24` for IPv4 or `/48` for
  IPv6.
- `reason`: why the address must not be blocked.

The output looks like `{"accepted": true, "requests": 1}`, where `requests`
is how many systems asked for the same address. Repeating a request has no
effect.
