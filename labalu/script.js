/* =========================================================
   PENGATURAN — CUKUP UBAH BAGIAN INI SAJA
   Link yang dikosongkan ("") otomatis pakai smartlinkUtama.
   ========================================================= */
const PENGATURAN = {
  smartlinkUtama: "https://SMARTLINK-UTAMA",

  logo:      "https://SMARTLINK-LOGO-DRAMAKU",
  aplikasi:  "https://LINK-APLIKASI-DRAMA",
  telegram:  "https://t.me/NAMA_SALURAN",

  // Smartlink tombol PLAY, urut: tekan ke-1, tekan ke-2, dst.
  // Boleh ditambah / dikurangi. Setelah semua terbuka dan
  // penonton kembali, video langsung diputar tanpa tekan play lagi.
  playLinks: [
    "https://SMARTLINK-PLAY-1",
    "https://SMARTLINK-PLAY-2"
  ],

  // false = buka di tab yang sama (penonton tekan Kembali → video jalan)
  // true  = buka di tab baru (penonton balik ke tab ini → video jalan)
  bukaTabBaru: false,

  episode: [
    {
      judul: "Judul Drama Episode 1",
      deskripsi: "Deskripsi singkat episode 1",
      label: "TRENDING #1",
      durasi: "02:15",
      video: "https://LINK-VIDEO-1.mp4",
      poster: "",                       // gambar sampul (boleh kosong)
      smartlink: "https://SMARTLINK-EPISODE-1"
    },
    {
      judul: "Judul Drama Episode 2",
      deskripsi: "Deskripsi singkat episode 2",
      label: "BARU RILIS",
      durasi: "01:48",
      video: "https://LINK-VIDEO-2.mp4",
      poster: "",
      smartlink: "https://SMARTLINK-EPISODE-2"
    },
    {
      judul: "Judul Drama Episode 3",
      deskripsi: "Deskripsi singkat episode 3",
      label: "PALING DITONTON",
      durasi: "02:30",
      video: "https://LINK-VIDEO-3.mp4",
      poster: "",
      smartlink: "https://SMARTLINK-EPISODE-3"
    }
  ]
};
/* ================= AKHIR PENGATURAN ================= */
(function () {
  const P = PENGATURAN;
  const $ = (id) => document.getElementById(id);
  const layar = document.querySelector(".layar");
  const video = $("video");
  const tombolPlay = $("tombolPlay");
  const tombolSuara = $("tombolSuara");
  const tombolEp = document.querySelectorAll(".ep");

  // penyimpanan aman (tidak error di mode samaran)
  const simpan = {
    ambil(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    taruh(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    hapus(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };

  const link = (u) => (u && u.trim()) ? u.trim() : P.smartlinkUtama;

  function buka(url) {
    if (!url) return;
    if (P.bukaTabBaru) {
      const w = window.open(url, "_blank");
      if (!w) location.href = url; // kalau diblokir, buka di tab ini
    } else {
      location.href = url;
    }
  }

  // ---------- tombol link biasa ----------
  function pasangLink(id, url) {
    const el = $(id);
    el.href = link(url);
    if (P.bukaTabBaru) { el.target = "_blank"; el.rel = "noopener"; }
  }
  pasangLink("linkLogo", P.logo);
  pasangLink("linkAplikasi", P.aplikasi);
  pasangLink("linkTelegram", P.telegram);

  // ---------- episode ----------
  let ep = Number(simpan.ambil("dramaku_ep")) || 0;
  if (!P.episode[ep]) ep = 0;

  function tampilkanEpisode(i) {
    const d = P.episode[i];
    ep = i;
    simpan.taruh("dramaku_ep", i);
    $("judul").textContent = d.judul;
    $("deskripsi").textContent = d.deskripsi;
    $("label").textContent = d.label;
    $("durasi").textContent = d.durasi;
    document.title = d.judul;

    hentikanVideo();
    if (d.poster) {
      layar.style.backgroundImage = "url('" + d.poster + "')";
      layar.classList.add("ada-poster");
      video.poster = d.poster;
    } else {
      layar.style.backgroundImage = "";
      layar.classList.remove("ada-poster");
      video.removeAttribute("poster");
    }
    tombolEp.forEach((b, k) => b.classList.toggle("aktif", k === i));
  }

  tombolEp.forEach((b, k) => {
    b.addEventListener("click", () => {
      tampilkanEpisode(k);
      buka(link(P.episode[k].smartlink));
    });
  });
    // ---------- video ----------
  function hentikanVideo() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.controls = false;
    layar.classList.remove("main");
    tombolSuara.hidden = true;
  }

  function putarVideo() {
    const d = P.episode[ep];
    if (video.getAttribute("src") !== d.video) video.src = d.video;
    layar.classList.add("main");
    video.controls = true;
    video.muted = false;
    video.play().catch(() => {
      // browser menolak suara tanpa sentuhan → putar tanpa suara dulu
      video.muted = true;
      tombolSuara.hidden = false;
      video.play().catch(() => {
        layar.classList.remove("main");
        video.controls = false;
      });
    });
  }

  tombolSuara.addEventListener("click", () => {
    video.muted = false;
    tombolSuara.hidden = true;
    video.play().catch(() => {});
  });

  // tombol PLAY: smartlink ke-1, ke-2, ... lalu video
  tombolPlay.addEventListener("click", () => {
    const kunci = "dramaku_play_" + ep;
    const langkah = Number(simpan.ambil(kunci)) || 0;
    const daftar = P.playLinks.filter((u) => u && u.trim());

    if (langkah < daftar.length) {
      simpan.taruh(kunci, langkah + 1);
      if (langkah + 1 >= daftar.length) simpan.taruh("dramaku_putar", ep);
      buka(daftar[langkah]);
      return;
    }
    putarVideo();
  });

  // saat penonton kembali ke halaman → langsung putar
  function cekKembali() {
    const tunggu = simpan.ambil("dramaku_putar");
    if (tunggu !== null && Number(tunggu) === ep) {
      simpan.hapus("dramaku_putar");
      putarVideo();
    }
  }
  window.addEventListener("pageshow", cekKembali);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") cekKembali();
  });

  // ---------- suka & bagikan ----------
  $("tombolSuka").addEventListener("click", (e) => e.currentTarget.classList.toggle("aktif"));
  $("tombolBagikan").addEventListener("click", () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) navigator.share(data).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(() => alert("Link disalin"));
  });

  // ---------- hemat baterai: animasi berhenti saat tidak terlihat ----------
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((list) => {
      list.forEach((x) => x.target.classList.toggle("diam", !x.isIntersecting));
    });
    document.querySelectorAll(".bingkai, .atas, .tombol-bawah").forEach((el) => io.observe(el));
  }

  tampilkanEpisode(ep);
  cekKembali();
})();
