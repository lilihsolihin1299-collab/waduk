const CONFIG = {
  smartlinkUrl: "https://pimplehardnesscarnivorous.com/x7zgrhfuix?key=1b597d65e3fa566d005f9a1ec5e6d385",
  adCooldown: 15000
};

/* FILM DATA */
const films = [
  {
    title: "Film 1",
    video: "../videos/lower.mp4",
    description: "Deskripsi film 1"
  },
  {
    title: "Film 2",
    video: "../videos/lower1.mp4",
    description: "Deskripsi film 2"
  },
  {
    title: "Film 3",
    video: "../videos/lower3.mp4",
    description: "Deskripsi film 3"
  },
  {
    title: "Film 4",
    video: "../videos/lower4.mp4",
    description: "Deskripsi film 4"
  },
  {
    title: "Film 5",
    video: "../videos/lower5.mp4",
    description: "Deskripsi film 5"
  }
];

let currentFilmIndex = 0;
let lastAdTime = 0;
let clickCount = 0; // Penghitung klik untuk alur 1, 2, 3
let bookmarks = [];

let controlsTimer = null;
let centerPauseTimer = null;
let toastTimer = null;

const video = document.getElementById("videoPlayer");
const videoSource = document.getElementById("videoSource");

const playerWrap = document.getElementById("playerWrap");
const videoPlaceholder = document.getElementById("videoPlaceholder");
const bigPlayBtn = document.getElementById("bigPlayBtn");

const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");

const centerPause = document.getElementById("centerPause");

const muteBtn = document.getElementById("muteBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");

const fullscreenBtn = document.getElementById("fullscreenBtn");

const progressTrack = document.getElementById("progressTrack");
const progressFill = document.getElementById("progressFill");

const timeLabel = document.getElementById("timeLabel");

const filmNowPlaying = document.getElementById("filmNowPlaying");
const filmTitleHeading = document.getElementById("filmTitleHeading");
const filmDescription = document.getElementById("filmDescription");
const filmList = document.getElementById("filmList");

const nextBtn = document.getElementById("nextBtn");

const statusPill = document.getElementById("statusPill");
const adStatus = document.getElementById("adStatus");

const toast = document.getElementById("toast");

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function canTriggerAd() {
  const now = Date.now();
  return now - lastAdTime >= CONFIG.adCooldown;
}

function updateAdCooldown() {
  const now = Date.now();
  const elapsed = now - lastAdTime;
  const remaining = Math.max(0, CONFIG.adCooldown - elapsed);

  if (remaining <= 0) {
    statusPill.textContent = "Iklan siap";
    statusPill.classList.remove("visible");
    adStatus.textContent = "Tekan tombol play untuk memutar video.";
    return;
  }

  const seconds = Math.ceil(remaining / 1000);
  statusPill.textContent = `Cooldown ${seconds}s`;
  statusPill.classList.add("visible");
  adStatus.textContent = `Cooldown iklan ${seconds} detik aktif.`;
}

function triggerPopunder() {
  if (!canTriggerAd()) return;
  lastAdTime = Date.now();

  try {
    const openedWindow = window.open(CONFIG.popunderUrl, "_blank");
    if (openedWindow) {
      openedWindow.blur();
      window.focus();
    } else {
      window.location.assign(CONFIG.popunderUrl);
    }
  } catch (error) {
    console.error("Popunder gagal dibuka:", error);
  }
  updateAdCooldown();
}

function triggerSmartlink() {
  if (!canTriggerAd()) return;
  lastAdTime = Date.now();

  try {
    const openedWindow = window.open(
      CONFIG.smartlinkUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (!openedWindow) {
      window.location.assign(CONFIG.smartlinkUrl);
    }
  } catch (error) {
    console.error("Smartlink gagal dibuka:", error);
  }
  updateAdCooldown();
}

function handlePlaySequence() {
  clickCount++;

  if (clickCount === 1) {
    triggerPopunder();
    showToast("Klik sekali lagi untuk memutar video.");
  } else if (clickCount === 2) {
    triggerSmartlink();
    showToast("Klik sekali lagi untuk mulai memutar.");
  } else {
    // KLIK 3 & SETERUSNYA: PEMUTARAN VIDEO
    togglePlayPause();
  }
}

function togglePlayPause() {
  if (video.paused) {
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        console.warn("Playback gagal:", error);
        showToast("Video belum dapat diputar. Cek URL videonya.");
      });
    }
  } else {
    video.pause();
  }
}

function saveBookmarks() {
  try {
    localStorage.setItem("zeelflex_bookmarks", JSON.stringify(bookmarks));
  } catch (error) {
    console.warn("Bookmark tidak dapat disimpan:", error);
  }
}

function loadBookmarks() {
  try {
    const stored = localStorage.getItem("zeelflex_bookmarks");
    if (!stored) {
      bookmarks = [];
      return;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      bookmarks = parsed.filter(
        (index) => Number.isInteger(index) && index >= 0
      );
    } else {
      bookmarks = [];
    }
  } catch (error) {
    bookmarks = [];
    console.warn("Bookmark gagal dimuat:", error);
  }
}

function isBookmarked(index) {
  return bookmarks.includes(index);
}

function toggleBookmark(index) {
  if (!Number.isInteger(index) || index < 0 || index >= films.length) return;

  if (isBookmarked(index)) {
    bookmarks = bookmarks.filter((item) => item !== index);
    showToast(`${films[index].title} dihapus dari bookmark.`);
  } else {
    bookmarks.push(index);
    showToast(`${films[index].title} disimpan ke bookmark.`);
  }

  saveBookmarks();
  renderFilmButtons();
}

function bookmarkSVG() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 4.7A1.7 1.7 0 0 1 8.2 3h7.6a1.7 1.7 0 0 1 1.7 1.7v15.1c0 .9-1 1.4-1.7.9L12 18.1l-3.8 2.6c-.7.5-1.7 0-1.7-.9V4.7Z"></path>
    </svg>
  `;
}

function renderFilmButtons() {
  filmList.innerHTML = "";

  films.forEach((film, index) => {
    const row = document.createElement("div");
    row.className = "film-row";

    const filmButton = document.createElement("button");
    filmButton.type = "button";
    filmButton.className = "film-button";

    if (index === currentFilmIndex) {
      filmButton.classList.add("active");
    }

    filmButton.setAttribute("aria-label", `Putar ${film.title}`);
    filmButton.innerHTML = `
      <span>${escapeHTML(film.title)}</span>
      <span class="button-arrow">→</span>
    `;

    filmButton.addEventListener("click", () => {
      loadFilm(index);
    });

    const bookmarkButton = document.createElement("button");
    bookmarkButton.type = "button";
    bookmarkButton.className = "bookmark-btn";

    if (isBookmarked(index)) {
      bookmarkButton.classList.add("active");
    }

    bookmarkButton.setAttribute(
      "aria-label",
      isBookmarked(index)
        ? `Hapus ${film.title} dari bookmark`
        : `Simpan ${film.title} ke bookmark`
    );
    bookmarkButton.setAttribute("aria-pressed", String(isBookmarked(index)));
    bookmarkButton.innerHTML = bookmarkSVG();

    bookmarkButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleBookmark(index);
    });

    row.appendChild(filmButton);
    row.appendChild(bookmarkButton);
    filmList.appendChild(row);
  });
}

function updatePlayPauseIcon() {
  if (video.paused) {
    playPauseIcon.innerHTML = `
      <path d="M8 5.4v13.2c0 .8.9 1.3 1.6.9l10.2-6.6c.7-.5.7-1.4 0-1.8L9.6 4.5C8.9 4.1 8 4.6 8 5.4Z"></path>
    `;
    playPauseBtn.setAttribute("aria-label", "Putar video");
  } else {
    playPauseIcon.innerHTML = `
      <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z"></path>
    `;
    playPauseBtn.setAttribute("aria-label", "Pause video");
  }
}

function updateVolumeIcon() {
  if (video.muted || video.volume === 0) {
    volumeIcon.innerHTML = `
      <path d="M4 9v6h4l5 4V5L8 9H4Zm13.7 1.3L16.3 11.7l1.7 1.7-1.7 1.7 1.4 1.4 1.7-1.7 1.7 1.7 1.4-1.4-1.7-1.7 1.7-1.7-1.4-1.4-1.7 1.7-1.7-1.7-1.4 1.3Z"></path>
    `;
    muteBtn.setAttribute("aria-label", "Aktifkan suara");
  } else {
    volumeIcon.innerHTML = `
      <path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 1.1a1 1 0 0 0-1.4 1.4 2.1 2.1 0 0 1 0 3 1 1 0 0 0 1.4 1.4 4.1 4.1 0 0 0 0-5.8Zm2.2-2.2a1 1 0 0 0-1.4 1.4 5.2 5.2 0 0 1 0 7.4 1 1 0 1 0 1.4 1.4 7.2 7.2 0 0 0 0-10.2Z"></path>
    `;
    muteBtn.setAttribute("aria-label", "Matikan suara");
  }
}

function updatePlayerTime() {
  const current = video.currentTime || 0;
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const percentage = duration > 0 ? (current / duration) * 100 : 0;

  progressFill.style.width = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", String(Math.round(percentage)));
  timeLabel.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
}

function setVideoSource(url) {
  video.pause();
  videoSource.src = url;

  const isPlaceholder =
    !url || url === "YOUR_VIDEO_URL.mp4" || url.startsWith("VIDEO_URL_");

  if (isPlaceholder) {
    video.removeAttribute("poster");
  }
  video.load();
}

function loadFilm(index) {
  if (!Number.isInteger(index) || index < 0 || index >= films.length) return;

  currentFilmIndex = index;
  clickCount = 0; // RESET PENGHITUNG KLIK SETIAP GANTI FILM

  const film = films[index];

  playerWrap.classList.remove("player-changing");
  void playerWrap.offsetWidth;
  playerWrap.classList.add("player-changing");

  filmTitleHeading.textContent = film.title;
  filmDescription.textContent = film.description;
  filmNowPlaying.textContent = film.title;

  setVideoSource(film.video);

  video.currentTime = 0;
  progressFill.style.width = "0%";
  progressTrack.setAttribute("aria-valuenow", "0");

  videoPlaceholder.classList.remove("hidden");

  updatePlayPauseIcon();
  updateVolumeIcon();
  updatePlayerTime();
  renderFilmButtons();

  playerWrap.setAttribute("aria-label", `Video player untuk ${film.title}`);

  if (window.innerWidth < 700) {
    playerWrap.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  window.setTimeout(() => {
    playerWrap.classList.remove("player-changing");
  }, 450);
}

function nextFilm() {
  const nextIndex = (currentFilmIndex + 1) % films.length;
  loadFilm(nextIndex);
}

function showCenterPause() {
  clearTimeout(centerPauseTimer);
  if (video.paused) {
    centerPause.classList.remove("show");
    return;
  }
  centerPause.classList.add("show");
  centerPauseTimer = setTimeout(() => {
    centerPause.classList.remove("show");
  }, 850);
}

function toggleControls() {
  playerWrap.classList.add("controls-visible");
  clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => {
    if (!video.paused) {
      playerWrap.classList.remove("controls-visible");
    }
  }, 2800);
}

function seekVideo(clientX) {
  const rect = progressTrack.getBoundingClientRect();
  if (rect.width <= 0 || !Number.isFinite(video.duration)) return;

  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  video.currentTime = ratio * video.duration;
  updatePlayerTime();
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      if (playerWrap.requestFullscreen) {
        await playerWrap.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else {
        showToast("Fullscreen tidak didukung browser ini.");
      }
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.warn("Fullscreen gagal:", error);
  }
}

function initPlayer() {
  loadBookmarks();
  renderFilmButtons();
  loadFilm(0);

  video.volume = 1;
  video.muted = false;

  updateVolumeIcon();
  updatePlayPauseIcon();
  updatePlayerTime();
  updateAdCooldown();

  // ATUR PANGGILAN KETIKA TOMBOL PLAY DIPENCET
  video.addEventListener("click", () => {
    toggleControls();
    handlePlaySequence();
  });

  bigPlayBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    handlePlaySequence();
  });

  playPauseBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    handlePlaySequence();
  });

  centerPause.addEventListener("click", (event) => {
    event.stopPropagation();
    handlePlaySequence();
  });

  fullscreenBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFullscreen();
  });

  muteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) {
      video.volume = 0.7;
      volumeSlider.value = "0.7";
    }
    updateVolumeIcon();
  });

  volumeSlider.addEventListener("input", () => {
    video.volume = Number(volumeSlider.value);
    if (video.volume > 0) {
      video.muted = false;
    }
    updateVolumeIcon();
  });

  progressTrack.addEventListener("click", (event) => {
    event.stopPropagation();
    seekVideo(event.clientX);
  });

  progressTrack.addEventListener("keydown", (event) => {
    const duration = video.duration;
    if (!Number.isFinite(duration)) return;

    let targetTime = video.currentTime;
    if (event.key === "ArrowRight") {
      targetTime += 5;
    } else if (event.key === "ArrowLeft") {
      targetTime -= 5;
    } else {
      return;
    }

    event.preventDefault();
    video.currentTime = Math.min(duration, Math.max(0, targetTime));
    updatePlayerTime();
  });

  playerWrap.addEventListener("keydown", (event) => {
    if (event.target === volumeSlider || event.target === progressTrack) return;

    if (event.code === "Space") {
      event.preventDefault();
      handlePlaySequence();
    }

    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    }

    if (event.key.toLowerCase() === "m") {
      event.preventDefault();
      video.muted = !video.muted;
      updateVolumeIcon();
    }
  });

  playerWrap.addEventListener("mousemove", () => toggleControls());
  playerWrap.addEventListener("touchstart", () => toggleControls(), {
    passive: true
  });

  video.addEventListener("timeupdate", updatePlayerTime);
  video.addEventListener("loadedmetadata", updatePlayerTime);

  video.addEventListener("play", () => {
    videoPlaceholder.classList.add("hidden");
    updatePlayPauseIcon();
    centerPause.classList.remove("show");
    toggleControls();
  });

  video.addEventListener("pause", () => {
    updatePlayPauseIcon();
    videoPlaceholder.classList.remove("hidden");
    playerWrap.classList.add("controls-visible");
  });

  video.addEventListener("playing", () => {
    videoPlaceholder.classList.add("hidden");
    updatePlayPauseIcon();
  });

  video.addEventListener("ended", () => {
    updatePlayPauseIcon();
    videoPlaceholder.classList.remove("hidden");
    playerWrap.classList.add("controls-visible");
  });

  video.addEventListener("error", () => {
    videoPlaceholder.classList.remove("hidden");
    const currentUrl = films[currentFilmIndex].video;

    if (
      currentUrl === "VIDEO_URL_1" ||
      currentUrl === "VIDEO_URL_2" ||
      currentUrl === "VIDEO_URL_3" ||
      currentUrl === "VIDEO_URL_4" ||
      currentUrl === "VIDEO_URL_5" ||
      currentUrl === "YOUR_VIDEO_URL.mp4"
    ) {
      showToast("Ganti URL video pada array films terlebih dahulu.");
    } else {
      showToast("Video gagal dimuat. Periksa URL atau format videonya.");
    }
  });

  video.addEventListener("dblclick", () => toggleFullscreen());
  nextBtn.addEventListener("click", () => nextFilm());

  playerWrap.addEventListener("pointerdown", () => toggleControls());
  playerWrap.addEventListener("click", (event) => {
    if (event.target === playerWrap && !video.paused) {
      showCenterPause();
    }
  });

  document.addEventListener("visibilitychange", () => updateAdCooldown());
  setInterval(updateAdCooldown, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  initPlayer();
});
document.addEventListener("click", function openGlobalSmartlink() {
  if (canTriggerAd()) {
    triggerSmartlink();
    document.removeEventListener("click", openGlobalSmartlink);
  }
}, { once: true });
