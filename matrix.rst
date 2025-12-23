.. _matrix-section:

======
Matrix
======

Matrix is an open network for secure, decentralised communication. This implementation provides a complete chat solution, 
including the synapse homeserver and web clients like Element web or Cinny.
Please see the `official website <https://www.matrix.org>`_.

Configuration
=============

Synapse, Element web and Cinny need a dedicated virtual host, a FQDN like ``fqdn.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server.
If you are planning to use a Let's Encrypt certificate as default, make also sure to have a corresponding public DNS record.

How to configure:

1. access the ``Settings`` page of the newly installed instance
2. enter a valid FQDN inside the ``Matrix server domain`` field
3. to start the web clients, you need to enter a valid FQDN inside the ``Element web domain`` or the ``Cinny domain`` fields.
4. enable ``Let's Encrypt`` and ``HTTP to HTTPS`` options accordingly to your needs
5. select a ``Timezone``
6. click the :guilabel:`Save` button
