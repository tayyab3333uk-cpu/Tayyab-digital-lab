/**
 * Preloader — progress reflects real asset loading:
 *   - hero frames (reported by hero-cinematic.js via 'hero:progress')
 *   - brand / project images (loaded here)
 * A long safety timeout only unlocks the page if the network stalls; the
 * hero keeps loading in the background and falls back to the nearest
 * loaded frame meanwhile.
 */
(function () {
  'use strict';

  var preloaderEl = document.getElementById('custom-preloader');
  var percentEl = document.getElementById('preloader-percent');
  var circleEl = document.getElementById('preloader-progress-circle');
  var statusEl = document.getElementById('preloader-status-text');
  if (!preloaderEl) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = 2 * Math.PI * 94;
  if (circleEl) {
    circleEl.style.strokeDasharray = String(C);
    circleEl.style.strokeDashoffset = String(C);
  }

  var brandAssets = [
    'assets/images/TF-logo-original.png',
    'assets/images/project-aura-live.png',
    'assets/images/project-gaming-live.png',
    'assets/images/project-civic-live.png'
  ];

  var heroLoaded = 0, heroTotal = 1, brandLoaded = 0;
  var finished = false, shown = 0;

  function ratio() {
    // Frames carry most of the weight; brand images the rest.
    return 0.85 * Math.min(1, heroLoaded / heroTotal) + 0.15 * (brandLoaded / brandAssets.length);
  }

  function paint(pct) {
    if (circleEl) circleEl.style.strokeDashoffset = String(C - (pct / 100) * C);
    if (percentEl) percentEl.textContent = String(Math.round(pct));
  }

  function tick() {
    if (finished) return;
    var target = ratio() * 100;
    shown += (target - shown) * 0.25;
    if (target - shown < 0.3) shown = target;
    paint(shown);
    if (statusEl) {
      statusEl.textContent = target < 40 ? 'LOADING SCENE FRAMES...'
        : target < 85 ? 'DECODING SEQUENCE...' : 'ALMOST READY...';
    }
    if (target >= 100 && shown >= 99.5) return finish();
    requestAnimationFrame(tick);
  }

  function finish() {
    if (finished) return;
    finished = true;
    paint(100);
    if (statusEl) statusEl.textContent = 'READY';
    setTimeout(function () {
      preloaderEl.classList.add('preloader-exit');
      document.body.classList.remove('loading-locked');
      document.body.classList.add('site-ready');
      window.dispatchEvent(new CustomEvent('portfolioReady'));
      setTimeout(function () { preloaderEl.style.display = 'none'; }, 700);
    }, reduceMotion ? 50 : 250);
  }

  window.addEventListener('hero:progress', function (e) {
    heroLoaded = e.detail.loaded;
    heroTotal = e.detail.total;
  });

  brandAssets.forEach(function (src) {
    var img = new Image();
    var done = function () { brandLoaded++; };
    img.onload = done;
    img.onerror = function () { console.warn('Asset failed to load:', src); done(); };
    img.src = src;
  });

  // Stalled-network escape hatch (not a fake progress timer).
  setTimeout(function () {
    if (!finished) {
      console.warn('Loading is slow; unlocking page while frames continue to load.');
      finish();
    }
  }, 20000);

  requestAnimationFrame(tick);
})();
