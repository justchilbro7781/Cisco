document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (21 records) ---------- */
  const reasons = [
    { reason: 'Agent Logout Request', description: 'If not already in the Logout state, request is made to place agent in the Not Ready state', global: true, teams: 0 },
    { reason: 'Call Not Answered', description: 'Agent state changed because the agent did not answer the call', global: true, teams: 0 },
    { reason: 'Call Overlap', description: 'Agent was set to Not Ready state because the agent was routed two consecutive calls', global: true, teams: 0 },
    { reason: 'Connection Failure', description: 'The system issues this reason code when the agent is forcibly logged out in certain cases', global: true, teams: 0 },
    { reason: 'Connection Failure', description: 'The system issues this reason code when the agent is forcibly logged out when a connection failure occurs', global: true, teams: 0 },
    { reason: 'Device Conflict', description: 'If an agent is logged in to a dynamic device target that is using the same dial number as the PG', global: true, teams: 0 },
    { reason: 'Device Error', description: 'Agent was logged out because the Unified CM reported the device out of service', global: true, teams: 0 },
    { reason: 'Extension Modified', description: "An administrator modified the agent's extension while the agent was logged in", global: true, teams: 0 },
    { reason: 'Force Logout', description: 'Forces the logout request, for example, when Agent A attempts to log in to Cisco Finesse', global: true, teams: 0 },
    { reason: 'Inactivity Timeout', description: 'Agent was logged out due to agent inactivity as configured in agent desk settings', global: true, teams: 0 },
    { reason: 'Mobile Agent Call Fail', description: 'Mobile agent was logged out because the call failed', global: true, teams: 0 },
    { reason: 'Mobile Agent Call Not Answered', description: 'Mobile agent state changed to Not Ready because the call fails when the mobile agent does not answer', global: true, teams: 0 },
    { reason: 'Mobile Agent Disconnect', description: 'Mobile agent was logged out because the phone line disconnected while using nailed connection mode', global: true, teams: 0 },
    { reason: 'Non ACD Busy', description: 'When the Agent Phone Line Control is enabled in the peripheral and the Non ACD line impact is configured', global: true, teams: 0 },
    { reason: 'Offhook', description: 'The agent takes the phone off the hook to place a call. If the agent remembers to enter a reason code', global: true, teams: 0 },
    { reason: 'Queue Change', description: "Agent was logged out when the agent's skill group dynamically changed on the Administration & Data Server", global: true, teams: null },
    { reason: 'Starting Force Logout', description: 'Places the agent in the Not Ready state first before forcefully logging them off', global: true, teams: null },
    { reason: 'Supervisor Initiated', description: "The system issues this reason code when the agent's state is forcibly changed by the supervisor", global: true, teams: null },
    { reason: 'System Disconnect', description: 'The CTI OS client disconnected, logging the agent out.', global: true, teams: null },
    { reason: 'System Reinitialized', description: 'Agent reinitialized (used if peripheral restarts)', global: true, teams: null },
    { reason: 'System Reset', description: 'PG reset the agent, normally due to a PG failure', global: true, teams: null }
  ];

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { reason: '', description: '', global: '', teams: '' };
  let sortKey = null;
  let sortDir = 1;

  /* ---------- Render ---------- */
  function visibleRows() {
    return reasons
      .map((r, i) => ({ r, i }))
      .filter(({ r }) =>
        r.reason.toLowerCase().includes(filters.reason) &&
        r.description.toLowerCase().includes(filters.description) &&
        (filters.global === '' || (filters.global === 'yes') === r.global) &&
        (filters.teams === '' || String(r.teams === null ? '' : r.teams).includes(filters.teams))
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = a.r[sortKey], vb = b.r[sortKey];
        if (typeof va === 'boolean') return (va === vb ? 0 : va ? 1 : -1) * sortDir;
        if (sortKey === 'teams') return ((va || 0) - (vb || 0)) * sortDir;
        return String(va).localeCompare(String(vb)) * sortDir;
      });
  }

  function render() {
    const rows = visibleRows();
    body.innerHTML = '';

    rows.forEach(({ r, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        '<td>' + r.reason + '</td>' +
        '<td class="cell-desc" title="' + r.description.replace(/"/g, '&quot;') + '">' + r.description + '</td>' +
        '<td>' + (r.global
          ? '<svg class="globe-icon" title="Global"><use href="#icon-globe"/></svg>'
          : '') + '</td>' +
        '<td>' + (r.teams === null ? '' : r.teams) + '</td>' +
        '<td class="col-actions">' +
          '<button class="row-btn edit-btn" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
          '<button class="row-btn teams-btn" title="Assign teams"><svg class="icon"><use href="#icon-table"/></svg></button>' +
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
    const item = reasons[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      const text = prompt('Edit reason:', item.reason);
      if (text !== null && text.trim() !== '') {
        item.reason = text.trim();
        render();
      }
      return;
    }

    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete reason "' + item.reason + '"?')) {
        reasons.splice(reasons.indexOf(item), 1);
        render();
      }
      return;
    }

    if (e.target.closest('.teams-btn')) {
      const count = prompt('Assigned teams for "' + item.reason + '":', item.teams === null ? '0' : item.teams);
      if (count !== null && !isNaN(count)) {
        item.teams = Number(count);
        render();
      }
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
          '<div><span>Reason</span>' + item.reason + '</div>' +
          '<div><span>Global Display</span>' + (item.global ? 'Yes' : 'No') + '</div>' +
          '<div><span>Assigned Teams</span>' + (item.teams === null ? '0' : item.teams) + '</div>' +
          '<div class="wide"><span>Description</span>' + item.description + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

  /* ---------- Filters ---------- */
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', () => {
      filters[input.dataset.filter] = input.value.trim().toLowerCase();
      render();
    });
  });

  document.querySelector('.filter-select').addEventListener('change', (e) => {
    filters.global = e.target.value;
    render();
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
  const actionsBtn = document.getElementById('actionsBtn');
  const actionsMenu = document.getElementById('actionsMenu');

  actionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    actionsMenu.hidden = !actionsMenu.hidden;
  });

  document.addEventListener('click', () => { actionsMenu.hidden = true; });

  actionsMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.action === 'new') {
      const name = prompt('New reason:');
      if (name && name.trim()) {
        reasons.push({ reason: name.trim(), description: name.trim(), global: true, teams: 0 });
        render();
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Reason,Description,Global Display,Assigned Teams']
        .concat(visibleRows().map(({ r }) =>
          ['"' + r.reason + '"', '"' + r.description + '"', r.global ? 'Yes' : 'No',
           r.teams === null ? '' : r.teams].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reasons.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      render();
    }
  });

  render();
});
