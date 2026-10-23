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

1.  Access the application **Settings** page and enter the required **GitLab Hostname** (e.g. git.example.com).
2.  Set the **Initial Root Password** (minimum 8 characters) used for the oot administrator account on first setup.
3.  Enable **Request Let's Encrypt Certificate** and **Redirect HTTP to HTTPS** according to your needs.
4.  Optionally select an **LDAP / AD Domain** from the available [user domains](../installation/user_domains.md) to allow domain users to sign in.
5.  Optionally enter a dedicated **Container Registry Hostname** (e.g. egistry.example.com) to enable the integrated GitLab Container Registry via Traefik.
6.  Keep **Enable GitLab Runner** enabled if you want the module to run and automatically register a local rootless Podman CI/CD runner.
7.  Click the **Save** button.

:::note

On its very first start, GitLab CE initializes PostgreSQL, Gitaly, and database migrations. Please allow **3 to 6 minutes** after saving the configuration for the web interface and automatic runner registration to become ready.

:::

## Git over SSH

Each GitLab instance automatically allocates a dedicated TCP port for Git-over-SSH operations and opens it in the node firewall. The allocated **Git SSH Port** is displayed directly on the application **Settings** page (for example ssh://git@git.example.com:20017/group/project.git).

## Official documentation

See the [NS8-GitLab module repository](https://github.com/BLS-ISP/NS8-GitLab) and the [official GitLab documentation](https://docs.gitlab.com/) for further details.