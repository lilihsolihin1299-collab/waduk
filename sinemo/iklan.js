const SMARTLINK_HALAMAN_AWAL = 'https://uplcm.com/4/12287946';
const POPUNDER_PLAY_1 = '12287947';
const SMARTLINK_PLAY_2 = 'https://uplcm.com/4/12287946';

function bukaLink(url) {
  if (url && url.trim()) window.open(url.trim(), '_blank', 'noopener');
}

function bukaSmartlink() {
  bukaLink(SMARTLINK_HALAMAN_AWAL);
}

(function muatPopunderDiHalamanVideo() {
  if (!document.body || !document.body.classList.contains('halaman-video')) return;
  if (!(POPUNDER_PLAY_1 && POPUNDER_PLAY_1.trim())) return;
  const s = document.createElement('script');
  s.src = 'https://al5sm.com/tag.min.js';
  s.async = true;
  s.dataset.zone = POPUNDER_PLAY_1.trim();
  document.body.appendChild(s);
})();

let jumlahPlay = 0;
function iklanPlay() {
  jumlahPlay++;
  const adaPopunder = !!(POPUNDER_PLAY_1 && POPUNDER_PLAY_1.trim());
  const adaSmartlink = !!(SMARTLINK_PLAY_2 && SMARTLINK_PLAY_2.trim());
  if (adaPopunder && jumlahPlay === 1) return false;
  if (adaSmartlink && jumlahPlay === (adaPopunder ? 2 : 1)) {
    setTimeout(() => bukaLink(SMARTLINK_PLAY_2), 0);
  }
  return true;
}
