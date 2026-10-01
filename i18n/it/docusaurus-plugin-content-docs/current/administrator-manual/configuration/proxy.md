---
title: Route HTTP
sidebar_position: 3
---
# Route HTTP

La sezione `HTTP routes` della pagina `Settings` mostra come ogni nodo del cluster instrada il traffico HTTP ricevuto sulle porte TCP standard 80 (HTTP) e 443 (HTTPS) verso le applicazioni installate nel cluster o verso destinazioni di rete personalizzate.

Il componente principale che implementa le route HTTP è il proxy HTTP [Traefik](https://traefik.io/). Ogni nodo del cluster esegue la propria istanza di Traefik e agisce come server web indipendente. Traefik termina le connessioni TLS e funziona come reverse proxy per le applicazioni tipicamente ospitate su quel nodo.

Le route possono essere gestite automaticamente dalle applicazioni installate. In questo caso, sono contrassegnate con il badge `Automatic`. In alternativa, puoi creare route personalizzate e definirne le proprietà in base alle tue esigenze.

Una route è definita da una regola di corrispondenza per le richieste in ingresso, basata sul **nome host** HTTP e/o sul **percorso della richiesta**. Specifica anche l'URL di destinazione verso cui viene inoltrato il traffico corrispondente.

Le route automatiche di solito puntano il loro URL di destinazione a servizi locali (spesso usando `http://127.0.0.1`), quindi il loro traffico non attraversa la rete del cluster. Le route personalizzate, invece, possono essere configurate con qualsiasi URL di destinazione raggiungibile, inclusi servizi nella LAN del nodo o anche su un altro nodo del cluster, se necessario.

Non esiste una gestione speciale del traffico HTTP per il nodo leader del cluster: tutti i nodi si comportano allo stesso modo.

La pagina `HTTP routes` ha due schede:

- `Routes` elenca le route di ogni nodo, come descritto in questa pagina.
- `Frontend proxies` configura i nodi che ricevono il traffico HTTP attraverso un altro proxy. Consulta [Proxy frontend](#frontend-proxies-section).

Ogni route può avere attributi speciali, visibili nella tabella principale:

- `Automatic` per le regole create e gestite dalle applicazioni
- `Access restricted` se l'accesso è limitato a indirizzi IP specifici

Le route automatiche non possono essere modificate, tranne per l'elenco degli IP consentiti. Quando vengono aggiunte restrizioni IP, acquisiscono anche l'attributo `Access restricted`.

:::note

La route chiamata `cluster-admin` è una route automatica, creata durante la configurazione del nodo. Sul nodo leader fornisce accesso all'interfaccia di amministrazione del cluster. Sui nodi worker è necessaria per eleggere un nuovo leader del cluster. Se limiti l'accesso a questa route:

- Potresti impedire a un nuovo worker di unirsi al cluster.
- Potresti perdere l'accesso alla configurazione del cluster se il tuo indirizzo IP non è consentito.
- Se il nodo ha dei [proxy frontend](#frontend-proxies-section), potresti perdere l'accesso quando ti connetti direttamente al nodo, senza passare attraverso di essi.

Fai riferimento a [Rimuovere le restrizioni IP sulla route cluster-admin](#clear-cluster-admin-restrictions) per ripristinare l'accesso, se necessario.

:::

Puoi visualizzare gli attributi dettagliati di qualsiasi route facendo clic sul relativo `Name`.

## Creare una route HTTP personalizzata {#custom-http-route-section}

Per aggiungere una route personalizzata, fai clic sul pulsante **Create route** e inserisci i seguenti dettagli:

- `Name`: un identificatore univoco per la route
- `Node`: il nodo a cui si applica la regola
- `URL`: l'URL di destinazione della route. Deve puntare a un server HTTP backend raggiungibile, all'interno o all'esterno del cluster. Per prestazioni migliori, usa l'indirizzo host locale `127.0.0.1` senza cifratura per le applicazioni locali, oppure `https://` per le applicazioni esterne nella LAN del nodo. In quest'ultimo caso, la cifratura della connessione backend è fortemente raccomandata.
- `Skip certificate validation`: se l'URL inizia con `https://`, questa opzione disabilita la verifica del certificato TLS del backend. Saltare la verifica può essere accettabile solo se il backend si trova in una rete fidata e non può fornire un certificato TLS valido.
- `Host`: imposta un FQDN valido per creare una route basata sull'host (virtual host). La regola corrisponde alle richieste in cui l'header `Host` è uguale all'FQDN indicato. Esempio: con host `myapp.nethserver.org` la route corrisponde a `https://myapp.nethserver.org`.
- `Path`: imposta un percorso URL valido che inizi con `/` (slash) per creare una route basata sul percorso. La regola corrisponde a qualsiasi percorso di richiesta che inizi con esso, indipendentemente dal nome host. Ad esempio, con percorso `/myapp` la route corrisponde sia a `https://ns8leader.nethserver.org/myapp` sia a `https://192.168.6.3/myapp/contents.html`.
- `Host` + `Path`: se entrambi i campi sono impostati, la richiesta deve corrispondere sia al nome host sia al percorso. Ad esempio, con host `myapp.nethserver.org` e percorso `/mypath`, la route corrisponde a `https://myapp.nethserver.org/mypath/contents.html` ma non a `https://ns8leader.nethserver.org/mypath/contents.html`.
- `Strip URL path prefix`: quando `Path` è impostato, rimuove il prefisso prima di instradare la richiesta verso l'URL di destinazione.
- `Request Let's Encrypt certificate`: abilita questa opzione per ottenere automaticamente un certificato TLS valido. Consulta [Certificato Let's Encrypt per le route HTTP](#lets_encrypt_routes) per dettagli importanti se disabiliti questa opzione in seguito.
- `Allow access from` (facoltativo): limita l'accesso alla route elencando gli indirizzi IPv4/IPv6 o le reti CIDR consentiti, uno per riga. Per impostazione predefinita, la route è aperta a tutte le reti. Se il nodo ha dei [proxy frontend](#frontend-proxies-section), elenca gli indirizzi dei client originali, non quelli dei proxy.

Le route HTTP personalizzate vengono aggiunte al backup di Traefik e possono essere ripristinate da esso.

## Certificato Let's Encrypt per le route HTTP {#lets_encrypt_routes}

L'opzione `Request Let's Encrypt certificate` abilita il provisioning automatico di un certificato TLS per il nome `Host`, firmato dalla Certification Authority Let's Encrypt. Una volta ottenuto, il certificato viene rinnovato periodicamente da Traefik. Consulta [Requisiti del certificato Let's Encrypt](certificates.md#lets-encrypt-requirements) per i dettagli sui requisiti e sul funzionamento del processo.

Quando questa opzione è disabilitata, il vecchio certificato TLS viene rimosso automaticamente dall'archivio interno dei certificati di Traefik e Traefik viene riavviato dopo aver fatto clic sul pulsante **Save**.

:::warning

Il riavvio di Traefik può disconnettere forzatamente gli utenti dalle applicazioni. Evita di disabilitare l'opzione `Request Let's Encrypt certificate` durante l'orario d'ufficio.

:::

## Proxy frontend {#frontend-proxies-section}

Un nodo del cluster può trovarsi dietro un altro proxy HTTP, come un reverse proxy, un load balancer o una CDN. In questo caso, Traefik riceve ogni connessione dall'indirizzo del proxy, e l'indirizzo del client originale è disponibile solo nell'header HTTP `X-Forwarded-For`.

Traefik accetta l'header `X-Forwarded-For` solo dagli indirizzi elencati come proxy frontend del nodo. Da qualsiasi altra origine, l'header viene scartato, in modo che un client non possa falsificare il proprio indirizzo.

Per configurare i proxy frontend di un nodo:

1.  Vai in `Settings` → `HTTP routes` e seleziona la scheda `Frontend proxies`.
2.  Fai clic su **Add frontend proxy**.
3.  Seleziona il nodo.
4.  In `Frontend proxies`, inserisci gli indirizzi IPv4 o IPv6 dei proxy, uno per riga. Le reti CIDR non sono accettate.
5.  Imposta il `Trust depth`, il numero di livelli di proxy davanti al nodo. Il valore predefinito è `1`, un solo proxy. Con un trust depth pari a 1, l'indirizzo del client viene letto dall'ultima voce dell'header `X-Forwarded-For`.
6.  Fai clic su **Add frontend proxy** per confermare.

Ogni nodo ha una sola configurazione dei proxy frontend. Usa le azioni **Edit** e **Delete** della riga del nodo per modificarla o rimuoverla. Quando la configurazione viene eliminata, Traefik non vede più l'indirizzo reale del client.

:::warning

Il salvataggio o l'eliminazione della configurazione dei proxy frontend riavvia Traefik sul nodo, e i client HTTP connessi vengono brevemente disconnessi. Evita di modificarla durante l'orario d'ufficio.

:::

Quando un nodo ha dei proxy frontend, la restrizione `Allow access from` delle sue route verifica l'indirizzo del client preso dall'header `X-Forwarded-For`, invece dell'indirizzo della connessione. Di conseguenza:

- Elenca in `Allow access from` gli indirizzi dei client originali, non quelli dei proxy.
- Le route con restrizioni rifiutano le richieste che raggiungono il nodo direttamente, senza passare da un proxy frontend, perché queste richieste non hanno un header `X-Forwarded-For` attendibile. Questo vale anche per la route `cluster-admin`. Le route senza restrizioni non sono interessate.
- Aggiungere la rete LAN in `Allow access from` consente l'accesso ai client della LAN solo quando si connettono attraverso un proxy frontend: una richiesta diretta non ha un indirizzo del client attendibile da verificare.

La configurazione dei proxy frontend viene aggiunta al backup di Traefik e può essere ripristinata da esso.

## Rimuovere le restrizioni IP sulla route cluster-admin {#clear-cluster-admin-restrictions}

Se perdi l'accesso all'interfaccia di amministrazione del cluster a causa delle restrizioni IP, puoi rimuoverle dalla riga di comando:

1.  Connettiti al nodo leader del cluster tramite SSH con privilegi di root e ottieni l'identificatore del modulo Traefik:

        runagent -l | grep traefik        # prints: traefik1

2.  Esegui il seguente comando per cancellare le restrizioni sulla route `cluster-admin` del modulo `traefik1`:

        api-cli run module/traefik1/set-route --data '{"instance": "cluster-admin", "ip_allowlist": []}'
