---
title: "Reset della password di root di Rocky Linux 9"
sidebar_position: 99
---
# Reset della password di root di Rocky Linux 9

Usa questa procedura per reimpostare la password di `root` su un sistema Rocky Linux 9.

1. Avvia la macchina. Quando compare la schermata del bootloader, premi **Freccia Su** o
   **Freccia Giu** per interrompere il conto alla rovescia del boot.
2. Seleziona il kernel piu` recente e premi **e** per modificare i parametri di boot.
3. Individua la riga che inizia con `linux`, poi modificala in questo modo:
   - rimuovi la direttiva `console` e il suo valore, per esempio `console=ttyS0,115200n8`
   - rimuovi eventuali altri attributi `console=...` o `vconsole=...`
   - sostituisci `ro` con `rw`
   - aggiungi `init=/bin/bash`

![Modifica la riga di boot Linux](/_static/tutorial/reset-rocky-linux-root-password/edit-linux-line.png)

La riga `linux` modificata deve apparire in modo simile a questo:

![Riga di boot Linux modificata](/_static/tutorial/reset-rocky-linux-root-password/modified-linux-line.png)

4. Premi **Ctrl-x** per avviare il sistema con i parametri modificati.
5. Attendi la fine del boot e la comparsa del prompt della shell.

![Prompt della shell temporanea di root](/_static/tutorial/reset-rocky-linux-root-password/root-shell-prompt.png)

6. Cambia la password di `root`:

```bash
passwd
```

7. Forza il relabel di SELinux:

```bash
touch /.autorelabel
```

:::warning
Digita il comando `touch /.autorelabel` esattamente come mostrato. Se sbagli il nome del
file o il percorso, dovrai ripartire dall'inizio con tutta la procedura.
:::

8. Riavvia il sistema:

```bash
/usr/sbin/reboot -f
```

La macchina puo` riavviarsi piu` di una volta. Quando la sequenza di riavvio e` completata,
accedi con la nuova password di `root`.
