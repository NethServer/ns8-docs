---
title: "Problemi di bind LDAP con versioni recenti di Microsoft Active Directory"
sidebar_position: 99
---
# Problemi di bind LDAP con versioni recenti di Microsoft Active Directory

Le versioni recenti di Microsoft Active Directory, inclusa Windows Server 2025, applicano
requisiti di sicurezza piu` restrittivi. Le operazioni di bind LDAP verso una base utenti AD
remota possono fallire se il domain controller non soddisfa i requisiti richiesti per signing
o TLS.

Puoi verificare il problema con un comando di test come questo:

```bash
LDAPTLS_REQCERT=never ldapsearch -D 'binduser@test.local' -w 'Test123!!' -b 'DC=test,DC=local' -Z -H ldap://192.168.10.100:389

ldap_start_tls: Server is unavailable (52)
    additional info: 00000000: LdapErr: DSID-0C0916FB, comment: Error initializing SSL/TLS, data 0, v65f4
ldap_bind: Strong(er) authentication required (8)
    additional info: 00002028: LdapErr: DSID-0C0903CE, comment: The server requires binds to turn on integrity checking if SSL\TLS are not already active on the connection, data 0, v65f4
```

## Come gestire il problema

Hai due possibili approcci:

1. Configura il domain controller Microsoft con un certificato TLS autorevole per query
   LDAPS oppure LDAP+TLS.
2. Disabilita il signing LDAP lato Active Directory.

:::warning
Disabilitare il signing LDAP riduce il livello di sicurezza dell'ambiente Active Directory.
Quando possibile, preferisci l'uso di un certificato TLS attendibile.
:::

Per maggiori dettagli, consulta la documentazione Microsoft:

- <https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025#active-directory-domain-services>
- <https://learn.microsoft.com/en-us/answers/questions/2337889/issue-with-ldap-on-windows-server-2025>
