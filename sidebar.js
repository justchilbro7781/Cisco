/* Shared sidebar behaviour: collapse, submenu expand, star rating */
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');

  /* Collapse / expand */
  const collapseBtn = document.getElementById('collapseBtn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        document.querySelectorAll('.submenu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.sidebar-item.expanded').forEach(i => i.classList.remove('expanded'));
      }
    });
  }

  /* Submenu toggle (Finesse Admin, etc.) */
  document.querySelectorAll('.sidebar-item[data-toggle]').forEach(item => {
    const menu = document.getElementById('submenu-' + item.dataset.toggle);
    if (!menu) return;

    if (item.tagName === 'A') {
      /* Real nav link (e.g. Skills): clicking anywhere on it toggles the
         submenu open/closed. If it points to a different page, the browser
         still navigates there afterwards (where the submenu opens itself). */
      const samePage = item.pathname === location.pathname;
      item.addEventListener('click', (e) => {
        if (samePage) e.preventDefault();
        const open = menu.classList.toggle('open');
        item.classList.toggle('expanded', open);
      });
    } else {
      item.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        item.classList.toggle('expanded', open);
      });
    }
  });

  /* Keep the submenu of the current page open */
  const activeSub = document.querySelector('.submenu-item.active');
  if (activeSub) {
    const menu = activeSub.closest('.submenu');
    menu.classList.add('open');
    const parent = document.querySelector('.sidebar-item[data-toggle="' + menu.id.replace('submenu-', '') + '"]');
    if (parent) parent.classList.add('expanded');
  }

  /* A top-level nav link that is itself the current page (e.g. Skills)
     should also show its submenu open underneath it. */
  const activeParent = document.querySelector('.sidebar-item.active[data-toggle]');
  if (activeParent) {
    const menu = document.getElementById('submenu-' + activeParent.dataset.toggle);
    if (menu) {
      menu.classList.add('open');
      activeParent.classList.add('expanded');
    }
  }

  /* Agent to Skill / Skill to Agent: make the left picker panel exactly as
     tall as the right two-pane section, so both columns line up, and let
     its own list scroll internally for the rest (like Precision Queues). */
  const a2sSkillsPanel = document.querySelector('.a2s-skills-panel');
  const a2sPanesWrap = document.querySelector('.a2s-panes-wrap');
  if (a2sSkillsPanel && a2sPanesWrap) {
    const matchHeight = () => {
      a2sSkillsPanel.style.height = a2sPanesWrap.getBoundingClientRect().height + 'px';
    };
    matchHeight();
    window.addEventListener('resize', matchHeight);
  }

  /* Star rating */
  let rating = 0;
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, idx) => {
    star.addEventListener('click', () => {
      rating = idx + 1;
      stars.forEach((s, i) => s.classList.toggle('filled', i < rating));
    });
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => s.classList.toggle('filled', i <= idx));
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => s.classList.toggle('filled', i < rating));
    });
  });
});
