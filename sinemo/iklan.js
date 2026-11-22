/* ===== IKLAN SINEMA PLUS =====
   1. Daftar video: video dipencet -> smartlink, lalu pindah ke video.html.
   2. video.html: play 1 -> popunder, play 2 -> smartlink + video jalan.
   Mau matiin salah satu iklan? Kosongin jadi "" */
const SMARTLINK_HALAMAN_AWAL = "https://uplcm.com/4/12287946";
const POPUNDER_PLAY_1 = "12287947";
const SMARTLINK_PLAY_2 = "https://uplcm.com/4/12287946";

(function () {
  const ada = s => !!(s && String(s).trim());
  const bukaLink = url => { if (ada(url)) window.open(String(url).trim(), "_blank", "noopener"); };

  /* ---------- HALAMAN VIDEO ---------- */
  if (document.body && document.body.classList.contains("halaman-video")) {
    if (ada(POPUNDER_PLAY_1)) {
      const s = document.createElement("script");
      s.src = "https://al5sm.com/tag.min.js";
      s.async = true;
      s.dataset.zone = String(POPUNDER_PLAY_1).trim();
      document.body.appendChild(s);
    }
    let jumlahPlay = 0;
    window.iklanPlay = function () {
      jumlahPlay++;
      if (ada(POPUNDER_PLAY_1) && jumlahPlay === 1) return false;
      if (ada(SMARTLINK_PLAY_2) && jumlahPlay === (ada(POPUNDER_PLAY_1) ? 2 : 1)) {
        setTimeout(() => bukaLink(SMARTLINK_PLAY_2), 0);
      }
      return true;
    };
    return;
  }

  /* ---------- DAFTAR VIDEO ---------- */
  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;
  window.bukaVideo = function (id) {
    bukaLink(SMARTLINK_HALAMAN_AWAL);
    bukaAsli(id);
  };
})
   ();
