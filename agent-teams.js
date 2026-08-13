document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (14 records) ---------- */
  const teams = [
    { name: 'A_Sales',         description: 'A_Sales',                 supervisors: 2, agents: 3 },
    { name: 'CumulusAll',      description: 'Cumulus All Team',        supervisors: 0, agents: 0 },
    { name: 'CumulusCallGen',  description: 'Cumulus Call Gen Team',   supervisors: 0, agents: 1 },
    { name: 'CumulusCity',     description: 'Cumulus City Team',       supervisors: 1, agents: 0 },
    { name: 'CumulusCRM',      description: 'Cumulus CRM Team',        supervisors: 1, agents: 1 },
    { name: 'CumulusFinance',  description: 'Cumulus Finance Team',    supervisors: 1, agents: 0 },
    { name: 'CumulusHealth',   description: 'Cumulus HealthCare Team', supervisors: 1, agents: 0 },
    { name: 'CumulusMain',     description: 'Cumulus Main Team',       supervisors: 1, agents: 2 },
    { name: 'CumulusMobile',   description: 'Cumulus Mobile Team',     supervisors: 1, agents: 0 },
    { name: 'CumulusOutbound', description: 'Cumulus Outbound Team',   supervisors: 1, agents: 1 },
    { name: 'CumulusTravel',   description: 'Cumulus Travel Team',     supervisors: 1, agents: 0 },
    { name: 'CumulusUtility',  description: 'Cumulus Utility Team',    supervisors: 1, agents: 0 },
    { name: 'CumulusUWF',      description: 'Cumulus UFW Team',        supervisors: 1, agents: 2 },
    { name: 'VBCTeam',         description: '',                        supervisors: 0, agents: 0 }
  ];

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { name: '', description: '', supervisors: '', agents: '' };
  let sortKey = 'name';
  let sortDir = 1;

  function visibleRows() {
    return teams
      .map((t, i) => ({ t, i }))
      .filter(({ t }) =>
        t.name.toLowerCase().includes(filters.name) &&
        t.description.toLowerCase().includes(filters.description) &&
        String(t.supervisors).includes(filters.supervisors) &&
        String(t.agents).includes(filters.agents)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = a.t[sortKey], vb = b.t[sortKey];
        if (typeof va === 'number') return (va - vb) * sortDir;
        return String(va).localeCompare(String(vb)) * sortDir;
      });
  }

  function render() {
    const rows = visibleRows();
    body.innerHTML = '';

    rows.forEach(({ t, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        '<td class="cell-left">' + t.name + '</td>' +
        '<td>' + (t.description || '<span class="im-muted">&mdash;</span>') + '</td>' +
        '<td><span class="sup-cell">' +
          '<svg class="warn-icon" title="No primary supervisor assigned"><use href="#icon-warning"/></svg>' +
          '<span class="sup-count' + (t.supervisors === 0 ? ' zero' : '') + '">' + t.supervisors + '</span>' +
        '</span></td>' +
        '<td><span class="count-pill' + (t.agents === 0 ? ' zero' : '') + '">' + t.agents + '</span></td>' +
        '<td class="col-actions">' +
          '<button class="row-btn edit-btn" title="Edit team"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="row-btn agents-btn" title="Team members"><svg class="icon"><use href="#icon-user"/></svg></button>' +
          '<button class="row-btn sup-btn" title="Edit Supervisor"><svg class="icon"><use href="#icon-eye"/></svg></button>' +
          '<button class="row-btn move-btn" title="Edit Reasons"><svg class="icon"><use href="#icon-shuffle"/></svg></button>' +
          '<button class="row-btn save-btn" title="Save as template"><svg class="icon"><use href="#icon-save"/></svg></button>' +
          '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
          '<button class="row-btn data-btn" title="Team report"><svg class="icon"><use href="#icon-table"/></svg></button>' +
        '</td>';
      body.appendChild(tr);
    });

    recordCount.textContent = rows.length;
    noRecords.hidden = rows.length > 0;
  }

  /* ---------- Row interactions ---------- */
  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const team = teams[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      openEditModal(team);
      return;
    }
    if (e.target.closest('.agents-btn')) {
      alert(team.name + '\n\nActive agents: ' + team.agents +
            '\nSupervisors: ' + team.supervisors);
      return;
    }
    if (e.target.closest('.sup-btn')) {
      openSupModal(team);
      return;
    }
    if (e.target.closest('.move-btn')) {
      openReasonModal(team);
      return;
    }
    if (e.target.closest('.save-btn')) {
      alert(team.name + ' saved as a team template.');
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (team.agents > 0) {
        alert('Cannot delete "' + team.name + '" — ' + team.agents + ' agents are still assigned.');
        return;
      }
      if (confirm('Delete team "' + team.name + '"?')) {
        teams.splice(teams.indexOf(team), 1);
        render();
      }
      return;
    }
    if (e.target.closest('.data-btn')) {
      alert('Team report for ' + team.name);
      return;
    }

    const caret = e.target.closest('.row-caret');
    if (caret) {
      const next = tr.nextElementSibling;
      if (next && next.classList.contains('detail-row')) {
        next.remove();
        caret.classList.remove('open');
        return;
      }
      const detail = document.createElement('tr');
      detail.className = 'detail-row';
      detail.innerHTML =
        '<td colspan="6"><div class="detail-grid">' +
          '<div><span>Team Name</span>' + team.name + '</div>' +
          '<div><span>Primary Supervisors</span>' + team.supervisors + '</div>' +
          '<div><span>Active Agents</span>' + team.agents + '</div>' +
          '<div><span>Primary Supervisor</span>' +
            (team.supervisors === 0 ? 'Not assigned' : 'Assigned') + '</div>' +
          '<div class="wide"><span>Description</span>' +
            (team.description || 'No description') + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

  /* ---------- Edit team dialog ---------- */
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const nameInput = document.getElementById('teamNameInput');
  const descInput = document.getElementById('teamDescInput');
  let editing = null;

  function openEditModal(team) {
    editing = team;
    modalTitle.textContent = 'Edit Team: ' + team.name;
    nameInput.value = team.name;
    descInput.value = team.description;
    nameInput.classList.remove('invalid');
    modal.hidden = false;
    nameInput.focus();
    nameInput.select();
  }

  function closeEditModal() {
    modal.hidden = true;
    editing = null;
  }

  function saveEditModal() {
    const name = nameInput.value.trim();
    if (name === '') {
      nameInput.classList.add('invalid');
      nameInput.focus();
      return;
    }
    editing.name = name;
    editing.description = descInput.value.trim();
    closeEditModal();
    render();
  }

  document.getElementById('modalSave').addEventListener('click', saveEditModal);
  document.getElementById('modalCancel').addEventListener('click', closeEditModal);
  document.getElementById('modalClose').addEventListener('click', closeEditModal);

  /* Click on the dark backdrop closes it, clicks inside do not */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEditModal();
  });

  nameInput.addEventListener('input', () => nameInput.classList.remove('invalid'));

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeEditModal();
    if (e.key === 'Enter' && e.target === nameInput) saveEditModal();
  });

  /* ---------- Manage supervisors dialog ---------- */
  const SUPERVISORS = [
    { user: 'bbrown',      name: 'Brown , Beacham' },
    { user: 'csupervisor', name: 'Superviso , Cathy' },
    { user: 'jabracks',    name: 'Brackett , James' },
    { user: 'Jdoe',        name: 'Doe , Jane' },
    { user: 'rbarrows',    name: 'Barrows , Rick' }
  ];

  /* Which supervisors each team already has (seeded from its count) */
  const teamSupervisors = {};
  teams.forEach(t => {
    teamSupervisors[t.name] = SUPERVISORS.slice(0, t.supervisors).map(s => s.user);
  });

  const supModal = document.getElementById('supModal');
  const assignedList = document.getElementById('assignedList');
  const availableList = document.getElementById('availableList');
  let supTeam = null;
  let assigned = [];
  let available = [];
  let checked = {};          // user -> true
  let primary = null;
  const supFilter = { assigned: '', available: '' };
  const supSort = { assigned: 1, available: 1 };

  function openSupModal(team) {
    supTeam = team;
    assigned = (teamSupervisors[team.name] || []).slice();
    available = SUPERVISORS.map(s => s.user).filter(u => assigned.indexOf(u) === -1);
    checked = {};
    primary = assigned.length ? assigned[0] : null;
    supFilter.assigned = supFilter.available = '';
    document.getElementById('assignedFilter').value = '';
    document.getElementById('availableFilter').value = '';
    document.getElementById('supTitle').textContent = 'Manage Supervisors: ' + team.name;
    supModal.hidden = false;
    renderSup();
  }

  function closeSupModal() {
    supModal.hidden = true;
    supTeam = null;
  }

  function rowsFor(side) {
    const users = side === 'assigned' ? assigned : available;
    return users
      .map(u => SUPERVISORS.find(s => s.user === u))
      .filter(s => (s.user + ' ' + s.name).toLowerCase().includes(supFilter[side]))
      .sort((a, b) => a.user.toLowerCase().localeCompare(b.user.toLowerCase()) * supSort[side]);
  }

  function renderPane(side, listEl, countId, posId, allId) {
    const rows = rowsFor(side);
    listEl.innerHTML = '';

    if (rows.length === 0) {
      listEl.innerHTML = '<li class="sup-empty-list">No records</li>';
    } else {
      rows.forEach(s => {
        const li = document.createElement('li');
        li.dataset.user = s.user;
        li.dataset.side = side;
        if (checked[s.user]) li.classList.add('checked');
        li.innerHTML =
          '<svg class="sup-avatar' + (primary === s.user ? ' primary' : '') + '"' +
            ' title="' + (primary === s.user ? 'Primary supervisor' : 'Set as primary') + '">' +
            '<use href="#icon-user"/></svg>' +
          '<span class="who"><b>' + s.user + '</b> - <i>' + s.name + '</i></span>' +
          '<input type="checkbox"' + (checked[s.user] ? ' checked' : '') + ' aria-label="Select ' + s.user + '">';
        listEl.appendChild(li);
      });
    }

    document.getElementById(countId).textContent =
      rows.length === 0 ? 'No records' : rows.length + ' records';
    document.getElementById(posId).textContent = rows.length === 0 ? '0/0' : '1/1';
    document.getElementById(allId).checked =
      rows.length > 0 && rows.every(s => checked[s.user]);
  }

  function renderSup() {
    renderPane('assigned', assignedList, 'assignedCount', 'assignedPos', 'assignedAll');
    renderPane('available', availableList, 'availableCount', 'availablePos', 'availableAll');

    const p = SUPERVISORS.find(s => s.user === primary);
    document.getElementById('supPrimary').textContent =
      p ? p.user + ' - ' + p.name : 'No primary supervisor selected';

    document.getElementById('moveRight').disabled = !assigned.some(u => checked[u]);
    document.getElementById('moveLeft').disabled = !available.some(u => checked[u]);
  }

  /* Row click: checkbox toggles selection, avatar sets the primary supervisor */
  [assignedList, availableList].forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-user]');
      if (!li) return;
      const user = li.dataset.user;

      if (e.target.closest('.sup-avatar')) {
        if (li.dataset.side === 'assigned') {
          primary = primary === user ? null : user;
          renderSup();
        }
        return;
      }
      checked[user] = !checked[user];
      renderSup();
    });
  });

  /* Move buttons */
  document.getElementById('moveRight').addEventListener('click', () => {
    const moving = assigned.filter(u => checked[u]);
    assigned = assigned.filter(u => !checked[u]);
    available = available.concat(moving);
    moving.forEach(u => { checked[u] = false; if (primary === u) primary = null; });
    renderSup();
  });

  document.getElementById('moveLeft').addEventListener('click', () => {
    const moving = available.filter(u => checked[u]);
    available = available.filter(u => !checked[u]);
    assigned = assigned.concat(moving);
    moving.forEach(u => { checked[u] = false; });
    renderSup();
  });

  /* Select all per pane */
  document.getElementById('assignedAll').addEventListener('change', (e) => {
    rowsFor('assigned').forEach(s => { checked[s.user] = e.target.checked; });
    renderSup();
  });

  document.getElementById('availableAll').addEventListener('change', (e) => {
    rowsFor('available').forEach(s => { checked[s.user] = e.target.checked; });
    renderSup();
  });

  /* Filters and sorting */
  document.getElementById('assignedFilter').addEventListener('input', (e) => {
    supFilter.assigned = e.target.value.trim().toLowerCase();
    renderSup();
  });

  document.getElementById('availableFilter').addEventListener('input', (e) => {
    supFilter.available = e.target.value.trim().toLowerCase();
    renderSup();
  });

  document.querySelectorAll('.sup-sort').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.sort;
      supSort[side] = -supSort[side];
      btn.querySelector('.arrow').innerHTML = supSort[side] === 1 ? '&#9650;' : '&#9660;';
      renderSup();
    });
  });

  /* Save / close */
  document.getElementById('supSave').addEventListener('click', () => {
    teamSupervisors[supTeam.name] = assigned.slice();
    supTeam.supervisors = assigned.length;
    closeSupModal();
    render();
  });

  document.getElementById('supCancel').addEventListener('click', closeSupModal);
  document.getElementById('supClose').addEventListener('click', closeSupModal);

  supModal.addEventListener('click', (e) => {
    if (e.target === supModal) closeSupModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!supModal.hidden && e.key === 'Escape') closeSupModal();
  });

  /* ---------- Edit reasons dialog ---------- */
  const REASONS = {
    notready: ['Break', 'Lunch', 'Meeting', 'Training', 'Coaching', 'System Issue',
               'Personal', 'Back Office Work', 'Team Huddle'],
    wrapup:   ['Sale Completed', 'Sale Declined', 'Information Provided', 'Complaint Logged',
               'Callback Scheduled', 'Transferred to Specialist', 'No Action Required'],
    signout:  ['End of Shift', 'Shift Change', 'System Restart', 'Emergency',
               'Scheduled Leave', 'Meeting Offsite']
  };
  const TAB_LABEL = { notready: 'Not Ready', wrapup: 'Wrap Up', signout: 'Sign Out' };

  /* Per team, per tab: which reasons are assigned */
  const teamReasons = {};
  function reasonState(teamName) {
    if (!teamReasons[teamName]) {
      teamReasons[teamName] = { notready: [], wrapup: [], signout: [] };
    }
    return teamReasons[teamName];
  }

  const reasonModal = document.getElementById('reasonModal');
  const rAssignedList = document.getElementById('rAssignedList');
  const rAvailableList = document.getElementById('rAvailableList');
  let reasonTeam = null;
  let activeTab = 'notready';
  let rAssigned = [];
  let rAvailable = [];
  let rChecked = {};
  const rFilter = { assigned: '', available: '' };
  const rSort = { assigned: 1, available: 1 };

  function loadTab(tab) {
    activeTab = tab;
    const state = reasonState(reasonTeam.name);
    rAssigned = state[tab].slice();
    rAvailable = REASONS[tab].filter(r => rAssigned.indexOf(r) === -1);
    rChecked = {};
    rFilter.assigned = rFilter.available = '';
    document.getElementById('rAssignedFilter').value = '';
    document.getElementById('rAvailableFilter').value = '';
    document.querySelectorAll('#reasonTabs .modal-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === tab));
    renderReasons();
  }

  function openReasonModal(team) {
    reasonTeam = team;
    document.getElementById('reasonTitle').textContent = 'Edit Reasons for Team: ' + team.name;
    reasonModal.hidden = false;
    loadTab('notready');
  }

  function closeReasonModal() {
    reasonModal.hidden = true;
    reasonTeam = null;
  }

  /* Persist the current tab before switching away or saving */
  function stashTab() {
    reasonState(reasonTeam.name)[activeTab] = rAssigned.slice();
  }

  function rRowsFor(side) {
    const list = side === 'assigned' ? rAssigned : rAvailable;
    return list
      .filter(r => r.toLowerCase().includes(rFilter[side]))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()) * rSort[side]);
  }

  function renderReasonPane(side, listEl, countId, posId, allId) {
    const rows = rRowsFor(side);
    listEl.innerHTML = '';

    if (rows.length === 0) {
      listEl.innerHTML = '<li class="sup-empty-list">No records</li>';
    } else {
      rows.forEach(r => {
        const li = document.createElement('li');
        li.dataset.reason = r;
        if (rChecked[r]) li.classList.add('checked');
        li.innerHTML =
          '<span class="who"><b>' + r + '</b></span>' +
          '<input type="checkbox"' + (rChecked[r] ? ' checked' : '') + ' aria-label="Select ' + r + '">';
        listEl.appendChild(li);
      });
    }

    document.getElementById(countId).textContent =
      rows.length === 0 ? 'No records' : rows.length + ' records';
    document.getElementById(posId).textContent = rows.length === 0 ? '0/0' : '1/1';
    document.getElementById(allId).checked = rows.length > 0 && rows.every(r => rChecked[r]);
  }

  function renderReasons() {
    renderReasonPane('assigned', rAssignedList, 'rAssignedCount', 'rAssignedPos', 'rAssignedAll');
    renderReasonPane('available', rAvailableList, 'rAvailableCount', 'rAvailablePos', 'rAvailableAll');
    document.getElementById('rMoveRight').disabled = !rAssigned.some(r => rChecked[r]);
    document.getElementById('rMoveLeft').disabled = !rAvailable.some(r => rChecked[r]);
  }

  [rAssignedList, rAvailableList].forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-reason]');
      if (!li) return;
      const reason = li.dataset.reason;
      rChecked[reason] = !rChecked[reason];
      renderReasons();
    });
  });

  document.getElementById('rMoveRight').addEventListener('click', () => {
    const moving = rAssigned.filter(r => rChecked[r]);
    rAssigned = rAssigned.filter(r => !rChecked[r]);
    rAvailable = rAvailable.concat(moving);
    moving.forEach(r => { rChecked[r] = false; });
    renderReasons();
  });

  document.getElementById('rMoveLeft').addEventListener('click', () => {
    const moving = rAvailable.filter(r => rChecked[r]);
    rAvailable = rAvailable.filter(r => !rChecked[r]);
    rAssigned = rAssigned.concat(moving);
    moving.forEach(r => { rChecked[r] = false; });
    renderReasons();
  });

  document.getElementById('rAssignedAll').addEventListener('change', (e) => {
    rRowsFor('assigned').forEach(r => { rChecked[r] = e.target.checked; });
    renderReasons();
  });

  document.getElementById('rAvailableAll').addEventListener('change', (e) => {
    rRowsFor('available').forEach(r => { rChecked[r] = e.target.checked; });
    renderReasons();
  });

  document.getElementById('rAssignedFilter').addEventListener('input', (e) => {
    rFilter.assigned = e.target.value.trim().toLowerCase();
    renderReasons();
  });

  document.getElementById('rAvailableFilter').addEventListener('input', (e) => {
    rFilter.available = e.target.value.trim().toLowerCase();
    renderReasons();
  });

  document.querySelectorAll('.sup-sort[data-rsort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.rsort;
      rSort[side] = -rSort[side];
      btn.querySelector('.arrow').innerHTML = rSort[side] === 1 ? '&#9650;' : '&#9660;';
      renderReasons();
    });
  });

  /* Tabs keep the edits made on the tab you are leaving */
  document.getElementById('reasonTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.modal-tab');
    if (!tab || tab.dataset.tab === activeTab) return;
    stashTab();
    loadTab(tab.dataset.tab);
  });

  document.getElementById('reasonSave').addEventListener('click', () => {
    stashTab();
    const state = reasonState(reasonTeam.name);
    const total = state.notready.length + state.wrapup.length + state.signout.length;
    closeReasonModal();
    console.log('Reasons saved: ' + total + ' assigned across ' +
      Object.keys(TAB_LABEL).map(t => TAB_LABEL[t]).join(', '));
  });

  document.getElementById('reasonCancel').addEventListener('click', closeReasonModal);
  document.getElementById('reasonClose').addEventListener('click', closeReasonModal);

  reasonModal.addEventListener('click', (e) => {
    if (e.target === reasonModal) closeReasonModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!reasonModal.hidden && e.key === 'Escape') closeReasonModal();
  });

  /* ---------- Filters ---------- */
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', () => {
      filters[input.dataset.filter] = input.value.trim().toLowerCase();
      render();
    });
  });

  /* ---------- Sorting ---------- */
  document.querySelectorAll('.head-row th[data-key]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      sortDir = sortKey === key ? -sortDir : 1;
      sortKey = key;
      document.querySelectorAll('.head-row th').forEach(h =>
        h.classList.remove('sorted-asc', 'sorted-desc'));
      th.classList.add(sortDir === 1 ? 'sorted-asc' : 'sorted-desc');
      render();
    });
  });

  /* ---------- Actions menu ---------- */
  const actionsMenu = document.getElementById('actionsMenu');

  document.getElementById('actionsBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    actionsMenu.hidden = !actionsMenu.hidden;
  });

  document.addEventListener('click', () => { actionsMenu.hidden = true; });

  actionsMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.action === 'new') {
      const name = prompt('New team name:');
      if (name && name.trim()) {
        teams.push({ name: name.trim(), description: name.trim() + ' Team', supervisors: 0, agents: 0 });
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Team Name,Description,Primary Supervisor Count,Active Agents']
        .concat(visibleRows().map(({ t }) =>
          ['"' + t.name + '"', '"' + t.description + '"', t.supervisors, t.agents].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agent-teams.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    render();
  });

  render();
});
