const SMARTLINK_HALAMAN_AWAL = "https://uplcm.com/4/12287946";
const POPUNDER_PLAY_1 = "12287947";
const SMARTLINK_PLAY_2 = "https://uplcm.com/4/12287946";

function bukaLink(url) {
  if (url && url.trim()) window.open(url.trim(), "_blank", "noopener");
}

(function () {
  let popunderDimuat = false;
  function muatPopunder() {
    if (popunderDimuat || !(POPUNDER_PLAY_1 && POPUNDER_PLAY_1.trim())) return;
    popunderDimuat = true;
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;
    s.dataset.zone = POPUNDER_PLAY_1.trim();
    document.body.appendChild(s);
  }

  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  const sudahBuka = {};
  const jumlahPlay = {};
  let lanjutkan = false;

  function lanjutPutar() {
    if (!lanjutkan || document.hidden) return;
    if (!player.classList.contains("buka") || !pv.getAttribute("src")) { lanjutkan = false; return; }
    lanjutkan = false;
    pPlay.hidden = true;
    pv.setAttribute("controls", "");
    pv.play().catch(() => { pv.muted = true; pv.play().catch(() => { pPlay.hidden = false; }); });
  }
  document.addEventListener("visibilitychange", lanjutPutar);
  window.addEventListener("focus", lanjutPutar);

  window.bukaVideo = function (id) {
    if (!sudahBuka[id]) {
      sudahBuka[id] = true;
      bukaLink(SMARTLINK_HALAMAN_AWAL);
    }
    bukaAsli(id);
    muatPopunder();
  };

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".p-play") || !sedang) return;
    const id = sedang.id;
    jumlahPlay[id] = (jumlahPlay[id] || 0) + 1;
    const adaPopunder = !!(POPUNDER_PLAY_1 && POPUNDER_PLAY_1.trim());
    const adaSmartlink = !!(SMARTLINK_PLAY_2 && SMARTLINK_PLAY_2.trim());
    if (adaPopunder && jumlahPlay[id] === 1) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return;
    }
    if (adaSmartlink && jumlahPlay[id] === (adaPopunder ? 2 : 1)) {
      lanjutkan = true;
      bukaLink(SMARTLINK_PLAY_2);
    }
  }, true);
})();
