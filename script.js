/*
REGOLE
- Le risposte vanno scritte in JavaScript sotto questi commenti.
- Pattern fondamentale: stato -> render() -> eventi.
  Tutto cio' che vedi a schermo dipende dallo stato.
  Gli eventi modificano lo stato e poi chiamano render().
- Apri index.html nel browser. Apri la console (DevTools) per gli errori.
- Niente AI per generare codice. Niente template scaricati.
*/

/* STATO
   In cima al file definisci poche variabili globali:
   - un array di oggetti come dato principale (es. libri, ricette, film, ...)
   - una variabile per il filtro corrente
   - una variabile per l'ordinamento corrente
   - una variabile per la stringa di ricerca corrente
*/
let stato = [
  { id: 1, azienda: "Tech Solutions", ruolo: "Frontend Developer", categoria: "Sviluppo", completato: true },
  { id: 2, azienda: "Creative Studio", ruolo: "UI Designer", categoria: "Design", completato: false },
  { id: 3, azienda: "Web Agency Italia", ruolo: "Junior JavaScript Dev", categoria: "Sviluppo", completato: false }
];

let filtro = "tutti";
let ricerca = "";
let ordinamento = "id-asc";
let vista = "lista";

const form = document.getElementById("form-candidatura");
const containerDati = document.getElementById("container-dati");
const divStatistiche = document.getElementById("statistiche");
const divNotifica = document.getElementById("notifica");


/* RENDER()
   Una sola funzione che ridipinge la lista. A ogni chiamata:
   1) parte dall'array completo,
   2) filtra,
   3) ordina,
   4) svuota il container DOM,
   5) ricrea gli elementi DOM per gli oggetti risultanti.
   Aggiorna anche conteggi e statistiche.
   Salva lo stato in localStorage in fondo a render() (cerca tu come funziona).
*/
function render() {
  const datiFiltrati = stato.filter(item => {
    const matchFiltro = filtro === "tutti" || (filtro === "attivi" && !item.completato) || (filtro === "completati" && item.completato);
    const matchRicerca = item.azienda.toLowerCase().includes(ricerca.toLowerCase()) || item.ruolo.toLowerCase().includes(ricerca.toLowerCase());
    return matchFiltro && matchRicerca;
  }).sort((a, b) => ordinamento === "id-asc" ? a.id - b.id : b.id - a.id);

  containerDati.innerHTML = "";

  const totale = stato.length;
  const completatiCount = stato.filter(i => i.completato).length;
  const percentuale = totale > 0 ? Math.round((completatiCount / totale) * 100) : 0;

  divStatistiche.innerHTML = `
    <div class="stat-testo">Candidature completate: ${completatiCount} di ${totale} (${percentuale}%)</div>
    <div class="barra-esterna"><div class="barra-interna" style="width: ${percentuale}%"></div></div>
  `;

  if (datiFiltrati.length === 0) {
    containerDati.innerHTML = '<p style="color: #64748b; padding: 20px; text-align: center;">Nessuna candidatura trovata.</p>';
  } else if (vista === "lista") {
    const raggruppate = datiFiltrati.reduce((acc, item) => {
      acc[item.categoria] = acc[item.categoria] || [];
      acc[item.categoria].push(item);
      return acc;
    }, {});

    for (const cat in raggruppate) {
      const h3 = document.createElement("h3");
      h3.className = "categoria-header";
      h3.textContent = cat;
      containerDati.appendChild(h3);

      raggruppate[cat].forEach(item => {
        const div = document.createElement("div");
        div.className = "lista-item";
        div.dataset.id = item.id;
        div.innerHTML = `
          <div class="item-info">
            <input type="checkbox" ${item.completato ? "checked" : ""} class="check-completato">
            <div class="item-testo">
              <span style="${item.completato ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${item.azienda} - ${item.ruolo}</span>
              <small>Categoria: ${item.categoria}</small>
            </div>
          </div>
          <div class="azioni-group">
            <button class="btn-azione btn-su">↑</button>
            <button class="btn-azione btn-giu">↓</button>
            <button class="btn-azione btn-modifica">Modifica</button>
            <button class="btn-azione btn-elimina">Elimina</button>
          </div>
        `;
        containerDati.appendChild(div);
      });
    }
  } else if (vista === "card") {
    const grid = document.createElement("div");
    grid.className = "grid-card";
    datiFiltrati.forEach(item => {
      const card = document.createElement("div");
      card.className = "card-item";
      card.dataset.id = item.id;
      card.innerHTML = `
        <div>
          <span class="tag-categoria">${item.categoria}</span>
          <h4 style="margin: 8px 0 4px 0; ${item.completato ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${item.azienda}</h4>
          <p style="font-size: 0.9rem; color: #64748b;">${item.ruolo}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <input type="checkbox" ${item.completato ? "checked" : ""} class="check-completato"> Completato
          </label>
          <div class="azioni-group"><button class="btn-azione btn-elimina">Elimina</button></div>
        </div>
      `;
      grid.appendChild(card);
    });
    containerDati.appendChild(grid);
  } else if (vista === "tabella") {
    const wrapper = document.createElement("div");
    wrapper.className = "tabella-container";
    const righeHTML = datiFiltrati.map(item => `
      <tr data-id="${item.id}">
        <td><input type="checkbox" ${item.completato ? "checked" : ""} class="check-completato"></td>
        <td style="${item.completato ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${item.azienda}</td>
        <td style="${item.completato ? 'text-decoration: line-through; color: #94a3b8;' : ''}">${item.ruolo}</td>
        <td>${item.categoria}</td>
        <td><div class="azioni-group"><button class="btn-azione btn-elimina">Elimina</button></div></td>
      </tr>
    `).join("");

    wrapper.innerHTML = `
      <table class="tabella-dati">
        <thead><tr><th>Stato</th><th>Azienda</th><th>Ruolo</th><th>Categoria</th><th>Azioni</th></tr></thead>
        <tbody>${righeHTML}</tbody>
      </table>
    `;
    containerDati.appendChild(wrapper);
  }

  localStorage.setItem("candidature_dati", JSON.stringify(stato));
}


/* FORM CON VALIDAZIONE
   addEventListener("submit") sul form.
   event.preventDefault().
   Leggi i valori con .value.trim().
   Se uno dei campi obbligatori e' vuoto, mostra errore e return.
   Altrimenti push allo stato, form.reset(), render().
   Id univoco con Date.now().
*/
form.addEventListener("submit", event => {
  event.preventDefault();
  const divErrore = document.getElementById("errore");
  divErrore.textContent = "";

  const azienda = document.getElementById("input-azienda").value.trim();
  const ruolo = document.getElementById("input-ruolo").value.trim();
  const categoria = document.getElementById("input-categoria").value;

  if (!azienda || !ruolo) {
    divErrore.textContent = "Compila tutti i campi obbligatori.";
    return;
  }

  stato.push({ id: Date.now(), azienda, ruolo, categoria, completato: false });
  form.reset();
  render();
  notifica("Candidatura aggiunta con successo!");
});


/* INTERAZIONI BASE — eliminare, modificare, contare
   - Elimina: filter per id, render(). Event delegation sul container.
   - Modifica in-place: button "Modifica". Al click il testo diventa <input>,
     si conferma con Invio o blur.
   - Conteggi dinamici dentro render().
*/
containerDati.addEventListener("click", event => {
  const elemento = event.target.closest("[data-id]");
  if (!elemento) return;
  const id = Number(elemento.dataset.id);
  const target = event.target;

  if (target.classList.contains("btn-elimina")) {
    stato = stato.filter(item => item.id !== id);
    render();
    notifica("Candidatura eliminata.");
  } else if (target.classList.contains("btn-su") || target.classList.contains("btn-giu")) {
    const index = stato.findIndex(item => item.id === id);
    const targetIndex = target.classList.contains("btn-su") ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < stato.length) {
      [stato[index], stato[targetIndex]] = [stato[targetIndex], stato[index]];
      render();
    }
  } else if (target.classList.contains("btn-modifica")) {
    const item = stato.find(i => i.id === id);
    const spanTesto = elemento.querySelector(".item-testo span");
    if (!item || !spanTesto) return;

    const inputMod = document.createElement("input");
    inputMod.type = "text";
    inputMod.value = `${item.azienda} - ${item.ruolo}`;
    inputMod.style.width = "100%";
    spanTesto.replaceWith(inputMod);
    inputMod.focus();

    const confermaModifica = () => {
      const val = inputMod.value.trim();
      if (val) {
        const parti = val.split("-");
        item.azienda = parti[0].trim();
        item.ruolo = parti[1] ? parti[1].trim() : "";
      }
      render();
    };

    inputMod.addEventListener("keydown", e => e.key === "Enter" && confermaModifica());
    inputMod.addEventListener("blur", confermaModifica);
  }
});

containerDati.addEventListener("change", event => {
  if (event.target.classList.contains("check-completato")) {
    const id = Number(event.target.closest("[data-id]").dataset.id);
    const item = stato.find(i => i.id === id);
    if (item) {
      item.completato = event.target.checked;
      render();
    }
  }
});


/* RICERCA, FILTRO, ORDINAMENTO
   - Ricerca live: <input> con event "input". Salva in stato e render().
   - Filtro: <select> con event "change". Salva in stato e render().
   - Ordinamento: due button (o select). Salva in stato e render().
   I tre si compongono dentro render() in fila.
*/
document.getElementById("input-ricerca").addEventListener("input", e => { ricerca = e.target.value; render(); });
document.getElementById("select-filtro").addEventListener("change", e => { filtro = e.target.value; render(); });

document.getElementById("btn-ordina").addEventListener("click", (e) => {
  ordinamento = ordinamento === "id-asc" ? "id-desc" : "id-asc";
  e.target.textContent = ordinamento === "id-desc" ? "Ordina: Recenti" : "Ordina per ID";
  render();
});


/* NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/
function notifica(testo) {
  divNotifica.textContent = testo;
  divNotifica.style.display = "block";
  setTimeout(() => divNotifica.style.display = "none", 3000);
}


/* TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/
document.getElementById("btn-tema").addEventListener("click", e => {
  document.body.classList.toggle("dark");
  e.target.textContent = document.body.classList.contains("dark") ? "Tema Chiaro" : "Tema Scuro";
});


/* PERSISTENZA — localStorage (cerca tu su MDN)
   - In fondo a render(), salva lo stato:
       localStorage.setItem("dati", JSON.stringify(stato));
   - All'avvio, prima della prima render(), carica:
       const salvato = localStorage.getItem("dati");
       if (salvato) stato = JSON.parse(salvato);
*/
const salvato = localStorage.getItem("candidature_dati");
if (salvato) stato = JSON.parse(salvato);


/* RIORDINO ↑ ↓
   Due button su ogni elemento. Click su ↑ scambia con il precedente nell'array,
   ↓ con il successivo. Event delegation. Poi render().
*/


/* STATISTICHE GRAFICHE
   Almeno due indicatori: contatori grandi e/o barre orizzontali
   (<div> con width: X% in base al dato). Aggiorna dentro render().
*/


/* MULTI-VISTA — lista / card / tabella
   Una variabile globale "vista" che render() legge per decidere quale HTML
   produrre. Tre button cambiano "vista" e chiamano render().
*/
document.querySelectorAll(".btn-vista").forEach(btn => {
  btn.addEventListener("click", event => {
    document.querySelectorAll(".btn-vista").forEach(b => b.classList.remove("attivo"));
    event.target.classList.add("attivo");
    vista = event.target.dataset.vista;
    render();
  });
});


/* CATEGORIE
   Aggiungi un campo categoria nello schema. Nel form un <select> per sceglierla.
   In render(), raggruppa con reduce in { categoria: [elementi] } e disegna un
   header per categoria con sotto la lista di quella categoria.
*/


// Avvio iniziale
render();
