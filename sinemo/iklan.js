const LINK_SMARTLINK = "https://uplcm.com/4/12287946";
const ZONA_POPUNDER = "12287947";

(function () {
  let popunderDimuat = false;
  function muatPopunder() {
    if (popunderDimuat || !ZONA_POPUNDER) return;
    popunderDimuat = true;
    try { sessionStorage.setItem("sp_popunder", "1"); } catch (e) {}
    const s = document.createElement("script");
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;
    s.dataset.zone = ZONA_POPUNDER;
    document.body.appendChild(s);
  }
  try { if (sessionStorage.getItem("sp_popunder")) muatPopunder(); } catch (e) {}

  let hitung = {};
  try { hitung = JSON.parse(sessionStorage.getItem("sp_hitung_play") || "{}"); } catch (e) {}
  const simpanHitung = () => { try { sessionStorage.setItem("sp_hitung_play", JSON.stringify(hitung)); } catch (e) {} };

  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  window.bukaVideo = function (id) {
    const n = (hitung[id] || 0) + 1;
    hitung[id] = n;
    simpanHitung();
    bukaAsli(id);
    if (n <= 2 && LINK_SMARTLINK) window.open(LINK_SMARTLINK, "_blank", "noopener");
    setTimeout(muatPopunder, 0);
  };
}
)();
