=====================
Docker Hub pull limit
=====================

The Docker Hub pull limit is a restriction on the number of container image pulls you can perform from Docker Hub's repository within a specific time period.
This limit is in place to manage server load and ensure fair usage of Docker Hub's resources. The limits vary based on the type of account you have:

1. Anonymous users: those without a Docker Hub account have the lowest pull rate limit. Once this limit is exceeded, you'll encounter errors when attempting to pull images.

2. Authenticate users: registered users with free accounts have a certain number of free image pulls allowed in a given time window. After reaching this limit, you might need to wait or for more pulls.

If NethServer shares its public IP with other systems, it might encounter such rate limit.

To increase your pull limit and avoid errors, log in to your Docker Hub account when pulling images.
This authentication can grant you access to a higher pull rate limit based on your account type.

In a root shell prompt, execute the following command:

.. code-block:: shell

   runagent podman login docker.io

This command prompts for Docker Hub credentials. 
It's advisable to generate a read-only access token specifically for the NS8 system.
Refer to the Docker Hub documentation for guidance on generating tokens.

The access token returned by docker.io is stored in the ``/etc/nethserver/registry.json`` file.
Make sure the file remains world-readable, as it's required by every Unix user on the system, including NS8 modules.

To adjust the permissions accordingly, run the command:

.. code-block:: shell

   chmod -c a+r /etc/nethserver/registry.json

Repeat this process for every node within the cluster.

For more information, consult the following references:

- `Download rate limit | Docker Documentation <https://docs.docker.com/docker-hub/download-rate-limit/>`_
- `podman-login — Podman documentation <https://docs.podman.io/commands/login>`_
- `Create and manage access tokens | Docker Documentation <https://docs.docker.com/docker-hub/access-tokens/>`_
