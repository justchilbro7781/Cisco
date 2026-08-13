document.addEventListener('DOMContentLoaded', () => {
  const prompts = [
    { file: 'welcome_greeting.wav',   desc: 'Main welcome message',      dur: '00:08', size: '128 KB', mod: '12 Apr 2022' },
    { file: 'hold_music.wav',         desc: 'Queue hold music loop',     dur: '02:45', size: '2.6 MB', mod: '11 Apr 2022' },
    { file: 'menu_main.wav',          desc: 'Main menu options',         dur: '00:16', size: '256 KB', mod: '11 Apr 2022' },
    { file: 'menu_sales.wav',         desc: 'Sales sub menu',            dur: '00:11', size: '176 KB', mod: '08 Apr 2022' },
    { file: 'menu_support.wav',       desc: 'Support sub menu',          dur: '00:13', size: '208 KB', mod: '08 Apr 2022' },
    { file: 'estimated_wait.wav',     desc: 'Estimated wait time',       dur: '00:06', size: '96 KB',  mod: '05 Apr 2022' },
    { file: 'callback_offer.wav',     desc: 'Callback offer prompt',     dur: '00:14', size: '224 KB', mod: '05 Apr 2022' },
    { file: 'after_hours.wav',        desc: 'Closed / after hours',      dur: '00:10', size: '160 KB', mod: '01 Apr 2022' },
    { file: 'holiday_closure.wav',    desc: 'Holiday closure notice',    dur: '00:12', size: '192 KB', mod: '01 Apr 2022' },
    { file: 'agent_transfer.wav',     desc: 'Transferring to an agent',  dur: '00:05', size: '80 KB',  mod: '28 Mar 2022' },
    { file: 'survey_invite.wav',      desc: 'Post call survey invite',   dur: '00:09', size: '144 KB', mod: '28 Mar 2022' },
    { file: 'goodbye.wav',            desc: 'Call closing message',      dur: '00:04', size: '64 KB',  mod: '25 Mar 2022' }
  ];

  const body = document.getElementById('audioBody');
  const empty = document.getElementById('audioEmpty');
  const countEl = document.getElementById('audioCount');
  let filter = '';
  let playing = null;
  let timer = null;

  function render() {
    const rows = prompts.filter(p =>
      p.file.toLowerCase().includes(filter) || p.desc.toLowerCase().includes(filter));

    body.innerHTML = '';
    rows.forEach(p => {
      const tr = document.createElement('tr');
      tr.dataset.file = p.file;
      if (playing === p.file) tr.classList.add('playing');
      tr.innerHTML =
        '<td><div class="im-file"><svg class="icon"><use href="#icon-audio"/></svg>' +
          '<span>' + p.file + '</span></div>' +
          (playing === p.file
            ? '<div class="im-progress" style="margin-top:7px"><span></span></div>' : '') +
        '</td>' +
        '<td class="im-muted">' + p.desc + '</td>' +
        '<td class="im-muted">' + p.dur + '</td>' +
        '<td class="im-muted">' + p.size + '</td>' +
        '<td class="im-muted">' + p.mod + '</td>' +
        '<td><div class="im-row-actions">' +
          '<button class="im-icon-btn play" title="' + (playing === p.file ? 'Stop' : 'Play') + '">' +
            '<svg class="icon"><use href="#icon-' + (playing === p.file ? 'pause' : 'play') + '"/></svg></button>' +
          '<button class="im-icon-btn dl" title="Download"><svg class="icon"><use href="#icon-download"/></svg></button>' +
          '<button class="im-icon-btn del" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
        '</div></td>';
      body.appendChild(tr);
    });

    countEl.textContent = rows.length;
    empty.hidden = rows.length > 0;
  }

  /* Simulated playback: fills the progress bar, then stops */
  function play(file) {
    stop();
    playing = file;
    render();
    const bar = body.querySelector('tr.playing .im-progress span');
    let pct = 0;
    timer = setInterval(() => {
      pct += 4;
      if (bar) bar.style.width = pct + '%';
      if (pct >= 100) stop();
    }, 120);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    playing = null;
    render();
  }

  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const file = tr.dataset.file;
    const item = prompts.find(p => p.file === file);

    if (e.target.closest('.play')) {
      playing === file ? stop() : play(file);
      return;
    }
    if (e.target.closest('.dl')) {
      alert('Downloading ' + file);
      return;
    }
    if (e.target.closest('.del')) {
      if (confirm('Delete "' + file + '"?')) {
        if (playing === file) stop();
        prompts.splice(prompts.indexOf(item), 1);
        render();
      }
    }
  });

  document.getElementById('audioSearch').addEventListener('input', (e) => {
    filter = e.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById('uploadBtn').addEventListener('click', () => {
    const name = prompt('Audio file name:', 'new_prompt.wav');
    if (!name || !name.trim()) return;
    prompts.unshift({
      file: name.trim().endsWith('.wav') ? name.trim() : name.trim() + '.wav',
      desc: 'Uploaded prompt',
      dur: '00:00',
      size: '0 KB',
      mod: 'Today'
    });
    render();
  });

  document.getElementById('refreshBtn').addEventListener('click', () => {
    stop();
    render();
  });

  render();
});
