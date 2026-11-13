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
- **WebTop**: brute force against the WebTop login page. The `nethesis/webtop` collection bans the real client IP after repeated failed logins. It is enabled by default and you can disable it from the `Collections` page.
- **Good-actor whitelist**: known legitimate crawlers/bots are automatically excluded from bans.

## Web interface

The module's side menu gives access to the following pages: `Status`,
`Activity`, `Threat Shield IP`, `Collections`, `Settings`, and `About`.

### Status

Shows an overview of the application (restart action), the installation node,
backup status, and a link to the logs.

### Activity {#activity}

Detections are suspicious activities found by CrowdSec, such as repeated login
failures or known attack patterns. A detection does not always result in a
banned IP.

The toolbar above the table holds `Unban all`, `Delete all detections`, and
`Refresh`, which reloads the list.

The table lists `Detected at`, `Scenario`, `Source IP`, `Country`,
`Action` (`Banned` while the ban is active, `Ban expired` once it is over, or
`-` when no ban was applied), and `Events` count. Use the `Filter detections`
box to filter by IP or scenario, the `Action` selector (`All`, `No action`,
`Banned`, or `Ban expired`) to show only the detections with that action, and
the `Events to show` selector to limit how many recent events are loaded. If
no detection matches the filters, click `Reset filters` to clear them.

To open the full event log of a detection, select `Show details` from its row
menu. Banned rows also have an `Unban` link, and the details window of a
banned detection has an `Unban` button. `Unban all` unbans all the addresses
banned by CrowdSec detections. An unbanned address may be banned again if CrowdSec
detects new suspicious activity.

`Unban` and `Unban all` remove only temporary bans. Addresses in the
[Local blocklist](#local-blocklist) and in the Threat Shield IP blocklist
feeds stay banned.

`Delete all detections` permanently removes all detections and the bans they
created from the database. Banned addresses stay in the firewall until their
ban expires. Threat Shield IP, community blocklist and Local blocklist bans
are applied again automatically; other bans added by hand, for example with
`cscli`, are lost.

### Threat Shield IP {#threat-shield}

This page manages the lists of IP addresses that are always banned or never
banned. It is organized in five tabs: `Blocklist feeds`, `Allowlist feeds`,
`Local blocklist`, `Local allowlist`, and `CrowdSec community blocklist`.

Attackers usually target many servers at once. NethServer and NethSecurity
systems with a subscription share the attackers they ban, so that each
system can ban them before they attack.

It works this way:

- When CrowdSec bans an IP address, the server sends that address to
  Nethesis.
- When enough systems report the same address, Nethesis adds it to the
  `Nethesis collective defense - Level 2` blocklist.
- Servers with the Threat Shield add-on can enable this blocklist and other
  blocklists maintained by Nethesis. CrowdSec downloads the enabled
  blocklists every 30 minutes and bans their IP addresses in the firewall.

Servers with a subscription also apply the `Nethesis global allowlist`. The
addresses in this list, such as the Nethesis subscription servers, are never
banned.

What happens depends on the [subscription](../about/subscription.md):

| Server | Sends banned addresses | Nethesis global allowlist | Enterprise blocklist feeds |
|---|---|---|---|
| Without subscription | No | No | Not available |
| With subscription | Yes | Yes | Not available |
| With subscription and the Threat Shield add-on | Yes | Yes | Available, disabled by default |

The Threat Shield add-on is available for both Community and Enterprise
subscriptions. Custom feeds, the Local blocklist and the Local allowlist work
without a subscription.

No configuration is needed. Sending starts when the server has a
subscription and stops when the subscription is removed. If the server loses
the subscription or the add-on, the addresses imported from the Enterprise
blocklist feeds are removed.

#### Blocklist feeds

Threat Shield IP bans the IP addresses in the enabled blocklist feeds. The
table lists `Name`, `Type`, `Description`, `Status`, `Confidence`, `Entries`,
`Banned`, and `Last update`. `Banned` counts the network packets from the
feed's addresses blocked by the firewall in the last 24 hours. An address on
several feeds is counted for the one with the highest confidence.

The `Type` column tells the two kinds of feeds apart:

- `Enterprise`: blocklists maintained by Nethesis and Yoroi. They require a
  subscription with the Threat Shield add-on. Without the add-on, their
  `Status` switch is off and their counts show `-`; the feeds you selected
  are kept.
- `Custom`: blocklists downloaded from a URL of your choice, see
  [Custom feeds](#custom-feeds).

Turn on the `Status` switch of the feeds to enable and click `Save`. The
import starts right after you save. All feeds refresh every 30 minutes.
Disabling a feed removes its addresses from the firewall. If a feed can't be
updated, an error above the table names it.

| Blocklist | Confidence |
|---|---|
| `Yoroi malware - Level 1` | 10 |
| `Yoroi malware - Level 2` | 8 |
| `Yoroi suspicious - Level 1` | 10 |
| `Yoroi suspicious - Level 2` | 8 |
| `Nethesis suspicious - Level 3` | 6 |
| `Nethesis collective defense - Level 2` | 8 |

Confidence goes from 1 to 10. A higher value means a lower risk of banning
a legitimate address. Confidence is not shown with a Community subscription.
Custom feeds show `Unknown`.

To check whether an address is banned by an enabled blocklist, enter it in
`Search IP in blocklists` and click `Search`. If it is, the result names the
blocklists that contain it. The search takes a single IPv4 or IPv6 address,
not a network, and works without a subscription, so custom feeds can be
searched too.

#### Allowlist feeds

Threat Shield IP never bans the IP addresses and networks in the enabled
allowlist feeds. The table lists `Name`, `Description`, and `Status`.

The `Nethesis global allowlist` holds the IP addresses of Nethesis services.
It is enabled automatically with a subscription and can't be disabled, edited
or deleted. With a subscription, blocklist feeds are imported only after this
allowlist has been downloaded.

Add your own allowlists with `Create custom feed`, see
[Custom feeds](#custom-feeds). Turn on the `Status` switch of the feeds to
enable and click `Save`. All allowlists refresh every 30 minutes. If a feed
can't be updated, an error above the table names it.

#### Custom feeds {#custom-feeds}

Custom feeds are blocklists or allowlists downloaded from a URL. They work
without a subscription. To add one, click `Create custom feed` in the
`Blocklist feeds` or `Allowlist feeds` tab, fill in the form, and click
`Create`:

- `Status`: enable or disable the feed.
- `Name`: 3 to 16 lowercase letters and digits, starting with a letter.
  Names starting with `nethesis`, `yoroi` or `crowdsec` are reserved. The
  name can't be changed later.
- `Description (optional)`: a short text shown in the table.
- `List URL`: an `http://` or `https://` URL of a plain text file with one
  entry per line. IPv4 and IPv6 entries can be mixed. A blocklist holds single
  IP addresses: networks are skipped, and so are loopback, link-local,
  multicast and reserved addresses. Private addresses are skipped too, unless
  `Local network blocking` is enabled in `Settings`. An allowlist
  holds IP addresses and networks.

Up to 100,000 entries of each feed are imported. If the file can't be
downloaded, the last downloaded copy is used.

To change a custom feed, click `Edit` on its row. To remove it, select
`Delete` from the row menu. The addresses of a deleted blocklist are no
longer banned; the addresses of a deleted allowlist may be banned again.

If the server hosting the list requires HTTP Basic authentication, write the
username and password in the URL, for example
`https://user:password@example.com/blocklist.txt`. Percent-encode any `@` or
`:` in them.

:::warning
The username and password in the URL are stored in plain text. Anyone with
access to the system configuration or its backups can read them.
:::

#### Local blocklist {#local-blocklist}

IP addresses always banned by this server. Enter one IPv4 or IPv6 address per
line in `Local blocklist entries` and click `Save`, for example:

```
203.0.113.25
2001:db8::7
```

Networks are not supported, and an address that is in an allowlist is
refused. The list holds up to 1000 addresses. The addresses are banned
permanently: they stay banned after `Unban all`, `Delete all detections`, and
restarts. To unban an address, remove it from the list and click `Save`.

Temporary bans set by CrowdSec are managed from the [Activity](#activity)
page.

#### Local allowlist

Trusted IP addresses, CIDR ranges, and domain names that should never be
banned. Enter one entry per line in `Local allowlist entries` and click
`Save`, for example:

```
192.168.1.10
192.168.1.0/24
trusted.example.com
```

#### CrowdSec community blocklist

IP addresses shared by the CrowdSec community and received through the
Central API (CAPI). As default, CrowdSec will send some telemetry to remote
CrowdSec-owned servers; the servers use such data to compose a community
blocklist which is sent back to your installation. If you do not want to
share such data, disable the `Central API and signal sharing` toggle — this
also disables the `Community blocklist` toggle below it.

You can connect your instance to the [CrowdSec console](https://app.crowdsec.net)
by filling the `Enroll key (optional)` field. The `Central API status` tag
shows whether the instance is connected. The number of IPs currently listed in
the community blocklist is shown next to a search box that lets you check
whether a given IP is included.

Disabling the Central API or the community blocklist purges the CAPI-sourced
decisions from this server automatically.

CrowdSec provides a [community blocklist](https://docs.crowdsec.net/docs/next/central_api/community_blocklist) that is shared among all users; enabling `Central API and signal sharing` plus enrolling your instance in the console activates it. To access the full community blocklist (beyond the Lite version), you must share at least some ban decisions with the Central API every 24 hours. If your server has few or no bans, it will be considered as a blocking state, preventing access to the complete blocklist.

#### Stop sending banned addresses {#threat-shield-push}

Sending banned addresses to Nethesis is enabled by default for clusters with
a subscription. To turn it off, run these commands in a root shell of the
node, replacing `crowdsec1` with the application instance name:

```
runagent -m crowdsec1 sh -c 'echo NETHESIS_INSIGHTS_PUSH=False >> "$AGENT_STATE_DIR/environment"'
systemctl reload crowdsec1
```

This setting is available only from the command line. The blocklist feeds,
including `Nethesis collective defense - Level 2`, and the Nethesis global
allowlist keep working.

To send banned addresses again, remove the setting and reload the
service:

```
runagent -m crowdsec1 sh -c 'sed -i "/^NETHESIS_INSIGHTS_PUSH=/d" "$AGENT_STATE_DIR/environment"'
systemctl reload crowdsec1
```

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

### Settings

- `Local network blocking`: disabled as default, private/LAN traffic is
  never banned. Enable this toggle if you also want CrowdSec to block
  offending IPs on your local networks.
- `Block duration`: choose `Incremental` to increase the duration for
  repeated detections from the same IP, or `Fixed` to always use the same
  duration. Either way, enter the duration in minutes as free text.
- mail notification by adding one address per line inside the `Email recipients for notifications` field: notifications will work only if [Email notifications](../configuration/email_notifications.md) has been configured — a link to the cluster email settings is shown when none is configured yet.
- `Notification threshold`: CrowdSec sends a daily notification email listing newly blocked IPs to the configured recipients. If this threshold of new blocked IPs is reached before the daily report, the notification is sent immediately. Can be set between 1 and 10000 (100 as default).

## Grafana dashboards {#dashboards-section}

CrowdSec provisions three Grafana dashboards automatically. To open them, enable Grafana as explained in [Grafana dashboards](../configuration/metrics.md#grafana_access-section), then open the *modules* folder.

- `CrowdSec Overview`: how CrowdSec works inside. It shows the log lines read, parsers ok or failed, buckets, decisions and alerts. Use it to check that your logs are read and parsed.
- `CrowdSec Metrics`: lines read and parsed, buckets, decisions, bouncers, CPU and memory. Pick the instance with the `Instance` selector. Use it to see which scenarios trigger most, to check that the firewall bouncer is connected, and to spot a slow CrowdSec.
- `CrowdSec Bans`: where the local bans come from. It shows a world map, top countries, providers and scenarios, ban durations, most banned IP addresses and latest bans. Use the `CrowdSec`, `Country` and `IP` selectors to filter. Bans received from the Central API (CAPI) are not counted.

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
- `cscli decisions add --ip <ip> --duration 4h --reason "manual ban"` — manually ban an IP for a limited time; to ban an IP permanently, use the [Local blocklist](#local-blocklist)
- `cscli alerts list` — list triggered alerts (detected attacks), including ones that did not result in a ban
- `cscli bouncers list` — list registered bouncers (e.g. the firewall bouncer) and their status
- `cscli collections list` / `cscli scenarios list` — show which collections/scenarios are installed and enabled, useful to check what is being protected
- `cscli metrics` — show parser/bucket/bouncer metrics, useful to check CrowdSec is actually processing logs
- `cscli explain --file <logfile> --type <log-type>` — test a log line against parsers and scenarios, useful to debug why an attack was or wasn't detected
