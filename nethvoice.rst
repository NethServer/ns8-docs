.. _nethvoice-section:

=========
NethVoice
=========

NethVoice module is split into seven main parts:

* `FreePBX <https://www.freepbx.org/>`_: a web-based open-source graphical user interface (GUI) that manages `Asterisk <https://www.asterisk.org>`_, a voice over IP and telephony server
* `NethVoice CTI Server <https://github.com/nethesis/nethcti-server>`_: a daemon that provides a set of api to perform common switchboard operations and a websocket streaming channel to listen for the events
* `NethVoice CTI Client <https://github.com/nethesis/nethcti>`_: a web application to manage the telephone switchboard via communication with NethVoice CTI Server
* `NethVoice Report <https://github.com/nethesis/nethvoice-report>`_: a `Asterisk <https://www.asterisk.org>`_ CDR and queues reporting system
* `Janus <https://janus.conf.meetecho.com/>`_: a WebRTC Server 
* `MariaDB <https://mariadb.org/>`_: a popular open source relational database 
* `Tancredi <https://nethesis.github.io/tancredi>`_: a phone provisioning engine ideal for internet deployments

NethVoice is a full-feature integrate voice, video, mobile communication systems.

You can install multiple NethVoice instances on the same node from the :ref:`software_center-section`, but the module requires ref:`NethVoice proxy <nethvoice_proxy-section>` already configured and running.

Release notes
=============

Major changes on 2024-03-08
===========================

**Beta 2**

New features introduced by this release are:

-

Configuration
=============

The NethVoice module requires at least one :ref:`user domain <user-domains-section>` already configured and running.

NethVoice needs two dedicated virtual hosts, one for the NethVoice administration page and one for the NethVoice CTI web application, two FQDN like ``nethvoice.nethserver.org`` and ``cti.nethserver.org``.

Before proceeding with the configuration, make sure to create the corresponding name records inside your DNS server.

If you are planning to use a Let's Encrypt certificate as default, make also sure to have the corresponding public DNS records.

The first configuration wizard will require the following information:

* ``NethVoice base host``: insert a valid FQDN to access the application administration page
* ``NethVoice CTI base host``: insert a valid FQDN to access the NethVoice CTI web application
* ``User Domain``: choose one of the :ref:`user domain <user-domains-section>` already configured.
* ``Request Let's Encrypt certificate``: if enabled, a Let's Encrypt certificate will be asked for each of the two hosts
* ``Reports Prefix``: insert the international telephone prefix to be considered local in the reporting system 
* ``Reset NethVoice admin password to access user interface``: insert a valid password for the NethVoice administrator user (optional, default password is *Nethesis,1234*)

After saving the configuration parameters NethVoice will be accessible on his base host with the administration credentials:

* User: `admin`
* Password: `Nethesis,1234`, default password if not has been reset during the first configuration wizard

.. _wizard2-section:

Wizard prima configurazione
===========================

Il wizard di prima configurazione consente di installare e configurare agevolmente tutte le componenti di un centralino.


Modalità utenti per il centralino
---------------------------------

Una volta effettuato il login, se non è ancora stato configurato un account provider sulla macchina, l'interfaccia mostrerà la possibilità di scegliere se installare un account provider LDAP locale o configurarlo manualmente.

Nel primo caso, non verranno richieste ulteriori configurazioni, mentre nel secondo si verrà rediretti all'interfaccia di |parent_product|, dove sarà possibile configurare il provider degli utenti.

Se il provider scelto non è locale, non sarà possibile creare gli utenti, che dovranno essere quindi creati manualmente sul provider stesso prima di procedere con la configurazione, con un provider locale invece sarà possibile creare gli utenti direttamente in |product|.

Una volta scelta la modalità, si procede alla configurazione degli utenti.

Interni
-------

Il primo passo nella configurazione di |product| è definire la lista di utenti e l'abbinamento con il loro interno telefonico.

In caso di account provider remoto in questa sezione comparirà l'elenco degli utenti che |parent_product| recupera remotamente.

In caso di account provider locale in questa sezione comparirà invece l'elenco degli utenti l'elenco delgi utenti di |parent_product| e ci sarà la possibilità di crearne direttamente da qui di nuovi scegliendo username e il nome completo.

È possibile ora inserire gli interni relativi per ogni utente:

- Inserire il numero dell'interno (consigliato a partire dal numero 200) nel campo di testo
- Cliccare su Inserisci
- L'utente si evidenzia e una spunta verde compare se tutto è andato a buon fine


Fasci
-----

Nella sezione fasci è possibile configurare i gateway per gestire le linee fisiche o creare fascio VoIP specificando le credenziali delle linee SIP date dal provider.

I fasci, per collegare i gateway o le linee VoIP, vengono creati utilizzando la libreria PJSIP.

.. _fisici:

Fisici
^^^^^^

Come per i dispositivi questa sezione scansiona la rete di |product| e cerca dei gateway SIP supportati. Una volta individuati è possibile specificare:

- Modello: specificare il modello del gateway
- Impostazioni dinamiche in base al modello:

  * ISDN (Specificare per la linea se è Point-Point or Point-MultiPoint)
  * PRI
  * FXS (Specificare per ogni porta, l'interno da assegnare scegliendo un utente precedentemente configurato)
  * FXO (Specificare direttamente il numero, nel campo di testo)

Una volta salvate le impostazioni è possibile caricare la configurazione sul gateway tramite il bottone "Carica"
Il gateway scaricherà la configurazione da |product| e si riavvierà. Verranno inoltre creati i fasci relativi.

VoIP
^^^^

È possibile creare dei fasci VoIP selezionando uno dei provider supportati e inserendo le informazioni necessarie.

Premere "Crea" per creare la configurazione relativa per quel fascio VoIP.

Rotte
-----

Nella sezione rotte è possibile configurare le rotte in entrata e in uscita per il vostro centralino

In entrata
^^^^^^^^^^

In questa sezione, viene mostrata la lista delle rotte già configurate, con la possibilità di modificarle o eliminarle.

Premendo sul bottone "Crea nuova rotta" si aprirà un nuovo tab con l'applicazione Visual Plan, che vi consentirà di creare, modificare e collegare i componenti del centralino che gestiranno il flusso della chiamata per il numero in ingresso

Premendo il simbolo di spunta nell'applicazione Visual Plan, la configurazione della vostra rotta verrà salvata e da quel momento potrete ricevere chiamate che seguiranno il flusso da voi scelto.
In uscita
^^^^^^^^^

In questa sezione è presente la lista delle rotte in uscita. La prima volta che questa pagina viene visitata il wizard vi propone delle rotte in uscita di default, con i pattern di chiamata specifici per le diverse lingue.

È possibile inoltre specificare l'ordine con cui verranno usati i fasci precedentemente creati, avendo quindi la possibilità di personalizzare la priorità dei vari fasci.

Premendo il tasto "Salva" la configurazione viene scritta nel centralino e da quel momento è possibile effettuare chiamate verso l'esterno (avendo opportunamente configurato i fasci negli step precedenti).

.. _wizard2-dispositivi:

Dispositivi
-----------

Durante la procedura guidata di prima configurazione in questa sezione viene
richiesta la conferma di alcune impostazioni fondamentali (pulsante
:guilabel:`Modifica impostazioni di default`).

- :guilabel:`Crittografia` per funzionare correttamente richiede che il sistema
  disponga di un certificato SSL/TLS valido per il nome host inserito in
  :guilabel:`Indirizzo centralino`.

- :guilabel:`Indirizzo centralino` può essere l'indirizzo IP o il nome
  dell'host di |product|, se correttamente inserito nel DNS utilizzato
  dai telefoni e nel certificato SSL/TLS utilizzato dal sistema.

- :guilabel:`Password admin` sarà la password per accedere all'interfaccia web
  dei telefoni configurati con l'utente amministratore.

- :guilabel:`Password utente` sarà la password per accedere all'interfaccia web
  dei telefoni configurati con l'utente senza privilegi amministrativi.

La scelta delle precedenti impostazioni di Crittografia e Indirizzo Centralino
dipende da come i telefoni dovranno raggiungere il centralino.

- Se i telefoni sono tutti nella stessa rete del centralino (LAN),
  :guilabel:`Crittografia` può essere disabilitata e :guilabel:`Indirizzo
  centralino` può contenere un indirizzo IP.

- Se uno o più telefoni raggiungono il centralino tramite rete pubblica (WAN),
  come nel caso in cui il centralino sia ospitato su una VPS in cloud, allora
  :guilabel:`Crittografia` deve essere abilitata e :guilabel:`Indirizzo
  centralino` deve contenere il nome completo e presente nel DNS pubblico.

In ogni caso è possibile scegliere su ogni singolo telefono se la crittografia è
utilizzata o meno, a patto che il certificato SSL/TLS del sistema sia valido. A
questo proposito fare riferimento a :ref:`wizard2-configurazioni`.

Si tenga però presente che il centralino non consente connessioni senza
crittografia provenienti da rete pubblica (WAN).

Altre impostazioni da poter variare:

* :ref:`Preferenze <panel-preferences>`
* :ref:`Rubrica LDAP <panel-phonebook>`

Una volta salvate le impostazioni, sarà possibile modificarle di nuovo
dalla pagina :guilabel:`Dispositivi > Modelli`, pulsante :guilabel:`Impostazioni
di default`.

.. _wizard2-telefoni:

Telefoni
^^^^^^^^

La pagina :guilabel:`Dispositivi > Telefoni` consente l'identificazione dei
telefoni da parte di |product| mediante l'immissione dell'indirizzo MAC. È
possibile immettere l'indirizzo MAC con i seguenti metodi:

- **Incolla da file** di indirizzi MAC multipli. Vengono accettate le sintassi
  separate da segno meno ``-`` (es.: ``AA-BB-CC-11-22-33``), due punti ``:``
  (es.: ``AA:BB:CC:11:22:33``) o senza separatore (es.: ``AABBCC112233``). Le
  lettere possono essere indifferentemente maiuscole o minuscole.

- **Scansione rete** alla ricerca di indirizzi MAC di telefoni supportati.

- **Aggiunta manuale** di un indirizzo MAC alla volta. Utile se si dispone di un
  lettore di codice a barre.

In ogni caso, dopo aver immesso l'indirizzo MAC è possibile selezionare il
**modello del telefono**. La selezione del modello esatto è richiesto per la
corretta configurazione del telefono.

.. warning::

    Se il modello non viene selezionato o viene selezionato il modello sbagliato
    alcune funzioni del telefono, come il provisioning via RPS o i tasti linea, 
    potrebbero non essere disponibili

.. _wizard2-modelli:

Modelli
^^^^^^^

La pagina :guilabel:`Dispositivi > Modelli` elenca i modelli base dei telefoni
selezionati in :guilabel:`Dispositivi > Telefoni` più eventuali modelli
personalizzati.

È possibile creare un modello personalizzato a partire da uno esistente, tramite
il pulsante :guilabel:`Crea nuovo modello`.

In questa pagina sono anche modificabili alcuni parametri ereditati da tutti i
modelli, tramite il pulsante :guilabel:`Impostazioni di default`. Questi
parametri comprendono :guilabel:`Crittografia` e :guilabel:`Indirizzo
centralino`, già impostati dalla procedura di prima configurazione come spiegato
in :ref:`wizard2-dispositivi`.

A seconda delle funzionalità proprie del modello, possono essere disponibili
i pannelli e le opzioni descritti in :ref:`wizard2-provisioning-section`.

.. _wizard2-configurazioni:

Configurazioni
--------------

Gruppi
^^^^^^

È possibile creare dei gruppi utente che poi saranno visibili e utilizzabili nelle applicazioni, come ad esempio nel |product_cti|

- Cliccare il bottone "Crea nuovo gruppo"
- Specificare un nome e salvare
- Il gruppo comparirà nella lista

Profili
^^^^^^^

|product| consente di selezionare le funzionalità a cui ogni utente potrà accedere e queste vengono raggruppate in dei profili.

Vengono creati di default 3 profili che contengono diversi livelli di funzionalità.

- Base: funzionalità minime per l'utente
- Standard: funzionalità di gestione classiche per l'utente
- Avanzato: quasi tutte le funzionalità sono consentite, indicato per l'utente avanzato

È possibile creare anche nuovi profili, duplicando uno esistente o creandone di nuovi e specificando le varie funzionalità

.. note:: Ricordarsi di abilitare sui profili dove necessario l'accesso ai gruppi utente precedentemente creati.

Permessi
~~~~~~~~

Impostazioni
~~~~~~~~~~~~

- il permesso generale abilita o disabilita l'accesso a tutte le funzionalità della sezione e le impostazioni generali di notifica
- :guilabel:`DND`, abilita la configurazione del *non disturbare*
- :guilabel:`Inoltro di chiamata`, abilita la configurazione dell'*inoltro di chiamata (deviazione)*
- :guilabel:`Registrazione`, abilita la *registrazione* delle proprie conversazioni. È possibile anche *visualizzare/ascoltare/eliminare* le proprie registrazioni
- :guilabel:`Conferenza`, abilita la creazione di *audio conferenze* in |product_cti|
- :guilabel:`Parcheggi`, abilita la visualizzazione lo stato dei *parcheggi* e la possibilità di prendere le chiamate parcheggiate
- :guilabel:`Chat`, abilita il servizio *chat* in |product_cti|
- :guilabel:`Privacy`, abilita l'*oscuramento delle ultime 3 cifre* (modificabile da riga di comando) del numero chiamato e/o chiamante degli altri utenti in |product_cti|
- :guilabel:`Condivisione Schermo`, abilitala condivisione dello schermo durante una chiamata effettuata tra due |product_cti|
- :guilabel:`Pulsanti Telefono Fisico`, abilita la configurazione dei *tasti dei telefoni fisici* da parte dell'utentei in |product_cti|. Questi corrispondono ai Line Key mostrati nelle pagine :ref:`wizard2-dispositivi`
- :guilabel:`Video Conference`, abilita la creazione di una *video conferenza* in |product_cti|

Rotte in uscita
~~~~~~~~~~~~~~~

- vengono mostrate tutte le *rotte in uscita* configurate in |product| ed è possibile abilitare/disabilitare l'utilizzo singolarmente

Rubrica
~~~~~~~

- il permesso generale abilita la visualizzazione della *rubrica* in |product_cti| e la possibilità di aggiungere contatti, modificare ed eliminare i contatti propri
- :guilabel:`Rubrica Avanzata`, abilita la possibilità di modificare/eliminare anche i *contatti non propri* della rubrica in |product_cti|

Schede Cliente
~~~~~~~~~~~~~~

- il permesso generale abilita la possibilità di vedere sul |product_cti| la *scheda cliente*
- per ogni sezione della *scheda cliente* è possibile abilitare/disabilitare la visualizzazione

Pannello Presenza
~~~~~~~~~~~~~~~~~

- il permesso generale abilita la visualizzazione del pannello *operatori* in |product_cti|
- :guilabel:`Ascolto`, abilita l'*ascolto* di chiamate di altri utenti
- :guilabel:`Intrusione`, abilita l'*intromissione* in una chiamata di un altro utente (ascolto di chiamante e chiamato, conversazione solo con l'utente)
- :guilabel:`Registrazione Avanzate`, abilita la *registrazione* di chiamate di altri utenti
- :guilabel:`Pickup`, abilita la *risposta per assente* per chiamate di altri utenti
- :guilabel:`Trasferiemnto Chiamata`, abilita il *trasferimento di chiamata* per chiamate di altri utenti
- :guilabel:`Parcheggio Avanzato`, abilita la possibilità di *parcheggiare* chiamate di altri utenti e di riprenderle
- :guilabel:`Chiudi`, abilita la possibilità di *chiudere* le chiamate di altri utenti
- :guilabel:`Linee Centralino`, abilita la visione in |product_cti| dello *stato dei fasci* configurati in |product|
- :guilabel:`Telefono Avanzato`, abilita le *funzionalità del telefono* (chiudi, chiama, rispondi) sulle conversazioni che non appartengono all'utente
- per ogni *gruppo di utenti* configurato in |product| è possibile abilitare/disabilitare la visualizzazione

Pannello agente di coda
~~~~~~~~~~~~~~~~~~~~~~~

- il permesso generale abilita la sezione *Code* in |product_cti| con le informazioni delle code di appartenenza, la possibilità di fare login/logout ed entrare/uscire dalla pausa
- :guilabel:`Pannello agente di coda avanzato`, abilita *informazioni avanzate* sullo stato delle code e degli agenti
- :guilabel:`Chiamate non gestite`, abilita l'accesso alla sezione *chiamate non gestite*

Sorgenti Video
~~~~~~~~~~~~~~

- il permesso generale abilita l'accesso alla sezione *sorgenti video* in |product_cti|
- per ogni *sorgente video* configurata in |product| è possibile abilitare/disabilitare la visualizzazione

Fuori Orario
~~~~~~~~~~~~

- il permesso generale abilita l'accesso alla sezione *fuori orario* di |product_cti| consentendo di cambiare il percorso delle proprie chiamate in entrata
- :guilabel:`Fuori orario avanzato`, consente di modificare il *percorso della chiamata* in entrata dell'utente e delle rotte in entrata generiche
- :guilabel:`Fuori orario completo`, consente la modifica di tutti i *percorsi delle chiamate* in arrivo

Queue Manager
~~~~~~~~~~~~~

- il permesso generale abilita l'accesso alla sezione *QManager* in |product_cti|
- per ogni *coda* configurata in |product| è possibile abilitare/disabilitare la visualizzazionea dello stato e dei dati

Posto Operatore
~~~~~~~~~~~~~~~

- il permesso generale abilita l'accesso alla sezione *posto operatore* in |product_cti|
- va abilitata una sola *coda* configurata in |product| da usare come sorgente delle chiamate da gestire


Utenti
------

La pagina :guilabel:`Utenti` stabilisce per ogni singolo utente le
impostazioni personali e i dispositivi associati.

- :guilabel:`Profilo`, decide di quali permessi l'utente dispone,

- :guilabel:`Gruppo`, consente di raggruppare gli utenti per facilitare la
  distribuzione delle configurazioni mediante :ref:`wizard2-telefoni-multipli`,

- :guilabel:`Cellulare`, consente di associare un numero di cellulare all'utente da
  mostrare nel pannello operatore del |product_cti| e da utilizzare nella gestione
  dello stato di presence

- :guilabel:`Casella Vocale`, consente di attivare la casella vocale per l'utente come
  destinazione di ogni fallimento di chiamate al suo interno

- :guilabel:`Associa dispositivo`, consente di selezionare un telefono non
  ancora associato e assegnarlo all'utente tra quelli gestiti con il provisioning.
  È possibile creare delle credenziali da utilizzare in un dispositivo non supportato
  dal provisioning: in tal caso è necessario utilizzare un dispositivo personalizzato.

Vengono poi mostrati i dispositivi associati all'utente.
I dispostivi possono essere di due tipologie, software (Web Phone e Mobile App) o
fisici, legati ad un telefono configurato con il provisioning o ad un dispositivo
personalizzato.

È possibile associare ad ogni utente fino a 9 dispostivi:

- :guilabel:`Web Phone` attiva il client telefonico del |product_cti| per gestire le
  chiamate direttamente al suo interno senza necessità di avere telefoni fisici.

- :guilabel:`Mobile App` attiva la possibilità di configurare sullo smartphone un
  dispositivo (vedere :ref:`nethcti_mobile`).

Per ogni dispositivo fisico viene mostrato:

- :guilabel:`Crittografia` abilitata o meno. L'impostazione iniziale dipende dalla
  configurazione di |product| effettuata durante la procedura di prima configurazione
  (vedi :ref:`wizard2-dispositivi`). Se il centralino viene raggiunto tramite rete
  pubblica (WAN) è richiesta l'attivazione della crittografia.

.. warning::

    Se :guilabel:`Crittografia` è abilitata assicurarsi che il certificato SSL/TLS
    del sistema sia valido e contenga il nome del centralino, altrimenti i
    telefoni non possono stabilire la connessione TLS.

- :guilabel:`Modello di Configurazione` scelto. È possibile variare il modello di
  configurazione tra quelli proposti.
- :guilabel:`Modifica Configurazione` È possibile modificare la configurazione del
  singolo telefono inserendo modifiche valide solo per questo dispositivo.
  Il singolo telefono ha di base la configurazione del modello e delle impostazioni
  di default. Fare riferimento a :ref:`wizard2-modelli` per maggiori dettagli.
- :guilabel:`Mac-Address` Viene mostrato l'indirizzo MAC del dispostivo associato.
- :guilabel:`Mostra password` per i dispositivi personalizzati. Viene mostrata la
  password SIP che insieme all'interno e all'indirizzo del |product| è possibile
  utilizzare per configurare manualmente il dispositivo personalizzato.
- :guilabel:`Riavvia` Se il dispositivo è registrato allora è possibile riavviarlo.
- :guilabel:`Disassocia` È possibile disassociare il dispositivo dall'utente.

.. _provisioningi_scopes_priority-section:


Priorità configurazioni telefoni
================================

La configurazione creata dal provisioning di |product| per i dispositivi telefonici
viene ricavata unendo le impostazioni provenienti da:

- :guilabel:`Impostazioni Default`: si trovano nella pagina :ref:`wizard2-modelli`.
- :guilabel:`Impostazioni Modello`: vengono presi i parametri dalla configurazione del
  modello associato al dispositivo, la configurazione si trova nella pagina
  :ref:`wizard2-modelli`.
- :guilabel:`Impostazione Telefono`: vengono presi i parametri della configurazione
  del singolo telefono che si trovano nella pagina :ref:`wizard2-configurazioni`.
- Impostazioni |product_cti| dove è possibile configurare
  parametri del telefono fisico associato all'utente.

Nel caso in cui ci sia un parametro con una configurazione non omogenea nelle varie
sezioni sopra elencate questo è l'ordine di priorità decrescente che verrà seguito:

- :guilabel:`Impostazione telefono` e Impostazioni |product_cti| sono
  le impostazioni con la priorità massima, tra le due vale l'ultima effettuata.
- :guilabel:`Impostazioni Modello`
- :guilabel:`Impostazioni di Default`


Amministrazione
===============

Lingue
------

Nel menù Lingue è possibile impostare la lingua di sistema del |product| impostandola come quella di default e installare anche altri pacchetti lingua aggiuntivi.

Impostazioni
------------

La pagina delle Impostazioni permette di gestire diversi aspetti della configurazione.

* :guilabel:`Password`: è possibile cambiare la password dell'utente admin dedicato all'accesso all'interfaccia web di |product|.

* :guilabel:`Videoconferenza`: indicare l'URL del Sistema di Conferenza fornita dal fornitore. È possibile in alternativa inserire l'URL di un qualsiasi server Jitsi pubblico verificando le condizioni di utilizzo, la compatibilità con le proprie direttive privacy e necessità di continuità di servizio.

* :guilabel:`Impostazioni NAT`: per gestire correttamente il NAT nel protocollo SIP, |product| ha necessità di conoscere l'indirizzo che utilizzerà presentandosi all'esterno e le reti da considerare locali, per le quali non dovrà tenere conto del NAT e delle sue impostazioni:

  1) Inserire in :guilabel:`Indirizzo Esterno` l'IP pubblico con il quale |product| effettuerà connessioni esterne alla propria rete.
  2) Inserire in :guilabel:`Reti Locali` tutte le reti in formato CIDR dalle quali |product| si deve aspettare connessioni dirette senza considerare quindi il NAT.

* :guilabel:`Impostazioni Firewall`: il firewall di |product| nella configurazione di partenza non accetta connessioni da reti esterne per il protocollo SIP TLS (porta 5061 tcp e porte da 10000 a 20000 udp).
  In questa sezione è possibile configurare il firewall per accettare traffico SIP TLS anche da reti non locali abilitando il SIPS esterno.
  Abilitando l'accesso SIPS esterno, si concede anche l'accesso in TLS al proxy Flexisip sulla porta 6061, che consente l'uso dell'App mobile.

* :guilabel:`Impostazioni Rubrica`: in questa sezione è possibile abilitare l'esporazione della rubrica di |product| in LDAP per consentire di solito ai telefoni di accedervi in sola lettura.
  La rubrica può essere pubblicata in LDAP in due modalità (la configurazione data ai telefoni sarà completa di tutti i parametri necessari):

  1) **LDAP**, che comporta una pubblicazione in chiaro e ad accesso anonimo (senza cioè la necessità di credenziali di autenticazione); questa modalità è indicata se tutti i telefoni sono nella stessa rete di |product|
  2) **LDAPS**, che utilizza la crittografia e richiede delle credenziali di autenticazione per accedere; questa modalità è indicata in presenza di telefoni che si collegano a |product| da reti esterne

* :guilabel:`Sorgenti Rubrica`: in questa sezione è possibile abilitare/disabilitare le sorgenti di default da inserire nella rubrica di |product|.

  1) **Numeri brevi Centralino**, gestibili tramite la sezione :menuselection:`Amministrazione -> Avanzate -> Applicazioni -> Codice Rapido di Chiamata`
  2) **Interni Centralino**, gestibili tramite la sezione :menuselection:`Utenti -> Interni`
  3) **Contatti condivisi del CTI**, si riferisce ai contatti pubblici aggiunti tramite la rubrica del |product_cti|

.. warning::

    Per ridurre l'uso di memoria del sistema è consigliato attivare una sola delle precedenti modalità di pubblicazione della rubrica LDAP

Avanzate
--------

La sezione Avanzate consente l'accesso diretto all'interfaccia avanzata di |product|.


Report
------

La sezione "Report" riporta l'elenco completo degli utenti del centralino specificando il loro:

- Interno
- Username
- Nome e Cognome
- Password Voicemail
- Password utente (se l'utente è stato creato da |product|)

È presente anche la possibilità di stampare l'elenco in formato PDF cliccando sul bottone "Stampa report PDF"

Guida ai parametri di provisioning
==================================

.. hint::
    
    Fare riferimento a :ref:`wizard-section` per la versione precedente

Le funzioni dei telefoni configurabili mediante provisioning sono raccolte nei
pannelli dell'interfaccia di amminstrazione di |product| e descritti nelle seguenti sezioni.

Non tutti i modelli di telefono dispongono delle medesime funzioni, quindi alcuni
parametri o interi pannelli potrebbero non essere visualizzati.

In generale lasciare un campo vuoto o selezionare l'opzione ``-`` (segno meno) indicano
il valore ereditato dal contesto con priorità inferiore; la priorità massima è per le impostazioni
del *telefono* e a seguire in ordine decrescente *modello* e *default*.
Fare riferimento a :ref:`provisioning-scopes-priority` per ulteriori informazioni.

.. _panel-softkeys:

Soft key
--------

I *soft key* sono tasti del telefono programmabili specifici per
richiamare delle funzioni del telefono.

Qualora il telefono renda disponibili più tasti di quanti ne siano visualizzati
nell'interfaccia di amministrazione di |product|, è presente un pulsante
:guilabel:`Mostra altri` per aggiungerne di ulteriori.

In base al :guilabel:`Tipo` potrebbero doversi valorizzare anche i campi
:guilabel:`Valore` e :guilabel:`Etichetta`, secondo quanto indicato nella
tabella sottostante.


Nella colonna Etichetta la dicitura *predefinita* indica che lasciando vuoto
il campo :guilabel:`Etichetta` il telefono assegnerà al soft key un'etichetta
predefinita.

.. list-table:: Configurazione dei soft key
    :widths: 5 20 10 10 
    :header-rows: 1

    * - Tipo
      - Descrizione
      - Valore
      - Etichetta

    * - Forward
      - Abilita/disabilita lo stato di *forward* (inoltro incondizionato). Se abilitato
        tutte le chiamate in entrata sono inoltrate al numero specificato
      - Numero di telefono o interno
      - Sì (predefinita)

    * - DND
      - Abilita/disabilita lo stato di *do not disturb* (non disturbare). Se abilitato
        tutte le chiamate in entrata sono rifiutate
      - No
      - No

    * - Recall
      - Chiama nuovamente l'ultimo numero chiamato
      - No
      - Sì (predefinita)

    * - Pick up
      - Rispondi ad una chiamata in corso all'interno specificato
      - Numero di interno
      - Sì

    * - Speed dial
      - Chiama il numero dato premendo il tasto
      - Numero di telefono
      - Sì

    * - Group pickup
      - Rispondi ad una chiamata in corso al gruppo di pickup configurato
      - No (il gruppo è configurato)
      - No

    * - History
      - Mostra la schermata dello storico delle chiamate
      - No
      - Sì (predefinita)

    * - Menu
      - Mostra il menù di configurazione del telefono
      - No
      - Sì (predefinita)

    * - Stato
      - Mostra le informazioni di stato del telefono 
        (es.: versione del firmware, stato di registrazione ...)
      - No
      - Sì (predefinita)

    * - Prefix
      - Aggiungi le cifre specificate al numero digitato
      - Le cifre del prefisso
      - Sì (predefinita)

    * - LDAP
      - Mostra la rubrica LDAP configurata sul telefono
      - No
      - Sì (predefinita)

.. _panel-linekeys:

Line key
--------

I *line key* sono tasti del telefono programmabili simili ai *soft key* ma
più specifici per la gestione delle chiamate e il monitoraggio dello stato degli interni.

Qualora il telefono renda disponibili più tasti di quanti ne siano visualizzati
nell'interfaccia di amministrazione di |product|, è presente un pulsante
:guilabel:`Mostra altri` per aggiungerne di ulteriori.

In base al :guilabel:`Tipo` potrebbero doversi valorizzare anche i campi
:guilabel:`Valore` e :guilabel:`Etichetta`, secondo quanto indicato nella
tabella sottostante.


Nella colonna Etichetta la dicitura *predefinita* indica che lasciando vuoto
il campo :guilabel:`Etichetta` il telefono assegnerà al line key un'etichetta
predefinita.

.. list-table:: Configurazione dei line key
   :widths: 5 20 10 10 
    :header-rows: 1

    * - Tipo
      - Descrizione
      - Valore
      - Etichetta

    * - Conferenza
      - Le chiamate attive vengono unite in una conferenza in cui ogni partecipante
        può ascoltare e parlare con gli altri simultaneamente
      - No
      - Sì (predefinita)

    * - Forward
      - Abilita/disabilita lo stato di *forward* (inoltro incondizionato). Se abilitato
        tutte le chiamate in entrata sono inoltrate al numero specificato
      - Numero di telefono o interno
      - Sì (predefinita)

    * - Trasferimento di chiamata
      - Trasferisce la chiamata in corso al numero selezionato o ad un altro numero digitato
        al momento
      - Numero di telefono o interno
      - Sì

    * - Hold
      - Mette in attesa la chiamata corrente
      - No
      - Sì (predefinita)

    * - DND
     - Abilita/disabilita lo stato di *do not disturb* (non disturbare). Se abilitato
        tutte le chiamate in entrata sono rifiutate
      - No
      - No

    * - Recall
      - Chiama nuovamente l'ultimo numero chiamato
      - No
      - Sì (predefinita)

    * - Pick up
      - Rispondi ad una chiamata in corso all'interno specificato
      - Numero di interno
      - Sì

    * - DTMF
      - Esegue una sequenza di toni di chiamata (DTMF)
      - Sequenza di simboli o numeri
      - Sì

    * - Login/logout agente dinamico
      - Entra/esci dalla coda di chiamata
      - No
      - Sì

    * - Voice mail
      - Consulta la casella vocale
      - No
      - Sì (predefinita)

    * - Speed dial
      - Chiama il numero dato premendo il tasto
      - Numero di telefono
      - Sì

    * - Linea
      - Seleziona un'altra linea
      - No
      - Sì (predefinita)

    * - BLF
      - Traccia lo stato dell'interno selezionato, e a seconda 
        dello stato di quest'ultimo esegue un *pick up* o *speed dial*
        quando premuto
      - Numero di interno
      - Sì

    * - URL
      - Esegui una richiesta HTTP GET all'indirizzo web specificato
      - Indirizzo web (URL)
      - Sì

    * - Group pickup
      - Rispondi ad una chiamata in corso al gruppo di pickup configurato
      - No (il gruppo è configurato)
      - No

    * - Multicast paging
      - Invia l'audio direttamente all'interno configurato per il multicast paging
      - Numero di interno
      - Sì (predefinita)
    * - Record
      - Inizia la registrazione audio della chiamata attiva
      - No
      - Sì (predefinita)

    * - Prefix
      - Aggiungi le cifre specificate al numero digitato
      - Le cifre del prefisso
      - Sì (predefinita)

    * - Phone lock
      - Attiva il blocco dei tasti e dell'interfaccia del telefono. La
        sequenza di sblocco va configurata secondo la documentazione del
        telefono stesso
      - No 
      - Sì (predefinita)

    * - LDAP
      - Mostra la rubrica LDAP configurata sul telefono
      - No
      - Sì (predefinita)

.. _panel-expkeys:

Exp key
-------

Gli *expansion key* sono i tasti programmabili presenti sui *moduli di espansione*,
dispositivi collegabili al telefono che ne aumentano la quantità di tasti disponibili.

Qualora il modulo di espansione renda disponibili più tasti di quanti ne siano visualizzati
nell'interfaccia di amministrazione di |product|, è presente un pulsante
:guilabel:`Mostra altri` per aggiungerne di ulteriori.

Questo tipo di tasti si configura come i :ref:`panel-linekeys`.

.. _panel-display:

Schermo e suoneria
------------------

* :guilabel:`Selezione suoneria` Ogni telefono ha alcune suonerie predefinite che possono essere
  selezionate in base al numero progressivo. Laddove supportata è possibile scegliere la suoneria
  personalizzata, che va poi caricata nel campo descritto di seguito.

* :guilabel:`Gestione suoneria personalizzata` Seleziona un file audio per la suoneria personalizzata
  caricato in precedenza, o ne carica uno nuovo aprendo l'apposito modulo di gestione. Il formato
  audio deve essere compatibile con le specifiche del produttore del telefono.

* :guilabel:`Immagine di sfondo` :guilabel:`Immagine screensaver` Seleziona un file immagine
  rispettivamente per lo sfondo dello schermo del telefono e per lo screensaver, oppure ne carica
  una nuova aprendo l'apposito pannello di gestione. Il formato immagine deve
  essere compatibile con le specifiche del produttore del telefono.

* :guilabel:`Avvio screensaver` Intervallo di tempo dopo il quale viene avviato il salvaschermo.

* :guilabel:`Spegnimento illuminazione` Intervallo di tempo dopo il quale lo schermo abbassa la luminosità
  o spegne la retroilluminazione dello schermo.

* :guilabel:`Luminosità schermo` :guilabel:`Contrasto schermo` Selezionano il livello di luminosità
  e contrasto dello schermo.

.. _panel-preferences:

Preferenze
----------
* :guilabel:`Indirizzo server NTP` Il nome host o l'indirizzo IP del server
  NTP (Network Time Protocol) per impostare automaticamente l'orario del telefono.

* :guilabel:`Pianificazione del provisioning` Selezionando **Solo all'avvio** i telefoni
  rinnovano la propria configurazione dopo l'accensione o il riavvio. Invece selezionando
  **Ogni giorno** i telefoni rinnovano la configurazione in maniera autonoma ad un orario
  casuale della notte. Vedere anche :ref:`provisioning2-aggiornamenti-automatici`.

* :guilabel:`Modalità di trasferimento per i line key` Specifica il modo in cui i line key
  trasferiscono la chiamata in corso ad un altro interno.

  - **Nuova chiamata** avvia una nuova chiamata verso l'interno configurato sul line key,
    ponendo in attesa quella corrente.

  - **Consultativo** pone sempre in attesa la chiamata corrente e il completamento del trasferimento
    può avvenire mentre l'interno configurato sul line key squilla o anche dopo la risposta.

  - **Senza conferma/Cieco** trasferisce immediatamente la chiamata corrente all'interno configurato.

* :guilabel:`Lingua telefono` Lingua utilizzata dallo schermo del telefono e dalla sua interfaccia web.

* :guilabel:`Fuso orario` Imposta il fuso orario del telefono, necessario per il passaggio all'ora legale.

* :guilabel:`Toni di chiamata` Sono specifici di ogni nazione e indicano lo stato della chiamata mediante
  un segnale acustico: squillo libero, occupato, riagganciato...

* :guilabel:`Formato ora` :guilabel:`Formato data` Scelta del formato ora/data mostrato
  sul display del telefono.

* :guilabel:`Firmware` Caricamento e selezione di una nuova versione del firmware del telefono.
  Vedere anche :ref:`provisioning2-firmware-upgrade`.


.. _panel-phonebook:

Rubrica LDAP
------------

Le prime due voci della scelta :guilabel:`Tipo di rubrica` non consentono ulteriori modifiche. I telefoni
utilizzeranno la rubrica centralizzata di |product| i cui parametri di configurazione sono fissi e non modificabili.
Selezionando invece :guilabel:`Rubrica personalizzata` è possibile modificare i restanti campi di questo pannello,
per collegare i telefoni ad un server LDAP di terze parti.

* :guilabel:`Indirizzo server` Nome host o indirizzo IP del server LDAP

* :guilabel:`Numero porta` Porta TCP utilizzata dal server LDAP

* :guilabel:`Nome utente` :guilabel:`Password` Credenziali di autenticazione per il servizio LDAP. Il nome utente potrebbe
  essere indicato come Distinguished Name (DN) LDAP o in altro formato, a seconda dei requisiti del server LDAP.

* :guilabel:`Crittografia` Protegge la connessione con TLS o con STARTTLS. *Attenzione!* Alcuni telefoni non supportano la crittografia ed
  è necessario selezionare **Nessuna**.

* :guilabel:`Base di ricerca (DN)` Limita l'accesso al ramo del database LDAP specificato come base. Di solito la base di ricerca
  è obbligatoria.

* :guilabel:`Filtro di ricerca per nome contatto` :guilabel:`Filtro di ricerca per numero telefonico` I filtri di ricerca LDAP vanno
  specificati con la sintassi definita da RFC-4515 e successivi. Il carattere ``%`` (segno di percentuale) può essere utilizzato
  come segnaposto che il telefono sostituisce con il numero digitato.

* :guilabel:`Attributi per nome contatto` Separati da spazio vanno elencati i nomi degli attributi LDAP
  che possono contenere il nome del contatto.

* :guilabel:`Formato di visualizzazione nome` I nomi degli attributi preceduti dal carattere
  ``%`` (segno di percentuale) possono essere composti a formare il modello con cui il nome viene visualizzato
  sullo schermo del telefono.

* :guilabel:`Attributo per numero di telefono principale` :guilabel:`Attributo per numero di cellulare`
  :guilabel:`Attributo per altro numero di telefono` Questi tre campi contengono nomi di attributi LDAP per i rispettivi
  numeri di telefono.

.. _panel-network:

Rete
----

 telefoni utilizzano il protocollo DHCP per ricevere la configurazione di rete:
IP, maschera di rete, DNS, gateway. In alcuni casi viene utilizzato DHCP anche per
ottenere l'URL di provisioning (fare riferimento a :ref:`provisioning-methods`).

Sono invece configurabili in questo pannello i seguenti parametri:

* :guilabel:`Identificativo VLAN (VID)` Indicando un numero compreso tra 1 e 4094 il
  telefono aggiungerà la marcatura VLAN ai pacchetti generati dal telefono stesso,
  secondo lo standard IEEE 802.1Q.

* :guilabel:`Identificativo VLAN per porta PC` Indicando un numero compreso tra 1 e 4094 il telefono
  aggiungerà la marcatura VLAN ai pacchetti provenienti dalla porta PC (o porta dati), secondo
  lo standard IEEE 802.1Q.

Nei campi VLAN il valore "" (stringa vuota), come al solito, considera l'impostazione
a priorità inferiore (di modello o default), mentre lo "0" (zero) corrisponde a "disabilitato".

.. warning::

  Inserendo un identificativo VLAN errato il telefono può diventare irraggiungibile

Dashboard
=========

.. _dashboard-ref-label:

La dashboard diventa la pagina iniziale di |product| dopo la prima configurazione.

Permette di avere una visione degli oggetti coinvolti nel funzionamento di |product|.


Utenti
------

Vengono mostrati gli utenti utilizzati nella configurazione di |product| con lo stato della presence e dei loro device telefonici.

Nel caso in cui la configurazione della presence dell'utente non sia a default (Disponibile), viene data la possibilità di resettarla riportandola allo stato normale cliccando sul simbolo della gomma.

Cliccando per aprire le informazioni sul singolo device vengono mostrate i dati del dispositivo telefonico:

- Nome
- Modello
- Indirizzo IP, cliccando è possibile collegarsi da rete locale
- Porta SIP
- Codec utilizzati
- DND (Do Not Disturb)
- Call Forward


Fasci
-----

Vengono mostrati i fasci configurati in |product| e il loro stato, mostrando tecnologia, IP, porta, stato e Codec.

.. _applicazioni:

Applicazioni
============

La sezione "Applicazioni" consente di creare, modificare o eliminare determinate funzionalità del centralino, che nel wizard vengono solo create e configurate, ma che poi vengono utilizzate nel CTI.

Ad esempio le schede cliente, nel wizard, vengono configurate per accedere al database e per mostrare in maniera pratica le informazioni ottenute, ma il reale utilizzo sarà all'interno del CTI, durante le chiamate o durante la ricerca di determinate informazioni.

Schede cliente
--------------

a sezione schede cliente, permette di raggruppare le informazioni presenti su database esterni al centralino e mostrarle in fase di chiamata. Ad esempio, sulla chiamata di un certo cliente, prendere le informazioni sul database relative alle sue fatture o ad eventuali insoluti e valutare ad esempio, se fornire assistenza o meno. Per generare una nuova scheda cliente i passi sono i seguenti

Sorgenti
........

Cliccare sul bottone "Crea nuova sorgente" e compilare il form che si presenta:

- Tipo database: specificare la tipologia di database su cui andare a prendere le informazioni
- Nome database: specificare il nome del database a cui connettersi
- Indirizzo database: specificare l'indirizzo per collegarsi al database (localhost, socket o IP esterni)
- Porta database: specificare un porta del db diversa da quella di default proposta
- Utente database: specificare l'utente usato per connettersi al database
- Password database: specificare la password per collegarsi al database
- Connessione: premere il pulsante "Verifica" per testare che le informazioni inserite siano corrette per la connessione

Premere "Salva" per aggiungere la sorgente database. La sorgente appena creata apparirà tra la lista di quelle disponibili

Template
........

I template sono il fac-simile per le vostre schede cliente. Utilizzano il motore `ejs`, che ha una sintassi *JavaScript-like*, che vi permette di scrivere codice HTML utilizzando specifiche direttive che potete trovare nel sito https://github.com/tj/ejs.

Cliccare sul bottone "Crea nuovo template" per iniziare il processo di creazione:

- Nome: specificare il nome del template
- Results: contiene l'output della vostra query in formato JSON, utilizzate il campo di testo per effettuare delle prove e vedere come il vostro template HTML risulterà essere con i vostri dati.
- Codice (ejs): in questo campo di testo, inserite il codice del vostro template, che rispetta la sintassi `ejs`, utilizzando i valori sopra indicati (che non sono altro che le colonne di risultato della vostra query)
- Anteprima: combinando i risultati e il codice `ejs` vedrete l'output relativo HTML che sarà la vostra scheda cliente.

Il centralino prevede giù dei template predefiniti con codice HTML già scritto, che potete duplicare e modificare cambiando colore.

Schede
......

Una volta creata la sorgente e il template della vostra scheda, in questa sessione dovrete unire le due informazioni per far si che la scheda venga creata correttamente. Cliccare sul bottone "Crea nuova scheda" e compilare il form:

- Nome: nome della scheda cliente
- Sorgente: specificare la sorgente di database precedentemente creata
- Template: specificare il template da associare a quello precedentemente creato
- Profilo: scegliere il tipo di profilo utente a cui far vedere la scheda cliente che state creando
- Query: inserite la query che vi restituirà le informazioni relative
- Render: premendo il pulsante, la **query** verrà eseguita sulla **sorgente** specificata e i dati verranno inseriti nel **template** selezionato, producendo l'output desiderato.

Premere il tasto "Salva" per salvare la vostra scheda cliente.

.. warning:: Una volta creata la query e la scheda e verificato che il tutto funziona, utilizzare la variabile `$NUMBER` per sostituire i parametri numerici di ricerca delle vostra query.
*Esempio*:

Se la vostra query è di questo tipo: ::

  select * from phonebook where homephone like '%150' or workphone like '%850' or cellphone like '%150' or fax like '%850'

dovrà diventare così: ::

 select * from phonebook where homephone like '%$NUMBER' or workphone like '%$NUMBER' or cellphone like '%$NUMBER' or fax like '%$NUMBER'

La variabile `$NUMBER` non è altro che il numero chiamante del centralino a cui la scheda cliente fa riferimento per effettuare la raccolta dei dati da mostrare.

Sorgenti video
--------------

In questa sezione è possibile configurare le sorgenti video o telecamere IP. Cliccando sul bottone "Crea nuova sorgente" è possibile compilare un form per la creazione:

- Nome: specificare il nome da dare alla sorgente
- Extension: specificare l'interno relativo alla sorgente video (precedentemente creata nella sezione "Utenti")
- URL: specificare l'URL di collegamento in cui prendere i frame video da mostrare
- Codice d'apertura: inserire il tono DTMF relativo per un eventuale codice d'apertura (se la telecamera è collegata ad un cancello ad esempio)
- Profilo: specificare il profilo da assegnare alla sorgente per filtrare la tipologia di utente che ha accesso alla sorgente video
- Connessione: premere il bottone "Verifica" e verificare che l'URL inserito sia corretto, testando la connessione e ottenendo il frame video relativo.

Una volta completata la compilazione del form premere "Salva" per salvare le informazioni e creare una nuova sorgente video.

.. _external-phonebook:

Aggiunta di rubriche esterne
----------------------------

Dal menù :menuselection:`Applicazioni -> Sorgenti rubrica` è possibile definire sorgenti di
rubriche esterne a quella di |product| per integrarla con contatti residenti su database esterni.

Per configurare una nuova sorgente sono necessari tre passaggi:

1. **Sorgente:** configurazione dell'accesso al database sorgente dei contatti

2. **Mappa:** associazione dei campi del database sorgente a quelli della rubrica di |product|

3. **Impostazioni:** scelta dell'intervallo di sincronizzazione

Sorgente rubrica
................

Alla sorgente va assegnato un :guilabel:`Nome rubrica` che deve essere
univoco, per poter distinguere l'origine dei contatti importati nella rubrica di |product|.

In base al :guilabel:`Tipo sorgente` vanno poi specificati ulteriori attributi:

MySQL

  Sono necessari nome database, indirizzo/porta server, nome utente e password del database
  sorgente.

  Inoltre nell'area di testo :guilabel:`Select query` va inserita l'interrogazione
  in linguaggio SQL utilizzata per prelevare i dati da importare nella rubrica centralizzata.
  Se presente nell'area di testo, sostituire la parola ``[table]`` con il nome della
  tabella sorgente.

CSV

  Nel campo :guilabel:`URL` si può indicare l'indirizzo web di un file in formato CSV
  (*Comma-Separated Values*, valori separati da virgola e doppie virgolette "" come qualificatori di testo, obbligatorio se il campo contiene una virgola o uno spazio). Sono accettati indirizzi che iniziano con ``http://`` e ``https://``.

  In alternativa è possibile caricare tramite il pulsante a destra dello stesso
  campo di testo un file in formato CSV. In questo caso il campo :guilabel:`URL` sarà
  valorizzato automaticamente.

  Il file CSV deve essere in codifica UTF-8 e contenere i nomi delle colonne sulla prima riga.

Il pulsante :guilabel:`Verifica` consente la visualizzazione dell'anteprima dei dati prelevati dalla sorgente.

Risoluzione nomi personalizzata
...............................
Nel caso si desiderasse utilizzare una sorgente diversa dalla rubrica centralizzata per risolvere i nomi, è possibile fare uno script custom di risoluzione e metterlo nella cartella `/usr/src/nethvoice/lookup.d`.
Nella cartella `/usr/src/nethvoice/samples/` ci sono due script di esempio `lookup_dummy.php` e `lookup_vte.php` che possono essere usati come spunto per creare il proprio personalizzato. Il primo restituisce un risultato finto qualunque numero chiami o sia chiamato, il secondo utilizza un'API esterna.

Mappa
.....

In questo passaggio è necessario stabilire la corrispondenza tra i campi del database sorgente e quelli destinatari della rubrica di |product|.

Per esempio, si potrebbe associare il campo ``phone`` sorgente con quello destinatario ``workphone``.

Ecco la mappa dei campi della Rubrica Centralizzata e di come vengono usati:

.. list-table:: Campi Rubrica Centralizzata
    :widths: 10 10
    :header-rows: 1

    * - owner_id
      - Proprietario del contatto

    * - type
      - Sorgente di provenienza
    * - homeemail
      - Indirizzo email domicilio

    * - workemail
      - Indirizzo email lavorativo

    * - homephone
      - Numero telefonico domicilio

    * - workphone
      - Numero telefonico lavorativo

    * - cellphone
      - Numero cellulare

    * - fax
      - Numero fax

    * - title
      - Mansione

    * - company
      - Azienda

    * - notes
      - Note

    * - name
      - Nome e cognome
    * - homestreet
      - Indirizzo domicilio

    * - homepob
      - Casella postale domicilio

    * - homecity
      - Città domicilio

    * - homeprovince
      - Provincia domicilio

    * - homepostalcode
      - Codice postale domicilio

    * - homecountry
      - Stato/regione domicilio

    * - workstreet
      - Indirizzo lavorativo

    * - workpob
      - Casella postale lavoro

    * - workcity
      - Città lavorativa

    * - workprovince
      - Provincia lavorativa

    * - workpostalcode
      - Codice postale lavorativo

    * - workcountry
      - Stato/Regione lavorativa

    * - url
      -  Indirizzo WEB

Impostazioni
............

È possibile scegliere l'intervallo di sincronizzazione dei contatti tra:

- 15 minuti
- 30 minuti
- 1 ora
- 6 ore
- 24 ore

Una volta creata la sorgente, è possibile:

- eseguire subito la sincronizzazione tramite il pulsante :guilabel:`Sincronizza`
- abilitare/disabilitare la sincronizzazione

Per ulteriori informazioni sulla rubrica di |product| e su come integare altri tipi
di sorgenti, come database ODBC o script personalizzati, consultare
`Rubrica Centralizzata <http://nethserver.docs.nethesis.it/it/v7/phonebook-mysql.html>`_.

URL parametrizzati
------------------

Consentono all'utente finale di poter invocare un URL parametrizzato in corrispondenza della ricezione di una chiamata.
L'URL sarà parametrizzato coi dati del chiamante e potrà essere "aperto" in uno dei seguenti quattro scenari:

1) mai
2) quando la chiamata in ingresso sta squillando
3) quando la chiamata in ingresso è stata risposta
4) cliccando il pulsante apposito nel box di gestione chiamata

Per la creazione di un URL sono necessarie due informazioni:

- l'url stesso
- la scelta di un profilo utente

La composizione della URL può essere fatta utilizzando questi parametri valorizzati per ogni chiamata:

- `$CALLER_NUMBER` (Numero Chiamante)
- `$CALLER_NAME` (Nome associato da |product| al numero chiamante)
- `$CALLED` (Numero Chiamato)
- `$UNIQUEID` (Identificativo univoco della chiamata)


E' possibile abilitare l'opzione `Solo chiamate su code` per attivare la URL parametrizzata solo per chiamate che suonano in una coda.

Tutti gli utenti che hanno quel profilo saranno abilitati all'utilizzo dell'URL appena creato.

.. note::

    1. Ad un profilo può essere associato un solo URL.
    2. Affinché l'URL possa essere invocato è necessario che l'utente finale abbia abilitato la visualizzazione dei popups nel proprio browser !

In alcuni casi può essere necessario eseguire un'API per poter formare l'URL che dovrà essere visualizzato dal CTI, per esempio se si deve aprire un URL che contiene un codice cliente, ma è necessario eseguire un API esterna per poter trovare il corretto codice cliente a partire dal numero di telefono. Per ottenere questo comportamento, è necessario creare uno script personalizzato. Si può prendere d'esempio lo script `/usr/src/nethvoice/parametrized_url_customercode.php`

Gestione Multipla Interni
-------------------------

L'applicazione *Gestione Multipla Interni* consente di modificare massivamente gruppi di utenti.

É possibile selezionare gli interni che si desidera modificare utilizzando la lista "Seleziona" o le checkbox accanto agli utenti elencati.

Cliccando poi sul tasto :guilabel:`Modifica`, verrà visualizzata una finestra con le impostazioni che possono essere modificate.

Il contenuto dei campi viene mostrato solo se gli interni selezionati hanno tutti lo stesso valore per quel campo, altrimenti rimane vuoto.

L'icona :guilabel:`lucchetto` chiuso alla destra del campo indica che il campo non verrà modificato.

Per esempio, se gli interni 201 e 202 hanno un valore differente per il gruppo di chiamata, il campo sarà vuoto, ma se il :guilabel:`lucchetto` è chiuso, il valore non verrà sovrascritto.

Se invece si clicca sul :guilabel:`lucchetto` in modo che sia aperto e si salva, il gruppo di chiamata verrà sovrascritto con il valore del campo.

.. _wizard2-telefoni-multipli:

Gestione Multipla Telefoni
--------------------------

La pagina :guilabel:`Applicazioni > Gestione multipla telefoni` consente di
selezionare più telefoni in base a criteri di gruppo utenti o di modello.

Una volta che sono stati selezionati uno o più modelli, in base alla selezione
sarà possibile effettuare le azioni descritte nei seguenti paragrafi.

Riavvio
.......

Tutte le impostazioni di provisioning vengono recepite dai telefoni
automaticamente ogni notte, se gli :ref:`aggiornamenti automatici
<provisioning2-aggiornamenti-automatici>` sono abilitati.

Altrimenti è necessario riavviare i telefoni mediante la pagina di
:guilabel:`Gestione multipla telefoni`. Solo i telefoni che hanno completato la
registrazione SIP possono essere riavviati da questa pagina.

Il riavvio può essere immediato oppure pianificato in un tempo futuro mediante i
pulsanti :guilabel:`Riavvia ora` e :guilabel:`Riavvio ritardato`.

Scelta modello
..............

Se i telefoni selezionati appartengono al medesimo produttore, è possibile
assegnare a tutti lo stesso modello mediante il pulsante :guilabel:`Assegna
modello`.


App mobile
==========


.. _nethcti_mobile:

|product_cti|
-------------

L'applicazione mobile del |product_cti| è disponibile per iOS e Android ed è scaricabile dai rispettivi App Store (controllare la versione di software minima richiesta nelle specifiche dell'App negli store).

I requisiti per utillizzare l'app sono:

- certificato valido installato sul |product|
- ip pubblico statico
- indirizzo FQDN del |product| raggiungibile e utilizzato nella configurazione dell'app (manualmente o nel |product_cti|)
- porta 443 HTTPS raggiungibile
- porta 6061 TCP raggiungibile
- range 10000-20000 UDP raggiungibile
- :guilabel:`Accesso SIPS esterno` deve essere abilitato nella pagina :guilabel:`Amministrazione -> Impostazioni` del wizard

Per far funzionare la App Mobile dalla stessa rete locale del |product| è necessario che sul firewall (più precisamente sull'apparato che gestisce il NAT dell'ip pubblico associato al |product|) sia abilita la funzione "hairpin NAT" denominata anche come NAT reflection / NAT hairpining / NAT on a stick / loopback NAT.

.. note:: In alternativa al FQDN del |product| è possibile usare un nome host e dominio configurato come alias per il server con gli stessi requisiti.
   Per usarlo al posto del FQDN utilizzare questi comandi sostituendo ad ALIAS il nome host seguito dal dominio (ad esempio host.dominio.com): ::

        config setprop nethvoice PublicHost ALIAS
        signal-event nethserver-nethvoice14-update
        signal-event nethcti-server3-update

Configurazione
^^^^^^^^^^^^^^
Per configurare l'applicazione è necessario abilitare il campo :guilabel:`Mobile App` relativo all'utente desiderato nella pagina Configurationi del |product|.

Automaticamente verrà creato un nuovo interno SIP per l'utente selezionato necessario al funzionamento dell'applicazione.

Sarà poi sufficiente eseguire il login nell'applicazione e automaticamente verrà configurata utilizzando l'interno SIP a lei dedicato.

Per eseguire il login nell'applicazione sarà necessario dal menù di sinistra selezionare la voce :guilabel:`Login` per accedere alla sezione dalla quale eseguire l'azione necessaria.

Dalla sezione :guilabel:`Login` dell'applicazione è possibile accede in due modi:

- Inserendo l'indirizzo FQDN(o l'alias configurato come specificato sopra) del server e le credenziali nome utente e password dell'utente
- Scansionando il QRCode dalla sezione :guilabel:`dispositivi` nelle Impostazioni dell'interfaccia web del |product_cti| cliccando su genera QRcode nella card relativa alla App Mobile

L'applicazione mobile |product_cti| eseguirà l'autenticazione sul server nethcti e sarà quindi possibile consultare il log nethcti in caso di errore.

Una volta eseguito l'accesso l'applicazione riceverà le chiamate in arrivo anche durante il funzionamento in background e sarà possibile eseguire chiamate in uscita.

Nel caso in cui il comportamento dell'applicazione all'arrivo di una chiamata non sia come desiderato sarà possibile gestirlo dalle impostazioni avanzate del telefono relative all'applicazione |product_cti|.

.. _provisioning-phone2-section:

Provisioning dei telefoni
=========================

.. hint::

    Fare riferimento a :ref:`provisioning-migration-section` e a
    :ref:`provisioning-section` per la versione precedente.


Cosa significa **Provisioning**? Provisioning è configurare i telefoni in
modalità automatica limitando al massimo le operazioni necessarie.



Configurazione di |product|
---------------------------


Operazioni da compiere su |product|:

#. Identificazione dei telefoni

#. Associazione dei telefoni agli utenti


Identificazione dei telefoni
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
L'indirizzo MAC è alla base del **Provisioning** di |product| in quanto
identifica il telefono in maniera univoca.

L'inserimento dell'indirizzo MAC dei telefoni non richiede il collegamento
del telefono alla rete. È infatti possibile inserire i MAC
address di telefoni ancora imballati.

In ogni caso l'inserimento degli indirizzi MAC dei telefoni può avvenire con
le seguenti modalità:

* Digitare o copiare l'indirizzo MAC da un foglio di
  calcolo, fattura o altro documento

* Scansionare le reti locali alla ricerca di apparati telefonici
  supportati, già accesi e collegati in rete

* Scansionare il codice a barre dell'indirizzo MAC del telefono tramite app
  per smartphone "Scan & Play"


Associazione dei telefoni agli utenti
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

La configurazione di un telefono è completa quando questo viene associato ad un
utente.

Ad ogni utente possono essere associati al massimo 8 dispositivi telefonici.

|product| assegna ad ogni dispositivo associato all'utente una numerazione
progressiva con il criterio seguente:

* ``Interno Principale`` - telefono principale, per esempio ``201``

* ``91+Interno Principale`` - telefono 2, per esempio ``91201``

* ``92+Interno Principale`` - telefono 3, per esempio ``92201``

* ...

Tuttavia dal punto di vista degli utenti, l'Interno Principale è l'unico numero
importante da ricordare.



Azioni da compiere sui telefoni
-------------------------------

.. note::

    Consideriamo al **primo avvio** i telefoni nuovi, appena tolti dalla
    scatola, o che hanno subito il ripristino dei valori di fabbrica e non sono
    mai stati avviati.


I telefoni al **primo avvio** sono già in grado di raggiungere |product| per
ottenere la propria configurazione secondo i metodi supportati.

L'unica azione da compiere in questi casi è collegare il cavo Ethernet con PoE
(Power over Ethernet) al telefono. Qualora PoE non fosse disponibile sarà
necessario collegare anche il cavo di alimentazione del telefono.

.. warning::

    Verificare la compatibilità dei telefoni con i metodi di provisioning
    supportati. Leggere attentamente le sezioni seguenti

Nel caso un telefono sia già usato è possibile predisporlo all'associazione con
|product| tramite le procedure di **aggiornamento del firmware** e di
**ripristino dei valori di fabbrica**. Entrambe le procedure sono disponibili
tramite l'interfaccia web di amministrazione del telefono.

.. _provisioning-methods:

Metodi di provisioning
----------------------

I telefoni possono accedere alla propria configurazione mediante i protocolli
standard del web, HTTP o HTTPS (porta TCP 80 o 443).

Quando il MAC address del telefono è inserito in |product| viene generato un
URL (indirizzo) di provisioning. Per esempio: ::

    https://mio.centralino.cloud/provisioning/1234567890.1234/{mac}.cfg

Questo URL contiene un segreto (``1234567890.1234`` nell'esempio) che autentica
ed identifica il dispositivo che ne farà uso.

Per ottenere l'URL di provisioning il telefono al primo avvio
può utilizzare due metodi, **RPS** e **DHCP**.

Il metodo **RPS** (Redirect & Provisioning Service) prevede l'inserimento dell'URL
di provisioning nel sito web del produttore del telefono. |product| è in grado
di effettuare questo inserimento automaticamente. Appena acceso il telefono
al primo avvio cerca di contattare il sito del produttore per ottenere l'URL di
provisioning.

Il metodo **DHCP** si basa sulla configurazione di OPTION 66 del protocollo
DHCP (Dynamic Host Configuration Protocol) in maniera specifica per ogni marca
di telefono. Se |product| svolge il ruolo di DHCP server della rete a cui sono
collegati i telefoni le impostazioni necessarie per raggiungere l'URL di
provisioning sono già configurate. In caso contrario e qualora **RPS** non sia
utilizzabile è necessario configurare il server DHCP di rete in maniera
opportuna.

Nel caso né RPS né DHCP funzionino è possibile accedere all'interfaccia web di
amministrazione del telefono ed immettere l'URL di provisioning manualmente.
Ricordarsi di disattivare le altre modalità di provisioning, come DHCP e PNP.

L'URL di provisioning è visualizzato nell'interfaccia di amministrazione di
|product| per ogni telefono, tramite il pulsante :guilabel:`Info` alla pagina
:guilabel:`Dispositivi > Telefoni`.

In ogni caso, una volta ottenuto l'URL di provisioning, il telefono utilizza
sempre questo per accedere alla propria configurazione su |product|.

.. warning::

    Fare riferimento alla sezione :ref:`provisioning-support-section` per
    ulteriori informazioni sul supporto dei produttori a RPS e DHCP

Specifiche della configurazione dei telefoni
--------------------------------------------

e si vuole modificare o personalizzare le impostazioni di telefoni configurati
tramite il provisioning, accedere all'interfaccia web di amministrazione di
|product|, modificando le impostazioni a livello di *Default*, *Modello* o di
*singolo telefono*.

I parametri modificabili comprendono:

* Lingua                                                         
* Fuso orario
* Formato data/ora                                        
* Toni
* Password utente admin                              
* Avviso di chiamata
* Suoneria                                                     
* Modalità di trasferimento
* Rubrica LDAP                                            
* VLAN
* Soft keys (Tasti del telefono sotto lo schermo)                                                    
* Line keys (Tasti linea)
* Exp keys  (Tasti linea dei moduli di espansione)
* Screen Saver e Sfondo

Fare riferimento a :ref:`wizard2-section` per maggiori informazioni.

.. warning::

   Non cambiare le impostazioni dall'interfaccia di amministrazione del
   telefono.

Ad ogni riavvio il telefono riprende le configurazioni dall'URL provisioning.
Eventuali modifiche eseguite dall'interfaccia di amministrazione del telefono
andranno perse.

Nelle sezioni successive sono descritte alcune impostazioni fornite da |product|.

I telefoni provisionati aggiorneranno la loro configurazione automaticamente anche
ad ogni cambio di stato (Disponibile, Non Disturbare, etc.) in |product_cti| della
utenza collegata per mantenere l'uniformità dello stato su tutti i dispositivi.

Questo aggironamento della configurazione non comporta alcun disservizio o riavvio
del telefono.


Password di admin
^^^^^^^^^^^^^^^^^

L'interfaccia web di amministrazione del telefono è accessibile con nome utente
``admin`` e password generata casualmente durante l'installazione di |product|.

La password è disponibile nell'interfaccia di amministrazione di |product|, alla
pagina :guilabel:`Modelli > Impostazioni di default`.


.. _provisioning2-aggiornamenti-automatici:

Aggiornamenti automatici
^^^^^^^^^^^^^^^^^^^^^^^^
Il telefono contatta automaticamente tutte le notti |product| per aggiornare la
propria configurazione. È possibile disabilitare del tutto l'aggiornamento
automatico.

In ogni caso il telefono scarica la configurazione tutte le volte che viene
riavviato.

.. _provisioning2-firmware-upgrade:

Aggiornamento firmware
^^^^^^^^^^^^^^^^^^^^^^

Il costruttore del telefono pubblica periodicamente nel proprio sito
web gli aggiornamenti al firmware per i vari modelli dei propri telefoni.

È possibile distribuire il firmware aggiornato a tutti i telefoni di
uno stesso modello oppure ad un singolo telefono. Il file del firmware
ottenuto dal sito del costruttore va caricato tramite l'interfaccia
di amministrazione di |product| rispettivamente in
:guilabel:`Modelli > Preferenze > Firmware` oppure in
:guilabel:`Configurazione > Dispositivi associati > Modifica >
Preferenze`.

Il nome del file può contenere solo lettere, numeri e i simboli ``._-()``.

I telefoni recepiscono l'aggiornamento secondo i tempi indicati
in :ref:`provisioning2-aggiornamenti-automatici`.

.. hint::

    Quando i telefoni hanno recepito l'aggiornamento, deselezionare
    il file del firmware nell'interfaccia di |product| per ridurre
    il traffico di rete.

Elenco delle pagine web per il download del firmware:

- `Yealink <http://support.yealink.com/documentFront/forwardToDocumentFrontDisplayPage>`_
- `Snom <https://service.snom.com/display/wiki/Firmware+Update+Center>`_
- `Fanvil <https://fanvil.com/Support/download.html>`_
- `Gigaset <https://teamwork.gigaset.com/gigawiki/pages/viewpage.action?pageId=37486876>`_
- `Sangoma <https://wiki.sangoma.com/display/PHON/Phone+Firmware+Release+Notes>`_


Telefoni supportati
-------------------

NethPhone
^^^^^^^^^

**Versione FIRMWARE 2.0 o superiore**

* NP-X3
* NP-X5
* NP-X210

Fanvil
^^^^^^

**Versione FIRMWARE 2.0 o superiore**

* V62, V63, V64, V65, V67
* X1/S/SP
* X210
* X3/S/SP/G/SG, X3U, X3U Pro
* X4/G/SG, X4U, X4U-V2
* X5S, X5U, X5U-V2
* X6, X6U, X6U-V2
* X7A/C
* X301/P/G/W, X303/P/G/W
* H2U, H2U-V2, H5

Yealink
^^^^^^^

**Versione FIRMWARE 0.84 o superiore**

* T19(P) E2, T21(P) E2, T23P/G, T27G, T29G
* T30/P, T31/P/G/W, T33P/G, T34W
* T40P/G, T41P/S/U, T42G/S/U, T43U, T46G/S/U, T48G/S/U, T49G
* T52S, T53/W/C, T54S/W, T56A, T57W, T58V/A/W, VP59

Snom
^^^^

**Versione FIRMWARE 8.7.5 o superiore**

* D120, D140, D150
* D305, D315, D345, D375, D385
* D710, D712, D713, D715, D717, D725, D735, D745, D765, D785
* D862, D865

Gigaset
^^^^^^^

**Versione FIRMWARE 3.15.9 o superiore**

* Maxwell Basic, Maxwell 2, Maxwell 3, Maxwell 4
   
Sangoma
^^^^^^^

**Versione FIRMWARE X.0.4.67 o superiore**

* S205, S206
* S300, S305
* S400, S405, S406
* S500, S505
* S700, S705

.. _provisioning-support-section:

Compatibilità provisioning
--------------------------

La seguente tabella risassume i metodi di provisioning utilizzati da ogni
produttore al primo avvio del telefono.

.. list-table:: Metodi di provisioning per produttore
    :widths: 5 5 5 5 10
    :header-rows: 1

    * - Produttore
      - Metodo primario
      - Metodo secondario
      - DHCP option
      - DHCP option value
    * - NethPhone
      - RPS
      - DHCP
      - 66
      - ``http://IP_CENTRALINO/provisioning/$mac.cfg``
    * - Fanvil
      - RPS
      - DHCP
      - 66
      - ``http://IP_CENTRALINO/provisioning/$mac.cfg``
    * - Yealink
      - RPS
      - DHCP
      - 66
      - ``http://IP_CENTRALINO/provisioning/$MAC.cfg``
    * - Snom
      - RPS
      - DHCP
      - 66 e 67
      - ``http://IP_CENTRALINO/provisioning/{mac}.xml``
    * - Gigaset
      - DHCP [#f1]_
      - RPS
      - 114
      - ``http://IP_CENTRALINO/provisioning/%MACD.xml``
    * - Sangoma
      - RPS [#f2]_
      - DHCP
      - 66
      - ``http://IP_CENTRALINO/provisioning``

.. [#f1] Per i telefoni Gigaset assicurarsi che il server DHCP di rete, se
         diverso da |product|, non fornisca OPTION 66

.. [#f2] Il servizio RPS di Sangoma non consente l'inserimento dell'URL di
         provisioning da |product|. Inserire l'URL di provisioning manualmente
         tramite il portale di Sangoma, o utilizzare il metodo DHCP.

Provisioning dei gateway
========================

Gateway supportati
------------------ 

GRANDSTREAM
^^^^^^^^^^^

* Modelli FXS HT801 e HT802
* Modelli FXS HT812 e HT814
* Modelli FXS GXW4216 e GXW4224 e GXW4232 e GXW4248


MEDIATRIX
^^^^^^^^^

* Serie 4400


PATTON
^^^^^^

* Modelli BRI SmartNode e Trinity
* Modelli PRI SmartNode e Trinity
* Modelli FXO SmartNode


SANGOMA
^^^^^^^

* Vega 60 2 BRI, 4 BRI 4 FXO
* Vega 100G

Provisioning
------------


La configurazione dei gateway avviene nel Wizard.

Il provisioning per i gateway segue le stesse regole di quello per i telefoni con una fondamentale differenza:

al contrario dei telefoni, il |product| si collega in telnet direttamente al gateway per caricare la configurazione senza che siano loro che la debbano recuperare.

La configurazione dei gateway avviene con il gateway online, di default i gateway si avviano in DHCP.

E’ comunque possibile cliccando su :guilabel:`Aggiungi Gateway` creare una configurazione per un gateway non ancora collegato per poi configurarlo caricando il file dall'interfaccia web del gateway.

Configurazione dei gateway in rete
----------------------------------

Effettuare la scansione delle reti locali nel Wizard in :ref:`Fasci Fisici <fisici>`.

Una volta trovato in rete il gateway che si vuole configurare è necessario specificare i pochi parametri di configurazione necessari:

1. IP del dispositivo, la configurazione del gateway richiede un IP statico
2. Maschera di rete
3. Gateway di rete
4. IP del |product|, in alcuni scenari d'installazione il gateway può raggiungere il |product| non tramite il suo IP locale
5. Eventuali caratteristiche necessarie alla configurazione delle linee collegate (per linee ISDN la modalità della borchia, per linee analogiche il numero chiamato della linea)

.. note:: Per i modelli Grandstream con 2 interfacce di rete, va indicato il mac-address dell'interfaccia LAN ma la configurazione creata da |product| utilizza l'interfaccia WAN che è quella che dovrà essere usata

Dopo aver salvato la configurazione è possibile cliccando sul pulsante :guilabel:`Carica` consentire al |product| di collegarsi in telnet al gateway per caricare e/o indicare dove recuperare (a seconda della marca) la configurazione.

.. note:: I modelli Grandstream non supportano la funzionalità di caricamento della configurazione da |product|, la configurazione va scaricata e caricata nell'interfaccia Web del gateway (sezione Upload Configuration)

C'è anche la possibilità di scaricare la configurazione del gateway per caricarla tramite l’interfaccia web nel caso il gateway non sia raggiungibile direttamente dal |product| cliccando nel tasto per la gestione (simbolo con tre quadratini).



















Backup & Restore
================

