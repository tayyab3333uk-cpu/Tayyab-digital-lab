/**
 * TAYYAB FAISAL — FULL-STACK DEVELOPER PORTFOLIO
 * Contact Form Validation & Honest Submission Handler
 *
 * Implements strict recruiter-honesty rules:
 * - Direct PHP endpoint submission when hosted on a PHP server (XAMPP / VPS).
 * - Transparent fallback with pre-filled Mailto and WhatsApp triggers when on static hosts (GitHub Pages).
 * - Zero fabricated success alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const alertContainer = document.getElementById('form-status-alert');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!contactForm) return;

  const showAlert = (type, message, actionsHtml = '') => {
    if (!alertContainer) return;
    alertContainer.className = `form-status-alert ${type}`;
    alertContainer.innerHTML = `
      <div class="alert-content">
        <p class="mb-1">${message}</p>
        ${actionsHtml ? `<div class="mt-2 d-flex flex-wrap gap-2">${actionsHtml}</div>` : ''}
      </div>
    `;
    alertContainer.style.display = 'block';
  };

  const clearAlert = () => {
    if (!alertContainer) return;
    alertContainer.style.display = 'none';
    alertContainer.innerHTML = '';
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    // Get input fields
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject = subjectInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    // Simple validation
    let isValid = true;

    if (!name) {
      document.getElementById('feedback-name')?.classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('feedback-name')?.classList.remove('invalid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('feedback-email')?.classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('feedback-email')?.classList.remove('invalid');
    }

    if (!subject) {
      document.getElementById('feedback-subject')?.classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('feedback-subject')?.classList.remove('invalid');
    }

    if (!message || message.length < 10) {
      document.getElementById('feedback-message')?.classList.add('invalid');
      isValid = false;
    } else {
      document.getElementById('feedback-message')?.classList.remove('invalid');
    }

    if (!isValid) {
      showAlert('error', 'Please resolve the highlighted fields before submitting.');
      return;
    }

    // Set loading state on button
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';

    // Check if running on local file protocol or static web server
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      const mailtoUrl = `mailto:tayyab3333.uk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      const whatsappUrl = `https://wa.me/923348275259?text=${encodeURIComponent(`Hi Tayyab, this is ${name} (${email}). Subject: ${subject}. Message: ${message}`)}`;

      const actions = `
        <a href="${mailtoUrl}" class="btn btn-sm btn-primary-glow" target="_blank" rel="noopener">
          <i class="bi bi-envelope-fill me-1"></i> Send via Email Client
        </a>
        <a href="${whatsappUrl}" class="btn btn-sm btn-secondary-outline" target="_blank" rel="noopener">
          <i class="bi bi-whatsapp me-1"></i> Send via WhatsApp
        </a>
      `;

      showAlert(
        'info',
        '<strong>Local File Mode Detected:</strong> Direct backend form submission requires an active PHP server (such as Apache/XAMPP). Choose an option below to transmit your message directly:',
        actions
      );
      return;
    }

    // Attempt backend submission to api/contact.php
    try {
      const response = await fetch('api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      // Handle response
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showAlert('success', `✓ <strong>Thank you, ${name}!</strong> Your message has been received by the server. Tayyab will respond promptly.`);
          contactForm.reset();
        } else {
          showAlert('error', `Submission error: ${result.message || 'Unable to process request.'}`);
        }
      } else {
        // Static hosting fallback (e.g. GitHub Pages returns 404 or 405 for PHP files)
        const mailtoUrl = `mailto:tayyab3333.uk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
        const whatsappUrl = `https://wa.me/923348275259?text=${encodeURIComponent(`Hi Tayyab, this is ${name} (${email}). Subject: ${subject}. Message: ${message}`)}`;

        const actions = `
          <a href="${mailtoUrl}" class="btn btn-sm btn-primary-glow" target="_blank" rel="noopener">
            <i class="bi bi-envelope-fill me-1"></i> Open in Email Client
          </a>
          <a href="${whatsappUrl}" class="btn btn-sm btn-secondary-outline" target="_blank" rel="noopener">
            <i class="bi bi-whatsapp me-1"></i> Open in WhatsApp
          </a>
        `;

        showAlert(
          'info',
          '<strong>Static Hosting Notice:</strong> This portfolio is hosted on a static environment (such as GitHub Pages), where server-side PHP scripts are not executed. Please use one of the direct channels below to send your pre-filled inquiry:',
          actions
        );
      }
    } catch (err) {
      // Network failure or static environment fetch rejection
      const mailtoUrl = `mailto:tayyab3333.uk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      const whatsappUrl = `https://wa.me/923348275259?text=${encodeURIComponent(`Hi Tayyab, this is ${name} (${email}). Subject: ${subject}. Message: ${message}`)}`;

      const actions = `
        <a href="${mailtoUrl}" class="btn btn-sm btn-primary-glow" target="_blank" rel="noopener">
          <i class="bi bi-envelope-fill me-1"></i> Send via Email
        </a>
        <a href="${whatsappUrl}" class="btn btn-sm btn-secondary-outline" target="_blank" rel="noopener">
          <i class="bi bi-whatsapp me-1"></i> Send via WhatsApp
        </a>
      `;

      showAlert(
        'info',
        '<strong>Notice:</strong> Server endpoint unreachable or running in static mode. Your message has been prepared for direct dispatch:',
        actions
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});
