/* ===== IKLAN SINEMA PLUS =====
   Setiap kotak video:
   - pencet ke-1 : smartlink terbuka + video jalan
   - pencet ke-2 dst : video langsung jalan
   Popunder Monetag baru dimuat setelah smartlink pertama terbuka,
   lalu keluarnya otomatis diatur Monetag.
   Mau matiin salah satu iklan? Kosongin jadi "" */
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
  /* kalau smartlink sudah pernah terbuka (halaman dimuat ulang), popunder langsung dimuat */
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
    bukaAsli(id);                                           // video dibuka dulu (tombol kembali tetap jalan)
    if (n === 1 && LINK_SMARTLINK) window.open(LINK_SMARTLINK, "_blank", "noopener");
    setTimeout(muatPopunder, 0);
  };
}
)();
