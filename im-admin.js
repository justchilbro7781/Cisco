document.addEventListener('DOMContentLoaded', () => {
  const savedMsg = document.getElementById('savedMsg');

  /* Snapshot of the initial values so Reset can restore them */
  const defaults = {};
  document.querySelectorAll('[data-setting]').forEach(el => {
    defaults[el.dataset.setting] = el.classList.contains('adm-switch')
      ? el.classList.contains('on')
      : el.value;
  });

  /* Toggle switches */
  document.querySelectorAll('.adm-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('on');
      sw.setAttribute('aria-pressed', sw.classList.contains('on'));
    });
  });

  function flash() {
    savedMsg.classList.add('show');
    setTimeout(() => savedMsg.classList.remove('show'), 1800);
  }

  document.getElementById('saveBtn').addEventListener('click', () => {
    const values = {};
    document.querySelectorAll('[data-setting]').forEach(el => {
      values[el.dataset.setting] = el.classList.contains('adm-switch')
        ? el.classList.contains('on')
        : el.value;
    });
    console.log('Interaction Manager settings saved:', values);
    flash();
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all settings to their last saved values?')) return;
    document.querySelectorAll('[data-setting]').forEach(el => {
      const value = defaults[el.dataset.setting];
      if (el.classList.contains('adm-switch')) {
        el.classList.toggle('on', value);
      } else {
        el.value = value;
      }
    });
  });
});
