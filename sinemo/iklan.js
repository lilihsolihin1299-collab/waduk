/* ===== IKLAN SINEMA PLUS =====
   Alur (sama seperti VIDHUB):
   1. Kotak video dipencet -> video dibuka + smartlink terbuka di tab baru.
   2. Popunder Monetag baru dimuat saat video pertama kali dibuka (tidak di daftar video). */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://uplcm.com/4/12287946";
  const ZONA_POPUNDER = "12287947";

  /* ---------- POPUNDER MONETAG (dimuat sekali, saat video dibuka) ---------- */
  function muatPopunder() {
    if (document.querySelector('script[data-sinema-popunder="1"]')) return;
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;
    s.dataset.zone = ZONA_POPUNDER;
    s.dataset.sinemaPopunder = "1";
    (document.body || document.head).appendChild(s);
  }

  /* ---------- SMARTLINK DI SETIAP TOMBOL PLAY ---------- */
  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  window.bukaVideo = function (id) {
    bukaAsli(id);                                   // video dibuka dulu (tombol kembali HP tetap berfungsi)
    window.open(LINK_SMARTLINK, "_blank", "noopener");
    muatPopunder();
  };
})
  ();
