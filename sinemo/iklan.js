const SMARTLINK_HALAMAN_AWAL = "https://uplcm.com/4/12287946";
const POPUNDER_PLAY_1 = "12287947";
const SMARTLINK_PLAY_2 = "https://uplcm.com/4/12287946";

(function () {
  let popunderDimuat = false;
  let perluLanjut = false;
  let ulang = null;
  const sudahAwal = {};
  const sudahPlay2 = {};

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
    const id = sedang.id;
    if (!sudahPlay2[id]) {
      sudahPlay2[id] = true;
      perluLanjut = true;
      bukaLink(SMARTLINK_PLAY_2);
    }
  }, true);

  function lanjutkanVideo() {
    if (!perluLanjut || document.hidden) return;
    if (!player.classList.contains("buka") || !pv.getAttribute("src") || pv.ended) {
      perluLanjut = false;
      return;
    }
    if (!pv.paused) {
      perluLanjut = false;
      return;
    }
    pPlay.hidden = true;
    pv.setAttribute("controls", "");
    pv.play().then(() => {
      perluLanjut = false;
    }).catch(() => {
      pv.muted = true;
      pv.play().then(() => {
        perluLanjut = false;
      }).catch(() => {
        perluLanjut = false;
        pPlay.hidden = false;
      });
    });
  }

  function mulaiLanjut() {
    if (!perluLanjut) return;
    clearInterval(ulang);
    let n = 0;
    ulang = setInterval(() => {
      n++;
      if (!perluLanjut || n > 30) { clearInterval(ulang); return; }
      lanjutkanVideo();
    }, 300);
    lanjutkanVideo();
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) mulaiLanjut();
  });
  window.addEventListener("focus", mulaiLanjut);
  window.addEventListener("pageshow", mulaiLanjut);
  pv.addEventListener("pause", () => {
    if (perluLanjut && !document.hidden) lanjutkanVideo();
  });
  document.getElementById("ptutup").addEventListener("click", () => {
    perluLanjut = false;
    clearInterval(ulang);
  });
})();
