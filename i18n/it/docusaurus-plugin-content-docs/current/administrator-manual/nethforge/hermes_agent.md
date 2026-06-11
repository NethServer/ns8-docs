---
title: Hermes Agent
sidebar_position: 12
---
# Hermes Agent

[Hermes Agent](https://hermes-agent.nousresearch.com/) is an autonomous AI agent from Nous Research. On NethServer 8, you can install it from the NethForge repository and deploy one or more instances. Each instance has its own dashboard virtual host and can manage one or more Hermes agents.

## Configurazione

Enable the NethForge repository from the [Software repositories](../installation/software_center.md#software_repositories-section) page if it is not already available, then install Hermes Agent from the Software Center.

After installation, open the instance settings page and configure the application:

1.  Enter a dedicated virtual host for the dashboard, for example `hermes.example.com`. Create the corresponding DNS record before publishing the service. If the name is publicly reachable, you can enable the **Let's Encrypt certificate** option.
2.  Select one of the available [user domains](../installation/user_domains.md). The instance uses that domain to authenticate users on the shared dashboard.
3.  Add one or more agents. For each agent, enter a name, choose a role, and assign an **Allowed user** from the selected user domain.
4.  Click the **Save** button.

Each agent is assigned to one user, and the same user cannot be assigned to multiple agents inside the same Hermes Agent instance.

After saving, browse to `https://hermes.example.com`. The Hermes Agent web dashboard is published on the configured virtual host. Users sign in with their credentials from the selected user domain and are routed to the agent assigned to them.

## Command line interface

Initial Hermes configuration is often easier from the command line than from the web dashboard.

To open the Hermes text interface for agent 1 of the `hermes-agent1` instance:

    runagent -m hermes-agent1 podman exec -it hermes-1 hermes

To start the guided setup for the same agent:

    runagent -m hermes-agent1 podman exec -it hermes-1 hermes setup

To configure Telegram or another messaging gateway from the command line:

    runagent -m hermes-agent1 podman exec -it hermes-1 hermes gateway setup

Replace `hermes-agent1` with your instance name and `1` with the target agent ID.

## Official documentation

See the official [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs/) for details about providers, gateways, CLI commands, and advanced configuration.
