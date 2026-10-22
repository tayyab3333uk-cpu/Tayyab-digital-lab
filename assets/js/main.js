/**
 * TAYYAB FAISAL — ULTRA-PREMIUM PORTFOLIO
 * Main Application Controller
 * Handles Theme Switching (Dark/Light), Floating Navbar, Scroll-Spy,
 * Mobile Drawer Navigation, and Utility Interactions.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Toggle & Persistence System (Dark / Light)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'tayyab_portfolio_theme';
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved;
    return 'dark'; // site's designed look; visitors can switch with the toggle
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'bi bi-moon-stars-fill';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Theme');
        themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
      } else {
        themeIcon.className = 'bi bi-sun-fill';
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Theme');
        themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
      }
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Floating Navbar Compact-on-Scroll & Gliding Indicator
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.main-navbar');
  const navLinks = document.querySelectorAll('.nav-links-desktop a');
  const navIndicator = document.getElementById('nav-active-indicator');
  const sections = document.querySelectorAll('section[id], header[id]');

  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Active section indicator pill positioning
  function positionIndicator(linkEl) {
    if (!navIndicator || !linkEl) return;
    const rect = linkEl.getBoundingClientRect();
    const parentRect = linkEl.parentElement.parentElement.getBoundingClientRect();
    navIndicator.style.width = `${rect.width}px`;
    navIndicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    navIndicator.style.opacity = '1';
  }

  // ScrollSpy via IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
            positionIndicator(link);
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  // Initialize indicator position
  window.addEventListener('load', () => {
    const activeLink = document.querySelector('.nav-links-desktop a.active');
    if (activeLink) positionIndicator(activeLink);
  });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-list a');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Dynamic Current Year
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
