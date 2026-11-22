/* ===== IKLAN SINEMO PLUS ===== */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://uplcm.com/4/12287946";

  /* ---------- POPUNDER MONETAG (normal: Monetag sendiri yang atur kapan muncul) ---------- */
  (function(s){s.dataset.zone='12287947',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));

  /* ---------- SMARTLINK DI SETIAP TOMBOL PLAY ----------
     setiap kali video dipencet: video langsung jalan + smartlink terbuka */
  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  window.bukaVideo = function (id) {
    bukaAsli(id);                                   // video dibuka dulu (tombol kembali HP tetap berfungsi)
    window.open(LINK_SMARTLINK, "_blank", "noopener");
  };
})();
