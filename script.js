"use strict";

/* ===== CONFIGURAÇÃO — preenche aqui os links reais =====
   Deixa em branco ("") o que ainda não existir: o botão fica desativado. */

// Número do responsável pelas candidaturas, com indicativo e sem "+" ou espaços.
// Exemplo: "244900000000". Não uses os números de informações por engano.
const WHATSAPP_CANDIDATURAS = "244954332128";  // link de WhatsApp para candidaturas

const WHATSAPP_GRUPO = "https://chat.whatsapp.com/EsJo40UTAkE4V3Yexk84zs?s=cl&p=a&iam=2";  // link de convite do grupo de WhatsApp
const TIKTOK_URL = "https://www.tiktok.com/@comunidades.otaku?_r=1&_t=ZS-9AVEzuwyZpR";  // https://www.tiktok.com/@...
const YOUTUBE_URL = "https://youtube.com/@comunidadeotakucuanzasul?si=0DnT2RtauEfDDS6r";  // https://www.youtube.com/@...
const FACEBOOK_URL = "https://www.facebook.com/share/1C7vxfD1xY/?mibextid=wwXIfr";  // https://www.facebook.com/...

const MSG_CANDIDATURA = "Olá! Tenho interesse em participar no Festival Convergência Geek — 1.ª Edição. Gostaria de saber mais informações sobre as candidaturas.";
const LINKS = { WHATSAPP_GRUPO, TIKTOK_URL, YOUTUBE_URL, FACEBOOK_URL };
const NOMES = { WHATSAPP_GRUPO: "WhatsApp", TIKTOK_URL: "TikTok", YOUTUBE_URL: "YouTube", FACEBOOK_URL: "Facebook" };

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waLink = (num, msg) => `https://wa.me/${num}` + (msg ? `?text=${encodeURIComponent(msg)}` : "");

/* ===== Links externos e estados indisponíveis ===== */
function setupExternal() {
  $$("[data-ext]").forEach(a => {
    const url = LINKS[a.dataset.ext];
    if (url) {
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    } else {
      a.removeAttribute("href");
      a.setAttribute("role", "link");
      a.setAttribute("aria-disabled", "true");
      a.title = "Link ainda não disponível";
      a.textContent = "Brevemente indisponível";
      a.addEventListener("click", e => e.preventDefault());
    }
  });
  $$("[data-wa]").forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });
  const soc = $("#footer-soc");
  Object.keys(LINKS).forEach(k => {
    if (!LINKS[k]) return;
    const a = document.createElement("a");
    a.href = LINKS[k]; a.textContent = NOMES[k]; a.target = "_blank"; a.rel = "noopener noreferrer";
    soc.append(a);
  });
}

/* ===== Menu móvel ===== */
function setupMenu() {
  const burger = $("#burger"), nav = $("#nav");
  const set = open => {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  burger.addEventListener("click", () => set(!nav.classList.contains("open")));
  $$("a, button", nav).forEach(el => el.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("open")) { set(false); burger.focus(); }
  });
}

/* ===== Secção ativa e entrada suave ===== */
function setupObservers() {
  const links = $$("#nav [data-link]");
  const secs = $$("main section[id]");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => {
      const on = l.getAttribute("href") === "#" + e.target.id;
      l.classList.toggle("active", on);
      on ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current");
    });
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => io.observe(s));

  const rv = $$(".head, .cards, .event, .closing");
  rv.forEach(el => el.classList.add("reveal"));
  const ro = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
  }), { threshold: 0.12 });
  rv.forEach(el => ro.observe(el));
}

/* ===== Modal acessível ===== */
function setupModal() {
  const modal = $("#modal"), box = $(".modal__box", modal);
  let opener = null;
  const focusable = () => $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', box).filter(e => e.offsetParent !== null);

  const open = trigger => {
    opener = trigger;
    modal.hidden = false;
    document.body.classList.add("lock");
    requestAnimationFrame(() => { modal.classList.add("show"); box.focus(); });
    document.addEventListener("keydown", onKey);
  };
  const close = () => {
    modal.classList.remove("show");
    document.body.classList.remove("lock");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => { modal.hidden = true; }, 250);
    if (opener) opener.focus();
  };
  const onKey = e => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const f = focusable(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === box)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  $$("[data-open-modal]").forEach(b => b.addEventListener("click", () => open(b)));
  $$("[data-close]", modal).forEach(b => b.addEventListener("click", close));

  $("#apply").addEventListener("click", () => {
    const note = $("#apply-note");
    if (!WHATSAPP_CANDIDATURAS.trim()) { note.hidden = false; note.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    note.hidden = true;
    window.open(waLink(WHATSAPP_CANDIDATURAS.trim(), MSG_CANDIDATURA), "_blank", "noopener,noreferrer");
  });
}

/* ===== Atividades do festival (fonte única para a página e para o modal) ===== */
const ATIVIDADES = [
  { t: "Campeonato de PlayStation", d: "Futebol e Mortal Kombat.", i: "M7 8h10a5 5 0 015 5v2a3 3 0 01-5.2 2L15 15H9l-1.8 2A3 3 0 012 15v-2a5 5 0 015-5zM8 10v3M6.5 11.5h3M16 11h.01M18 13h.01" },
  { t: "Shows de música", d: "Atuações musicais e música geek.", i: "M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4" },
  { t: "Feiras e exposições", d: "Vendedores, desenhistas e prestadores de serviços geek.", i: "M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6" },
  { t: "Karaoke", d: "Músicas geek e muito mais.", i: "M9 18V6l11-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z" },
  { t: "Quiz de cultura geek", d: "Perguntas e conhecimentos sobre a cultura geek.", i: "M12 21a9 9 0 100-18 9 9 0 000 18zM9.500 9.500a2.500 2.500 0 114 2c-1 .8-1.500 1.200-1.500 2.500M12 17h.01" },
  { t: "Trocas de animes", d: "Espaço dedicado à troca de materiais relacionados com anime.", i: "M7 7h13l-3-3M17 17H4l3 3" },
  { t: "Apresentação de cosplay", d: "Apresentação de cosplays e personagens.", i: "M12 3a6 6 0 00-6 6v3a6 6 0 0012 0V9a6 6 0 00-6-6zM9 10h.01M15 10h.01M9.500 14.500c1.500 1 3.500 1 5 0M4 21c1-3 4-4 8-4s7 1 8 4" }
];
function renderFestival() {
  const NS = "http://www.w3.org/2000/svg";
  const build = (list, withIcon) => ATIVIDADES.forEach(a => {
    const li = document.createElement("li");
    li.className = withIcon ? "card act" : "";
    if (withIcon) {
      const s = document.createElementNS(NS, "svg");
      s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
      const p = document.createElementNS(NS, "path"); p.setAttribute("d", a.i); s.append(p); li.append(s);
    }
    const b = document.createElement(withIcon ? "h4" : "b"); b.textContent = a.t;
    const d = document.createElement("p"); d.textContent = a.d;
    if (withIcon) li.append(b, d); else { li.append(b); li.append(a.d); }
    list.append(li);
  });
  build($("#fest-acts"), true);
  build($("#modal-acts"), false);
  $$("[data-tel]").forEach(a => { a.href = `tel:+${a.dataset.tel}`; });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderFestival(); setupExternal(); setupMenu(); setupObservers(); setupModal();
});
