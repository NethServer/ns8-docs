---
title: Matrix
sidebar_position: 10
---
# Matrix

Matrix is an open network for secure, decentralised communication. This implementation provides a complete chat solution, including the synapse homeserver and web clients like [Element](https://element.io) or [Cinny](https://cinny.in/). Please see the [official website](https://www.matrix.org).

## Configurazione

Synapse, Element web and Cinny need a dedicated virtual host, a FQDN like `fqdn.nethserver.org`.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server. If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

Come configurare:

1.  accedere alla pagina `Impostazioni` dell'istanza appena installata
2.  enter a valid FQDN inside the `Matrix server domain` field
3.  to start the web clients, you need to enter a valid FQDN inside the `Element web domain` or the `Cinny domain` fields
4.  enable `Let's Encrypt` accordingly to your needs
5.  select a `Timezone`
6.  cliccare sul pulsante **Save**
