// Shared small utilities: include loader, theme toggle, and feature reveal
async function loadIncludes() {
  const includes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(includes).map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Include not found: ' + url);
      const html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      console.warn(e);
    }
  }));
}

function applyThemeFromStorage() {
  // Dark is default. We use `body.light` to opt into light theme.
  const stored = localStorage.getItem('site-theme');
  if (stored === 'light') {
    document.body.classList.add('light');
  } else if (stored === 'dark') {
    document.body.classList.remove('light');
  } else {
    // No preference stored: default to dark (no .light class)
    document.body.classList.remove('light');
  }
}

function wireThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function updateButton() {
    const isLight = document.body.classList.contains('light');
    // show the action the button will perform when clicked
    btn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    btn.setAttribute('aria-pressed', String(isLight));
  }

  btn.addEventListener('click', () => {
    const isNowLight = document.body.classList.toggle('light');
    localStorage.setItem('site-theme', isNowLight ? 'light' : 'dark');
    updateButton();
  });

  updateButton();
}

function revealFeatures() {
  const features = document.querySelectorAll('.feature');
  if (!features || features.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    features.forEach((el, i) => {
      el.style.transitionDelay = `${i * 120}ms`;
      observer.observe(el);
    });
  } else {
    features.forEach((el, i) => {
      setTimeout(() => el.classList.add('show'), i * 120);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  applyThemeFromStorage();
  await loadIncludes();
  wireThemeToggle();
  revealFeatures();
});
