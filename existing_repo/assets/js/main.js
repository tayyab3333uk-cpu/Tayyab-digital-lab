/**
 * TAYYAB FAISAL — FULL-STACK DEVELOPER PORTFOLIO
 * Main UI Logic, Interactive Terminal, Navigation, and Image Fallbacks
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Navbar Scroll Dynamics
  const navbar = document.querySelector('.main-navbar');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Drawer Controls
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');

  const openDrawer = () => {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. Active Navigation Link on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links-desktop a');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // 5. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 6. Interactive Developer Terminal Tabs
  const terminalTabBtns = document.querySelectorAll('.terminal-tab-btn');
  const terminalPanes = document.querySelectorAll('.terminal-code-pane');

  terminalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      terminalTabBtns.forEach(b => b.classList.remove('active'));
      terminalPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // 7. Interactive Terminal Copy Code Button
  const copyCodeBtn = document.getElementById('copy-terminal-code');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.terminal-code-pane.active');
      if (activePane) {
        const textToCopy = activePane.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = copyCodeBtn.innerHTML;
          copyCodeBtn.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copied!';
          setTimeout(() => {
            copyCodeBtn.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Clipboard copy failed:', err);
        });
      }
    });
  }

  // 8. Image Fallback Safety (Ensures no broken image icons if user hasn't copied photos yet)
  const userImages = document.querySelectorAll('img.user-avatar-img');
  userImages.forEach(img => {
    img.addEventListener('error', () => {
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.src = 'assets/images/placeholder-avatar.svg';
      }
    });
  });
});
