---
title: "Migrate from Windows AD to Samba AD"
sidebar_position: 99
---
# Migrate from Windows AD to Samba AD

You may need to move an Active Directory domain from a Microsoft Windows Server
domain controller (DC) to a NethServer Samba AD domain controller, or the other
way around. This applies whether the NethServer side runs NethServer 7 or
NethServer 8, since both use the same Samba AD implementation.

:::warning
This procedure is **not officially supported** by Nethesis. It is technically
possible, but it requires solid knowledge of Active Directory internals. Test
it in a non-production environment first.
:::

## Is it possible?

Yes, in both directions:

- From a Windows Server AD DC to a NethServer Samba AD DC.
- From a NethServer Samba AD DC to a Windows Server AD DC.

There is no NethServer tool to automate this. The migration relies entirely on
standard Active Directory mechanisms, which are the same regardless of which
side runs Samba and which side runs Windows Server.

## General procedure

1. Join the new DC to the existing production domain as an **additional**
   domain controller.

   :::note
   If the existing domain runs on Windows Server AD, verify that its license
   allows additional domain controllers before joining a new one.
   :::

2. Let the new DC replicate the domain data (users, groups, policies) from the
   existing DC.
3. Transfer the FSMO (Flexible Single Master Operations) roles from the old DC
   to the new one.
4. Decommission the old DC once you have confirmed that the new DC is serving
   the domain correctly.

Useful reference material for the individual steps:

- [Joining a Windows Server 2012 / 2012 R2 DC to a Samba AD](https://wiki.samba.org/index.php/Joining_a_Windows_Server_2012_/_2012_R2_DC_to_a_Samba_AD)
- [Transfer or seize FSMO roles in AD DS](https://learn.microsoft.com/en-US/troubleshoot/windows-server/identity/transfer-or-seize-operation-master-roles-in-ad-ds)
- [AD DS metadata cleanup](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/ad-ds-metadata-cleanup)

## Before you start

- Back up both domain controllers.
- Run the migration in a test environment that mirrors production before
  touching the real domain.
- Plan for client impact: after the old DC is decommissioned, Windows clients
  must be able to reach the new DC for authentication and DNS. Update DHCP or
  DNS configuration accordingly.
- If you are moving to a NethServer Samba AD domain, see
  [Active Directory](../administrator-manual/installation/user_domains.md#active_directory-section)
  for how NethServer 8 configures the Samba DC.

Nethesis support does not cover this migration: it falls outside standard
NethServer assistance, since it depends on generic Active Directory
administration rather than a NethServer-specific feature.
