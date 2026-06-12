---
title: "Gestire gli allegati firmati .p7m bloccati da Rspamd"
sidebar_position: 99
---
# Gestire gli allegati firmati .p7m bloccati da Rspamd

Gli allegati email firmati con estensione `.p7m` possono essere bloccati da Rspamd e impedire
l'invio o la ricezione dei messaggi.

Per verificare che il problema sia questo, apri la [Rspamd web interface](../administrator-manual/applications/mail.md#rspamd-web-interface).
Su NethServer 8 puoi raggiungerla anche dalle impostazioni del filtro del server mail in
`cluster-admin`.

![Collegamento a Rspamd in cluster-admin](/_static/tutorial/rspamd-p7m-attachments/cluster-admin-shortcut.png)

:::note
Usa le stesse credenziali che utilizzi per accedere a `cluster-admin`.
:::

## Analizzare il punteggio

Apri la scheda **History** per controllare il punteggio assegnato a ogni messaggio.

![Scheda History di Rspamd](/_static/tutorial/rspamd-p7m-attachments/history-tab.png)

Quando si presenta questo problema, nei messaggi interessati compaiono di solito questi due
simboli:

- `BOGUS_ENCRYPTED_AND_TEXT (10)`
- `BROKEN_HEADERS (10)`

Poiche' aggiungono `10 + 10` punti, possono superare facilmente la soglia di rifiuto e attivare
l'azione **Reject**.

![Messaggio rifiutato a causa del punteggio](/_static/tutorial/rspamd-p7m-attachments/reject-score.png)

## Applicare il workaround

Abbassa il punteggio di entrambi i simboli da `10` a `1`.

Puoi modificarli dalla scheda **Symbols** dell'interfaccia web di Rspamd. Usa il campo di
ricerca con le chiavi `BOGUS` e `BROKEN` per trovare i simboli.

![Ricerca dei simboli in Rspamd](/_static/tutorial/rspamd-p7m-attachments/symbols-search.png)

![Riduzione del punteggio dei simboli](/_static/tutorial/rspamd-p7m-attachments/symbols-values.png)

Dopo aver salvato i nuovi valori, non devi fare altro. I messaggi successivi che contengono
questo tipo di allegati firmati verranno ricevuti o inviati normalmente.
