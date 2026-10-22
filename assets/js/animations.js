/**
 * TAYYAB FAISAL — FULL-STACK DEVELOPER PORTFOLIO
 * GSAP & ScrollTrigger Animation Controller
 * Optimized for performance, high frame-rates, and reduced-motion accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if reduced-motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.info('Accessible reduced motion detected: GSAP animations bypassed.');
    return;
  }

  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP library not detected. Running standard display mode.');
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero Section Entrance Stagger
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

  heroTimeline
    .from('.hero-greeting', { opacity: 0, y: 25, delay: 0.2 })
    .from('.hero-title', { opacity: 0, y: 35 }, '-=0.6')
    .from('.hero-lead', { opacity: 0, y: 25 }, '-=0.6')
    .from('.hero-actions .btn', { opacity: 0, y: 20, stagger: 0.12 }, '-=0.5')
    .from('.hero-socials', { opacity: 0, y: 15 }, '-=0.5')
    .from('.terminal-window', { opacity: 0, scale: 0.94, duration: 1.1 }, '-=0.8');

  // 2. ScrollTrigger Section Fade-Ins
  if (typeof ScrollTrigger !== 'undefined') {
    const fadeSections = [
      { trigger: '#about', targets: '.about-card-left, .about-story' },
      { trigger: '#skills', targets: '.skill-category-card', stagger: 0.12 },
      { trigger: '#projects', targets: '.project-card', stagger: 0.15 },
      { trigger: '#experience', targets: '.timeline-item', stagger: 0.2 },
      { trigger: '#education', targets: '.edu-card', stagger: 0.15 },
      { trigger: '#resume', targets: '.resume-box' },
      { trigger: '#contact', targets: '.contact-channel-card, .contact-form-box', stagger: 0.1 }
    ];

    fadeSections.forEach(section => {
      const triggerEl = document.querySelector(section.trigger);
      if (triggerEl) {
        gsap.from(section.targets, {
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 35,
          duration: 0.8,
          ease: 'power2.out',
          stagger: section.stagger || 0
        });
      }
    });

    // 3. Education Progress Bar Animation
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      ScrollTrigger.create({
        trigger: '#education',
        start: 'top 75%',
        onEnter: () => {
          progressFill.classList.add('animated');
        }
      });
    }
  }

  // 4. Subtle Interactive 3D Card Hover Effect for Projects
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;

      gsap.to(card, {
        transformPerspective: 1000,
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
});
