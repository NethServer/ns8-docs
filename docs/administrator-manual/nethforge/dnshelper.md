---
title: dnshelper
sidebar_position: 13
---
# dnshelper

[dnshelper](https://github.com/danb35/ns8-dnshelper) lets other NethServer 8 applications create,
change and remove DNS records at your DNS host, through the DNS host's API. A mail server can
publish its DKIM key and SPF record, or an autodiscovery service its SRV records, without every
application asking you for DNS credentials.

dnshelper keeps the credentials for your DNS host and a list of access rules that say which
application may change which records. Nothing happens to your DNS until you have added a zone and
an access rule for the application that should use it.

Supported DNS hosts: Amazon Route 53, Cloudflare, Core-Networks, deSEC, DigitalOcean, Gandi
LiveDNS, GoDaddy, Google Cloud DNS, Hetzner, IONOS, Linode, name.com, OVHcloud, Porkbun, PowerDNS
(HTTP API), Vultr, and any server that accepts RFC 2136 dynamic updates with a TSIG key (BIND,
Knot, Technitium, PowerDNS...).

## Configuration

Before you start, create an **API credential** at your DNS host. It is not your account password,
but a token or key made for the purpose. Make it as narrow as your DNS host allows: limited to the
zones dnshelper should manage, and allowed to edit DNS records only. The
[user guide](https://github.com/danb35/ns8-dnshelper/blob/master/docs/USER-GUIDE.md#before-you-start)
says what each DNS host asks for and where to create it.

1. Open **Zones** and choose **Add zone**. The wizard asks for the DNS host, the credential and the
   zone, then checks that the credential works for the zone without changing anything. **Test
   write access** also adds and removes a temporary `_dnshelper-test-...` TXT record.
   **Find zones used by my modules** suggests domains already used by your mail, web server and
   other applications.
2. Open **Access** and add a rule for each application that should change records: the zone, the
   record names and the record types it may touch, or read-only access. Presets are offered for
   known applications.

One credential can serve several zones. To rotate a token, create a new one at your DNS host, edit
the credential on the **Zones** page (secret fields left empty keep the stored value), then revoke
the old token.

The **Records** page shows a zone's records and lets you add or delete one, which is useful to
check that everything works. The **Status** page links to the audit log of every change.

For developers who want their application to use dnshelper, see the
[README](https://github.com/danb35/ns8-dnshelper#using-dnshelper-from-another-module).

## Backup and restore

The backup includes dnshelper's zones, access rules **and credentials**, so that after a restore
the zones can still be changed. Treat the backup destination as sensitive; a narrow, revocable
token remains the best protection.

## Known limitations

1. dnshelper never changes a zone's NS and SOA records, and refuses a CNAME that would conflict
   with other records of the same name.
2. Removing a zone from dnshelper does not delete its records at the DNS host, and deleting a
   credential does not revoke the token at the DNS host.
3. Each DNS host has its own limits: some raise short TTLs to their minimum, some cannot store
   certain characters in TXT values, and some are slow or rate limited. See the
   [user guide](https://github.com/danb35/ns8-dnshelper/blob/master/docs/USER-GUIDE.md#when-something-goes-wrong).
4. dnshelper assumes it is the only tool changing the records it manages. Records added by hand at
   the DNS host are kept, but a change made there at the same time as one by dnshelper may be lost.
