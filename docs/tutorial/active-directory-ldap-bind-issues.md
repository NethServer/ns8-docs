---
title: "LDAP bind issues with recent Microsoft Active Directory versions"
sidebar_position: 99
---
# LDAP bind issues with recent Microsoft Active Directory versions

Recent Microsoft Active Directory versions, including Windows Server 2025, enforce stricter
security requirements. LDAP bind operations against a remote AD user database can fail if the
domain controller does not meet the required signing or TLS conditions.

You can reproduce the issue with a test command such as:

```bash
LDAPTLS_REQCERT=never ldapsearch -D 'binduser@test.local' -w 'Test123!!' -b 'DC=test,DC=local' -Z -H ldap://192.168.10.100:389

ldap_start_tls: Server is unavailable (52)
    additional info: 00000000: LdapErr: DSID-0C0916FB, comment: Error initializing SSL/TLS, data 0, v65f4
ldap_bind: Strong(er) authentication required (8)
    additional info: 00002028: LdapErr: DSID-0C0903CE, comment: The server requires binds to turn on integrity checking if SSL\TLS are not already active on the connection, data 0, v65f4
```

## How to address the issue

There are two possible approaches:

1. Configure the Microsoft domain controller with an authoritative TLS certificate for
   LDAPS or LDAP+TLS queries.
2. Disable LDAP signing on the Active Directory side.

:::warning
Disabling LDAP signing lowers the security level of the Active Directory environment. Prefer
using a trusted TLS certificate whenever possible.
:::

For more details, refer to the Microsoft documentation:

- <https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025#active-directory-domain-services>
- <https://learn.microsoft.com/en-us/answers/questions/2337889/issue-with-ldap-on-windows-server-2025>
