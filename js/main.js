/* BeamerRepairs — shared JS */

/* ─── FAQ TOGGLE ─────────────────────────────────────── */
function toggleFaq(questionEl) {
  const item = questionEl.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ─── CONTACT FORM SUBMIT ────────────────────────────── */
function submitForm() {
  const wrap = document.getElementById('contact-form-wrap');
  if (!wrap) return;
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
}

/* ─── ACTIVE NAV LINK ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
});
