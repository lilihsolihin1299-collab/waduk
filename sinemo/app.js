/* ===== IKLAN SINEMO PLUS ===== */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://asiafilm.org/4/1b597d65e3fa566d005f9a1ec5e6d385";
  const SMARTLINK_SETIAP_DETIK = 60;      // iklan muncul tiap 60 detik menonton
  const LINK_POPUNDER = "https://abscloud.org/1/7dc0f51577c92b0e7166a7adf63b7a86";
  const POPUNDER_TUNDA_DETIK = 3;         // popunder dimuat 3 detik setelah sentuhan pertama

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

  setInterval(() => {
    if (!LINK_SMARTLINK || document.hidden || layar.style.display === "flex") return;
    const main = document.getElementById("pv");
    if (!main || main.paused || main.ended || main.readyState < 3) return;
    const n = bacaAngka() + 1;
    tulisAngka(n);
    if (n >= SMARTLINK_SETIAP_DETIK) tampilIklan();
  }, 1000);

  /* ---------- POPUNDER: SEKALI PER KUNJUNGAN ---------- */
  if (!LINK_POPUNDER) return;
  const mulai = () => {
    document.removeEventListener("pointerdown", mulai, true);
    setTimeout(() => {
      const s = document.createElement("script");
      s.src = LINK_POPUNDER;
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      document.body.appendChild(s);
    }, POPUNDER_TUNDA_DETIK * 1000);
  };
  document.addEventListener("pointerdown", mulai, true);
})();
