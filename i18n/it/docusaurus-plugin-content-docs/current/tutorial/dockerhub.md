---
title: Limite di pull di Docker Hub
sidebar_position: 5
---
# Limite di pull di Docker Hub

Il limite di pull di Docker Hub è una restrizione sul numero di pull delle immagini container che puoi eseguire dal repository di Docker Hub entro un determinato intervallo di tempo. Questo limite serve a gestire il carico dei server e a garantire un uso equo delle risorse di Docker Hub. I limiti variano in base al tipo di account:

1.  Utenti anonimi: chi non ha un account Docker Hub ha il limite di pull più basso. Una volta superato questo limite, incontrerai errori quando proverai a scaricare immagini.
2.  Utenti autenticati: gli utenti registrati con account gratuiti hanno a disposizione un certo numero di pull gratuiti in una determinata finestra temporale. Dopo aver raggiunto questo limite, potresti dover attendere prima di poterne effettuare altri.

Se NethServer condivide il proprio IP pubblico con altri sistemi, potrebbe incorrere in questo limite.

Per aumentare il tuo limite di pull ed evitare errori, esegui l'accesso al tuo account Docker Hub quando scarichi le immagini. Questa autenticazione può consentirti di accedere a un limite di pull più alto in base al tipo di account.

In una shell root, esegui il comando seguente:

``` shell
podman login --authfile=/etc/nethserver/registry.json docker.io
```

Questo comando richiede le credenziali di Docker Hub. È consigliabile generare un token di accesso in sola lettura specifico per il sistema NS8. Consulta la documentazione di Docker Hub per sapere come generare i token.

Il token di accesso restituito da docker.io viene memorizzato nel file `/etc/nethserver/registry.json`. Assicurati che il file resti leggibile da tutti, perché è richiesto dai moduli NS8.

Per regolare di conseguenza i permessi, esegui i comandi:

``` shell
chmod -c a+rx /etc/nethserver
chmod -c a+r /etc/nethserver/registry.json
```

Ripeti questa procedura per ogni nodo del cluster.

Per ulteriori informazioni, consulta i riferimenti seguenti:

- [Download rate limit \| Docker Documentation](https://docs.docker.com/docker-hub/download-rate-limit/)
- [podman-login — Podman documentation](https://docs.podman.io/commands/login)
- [Create and manage access tokens \| Docker Documentation](https://docs.docker.com/docker-hub/access-tokens/)
