/* ===== IKLAN SINEMO PLUS ===== */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://uplcm.com/4/12287946";

  /* ---------- POPUNDER MONETAG (siap sejak situs dibuka, muncul saat layar diketuk) ---------- */
  (function(s){s.dataset.zone='12287947',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));

  /* ---------- ALUR TOMBOL PLAY (berlaku untuk setiap video) ----------
     play ke-1 : popunder muncul, video belum jalan (tanpa tulisan apa pun)
     play ke-2 : smartlink terbuka + video langsung jalan
     play berikutnya di video yang sama : video langsung jalan
     buka ulang situs = urutan mulai dari awal lagi */
  const hitungPlay = {};
  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  window.bukaVideo = function (id) {
    const n = (hitungPlay[id] || 0) + 1;
    hitungPlay[id] = n;
    if (n === 1) return;
    if (n === 2) window.open(LINK_SMARTLINK, "_blank", "noopener");
    bukaAsli(id);
  };
})();
