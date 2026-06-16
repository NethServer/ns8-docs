---
title: "WebTop-5: usare l'integrazione con Mailchimp"
sidebar_position: 99
---
# WebTop-5: usare l'integrazione con Mailchimp

Questa integrazione sincronizza le rubriche personali con Mailchimp, così puoi gestire i contatti solo da WebTop.

La configurazione richiede una licenza. Dopo averla attivata nel pannello di amministrazione, recupera o crea la chiave API di Mailchimp da **Extras** → **API Keys** e createla se necessario.

Poi aggiungi la chiave in WebTop come impostazione globale per `com.sonicle.webtop.contacts`:

`mailchimp.apikey`

Se serve, puoi anche impostare una chiave API personale per utenti specifici.

Gli utenti non sono autorizzati a usare l'integrazione per impostazione predefinita. Assegna il permesso **MAILCHIMP** agli utenti o ai gruppi necessari.

Dal menu contestuale della Rubrica o della categoria, gli utenti possono scegliere **Sync with Mailchimp** e seguire il wizard:

1. Sincronizza verso Mailchimp.
2. Ricevi le nuove sottoscrizioni.
3. Avvia la sincronizzazione.

Le etichette si sincronizzano solo da WebTop verso Mailchimp, mentre i contatti possono essere sincronizzati in entrambe le direzioni.

:::note
Mailchimp non elimina i contatti. Durante la sincronizzazione, i contatti eliminati restano senza etichette in Mailchimp.
:::

![Chiave API Mailchimp](/_static/tutorial/webtop-5-come-usare-lintegrazione-con-mailchimp/yv0tQDtEPRTIGOwPmXQQi5Mth1r3DUpngQ.png)

![Impostazione Mailchimp in WebTop](/_static/tutorial/webtop-5-come-usare-lintegrazione-con-mailchimp/QKDiDIxfxG1cBXv19MpcQdRdTx6fQ2Ha_Q.png)

![Assegnare il permesso Mailchimp](/_static/tutorial/webtop-5-come-usare-lintegrazione-con-mailchimp/2g_UM1Rq_UsW1qhFeKNOrhTsuBWExpE26A.png)

![Wizard di sincronizzazione Mailchimp](/_static/tutorial/webtop-5-come-usare-lintegrazione-con-mailchimp/IrscIA8b3H23CCiKiviiU1_5pWhIvGJpaQ.png)
