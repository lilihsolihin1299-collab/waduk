const SMARTLINK_HALAMAN_AWAL = "https://uplcm.com/4/12287946";
const POPUNDER_PLAY_1 = "12287947";
const SMARTLINK_PLAY_2 = "https://uplcm.com/4/12287946";

(function () {
  let popunderDimuat = false;
  let perluLanjut = false;
  let ulang = null;
  let tenang = 0;
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

  function berhenti() {
    perluLanjut = false;
    clearInterval(ulang);
  }

  function cek() {
    if (!perluLanjut || document.hidden) return;
    if (!player.classList.contains("buka") || !pv.getAttribute("src") || pv.ended) {
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
    if (!perluLanjut) return;
    clearInterval(ulang);
    let n = 0;
    tenang = 0;
    ulang = setInterval(() => {
      n++;
      if (!perluLanjut) { clearInterval(ulang); return; }
      if (n > 40) {
        berhenti();
        if (pv.paused) {
          pv.removeAttribute("controls");
          pPlay.hidden = false;
        }
        return;
      }
      cek();
    }, 250);
    cek();
  }

  new MutationObserver(() => {
    if (perluLanjut && !document.hidden && !pPlay.hidden) pPlay.hidden = true;
  }).observe(pPlay, { attributes: true, attributeFilter: ["hidden"] });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(ulang);
    else mulai();
  });
  window.addEventListener("focus", mulai);
  window.addEventListener("pageshow", mulai);
  pv.addEventListener("pause", () => {
    if (perluLanjut && !document.hidden) cek();
  });
  document.getElementById("ptutup").addEventListener("click", berhenti);
})();
