/**
 * TAYYAB FAISAL — ULTRA-PREMIUM PORTFOLIO
 * High-Quality Motion System
 * Handles 3D Card Tilt, Specular Glare, Desktop Cursor Glow Aura,
 * and Scroll-Triggered Staggered Section Reveals.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --------------------------------------------------------------------------
  // 1. Subtle Desktop Cursor Following Glow
  // --------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow && !isTouchDevice && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        cursorGlow.style.opacity = '1';
        isVisible = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      isVisible = false;
    });

    function renderGlow() {
      // Smooth lerp interpolation
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderGlow);
    }
    requestAnimationFrame(renderGlow);
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // --------------------------------------------------------------------------
  // 2. 3D Project Card & Glass Card Tilt with Specular Glare
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card, .project-card, .skill-category-card');

  if (!isTouchDevice && !prefersReducedMotion) {
    tiltCards.forEach((card) => {
      // Create glare overlay element if not present
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      const MAX_TILT = 7; // Subdued, refined tilt degrees (not cartoonish)

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - cardY) / centerY) * MAX_TILT;
        const rotateY = ((cardX - centerX) / centerX) * MAX_TILT;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        // Update glare position
        const glareX = (cardX / rect.width) * 100;
        const glareY = (cardY / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(56, 189, 248, 0.18) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 80%)`;
        glare.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        if (glare) {
          glare.style.opacity = '0';
          glare.style.transition = 'opacity 0.4s ease';
        }
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
        if (glare) glare.style.transition = 'none';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If reduced motion or no IntersectionObserver, reveal all immediately
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

})();
