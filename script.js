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
  // Dark is default. 'light' stored value will remove the dark class.
  const stored = localStorage.getItem('site-theme');
  if (stored === 'light') {
    document.body.classList.remove('dark');
  } else if (stored === 'dark') {
    document.body.classList.add('dark');
  } else {
    // No preference stored: default to dark
    document.body.classList.add('dark');
  }
}

function wireThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function updateButton() {
    const isDark = document.body.classList.contains('dark');
    btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    btn.setAttribute('aria-pressed', String(isDark));
  }

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
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
