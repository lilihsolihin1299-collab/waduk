/* =========================================================
   ISI DI SINI SAJA
   foto : link gambar (kosongkan "" kalau tidak pakai foto)
   link : smartlink (kosongkan "" kalau tidak pakai)
   ========================================================= */
const LINK_TELEGRAM = "https://t.me/namakamu";
const LINK_APLIKASI = "https://aplikasikamu.com";

const UTAMA = {
  judul: "Saluran Utama",
  info:  "CH 01 · 12.4K nonton",
  foto:  "",
  link:  ""
};

const SALURAN = [
  { nama: "Saluran Utama", penonton: "12.4K", foto: "", link: "" },
  { nama: "Film Pilihan",  penonton: "8.1K",  foto: "", link: "" },
  { nama: "Musik Live",    penonton: "6.7K",  foto: "", link: "" },
  { nama: "Olahraga",      penonton: "15.2K", foto: "", link: "" },
  { nama: "Drama",         penonton: "4.9K",  foto: "", link: "" },
  { nama: "Anime",         penonton: "9.3K",  foto: "", link: "" },
  { nama: "Dokumenter",    penonton: "3.2K",  foto: "", link: "" },
  { nama: "Komedi",        penonton: "5.6K",  foto: "", link: "" }
];
/* ===================== SELESAI ISIAN ===================== */
const WARNA = [
  ["#FF3B6B","#FF9A2E"],["#FF9A2E","#FFE14D"],["#FFE14D","#3DF29A"],["#3DF29A","#33D1FF"],
  ["#33D1FF","#7A6BFF"],["#7A6BFF","#E45CFF"],["#E45CFF","#FF3B6B"],["#FF3B6B","#33D1FF"]
];
const $ = id => document.getElementById(id);
let warnaNow = WARNA[0];

function pasangLink(el, url){
  if (url) el.href = url; else el.removeAttribute("href");
}
pasangLink($("btnTg"), LINK_TELEGRAM);
pasangLink($("btnApp"), LINK_APLIKASI);

/* layar utama */
function setUtama(judul, info, foto, link, warna){
  $("pName").textContent = judul;
  $("pView").textContent = info;
  pasangLink($("player"), link);
  $("player").style.cursor = link ? "pointer" : "default";
  warnaNow = warna;
  const img = $("pFoto");
  if (foto){
    img.onerror = () => { img.hidden = true; };
    img.src = foto; img.hidden = false;
  } else {
    img.hidden = true; img.removeAttribute("src");
  }
}
setUtama(UTAMA.judul, UTAMA.info, UTAMA.foto, UTAMA.link, WARNA[0]);

/* 8 saluran */
const grid = $("grid");
SALURAN.forEach((s, i) => {
  const w = WARNA[i % WARNA.length];
  const no = "CH " + String(i + 1).padStart(2, "0");
  const el = document.createElement(s.link ? "a" : "button");
  el.className = "ch" + (i === 0 ? " on" : "");
  el.style.setProperty("--k", w[0]);
  if (s.link){ el.href = s.link; el.target = "_blank"; el.rel = "noopener"; }

  const isi = `<div class="art" style="--g:linear-gradient(135deg,${w[0]},${w[1]},${w[0]})"></div>`
    + (s.foto ? `<img class="photo" src="${s.foto}" alt="${s.nama}" onerror="this.remove()">` : "");

  el.innerHTML = `<div class="screen">${isi}<div class="scan"></div>
    <span class="num">${no}</span><span class="lv">LIVE</span>
    <div class="play"><b></b></div></div>
    <div class="meta"><strong>${s.nama}</strong><span>${s.penonton}</span></div>`;

  el.addEventListener("click", () => {
    grid.querySelectorAll(".ch").forEach(x => x.classList.remove("on"));
    el.classList.add("on");
    setUtama(s.nama, `${no} · ${s.penonton} nonton`, s.foto, s.link || UTAMA.link, w);
    if (!s.link) $("player").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  grid.appendChild(el);
});

/* teks berjalan */
const items = SALURAN.map((s, i) => `<span style="--k:${WARNA[i % WARNA.length][0]}">${s.nama}</span>`).join("");
$("tick").innerHTML = items + items;

/* animasi cahaya layar utama (tampil kalau tanpa foto) */
const cv = $("fx"), ctx = cv.getContext("2d");
const diam = matchMedia("(prefers-reduced-motion: reduce)").matches;
function ukur(){ const r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; }
ukur(); addEventListener("resize", ukur);
function gambar(ts){
  const w = cv.width, h = cv.height, t = ts / 1000;
  ctx.fillStyle = "#12070D"; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  [[warnaNow[0], .3, .4, .9], [warnaNow[1], .7, .6, .7], ["#F7C873", .5, .2, .5]].forEach(([c, x, y, sp], k) => {
    const cx = w * (x + .18 * Math.sin(t * sp * .4 + k)), cy = h * (y + .18 * Math.cos(t * sp * .5 + k * 2)), r = Math.max(w, h) * .45;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, c + "cc"); g.addColorStop(1, c + "00");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  });
  ctx.globalCompositeOperation = "source-over";
  if (!diam) requestAnimationFrame(gambar);
}
requestAnimationFrame(gambar);
