/* ===== IKLAN SINEMA PLUS =====
   Alur (sama seperti VIDHUB):
   1. Di daftar video: video dipencet -> smartlink terbuka di tab baru, lalu pindah ke video.html.
   2. Di video.html: popunder dimuat, keluar saat penonton pencet play.
      Halaman daftar video tidak pernah memuat popunder. */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://uplcm.com/4/12287946";
  const ZONA_POPUNDER = "12287947";

  /* ---------- HALAMAN VIDEO: muat popunder ---------- */
  if (document.body && document.body.classList.contains("halaman-video")) {
    if (!ZONA_POPUNDER) return;
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;
    s.dataset.zone = ZONA_POPUNDER;
    document.body.appendChild(s);
    return;
  }

  /* ---------- DAFTAR VIDEO: smartlink setiap video dipencet ---------- */
  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;
  window.bukaVideo = function (id) {
    if (LINK_SMARTLINK) window.open(LINK_SMARTLINK, "_blank", "noopener");
    bukaAsli(id);
  };
})();
