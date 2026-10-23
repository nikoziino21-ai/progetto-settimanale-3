# progetto-settimanale-3
#Job Application Tracker

Un'applicazione web progettata per organizzare e monitorare lo stato delle proprie candidature lavorative. Il progetto è basata rigorosamente sul pattern Stato → Render → Eventi.

Durante la ricerca di lavoro, aiuta a tenere traccia delle candidature inviate, delle risposte in attesa, dei colloqui fissati e delle offerte ricevute. 
funzionalita:
- Inserire e validare nuove candidature con azienda e ruolo
- Aggiornare lo stato della candidatura (in corso o completata/conclusa)
- Filtrare, ordinare ed effettuare ricerche sull'intero elenco
- Monitorare il proprio progresso tramite indicatori di sintesi e statistiche grafiche
- Persistere i dati localmente nel browser senza perdere le informazioni al ricaricamento

- Array principale contenente gli oggetti candidatura { id, azienda, ruolo, categoria, completato }.
- Filtro variabile per lo stato attivo (tutti,attivi,completati).
- Stringa per il filtro di ricerca testuale
- Criterio di ordinamento dinamico
- Layout visivo selezionato (lista,card,tabella)

Render (`render()`):
Un'unica funzione centrale responsabile di ridisegnare completamente la pagina a ogni modifica. Ad ogni chiamata esegue sequentialmente 5 passaggi:
   - Parte dall'array completo (`applications`).
   - Applica la ricerca live (case-insensitive con `.includes()`).
   - Applica i filtri per stato e/o raggruppamento per categoria con `.reduce()`.
   - Svuota il contenitore DOM (`innerHTML = ""`).
   - Ricrea gli elementi DOM (in base alla vista selezionata), aggiorna le statistiche/contatori e salva lo stato corrente su `localStorage`.

Eventi:
Tutti gli eventi (form submission, input live, click su filtri e pulsanti di azione) modificano unicamente lo stato in memoria e richiamano subito dopo `render()`. La manipolazione diretta del DOM è delegata esclusivamente alla funzione `render()`.

Funzionalità e Requisiti Implementati

Form con Validazione: Inserimento sicuro dei dati con controlli tramite`.value.trim()`, gestione degli errori con visualizzazione del messaggio nell'elemento dedicato e generazione di ID univoci mediante`Date.now()`.
- nterazioni e Delegation:Eliminazione e modifica in-place delle candidature gestite tramite Event Delegation (con `.closest()` e attributi `data-id`).
- Ricerca Live, Filtri e Ordinamento:Ricerca istantanea tramite evento `input`, filtri per stato con `select` / bottoni e ordinamento dinamico.
- Riordino Manuale (↑ ↓):Possibilità di riordinare manualmente la priorità degli elementi scambiando le posizioni degli oggetti all'interno dell'array di stato.
- Statistiche Grafiche e Contatori:Calcoli dinamici aggiornati ad ogni `render()` con contatori totali, attivi e barre percentuali visive del progresso.
- Multi-Vista (Lista / Card / Tabella):Possibilità di commutare al volo la resa grafica della lista tra riga compatta, griglia responsive o struttura a tabella HTML.
- Raggruppamento per Categorie:Organizzazione visuale delle candidature per area professionale o settore mediante aggregazione con `Array.prototype.reduce()`.
- Notifiche Temporanee:Sistema di alert custom gestito tramite una funzione `notifica(testo)` con scomparsa automatica dopo 3000ms (`setTimeout`).
- Tema Chiaro / Scuro:Toggle dinamico della classe `.dark` sul body con regole CSS dedicate.
- Persistenza Dati: Salvataggio e ripristino automatico dello stato dell'applicazione sfruttando l'API `localStorage` (`JSON.stringify` / `JSON.parse`).
