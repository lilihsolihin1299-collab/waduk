/* ===== SINEMA PLUS · HALAMAN VIDEO ===== */
/* kalau ada error, tampilkan di judul supaya gampang dicek */
window.addEventListener("error", e => { const j = document.getElementById("vJudul"); if (j && j.textContent === "Memuat video...") j.textContent = "Error: " + e.message; });
const API = "https://hidden-lab-7352.rayyanurfitri1299.workers.dev";   // harus sama dengan alamat Worker di app.js

const $ = s => document.querySelector(s);
const baca = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const simpan = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 2600);
}

const id = new URLSearchParams(location.search).get("id") || "";
const vVideo = $("#vVideo"), vTutup = $("#vTutup"), vSuara = $("#vSuara"), vFav = $("#vFav");

/* cari video dari daftar (pakai simpanan dulu biar cepat, lalu ambil terbaru dari Worker) */
function cari(j) {
  if (!j) return null;
  const n = id.slice(1);
  if (id[0] === "g") { const x = (j.gratis || []).find(v => String(v.id) === n); if (x) return { ...x, eks: false }; }
  if (id[0] === "e") { const x = (j.eksklusif || []).find(v => String(v.id) === n); if (x) return { ...x, eks: true }; }
  return null;
}
function tampil(v) {
  $("#vJudul").textContent = v.judul || (v.eks ? "Video Eksklusif" : "Video");
  $("#vLabel").textContent = v.eks ? "EKSKLUSIF" : "SINEMA PLUS";
  document.title = (v.judul || "Video") + " — Sinema Plus";
  if (v.thumb) vVideo.poster = v.thumb;
  if (vVideo.getAttribute("src") !== v.src) vVideo.src = v.src;
}
let ketemu = cari(baca("sp_video", null));
if (ketemu) tampil(ketemu);
fetch(API + "/api/video").then(r => r.json()).then(j => {
  simpan("sp_video", j);
  const v = cari(j);
  if (v) { ketemu = v; if (!vVideo.currentTime) tampil(v); }
  else if (!ketemu) { $("#vJudul").textContent = "Video tidak ditemukan"; $("#vTeks").textContent = "Video tidak ditemukan"; }
}).catch(() => { if (!ketemu) { $("#vJudul").textContent = "Video gagal dimuat"; $("#vTeks").textContent = "Cek internet lalu buka ulang"; } });

/* video tidak jalan sendiri: penonton pencet play */
vTutup.addEventListener("click", () => {
  if (!vVideo.getAttribute("src")) { toast("Video belum siap"); return; }
  vTutup.hidden = true;
  vVideo.setAttribute("controls", "");
  vVideo.muted = false;
  vVideo.play().catch(() => {
    vVideo.muted = true;
    vVideo.play().then(() => { vSuara.hidden = false; }).catch(() => { vTutup.hidden = false; vVideo.removeAttribute("controls"); });
  });
});
vSuara.addEventListener("click", () => { vVideo.muted = false; vSuara.hidden = true; vVideo.play().catch(() => {}); });
vVideo.addEventListener("volumechange", () => { if (!vVideo.muted) vSuara.hidden = true; });
vVideo.addEventListener("error", () => { if (vVideo.getAttribute("src")) toast("Video gagal diputar. Coba lagi sebentar."); });

/* favorit (sama dengan bintang di daftar video) */
const favs = () => baca("sp_fav", []);
vFav.classList.toggle("on", favs().includes(id));
vFav.addEventListener("click", () => {
  const f = favs(), i = f.indexOf(id);
  if (i > -1) f.splice(i, 1); else f.unshift(id);
  simpan("sp_fav", f);
  vFav.classList.toggle("on", i === -1);
  toast(i === -1 ? "Ditambahkan ke favorit" : "Dihapus dari favorit");
});

/* tombol kembali: balik ke daftar video */
$("#btnKembali").addEventListener("click", () => {
  let dariSini = false;
  try { dariSini = document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
  if (dariSini && history.length > 1) history.back(); else location.href = "./
    ";
});
