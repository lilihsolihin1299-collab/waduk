/* ===== IKLAN SINEMA PLUS =====
   1. Popunder Monetag: dimuat sejak situs dibuka, keluarnya diatur Monetag.
   2. Smartlink: terbuka setiap video dipencet, video langsung jalan.
   Mau matiin salah satu? Kosongin jadi "" */
const LINK_SMARTLINK = "https://uplcm.com/4/12287946";
const ZONA_POPUNDER = "12287947";

(function () {
  if (ZONA_POPUNDER) {
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;
    s.dataset.zone = ZONA_POPUNDER;
    document.body.appendChild(s);
  }

  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;
  window.bukaVideo = function (id) {
    bukaAsli(id);
    if (LINK_SMARTLINK) window.open(LINK_SMARTLINK, "_blank", "noopener");
  };
})(
   
);
