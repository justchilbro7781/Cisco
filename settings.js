document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.page-tab[data-stab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.page-tab[data-stab]').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.page-tab-panel[data-spanel]').forEach(p => p.classList.toggle('active', p.dataset.spanel === tab.dataset.stab));
    });
  });

  const toast = document.getElementById('settingsToast');
  let toastTimer = null;

  function flashToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  document.getElementById('settingsSaveBtn').addEventListener('click', () => {
    flashToast('Settings saved successfully.');
  });

  document.getElementById('settingsResetBtn').addEventListener('click', () => {
    if (confirm('Reset all settings on this tab to their default values?')) {
      flashToast('Settings reset to defaults.');
    }
  });

});
