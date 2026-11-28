const SMARTLINK_PLAY_1 = "https://uplcm.com/4/12287946";
const SMARTLINK_PLAY_2 = "https://uplcm.com/4/12287946";
const POPUNDER_ZONE = "12287947";

(function () {
  "use strict";

  let popunderDimuat = false;
  const smartlinkSudahDibuka = {
    play1: false,
    play2: false
  };
  function muatPopunder() {
    if (popunderDimuat || !POPUNDER_ZONE) return;

    popunderDimuat = true;

    const script = document.createElement("script");
    script.src = "https://al5sm.com/tag.min.js";
    script.async = true;
    script.dataset.zone = POPUNDER_ZONE;

    script.onerror = function () {
      popunderDimuat = false;
    };

    document.body.appendChild(script);
  }
  document.addEventListener("click", function (e) {
    const link = e.target.closest("[data-smartlink]");
    if (!link) return;

    const jenis = link.dataset.smartlink;

    if (jenis !== "play1" && jenis !== "play2") return;

    if (smartlinkSudahDibuka[jenis]) {
      e.preventDefault();
      return;
    }

    smartlinkSudahDibuka[jenis] = true;

    const url = jenis === "play1"
      ? SMARTLINK_PLAY_1
      : SMARTLINK_PLAY_2;

    link.href = url;
  });
  document.addEventListener("click", function (e) {
    const tombol = e.target.closest(".p-play");

    if (!tombol) return;

    muatPopunder();
  }, true);
  window.addEventListener("pagehide", function () {
  });

})();
