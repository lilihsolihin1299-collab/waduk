/* ===== IKLAN SINEMO PLUS ===== */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://uplcm.com/4/11563571";
  const SMARTLINK_SETIAP_DETIK = 60;      // smartlink muncul tiap 60 detik menonton
  const POPUNDER1_TUNDA_DETIK = 3;        // popunder 1 dimuat 3 detik setelah sentuhan pertama
  const POPUNDER2_SETELAH_DETIK = 120;    // popunder 2 dimuat setelah nonton 2 menit (sekali per kunjungan)

  const KUNCI = "sp_iklan_detik";
  const bacaAngka = () => { try { return Number(localStorage.getItem(KUNCI)) || 0; } catch (e) { return 0; } };
  const tulisAngka = n => { try { localStorage.setItem(KUNCI, String(n)); } catch (e) {} };

  /* ---------- SMARTLINK: SETIAP 1 MENIT MENONTON ---------- */
  const layar = document.createElement("div");
  layar.style.cssText = "position:fixed;inset:0;z-index:150;display:none;align-items:center;justify-content:center;" +
    "padding:24px;background:rgba(0,8,6,.85);font-family:inherit";
  layar.innerHTML =
    '<div style="width:100%;max-width:340px;background:#03382b;border:1px solid #00ff9c;box-shadow:0 0 24px rgba(0,255,156,.25);' +
    'border-radius:22px;padding:24px 18px;text-align:center;color:#ecfdf5">' +
    '<div style="width:56px;height:56px;margin:0 auto;border-radius:16px;display:grid;place-items:center;' +
    'background:linear-gradient(135deg,#00ff9c,#00e0ff);box-shadow:0 0 18px rgba(0,255,156,.5)">' +
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#012a1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z" fill="#012a1c"/></svg></div>' +
    '<div style="font-weight:800;font-size:17px;margin-top:14px">Iklan sebentar</div>' +
    '<div style="font-size:13px;color:#9fe8c8;margin-top:6px;line-height:1.5">' +
    "Iklan membantu Sinemo Plus tetap gratis. Ketuk tombol di bawah, lalu kembali ke sini untuk lanjut nonton.</div>" +
    '<button id="ikl-lanjut" style="display:block;width:100%;margin-top:16px;padding:13px;border:0;border-radius:999px;' +
    'font:inherit;font-weight:800;font-size:15px;background:linear-gradient(90deg,#00ff9c,#00e0ff);color:#012a1c">' +
    "Buka iklan &amp; lanjut nonton</button></div>";
  document.body.appendChild(layar);

  let diputarSebelum = [];
  function tampilIklan() {
    diputarSebelum = Array.from(document.querySelectorAll("video")).filter(v => !v.paused);
    diputarSebelum.forEach(v => v.pause());
    layar.style.display = "flex";
  }
  layar.querySelector("#ikl-lanjut").onclick = () => {
    window.open(LINK_SMARTLINK, "_blank", "noopener");
    layar.style.display = "none";
    tulisAngka(0);
    diputarSebelum.forEach(v => { if (v.isConnected && v.getAttribute("src")) v.play().catch(() => {}); });
    diputarSebelum = [];
  };

  /* ---------- POPUNDER 1 (kode pertama) ---------- */
  function muatPopunder1() {
    /*<![CDATA[/* */
    (function(){var u=window,g="eb1865e0a179a8c47a23fb53dfa7c629",o=[["siteId",427*180-831+820+5249975],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],b=["d3d3LmRpc3BsYXl2ZXJ0aXNpbmcuY29tL2x2aXouY3Nz","ZDNtem9rdHk5NTFjNXcuY2xvdWRmcm9udC5uZXQvUGN0ZEsvaWNvbnRlbnQtdG9vbHMubWluLmpz"],m=-1,a,r,n=function(){clearTimeout(r);m++;if(b[m]&&!(1820872666000<(new Date).getTime()&&1<m)){a=u.document.createElement("script");a.type="text/javascript";a.async=!0;var e=u.document.getElementsByTagName("script")[0];a.src="https://"+atob(b[m]);a.crossOrigin="anonymous";a.onerror=n;a.onload=function(){clearTimeout(r);u[g.slice(0,16)+g.slice(0,16)]||n()};r=setTimeout(n,5E3);e.parentNode.insertBefore(a,e)}};if(!u[g]){try{Object.freeze(u[g]=o)}catch(e){}n()}})();
    /*]]>/* */
  }

  /* ---------- POPUNDER 2 (kode kedua) ---------- */
  let popunder2Dimuat = false;
  function muatPopunder2() {
    if (popunder2Dimuat) return;
    popunder2Dimuat = true;
    (function(s){s.dataset.zone='11563270',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
  }

  /* hitung detik menonton */
  let detikNonton = 0;
  setInterval(() => {
    if (document.hidden || layar.style.display === "flex") return;
    const main = document.getElementById("pv");
    if (!main || main.paused || main.ended || main.readyState < 3) return;
    detikNonton++;
    if (detikNonton >= POPUNDER2_SETELAH_DETIK) muatPopunder2();
    const n = bacaAngka() + 1;
    tulisAngka(n);
    if (n >= SMARTLINK_SETIAP_DETIK) tampilIklan();
  }, 1000);

  /* popunder 1 dimuat setelah sentuhan pertama, sekali per kunjungan */
  const mulai = () => {
    document.removeEventListener("pointerdown", mulai, true);
    setTimeout(muatPopunder1, POPUNDER1_TUNDA_DETIK * 1000);
  };
  document.addEventListener("pointerdown", mulai, true);
})();
