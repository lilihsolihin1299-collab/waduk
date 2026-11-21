const LINK_SMARTLINK = 'https://uplcm.com/4/12287945';
const ZONA_POPUNDER = '12287942';

function bukaSmartlink() {
  if (LINK_SMARTLINK) window.open(LINK_SMARTLINK, '_blank', 'noopener');
}

(function muatPopunderDiHalamanVideo() {
  if (!document.body || !document.body.classList.contains('halaman-video')) return;
  if (!ZONA_POPUNDER) return;
  const s = document.createElement('script');
  s.src = 'https://al5sm.com/tag.min.js';
  s.async = true;
  s.dataset.zone = ZONA_POPUNDER;
  document.body.appendChild(s);
})();
