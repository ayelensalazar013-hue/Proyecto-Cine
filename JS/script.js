// Diccionario que une el nombre exacto de cada película con su imagen en la carpeta "img/"
const fotosPeliculas = {
  "4 HISTORIAS INCREIBLES": "img/4historiasincreibles.jpg",
  "PERTENENCIAS": "img/pertenencias.jpg",
  "¿QUERES SER MI HIJO?": "img/queressermihijo.jpg",
  "DESOBEDIENTE": "img/desobediente.jpg",
  "LA CASA": "img/lacasa.jpg",
  "LO DEJAMOS ACA": "img/lodejamosaca.jpg",
  "PEPITA LA PISTOLERA": "img/pepitalapistolera.jpg",
  "RETRATO, ELOGIO AL DUELO": "img/retrato.jpg",
  "EL LLANTO DEL PERRO": "img/elllantodelperro.jpg",
  "ANNEMARIE": "img/annemarie.jpg",
  "HOSPITAL BRITANICO": "img/hospitalbritanico.jpg",
  "MUSEO DE LA SUBVERSION": "img/museodelasubversion.jpg",
  "LA YEGUA DE TROYA": "img/layeguadetroya.jpg",
  "ABUELO GAUCHO": "img/abuelogaucho.jpg",
  "OLIVIA": "img/olivia.jpg",
  "TRES ADIOSES": "img/tresadioses.jpg",
  "EL BAÑO DEL PAPA": "img/elbañodepapa.jpg",
  "MADRE SINIESTRA": "img/madresiniestra.jpg",
  "LOS OTROS": "img/losotros.jpg",
  "JEANNE DIELMAN,23,QUAI DU COMMERCE,1080 BRUXELLES": "img/jeannedielman.jpg",
  "LA CONVERSACION": "img/laconversacion.jpg",
};

// Consultas SQL adaptadas a SQLite.
// El signo "?" se reemplaza por el valor que eligió el usuario en el filtro.
const ConsultasEnScript = {
  todasLasPeliculas: function () {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
    `);
  },

  getPeliculasPorGenero: function (genero) {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE genero_pel = ?
      ORDER BY duracion_min DESC
    `, [genero]);
  },

  getPeliculasCortas: function () {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE duracion_min < 90
    `);
  },

  getPeliculasDuracionMedia: function () {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE duracion_min BETWEEN 90 AND 120
    `);
  },

  getPeliculasLargas: function () {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE duracion_min > 120
    `);
  },

  getPeliculasATP: function () {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE calificacion_pel = 'ATP'
    `);
  },

  getPeliculasPorClasificacion: function (calificacion) {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE calificacion_pel = ?
    `, [calificacion]);
  },

  getPeliculasPorEstado: function (estado) {
    return window.AppDB.query(`
      SELECT id_pelicula, nombre_pel, genero_pel, duracion_min, calificacion_pel, pais_origen, pel_estado
      FROM Pelicula
      WHERE pel_estado = ?
    `, [estado]);
  },
};

// Películas cargadas actualmente en pantalla
let movies = [];

// Convierte cada fila de SQLite en un objeto de película para la cartelera
function guardarFilasEnMovies(filas) {
  movies = filas.map((p, idx) => ({
    id: p.id_pelicula ?? idx + 1,
    title: p.nombre_pel,
    genre: p.genero_pel || "Sin género",
    runtime: p.duracion_min ? `${p.duracion_min} min` : "—",
    durationMinutes: p.duracion_min || 0,
    rating: p.calificacion_pel || "—",
    release: p.pel_estado || "En cartelera",
    image: fotosPeliculas[p.nombre_pel] || "",
    times: ["15:00", "18:00", "21:00"],
  }));
}

// Ejecuta la consulta SQL que corresponde según el filtro elegido
function aplicarFiltroSQL() {
  let filas = [];

  if (filterValue === "all" || filterCategory === "general") {
    filas = ConsultasEnScript.todasLasPeliculas();
  } else if (filterCategory === "genre") {
    filas = ConsultasEnScript.getPeliculasPorGenero(filterValue);
  } else if (filterCategory === "duration") {
    if (filterValue === "short") {
      filas = ConsultasEnScript.getPeliculasCortas();
    } else if (filterValue === "medium") {
      filas = ConsultasEnScript.getPeliculasDuracionMedia();
    } else {
      filas = ConsultasEnScript.getPeliculasLargas();
    }
  } else if (filterCategory === "rating") {
    if (filterValue === "ATP") {
      filas = ConsultasEnScript.getPeliculasATP();
    } else {
      filas = ConsultasEnScript.getPeliculasPorClasificacion(filterValue);
    }
  } else if (filterCategory === "release") {
    filas = ConsultasEnScript.getPeliculasPorEstado(filterValue);
  }

  guardarFilasEnMovies(filas);
  renderFilters();
  renderMovies();
}

// Inicia la base de datos y muestra la cartelera al abrir la página
async function cargarPeliculas() {
  await window.AppDB.initDB();
  filterCategory = "general";
  filterValue = "all";
  aplicarFiltroSQL();
}

// Categorías y botones de filtro
const filterCategories = [
  {
    id: "general",
    label: "Cartelera general",
    options: [{ label: "Todas las películas", value: "all" }],
  },
  {
    id: "genre",
    label: "Género",
    options: [
      "Todos",
      "Drama",
      "Comedia",
      "Suspenso",
      "Terror",
      "Documental",
    ].map((label) => ({ label, value: label === "Todos" ? "all" : label })),
  },
  {
    id: "duration",
    label: "Duración",
    options: [
      { label: "Todas", value: "all" },
      { label: "Menos de 90 min", value: "short" },
      { label: "90 a 120 min", value: "medium" },
      { label: "Más de 120 min", value: "long" },
    ],
  },
  {
    id: "rating",
    label: "Clasificación edad",
    options: ["Todas", "ATP", "+13", "+18"].map((label) => ({
      label,
      value: label === "Todas" ? "all" : label,
    })),
  },
  {
    id: "release",
    label: "Estreno y preestreno",
    options: ["Todos", "Estreno", "Preestreno", "En cartelera"].map(
      (label) => ({
        label,
        value: label === "Todos" ? "all" : label,
      }),
    ),
  },
];

// Guarda las butacas ocupadas por separado para cada combinación de película + horario.
// Arranca vacío para que todas las butacas estén libres desde el principio.
const butacasOcupadasPorFuncion = new Map();

// Devuelve el conjunto (Set) de butacas ocupadas para la película y horario elegidos
function obtenerButacasOcupadas(movie, time) {
  const clave = `${movie.id}|${time}`;
  if (!butacasOcupadasPorFuncion.has(clave)) {
    butacasOcupadasPorFuncion.set(clave, new Set());
  }
  return butacasOcupadasPorFuncion.get(clave);
}

const PRECIO_ENTRADA = 4000;

// Íconos SVG para flechas y ubicación
const arrow = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13M13 7l5 5-5 5"></path>
  </svg>`;

const pin = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"></path>
    <circle cx="12" cy="10" r="2"></circle>
  </svg>`;

// Variables de estado de la compra y de los filtros
let selectedMovie = null;
let selectedTime = null;
let selectedSeats = [];
let clientName = "";
let clientDni = "";
let lastTicket = null;
let filterCategory = "general";
let filterValue = "all";

// Elementos del HTML
const movieGrid = document.querySelector("#movie-grid");
const filterCategoryElement = document.querySelector("#filter-categories");
const filterOptionsElement = document.querySelector("#filter-options");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");
const locationSelect = document.querySelector("#location");
const menu = document.querySelector("#main-nav");
const menuToggle = document.querySelector("#menu-toggle");

// Dibuja las tarjetas de películas sin mostrar director
function renderMovies() {
  movieGrid.innerHTML = movies
    .map(
      (movie) => `
        <article class="movie-card">
          <button
            class="poster-button"
            type="button"
            data-id="${movie.id}"
            aria-label="Ver horarios de ${movie.title}"
          >
            <img
              src="${movie.image}"
              alt="Póster de ${movie.title}"
              style="object-position:${movie.imagePosition || "center"}"
              onerror="this.style.display='none';"
            />
            <span class="poster-release">${movie.release}</span>
            <span class="poster-rating">${movie.rating}</span>
            <span class="poster-reveal">Ver horarios ${arrow}</span>
          </button>
          <div class="movie-info">
            <p>${movie.genre}<i></i>${movie.runtime}</p>
            <h3>${movie.title}</h3>
          </div>
        </article>`,
    )
    .join("");

  document.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMovie = movies.find(
        (movie) => movie.id === Number(button.dataset.id),
      );
      selectedTime = null;
      selectedSeats = [];
      clientName = "";
      clientDni = "";
      lastTicket = null;
      openModal();
    });
  });
}

// Dibuja los botones de categorías y opciones de filtro
function renderFilters() {
  filterCategoryElement.innerHTML = filterCategories
    .map(
      (category) => `
        <button
          type="button"
          class="filter-category-button${filterCategory === category.id ? " active" : ""}"
          data-category="${category.id}"
        >${category.label}</button>`,
    )
    .join("");

  const active = filterCategories.find(
    (category) => category.id === filterCategory,
  );
  const count = movies.length;

  filterOptionsElement.innerHTML =
    active.options
      .map(
        (option) => `
          <button
            type="button"
            class="${filterValue === option.value ? "active" : ""}${option.value === "Drama" ? " drama-filter-option" : ""}"
            data-option="${option.value}"
          >${option.label}</button>`,
      )
      .join("") +
    `<span class="result-count">${count} ${count === 1 ? "película" : "películas"}</span>`;
}

filterCategoryElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  filterCategory = button.dataset.category;
  filterValue = "all";
  aplicarFiltroSQL();
});

filterOptionsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option]");
  if (!button) return;
  filterValue = button.dataset.option;
  aplicarFiltroSQL();
});

function openModal() {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  renderModal();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  selectedMovie = null;
  selectedTime = null;
  selectedSeats = [];
  clientName = "";
  clientDni = "";
  lastTicket = null;
}

// Formatea fecha y hora actual como "18/10/2026 14:15 HS"
function formatearFechaEmision() {
  const ahora = new Date();
  const dd = String(ahora.getDate()).padStart(2, "0");
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const yyyy = ahora.getFullYear();
  const hh = String(ahora.getHours()).padStart(2, "0");
  const min = String(ahora.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min} HS`;
}

// Formatea montos como "$ 10.800,00"
function formatearPesos(monto) {
  return `$ ${monto.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Escapa caracteres básicos para evitar romper el HTML del comprobante
function escaparHTML(texto) {
  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Genera el texto del comprobante con los datos del cliente y de la compra
function armarTextoComprobante(ticket) {
  const linea = "=====================================================";
  const separador = "-----------------------------------------------------";
  const entradasDetalle = ticket.butacas
    .map(
      (butaca, i) =>
        `N.º de entrada: ENT-${String(ticket.nroEntradaBase + i).padStart(7, "0")} | Butaca: ${butaca}\nTipo de entrada: GENERAL\nPrecio unitario: ${formatearPesos(ticket.precioUnitario)}`,
    )
    .join(`\n${separador}\n`);

  return [
    linea,
    "         ESPACIO INCAA - CINE GAUMONT",
    "            KM 0 - CINE NACIONAL",
    "   Rivadavia 1635, CABA | CUIT: 30-54666543-4",
    linea,
    `COMPROBANTE DE VENTA: ${ticket.nroComprobante}`,
    `FECHA/HORA DE EMISIÓN: ${ticket.fechaEmision}`,
    `CLIENTE: ${ticket.cliente} | DNI: ${ticket.dni}`,
    separador,
    "DETALLE DE LA FUNCIÓN",
    `Película: ${ticket.pelicula}`,
    `Calificación: ${ticket.calificacion}`,
    `Tipo de función: 2D - ${ticket.tipoFuncion}`,
    `Sala: ${ticket.sala}`,
    `Fecha y hora: ${ticket.fechaHoraFuncion}`,
    separador,
    "DETALLE DE LA ENTRADA",
    entradasDetalle,
    separador,
    `MONTO TOTAL: ${formatearPesos(ticket.total)}`,
    linea,
    "   [CÓDIGO QR, SI CORRESPONDE]",
    linea,
  ].join("\n");
}

// Valida nombre y DNI, marca las butacas solo de esta función como ocupadas y genera el ticket
function confirmarCompra() {
  if (!selectedSeats.length || !selectedMovie || !selectedTime) return;

  const nombreLimpio = clientName.trim();
  const dniLimpio = clientDni.trim();
  const errorEl = modalContent.querySelector("#client-error");

  if (!nombreLimpio || !dniLimpio) {
    if (errorEl) {
      errorEl.textContent = "Ingresá tu nombre y DNI antes de realizar la compra.";
      errorEl.hidden = false;
    }
    return;
  }

  // Marca las butacas como ocupadas únicamente en esta película y horario
  const ocupadasDeEstaFuncion = obtenerButacasOcupadas(selectedMovie, selectedTime);
  selectedSeats.forEach((seat) => ocupadasDeEstaFuncion.add(seat));

  const hoy = new Date();
  const dd = String(hoy.getDate()).padStart(2, "0");
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const yyyy = hoy.getFullYear();

  lastTicket = {
    nroComprobante: `0001-${String(Math.floor(10000000 + Math.random() * 90000000))}`,
    fechaEmision: formatearFechaEmision(),
    cliente: nombreLimpio,
    dni: dniLimpio,
    pelicula: selectedMovie.title,
    calificacion: selectedMovie.rating,
    tipoFuncion: String(selectedMovie.release || "EN CARTELERA").toUpperCase(),
    sala: "SALA 1",
    fechaHoraFuncion: `${dd}/${mm}/${yyyy} ${selectedTime} HS`,
    butacas: [...selectedSeats],
    nroEntradaBase: Math.floor(100000 + Math.random() * 900000),
    precioUnitario: PRECIO_ENTRADA,
    total: selectedSeats.length * PRECIO_ENTRADA,
  };

  selectedSeats = [];
  renderModal();
}

// Dibuja el modal: comprobante de compra, horarios o mapa de butacas + datos del cliente
function renderModal() {
  if (lastTicket) {
    modalContent.classList.remove("seat-step");
    modalContent.setAttribute(
      "aria-label",
      `Comprobante ${lastTicket.nroComprobante}`,
    );

    modalContent.innerHTML = `
      <button class="modal-close" type="button" aria-label="Cerrar">×</button>
      <p class="step-label">Compra confirmada · Butacas reservadas</p>
      <h2>Comprobante de venta</h2>
      <pre class="ticket-print" style="white-space:pre-wrap;font-family:monospace;font-size:0.85rem;overflow-x:auto;background:#f7f7f7;padding:1rem;border-radius:8px;">${escaparHTML(armarTextoComprobante(lastTicket))}</pre>
      <div style="display:flex;gap:0.75rem;margin-top:1rem;flex-wrap:wrap;">
        <button type="button" class="continue-button" id="close-ticket-btn">Listo</button>
      </div>`;

    modalContent
      .querySelector(".modal-close")
      .addEventListener("click", closeModal);
    modalContent
      .querySelector("#close-ticket-btn")
      .addEventListener("click", closeModal);
    return;
  }

  modalContent.classList.toggle("seat-step", Boolean(selectedTime));
  modalContent.setAttribute(
    "aria-label",
    `Horarios de ${selectedMovie.title}`,
  );

  // Paso 1: elegir horario
  if (!selectedTime) {
    modalContent.innerHTML = `
      <button class="modal-close" type="button" aria-label="Cerrar">×</button>
      <p class="step-label">01 / Elegí una función</p>
      <div class="modal-title-row">
        <div>
          <p class="overline dark">Hoy · ${locationSelect.value}</p>
          <h2>${selectedMovie.title}</h2>
        </div>
        <span class="modal-rating">${selectedMovie.rating}</span>
      </div>
      <p class="modal-meta">
        ${selectedMovie.genre} · ${selectedMovie.runtime}
      </p>
      <div class="cinema-location">
        ${pin}
        <span>
          <strong>Círculo Cine Centro</strong>
          Av. Rivadavia 1635 · Sala 1
        </span>
      </div>
      <p class="time-heading">Horarios disponibles</p>
      <div class="time-list">
        ${selectedMovie.times
          .map(
            (time) => `
              <button type="button" data-time="${time}">
                <strong>${time}</strong>
                <span>2D · Castellano</span>
              </button>`,
          )
          .join("")}
      </div>
      <small>
        Horarios de referencia. Confirmá disponibilidad con el cine.
      </small>`;

    modalContent
      .querySelector(".modal-close")
      .addEventListener("click", closeModal);
    modalContent.querySelectorAll("[data-time]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedTime = button.dataset.time;
        renderModal();
      });
    });
    return;
  }

  // Paso 2: elegir butacas en la sala para la película y horario actuales
  const unavailableSeats = obtenerButacasOcupadas(selectedMovie, selectedTime);
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seats = rows
    .map(
      (row) => `
        <div class="seat-row">
          <span>${row}</span>
          ${Array.from({ length: 8 }, (_, index) => {
            const seat = `${row}${index + 1}`;
            const unavailable = unavailableSeats.has(seat);
            const selected = selectedSeats.includes(seat);
            return `
              <button
                type="button"
                class="seat${unavailable ? " unavailable" : ""}${selected ? " selected" : ""}"
                data-seat="${seat}"
                ${unavailable ? "disabled" : ""}
                aria-label="Butaca ${seat}${unavailable ? ", ocupada" : ""}"
                aria-pressed="${selected}"
              ><i></i></button>`;
          }).join("")}
          <span>${row}</span>
        </div>`,
    )
    .join("");

  modalContent.innerHTML = `
    <button class="modal-close" type="button" aria-label="Cerrar">×</button>
    <button class="back-button" type="button">← Volver a horarios</button>
    <div class="seat-layout">
      <div class="seat-picker">
        <p class="step-label">02 / Elegí tus butacas</p>
        <h2>Seleccioná tu lugar</h2>
        <p class="seat-session">
          ${selectedMovie.title} · Hoy ${selectedTime} · Sala 1
        </p>
        <div class="screen"><span>Pantalla</span></div>
        <div class="seat-map" aria-label="Mapa de butacas">${seats}</div>
        <div class="seat-legend">
          <span><i class="legend-available"></i>Disponible</span>
          <span><i class="legend-selected"></i>Tu selección</span>
          <span><i class="legend-unavailable"></i>Ocupada</span>
        </div>
      </div>
      <aside class="booking-summary">
        <p>Tu selección</p>
        <h3>${selectedMovie.title}</h3>
        <dl>
          <div><dt>Función</dt><dd>Hoy · ${selectedTime}</dd></div>
          <div><dt>Sala</dt><dd>Círculo Centro · Sala 1</dd></div>
          <div>
            <dt>Butacas</dt>
            <dd>${selectedSeats.length ? selectedSeats.join(", ") : "Sin seleccionar"}</dd>
          </div>
        </dl>
        <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;">
          <label for="cliente-nombre" style="font-size:0.85rem;">Nombre y apellido</label>
          <input
            id="cliente-nombre"
            type="text"
            
            value="${escaparHTML(clientName)}"
            style="padding:0.5rem;border:1px solid #ccc;border-radius:6px;"
          />
          <label for="cliente-dni" style="font-size:0.85rem;">DNI</label>
          <input
            id="cliente-dni"
            type="text"
            
            value="${escaparHTML(clientDni)}"
            style="padding:0.5rem;border:1px solid #ccc;border-radius:6px;"
          />
          <small id="client-error" hidden style="color:#b91c1c;font-size:0.8rem;"></small>
        </div>
        <div class="booking-total">
          <span>Total</span>
          <strong>$${(selectedSeats.length * PRECIO_ENTRADA).toLocaleString("es-AR")}</strong>
        </div>
        <button
          type="button"
          class="continue-button"
          ${selectedSeats.length ? "" : "disabled"}
        >Comprar entradas ${arrow}</button>
      </aside>
    </div>`;

  modalContent
    .querySelector(".modal-close")
    .addEventListener("click", closeModal);
  modalContent.querySelector(".back-button").addEventListener("click", () => {
    selectedTime = null;
    selectedSeats = [];
    renderModal();
  });

  const nameInput = modalContent.querySelector("#cliente-nombre");
  const dniInput = modalContent.querySelector("#cliente-dni");
  const errorEl = modalContent.querySelector("#client-error");

  nameInput.addEventListener("input", (event) => {
    clientName = event.target.value;
    if (errorEl) errorEl.hidden = true;
  });

  dniInput.addEventListener("input", (event) => {
    clientDni = event.target.value;
    if (errorEl) errorEl.hidden = true;
  });

  modalContent.querySelectorAll("[data-seat]:not(:disabled)").forEach((seat) => {
    seat.addEventListener("click", () => {
      const value = seat.dataset.seat;
      selectedSeats = selectedSeats.includes(value)
        ? selectedSeats.filter((item) => item !== value)
        : [...selectedSeats, value];
      renderModal();
    });
  });

  const continueButton = modalContent.querySelector(".continue-button");
  continueButton.addEventListener("click", confirmarCompra);
}

modal.addEventListener("mousedown", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#choose-cinema").addEventListener("click", () => {
  document.querySelector("#cartelera").scrollIntoView({ behavior: "smooth" });
});

cargarPeliculas();