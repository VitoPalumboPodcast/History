# History

Questo progetto visualizza una mappa e una timeline sincronizzate per mostrare eventi storici.

## Obiettivo
L'obiettivo è fornire una semplice interfaccia web che permetta di esplorare gli eventi sia nel tempo sia nello spazio.

## Prerequisiti
Per aprire correttamente la pagina è consigliato utilizzare un server HTTP locale. È sufficiente avere Python installato o un qualsiasi strumento analogo.

## Avvio in locale
1. Apri un terminale nella cartella del progetto.
2. Avvia un server HTTP, ad esempio con Python:
   ```bash
   python3 -m http.server
   ```
3. Visita `http://localhost:8000/index.html` con il browser per vedere la pagina.

## Uso di Leaflet e vis.js
- **Leaflet** è impiegato per generare la mappa interattiva e i marker associati agli eventi.
- **vis.js** (Timeline) gestisce la timeline degli eventi e ne consente la selezione sincronizzata con la mappa.
