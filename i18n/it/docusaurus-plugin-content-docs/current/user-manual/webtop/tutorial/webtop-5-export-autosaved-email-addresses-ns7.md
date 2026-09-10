---
title: "WebTop-5: esportare indirizzi e-mail salvati automaticamente da NS7 e importarli su NS8"
sidebar_position: 99
---
# WebTop-5: esportare indirizzi e-mail salvati automaticamente da NS7 e importarli su NS8

Gli indirizzi email salvati automaticamente da WebTop durante l'invio non sono esposti tra le rubriche, ma vengono salvati nel database. Per questa ragione non puoi esportarli facilmente dall'interfaccia web.

Se non esegui una migrazione di WebTop da NS7 a NS8 tramite il tool, può essere necessario esportare questa lista di indirizzi e poi importarla come file CSV nel nuovo WebTop installato su NS8.

Per esportare gli indirizzi, accedi alla shell del server NS7 ed esegui questa query per ogni utente da cui vuoi esportare la lista. Sostituisci entrambe le occorrenze di `userx` con l'utente di destinazione:

```bash
su - postgres -c "psql webtop5 -c \"copy (select value as email from core.servicestore_entries where user_id ='userx' and context='recipients') to '/tmp/recipients_userx.csv' delimiter ',' csv header;\""
```

Il file CSV creato nel percorso `/tmp/recipients_userx.csv` può essere importato dall'interfaccia web in una nuova rubrica sul nuovo WebTop installato su NS8. Vedi [Importare contatti](../contacts.md#importare-contatti).
