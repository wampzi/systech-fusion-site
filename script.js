/* Systech Fusion — modern UX behaviors */

// Header scroll state
const header = document.querySelector('[data-header]');
const updateHeader = () => header && header.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Mobile nav toggle
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Lucide icons
window.addEventListener('load', () => {
  if (window.lucide) window.lucide.createIcons();
});

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Stats counter
const counters = document.querySelectorAll('[data-counter]');
if ('IntersectionObserver' in window && counters.length) {
  const animate = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent =
        (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const co = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          co.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => co.observe(c));
}

// Contact form -> mailto handoff
const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const f = new FormData(contactForm);
    const get = (k) => String(f.get(k) || '').trim();
    const name = get('name');
    const email = get('email');
    const company = get('company');
    const service = get('service');
    const message = get('message');

    const subject = ['Consultation request', service, company].filter(Boolean).join(' - ');
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      `Service interest: ${service}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const mailto = `mailto:admin@systechfusion.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    formStatus.textContent = 'Opening your email app to send the request to admin@systechfusion.com…';
    window.location.href = mailto;
  });
}

// Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
