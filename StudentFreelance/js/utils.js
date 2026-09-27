// StudentFreelance — shared utilities (theme toggle, mobile nav)

(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('sf-theme');
  if (stored) root.setAttribute('data-theme', stored);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      updateToggleIcon(toggle);
      toggle.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        if (next === 'light') {
          root.removeAttribute('data-theme');
        } else {
          root.setAttribute('data-theme', 'dark');
        }
        localStorage.setItem('sf-theme', next);
        updateToggleIcon(toggle);
      });
    }

    const burger = document.querySelector('.nav-burger');
    const links = document.querySelector('.nav-links');
    if (burger && links) {
      burger.addEventListener('click', () => {
        links.classList.toggle('open');
      });
    }

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dash-sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  });

  function updateToggleIcon(el) {
    const isDark = root.getAttribute('data-theme') === 'dark';
    el.textContent = isDark ? '☀' : '☾';
  }
})();
