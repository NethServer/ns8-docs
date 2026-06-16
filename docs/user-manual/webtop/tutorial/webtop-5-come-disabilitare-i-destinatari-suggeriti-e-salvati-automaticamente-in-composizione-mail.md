---
title: "WebTop-5: Disable suggested and auto-saved recipients in mail compose"
sidebar_position: 99
---
# WebTop-5: Disable suggested and auto-saved recipients in mail compose

You can disable the suggestion of email addresses that were saved automatically while you compose a message.

Add this global setting in the admin panel for the `com.sonicle.webtop.core` service:

`recipient.provider.auto.enabled = false`

The default value is `true`.

:::note
This is a global setting, so the change applies to all users.
:::

![Disable auto-suggested recipients](/_static/tutorial/webtop-5-come-disabilitare-i-destinatari-suggeriti-e-salvati-automaticamente-in-composizione-mail/hCXoP_bmtC-GPyuDzHVSNbVjB70YlJJ5dQ.png)
