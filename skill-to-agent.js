document.addEventListener('DOMContentLoaded', () => {
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

  /* ---------- Skill list (same set used on Agent to Skill) ---------- */
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

  /* Seed the same skill -> agents assignment used on Agent to Skill, then
     invert it into agent -> skills so both pages feel consistent. */
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

  const agentSkills = {};
  AGENTS.forEach(a => { agentSkills[a.user] = []; });
  SKILLS.forEach(s => {
    skillAgents[s.name].forEach(user => {
      if (agentSkills[user]) agentSkills[user].push(s.name);
    });
  });

  function skillsFor(user) {
    if (!agentSkills[user]) agentSkills[user] = [];
    return agentSkills[user];
  }

  /* ---------- Left agent picker ---------- */
  const agentListEl = document.getElementById('s2aAgentList');
  let currentAgent = null;
  let agentFilter = '';
  let agentSortDir = 1;

  function agentRows() {
    return AGENTS
      .filter(a => (a.user + ' ' + a.name).toLowerCase().includes(agentFilter))
      .sort((a, b) => a.user.toLowerCase().localeCompare(b.user.toLowerCase()) * agentSortDir);
  }

  function renderAgentList() {
    const rows = agentRows();
    agentListEl.innerHTML = rows.length === 0
      ? '<li class="sup-empty-list">No records</li>'
      : rows.map(a =>
          '<li class="' + (a.user === currentAgent ? 'skill-selected' : '') + '" data-agent="' + a.user + '">' +
            '<svg class="sup-avatar"><use href="#icon-user"/></svg>' +
            '<span class="who"><b>' + a.user + '</b> - <i>' + a.name + '</i></span>' +
          '</li>'
        ).join('');

    document.getElementById('s2aAgentCount').textContent =
      rows.length === 0 ? 'No records' : rows.length + (rows.length === 1 ? ' record' : ' records');
    document.getElementById('s2aAgentPos').textContent = rows.length === 0 ? '0/0' : '1/1';
  }

  agentListEl.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-agent]');
    if (!li) return;
    selectAgent(li.dataset.agent);
  });

  document.getElementById('s2aAgentSearch').addEventListener('input', (e) => {
    agentFilter = e.target.value.trim().toLowerCase();
    renderAgentList();
  });

  document.querySelector('[data-agsort="username"]').addEventListener('click', (e) => {
    agentSortDir = -agentSortDir;
    e.currentTarget.querySelector('.arrow').innerHTML = agentSortDir === 1 ? '&#9650;' : '&#9660;';
    renderAgentList();
  });

  /* ---------- Assigned / Available skill panes ---------- */
  const s2aAssignedList = document.getElementById('s2aAssignedList');
  const s2aAvailableList = document.getElementById('s2aAvailableList');
  let s2aAssigned = [];
  let s2aAvailable = [];
  let s2aChecked = {};
  const s2aFilter = { assigned: '', available: '' };
  const s2aSort = { assigned: 1, available: 1 };

  function selectAgent(user) {
    currentAgent = user;
    const agent = AGENTS.find(a => a.user === user);
    const label = agent ? '— ' + agent.user + ' (' + agent.name + ')' : '';
    document.getElementById('s2aAssignedAgentName').textContent = label;
    document.getElementById('s2aAvailableAgentName').textContent = label;

    s2aAssigned = skillsFor(user).slice();
    s2aAvailable = SKILLS.map(s => s.name).filter(n => s2aAssigned.indexOf(n) === -1);
    s2aChecked = {};
    s2aFilter.assigned = s2aFilter.available = '';
    document.getElementById('s2aAssignedFilter').value = '';
    document.getElementById('s2aAvailableFilter').value = '';
    renderAgentList();
    renderS2a();
  }

  function s2aRowsFor(side) {
    const list = side === 'assigned' ? s2aAssigned : s2aAvailable;
    return list
      .filter(n => n.toLowerCase().includes(s2aFilter[side]))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()) * s2aSort[side]);
  }

  function renderS2aPane(side, listEl, countId, posId, allId) {
    const rows = s2aRowsFor(side);
    listEl.innerHTML = '';

    if (!currentAgent) {
      listEl.innerHTML = '<li class="sup-empty-list">No records</li>';
    } else if (rows.length === 0) {
      listEl.innerHTML = '<li class="sup-empty-list">No records</li>';
    } else {
      rows.forEach(name => {
        const li = document.createElement('li');
        li.dataset.skill = name;
        if (s2aChecked[name]) li.classList.add('checked');
        li.innerHTML =
          '<svg class="sup-avatar"><use href="#icon-search"/></svg>' +
          '<span class="who"><b>' + name + '</b></span>' +
          '<input type="checkbox"' + (s2aChecked[name] ? ' checked' : '') + ' aria-label="Select ' + name + '">';
        listEl.appendChild(li);
      });
    }

    const count = currentAgent ? rows.length : 0;
    document.getElementById(countId).textContent =
      count === 0 ? 'No records' : count + (count === 1 ? ' record' : ' records');
    document.getElementById(posId).textContent = count === 0 ? '0/0' : '1/1';
    document.getElementById(allId).checked = count > 0 && rows.every(n => s2aChecked[n]);
  }

  function renderS2a() {
    renderS2aPane('assigned', s2aAssignedList, 's2aAssignedCount', 's2aAssignedPos', 's2aAssignedAll');
    renderS2aPane('available', s2aAvailableList, 's2aAvailableCount', 's2aAvailablePos', 's2aAvailableAll');
    document.getElementById('s2aMoveRight').disabled = !currentAgent || !s2aAssigned.some(n => s2aChecked[n]);
    document.getElementById('s2aMoveLeft').disabled = !currentAgent || !s2aAvailable.some(n => s2aChecked[n]);
  }

  [s2aAssignedList, s2aAvailableList].forEach(list => {
    list.addEventListener('click', (e) => {
      if (!currentAgent) return;
      const li = e.target.closest('li[data-skill]');
      if (!li) return;
      s2aChecked[li.dataset.skill] = !s2aChecked[li.dataset.skill];
      renderS2a();
    });
  });

  document.getElementById('s2aMoveRight').addEventListener('click', () => {
    const moving = s2aAssigned.filter(n => s2aChecked[n]);
    s2aAssigned = s2aAssigned.filter(n => !s2aChecked[n]);
    s2aAvailable = s2aAvailable.concat(moving);
    moving.forEach(n => { s2aChecked[n] = false; });
    renderS2a();
  });

  document.getElementById('s2aMoveLeft').addEventListener('click', () => {
    const moving = s2aAvailable.filter(n => s2aChecked[n]);
    s2aAvailable = s2aAvailable.filter(n => !s2aChecked[n]);
    s2aAssigned = s2aAssigned.concat(moving);
    moving.forEach(n => { s2aChecked[n] = false; });
    renderS2a();
  });

  document.getElementById('s2aAssignedAll').addEventListener('change', (e) => {
    if (!currentAgent) return;
    s2aRowsFor('assigned').forEach(n => { s2aChecked[n] = e.target.checked; });
    renderS2a();
  });

  document.getElementById('s2aAvailableAll').addEventListener('change', (e) => {
    if (!currentAgent) return;
    s2aRowsFor('available').forEach(n => { s2aChecked[n] = e.target.checked; });
    renderS2a();
  });

  document.getElementById('s2aAssignedFilter').addEventListener('input', (e) => {
    s2aFilter.assigned = e.target.value.trim().toLowerCase();
    renderS2a();
  });

  document.getElementById('s2aAvailableFilter').addEventListener('input', (e) => {
    s2aFilter.available = e.target.value.trim().toLowerCase();
    renderS2a();
  });

  document.querySelectorAll('.sup-sort[data-s2sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.s2sort;
      s2aSort[side] = -s2aSort[side];
      btn.querySelector('.arrow').innerHTML = s2aSort[side] === 1 ? '&#9650;' : '&#9660;';
      renderS2a();
    });
  });

  document.getElementById('s2aSave').addEventListener('click', () => {
    if (!currentAgent) {
      alert('Select an agent first.');
      return;
    }
    agentSkills[currentAgent] = s2aAssigned.slice();
    alert('Saved. ' + currentAgent + ' now has ' + s2aAssigned.length + ' assigned skill(s).');
  });

  document.getElementById('s2aCancel').addEventListener('click', () => {
    if (currentAgent) selectAgent(currentAgent);
  });

  /* ---------- Init ---------- */
  renderAgentList();
  renderS2a();
});
