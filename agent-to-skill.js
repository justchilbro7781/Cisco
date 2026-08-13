document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Skill list (for the left picker) ---------- */
  const SKILLS = [
    { name: 'A_Sales', agents: 2 },
    { name: 'AcqueonOutboundAgent', agents: 1 },
    { name: 'AcqueonOutboundIVR', agents: 2 },
    { name: 'AcqueonOutboundPreview', agents: 2 },
    { name: 'AcqueonOutboundSimulator', agents: 1 },
    { name: 'CIM_CALLBACK', agents: 1 },
    { name: 'CIM_DELAYED', agents: 1 },
    { name: 'CIM_EIM', agents: 0 },
    { name: 'CIM_WIM', agents: 0 },
    { name: 'Claims', agents: 0 },
    { name: 'ConsiliumOutboundAgent', agents: 1 },
    { name: 'ConsiliumOutboundIVR', agents: 1 },
    { name: 'ConsiliumOutboundPreview', agents: 1 },
    { name: 'ConsiliumOutboundSimulator', agents: 0 },
    { name: 'CumulusCB', agents: 0 },
    { name: 'CumulusCertification', agents: 0 },
    { name: 'CumulusChat', agents: 1 },
    { name: 'CumulusChatEnglish', agents: 0 },
    { name: 'CumulusChatItalian', agents: 0 },
    { name: 'CumulusChatSpanish', agents: 0 },
    { name: 'CumulusCity', agents: 0 },
    { name: 'CumulusEmail', agents: 0 },
    { name: 'CumulusFacebook', agents: 0 },
    { name: 'CumulusFinance', agents: 0 },
    { name: 'CumulusHealthCare', agents: 0 },
    { name: 'CumulusInbound', agents: 2 },
    { name: 'CumulusOutbound', agents: 1 },
    { name: 'CumulusRLM', agents: 0 },
    { name: 'CumulusSMS', agents: 0 },
    { name: 'CumulusTask', agents: 0 },
    { name: 'CumulusTravel', agents: 0 },
    { name: 'CumulusUtility', agents: 0 },
    { name: 'CumulusUWF', agents: 2 },
    { name: 'CumulusVIVR', agents: 0 }
  ];

  /* ---------- Agent roster (same people used across the app) ---------- */
  const AGENTS = [
    { user: 'amacdowell', name: 'MacDowell, Andy' },
    { user: 'annika',     name: 'Hamilton, Annika' },
    { user: 'bbrown',     name: 'Brown, Beacham' },
    { user: 'csupervisor', name: 'Supervisor, Cathy' },
    { user: 'hliang',     name: 'Liang, Helen' },
    { user: 'jabracks',   name: 'Bracksted, James' },
    { user: 'Jdoe',       name: 'Doe, Jane' },
    { user: 'jopeters',   name: 'Petreson, Josh' },
    { user: 'rbarrows',   name: 'Barrows, Rick' },
    { user: 'sjeffers',   name: 'Jefferson, Sandra' },
    { user: 'vbcpod1',    name: 'POD1, VBC' }
  ];

  /* Per skill assigned agents, seeded so every skill's count matches its
     badge in the picker. A_Sales matches the reference screenshot exactly. */
  const skillAgents = {};
  SKILLS.forEach((s, i) => {
    if (s.name === 'A_Sales') {
      skillAgents[s.name] = ['rbarrows', 'sjeffers'];
      return;
    }
    const picked = [];
    for (let n = 0; n < s.agents; n++) {
      picked.push(AGENTS[(i + n) % AGENTS.length].user);
    }
    skillAgents[s.name] = picked;
  });

  function agentsFor(skillName) {
    if (!skillAgents[skillName]) skillAgents[skillName] = [];
    return skillAgents[skillName];
  }

  /* ---------- Left skill picker ---------- */
  const skillListEl = document.getElementById('a2sSkillList');
  let currentSkill = null;
  let skillFilter = '';
  let skillSortKey = 'name';
  let skillSortDir = 1;

  function initialSkillName() {
    const fromUrl = new URLSearchParams(window.location.search).get('skill');
    if (fromUrl && SKILLS.some(s => s.name === fromUrl)) return fromUrl;
    return SKILLS[0].name;
  }

  function skillRows() {
    return SKILLS
      .filter(s => s.name.toLowerCase().includes(skillFilter))
      .sort((a, b) => {
        if (skillSortKey === 'agents') {
          return (agentsFor(a.name).length - agentsFor(b.name).length) * skillSortDir;
        }
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase()) * skillSortDir;
      });
  }

  function renderSkillList() {
    const rows = skillRows();
    skillListEl.innerHTML = rows.length === 0
      ? '<li class="sup-empty-list">No records</li>'
      : rows.map(s =>
          '<li class="' + (s.name === currentSkill ? 'skill-selected' : '') + '" data-skill="' + s.name + '">' +
            '<span class="who"><b>' + s.name + '</b></span>' +
            '<span class="a2s-agent-count">' + agentsFor(s.name).length + '</span>' +
          '</li>'
        ).join('');

    document.getElementById('a2sSkillCount').textContent =
      rows.length === 0 ? 'No records' : rows.length + (rows.length === 1 ? ' record' : ' records');
    document.getElementById('a2sSkillPos').textContent = rows.length === 0 ? '0/0' : '1/1';
  }

  skillListEl.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-skill]');
    if (!li) return;
    selectSkill(li.dataset.skill);
  });

  document.getElementById('a2sSkillSearch').addEventListener('input', (e) => {
    skillFilter = e.target.value.trim().toLowerCase();
    renderSkillList();
  });

  document.querySelectorAll('.sup-sort[data-sksort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sksort;
      skillSortDir = (skillSortKey === key) ? -skillSortDir : 1;
      skillSortKey = key;
      document.querySelectorAll('.sup-sort[data-sksort] .arrow').forEach(a => { a.innerHTML = '&#9650;'; });
      btn.querySelector('.arrow').innerHTML = skillSortDir === 1 ? '&#9650;' : '&#9660;';
      renderSkillList();
    });
  });

  /* ---------- Assigned / Available panes ---------- */
  const a2sAssignedList = document.getElementById('a2sAssignedList');
  const a2sAvailableList = document.getElementById('a2sAvailableList');
  let a2sAssigned = [];
  let a2sAvailable = [];
  let a2sChecked = {};
  const a2sFilter = { assigned: '', available: '' };
  const a2sSort = { assigned: 1, available: 1 };

  function selectSkill(name) {
    currentSkill = name;
    document.getElementById('a2sAssignedSkillName').textContent = '— ' + name;
    document.getElementById('a2sAvailableSkillName').textContent = '— ' + name;
    a2sAssigned = agentsFor(name).slice();
    a2sAvailable = AGENTS.map(a => a.user).filter(u => a2sAssigned.indexOf(u) === -1);
    a2sChecked = {};
    a2sFilter.assigned = a2sFilter.available = '';
    document.getElementById('a2sAssignedFilter').value = '';
    document.getElementById('a2sAvailableFilter').value = '';
    renderSkillList();
    renderA2s();

    const url = new URL(window.location.href);
    url.searchParams.set('skill', name);
    window.history.replaceState(null, '', url);
  }

  function a2sRowsFor(side) {
    const list = side === 'assigned' ? a2sAssigned : a2sAvailable;
    return list
      .map(u => AGENTS.find(a => a.user === u))
      .filter(a => (a.user + ' ' + a.name).toLowerCase().includes(a2sFilter[side]))
      .sort((a, b) => a.user.toLowerCase().localeCompare(b.user.toLowerCase()) * a2sSort[side]);
  }

  function renderA2sPane(side, listEl, countId, posId, allId) {
    const rows = a2sRowsFor(side);
    listEl.innerHTML = '';

    if (rows.length === 0) {
      listEl.innerHTML = '<li class="sup-empty-list">No records</li>';
    } else {
      rows.forEach(a => {
        const li = document.createElement('li');
        li.dataset.user = a.user;
        if (a2sChecked[a.user]) li.classList.add('checked');
        li.innerHTML =
          '<svg class="sup-avatar"><use href="#icon-user"/></svg>' +
          '<span class="who"><b>' + a.user + '</b> - <i>' + a.name + '</i></span>' +
          '<input type="checkbox"' + (a2sChecked[a.user] ? ' checked' : '') + ' aria-label="Select ' + a.user + '">';
        listEl.appendChild(li);
      });
    }

    document.getElementById(countId).textContent =
      rows.length === 0 ? 'No records' : rows.length + (rows.length === 1 ? ' record' : ' records');
    document.getElementById(posId).textContent = rows.length === 0 ? '0/0' : '1/1';
    document.getElementById(allId).checked = rows.length > 0 && rows.every(a => a2sChecked[a.user]);
  }

  function renderA2s() {
    renderA2sPane('assigned', a2sAssignedList, 'a2sAssignedCount', 'a2sAssignedPos', 'a2sAssignedAll');
    renderA2sPane('available', a2sAvailableList, 'a2sAvailableCount', 'a2sAvailablePos', 'a2sAvailableAll');
    document.getElementById('a2sMoveRight').disabled = !a2sAssigned.some(u => a2sChecked[u]);
    document.getElementById('a2sMoveLeft').disabled = !a2sAvailable.some(u => a2sChecked[u]);
  }

  [a2sAssignedList, a2sAvailableList].forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-user]');
      if (!li) return;
      a2sChecked[li.dataset.user] = !a2sChecked[li.dataset.user];
      renderA2s();
    });
  });

  document.getElementById('a2sMoveRight').addEventListener('click', () => {
    const moving = a2sAssigned.filter(u => a2sChecked[u]);
    a2sAssigned = a2sAssigned.filter(u => !a2sChecked[u]);
    a2sAvailable = a2sAvailable.concat(moving);
    moving.forEach(u => { a2sChecked[u] = false; });
    renderA2s();
  });

  document.getElementById('a2sMoveLeft').addEventListener('click', () => {
    const moving = a2sAvailable.filter(u => a2sChecked[u]);
    a2sAvailable = a2sAvailable.filter(u => !a2sChecked[u]);
    a2sAssigned = a2sAssigned.concat(moving);
    moving.forEach(u => { a2sChecked[u] = false; });
    renderA2s();
  });

  document.getElementById('a2sAssignedAll').addEventListener('change', (e) => {
    a2sRowsFor('assigned').forEach(a => { a2sChecked[a.user] = e.target.checked; });
    renderA2s();
  });

  document.getElementById('a2sAvailableAll').addEventListener('change', (e) => {
    a2sRowsFor('available').forEach(a => { a2sChecked[a.user] = e.target.checked; });
    renderA2s();
  });

  document.getElementById('a2sAssignedFilter').addEventListener('input', (e) => {
    a2sFilter.assigned = e.target.value.trim().toLowerCase();
    renderA2s();
  });

  document.getElementById('a2sAvailableFilter').addEventListener('input', (e) => {
    a2sFilter.available = e.target.value.trim().toLowerCase();
    renderA2s();
  });

  document.querySelectorAll('.sup-sort[data-a2sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.a2sort;
      a2sSort[side] = -a2sSort[side];
      btn.querySelector('.arrow').innerHTML = a2sSort[side] === 1 ? '&#9650;' : '&#9660;';
      renderA2s();
    });
  });

  document.getElementById('a2sSave').addEventListener('click', () => {
    skillAgents[currentSkill] = a2sAssigned.slice();
    const skillRow = SKILLS.find(s => s.name === currentSkill);
    if (skillRow) skillRow.agents = a2sAssigned.length;
    renderSkillList();
    alert('Saved. ' + currentSkill + ' now has ' + a2sAssigned.length + ' assigned agent(s).');
  });

  document.getElementById('a2sCancel').addEventListener('click', () => {
    selectSkill(currentSkill);
  });

  /* ---------- Init ---------- */
  selectSkill(initialSkillName());
});
