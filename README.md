# History

Questa repository raccoglie dati sugli eventi storici per l'utilizzo in mappe interattive basate su [Leaflet](https://leafletjs.com/).

## Struttura di un record evento
Ogni evento è descritto tramite un oggetto JSON con i seguenti campi **obbligatori**:

- `id`: identificativo univoco dell'evento
- `title`: titolo sintetico dell'evento
- `start`: data o periodo d'inizio
- `end`: data o periodo di fine
- `coords`: coordinate in formato `[latitudine, longitudine]`
- `category`: categoria o periodo di appartenenza
- `description`: testo descrittivo
- `img`: URL di un'immagine rappresentativa

Un esempio minimo di record può essere:

```json
{
  "id": "evt001",
  "title": "Fondazione di Roma",
  "start": "-0753",
  "end": "-0753",
  "coords": [41.8931, 12.4828],
  "category": "Antica Roma",
  "description": "Tradizionale data della fondazione della città di Roma.",
  "img": "rome.jpg"
}
```

## Organizzazione dei dati
Per mantenere il progetto modulare è consigliato suddividere i dati per periodi o civiltà in file JSON separati all'interno della cartella `data/`. Esempi di possibili file:

- `data/mesopotamia.json`
- `data/egitto.json`
- `data/roma_antica.json`

Ogni file conterrà un array di record evento secondo la struttura descritta sopra.

## Lazy loading dei layer Leaflet
Per migliorare le prestazioni è opportuno caricare i layer soltanto quando necessario (lazy loading). Un approccio possibile è:

1. Caricare i file JSON dinamicamente con `fetch` solo al momento della selezione del periodo o della civiltà interessata.
2. Creare il layer Leaflet con i dati appena scaricati e aggiungerlo alla mappa.
3. Conservare i layer già caricati in cache per evitare nuove richieste se l'utente li seleziona nuovamente.

In questo modo si evitano caricamenti inutili e si mantiene l'applicazione reattiva anche con dataset estesi.
