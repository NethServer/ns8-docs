---
title: Firewall
sidebar_position: 6
---
# Firewall

NethServer 8 include un firewall integrato semplice.

- L'interfaccia di rete VPN del cluster `wg0` fa parte di una zona fidata in cui tutto il traffico è consentito.
- Tutte le altre interfacce di rete fanno parte di una zona pubblica in cui sono aperte solo porte specifiche.

Per impostazione predefinita, un nodo NS8 ha le seguenti porte aperte:

- Wireguard VPN, 55820 UDP
- HTTP e HTTPS, 80 e 443 TCP
- SSH, 22 TCP (vedere [Gestire il reindirizzamento della porta SSH](#ssh-redirection))
- Cockpit (non installato di default), 9090 TCP

Le applicazioni che richiedono porte aperte pubblicamente, come il server di posta, configureranno automaticamente il firewall.
## Verifica delle impostazioni del firewall

Nella pagina Impostazioni, cliccare sulla scheda **Firewall** e selezionare un nodo del cluster.

- Per il nodo selezionato, una tabella riassume i servizi in esecuzione sul nodo e le relative porte TCP e UDP aperte. Se una porta non è elencata qui, è chiusa per le connessioni dalla zona pubblica.
- Sotto la tabella dei servizi e delle porte aperte, è presente un elenco delle interfacce di rete del nodo.

La stessa pagina è accessibile dalla pagina Nodi selezionando l'azione `Firewall` dal menu a tre punti della scheda di ciascun nodo.
## Gestire le porte manualmente

Per consentire le connessioni alla porta in ascolto di un servizio di terze parti, utilizzare `firewall-cmd`. Ad esempio, il seguente comando apre la porta TCP 9000:

    firewall-cmd --add-port=9000/tcp

Per chiudere la stessa porta, utilizzare:

    firewall-cmd --remove-port=9000/tcp

Le modifiche alla configurazione del firewall vengono perse dopo un riavvio del firewall o del sistema, a meno che lo stesso comando non venga eseguito una seconda volta con l'opzione `--permanent`. Fare riferimento alla pagina del manuale di `firewall-cmd` per ulteriori informazioni.

Per visualizzare l'elenco dei servizi e delle porte consentiti, eseguire:

    firewall-cmd --list-all
## Gestire il reindirizzamento della porta SSH {#ssh-redirection}

Quando un nodo è accessibile pubblicamente, come un VPS cloud, è consigliabile modificare la porta SSH predefinita 22 con una porta personalizzata. Tuttavia, cambiare la porta a livello di configurazione di `sshd` presenta due svantaggi:

1.  È necessario modificare la policy predefinita di SELinux.
2.  Il requisito di supporto remoto della [Subscription](../about/subscription.md) non funziona, poiché `sshd` deve continuare ad accettare connessioni locali sulla porta 22.

Poiché in ogni caso è necessario modificare la configurazione di Firewalld, l'approccio preferito è configurare solo Firewalld con un *port forward* (o *reindirizzamento di porta*) e lasciare `sshd` invariato.

I seguenti comandi aprono la porta 2222 e limitano l'accesso alla porta 22 alle interfacce fidate:

    firewall-cmd --permanent --add-forward-port=port=2222:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --add-port=2222/tcp
    firewall-cmd --permanent --service=ssh --remove-port=22/tcp
    firewall-cmd --reload

Se successivamente si decide di cambiare porta (ad esempio, da 2222 a 2019), è necessario prima rimuovere il vecchio reindirizzamento di porta. La procedura è la seguente:

    firewall-cmd --permanent --add-forward-port=port=2019:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --add-port=2019/tcp
    firewall-cmd --permanent --remove-forward-port=port=2222:proto=tcp:toport=22
    firewall-cmd --permanent --service=ssh --remove-port=2222/tcp
    firewall-cmd --reload
