/* =========================================================
   ALMA — script.js (v6)
   1. Configuración y datos   4. Modal de producto
   2. Utilidades              5. Carrito
   3. Catálogo                6. Cuenta regresiva, menú e init
   ========================================================= */
"use strict";

/* ---------- 1. Configuración y datos ---------- */
const CONFIG = {
    currency: "MXN",
    // null = el cliente DEBE elegir el tipo de camiseta; "oversize" o "basica" = viene preseleccionado
    defaultType: null,
    // Número de WhatsApp en formato internacional, sin "+", espacios ni guiones. Ej. México: 521 + 10 dígitos
    whatsapp: "5219983534113",
    halloween: "2026-10-31T00:00:00-06:00",
    pageSize: 24,
    maxQty: 9,
    storageKey: "almaCart:v2", // v2: el carrito ahora guarda el tipo de camiseta (los carritos v1 se ignoran)
};

const SIZES = ["S", "M", "L", "XL"];

/* Tipos de camiseta. Para cambiar un precio o un gramaje, edita SOLO esta tabla: catálogo, modal, carrito y pedido de WhatsApp se actualizan solos. */
const TYPES = {
    basica: { id: "basica", label: "Básica", gsm: 180, price: 250, note: "" },
    oversize: { id: "oversize", label: "Oversize", gsm: 220, price: 350, note: "Fit holgado" },
};
const TYPE_IDS = Object.keys(TYPES);
const PRICE_FROM = Math.min(...TYPE_IDS.map((t) => TYPES[t].price));

const CATEGORIES = [
    { name: "Halloween", label: "Halloween", count: 30, prefix: "HORROR", cls: "c-hal" },
    { name: "Anime", label: "Anime", count: 0, prefix: "ANIME", cls: "c-ani" },
    { name: "Superhéroes / Villanos", label: "Superhéroes", count: 60, prefix: "HERO", cls: "c-her" },
    { name: "Rock", label: "Rock", count: 40, prefix: "ROCK", cls: "c-rock" },
    { name: "Variedades", label: "Variedades", count: 15, prefix: "VAR", cls: "c-var" },
];

const DESCRIPTIONS = {
    "Halloween": "Edición especial Halloween / Horror Drop. Camiseta de estética gráfica.",
    "Anime": "Diseño inspirado en anime y manga.",
    "Superhéroes / Villanos": "Diseño inspirado en héroes, antihéroes y villanos.",
    "Rock": "Diseño inspirado en música y cultura rock.",
    "Variedades": "Diseño gráfico de colección variada.",
};

/* Fotos y nombres reales por código. Ejemplo:
   "HORROR-05": { name: "Nombre del diseño", image: "horror-05.jpg", description: "Opcional" } */
const OVERRIDES = {
    // HORROR
    "HORROR-01": { name: "Chucky 2", image: "img/horror-01.jpg" },
    "HORROR-02": { name: "Chucky", image: "img/horror-02.jpg" },
    "HORROR-03": { name: "El Exorcista", image: "img/horror-03.jpg" },
    "HORROR-04": { name: "El Títere", image: "img/horror-04.jpg" },
    "HORROR-05": { name: "Freddy Krueger 2", image: "img/horror-05.jpg" },
    "HORROR-06": { name: "Freddy Krueger", image: "img/horror-06.jpg" },
    "HORROR-07": { name: "Halloween 2", image: "img/horror-07.jpg" },
    "HORROR-08": { name: "Halloween", image: "img/horror-08.jpg" },
    "HORROR-09": { name: "It 2", image: "img/horror-09.jpg" },
    "HORROR-10": { name: "It", image: "img/horror-10.jpg" },
    "HORROR-11": { name: "Jason Flores", image: "img/horror-11.jpg" },
    "HORROR-12": { name: "Jason", image: "img/horror-12.jpg" },
    "HORROR-13": { name: "La Masacre de Texas", image: "img/horror-13.jpg" },
    "HORROR-14": { name: "La Masacre de Texas 2", image: "img/horror-14.jpg" },
    "HORROR-15": { name: "La Monja", image: "img/horror-15.jpg" },
    "HORROR-16": { name: "Los 3 Macabros", image: "img/horror-16.jpg" },
    "HORROR-17": { name: "Los 3 Psicópatas", image: "img/horror-17.jpg" },
    "HORROR-18": { name: "Los Muñecos", image: "img/horror-18.jpg" },
    "HORROR-19": { name: "Los Tres Asesinos", image: "img/horror-19.jpg" },
    "HORROR-20": { name: "Los Tres Payasos", image: "img/horror-20.jpg" },
    "HORROR-21": { name: "Nosferatu", image: "img/horror-21.jpg" },
    "HORROR-22": { name: "Pinhead", image: "img/horror-22.jpg" },
    "HORROR-23": { name: "Saw Flores", image: "img/horror-23.jpg" },
    "HORROR-24": { name: "Saw", image: "img/horror-24.jpg" },
    "HORROR-25": { name: "Scary Movie Flores", image: "img/horror-25.jpg" },
    "HORROR-26": { name: "Scary Movie", image: "img/horror-26.jpg" },
    "HORROR-27": { name: "Scary Movie 2", image: "img/horror-27.jpg" },
    "HORROR-28": { name: "Terrifier", image: "img/horror-28.jpg" },
    "HORROR-29": { name: "The Shining", image: "img/horror-29.jpg" },
    "HORROR-30": { name: "Viernes 13", image: "img/horror-30.jpg" },
    // HERO
    "HERO-01": { name: "America Chavez", image: "img/hero-01.jpg" },
    "HERO-02": { name: "Apocalypse", image: "img/hero-02.jpg" },
    "HERO-03": { name: "Black Cat", image: "img/hero-03.jpg" },
    "HERO-04": { name: "Cable", image: "img/hero-04.jpg" },
    "HERO-05": { name: "Captain America", image: "img/hero-05.jpg" },
    "HERO-06": { name: "Captain Marvel", image: "img/hero-06.jpg" },
    "HERO-07": { name: "Carnage 2", image: "img/hero-07.jpg" },
    "HERO-08": { name: "Carnage", image: "img/hero-08.jpg" },
    "HERO-09": { name: "Cyclops", image: "img/hero-09.jpg" },
    "HERO-10": { name: "Deadpool 2", image: "img/hero-10.jpg" },
    "HERO-11": { name: "Deadpool 3", image: "img/hero-11.jpg" },
    "HERO-12": { name: "Deadpool 4", image: "img/hero-12.jpg" },
    "HERO-13": { name: "Deadpool", image: "img/hero-13.jpg" },
    "HERO-14": { name: "Doctor Doom", image: "img/hero-14.jpg" },
    "HERO-15": { name: "Doctor Octopus", image: "img/hero-15.jpg" },
    "HERO-16": { name: "Doctor Strange", image: "img/hero-16.jpg" },
    "HERO-17": { name: "Electro", image: "img/hero-17.jpg" },
    "HERO-18": { name: "Firestar", image: "img/hero-18.jpg" },
    "HERO-19": { name: "Galactus", image: "img/hero-19.jpg" },
    "HERO-20": { name: "Gambit", image: "img/hero-20.jpg" },
    "HERO-21": { name: "Gamora", image: "img/hero-21.jpg" },
    "HERO-22": { name: "Ghost Rider", image: "img/hero-22.jpg" },
    "HERO-23": { name: "Ghost Spider 2", image: "img/hero-23.jpg" },
    "HERO-24": { name: "Ghost Spider", image: "img/hero-24.jpg" },
    "HERO-25": { name: "Green Goblin", image: "img/hero-25.jpg" },
    "HERO-26": { name: "Hela", image: "img/hero-26.jpg" },
    "HERO-27": { name: "Hercules", image: "img/hero-27.jpg" },
    "HERO-28": { name: "Hulk 2", image: "img/hero-28.jpg" },
    "HERO-29": { name: "Hulk", image: "img/hero-29.jpg" },
    "HERO-30": { name: "Iron Man", image: "img/hero-30.jpg" },
    "HERO-31": { name: "Jean Grey", image: "img/hero-31.jpg" },
    "HERO-32": { name: "Juggernaut", image: "img/hero-32.jpg" },
    "HERO-33": { name: "Kang", image: "img/hero-33.jpg" },
    "HERO-34": { name: "Kraven", image: "img/hero-34.jpg" },
    "HERO-35": { name: "Loki", image: "img/hero-35.jpg" },
    "HERO-36": { name: "Magneto", image: "img/hero-36.jpg" },
    "HERO-37": { name: "Mephisto", image: "img/hero-37.jpg" },
    "HERO-38": { name: "Mr. Fantastic", image: "img/hero-38.jpg" },
    "HERO-39": { name: "Moon Knight", image: "img/hero-39.jpg" },
    "HERO-40": { name: "Ms. Marvel", image: "img/hero-40.jpg" },
    "HERO-41": { name: "Mysterio", image: "img/hero-41.jpg" },
    "HERO-42": { name: "Nebula", image: "img/hero-42.jpg" },
    "HERO-43": { name: "Odin", image: "img/hero-43.jpg" },
    "HERO-44": { name: "Professor X", image: "img/hero-44.jpg" },
    "HERO-45": { name: "Rhino", image: "img/hero-45.jpg" },
    "HERO-46": { name: "Scarlet Witch", image: "img/hero-46.jpg" },
    "HERO-47": { name: "Shocker", image: "img/hero-47.jpg" },
    "HERO-48": { name: "Silver Surfer", image: "img/hero-48.jpg" },
    "HERO-49": { name: "Spider Ham", image: "img/hero-49.jpg" },
    "HERO-50": { name: "Spider Man 2099", image: "img/hero-50.jpg" },
    "HERO-51": { name: "Spider Man", image: "img/hero-51.jpg" },
    "HERO-52": { name: "Spider Woman", image: "img/hero-52.jpg" },
    "HERO-53": { name: "Star Lord", image: "img/hero-53.jpg" },
    "HERO-54": { name: "Thanos", image: "img/hero-54.jpg" },
    "HERO-55": { name: "Ultron", image: "img/hero-55.jpg" },
    "HERO-56": { name: "Venom 2", image: "img/hero-56.jpg" },
    "HERO-57": { name: "Venom", image: "img/hero-57.jpg" },
    "HERO-58": { name: "War Machine", image: "img/hero-58.jpg" },
    "HERO-59": { name: "Wolverine 2", image: "img/hero-59.jpg" },
    "HERO-60": { name: "Wolverine", image: "img/hero-60.jpg" },
    // ROCK
    "ROCK-01": { name: "Bunbury", image: "img/rock-01.jpg" },
    "ROCK-02": { name: "Cadillacs", image: "img/rock-02.jpg" },
    "ROCK-03": { name: "Café Tacvba", image: "img/rock-03.jpg" },
    "ROCK-04": { name: "Caligaris 2", image: "img/rock-04.jpg" },
    "ROCK-05": { name: "Caligaris", image: "img/rock-05.jpg" },
    "ROCK-06": { name: "División 2", image: "img/rock-06.jpg" },
    "ROCK-07": { name: "División", image: "img/rock-07.jpg" },
    "ROCK-08": { name: "Duncan Dhu", image: "img/rock-08.jpg" },
    "ROCK-09": { name: "El Tri", image: "img/rock-09.jpg" },
    "ROCK-10": { name: "Elefante", image: "img/rock-10.jpg" },
    "ROCK-11": { name: "Enjambre", image: "img/rock-11.jpg" },
    "ROCK-12": { name: "Enanitos Verdes", image: "img/rock-12.jpg" },
    "ROCK-13": { name: "Genitallica", image: "img/rock-13.jpg" },
    "ROCK-14": { name: "Héroes del Silencio", image: "img/rock-14.jpg" },
    "ROCK-15": { name: "Hombres G", image: "img/rock-15.jpg" },
    "ROCK-16": { name: "Inspector 2", image: "img/rock-16.jpg" },
    "ROCK-17": { name: "Inspector", image: "img/rock-17.jpg" },
    "ROCK-18": { name: "Jaguares 2", image: "img/rock-18.jpg" },
    "ROCK-19": { name: "Jaguares", image: "img/rock-19.jpg" },
    "ROCK-20": { name: "Jarabe De Palo", image: "img/rock-20.jpg" },
    "ROCK-21": { name: "La Gusana Ciega", image: "img/rock-21.jpg" },
    "ROCK-22": { name: "La Ley", image: "img/rock-22.jpg" },
    "ROCK-23": { name: "La Unión", image: "img/rock-23.jpg" },
    "ROCK-24": { name: "Los Auténticos Decadentes", image: "img/rock-24.jpg" },
    "ROCK-25": { name: "Los Fabulosos Cadillacs", image: "img/rock-25.jpg" },
    "ROCK-26": { name: "Maldita Vecindad 2", image: "img/rock-26.jpg" },
    "ROCK-27": { name: "Maldita Vecindad", image: "img/rock-27.jpg" },
    "ROCK-28": { name: "Maná", image: "img/rock-28.jpg" },
    "ROCK-29": { name: "Moderatto", image: "img/rock-29.jpg" },
    "ROCK-30": { name: "Moenia", image: "img/rock-30.jpg" },
    "ROCK-31": { name: "Molotov 2", image: "img/rock-31.jpg" },
    "ROCK-32": { name: "Molotov 3", image: "img/rock-32.jpg" },
    "ROCK-33": { name: "Molotov", image: "img/rock-33.jpg" },
    "ROCK-34": { name: "Panteón Rococo 2", image: "img/rock-34.jpg" },
    "ROCK-35": { name: "Panteón Rococo", image: "img/rock-35.jpg" },
    "ROCK-36": { name: "Soda Stereo 2", image: "img/rock-36.jpg" },
    "ROCK-37": { name: "Soda Stereo", image: "img/rock-37.jpg" },
    "ROCK-38": { name: "Todos Somos Caligaris", image: "img/rock-38.jpg" },
    "ROCK-39": { name: "Zoe 2", image: "img/rock-39.jpg" },
    "ROCK-40": { name: "Zoe", image: "img/rock-40.jpg" },
    // VAR
    "VAR-01": { name: "Let's Invest", image: "img/var-01.jpg" },
    "VAR-02": { name: "Winning", image: "img/var-02.jpg" },
    "VAR-03": { name: "Hustling 1935", image: "img/var-03.jpg" },
    "VAR-04": { name: "Pato Rapero", image: "img/var-04.jpg" },
    "VAR-05": { name: "Monopoly Graffiti", image: "img/var-05.jpg" },
    "VAR-06": { name: "Time Is Money", image: "img/var-06.jpg" },
    "VAR-07": { name: "Pay Me", image: "img/var-07.jpg" },
    "VAR-08": { name: "Monopoly Runner", image: "img/var-08.jpg" },
    "VAR-09": { name: "Tío Rico Tesoro", image: "img/var-09.jpg" },
    "VAR-10": { name: "Make It Rain", image: "img/var-10.jpg" },
    "VAR-11": { name: "Tío Rico Dólares", image: "img/var-11.jpg" },
    "VAR-12": { name: "Monopoly Champ", image: "img/var-12.jpg" },
    "VAR-13": { name: "Tío Rico Bitcoin", image: "img/var-13.jpg" },
    "VAR-14": { name: "Make Money", image: "img/var-14.jpg" },
    "VAR-15": { name: "Tío Rico Rey", image: "img/var-15.jpg" },
};

const products = CATEGORIES.flatMap((c) =>
    Array.from({ length: c.count }, (_, i) => {
        const id = `${c.prefix}-${String(i + 1).padStart(2, "0")}`;
        const o = OVERRIDES[id] || {};
        return {
            id,
            category: c.name,
            cls: c.cls,
            name: o.name || `${c.prefix} ${String(i + 1).padStart(2, "0")}`,
            image: o.image || null,
            description: o.description || DESCRIPTIONS[c.name],
        };
    })
);
const byId = new Map(products.map((p) => [p.id, p]));
const categoryByName = new Map(CATEGORIES.map((c) => [c.name, c]));

/* ---------- 2. Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => `$${n.toLocaleString("es-MX")}`;
const priceLabel = (n) => `${money(n)} ${CONFIG.currency}`;
const typeLabel = (t) => `${t.label} ${t.gsm} GSM`;
const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waUrl = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const whatsappReady = () => !/^5210+$/.test(CONFIG.whatsapp) && /^\d{10,15}$/.test(CONFIG.whatsapp);

const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* modo privado o cuota llena */ } },
};

let toastTimer;

function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

/* Mientras haya un diálogo abierto, el resto de la página queda inerte (teclado y lectores de pantalla) */
function setBackgroundInert(on) {
    $("#site").inert = on;
    document.body.classList.toggle("lock", on);
}

function trapFocus(container, event) {
    if (event.key !== "Tab") return;
    const focusables = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', container)
        .filter((el) => !el.closest("[hidden]") && el.getAttribute("aria-disabled") !== "true");
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault();
        last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();
        first.focus(); }
}

/* Imagen del producto, o ficha ilustrada mientras no haya foto */
function mediaHtml(p, { lazy = true, small = false } = {}) {
    if (p.image) {
        return `<img src="${esc(p.image)}" alt="${esc(p.name)} — ${esc(p.category)}" width="1000" height="667" ${lazy ? 'loading="lazy"' : ""} decoding="async">`;
    }
    return `<div class="ph ${p.cls}" role="img" aria-label="${esc(p.name)}, foto próximamente">
    <svg viewBox="0 0 100 100" aria-hidden="true"><use href="#tee"/></svg>
    <div class="ph__print"><b>${esc(p.id.split("-")[1])}</b>${small ? "" : `<small>${esc(p.id.split("-")[0])}</small>`}</div>
    ${small ? "" : '<span class="ph__soon">Foto próximamente</span>'}
  </div>`;
}

/* ---------- 3. Catálogo ---------- */
const grid = $("#productGrid");
const state = { category: "all", query: "", shown: CONFIG.pageSize };

function filtered() {
  const q = normalize(state.query.trim());
  return products.filter(
    (p) => (state.category === "all" || p.category === state.category) &&
      (!q || normalize(`${p.name} ${p.id} ${p.category}`).includes(q))
  );
}

function cardHtml(p) {
  const hal = p.category === "Halloween" ? " badge--hal" : "";
  const label = categoryByName.get(p.category)?.label ?? p.category;
  return `<li><button type="button" class="product-card" data-id="${esc(p.id)}" aria-label="Ver ${esc(p.name)}, ${esc(label)}, desde ${money(PRICE_FROM)} pesos mexicanos">
    <span class="product-card__media">${mediaHtml(p)}<span class="badge${hal}">${esc(label)}</span></span>
    <span class="product-card__body">
      <span class="product-card__name">${esc(p.name)}</span>
      <span class="product-card__meta"><span>${esc(label)}</span><strong>Desde ${priceLabel(PRICE_FROM)}</strong></span>
      <span class="product-card__sizes" aria-hidden="true">${SIZES.map((s) => `<span>${s}</span>`).join("")}</span>
    </span></button></li>`;
}

function renderTabs() {
  const total = products.length;
  const tabs = [{ name: "all", label: "Todos", count: total }, ...CATEGORIES.map((c) => ({ name: c.name, label: c.label, count: c.count }))];
  $("#categoryTabs").innerHTML = tabs
    .map((t) => `<button type="button" data-category="${esc(t.name)}" aria-pressed="${t.name === state.category}">${esc(t.label)} <i>${t.count || "pronto"}</i></button>`)
    .join("");
}

function render() {
  const list = filtered();
  grid.innerHTML = list.slice(0, state.shown).map(cardHtml).join("");
  $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "diseño" : "diseños"}`;

  const remaining = list.length - state.shown;
  const more = $("#loadMore");
  more.hidden = remaining <= 0;
  if (remaining > 0) more.textContent = `Ver más diseños (${remaining})`;

  const empty = $("#emptyState");
  empty.hidden = list.length > 0;
  if (!list.length) {
    const isAnime = state.category === "Anime" && !state.query.trim();
    $("#emptyText").textContent = isAnime
      ? "La colección Anime está en preparación. ¿Tienes un personaje en mente? Lo hacemos por encargo."
      : "No encontramos diseños con esa búsqueda. Prueba con otra palabra o escríbenos tu idea.";
    const cta = $("#emptyCta");
    cta.hidden = false;
    cta.href = waUrl(isAnime ? "Hola ALMA, quiero una camiseta de anime. Tengo un diseño en mente." : `Hola ALMA, busqué "${state.query.trim()}" en el catálogo y quiero cotizar un diseño así.`);
    cta.textContent = isAnime ? "Pedir diseño de anime" : "Pedir este diseño por WhatsApp";
  }
}

function setCategory(category, { updateUrl = true } = {}) {
  state.category = category || "all";
  state.shown = CONFIG.pageSize;
  $$("#categoryTabs button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.category === state.category)));
  render();
  if (updateUrl) {
    const url = new URL(location.href);
    if (state.category === "all") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", state.category);
    history.replaceState(null, "", url);
  }
}

$("#categoryTabs").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-category]");
  if (b) setCategory(b.dataset.category);
});

let searchTimer;
$("#searchInput").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { state.query = e.target.value; state.shown = CONFIG.pageSize; render(); }, 150);
});

$("#loadMore").addEventListener("click", () => {
  const previous = grid.children.length;
  state.shown += CONFIG.pageSize;
  render();
  grid.children[previous]?.querySelector("button")?.focus({ preventScroll: true });
});

$$("[data-jump-category]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    setCategory(el.dataset.jumpCategory);
    $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
  })
);

/* ---------- 4. Modal de producto ---------- */
const modal = $("#productModal");
const modalState = { product: null, type: null, size: null, qty: 1, opener: null };

function openModal(p) {
  Object.assign(modalState, { product: p, type: CONFIG.defaultType, size: null, qty: 1, opener: document.activeElement });
  $("#modalCategory").textContent = categoryByName.get(p.category)?.label ?? p.category;
  $("#modalTitle").textContent = p.name;
  $("#modalDescription").textContent = p.description;
  $("#modalImage").innerHTML = mediaHtml(p, { lazy: false });
  $("#modalTypes").innerHTML = TYPE_IDS.map((id) => {
    const t = TYPES[id];
    return `<label class="type-opt">
      <input type="radio" name="tshirtType" value="${id}"${modalState.type === id ? " checked" : ""}>
      <span class="type-opt__box">
        <strong>${esc(t.label)}</strong>
        <small>${t.gsm} GSM${t.note ? ` · ${esc(t.note)}` : ""}</small>
        <b>${priceLabel(t.price)}</b>
      </span>
    </label>`;
  }).join("");
  $("#modalSizes").innerHTML = SIZES.map((s) => `<button type="button" data-size="${s}" aria-pressed="false" aria-label="Talla ${s}">${s}</button>`).join("");
  $("#qtyValue").textContent = "1";
  $("#sizeError").hidden = true;
  $("#typeError").hidden = true;
  refreshModalPrice();
  modal.hidden = false;
  setBackgroundInert(true);
  $(".modal__close", modal).focus();
}

/* Precio y enlace de WhatsApp del modal según el tipo elegido */
function refreshModalPrice() {
  const t = TYPES[modalState.type];
  const p = modalState.product;
  $("#modalPrice").textContent = money(t ? t.price : PRICE_FROM);
  $("#modalPriceNote").textContent = t ? `${CONFIG.currency} · ${typeLabel(t)}` : `${CONFIG.currency} · desde`;
  const kind = t ? ` en versión ${t.label.toLowerCase()} (${t.gsm} GSM)` : "";
  if (p) $("#askWhatsapp").href = waUrl(`Hola ALMA, me interesa la camiseta ${p.name} (${p.id})${kind}. ¿Está disponible?`);
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  if (drawer.hidden) setBackgroundInert(false);
  modalState.opener?.focus?.();
}

modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
modal.addEventListener("keydown", (e) => trapFocus($(".modal__card", modal), e));

$("#modalTypes").addEventListener("change", (e) => {
  const input = e.target.closest('input[name="tshirtType"]');
  if (!input || !TYPES[input.value]) return;
  modalState.type = input.value;
  $("#typeError").hidden = true;
  refreshModalPrice();
});

$("#modalSizes").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-size]");
  if (!b) return;
  modalState.size = b.dataset.size;
  $$("#modalSizes button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  $("#sizeError").hidden = true;
});

$("#qtyMinus").addEventListener("click", () => { modalState.qty = Math.max(1, modalState.qty - 1); $("#qtyValue").textContent = modalState.qty; });
$("#qtyPlus").addEventListener("click", () => { modalState.qty = Math.min(CONFIG.maxQty, modalState.qty + 1); $("#qtyValue").textContent = modalState.qty; });

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (card && byId.has(card.dataset.id)) openModal(byId.get(card.dataset.id));
});

$("#addToCart").addEventListener("click", () => {
  const { product, type, size, qty } = modalState;
  if (!product) return;
  if (!type || !size) {
    $("#typeError").hidden = !!type;
    $("#sizeError").hidden = !!size;
    (!type ? $('#modalTypes input') : $("#modalSizes button"))?.focus();
    return;
  }
  const key = `${product.id}-${type}-${size}`;
  const found = cart.find((i) => i.key === key);
  if (found) found.qty = Math.min(CONFIG.maxQty, found.qty + qty);
  else cart.push({ key, id: product.id, type, size, qty });
  saveCart();
  const bell = $("#cartButton");
  bell.classList.remove("bump");
  void bell.offsetWidth;
  bell.classList.add("bump");
  closeModal();
  toast(`${product.name} · ${TYPES[type].label} (${size}) agregada al carrito`);
});

/* ---------- 5. Carrito ---------- */
/* Solo se guardan id, tipo, talla y cantidad; nombre, imagen y precio se leen del catálogo (evita datos obsoletos o manipulados) */
function loadCart() {
  try {
    const raw = JSON.parse(storage.get(CONFIG.storageKey) || "[]");
    return raw
      .filter((i) => byId.has(i?.id) && TYPES[i.type] && SIZES.includes(i.size))
      .map((i) => ({ key: `${i.id}-${i.type}-${i.size}`, id: i.id, type: i.type, size: i.size, qty: Math.min(CONFIG.maxQty, Math.max(1, Number(i.qty) || 1)) }));
  } catch { return []; }
}
let cart = loadCart();

const drawer = $("#cartDrawer");
const overlay = $("#cartOverlay");
let cartOpener = null;

function saveCart() {
  storage.set(CONFIG.storageKey, JSON.stringify(cart.map(({ id, type, size, qty }) => ({ id, type, size, qty }))));
  renderCart();
}

const lineTotal = (i) => i.qty * TYPES[i.type].price;
const cartTotal = () => cart.reduce((s, i) => s + lineTotal(i), 0);

function orderUrl() {
  const lines = cart.map((i) => `• ${i.qty} x ${byId.get(i.id).name} (${i.id}) — ${typeLabel(TYPES[i.type])} — talla ${i.size} — ${priceLabel(lineTotal(i))}`);
  return waUrl(`Hola ALMA, quiero realizar este pedido:\n${lines.join("\n")}\n\nTotal: ${priceLabel(cartTotal())}`);
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cartTotal();
  $("#cartCount").textContent = count;
  $("#cartButton").setAttribute("aria-label", `Abrir carrito, ${count} ${count === 1 ? "artículo" : "artículos"}`);
  $("#cartTotal").textContent = priceLabel(total);

  const wa = $("#cartWhatsapp");
  wa.href = cart.length ? orderUrl() : "#";
  wa.setAttribute("aria-disabled", String(!cart.length));

  $("#cartBody").innerHTML = cart.length
    ? cart.map((i, n) => {
        const p = byId.get(i.id);
        return `<div class="cart-item">
          <div class="cart-item__img">${mediaHtml(p, { small: true })}</div>
          <div>
            <h3>${esc(p.name)}</h3>
            <small>${esc(categoryByName.get(p.category)?.label ?? p.category)} · ${esc(typeLabel(TYPES[i.type]))} · Talla ${i.size}</small>
            <div class="cart-item__actions">
              <button type="button" data-act="minus" data-i="${n}" aria-label="Menos ${esc(p.name)}">−</button>
              <output>${i.qty}</output>
              <button type="button" data-act="plus" data-i="${n}" aria-label="Más ${esc(p.name)}">+</button>
            </div>
            <button type="button" class="cart-remove" data-act="remove" data-i="${n}">Quitar</button>
          </div>
          <div class="cart-item__price">${money(lineTotal(i))}</div>
        </div>`;
      }).join("")
    : `<div class="cart-empty"><strong>Tu carrito está vacío.</strong><p>Agrega una camiseta y aquí podrás revisar tu pedido antes de enviarlo.</p></div>`;
}

$("#cartBody").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-act]");
  if (!b) return;
  const i = Number(b.dataset.i);
  if (!cart[i]) return;
  if (b.dataset.act === "minus") cart[i].qty = Math.max(1, cart[i].qty - 1);
  if (b.dataset.act === "plus") cart[i].qty = Math.min(CONFIG.maxQty, cart[i].qty + 1);
  if (b.dataset.act === "remove") cart.splice(i, 1);
  saveCart();
  /* devuelve el foco al mismo control tras redibujar */
  const same = $(`#cartBody [data-act="${b.dataset.act}"][data-i="${Math.min(i, cart.length - 1)}"]`);
  (same || $("#cartClose")).focus();
});

$("#cartWhatsapp").addEventListener("click", (e) => {
  if (!cart.length) { e.preventDefault(); return; }
  if (!whatsappReady()) {
    e.preventDefault();
    toast("Falta configurar el número de WhatsApp en script.js (CONFIG.whatsapp)");
    console.warn("ALMA: CONFIG.whatsapp todavía tiene el número de ejemplo.");
  }
});

function openCart() {
  if (!drawer.hidden) return;
  cartOpener = document.activeElement;
  closeMenu();
  drawer.hidden = false;
  overlay.hidden = false;
  setBackgroundInert(true);
  $("#cartClose").focus();
}

function closeCart() {
  if (drawer.hidden) return;
  drawer.hidden = true;
  overlay.hidden = true;
  if (modal.hidden) setBackgroundInert(false);
  cartOpener?.focus?.();
}

$("#cartButton").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
drawer.addEventListener("keydown", (e) => trapFocus(drawer, e));

/* WhatsApp: botón flotante */
$("#waFloat").href = waUrl("Hola ALMA, vi su catálogo y quiero más información.");

/* WhatsApp: personalización */
const customLink = $("#whatsappCustom");
customLink.href = waUrl("Hola ALMA, quiero personalizar una camiseta. Tengo una idea/diseño y quisiera cotizarla.");
customLink.addEventListener("click", (e) => {
  if (!whatsappReady()) { e.preventDefault(); toast("Falta configurar el número de WhatsApp en script.js (CONFIG.whatsapp)"); }
});
$("#askWhatsapp").addEventListener("click", (e) => {
  if (!whatsappReady()) { e.preventDefault(); toast("Falta configurar el número de WhatsApp en script.js (CONFIG.whatsapp)"); }
});

/* ---------- 6. Cuenta regresiva, menú e init ---------- */
const countdownEl = $("#countdown");
const target = new Date(CONFIG.halloween).getTime();
let lastValues = "";

function tick() {
  const left = target - Date.now();
  if (left <= 0) {
    countdownEl.hidden = true;
    $("#countdownDone").hidden = false;
    return false;
  }
  const v = {
    d: Math.floor(left / 864e5),
    h: Math.floor(left / 36e5) % 24,
    m: Math.floor(left / 6e4) % 60,
    s: Math.floor(left / 1e3) % 60,
  };
  const signature = Object.values(v).join(":");
  if (signature !== lastValues) {
    lastValues = signature;
    for (const [k, val] of Object.entries(v)) $(`[data-u="${k}"]`, countdownEl).textContent = String(val).padStart(2, "0");
  }
  return true;
}

let countdownTimer = null;
function startCountdown() {
  if (!tick()) return;
  countdownTimer = setInterval(() => { if (!tick()) clearInterval(countdownTimer); }, 1000);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { clearInterval(countdownTimer); countdownTimer = null; }
  else if (!countdownTimer && Date.now() < target) startCountdown();
});

const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
function closeMenu() {
  mobileMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Abrir menú");
}
menuBtn.addEventListener("click", () => {
  mobileMenu.style.top = `${Math.max(0, Math.round($(".site-header").getBoundingClientRect().bottom))}px`;
  const open = mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
matchMedia("(min-width: 981px)").addEventListener("change", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!modal.hidden) closeModal();
  else if (!drawer.hidden) closeCart();
  else closeMenu();
});

/* Init */
const params = new URLSearchParams(location.search);
const initial = params.get("categoria");
renderTabs();
setCategory(CATEGORIES.some((c) => c.name === initial) ? initial : "all", { updateUrl: false });
renderCart();
startCountdown();

/* Textos fijos del HTML que dependen de precios y gramajes: salen de TYPES para no tener cifras duplicadas */
const BINDINGS = {
  priceFrom: money(PRICE_FROM),
  priceBasica: money(TYPES.basica.price),
  priceOversize: money(TYPES.oversize.price),
  gsmBasica: String(TYPES.basica.gsm),
  gsmOversize: String(TYPES.oversize.gsm),
  gsmPair: `${TYPES.basica.gsm} · ${TYPES.oversize.gsm}`,
};
$$("[data-bind]").forEach((el) => { if (el.dataset.bind in BINDINGS) el.textContent = BINDINGS[el.dataset.bind]; });
$("#year").textContent = new Date().getFullYear();
if (!whatsappReady()) console.warn("ALMA: configura CONFIG.whatsapp en script.js antes de publicar.");