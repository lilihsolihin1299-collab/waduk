/* ===== SINEMO PLUS ===== */

/* ---------- PENGATURAN ---------- */
const API = "https://hidden-lab-7352.rayyanurfitri1299.workers.dev";   // alamat Worker

/* ---------- ALAT BANTU ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const baca = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const simpan = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const IK = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
  bintang: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  kilau: '<svg viewBox="0 0 24 24"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/></svg>',
  jam: '<svg class="ik" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  fav: '<svg class="ik" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  eks: '<svg class="ik" viewBox="0 0 24 24"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/></svg>',
  chat: '<svg class="ik" viewBox="0 0 24 24"><path d="M4 4h16v11H9l-5 4z"/></svg>',
  google: '<svg class="ik" viewBox="0 0 24 24"><path d="M20 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.5a4 4 0 0 1-1.7 2.6v2.1h2.8c1.6-1.5 2.4-3.7 2.4-6.3z"/><path d="M12 20.5c2.3 0 4.2-.8 5.6-2l-2.8-2.1c-.8.5-1.7.8-2.8.8-2.2 0-4-1.5-4.7-3.4H4.4v2.2a8.5 8.5 0 0 0 7.6 4.5zM7.3 13.8a5 5 0 0 1 0-3.6V8H4.4a8.5 8.5 0 0 0 0 7.6zM12 6.8c1.2 0 2.4.4 3.3 1.3l2.5-2.5A8.5 8.5 0 0 0 4.4 8l2.9 2.2c.7-2 2.5-3.4 4.7-3.4z"/></svg>',
  hapus: '<svg class="ik" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  panah: '<svg class="ik panah" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
};

function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 2600);
}

/* riwayat & favorit disimpan di HP */
const favs = () => baca("sp_fav", []);
const riwayat = () => baca("sp_riwayat", []);

/* ---------- DATA VIDEO ---------- */
let GRATIS = [], EKS = [];
const PETA = {};

function pasangData(j) {
  GRATIS = (j.gratis || []).map(x => ({ id: "g" + x.id, judul: x.judul || "", src: x.src, thumb: x.thumb || "", eks: false }));
    EKS = (j.eksklusif || []).map(x => ({ id: "e" + x.id, judul: x.judul || "", src: x.src, thumb: x.thumb || "", eks: true }));
  GRATIS.forEach((v, i) => { if (!v.judul) v.judul = "Video " + (GRATIS.length - i); });
  EKS.forEach((v, i) => { if (!v.judul) v.judul = "Eksklusif " + (EKS.length - i); });
  Object.keys(PETA).forEach(k => delete PETA[k]);
  [...GRATIS, ...EKS].forEach(v => PETA[v.id] = v);
}

async function muatVideo() {
  const cache = baca("sp_video", null);
  if (cache) { pasangData(cache); renderSemua(); }
  try {
    const r = await fetch(API + "/api/video");
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "Gagal memuat video");
    simpan("sp_video", j);
    pasangData(j);
    renderSemua();
  } catch (e) {
    if (!cache) {
      $("#grid-home").innerHTML = '<p class="kosong">Video gagal dimuat. Cek internet lalu buka ulang.</p>';
      $("#slider").innerHTML = "";
    }
  }
}

function renderSemua() {
  const q = $("#cari").value.trim();
  if (q) cariVideo(q); else renderHome();
  renderSlider();
  if (halaman === "eksklusif") renderEksklusif();
  if (halaman === "aktivitas") renderAktivitas();
}

/* ---------- KOTAK VIDEO ---------- */
function kartu(v) {
  const f = favs().includes(v.id);
  const gambar = v.thumb ? `<img src="${esc(v.thumb)}" loading="lazy" decoding="async" alt="">` : "";
  return `<article class="kotak" data-id="${v.id}">
    <div class="thumb">${gambar}
      <span class="play">${IK.play}</span>
      ${v.eks ? `<span class="vip">${IK.kilau}EKSKLUSIF</span>` : ""}
    </div>
    <div class="info"><span class="jdl">${esc(v.judul)}</span>
      <button class="bintang ${f ? "on" : ""}" data-fav="${v.id}" aria-label="Favorit">${IK.bintang}</button>
    </div>
  </article>`;
}

/* ---------- NOMOR HALAMAN (1, 2, 3 ...) ---------- */
const PER_HALAMAN = 30;              // jumlah video per nomor halaman

/* nomor halaman diingat, jadi pas balik dari iklan tetap di nomor yang sama */
const kunciHal = el => "sp_hal_" + el.id;
function bacaHal(el) { try { return +sessionStorage.getItem(kunciHal(el)) || 1; } catch (e) { return 1; } }
function simpanHal(el, n) { try { sessionStorage.setItem(kunciHal(el), n); } catch (e) {} }
function resetHal(el) { try { sessionStorage.removeItem(kunciHal(el)); } catch (e) {} }

function tombolNomor(hal, total) {
  if (total < 2) return "";
  const no = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - hal) <= 1) no.push(i);
    else if (no[no.length - 1] !== "...") no.push("...");
  }
  return `<div class="nomor">
    <button data-hal="${hal - 1}" ${hal === 1 ? "disabled" : ""} aria-label="Sebelumnya">&lsaquo;</button>
    ${no.map(i => i === "..." ? "<span>...</span>" : `<button data-hal="${i}" class="${i === hal ? "on" : ""}">${i}</button>`).join("")}
    <button data-hal="${hal + 1}" ${hal === total ? "disabled" : ""} aria-label="Berikutnya">&rsaquo;</button></div>`;
}

function tampilHal(el, hal, gulir) {
  const total = Math.max(1, Math.ceil(el._list.length / PER_HALAMAN));
  hal = Math.min(Math.max(1, hal), total);
  simpanHal(el, hal);
  el.innerHTML = el._list.slice((hal - 1) * PER_HALAMAN, hal * PER_HALAMAN).map(kartu).join("") + tombolNomor(hal, total);
  $$(".nomor button", el).forEach(b => b.onclick = e => { e.stopPropagation(); tampilHal(el, +b.dataset.hal, true); });
  pasangThumb(el);
  if (gulir) window.scrollTo({ top: 0, behavior: "instant" });   // halaman baru mulai dari paling atas
}

function renderGrid(list, el, kosong) {
  el._list = list;
  if (!list.length) { el.innerHTML = `<p class="kosong">${kosong || "Belum ada video."}</p>`; return; }
  tampilHal(el, bacaHal(el), false);
}

/* gambar sampul otomatis dari video kalau link gambar tidak diisi */
const antrianThumb = [];
let sedangThumb = 0;
const DI_FB = /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(navigator.userAgent);   // dibuka dari aplikasi Facebook/Instagram
const MAKS_THUMB = DI_FB ? 2 : 10;   // jumlah video yang diambil gambarnya barengan (di FB dibatasi biar HP gak berat)
const BATAS_DETIK = 120;              // batas waktu satu percobaan
const MAKS_COBA = 20;                // coba ulang otomatis sampai 10 kali, setelah itu berhenti
const JEDA_ULANG_DETIK = 5;         // jeda coba ulang: 10 dtk, lalu 20, 30, dst (makin lama makin jarang)

/* catatan gagal disimpan di HP, per link video (ganti link di admin = dicoba dari awal) */
const thumbGagal = baca("sp_thumb_gagal", {});
const simpanGagal = () => simpan("sp_thumb_gagal", thumbGagal);
const videoDariBox = box => { const art = box.closest("[data-id]"); return art && PETA[art.dataset.id]; };

function jalankanThumb() {
  while (sedangThumb < MAKS_THUMB && antrianThumb.length) {
    const box = antrianThumb.shift();
    const v = videoDariBox(box);
    if (!v || !box.isConnected || box.querySelector("canvas,img")) continue;
    if ((thumbGagal[v.src] || 0) >= MAKS_COBA) continue;
    sedangThumb++;
    ambilFrame(box, v).then(ok => {
      sedangThumb--;
      if (!ok && document.hidden) return;   // dihentikan karena layar ditinggal, bukan gagal
      if (ok) {
        if (thumbGagal[v.src]) { delete thumbGagal[v.src]; simpanGagal(); }
      } else {
        const n = (thumbGagal[v.src] || 0) + 1;
        thumbGagal[v.src] = n;
        simpanGagal();
        if (n < MAKS_COBA) setTimeout(() => { antrianThumb.push(box); jalankanThumb(); }, JEDA_ULANG_DETIK * n * 1000);
      }
      jalankanThumb();
    });
  }
}

const videoThumbAktif = new Set();
/* layar ditinggal (pindah aplikasi / keluar): semua video berhenti biar HP gak berat */
function hentikanSemua() {
  antrianThumb.length = 0;
  videoThumbAktif.forEach(v => { try { v.removeAttribute("src"); v.load(); } catch (e) {} });
  videoThumbAktif.clear();
  $$("#slider video").forEach(v => { v.pause(); if (v.getAttribute("src")) { v.removeAttribute("src"); v.load(); } });
  if (typeof pv !== "undefined" && pv) pv.pause();
}
window.addEventListener("pagehide", hentikanSemua);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) hentikanSemua();
  else $$(".thumb[data-pasang]").forEach(b => { if (!b.querySelector("canvas,img") && b.isConnected) { antrianThumb.push(b); } }), jalankanThumb();
});

function ambilFrame(box, v) {
  return new Promise(res => {
    const vid = document.createElement("video");
    videoThumbAktif.add(vid);
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = "auto";
    let selesai = false;
    const akhir = ok => {
      if (selesai) return;
      selesai = true;
      clearTimeout(t);
      videoThumbAktif.delete(vid);
      vid.removeAttribute("src");
      vid.load();
      res(ok);
    };
    const t = setTimeout(() => akhir(false), BATAS_DETIK * 1000);
    vid.addEventListener("loadeddata", () => {
      const d = vid.duration;
      try { vid.currentTime = isFinite(d) && d > 2 ? Math.min(1.5, d / 2) : 0.1; } catch (e) { akhir(false); }
    });
    vid.addEventListener("seeked", () => requestAnimationFrame(() => {
      try {
        if (!vid.videoWidth) return akhir(false);
        if (box.isConnected) {
          const c = document.createElement("canvas");
          c.width = 320;
          c.height = Math.round(320 * vid.videoHeight / vid.videoWidth) || 200;
          c.getContext("2d").drawImage(vid, 0, 0, c.width, c.height);
          box.insertBefore(c, box.firstChild);
        }
        akhir(true);
      } catch (e) { akhir(false); }
    }));
    vid.addEventListener("error", () => akhir(false));
    vid.src = v.src;
  });
}

const thumbIO = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  thumbIO.unobserve(en.target);
  antrianThumb.push(en.target);
  jalankanThumb();
}), { rootMargin: "200px" });

function pasangThumb(el) {
  $$(".thumb", el).forEach(b => {
    if (b.querySelector("img") || b.dataset.pasang) return;
    const v = videoDariBox(b);
    if (v && (thumbGagal[v.src] || 0) >= MAKS_COBA) return;
    b.dataset.pasang = "1";
    thumbIO.observe(b);
  });
}

/* ---------- SLIDER ---------- */
let sliderTimer = null;
function renderSlider() {
  const s = $("#slider"), d = $("#dots"), list = GRATIS.slice(0, 5);
  clearInterval(sliderTimer);
  if (!list.length) {
    s.innerHTML = '<div class="slider-kosong">Video segera hadir</div>';
    d.innerHTML = "";
    return;
  }
  s.innerHTML = list.map(v => `<div class="slide" data-id="${v.id}">
    ${v.thumb ? `<img src="${esc(v.thumb)}" alt="">` : ""}
    <video muted loop playsinline preload="none" data-src="${esc(v.src)}"></video>
    <div class="slide-info"><div><small>TERBARU</small><b>${esc(v.judul)}</b></div><span class="play-btn">${IK.play}Tonton</span></div></div>`).join("");
  d.innerHTML = list.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");

  const vids = $$("video", s);
  let cur = 0;
  function putar(i) {
    if (DI_FB) return;                       // di aplikasi FB slider cukup gambar, video gak diputar (biar ringan)
    vids.forEach((v, j) => {
      if (j === i) {
        if (!v.getAttribute("src")) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else {
        v.pause();
        if (v.getAttribute("src")) { v.removeAttribute("src"); v.load(); }
      }
    });
  }
  s.onscroll = () => {
    const i = Math.round(s.scrollLeft / s.clientWidth);
    $$("i", d).forEach((x, j) => x.classList.toggle("on", i === j));
    if (i !== cur) { cur = i; putar(i); }
  };
  putar(0);
  if (list.length < 2) return;
  sliderTimer = setInterval(() => {
    if (halaman !== "home" || player.classList.contains("buka") || document.hidden) { vids[cur].pause(); return; }
    if (vids[cur].paused) vids[cur].play().catch(() => {});
    s.scrollTo({ left: ((cur + 1) % list.length) * s.clientWidth, behavior: "smooth" });
  }, 5000);
}
/* ---------- PEMUTAR ---------- */
const player = $("#player"), pv = $("#pv");
let sedang = null;

/* tombol play besar di atas video: video tidak jalan sendiri, penonton pencet play */
const pPlay = document.createElement("button");
pPlay.className = "p-play";
pPlay.setAttribute("aria-label", "Putar video");
pPlay.innerHTML = `<span class="p-play-btn">${IK.play}</span><span class="p-play-teks">Ketuk untuk memutar</span>`;
pv.insertAdjacentElement("afterend", pPlay);
pPlay.addEventListener("click", e => {
  e.stopPropagation();
  pPlay.hidden = true;
  pv.setAttribute("controls", "");
  pv.play().catch(() => { pv.muted = true; pv.play().catch(() => { pPlay.hidden = false; }); });
});
pv.addEventListener("play", () => { pPlay.hidden = true; pv.setAttribute("controls", ""); });
/* video dijeda: tombol play bawaan HP disembunyikan, tombol emas muncul lagi */
pv.addEventListener("pause", () => {
  if (!player.classList.contains("buka") || pv.ended) return;
  pv.removeAttribute("controls");
  pPlay.hidden = false;
});
pv.addEventListener("ended", () => { pv.removeAttribute("controls"); pPlay.hidden = false; });

function bukaVideo(id) {
  const v = PETA[id];
  if (!v) return;
  sedang = v;
  pv.src = v.src;
  $("#pjudul").textContent = v.judul;
  player.classList.add("buka");
  /* catat di riwayat browser: tombol kembali HP = tutup video, bukan keluar situs */
  if (!(history.state && history.state.player)) history.pushState({ sp: halaman, player: 1 }, "");
  pv.muted = false;
  pPlay.hidden = false;
  pv.removeAttribute("controls");          // tombol play bawaan HP disembunyikan, pakai tombol emas
  const r = riwayat().filter(x => x !== id);
  r.unshift(id);
  simpan("sp_riwayat", r.slice(0, 50));
  $("#pfav").classList.toggle("on", favs().includes(v.id));
}

function tutupVideo(dariKembali) {
  if (!player.classList.contains("buka")) return;
  pv.pause();
  pv.removeAttribute("src");
  pv.load();
  player.classList.remove("buka");
  sedang = null;
  if (halaman === "aktivitas") renderAktivitas();
  if (dariKembali !== true && history.state && history.state.player) history.back();
}

function toggleFav(id) {
  const f = favs(), i = f.indexOf(id);
  if (i > -1) f.splice(i, 1); else f.unshift(id);
  simpan("sp_fav", f);
  $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle("on", i === -1));
  if (sedang && sedang.id === id) $("#pfav").classList.toggle("on", i === -1);
  toast(i === -1 ? "Ditambahkan ke favorit" : "Dihapus dari favorit");
  if (halaman === "aktivitas") renderAktivitas();
}

document.addEventListener("click", e => {
  const fb = e.target.closest("[data-fav]");
  if (fb) { e.stopPropagation(); toggleFav(fb.dataset.fav); return; }
  const k = e.target.closest("[data-id]");
  if (k) bukaVideo(k.dataset.id);
});
$("#ptutup").onclick = () => tutupVideo();
$("#pfav").onclick = () => sedang && toggleFav(sedang.id);
player.addEventListener("click", e => { if (e.target === player) tutupVideo(); });
pv.addEventListener("error", () => { if (sedang) toast("Video gagal diputar. Coba lagi sebentar."); });
document.addEventListener("keydown", e => { if (e.key === "Escape") tutupVideo(); });

/* ---------- NAVIGASI ---------- */
let halaman = "home";
function pindah(n, dariKembali) {
  if (player.classList.contains("buka")) tutupVideo(true);
  /* tombol kembali HP: dari halaman lain balik ke Home dulu, dari Home baru keluar situs */
  if (dariKembali !== true && n !== halaman) {
    const st = history.state || {};
    if (n === "home") {
      if (st.sp && st.sp !== "home") { history.back(); return; }
    } else if (halaman === "home") history.pushState({ sp: n }, "");
    else history.replaceState({ sp: n }, "");
  }
  halaman = n;
  $$(".page").forEach(p => p.classList.toggle("aktif", p.id === "page-" + n));
  $$(".bottom button").forEach(b => b.classList.toggle("on", b.dataset.page === n));
  if (n === "eksklusif") renderEksklusif();
  if (n === "aktivitas") renderAktivitas();
  if (n === "akun") renderAkun();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
history.replaceState({ sp: "home" }, "");
window.addEventListener("popstate", e => {
  const st = e.state || { sp: "home" };
  if (!st.player) tutupVideo(true);
  if ((st.sp || "home") !== halaman) pindah(st.sp || "home", true);
});
$$(".bottom button").forEach(b => b.onclick = () => {
  if (b.dataset.page === "home" && $("#cari").value) { $("#cari").value = ""; resetHal($("#grid-home")); renderHome(); }
  pindah(b.dataset.page);
});
/* ---------- HOME & CARI ---------- */
function renderHome() {
  $("#judul-home").textContent = "Video Terbaru";
  $("#jumlah").textContent = GRATIS.length + " video";
  $(".slider-area").hidden = false;
  renderGrid(GRATIS, $("#grid-home"), "Belum ada video. Nantikan video terbaru di sini.");
}

function cariVideo(q) {
  q = q.toLowerCase();
  const h = [...GRATIS, ...EKS].filter(v => v.judul.toLowerCase().includes(q));
  $("#judul-home").textContent = "Hasil pencarian";
  $("#jumlah").textContent = h.length + " video";
  $(".slider-area").hidden = true;
  renderGrid(h, $("#grid-home"), "Video tidak ditemukan.");
}

$("#cari").addEventListener("input", e => {
  if (halaman !== "home") pindah("home");
  resetHal($("#grid-home"));
  const q = e.target.value.trim();
  if (q) cariVideo(q); else renderHome();
});

/* ---------- EKSKLUSIF ---------- */
function renderEksklusif() {
  const el = $("#page-eksklusif");
  el.innerHTML = `<div class="sec-head" style="margin-top:6px"><h2>${IK.eks}Video Eksklusif</h2><span class="jml">${EKS.length} video</span></div>
    <div id="grid-eks" class="grid"></div>`;
  renderGrid(EKS, $("#grid-eks"), "Belum ada video eksklusif.");
}

/* ---------- AKTIVITAS ---------- */
function renderAktivitas() {
  const el = $("#page-aktivitas");
  const rw = riwayat().map(i => PETA[i]).filter(Boolean);
  const fv = favs().map(i => PETA[i]).filter(Boolean);
  el.innerHTML = `<div class="sec-head" style="margin-top:6px"><h2>${IK.jam}Terakhir Ditonton</h2><span class="jml">${rw.length}</span></div><div id="g-rw" class="grid"></div>
    <div class="sec-head"><h2>${IK.fav}Favorit</h2><span class="jml">${fv.length}</span></div><div id="g-fv" class="grid"></div>`;
  renderGrid(rw, $("#g-rw"), "Belum ada video yang ditonton.");
  renderGrid(fv, $("#g-fv"), "Belum ada favorit. Ketuk bintang di video untuk menyimpan.");
}

/* ---------- AKUN (belum diaktifkan: tombol tampil, tapi belum bisa dipakai) ---------- */
function renderAkun() {
  const el = $("#page-akun");
  el.innerHTML = `<div class="kartu auth nonaktif">
      <h3 class="tengah">Masuk ke Sinemo Plus</h3>
      <p class="muted tengah" style="margin-bottom:14px">Fitur akun segera hadir</p>
      <button class="btn ghost" data-segera>${IK.google}Lanjutkan dengan Google</button>
      <div class="atau">atau pakai email</div>
      <div class="tabs"><button class="on" data-segera>Masuk</button><button data-segera>Daftar</button></div>
      <input type="email" placeholder="Email" disabled>
      <input type="password" placeholder="Password" disabled>
      <button class="btn" data-segera>Masuk</button></div>
    <div class="menu">
      <button data-segera>${IK.chat}<span>Live Chat Admin</span><span class="segera">Segera</span></button>
      <button id="m-hapus">${IK.hapus}<span>Hapus Riwayat Tonton</span>${IK.panah}</button></div>`;
  $$("[data-segera]", el).forEach(b => b.onclick = () => toast("Fitur ini segera hadir"));
  $("#m-hapus").onclick = () => {
    if (!confirm("Hapus semua riwayat tontonan?")) return;
    simpan("sp_riwayat", []);
    toast("Riwayat dihapus");
  };
}

function simpanPosisi() {
  try { sessionStorage.setItem("sp_posisi", JSON.stringify({ hal: halaman, y: window.scrollY })); } catch (e) {}
}
window.addEventListener("pagehide", simpanPosisi);
document.addEventListener("visibilitychange", () => { if (document.hidden) simpanPosisi(); });
function balikPosisi() {
  let p = null;
  try { p = JSON.parse(sessionStorage.getItem("sp_posisi") || "null"); } catch (e) {}
  if (!p) return;
  if (p.hal && p.hal !== "home") pindah(p.hal);
  setTimeout(() => window.scrollTo({ top: p.y || 0, behavior: "instant" }), 400);
}

/* ---------- MULAI ---------- */
renderHome();
muatVideo().then(balikPosisi);
