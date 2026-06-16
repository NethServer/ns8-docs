---
title: "WebTop-5: personalizzare l'elenco dei font disponibili nell'editor HTML"
sidebar_position: 99
---
# WebTop-5: personalizzare l'elenco dei font disponibili nell'editor HTML

Puoi modificare l'elenco dei font disponibili in ogni editor HTML aggiungendo un'impostazione globale dal pannello di amministrazione.

Usa il servizio `com.sonicle.webtop.core` e imposta la chiave `editor.fonts`.

Aggiungendo questa impostazione sostituisci l'elenco predefinito, quindi includi anche i font di default se vuoi mantenerli:

`Arial, Comic Sans MS, Courier New, Helvetica, Tahoma, Times New Roman, Verdana`

I nomi dei font devono essere separati da virgole.

Dalla shell esegui:

```bash
su - postgres -c 'psql webtop5'
```

Poi inserisci l'elenco personalizzato dei font:

```sql
INSERT INTO "core"."settings" ("service_id", "key", "value")
VALUES ('com.sonicle.webtop.core', 'editor.fonts', 'Arial,Font,Comic Sans MS,Courier New,Helvetica,Tahoma,Times New Roman,Verdana');
```

Puoi anche personalizzare le dimensioni dei font disponibili con la chiave `editor.fontsizes`.

![Elenco font personalizzato in WebTop](/_static/tutorial/webtop-5-personalizzazione-elenco-font-disponibili-nelleditor-html/csCd50JQG-8KfP69MhqYpWVagUtqHqKCvA.png)
