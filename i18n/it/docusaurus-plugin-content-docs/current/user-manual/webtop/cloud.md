---
title: Cloud
sidebar_position: 7
---
# Cloud

Usa questa sezione per gestire risorse Nextcloud, link del cloud personale, chat e integrazioni del launcher in WebTop.

## Integrazione con Nextcloud

Prima di procedere, verifica che il modulo **Nextcloud** sia stato installato dal [Software center](../../administrator-manual/installation/software_center.md).

Per impostazione predefinita, l'integrazione con Nextcloud è disabilitata per tutti gli utenti. Per abilitarla, usa il pannello di amministrazione a cui puoi accedere usando la password amministrativa di WebTop.

Se vuoi abilitare il servizio per tutti gli utenti, procedi come segue:

1.  accedi al pannello di amministrazione e seleziona **Groups**:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_groups.png)

2.  modifica le proprietà del gruppo "users" facendo doppio clic e selezionando il pulsante relativo alle autorizzazioni:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_permission.png)

3.  aggiungi alle autorizzazioni esistenti quelle relative alle risorse `STORE_CLOUD` e `STORE_OTHER`, selezionando le voci come mostrato di seguito:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_1.png)

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_2.png)

per ottenere questo risultato:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_3.png)

4.  salva e chiudi.

Da questo momento ogni utente potrà inserire la risorsa Nextcloud (locale o remota) nel Cloud personale.

Per farlo, basta selezionare il pulsante Cloud e aggiungere una nuova risorsa Nextcloud facendo clic con il tasto destro su **My resources** e poi su **Add resource** in questo modo:

![image](/_static/user-manual/webtop/screenshots/webtop-nextcloud_1.png)

Si aprirà una procedura guidata precompilata:

![image](/_static/user-manual/webtop/screenshots/webtop-nextcloud_2.png)

:::note

Ricorda di compilare i campi `User name` e `Password` relativi all'accesso alla risorsa Nextcloud, altrimenti non sarà possibile usare il link pubblico ai file condivisi.

:::

:::note

Il **Path** deve essere modificato da `/nextcloud/remote.php/webdav` a `/remote.php/webdav`. Assicurati inoltre di inserire il FQDN di Nextcloud nel campo **Host** (ad esempio `nextcloud.mydomain.com`).

:::

Procedi con il pulsante **Next** fino al completamento del wizard.

## Cloud personale

Il modulo Cloud personale ti permette di inviare e ricevere documenti tramite link web.

### Come creare un link per inviare un documento

Per creare il link, seleziona il pulsante in alto a destra:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud1.png)

Segui il wizard per generare il link e usa il campo **date** per impostare la scadenza.

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud2.png)

puoi creare una **password** per proteggerlo:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud3.png)

Il link verrà generato e inserito nella nuova email:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud4.png)

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud5.png)

Il download del file genera una notifica al mittente:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud6.png)

### Richiesta di un documento

Per creare la richiesta, inserisci l'oggetto dell'email e poi seleziona il pulsante in alto a destra:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud7.png)

Segui il wizard. Puoi impostare sia una data di scadenza sia una password. Il link verrà inserito automaticamente nel messaggio:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud8.png)

Verrà inviata un'email di richiesta per caricare il documento nel Cloud:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud9.png)

Il mittente riceverà una notifica per ogni file caricato:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud10.png)

Per scaricare i file ti basta accedere al tuo `Cloud --> Uploads --> Folder` personale con data e nome:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud11.png)

## Integrazione chat {#webtop-chat}

L'installazione dell'integrazione web chat è disabilitata per impostazione predefinita per tutti gli utenti.

Per abilitare l'integrazione chat:

1.  Installa l'applicazione "Ejabberd" dalla pagina `Software center`. Vedi [Installare applicazioni](../../administrator-manual/installation/software_center.md#install-applications) ed [Ejabberd](../../administrator-manual/applications/ejabberd.md).
2.  Nella pagina `Settings` di Ejabberd, il campo `Ejabberd domain (FQDN)` deve corrispondere al valore di `Mail domain` nelle impostazioni di WebTop.
3.  Accedi a WebTop come utente admin e abilita l'autorizzazione alla web chat:
    - accedi al menu **Administration**, quindi `Domains --> NethServer --> Groups --> Users --> Authorizations`
    - `Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource --> WEBCHAT --> Action --> ACCESS`
    - fai clic su **OK**, quindi salva e chiudi

## Personalizzazione del launcher

Il launcher è il menu a icone sul lato sinistro della pagina. Puoi aggiungere pulsanti personalizzati al launcher.

Per configurare i pulsanti, accedi al pannello di amministrazione WebTop e seleziona -\> **Domains** -\> **NethServer** -\> **Launcher**:

![image](/_static/user-manual/webtop/screenshots/webtop_launchers.png)

Per ogni pulsante, inserisci questi tre valori:

- `Name`: testo descrittivo della scheda mostrato al passaggio del mouse
- `Link URL`: URL da aprire in un nuovo browser
- `Icon URL`: URL dell'immagine dell'icona; deve sempre essere un indirizzo raggiungibile pubblicamente. Per evitare problemi di scalatura, usa immagini vettoriali

Se non riesci a trovare un URL pubblico per l'immagine dell'icona, puoi caricarla nel cloud pubblico di WebTop. Il cloud pubblico di WebTop ospita già le immagini delle mailcard. Accedi al pannello di amministrazione e fai clic su **Cloud** -\> **Public Images**, quindi inserisci un URL come `https://<public_name_server>/webtop/resources/156c0407/images/<icon.svg>`.

I pulsanti dei link personalizzati configurati verranno mostrati a tutti gli utenti al successivo accesso.
