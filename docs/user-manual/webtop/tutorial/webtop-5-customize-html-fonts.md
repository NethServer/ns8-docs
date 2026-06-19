---
title: "WebTop-5: Customize the font list in the HTML editor"
sidebar_position: 99
---
# WebTop-5: Customize the font list in the HTML editor

You can change the list of fonts available in every HTML editor by adding a global setting in the admin panel.

Use the `com.sonicle.webtop.core` service and set the key `editor.fonts`.

Adding this setting replaces the default list, so include the default fonts too if you still want them:

`Arial, Comic Sans MS, Courier New, Helvetica, Tahoma, Times New Roman, Verdana`

Font names must be separated by commas.

From the shell, run:

```bash
su - postgres -c 'psql webtop5'
```

Then insert the custom font list:

```sql
INSERT INTO "core"."settings" ("service_id", "key", "value")
VALUES ('com.sonicle.webtop.core', 'editor.fonts', 'Arial,Font,Comic Sans MS,Courier New,Helvetica,Tahoma,Times New Roman,Verdana');
```

You can also customize the available font sizes with the `editor.fontsizes` key.

![Custom font list in WebTop](/_static/tutorial/webtop-5-personalizzazione-elenco-font-disponibili-nelleditor-html/csCd50JQG-8KfP69MhqYpWVagUtqHqKCvA.png)
