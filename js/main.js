/* BeamerRepairs — shared JS */

function toggleFaq(questionEl) {
  const item = questionEl.closest('.faq-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-notice ${type}`;
  const icon = type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill';
  toast.innerHTML = `<i class="bi ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  window.setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3200);
}

function initThemeToggle() {
  const navbar = document.querySelector('.navbar');
  const brand = document.querySelector('.navbar-brand');
  if (!navbar || !brand) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', 'Toggle dark and light mode');
  button.innerHTML = '<i class="bi bi-moon-fill"></i>';

  brand.insertAdjacentElement('afterend', button);

  const storedTheme = localStorage.getItem('beamer-theme');
  const initialTheme = storedTheme || 'dark';
  applyTheme(initialTheme);

  button.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  function applyTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.documentElement.setAttribute('data-theme', theme);
    button.innerHTML = theme === 'light' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    button.setAttribute('aria-pressed', String(theme === 'light'));
    localStorage.setItem('beamer-theme', theme);
  }
}

function initReadingProgress() {
  const progress = document.createElement('div');
  progress.id = 'reading-progress';
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const width = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progress.style.width = `${Math.min(width, 100)}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

function initBackToTop() {
  const button = document.createElement('button');
  button.id = 'back-to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(button);

  const toggleVisibility = () => {
    button.classList.toggle('visible', window.scrollY > 500);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });
}

function initGalleryFilters() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  const items = Array.from(galleryGrid.children).filter(child => child.classList.contains('gallery-item'));
  if (!items.length) return;

  const filters = document.createElement('div');
  filters.className = 'gallery-filters';
  filters.innerHTML = `
    <button class="gallery-filter-btn active" data-filter="all">All</button>
    <button class="gallery-filter-btn" data-filter="workshop">Workshop</button>
    <button class="gallery-filter-btn" data-filter="detail">Detail</button>
    <button class="gallery-filter-btn" data-filter="exterior">Exterior</button>
  `;

  galleryGrid.parentNode.insertBefore(filters, galleryGrid);

  items.forEach(item => {
    const alt = (item.querySelector('img')?.alt || '').toLowerCase();
    let category = 'all';
    if (alt.includes('engine') || alt.includes('workshop') || alt.includes('bay')) category = 'workshop';
    else if (alt.includes('detail') || alt.includes('interior') || alt.includes('wheel')) category = 'detail';
    else if (alt.includes('exterior') || alt.includes('road') || alt.includes('profile') || alt.includes('m3')) category = 'exterior';
    item.dataset.category = category;
  });

  filters.querySelectorAll('.gallery-filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      filters.querySelectorAll('.gallery-filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter || 'all';
      let visibleCount = 0;

      items.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        item.style.display = matches ? '' : 'none';
        if (matches) visibleCount += 1;
      });

      const noResults = galleryGrid.querySelector('.gallery-empty');
      if (noResults) noResults.remove();
      if (!visibleCount) {
        const emptyState = document.createElement('div');
        emptyState.className = 'gallery-empty';
        emptyState.textContent = 'No projects match this filter yet.';
        galleryGrid.appendChild(emptyState);
      }
    });
  });
}

function initContactForm() {
  const wrap = document.getElementById('contact-form-wrap');
  if (!wrap) return;

  const fields = Array.from(wrap.querySelectorAll('input, select, textarea'));
  if (!fields.length) return;

  const nameInput = fields[0];
  const emailInput = fields[1];
  const phoneInput = fields[2];
  const vehicleInput = fields[3];
  const serviceInput = fields[4];
  const messageInput = fields[5];

  const validators = [
    { field: nameInput, label: 'name', test: value => value.trim().length >= 2 },
    { field: emailInput, label: 'email address', test: value => /^\S+@\S+\.\S+$/.test(value.trim()) },
    { field: phoneInput, label: 'phone number', test: value => value.trim().length >= 7 },
    { field: vehicleInput, label: 'vehicle details', test: value => value.trim().length >= 3 },
    { field: serviceInput, label: 'service required', test: value => value.trim().length > 0 },
    { field: messageInput, label: 'message', test: value => value.trim().length >= 10 }
  ];

  wrap.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
    field.addEventListener('change', () => field.classList.remove('is-invalid'));
  });

  window.submitForm = function submitForm() {
    let firstInvalidField = null;
    let invalidMessage = '';

    validators.forEach(({ field, label, test }) => {
      const value = field.value;
      if (!test(value)) {
        field.classList.add('is-invalid');
        if (!firstInvalidField) {
          firstInvalidField = field;
          invalidMessage = label === 'email address'
            ? 'Please enter a valid email address.'
            : label === 'phone number'
              ? 'Please enter a valid phone number.'
              : `Please enter your ${label}.`;
        }
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      showToast(invalidMessage, 'error');
      return;
    }

    wrap.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem">
        <div style="font-size:3rem;color:var(--steel-blue);margin-bottom:1.5rem">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h3 style="font-family:var(--font-display);font-size:2.2rem;letter-spacing:0.06em;color:var(--off-white);margin-bottom:0.8rem">ENQUIRY SENT</h3>
        <p style="color:var(--chrome);font-size:0.95rem;max-width:360px;margin:0 auto">
          We'll be in touch within 2 working hours. If your matter is urgent, call us directly on
          <strong style="color:var(--off-white)">020 8123 4567</strong>.
        </p>
      </div>`;
    showToast('Enquiry sent successfully. We will be in touch shortly.', 'success');
  };
}

function subscribeNewsletter(formOrInput) {
  const form = typeof formOrInput === 'string' ? document.querySelector(formOrInput) : formOrInput;
  const emailInput = form?.querySelector('input[type="email"], input[name="email"], input[data-newsletter-email]')
    || document.getElementById('newsletter-email')
    || document.querySelector('[data-newsletter-email]');

  if (!emailInput) {
    showToast('Newsletter signup form is unavailable right now.', 'error');
    return false;
  }

  const email = emailInput.value.trim();
  const isValid = /^\S+@\S+\.\S+$/.test(email);

  emailInput.classList.toggle('is-invalid', !isValid);
  emailInput.setAttribute('aria-invalid', String(!isValid));

  if (!isValid) {
    emailInput.focus();
    showToast('Please enter a valid email address to subscribe.', 'error');
    return false;
  }

  emailInput.value = '';
  emailInput.classList.remove('is-invalid');
  emailInput.setAttribute('aria-invalid', 'false');
  showToast('Thanks for subscribing. You are on the list!', 'success');
  return true;
}

function initNewsletterSubscription() {
  const form = document.querySelector('form[data-newsletter-form], form.newsletter-form, form#newsletter-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    subscribeNewsletter(form);
  });

  const emailInput = form.querySelector('input[type="email"], input[name="email"], input[data-newsletter-email]');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('is-invalid');
      emailInput.setAttribute('aria-invalid', 'false');
    });
  }
}

function initActiveNav() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const targetPage = href.split('/').pop() || 'index.html';
    const isActive = targetPage === currentPage || (currentPage === 'index.html' && targetPage === 'index.html');
    link.classList.toggle('active', isActive);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReadingProgress();
  initBackToTop();
  initGalleryFilters();
  initContactForm();
  initNewsletterSubscription();
  initFaqButtons();
  initFaqSearchAndFilters();
  initActiveNav();
});

function initFaqButtons() {
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => toggleFaq(button));
  });
}

function initFaqSearchAndFilters() {
  const searchInput = document.getElementById('faqSearch');
  const filterButtons = document.querySelectorAll('.faq-filter-btn');
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  if (!searchInput || !faqItems.length) return;

  const updateVisibility = () => {
    const query = searchInput.value.trim().toLowerCase();
    const activeFilter = document.querySelector('.faq-filter-btn.active')?.dataset.filter || 'all';
    let visibleCount = 0;

    faqItems.forEach(item => {
      const topic = (item.dataset.topic || 'general').toLowerCase();
      const text = item.textContent.toLowerCase();
      const matchesFilter = activeFilter === 'all' || topic === activeFilter;
      const matchesQuery = !query || text.includes(query);
      const isVisible = matchesFilter && matchesQuery;
      item.classList.toggle('hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    const existingEmpty = document.querySelector('.faq-empty');
    if (existingEmpty) existingEmpty.remove();

    if (!visibleCount) {
      const emptyState = document.createElement('div');
      emptyState.className = 'faq-empty';
      emptyState.textContent = 'No questions match your search yet.';
      searchInput.closest('.faq-search-panel').insertAdjacentElement('afterend', emptyState);
    }
  };

  searchInput.addEventListener('input', updateVisibility);
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      updateVisibility();
    });
  });

  updateVisibility();
}

window.toggleFaq = toggleFaq;
window.subscribeNewsletter = subscribeNewsletter;
