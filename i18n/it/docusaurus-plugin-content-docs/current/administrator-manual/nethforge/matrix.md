---
title: Matrix
sidebar_position: 10
---
# Matrix

Matrix è una rete aperta per comunicazioni sicure e decentralizzate. Questa implementazione fornisce una soluzione completa di chat, inclusi l'homeserver synapse e client web come [Element](https://element.io) o [Cinny](https://cinny.in/). Consulta il [sito ufficiale](https://www.matrix.org).

## Configurazione

Synapse, Element web e Cinny richiedono un host virtuale dedicato, un FQDN come `fqdn.nethserver.org`.

Prima di procedere con la configurazione, assicurati di creare i record di nome corrispondenti nel tuo server DNS. Se prevedi di usare un certificato Let's Encrypt come predefinito, assicurati anche di avere un record DNS pubblico corrispondente.

Come configurare:

1.  accedi alla pagina `Settings` dell'istanza appena installata
2.  inserisci un FQDN valido nel campo `Matrix server domain`
3.  per avviare i client web, devi inserire un FQDN valido nei campi `Element web domain` o `Cinny domain`
4.  abilita `Let's Encrypt` in base alle tue esigenze
5.  seleziona un `Timezone`
6.  fai clic sul pulsante **Save**
