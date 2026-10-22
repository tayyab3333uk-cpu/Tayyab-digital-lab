/**
 * TAYYAB FAISAL — ULTRA-PREMIUM PORTFOLIO
 * Honest Contact Form Controller & Client-Side Communication Dispatcher
 * Strictly validates inputs and provides transparent static GitHub Pages dispatches.
 */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-status-alert');
  if (!form || !alertBox) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  const VERIFIED_EMAIL = 'tayyab3333.uk@gmail.com';
  const VERIFIED_PHONE_RAW = '923348275259';

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    return re.test(String(email).toLowerCase());
  }

  function validateField(input, condition, errorId, errorMsg) {
    const errorEl = document.getElementById(errorId);
    if (!condition) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorEl) {
        errorEl.style.display = 'none';
      }
      return true;
    }
  }

  // Live validation on blur
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, nameInput.value.trim().length >= 2, 'feedback-name', 'Please enter your name (at least 2 characters).');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, validateEmail(emailInput.value.trim()), 'feedback-email', 'Please enter a valid email address.');
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', () => {
      validateField(subjectInput, subjectInput.value.trim().length >= 3, 'feedback-subject', 'Please enter a subject (at least 3 characters).');
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateField(messageInput, messageInput.value.trim().length >= 10, 'feedback-message', 'Message must be at least 10 characters.');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const subjectVal = subjectInput ? subjectInput.value.trim() : '';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    const isNameOk = validateField(nameInput, nameVal.length >= 2, 'feedback-name', 'Please enter your name.');
    const isEmailOk = validateField(emailInput, validateEmail(emailVal), 'feedback-email', 'Please enter a valid email address.');
    const isSubjectOk = validateField(subjectInput, subjectVal.length >= 3, 'feedback-subject', 'Please enter a subject.');
    const isMessageOk = validateField(messageInput, messageVal.length >= 10, 'feedback-message', 'Message must be at least 10 characters.');

    if (!isNameOk || !isEmailOk || !isSubjectOk || !isMessageOk) {
      alertBox.className = 'form-status-alert alert-error';
      alertBox.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-1">
          <i class="bi bi-exclamation-triangle-fill text-warning"></i>
          <strong>Incomplete Inquiry Form</strong>
        </div>
        <p class="mb-0 small">Please correct the highlighted fields before submitting.</p>
      `;
      alertBox.style.display = 'block';
      return;
    }

    // Build URL encoded message parameters
    const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal} (from ${nameVal})`);
    const encodedBody = encodeURIComponent(
      `Hi Tayyab,\n\nName: ${nameVal}\nEmail: ${emailVal}\nSubject: ${subjectVal}\n\nMessage:\n${messageVal}\n\n---\nSent from Tayyab Faisal Developer Portfolio`
    );
    const mailtoUrl = `mailto:${VERIFIED_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;

    const whatsappText = encodeURIComponent(
      `*New Portfolio Inquiry*\n*From:* ${nameVal} (${emailVal})\n*Subject:* ${subjectVal}\n*Message:* ${messageVal}`
    );
    const whatsappUrl = `https://wa.me/${VERIFIED_PHONE_RAW}?text=${whatsappText}`;

    // Display honest static GitHub Pages feedback with 1-click dispatch buttons
    alertBox.className = 'form-status-alert alert-info';
    alertBox.innerHTML = `
      <div class="dispatch-notice-box">
        <div class="d-flex align-items-center gap-2 mb-2 text-info">
          <i class="bi bi-send-check-fill fs-5"></i>
          <h4 class="mb-0 fs-6 fw-bold">Message Validated & Ready to Dispatch</h4>
        </div>
        <p class="small text-muted mb-3">
          This portfolio is statically hosted on <strong>GitHub Pages</strong> (client-side only). To guarantee your message arrives instantly without third-party email routing failures, choose your preferred direct channel:
        </p>
        <div class="d-flex flex-wrap gap-2">
          <a href="${mailtoUrl}" class="btn-primary-glow btn-sm d-inline-flex align-items-center gap-2">
            <i class="bi bi-envelope-fill"></i> Open Email Draft
          </a>
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-direct btn-sm d-inline-flex align-items-center gap-2">
            <i class="bi bi-whatsapp"></i> Send via WhatsApp
          </a>
        </div>
      </div>
    `;
    alertBox.style.display = 'block';

    // Automatically trigger mailto link as convenience
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);
  });
})();
