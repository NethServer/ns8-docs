---
title: Portale utente
sidebar_position: 1
sidebar_label: Portale utente
pagination_label: Portale utente
---

# Portale utente

Il portale utente è un'interfaccia web che ti permette di gestire il tuo account e le tue impostazioni su NethServer 8.

## Accesso al portale utente

Puoi accedere al portale utente dal browser web all'indirizzo:

```
https://<your-server-address>/user-portal
```

![Login del portale utente](/_static/user-manual/user-portal/screenshots/user-portal_login.png)

## Gestione della password

### Modifica della tua password

Puoi cambiare la password direttamente dal portale utente. Per motivi di sicurezza, e buona pratica aggiornarla regolarmente.

Per cambiare la password:

1. Accedi al portale utente ed effettua il login.
2. Come utente normale, accederai direttamente al modulo per la modifica della password.
3. Inserisci la password corrente.
4. Inserisci due volte la nuova password per confermarla.
5. Fai clic sul pulsante **Save password**.

![Modulo di modifica password](/_static/user-manual/user-portal/screenshots/user-portal_change_password.png)

:::tip
Se hai dimenticato la password o non riesci ad accedere al portale, contatta l'amministratore di sistema.
:::

## Gestione degli utenti (solo amministratori)

Le sezioni seguenti sono disponibili solo agli amministratori del dominio utenti che hanno il permesso di gestire gli account.

Dopo aver eseguito l'accesso come amministratore, vedrai l'elenco di tutti gli account utente del sistema nella sezione `Users & Groups` del portale.

![Elenco utenti](/_static/user-manual/user-portal/screenshots/user-portal-user_list.png)

### Creazione di un nuovo utente

Puoi creare nuovi account utente tramite l'interfaccia del portale. Questa funzione e utile quando inserisci nuovi membri del team o aggiungi nuovi account al sistema.

Per creare un utente:

1. Vai alla sezione `Users & Groups` del portale.
2. Fai clic sul pulsante **Add User**.
3. Compila i campi obbligatori:
   - **Username**: identificativo di accesso del nuovo utente
   - **Display Name**: nome visualizzato dell'utente; dovrebbe contenere nome e cognome
   - **Password** e **Confirm Password**: password iniziale
4. Compila i campi facoltativi secondo necessità:
   - **Email**: indirizzo email di contatto (facoltativo)
   - **Groups**: assegna l'utente a uno o piu gruppi per i permessi (facoltativo)
5. Fai clic su **Create** o **Save** per completare l'operazione.

Per impostazione predefinita, l'utente usera la policy password definita nel sistema, ma puoi anche impostare opzioni specifiche per il singolo account.

Seleziona le opzioni desiderate per l'utente:

- **Users has to change password at next login**: se abilitata, l'utente dovra cambiare la password al primo accesso dopo la creazione dell'account.
- **Password never expires**: se abilitata, la password dell'utente non scadra e non verra richiesto di modificarla periodicamente. Usa questa opzione con cautela per motivi di sicurezza.

![Modulo di creazione utente](/_static/user-manual/user-portal/screenshots/user-portal-create_user.png)

### Modifica di un utente esistente

Puoi modificare i dettagli di un account utente, come nome, email o altre informazioni del profilo.

Per modificare un utente:

1. Trova l'utente nell'elenco.
2. Fai clic sul pulsante **Edit** accanto al nome.
3. Aggiorna i campi desiderati.
4. Fai clic su **Save** per applicare le modifiche.

### Modifica della password di un altro utente

Puoi reimpostare o cambiare la password di altri utenti del sistema.

Per cambiare la password di un altro utente:

1. Trova l'utente nell'elenco.
2. Fai clic sull'opzione **Change Password** nel menu kebab (tre puntini) accanto al nome.
3. Inserisci la nuova password.
4. Facoltativamente, seleziona **Force password change at next login** per obbligare l'utente a cambiarla al successivo accesso.
5. Fai clic su **Save**.

![Modulo amministratore per il cambio password](/_static/user-manual/user-portal/screenshots/user-portal-change_password.png)

### Eliminazione di un utente

Quando un utente non ha piu bisogno di accedere al sistema, puoi eliminare il suo account.

Per eliminare un utente:

1. Trova l'utente nell'elenco.
2. Fai clic sul pulsante **Delete user** accanto al nome.
3. Conferma l'eliminazione quando richiesto.
4. L'account utente verra rimosso in modo permanente dal sistema.

:::note
Gli amministratori del cluster possono gestire gli account utente anche dalla console di amministrazione, con opzioni aggiuntive per permessi e restrizioni dell'account.
:::
