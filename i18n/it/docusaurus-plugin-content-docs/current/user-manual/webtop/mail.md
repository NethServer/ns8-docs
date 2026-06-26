---
title: Mail
sidebar_position: 3
---
# Mail

Usa questa sezione per gestire messaggi, cartelle e composizione della posta in WebTop.

## Condivisione dell'email

È possibile condividere una singola cartella o l'intero account con tutte le sottocartelle. Seleziona la cartella da condividere -\> clic destro -\> **Manage sharing**:

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_mail_folder_1.png)

- seleziona l'utente con cui condividere la risorsa (1)
- seleziona se vuoi condividere la tua identità con l'utente e perfino forzare la tua firma (2)
- scegli il livello di permessi associato a questa condivisione (3)
- se devi modificare ulteriormente i permessi, seleziona `Advanced` (4)
- infine, scegli se applicare la condivisione solo alla cartella da cui sei partito, solo al ramo di sottocartelle oppure all'intero account (5)

![image](/_static/user-manual/webtop/screenshots/webtop-sharing_mail_folder_2.png)

:::note

L'opzione **Force mailcard** può essere usata solo se la mailcard è stata associata all'indirizzo email.

:::

## Anteprima rapida dei messaggi

Per impostazione predefinita, la pagina della posta mostra un'anteprima del contenuto degli ultimi messaggi ricevuti.

Questa funzione può essere abilitata o disabilitata dal menu **Settings**, nella scheda **Mail**. La checkbox si chiama **Show quick preview on message row**.

## Archiviazione della posta

L'archiviazione è utile per mantenere organizzata la cartella Posta in arrivo spostando manualmente i messaggi.

:::note

L'archiviazione della posta non è un backup.

:::

Il sistema crea automaticamente una nuova cartella speciale **Archives**.

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive1.png)

Se la cartella **Archives** non appare subito dopo l'accesso, comparirà al primo utilizzo dell'archiviazione.

Esistono tre criteri di archiviazione:

- **Single folder:** una singola radice per tutte le email archiviate
- **Per year:** una radice per ogni anno
- **By year / month:** una radice per ogni anno e mese

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive2.png)

Per mantenere la struttura originale delle cartelle è possibile attivare **Keep folders structure**.

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive3.png)

L'operazione di archiviazione è accessibile dal menu contestuale (clic destro). Fai clic su **Archive**.

![image](/_static/user-manual/webtop/screenshots/webtop-archive_archive4.png)

Il sistema elaborerà l'archiviazione in base alle ultime impostazioni scelte.

## Sottoscrizione delle cartelle IMAP

Per impostazione predefinita, tutte le cartelle IMAP sul server vengono sottoscritte automaticamente e quindi sono visibili fin dal primo accesso.

Se vuoi nascondere alcune cartelle dalla vista, operazione equivalente alla rimozione della sottoscrizione, puoi semplicemente fare clic con il tasto destro sulla cartella da nascondere e selezionare dal menu interattivo la voce **Hide from list**.

Per esempio, se vuoi nascondere la sottocartella `folder1` da questo elenco, fai clic con il tasto destro su di essa e seleziona **Hide from list**:

![image](/_static/user-manual/webtop/screenshots/webtop-sub_imap_folder1.png)

È possibile gestire la visibilità delle cartelle nascoste selezionando la funzione **Manage visibility**:

![image](/_static/user-manual/webtop/screenshots/webtop-sub_imap_folder2.png)

Per esempio, se vuoi ripristinare la sottoscrizione della cartella **folder1** appena nascosta, selezionala dall'elenco delle cartelle nascoste e fai clic sull'icona a sinistra:

![image](/_static/user-manual/webtop/screenshots/webtop-sub_imap_folder3.png)

## Notifiche del browser

WebTop può notificare i nuovi messaggi email e gli eventi imminenti del calendario.

Per attivare questa funzione, ti basta accedere alle impostazioni generali del tuo utente:

![image](/_static/user-manual/webtop/screenshots/webtop-desktop_notifications.png)

È possibile abilitare le notifiche desktop in due modalità:

- **Always**: le notifiche verranno sempre mostrate, anche con il browser aperto
- **Auto (in background only)**: le notifiche verranno mostrate solo quando il browser è in background

Assicurati di consentire le notifiche nel tuo browser.

Se hai bisogno di abilitare questo consenso in seguito su un browser diverso, fai clic sull'apposito pulsante:

![image](/_static/user-manual/webtop/screenshots/webtop-button_desktop_notifications.png)

## Integrazione chat {#webtop-chat}

L'installazione dell'integrazione web chat è disabilitata per impostazione predefinita per tutti gli utenti.

Per abilitare l'integrazione chat:

1.  Installa l'applicazione "Ejabberd" dalla pagina `Software center`. Vedi [Installare applicazioni](../../administrator-manual/installation/software_center.md#install-applications) ed [Ejabberd](../../administrator-manual/applications/ejabberd.md).
2.  Nella pagina `Settings` di Ejabberd, il campo `Ejabberd domain (FQDN)` deve corrispondere al valore di `Mail domain` nelle impostazioni di WebTop.
3.  Accedi a WebTop come utente admin e abilita l'autorizzazione alla web chat:
    - accedi al menu **Administration**, quindi `Domains --> NethServer --> Groups --> Users --> Authorizations`
    - `Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource --> WEBCHAT --> Action --> ACCESS`
    - fai clic su **OK**, quindi salva e chiudi

## Personalizzazione del composer della posta

### Nascondere il destinatario suggerito automaticamente nelle ricerche

Puoi disabilitare il suggerimento degli indirizzi salvati automaticamente. Accedi al pannello di amministrazione web -\> **Properties (system)** -\> **Add** -\>, seleziona **com.sonicle.webtop.core (WebTop)** e inserisci i dati nei campi **Key** e **Value** in base alla chiave da configurare:

`recipient.provider.auto.enabled` = false (predefinito: true)

### Modificare l'oggetto di un'email e salvarlo

Per abilitare la modifica dell'oggetto per le email ricevute e inviate, accedi al pannello di amministrazione web -\> **Properties (system)** -\> **Add** -\> seleziona **com.sonicle.webtop.mail (Mail)** e inserisci i dati nei campi **Key** e **Value** in base alla chiave da configurare:

`message.edit.subject` = true (predefinito: false)

### Eliminare gli indirizzi email suggeriti automaticamente

Quando compili il destinatario di un'email, vengono suggeriti alcuni indirizzi email salvati automaticamente. Se devi eliminarne uno perché errato, spostati con i tasti freccia fino a selezionare quello che vuoi cancellare (senza farci clic sopra), quindi eliminalo con **Shift + Canc**
