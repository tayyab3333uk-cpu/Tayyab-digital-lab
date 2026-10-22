/**
 * TAYYAB FAISAL — PORTFOLIO
 * Scroll-driven canvas frame sequence.
 *
 * Scroll position maps directly to a frame index (no autoplay, no easing
 * that could drift), so scrolling down/up plays the same frames forward/back
 * and the frame holds when scrolling stops.
 *
 * Progress is measured against the tall #hero wrapper, not the sticky stage.
 * Frames load coarse-to-fine; the preloader listens to real load progress.
 */
(function () {
  'use strict';

  var TOTAL_FRAMES = 596; // 60 fps sequence (10 s)
  var wrapper = document.getElementById('hero');
  var canvas = document.getElementById('hero-canvas');
  var heroContent = document.getElementById('hero-main-content');
  var scrollCue = document.getElementById('hero-scroll-cue');
  var progressPill = document.getElementById('hero-progress-pill');
  if (!wrapper || !canvas) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

  // Phones/tablets use every 3rd frame (~20 fps of scrub resolution): a third of the download.
  var STEP = coarse ? 3 : 1;
  var indices = [];
  for (var i = 0; i < TOTAL_FRAMES; i += STEP) indices.push(i);
  if (indices[indices.length - 1] !== TOTAL_FRAMES - 1) indices.push(TOTAL_FRAMES - 1);
  var COUNT = indices.length;

  function path(frameIndex) {
    return 'assets/frames/frame_' + String(frameIndex + 1).padStart(4, '0') + '.webp';
  }

  var frames = new Array(COUNT);
  var loadedCount = 0;
  var essentialTotal = COUNT;
  var essentialDone = 0;
  var essentialSet = {};
  var failedCount = 0;
  var drawnSlot = -1;
  var rafPending = false;

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawnSlot = -1;
    }
  }

  function drawSlot(slot) {
    var img = frames[slot];
    if (!img) {
      for (var d = 1; d < COUNT; d++) {
        if (frames[slot - d]) { img = frames[slot - d]; break; }
        if (frames[slot + d]) { img = frames[slot + d]; break; }
      }
    }
    if (!img) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var scale = Math.max(cw / iw, ch / ih);
    var nw = iw * scale, nh = ih * scale;
    ctx.drawImage(img, (cw - nw) * 0.5, (ch - nh) * 0.4, nw, nh);
    drawnSlot = frames[slot] ? slot : -1; // keep retrying until the real frame arrives
  }

  function getProgress() {
    var top = wrapper.getBoundingClientRect().top;
    var distance = wrapper.offsetHeight - window.innerHeight;
    if (distance <= 0) return 0;
    return Math.min(1, Math.max(0, -top / distance));
  }

  function update() {
    rafPending = false;
    var p = reduceMotion ? 0 : getProgress();
    var slot = Math.round(p * (COUNT - 1));
    if (slot !== drawnSlot) drawSlot(slot);

    if (heroContent) {
      var t = Math.min(1, p / 0.3);
      heroContent.style.opacity = (1 - t).toFixed(3);
      heroContent.style.transform = 'translate3d(0,' + (-t * 40).toFixed(1) + 'px,0)';
      heroContent.style.pointerEvents = t > 0.85 ? 'none' : 'auto';
      wrapper.style.setProperty('--hero-scrim', (1 - t).toFixed(3));
    }
    if (scrollCue) scrollCue.style.opacity = (1 - Math.min(1, p / 0.06)).toFixed(2);
    if (progressPill) progressPill.textContent = 'SCENE PROGRESS: ' + Math.round(p * 100) + '%';
  }

  function requestUpdate() {
    if (!rafPending) { rafPending = true; requestAnimationFrame(update); }
  }

  function loadSlot(slot) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        var done = function () {
          frames[slot] = img;
          loadedCount++;
          if (essentialSet[slot]) essentialDone++;
          emit('hero:progress', { loaded: essentialDone, total: essentialTotal });
          requestUpdate();
          resolve();
        };
        if (img.decode) img.decode().then(done, done); else done();
      };
      img.onerror = function () {
        failedCount++;
        if (essentialSet[slot]) essentialDone++;
        console.warn('Hero frame failed to load:', img.src);
        emit('hero:progress', { loaded: essentialDone, total: essentialTotal });
        resolve();
      };
      img.src = path(indices[slot]);
    });
  }

  // First, last, then every 16th, 8th, 4th, 2nd, remainder.
  function loadOrder() {
    var seen = {}, order = [];
    function add(s) { if (s >= 0 && s < COUNT && !seen[s]) { seen[s] = 1; order.push(s); } }
    add(0); add(COUNT - 1);
    [16, 8, 4, 2, 1].forEach(function (stride) {
      for (var s = 0; s < COUNT; s += stride) add(s);
      if (stride === 8) {            // only the coarse set (first, last, every 8th) gates the preloader
        order.forEach(function (o) { essentialSet[o] = 1; });
        essentialTotal = order.length;
      }
    });
    return order;
  }

  function loadAll() {
    var order = loadOrder();
    var next = 0;
    return loadSlot(order[next++]).then(function () {
      sizeCanvas();
      requestUpdate();
      function worker() {
        if (next >= order.length) return Promise.resolve();
        return loadSlot(order[next++]).then(worker);
      }
      var workers = [];
      for (var w = 0; w < 8; w++) workers.push(worker());
      return Promise.all(workers);
    }).then(function () {
      emit('hero:ready', { loaded: loadedCount, failed: failedCount, total: COUNT });
      requestUpdate();
    });
  }

  var resizeTimer;
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { sizeCanvas(); requestUpdate(); }, 80);
  }, { passive: true });
  window.addEventListener('orientationchange', function () {
    setTimeout(function () { sizeCanvas(); requestUpdate(); }, 200);
  });

  window.__hero = {
    totalSlots: COUNT,
    get slot() { return drawnSlot; },
    get frameIndex() { return drawnSlot < 0 ? -1 : indices[drawnSlot]; },
    get loaded() { return loadedCount; },
    get failed() { return failedCount; }
  };

  sizeCanvas();
  loadAll();
})();
