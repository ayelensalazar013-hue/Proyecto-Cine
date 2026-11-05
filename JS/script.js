const movies = [
  {
    title: "4 HISTORIAS INCREIBLES",
    director: "ENRIQUE ROTTENBERG ",
    genre: "Comedia",
    runtime: "82 min",
    durationMinutes: 82,
    rating: "+13",
    release: "En cartelera",
    image:
      "https://images.unsplash.com/photo-1718147155878-e2baab858e74?auto=format&fit=crop&w=900&q=85",
    times: ["15:20", "18:10", "21:00"],
  },
  {
    title: "PERTENENCIAS",
    director: "GABRIELA GONZÁLEZ",
    genre: "Documental",
    runtime: "82 min",
    durationMinutes: 82,
    rating: "ATP",
    release: "En cartelera",
    image:
      "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?auto=format&fit=crop&w=900&q=85",
    times: ["16:00", "19:15", "22:10"],
  },
  {
    title: "¿QUERES SER MI HIJO?",
    director: "HERNAN GUERSCHUNY",
    genre: "Comedia",
    runtime: "98 min",
    durationMinutes: 98,
    rating: "+16",
    release: "En cartelera",
    image:
      "https://images.unsplash.com/photo-1568038479111-87bf80659645?auto=format&fit=crop&w=900&q=85",
    imagePosition: "center 22%",
    times: ["17:40", "20:30", "23:00"],
  },
  {
    title: "Las corrientes",
    director: "Milagros Mumenthaler",
    genre: "Drama",
    runtime: "104 min",
    durationMinutes: 104,
    rating: "+13",
    release: "Preestreno",
    image:
      "https://images.unsplash.com/photo-1674932668403-33398b81c92f?auto=format&fit=crop&w=900&q=85",
    imagePosition: "center 25%",
    times: ["15:00", "18:30", "21:40"],
  },
  {
    title: "Homo Argentum",
    director: "Mariano Cohn y Gastón Duprat",
    genre: "Comedia",
    runtime: "110 min",
    durationMinutes: 110,
    rating: "+13",
    release: "Estreno",
    image:
      "https://images.unsplash.com/photo-1733039238224-5254ec75ae35?auto=format&fit=crop&w=900&q=85",
    times: ["14:40", "17:30", "20:20"],
  },
  {
    title: "Belén",
    director: "Dolores Fonzi",
    genre: "Drama",
    runtime: "105 min",
    durationMinutes: 105,
    rating: "+16",
    release: "Preestreno",
    image:
      "https://images.unsplash.com/photo-1643587325054-d974d40d2d0f?auto=format&fit=crop&w=900&q=85",
    times: ["16:10", "19:00", "21:50"],
  },
  {
    title: "Mazel Tov",
    director: "Adrián Suar",
    genre: "Comedia",
    runtime: "97 min",
    durationMinutes: 97,
    rating: "+13",
    release: "En cartelera",
    image:
      "https://images.unsplash.com/photo-1772304830541-7b1cded9cea2?auto=format&fit=crop&w=900&q=85",
    times: ["15:10", "18:00", "20:50"],
  },
  {
    title: "La virgen de la tosquera",
    director: "Laura Casabé",
    genre: "Terror",
    runtime: "95 min",
    durationMinutes: 95,
    rating: "+16",
    release: "Estreno",
    image:
      "https://images.unsplash.com/photo-1646342170606-adc0892084d1?auto=format&fit=crop&w=900&q=85",
    times: ["18:20", "21:10", "23:20"],
  },
  {
    title: "Mensaje en una botella",
    director: "Gabriel Nesci",
    genre: "Romance",
    runtime: "115 min",
    durationMinutes: 115,
    rating: "+13",
    release: "En cartelera",
    image:
      "https://images.unsplash.com/photo-1780649870901-ced73f75a2ae?auto=format&fit=crop&w=900&q=85",
    times: ["14:20", "17:20", "20:40"],
  },
  {
    title: "El último viaje",
    director: "Lucía Paz",
    genre: "Aventura",
    runtime: "128 min",
    durationMinutes: 128,
    rating: "ATP",
    release: "Preestreno",
    image:
      "https://images.unsplash.com/photo-1632770592064-5a98f5b1e66c?auto=format&fit=crop&w=900&q=85",
    times: ["16:30", "19:40", "22:30"],
  },
  {
    title: "Tierra adentro",
    director: "Mateo Salvatierra",
    genre: "Documental",
    runtime: "84 min",
    durationMinutes: 84,
    rating: "ATP",
    release: "En cartelera",
    image:
      "https://images.unsplash.com/photo-1609432905903-63a94ba7e4d0?auto=format&fit=crop&w=900&q=85",
    times: ["14:00", "16:20", "18:40"],
  },
  {
    title: "Zona de riesgo",
    director: "Martín Rojas",
    genre: "Acción",
    runtime: "122 min",
    durationMinutes: 122,
    rating: "+18",
    release: "Estreno",
    image:
      "https://images.unsplash.com/photo-1668624156054-528565e7efc8?auto=format&fit=crop&w=900&q=85",
    times: ["17:00", "20:00", "23:00"],
  },
]

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
      "Romance",
      "Aventura",
      "Documental",
      "Acción",
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
    options: ["Todas", "ATP", "+13", "+16", "+18"].map((label) => ({
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
]

const unavailableSeats = new Set([
  "A3",
  "A4",
  "B6",
  "C2",
  "C3",
  "C7",
  "D5",
  "E1",
  "E6",
  "F4",
  "F5",
])

const arrow = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13M13 7l5 5-5 5"></path>
  </svg>`

const pin = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"></path>
    <circle cx="12" cy="10" r="2"></circle>
  </svg>`

let selectedMovie = null
let selectedTime = null
let selectedSeats = []
let filterCategory = "general"
let filterValue = "all"

const movieGrid = document.querySelector("#movie-grid")
const filterCategoryElement = document.querySelector("#filter-categories")
const filterOptionsElement = document.querySelector("#filter-options")
const modal = document.querySelector("#modal")
const modalContent = document.querySelector("#modal-content")
const locationSelect = document.querySelector("#location")
const menu = document.querySelector("#main-nav")
const menuToggle = document.querySelector("#menu-toggle")

function getFilteredMovies() {
  if (filterValue === "all" || filterCategory === "general") return movies
  return movies.filter((movie) => {
    if (filterCategory === "genre") return movie.genre === filterValue
    if (filterCategory === "rating") return movie.rating === filterValue
    if (filterCategory === "release") return movie.release === filterValue
    if (filterCategory === "duration") {
      if (filterValue === "short") return movie.durationMinutes < 90
      if (filterValue === "medium") {
        return movie.durationMinutes >= 90 && movie.durationMinutes <= 120
      }
      return movie.durationMinutes > 120
    }
    return true
  })
}

function renderMovies() {
  const visible = getFilteredMovies()

  movieGrid.innerHTML = visible
    .map(
      (movie) => `
        <article class="movie-card">
          <button
            class="poster-button"
            type="button"
            data-movie="${movie.title}"
            aria-label="Ver horarios de ${movie.title}"
          >
            <img
              src="${movie.image}"
              alt=""
              style="object-position:${movie.imagePosition || "center"}"
            />
            <span class="poster-release">${movie.release}</span>
            <span class="poster-rating">${movie.rating}</span>
            <span class="poster-reveal">Ver horarios ${arrow}</span>
          </button>
          <div class="movie-info">
            <p>${movie.genre}<i></i>${movie.runtime}</p>
            <h3>${movie.title}</h3>
            <span>Dir. ${movie.director}</span>
          </div>
        </article>`,
    )
    .join("")

  document.querySelectorAll("[data-movie]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMovie = movies.find(
        (movie) => movie.title === button.dataset.movie,
      )
      selectedTime = null
      selectedSeats = []
      openModal()
    })
  })
}

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
    .join("")

  const active = filterCategories.find(
    (category) => category.id === filterCategory,
  )
  const count = getFilteredMovies().length
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
    `<span class="result-count">${count} ${count === 1 ? "película" : "películas"}</span>`
}

filterCategoryElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]")
  if (!button) return
  filterCategory = button.dataset.category
  filterValue = "all"
  renderFilters()
  renderMovies()
})

filterOptionsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option]")
  if (!button) return
  filterValue = button.dataset.option
  renderFilters()
  renderMovies()
})

function openModal() {
  modal.hidden = false
  document.body.style.overflow = "hidden"
  renderModal()
}

function closeModal() {
  modal.hidden = true
  document.body.style.overflow = ""
  selectedMovie = null
  selectedTime = null
  selectedSeats = []
}

function renderModal() {
  modalContent.classList.toggle("seat-step", Boolean(selectedTime))
  modalContent.setAttribute(
    "aria-label",
    `Horarios de ${selectedMovie.title}`,
  )

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
        ${selectedMovie.genre} · ${selectedMovie.runtime} ·
        Dir. ${selectedMovie.director}
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
      </small>`

    modalContent
      .querySelector(".modal-close")
      .addEventListener("click", closeModal)
    modalContent.querySelectorAll("[data-time]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedTime = button.dataset.time
        renderModal()
      })
    })
    return
  }

  const rows = ["A", "B", "C", "D", "E", "F"]
  const seats = rows
    .map(
      (row) => `
        <div class="seat-row">
          <span>${row}</span>
          ${Array.from({ length: 8 }, (_, index) => {
            const seat = `${row}${index + 1}`
            const unavailable = unavailableSeats.has(seat)
            const selected = selectedSeats.includes(seat)
            return `
              <button
                type="button"
                class="seat${unavailable ? " unavailable" : ""}${selected ? " selected" : ""}"
                data-seat="${seat}"
                ${unavailable ? "disabled" : ""}
                aria-label="Butaca ${seat}${unavailable ? ", ocupada" : ""}"
                aria-pressed="${selected}"
              ><i></i></button>`
          }).join("")}
          <span>${row}</span>
        </div>`,
    )
    .join("")

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
        <div class="booking-total">
          <span>Total</span>
          <strong>$${(selectedSeats.length * 4000).toLocaleString("es-AR")}</strong>
        </div>
        <button
          type="button"
          class="continue-button"
          ${selectedSeats.length ? "" : "disabled"}
        >Continuar ${arrow}</button>
      </aside>
    </div>`

  modalContent
    .querySelector(".modal-close")
    .addEventListener("click", closeModal)
  modalContent.querySelector(".back-button").addEventListener("click", () => {
    selectedTime = null
    selectedSeats = []
    renderModal()
  })
  modalContent.querySelectorAll("[data-seat]:not(:disabled)").forEach((seat) => {
    seat.addEventListener("click", () => {
      const value = seat.dataset.seat
      selectedSeats = selectedSeats.includes(value)
        ? selectedSeats.filter((item) => item !== value)
        : [...selectedSeats, value]
      renderModal()
    })
  })
  const continueButton = modalContent.querySelector(".continue-button")
  continueButton.addEventListener("click", () => {
    if (selectedSeats.length) {
      alert(`Reserva iniciada para ${selectedSeats.join(", ")}`)
    }
  })
}

modal.addEventListener("mousedown", (event) => {
  if (event.target === modal) closeModal()
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal()
})

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open")
  menuToggle.setAttribute("aria-expanded", String(isOpen))
})

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open")
    menuToggle.setAttribute("aria-expanded", "false")
  })
})

document.querySelector("#choose-cinema").addEventListener("click", () => {
  document.querySelector("#cartelera").scrollIntoView({ behavior: "smooth" })
})

renderFilters()
renderMovies()
