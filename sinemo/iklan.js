(function () {
  const LINK_SMARTLINK = "https://uplcm.com/4/12287946";
  (function(s){s.dataset.zone='12287947',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));

  const hitungPlay = {};
  const bukaAsli = window.bukaVideo;
  if (typeof bukaAsli !== "function") return;

  window.bukaVideo = function (id) {
    const n = (hitungPlay[id] || 0) + 1;
    hitungPlay[id] = n;
    if (n === 1) {
      if (typeof toast === "function") toast("Ketuk play sekali lagi untuk menonton");
      return;
    }
    if (n === 2) window.open(LINK_SMARTLINK, "_blank", "noopener");
    bukaAsli(id);
  };
})();
