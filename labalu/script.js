const PENGATURAN = {
  smartlinkUtama: "https://uplcm.com/4/11563571",

  logo:      "https://uplcm.com/4/11563571",
  aplikasi:  "https://vjjdeyyrulina.com",
  telegram:  "https://t.me/spesialedition",

  smartlinkPlay: "https://uplcm.com/4/11563571",
  jumlahKlikPlay: 1,

  bukaTabBaru: false,

  episode: [
    {
      judul: "PERISAI PANTANG MENYERAH",
      deskripsi: "Deskripsi singkat episode 1",
      label: "TRENDING #1",
      durasi: "02:15",
      video: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/ssstik.io_1793026933527.mp4",
      poster: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/perisai_600x840.jpg",
      smartlink: "https://uplcm.com/4/11563571"
    },
    {
      judul: "TABIB AJAIB",
      deskripsi: "Deskripsi singkat episode 2",
      label: "BARU RILIS",
      durasi: "01:48",
      video: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/ssstik.io_1793026993304.mp4",
      poster: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/tabib_ajaib_600x840.jpg",
      smartlink: "https://uplcm.com/4/11563571"
    },
    {
      judul: "TERLAHIR UNTUK MENGUASAI",
      deskripsi: "Deskripsi singkat episode 3",
      label: "PALING DITONTON",
      durasi: "02:30",
      video: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/ssstik.io_1793029459677.mp4",
      poster: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/poster_600x840.jpg",
      smartlink: "https://uplcm.com/4/11563571"
    }
  ]
};
 (function () {
  const P = PENGATURAN;
  const $ = (id) => document.getElementById(id);
  const layar = document.querySelector(".layar");
  const video = $("video");
  const tombolPlay = $("tombolPlay");
  const tombolSuara = $("tombolSuara");
  const tombolEp = document.querySelectorAll(".ep");

  // tanda di alamat halaman (#ep-1 / #putar-1), tanpa penyimpanan browser
  function bacaHash() {
    const m = location.hash.match(/^#(ep|putar)-(\d+)$/);
    return m ? { jenis: m[1], ep: Number(m[2]) } : null;
  }
  function tulisHash(h) {
    try { history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); } catch (e) {}
  }

  // hitungan klik play per episode (hilang saat refresh)
  const klik = {};

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
  const awal = bacaHash();
  let ep = (awal && P.episode[awal.ep]) ? awal.ep : 0;

  function tampilkanEpisode(i) {
    const d = P.episode[i];
    ep = i;
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
      tulisHash("ep-" + k);
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

  // tombol PLAY: buka smartlink sebanyak jumlahKlikPlay, lalu video
  tombolPlay.addEventListener("click", () => {
    const sudah = klik[ep] || 0;
    const target = Math.max(0, Number(P.jumlahKlikPlay) || 0);

    if (sudah < target) {
      klik[ep] = sudah + 1;
      if (sudah + 1 >= target) tulisHash("putar-" + ep);
      buka(link(P.smartlinkPlay));
      return;
    }
    putarVideo();
  });

  // saat penonton kembali ke halaman → langsung putar
  function cekKembali() {
    const h = bacaHash();
    if (h && h.jenis === "putar" && h.ep === ep) {
      tulisHash("ep-" + ep);
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
