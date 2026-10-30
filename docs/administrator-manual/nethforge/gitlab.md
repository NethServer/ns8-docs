---
title: GitLab
sidebar_position: 13
---
# GitLab

[GitLab Community Edition](https://about.gitlab.com/) is an open source DevSecOps platform for Git repository management, code reviews, issue tracking, CI/CD pipelines, and container registry hosting.

On NethServer 8, you can install it from the NethForge repository and deploy one or more instances.

## Configuration

Enable the NethForge repository from the [Software repositories](../installation/software_center.md#software_repositories-section) page if it is not already available, then install **GitLab** from the [Software center](../installation/software_center.md).

Before proceeding with the configuration, make sure to create the corresponding DNS records pointing to your NethServer 8 node. If you plan to use Let's Encrypt certificates, ensure that public DNS records exist for the configured hostnames.

How to configure:

1. Access the application **Settings** page and enter the required **GitLab Hostname (FQDN)** (e.g. `git.example.com`).
2. Enable **Request Let's Encrypt certificate** and **Redirect HTTP to HTTPS** according to your needs.
3. Optionally enter a **Root password** (minimum 8 characters) for the `root` administrator account. If left empty on initial setup, the module generates a random password automatically and stores it in `state/passwords.env` (see below for how to retrieve it, or enter a new password in **Settings** at any time to reset it).
4. Optionally select an **LDAP / Active Directory domain** from the available [user domains](../installation/user_domains.md) to allow domain users to sign in.
5. Optionally enter a dedicated **Container Registry Hostname** (e.g. `registry.example.com`) to enable the integrated GitLab Container Registry via Traefik.
6. Choose whether to keep **Enable integrated GitLab Runner** enabled so the module runs and automatically registers a local rootless Podman CI/CD runner.
7. Click the **Save** button.

### Retrieving the generated root password

If you left the **Root password** field empty during initial configuration, you can retrieve the generated `root` password on the NethServer 8 node with:

```bash
runagent -m gitlab1 grep '^GITLAB_INITIAL_PASSWORD=' passwords.env
```

Replace `gitlab1` with your actual module instance name. Alternatively, you can enter a new password (at least 8 characters) in the **Root password** field on the **Settings** page and click **Save** to update the `root` password directly.

:::warning

When **Enable integrated GitLab Runner** is active, CI/CD jobs execute inside containers spawned via the module's rootless Podman socket (`podman.sock`). Because CI jobs have access to the module's Podman socket, a job can control the `gitlab-app` container and read its volumes or secrets. Only enable the integrated runner if you trust all users who can trigger CI/CD pipelines on the instance, or use an external GitLab Runner on a separate host for untrusted projects.

:::

:::note

On its very first start, GitLab CE initializes PostgreSQL, Gitaly, and database migrations. Please allow **3 to 6 minutes** after saving the configuration for the web interface and automatic runner registration to become ready.

:::

## Git over SSH

Each GitLab instance automatically allocates a dedicated TCP port for Git-over-SSH operations and opens it in the node firewall. The allocated **Git SSH port** is displayed directly on the application **Settings** page (for example `ssh://git@git.example.com:20017/group/project.git`).

## Official documentation

See the [NS8-GitLab module repository](https://github.com/BLS-ISP/NS8-GitLab) and the [official GitLab documentation](https://docs.gitlab.com/) for further details.
