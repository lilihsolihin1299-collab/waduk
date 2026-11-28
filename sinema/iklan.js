const SMARTLINK_HALAMAN_AWAL = "https://uplcm.com/4/12287946";
const POPUNDER_PLAY_1 = "12287947";
const SMARTLINK_PLAY_2 = "https://uplcm.com/4/12287946";
const JEDA_OVERLAY_DETIK = 100000000;

(function () {
  let popunderDimuat = false;
  let mauMain = false;
  let ulang = null;
  let tenang = 0;
  let waktuSembunyi = -10000;
  let hitung = false;
  let overlayJeda = false;
  let detikTonton = 0;
  let waktuTerakhir = 0;
  const sudahAwal = {};

  function bukaLink(url) {
    if (url && url.trim()) window.open(url.trim(), "_blank", "noopener");
  }

  function muatPopunder() {
    if (popunderDimuat || !POPUNDER_PLAY_1.trim()) return;
    popunderDimuat = true;
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;
    s.dataset.zone = POPUNDER_PLAY_1.trim();
    document.body.appendChild(s);
  }

  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  window.bukaVideo = function (id) {
    mauMain = false;
    hitung = false;
    overlayJeda = false;
    detikTonton = 0;
    bukaAsli(id);
    if (!sudahAwal[id]) {
      sudahAwal[id] = true;
      bukaLink(SMARTLINK_HALAMAN_AWAL);
    }
    muatPopunder();
  };

  document.addEventListener("click", function (e) {
    const tombol = e.target.closest(".p-play");
    if (!tombol || !sedang) return;
    mauMain = true;
    hitung = true;
    overlayJeda = false;
    detikTonton = 0;
    waktuTerakhir = pv.currentTime || 0;
    bukaLink(SMARTLINK_PLAY_2);
  }, true);

  function berhenti() {
    clearInterval(ulang);
    ulang = null;
  }

  function cek() {
    if (!mauMain || document.hidden || overlayJeda) return;
    if (!player.classList.contains("buka") || !pv.getAttribute("src") || pv.ended) {
      mauMain = false;
      berhenti();
      return;
    }
    pPlay.hidden = true;
    pv.setAttribute("controls", "");
    if (pv.paused) {
      tenang = 0;
      pv.play().catch(() => {
        pv.muted = true;
        pv.play().catch(() => {});
      });
    } else {
      tenang++;
      if (tenang >= 8) berhenti();
    }
  }

  function mulai() {
    if (!mauMain) return;
    berhenti();
    let n = 0;
    tenang = 0;
    ulang = setInterval(() => {
      n++;
      if (n > 40) {
        berhenti();
        if (mauMain && pv.paused) {
          pv.removeAttribute("controls");
          pPlay.hidden = false;
        }
        return;
      }
      cek();
    }, 250);
    cek();
  }

  function catatSembunyi() {
    waktuSembunyi = performance.now();
  }

  pv.addEventListener("play", () => { mauMain = true; });
  pv.addEventListener("ended", () => { mauMain = false; berhenti(); });
  pv.addEventListener("pause", () => {
    if (pv.ended) return;
    if (document.hidden || performance.now() - waktuSembunyi < 2000) return;
    mauMain = false;
  });

  pv.addEventListener("timeupdate", () => {
    if (!hitung || !mauMain || overlayJeda || document.hidden) return;
    if (!player.classList.contains("buka")) return;
    const t = pv.currentTime;
    const selisih = t - waktuTerakhir;
    waktuTerakhir = t;
    if (selisih > 0 && selisih < 2) detikTonton += selisih;
    if (detikTonton >= JEDA_OVERLAY_DETIK) {
      detikTonton = 0;
      overlayJeda = true;
      pPlay.hidden = false;
    }
  });

  new MutationObserver(() => {
    if (ulang && mauMain && !overlayJeda && !document.hidden && !pPlay.hidden) pPlay.hidden = true;
  }).observe(pPlay, { attributes: true, attributeFilter: ["hidden"] });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { catatSembunyi(); berhenti(); }
    else mulai();
  });
  window.addEventListener("pagehide", catatSembunyi);
  window.addEventListener("focus", mulai);
  window.addEventListener("pageshow", mulai);
  document.getElementById("ptutup").addEventListener("click", () => {
    mauMain = false;
    hitung = false;
    overlayJeda = false;
    berhenti(
      
    );
  });
})();
