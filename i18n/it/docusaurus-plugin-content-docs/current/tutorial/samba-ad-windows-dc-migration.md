---
title: "Migrare da Windows AD a Samba AD"
sidebar_position: 99
---
# Migrare da Windows AD a Samba AD

Potresti aver bisogno di spostare un dominio Active Directory da un domain
controller (DC) Microsoft Windows Server a un domain controller Samba AD di
NethServer, o viceversa. La procedura è valida sia che il lato NethServer usi
NethServer 7 sia NethServer 8, perché entrambi usano la stessa implementazione
Samba AD.

:::warning
Questa procedura **non è ufficialmente supportata** da Nethesis. È tecnicamente
possibile, ma richiede una solida conoscenza dei meccanismi interni di Active
Directory. Testala prima in un ambiente non di produzione.
:::

## È possibile farlo?

Sì, in entrambe le direzioni:

- Da un DC Windows Server AD a un DC Samba AD di NethServer.
- Da un DC Samba AD di NethServer a un DC Windows Server AD.

Non esiste uno strumento NethServer per automatizzare questa procedura. La
migrazione si basa esclusivamente sui meccanismi standard di Active Directory,
identici indipendentemente da quale lato usa Samba e quale usa Windows Server.

## Procedura generale

1. Effettua il join del nuovo DC al dominio di produzione esistente come DC
   **aggiuntivo**.

   :::note
   Se il dominio esistente è basato su Windows Server AD, verifica che la
   licenza consenta domain controller aggiuntivi prima di procedere con il
   join.
   :::

2. Lascia che il nuovo DC replichi i dati del dominio (utenti, gruppi, policy)
   dal DC esistente.
3. Trasferisci i ruoli FSMO (Flexible Single Master Operations) dal vecchio DC
   al nuovo.
4. Rimuovi il vecchio DC solo dopo aver verificato che il nuovo DC serva
   correttamente il dominio.

Materiale di riferimento utile per i singoli passaggi:

- [Joining a Windows Server 2012 / 2012 R2 DC to a Samba AD](https://wiki.samba.org/index.php/Joining_a_Windows_Server_2012_/_2012_R2_DC_to_a_Samba_AD)
- [Transfer or seize FSMO roles in AD DS](https://learn.microsoft.com/en-US/troubleshoot/windows-server/identity/transfer-or-seize-operation-master-roles-in-ad-ds)
- [AD DS metadata cleanup](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/ad-ds-metadata-cleanup)

## Prima di iniziare

- Esegui il backup di entrambi i domain controller.
- Esegui la migrazione in un ambiente di test che rispecchi la produzione
  prima di intervenire sul dominio reale.
- Pianifica l'impatto sui client: dopo la rimozione del vecchio DC, i client
  Windows devono poter raggiungere il nuovo DC per autenticazione e DNS.
  Aggiorna di conseguenza la configurazione DHCP o DNS.
- Se stai migrando verso un dominio Samba AD di NethServer, consulta
  [Active Directory](../administrator-manual/installation/user_domains.md#active_directory-section)
  per capire come NethServer 8 configura il DC Samba.

L'assistenza Nethesis non copre questa migrazione: esula dall'assistenza
standard di NethServer, perché dipende dall'amministrazione generica di
Active Directory piuttosto che da una funzionalità specifica di NethServer.
