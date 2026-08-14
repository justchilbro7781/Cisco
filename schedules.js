document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (4 records) ---------- */
  const schedules = [
    { name: 'Friday_Rush',            recurrence: 'Weekly',  status: 'failure',   statusLabel: 'Remove Failure',
      start: '03/24/2020 10:00 AM', lastExec: '',                  nextOp: 'Remove',  nextExec: '04/09/2022 06:48 PM', end: '03/24/2020',
      enabled: false,
      skills: ['A_Sales', 'CumulusOutbound'], agents: ['rbarrows', 'sjeffers'] },
    { name: 'Weekend_Overflow',       recurrence: 'Weekly',  status: 'completed', statusLabel: 'Completed',
      start: '03/20/2020 08:00 AM', lastExec: '03/20/2020 08:01 AM', nextOp: 'Enable',  nextExec: '04/16/2022 08:00 AM', end: '',
      enabled: true,
      skills: ['CumulusInbound'], agents: ['bbrown', 'csupervisor'] },
    { name: 'Holiday_Closure_2026',   recurrence: 'Once',    status: 'completed', statusLabel: 'Completed',
      start: '12/25/2025 12:00 AM', lastExec: '12/25/2025 12:00 AM', nextOp: 'Disable', nextExec: '',                    end: '12/25/2025',
      enabled: true,
      skills: ['CumulusCB', 'CumulusTravel'], agents: ['hliang'] },
    { name: 'Cumulus_Monthly_Report', recurrence: 'Monthly', status: 'running',   statusLabel: 'Running',
      start: '08/01/2026 06:00 AM', lastExec: '',                  nextOp: 'Export',  nextExec: '09/01/2026 06:00 AM', end: '',
      enabled: true,
      skills: ['CumulusUWF'], agents: ['jabracks', 'jopeters'] }
  ];

  const STATUS_ICON = { failure: 'icon-warning', completed: 'icon-check-circle', running: 'icon-refresh', success: 'icon-check-circle' };

  const COLUMNS = [
    { key: 'name',      label: 'Schedule Name',           width: '13%', visible: true, sortable: true,
      cell: s => '<span class="sched-name-cell">' + s.name + '</span>', align: 'left' },
    { key: 'recurrence', label: 'Recurrence',              width: '9%',  visible: true, sortable: true,
      cell: s => s.recurrence },
    { key: 'statusLabel', label: 'Last Status',            width: '11%', visible: true, sortable: true,
      cell: s => '<span class="sched-status status-' + s.status + '">' +
        '<svg class="icon"><use href="#' + STATUS_ICON[s.status] + '"/></svg>' + s.statusLabel + '</span>' },
    { key: 'start',     label: 'Start Date/Time',          width: '12%', visible: true, sortable: true,
      cell: s => s.start || '<span class="sched-muted">&mdash;</span>' },
    { key: 'lastExec',  label: 'Last Execution Date/Time', width: '12%', visible: true, sortable: true,
      cell: s => s.lastExec || '<span class="sched-muted">&mdash;</span>' },
    { key: 'nextOp',    label: 'Next Operation',           width: '10%', visible: true, sortable: true,
      cell: s => s.nextOp || '<span class="sched-muted">&mdash;</span>' },
    { key: 'nextExec',  label: 'Next Execution Date/Time', width: '12%', visible: true, sortable: true,
      cell: s => s.nextExec || '<span class="sched-muted">&mdash;</span>' },
    { key: 'end',       label: 'End Date',                 width: '9%',  visible: true, sortable: true,
      cell: s => s.end || '<span class="sched-muted">&mdash;</span>' },
    { key: 'actions',   label: 'Buttons',                  width: '150px', visible: true, sortable: false, isActions: true }
  ];

  const body = document.getElementById('gridBody');
  const gridHead = document.getElementById('gridHead');
  const gridColgroup = document.getElementById('gridColgroup');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const colToggleList = document.getElementById('colToggleList');

  const filters = {};
  COLUMNS.forEach(c => { if (!c.isActions) filters[c.key] = ''; });
  let sortKey = 'start';
  let sortDir = 1;

  function visibleColumns() {
    return COLUMNS.filter(c => c.visible);
  }

  function visibleRows() {
    return schedules
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => COLUMNS.every(c => c.isActions ||
        String(s[c.key] || '').toLowerCase().includes(filters[c.key])))
      .sort((a, b) => {
        if (!sortKey) return 0;
        return String(a.s[sortKey] || '').localeCompare(String(b.s[sortKey] || ''), undefined, { numeric: true }) * sortDir;
      });
  }

  function renderHead() {
    const cols = visibleColumns();
    gridColgroup.innerHTML = '<col style="width:36px">' +
      cols.map(c => '<col style="width:' + c.width + '">').join('');

    gridHead.innerHTML =
      '<tr class="head-row">' +
        '<th class="col-expand"><span class="head-caret"><svg class="icon icon-caret"><use href="#icon-caret"/></svg></span></th>' +
        cols.map(c =>
          '<th' + (c.sortable ? ' data-key="' + c.key + '"' : ' class="col-actions"') +
            (sortKey === c.key ? ' class="sorted-' + (sortDir === 1 ? 'asc' : 'desc') + '"' : '') + '>' +
            c.label +
            (c.sortable ? '<span class="head-caret"><svg class="icon icon-caret"><use href="#icon-caret"/></svg></span>' : '') +
          '</th>'
        ).join('') +
      '</tr>' +
      '<tr class="filter-row">' +
        '<th></th>' +
        cols.map(c =>
          c.isActions ? '<th></th>' :
          '<th><input type="text" class="filter-input" data-filter="' + c.key + '" value="' +
            (filters[c.key] || '') + '"></th>'
        ).join('') +
      '</tr>';

    gridHead.querySelectorAll('th[data-key]').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        sortDir = sortKey === key ? -sortDir : 1;
        sortKey = key;
        renderHead();
        renderBody();
      });
    });

    gridHead.querySelectorAll('.filter-input').forEach(input => {
      input.addEventListener('input', () => {
        filters[input.dataset.filter] = input.value.trim().toLowerCase();
        renderBody();
      });
    });
  }

  function renderBody() {
    const rows = visibleRows();
    const cols = visibleColumns();
    body.innerHTML = '';

    rows.forEach(({ s, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        cols.map(c => {
          if (c.isActions) {
            const enCls  = s.enabled ? 'sched-enable-btn enabled'  : 'sched-enable-btn disabled';
            const enIcon = s.enabled ? 'icon-toggle' : 'icon-toggle';
            const enTip  = s.enabled ? 'Disable schedule' : 'Enable schedule';
            return '<td class="col-actions">' +
              '<button class="row-btn sched-run-btn" title="Run now"><svg class="icon"><use href="#icon-play2"/></svg></button>' +
              '<button class="row-btn edit-btn" title="Edit schedule"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
              '<button class="row-btn ' + enCls + '" title="' + enTip + '"><svg class="icon"><use href="#' + enIcon + '"/></svg></button>' +
              '<button class="row-btn log-btn" title="Schedule audit"><svg class="icon"><use href="#icon-table"/></svg></button>' +
              '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
            '</td>';
          }
          return '<td' + (c.align === 'left' ? ' class="cell-left"' : '') + '>' + c.cell(s) + '</td>';
        }).join('');
      body.appendChild(tr);
    });

    recordCount.textContent = rows.length;
    noRecords.hidden = rows.length > 0;
  }

  function colspan() {
    return visibleColumns().length + 1;
  }

  /* ---------- Row interactions ---------- */
  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const sched = schedules[tr.dataset.index];

    if (e.target.closest('.sched-run-btn')) {
      openRunNowModal(sched);
      return;
    }
    if (e.target.closest('.edit-btn')) {
      openEditSchedModal(sched);
      return;
    }
    if (e.target.closest('.sched-enable-btn')) {
      sched.enabled = !sched.enabled;
      renderBody();
      return;
    }
    if (e.target.closest('.log-btn')) {
      openSchedAuditModal(sched);
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete schedule "' + sched.name + '"?')) {
        schedules.splice(schedules.indexOf(sched), 1);
        renderBody();
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
        '<td colspan="' + colspan() + '"><div class="detail-grid">' +
          '<div><span>Schedule Name</span>' + sched.name + '</div>' +
          '<div><span>Recurrence</span>' + sched.recurrence + '</div>' +
          '<div><span>Last Status</span>' + sched.statusLabel + '</div>' +
          '<div><span>Start Date/Time</span>' + (sched.start || '&mdash;') + '</div>' +
          '<div><span>Next Operation</span>' + (sched.nextOp || '&mdash;') + '</div>' +
          '<div><span>Next Execution</span>' + (sched.nextExec || '&mdash;') + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

  /* ---------- Column visibility checklist ---------- */
  function renderColToggleList() {
    colToggleList.innerHTML = COLUMNS.map(c =>
      '<button class="col-toggle-item ' + (c.visible ? 'on' : 'off') + '" data-col="' + c.key + '">' +
        '<svg class="icon"><use href="#icon-' + (c.visible ? 'check' : 'x-mark') + '"/></svg>' +
        '<span class="col-label">' + c.label + '</span>' +
      '</button>'
    ).join('');
  }

  colToggleList.addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.target.closest('.col-toggle-item');
    if (!btn) return;
    const col = COLUMNS.find(c => c.key === btn.dataset.col);
    col.visible = !col.visible;
    renderColToggleList();
    renderHead();
    renderBody();
  });

  /* ---------- Export helpers ---------- */
  function exportCsv(filename, rows) {
    const header = COLUMNS.filter(c => !c.isActions).map(c => c.label);
    const csv = [header.join(',')]
      .concat(rows.map(s => COLUMNS.filter(c => !c.isActions)
        .map(c => '"' + String(s[c.key] || '') + '"').join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf(rows) {
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to export as PDF.'); return; }
    const cols = COLUMNS.filter(c => !c.isActions);
    const rowsHtml = rows.map(s =>
      '<tr>' + cols.map(c => '<td>' + (s[c.key] || '') + '</td>').join('') + '</tr>'
    ).join('');
    win.document.write(
      '<html><head><title>Schedules export</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#333}' +
      'h2{font-size:15px} table{width:100%;border-collapse:collapse;margin-top:10px}' +
      'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left} th{background:#f2f4f6}' +
      '</style></head><body>' +
      '<h2>Webex Contact Center Enterprise &mdash; Schedules</h2>' +
      '<table><thead><tr>' + cols.map(c => '<th>' + c.label + '</th>').join('') + '</tr></thead>' +
      '<tbody>' + rowsHtml + '</tbody></table></body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  }

  /* ---------- Actions menu ---------- */
  const actionsMenu = document.getElementById('actionsMenu');

  document.getElementById('actionsBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    actionsMenu.hidden = !actionsMenu.hidden;
  });
  document.addEventListener('click', () => { actionsMenu.hidden = true; });

  actionsMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    switch (btn.dataset.action) {
      case 'new':
        openCreateSchedModal();
        break;
      case 'purge': {
        const done = schedules.filter(s => s.status === 'completed').length;
        if (done === 0) {
          alert('There are no completed schedules to purge.');
          break;
        }
        if (confirm('Purge ' + done + ' completed schedule(s)?')) {
          for (let i = schedules.length - 1; i >= 0; i--) {
            if (schedules[i].status === 'completed') schedules.splice(i, 1);
          }
          renderBody();
        }
        break;
      }
      case 'clear-filters':
        Object.keys(filters).forEach(k => { filters[k] = ''; });
        renderHead();
        renderBody();
        break;
      case 'export-all-csv':
        exportCsv('schedules_all.csv', schedules);
        break;
      case 'export-visible-csv':
        exportCsv('schedules_visible.csv', visibleRows().map(({ s }) => s));
        break;
      case 'export-all-pdf':
        exportPdf(schedules);
        break;
      case 'export-visible-pdf':
        exportPdf(visibleRows().map(({ s }) => s));
        break;
    }
  });

  /* ---------- Create Schedule dialog ---------- */
  const CS_SKILLS = [
    { name: 'A_Sales', agents: 2 }, { name: 'AcqueonOutboundAgent', agents: 1 },
    { name: 'AcqueonOutboundIVR', agents: 2 }, { name: 'AcqueonOutboundPreview', agents: 2 },
    { name: 'AcqueonOutboundSimulator', agents: 1 }, { name: 'CIM_CALLBACK', agents: 1 },
    { name: 'CIM_DELAYED', agents: 1 }, { name: 'CIM_EIM', agents: 0 }, { name: 'CIM_WIM', agents: 0 },
    { name: 'Claims', agents: 0 }, { name: 'ConsiliumOutboundAgent', agents: 1 },
    { name: 'ConsiliumOutboundIVR', agents: 1 }, { name: 'ConsiliumOutboundPreview', agents: 1 },
    { name: 'ConsiliumOutboundSimulator', agents: 0 }, { name: 'CumulusCB', agents: 0 },
    { name: 'CumulusCertification', agents: 0 }, { name: 'CumulusChat', agents: 1 },
    { name: 'CumulusChatEnglish', agents: 0 }, { name: 'CumulusChatItalian', agents: 0 },
    { name: 'CumulusChatSpanish', agents: 0 }, { name: 'CumulusCity', agents: 0 },
    { name: 'CumulusEmail', agents: 0 }, { name: 'CumulusFacebook', agents: 0 },
    { name: 'CumulusFinance', agents: 0 }, { name: 'CumulusHealthCare', agents: 0 },
    { name: 'CumulusInbound', agents: 2 }, { name: 'CumulusOutbound', agents: 1 },
    { name: 'CumulusRLM', agents: 0 }, { name: 'CumulusSMS', agents: 0 }, { name: 'CumulusTask', agents: 0 },
    { name: 'CumulusTravel', agents: 0 }, { name: 'CumulusUtility', agents: 0 },
    { name: 'CumulusUWF', agents: 2 }, { name: 'CumulusVIVR', agents: 0 }
  ];

  const CS_AGENTS = [
    { user: 'amacdowell', name: 'MacDowell, Andy' },   { user: 'annika', name: 'Hamilton, Annika' },
    { user: 'bbrown', name: 'Brown, Beacham' },         { user: 'csupervisor', name: 'Supervisor, Cathy' },
    { user: 'hliang', name: 'Liang, Helen' },           { user: 'jabracks', name: 'Bracksted, James' },
    { user: 'Jdoe', name: 'Doe, Jane' },                { user: 'jopeters', name: 'Petreson, Josh' },
    { user: 'rbarrows', name: 'Barrows, Rick' },        { user: 'sjeffers', name: 'Jefferson, Sandra' },
    { user: 'vbcpod1', name: 'POD1, VBC' }
  ];

  const createSchedModal = document.getElementById('createSchedModal');
  const csName = document.getElementById('csName');
  const csDesc = document.getElementById('csDesc');
  const csOperation = document.getElementById('csOperation');
  const csRecurring = document.getElementById('csRecurring');
  const csOnceRow = document.getElementById('csOnceRow');
  const csPatternBox = document.getElementById('csPatternBox');
  const csRecurringDateRow = document.getElementById('csRecurringDateRow');
  const csPattern = document.getElementById('csPattern');
  const csDays = document.getElementById('csDays');
  const csEndGroup = document.getElementById('csEndGroup');
  const csEndDate = document.getElementById('csEndDate');
  const csEndAfter = document.getElementById('csEndAfter');
  const csAddDate = document.getElementById('csAddDate');
  const csAddTime = document.getElementById('csAddTime');
  const csRemoveDate = document.getElementById('csRemoveDate');
  const csRemoveDateTime = document.getElementById('csRemoveDateTime');
  const csStartDate = document.getElementById('csStartDate');
  const csStartTime = document.getElementById('csStartTime');
  const csRemoveTime = document.getElementById('csRemoveTime');
  const csSummary = document.getElementById('csSummary');
  const csSkillList = document.getElementById('csSkillList');
  const csAgentList = document.getElementById('csAgentList');

  let csSkillChecked = {};
  let csAgentChecked = {};
  let csSkillFilter = '';
  let csAgentFilter = '';

  function fmtDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return m + '/' + d + '/' + y;
  }

  function fmtTime(hhmm) {
    if (!hhmm) return '';
    let [h, m] = hhmm.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  function selectedDays() {
    return [...csDays.querySelectorAll('input:checked')].map(cb => cb.value);
  }

  function isRecurring() {
    return csRecurring.classList.contains('on');
  }

  function updateRecurringVisibility() {
    const on = isRecurring();
    csOnceRow.hidden = on;
    csPatternBox.hidden = !on;
    csRecurringDateRow.hidden = !on;
    const removeDateRow = document.getElementById('csRemoveDateRow');
    if (removeDateRow) removeDateRow.hidden = !on;
  }

  function updateEndFields() {
    const type = createSchedModal.querySelector('input[name="csEndType"]:checked').value;
    csEndDate.disabled = type !== 'date';
    csEndAfter.disabled = type !== 'after';
  }

  function updateSummary() {
    const op = csOperation.value;

    if (!isRecurring()) {
      const addAt = (fmtDate(csAddDate.value) || 'its add date') + ' ' + (fmtTime(csAddTime.value) || '');
      const removeAt = (fmtDate(csRemoveDate.value) || 'its remove date') + ' ' + (fmtTime(csRemoveDateTime.value) || '');
      let text = 'Schedule will add the selected skills to the agents at ' + addAt.trim();
      if (op !== 'add') text += ' and it will remove them at ' + removeAt.trim();
      csSummary.textContent = text + '.';
      return;
    }

    const days = selectedDays();
    const dayText = days.length ? days.join(',') : 'no days selected';
    const start = fmtDate(csStartDate.value) || 'a start date';
    const startT = fmtTime(csStartTime.value) || 'its start time';
    const removeT = fmtTime(csRemoveTime.value);
    const pattern = csPattern.value.toLowerCase();
    const endType = createSchedModal.querySelector('input[name="csEndType"]:checked').value;
    const until = endType === 'date' ? ('until ' + (fmtDate(csEndDate.value) || 'its end date'))
      : endType === 'after' ? ('for ' + (csEndAfter.value || 'N') + ' occurrences')
      : 'with no end date';

    let action = 'add the selected skills on ' + dayText + ' at ' + startT;
    if (op === 'addremove' && removeT) action += ' and it will remove them at ' + removeT;
    else if (op === 'remove') action = 'remove the selected skills on ' + dayText + ' at ' + startT;

    csSummary.textContent = 'Schedule will start running on ' + start + ', it will ' + action +
      '. Schedule will run ' + pattern + ' on ' + dayText + ' ' + until + '.';
  }

  function renderCsSkillList() {
    const rows = CS_SKILLS.filter(s => s.name.toLowerCase().includes(csSkillFilter));
    csSkillList.innerHTML = rows.map(s =>
      '<li class="' + (csSkillChecked[s.name] ? 'checked' : '') + '" data-skill="' + s.name + '">' +
        '<input type="checkbox"' + (csSkillChecked[s.name] ? ' checked' : '') + '>' +
        '<span>' + s.name + '</span>' +
        '<span class="badge">' + s.agents + '</span>' +
      '</li>'
    ).join('');
    document.getElementById('csSkillCount').textContent = rows.length + ' records';
  }

  function renderCsAgentList() {
    const rows = CS_AGENTS.filter(a => (a.user + ' ' + a.name).toLowerCase().includes(csAgentFilter));
    csAgentList.innerHTML = rows.map(a =>
      '<li class="' + (csAgentChecked[a.user] ? 'checked' : '') + '" data-agent="' + a.user + '">' +
        '<input type="checkbox"' + (csAgentChecked[a.user] ? ' checked' : '') + '>' +
        '<span>' + a.user + ' - ' + a.name + '</span>' +
      '</li>'
    ).join('');
    document.getElementById('csAgentCount').textContent = rows.length + ' records';
  }

  csSkillList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-skill]');
    if (!li) return;
    const key = li.dataset.skill;
    csSkillChecked[key] = !csSkillChecked[key];
    renderCsSkillList();
  });

  csAgentList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-agent]');
    if (!li) return;
    const key = li.dataset.agent;
    csAgentChecked[key] = !csAgentChecked[key];
    renderCsAgentList();
  });

  document.getElementById('csSkillSearch').addEventListener('input', (e) => {
    csSkillFilter = e.target.value.trim().toLowerCase();
    renderCsSkillList();
  });

  document.getElementById('csAgentSearch').addEventListener('input', (e) => {
    csAgentFilter = e.target.value.trim().toLowerCase();
    renderCsAgentList();
  });

  function setRecurring(on) {
    csRecurring.classList.toggle('on', on);
    csRecurring.classList.toggle('off', !on);
    csRecurring.setAttribute('aria-pressed', on);
    csRecurring.innerHTML = on
      ? '<svg class="icon"><use href="#icon-check"/></svg><span>ON</span>'
      : '<svg class="icon"><use href="#icon-x-mark"/></svg><span>OFF</span>';
    updateRecurringVisibility();
    updateSummary();
  }

  csRecurring.addEventListener('click', () => setRecurring(!isRecurring()));

  csOperation.addEventListener('change', updateSummary);
  csPattern.addEventListener('change', updateSummary);
  csDays.addEventListener('change', updateSummary);
  csStartDate.addEventListener('input', updateSummary);
  csStartTime.addEventListener('input', updateSummary);
  csRemoveTime.addEventListener('input', updateSummary);
  csAddDate.addEventListener('input', updateSummary);
  csAddTime.addEventListener('input', updateSummary);
  csRemoveDate.addEventListener('input', updateSummary);
  csRemoveDateTime.addEventListener('input', updateSummary);
  csEndDate.addEventListener('input', updateSummary);
  csEndAfter.addEventListener('input', updateSummary);
  createSchedModal.querySelectorAll('input[name="csEndType"]').forEach(r => {
    r.addEventListener('change', () => { updateEndFields(); updateSummary(); });
  });

  function todayIso() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function openCreateSchedModal() {
    csName.value = '';
    csName.classList.remove('invalid');
    csDesc.value = '';
    csOperation.value = 'addremove';
    setRecurring(false);

    csPattern.value = 'Weekly';
    csDays.querySelectorAll('input').forEach(cb => { cb.checked = (cb.value === 'Mon' || cb.value === 'Tues'); });
    createSchedModal.querySelector('input[name="csEndType"][value="date"]').checked = true;

    const start = todayIso();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    const endIso = endDate.toISOString().slice(0, 10);

    csAddDate.value = start;
    csAddTime.value = '17:00';
    csRemoveDate.value = endIso;
    csRemoveDateTime.value = '17:15';

    csStartDate.value = start;
    csStartTime.value = '17:00';
    csRemoveTime.value = '17:15';
    csEndDate.value = endIso;
    csEndAfter.value = 10;

    csSkillChecked = {};
    csAgentChecked = {};
    csSkillFilter = '';
    csAgentFilter = '';
    document.getElementById('csSkillSearch').value = '';
    document.getElementById('csAgentSearch').value = '';

    updateEndFields();
    renderCsSkillList();
    renderCsAgentList();
    updateSummary();

    createSchedModal.hidden = false;
    csName.focus();
  }

  function closeCreateSchedModal() {
    createSchedModal.hidden = true;
  }

  function saveCreateSchedModal() {
    const name = csName.value.trim();
    if (name === '') {
      csName.classList.add('invalid');
      csName.focus();
      return;
    }

    const recurring = isRecurring();
    const recurrenceLabel = recurring ? csPattern.value : 'Once';
    const opLabel = csOperation.value === 'add' ? 'Add' : csOperation.value === 'remove' ? 'Remove' : 'Add/Remove';

    let startStr, nextExecStr, endStr;
    if (recurring) {
      startStr = fmtDate(csStartDate.value) + (csStartTime.value ? ' ' + fmtTime(csStartTime.value) : '');
      nextExecStr = startStr;
      const endType = createSchedModal.querySelector('input[name="csEndType"]:checked').value;
      endStr = endType === 'date' ? fmtDate(csEndDate.value) : '';
    } else {
      startStr = fmtDate(csAddDate.value) + (csAddTime.value ? ' ' + fmtTime(csAddTime.value) : '');
      nextExecStr = startStr;
      endStr = fmtDate(csRemoveDate.value);
    }

    schedules.unshift({
      name: name,
      recurrence: recurrenceLabel,
      status: 'completed',
      statusLabel: 'Scheduled',
      start: startStr,
      lastExec: '',
      nextOp: opLabel,
      nextExec: nextExecStr,
      end: endStr,
      skills: Object.keys(csSkillChecked).filter(k => csSkillChecked[k]),
      agents: Object.keys(csAgentChecked).filter(k => csAgentChecked[k])
    });

    closeCreateSchedModal();
    renderBody();
  }

  document.getElementById('createSchedSave').addEventListener('click', saveCreateSchedModal);
  document.getElementById('createSchedCancel').addEventListener('click', closeCreateSchedModal);
  document.getElementById('createSchedClose').addEventListener('click', closeCreateSchedModal);

  createSchedModal.addEventListener('click', (e) => {
    if (e.target === createSchedModal) closeCreateSchedModal();
  });

  csName.addEventListener('input', () => csName.classList.remove('invalid'));

  document.addEventListener('keydown', (e) => {
    if (!createSchedModal.hidden && e.key === 'Escape') closeCreateSchedModal();
  });

  /* ---------- Run Now modal ---------- */
  const runNowModal  = document.getElementById('runNowModal');
  let runNowTarget   = null;

  function openRunNowModal(sched) {
    runNowTarget = sched;
    document.getElementById('rnName').textContent       = sched.name;
    document.getElementById('rnMeta').textContent       = 'Start: ' + (sched.start || '—');
    document.getElementById('rnRecurrence').textContent = sched.recurrence;
    document.getElementById('rnNextOp').textContent     = sched.nextOp || '—';
    document.getElementById('rnSkills').textContent     = (sched.skills && sched.skills.length)
      ? sched.skills.join(', ') : '—';
    document.getElementById('rnAgents').textContent     = (sched.agents && sched.agents.length)
      ? sched.agents.join(', ') : '—';
    runNowModal.hidden = false;
  }

  function closeRunNowModal() {
    runNowModal.hidden = true;
    runNowTarget = null;
  }

  document.getElementById('runNowConfirm').addEventListener('click', () => {
    if (!runNowTarget) return;
    runNowTarget.status      = 'running';
    runNowTarget.statusLabel = 'Running';
    runNowTarget.lastExec    = new Date().toLocaleString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(',', '');
    closeRunNowModal();
    renderBody();
  });

  document.getElementById('runNowClose').addEventListener('click', closeRunNowModal);
  document.getElementById('runNowCancel').addEventListener('click', closeRunNowModal);
  runNowModal.addEventListener('click', (e) => { if (e.target === runNowModal) closeRunNowModal(); });
  document.addEventListener('keydown', (e) => {
    if (!runNowModal.hidden && e.key === 'Escape') closeRunNowModal();
  });

  /* ---------- Edit Schedule modal ---------- */
  const editSchedModal  = document.getElementById('editSchedModal');
  const esName          = document.getElementById('esName');
  const esDesc          = document.getElementById('esDesc');
  const esOperation     = document.getElementById('esOperation');
  const esRecurring     = document.getElementById('esRecurring');
  const esOnceRow       = document.getElementById('esOnceRow');
  const esPatternBox    = document.getElementById('esPatternBox');
  const esRecurringDateRow = document.getElementById('esRecurringDateRow');
  const esPattern       = document.getElementById('esPattern');
  const esDays          = document.getElementById('esDays');
  const esEndDate       = document.getElementById('esEndDate');
  const esEndAfter      = document.getElementById('esEndAfter');
  const esAddDate       = document.getElementById('esAddDate');
  const esAddTime       = document.getElementById('esAddTime');
  const esStartDate     = document.getElementById('esStartDate');
  const esStartTime     = document.getElementById('esStartTime');
  const esRemoveTime    = document.getElementById('esRemoveTime');
  const esSummary       = document.getElementById('esSummary');
  const esSkillList     = document.getElementById('esSkillList');
  const esAgentList     = document.getElementById('esAgentList');

  let esSkillChecked  = {};
  let esAgentChecked  = {};
  let esSkillFilter   = '';
  let esAgentFilter   = '';
  let editSchedTarget = null;

  function isEsRecurring() {
    return esRecurring.classList.contains('on');
  }

  function setEsRecurring(on) {
    esRecurring.classList.toggle('on', on);
    esRecurring.classList.toggle('off', !on);
    esRecurring.setAttribute('aria-pressed', on);
    esRecurring.innerHTML = on
      ? '<svg class="icon"><use href="#icon-check"/></svg><span>ON</span>'
      : '<svg class="icon"><use href="#icon-x-mark"/></svg><span>OFF</span>';
    updateEsVisibility();
    updateEsSummary();
  }

  function updateEsVisibility() {
    const on = isEsRecurring();
    esOnceRow.hidden        = on;
    esPatternBox.hidden     = !on;
    esRecurringDateRow.hidden = !on;
  }

  function updateEsEndFields() {
    const type = editSchedModal.querySelector('input[name="esEndType"]:checked').value;
    esEndDate.disabled  = type !== 'date';
    esEndAfter.disabled = type !== 'after';
  }

  function updateEsSummary() {
    const op = esOperation.value;
    if (!isEsRecurring()) {
      const addAt = (fmtDate(esAddDate.value) || 'its add date') + ' ' + (fmtTime(esAddTime.value) || '');
      esSummary.textContent = 'Schedule will add the selected skills at ' + addAt.trim() + '.';
      return;
    }
    const days     = [...esDays.querySelectorAll('input:checked')].map(cb => cb.value);
    const dayText  = days.length ? days.join(', ') : 'no days selected';
    const start    = fmtDate(esStartDate.value) || 'a start date';
    const startT   = fmtTime(esStartTime.value) || 'its start time';
    const removeT  = fmtTime(esRemoveTime.value);
    const pattern  = esPattern.value.toLowerCase();
    const endType  = editSchedModal.querySelector('input[name="esEndType"]:checked').value;
    const until    = endType === 'date'  ? ('until ' + (fmtDate(esEndDate.value) || 'its end date'))
                   : endType === 'after' ? ('for ' + (esEndAfter.value || 'N') + ' occurrences')
                   : 'with no end date';
    let action = 'add the selected skills on ' + dayText + ' at ' + startT;
    if (op === 'addremove' && removeT) action += ' and remove them at ' + removeT;
    else if (op === 'remove') action = 'remove the selected skills on ' + dayText + ' at ' + startT;
    esSummary.textContent = 'Schedule will start running on ' + start + ', it will ' + action +
      '. Runs ' + pattern + ' on ' + dayText + ' ' + until + '.';
  }

  function renderEsSkillList() {
    const rows = CS_SKILLS.filter(s => s.name.toLowerCase().includes(esSkillFilter));
    esSkillList.innerHTML = rows.map(s =>
      '<li class="' + (esSkillChecked[s.name] ? 'checked' : '') + '" data-skill="' + s.name + '">' +
        '<input type="checkbox"' + (esSkillChecked[s.name] ? ' checked' : '') + '>' +
        '<span>' + s.name + '</span>' +
        '<span class="badge">' + s.agents + '</span>' +
      '</li>'
    ).join('');
    document.getElementById('esSkillCount').textContent = rows.length + ' records';
  }

  function renderEsAgentList() {
    const rows = CS_AGENTS.filter(a => (a.user + ' ' + a.name).toLowerCase().includes(esAgentFilter));
    esAgentList.innerHTML = rows.map(a =>
      '<li class="' + (esAgentChecked[a.user] ? 'checked' : '') + '" data-agent="' + a.user + '">' +
        '<input type="checkbox"' + (esAgentChecked[a.user] ? ' checked' : '') + '>' +
        '<span>' + a.user + ' - ' + a.name + '</span>' +
      '</li>'
    ).join('');
    document.getElementById('esAgentCount').textContent = rows.length + ' records';
  }

  esSkillList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-skill]');
    if (!li) return;
    esSkillChecked[li.dataset.skill] = !esSkillChecked[li.dataset.skill];
    renderEsSkillList();
  });

  esAgentList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-agent]');
    if (!li) return;
    esAgentChecked[li.dataset.agent] = !esAgentChecked[li.dataset.agent];
    renderEsAgentList();
  });

  document.getElementById('esSkillSearch').addEventListener('input', (e) => {
    esSkillFilter = e.target.value.trim().toLowerCase();
    renderEsSkillList();
  });

  document.getElementById('esAgentSearch').addEventListener('input', (e) => {
    esAgentFilter = e.target.value.trim().toLowerCase();
    renderEsAgentList();
  });

  esRecurring.addEventListener('click', () => setEsRecurring(!isEsRecurring()));
  esOperation.addEventListener('change', updateEsSummary);
  esPattern.addEventListener('change', updateEsSummary);
  esDays.addEventListener('change', updateEsSummary);
  esStartDate.addEventListener('input', updateEsSummary);
  esStartTime.addEventListener('input', updateEsSummary);
  esRemoveTime.addEventListener('input', updateEsSummary);
  esAddDate.addEventListener('input', updateEsSummary);
  esAddTime.addEventListener('input', updateEsSummary);
  editSchedModal.querySelectorAll('input[name="esEndType"]').forEach(r => {
    r.addEventListener('change', () => { updateEsEndFields(); updateEsSummary(); });
  });

  function isoFromDisplay(dtStr) {
    // "MM/DD/YYYY HH:MM AM/PM" -> "YYYY-MM-DD" and "HH:MM" (24h)
    if (!dtStr) return { date: '', time: '' };
    const parts = dtStr.trim().split(' ');
    const datePart = parts[0] || '';
    const [mm, dd, yyyy] = datePart.split('/');
    const isoDate = (yyyy && mm && dd) ? yyyy + '-' + mm.padStart(2,'0') + '-' + dd.padStart(2,'0') : '';
    let isoTime = '';
    if (parts[1] && parts[2]) {
      let [hh, min] = parts[1].split(':').map(Number);
      const ampm = parts[2].toUpperCase();
      if (ampm === 'PM' && hh !== 12) hh += 12;
      if (ampm === 'AM' && hh === 12) hh = 0;
      isoTime = String(hh).padStart(2,'0') + ':' + String(min).padStart(2,'0');
    }
    return { date: isoDate, time: isoTime };
  }

  function openEditSchedModal(sched) {
    editSchedTarget = sched;
    document.getElementById('editSchedTitle').textContent = 'Edit Schedule — ' + sched.name;

    esName.value = sched.name;
    esName.classList.remove('invalid');
    esDesc.value = '';

    const recurring = sched.recurrence !== 'Once';
    setEsRecurring(recurring);

    esOperation.value = 'addremove';

    const startParsed = isoFromDisplay(sched.start);
    if (recurring) {
      esPattern.value   = sched.recurrence;
      esStartDate.value = startParsed.date;
      esStartTime.value = startParsed.time;
      esRemoveTime.value = '';
      editSchedModal.querySelector('input[name="esEndType"][value="date"]').checked = true;
      esEndDate.value  = sched.end ? (() => {
        const [mm,dd,yyyy] = sched.end.split('/');
        return yyyy + '-' + mm.padStart(2,'0') + '-' + dd.padStart(2,'0');
      })() : '';
      esEndAfter.value = 10;
      updateEsEndFields();
    } else {
      esAddDate.value = startParsed.date;
      esAddTime.value = startParsed.time;
    }

    esSkillChecked = {};
    (sched.skills || []).forEach(sk => { esSkillChecked[sk] = true; });
    esAgentChecked = {};
    (sched.agents || []).forEach(ag => { esAgentChecked[ag] = true; });
    esSkillFilter = '';
    esAgentFilter = '';
    document.getElementById('esSkillSearch').value = '';
    document.getElementById('esAgentSearch').value = '';

    renderEsSkillList();
    renderEsAgentList();
    updateEsSummary();

    editSchedModal.hidden = false;
    esName.focus();
  }

  function closeEditSchedModal() {
    editSchedModal.hidden = true;
    editSchedTarget = null;
  }

  function saveEditSchedModal() {
    const name = esName.value.trim();
    if (name === '') {
      esName.classList.add('invalid');
      esName.focus();
      return;
    }

    const recurring       = isEsRecurring();
    const recurrenceLabel = recurring ? esPattern.value : 'Once';
    const opLabel         = esOperation.value === 'add' ? 'Add'
                          : esOperation.value === 'remove' ? 'Remove' : 'Add/Remove';

    let startStr, endStr;
    if (recurring) {
      startStr = fmtDate(esStartDate.value) + (esStartTime.value ? ' ' + fmtTime(esStartTime.value) : '');
      const endType = editSchedModal.querySelector('input[name="esEndType"]:checked').value;
      endStr = endType === 'date' ? fmtDate(esEndDate.value) : '';
    } else {
      startStr = fmtDate(esAddDate.value) + (esAddTime.value ? ' ' + fmtTime(esAddTime.value) : '');
      endStr   = '';
    }

    editSchedTarget.name        = name;
    editSchedTarget.recurrence  = recurrenceLabel;
    editSchedTarget.nextOp      = opLabel;
    editSchedTarget.start       = startStr;
    editSchedTarget.end         = endStr;
    editSchedTarget.skills      = Object.keys(esSkillChecked).filter(k => esSkillChecked[k]);
    editSchedTarget.agents      = Object.keys(esAgentChecked).filter(k => esAgentChecked[k]);

    closeEditSchedModal();
    renderBody();
  }

  document.getElementById('editSchedSave').addEventListener('click', saveEditSchedModal);
  document.getElementById('editSchedCancel').addEventListener('click', closeEditSchedModal);
  document.getElementById('editSchedClose').addEventListener('click', closeEditSchedModal);
  editSchedModal.addEventListener('click', (e) => { if (e.target === editSchedModal) closeEditSchedModal(); });
  esName.addEventListener('input', () => esName.classList.remove('invalid'));
  document.addEventListener('keydown', (e) => {
    if (!editSchedModal.hidden && e.key === 'Escape') closeEditSchedModal();
  });

  /* ---------- Schedule audit dialog ---------- */
  function last6MonthsSched() {
    const out = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    }
    return out;
  }

  function schedAuditLogFor(sched) {
    const skills = sched.skills && sched.skills.length ? sched.skills : ['A_Sales'];
    const agentsList = sched.agents && sched.agents.length ? sched.agents : ['Jdoe'];
    return [
      {
        text: 'Admin Dcloud created the schedule ' + sched.name,
        time: '07:16 PM',
        rows: agentsList.map((a, i) => ({ agent: a, skill: skills[i % skills.length] }))
      }
    ];
  }

  const schedAuditModal = document.getElementById('schedAuditModal');
  const schedAuditChips = document.getElementById('schedAuditChips');
  const schedAuditResults = document.getElementById('schedAuditResults');
  const schedAuditDateBadge = document.getElementById('schedAuditDateBadge');
  let auditSched = null;
  let schedAuditActiveMonth = null;
  let schedAuditDateOpen = true;
  let schedAuditOpenEntry = 0;

  function openSchedAuditModal(sched) {
    auditSched = sched;
    schedAuditDateOpen = true;
    schedAuditOpenEntry = 0;
    document.getElementById('schedAuditTitle').textContent = 'Schedule audit: ' + sched.name;
    document.getElementById('schedAuditType').value = 'All';
    document.getElementById('schedAuditSearch').value = '';
    document.getElementById('schedAuditUpdated').textContent = 'Last Updated: ' + (sched.start.split(' ')[0] || '04/13/2022');

    const months = last6MonthsSched();
    schedAuditChips.innerHTML = months.map((m, i) =>
      '<button class="audit-chip' + (i === months.length - 1 ? ' active' : '') + '" data-month="' + m + '">' + m + '</button>'
    ).join('');
    schedAuditActiveMonth = months[months.length - 1];

    renderSchedAuditResults();
    schedAuditModal.hidden = false;
  }

  function closeSchedAuditModal() {
    schedAuditModal.hidden = true;
    auditSched = null;
  }

  function renderSchedAuditResults() {
    const months = last6MonthsSched();
    const isLatest = schedAuditActiveMonth === months[months.length - 1];

    if (!isLatest || !auditSched) {
      schedAuditDateBadge.hidden = true;
      schedAuditResults.innerHTML = '<div class="audit-empty">No records found for the given query</div>';
      return;
    }

    schedAuditDateBadge.hidden = false;
    schedAuditDateBadge.classList.toggle('collapsed', !schedAuditDateOpen);
    document.getElementById('schedAuditDateText').textContent = document.getElementById('schedAuditUpdated').textContent.replace('Last Updated: ', '');

    const log = schedAuditLogFor(auditSched);
    const listHtml = log.map((entry, i) => {
      const open = i === schedAuditOpenEntry;
      const rowsHtml = entry.rows.map(r => '<tr><td>' + r.agent + '</td><td>' + r.skill + '</td></tr>').join('');
      return '<div class="audit-log-item' + (open ? ' open' : '') + '" data-entry="' + i + '">' +
          '<span class="audit-log-icon"><svg class="icon"><use href="#icon-check-circle"/></svg></span>' +
          '<span class="audit-log-text">' + entry.text + '</span>' +
          '<svg class="icon audit-log-toggle"><use href="#icon-caret"/></svg>' +
          '<span class="audit-log-time"><svg class="icon"><use href="#icon-clock"/></svg>' + entry.time + '</span>' +
        '</div>' +
        (open ? '<div class="audit-log-detail">' +
          '<table class="audit-log-table"><thead><tr><th>Agents</th><th>Skills</th></tr></thead>' +
          '<tbody>' + rowsHtml + '</tbody></table></div>' : '');
    }).join('');

    schedAuditResults.innerHTML = '<div class="audit-log-list' + (schedAuditDateOpen ? '' : ' collapsed') + '">' + listHtml + '</div>';
  }

  document.getElementById('schedAuditDateArrow').addEventListener('click', () => {
    schedAuditDateOpen = !schedAuditDateOpen;
    renderSchedAuditResults();
  });

  const schedAuditDatePicker = document.getElementById('schedAuditDatePicker');
  document.getElementById('schedAuditCalBtn').addEventListener('click', () => {
    if (schedAuditDatePicker.showPicker) {
      schedAuditDatePicker.showPicker();
    } else {
      schedAuditDatePicker.focus();
      schedAuditDatePicker.click();
    }
  });

  schedAuditDatePicker.addEventListener('change', () => {
    if (!schedAuditDatePicker.value) return;
    const [y, m, d] = schedAuditDatePicker.value.split('-');
    document.getElementById('schedAuditDateText').textContent = m + '/' + d + '/' + y;
  });

  schedAuditResults.addEventListener('click', (e) => {
    const item = e.target.closest('.audit-log-item');
    if (!item) return;
    const idx = Number(item.dataset.entry);
    schedAuditOpenEntry = schedAuditOpenEntry === idx ? -1 : idx;
    renderSchedAuditResults();
  });

  schedAuditChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.audit-chip');
    if (!chip) return;
    schedAuditActiveMonth = chip.dataset.month;
    schedAuditChips.querySelectorAll('.audit-chip').forEach(c =>
      c.classList.toggle('active', c === chip));
    renderSchedAuditResults();
  });

  document.getElementById('schedAuditSearchBtn').addEventListener('click', renderSchedAuditResults);
  document.getElementById('schedAuditSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') renderSchedAuditResults();
  });
  document.getElementById('schedAuditType').addEventListener('change', renderSchedAuditResults);

  document.getElementById('schedAuditClose').addEventListener('click', closeSchedAuditModal);
  document.getElementById('schedAuditCloseBtn').addEventListener('click', closeSchedAuditModal);

  schedAuditModal.addEventListener('click', (e) => {
    if (e.target === schedAuditModal) closeSchedAuditModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!schedAuditModal.hidden && e.key === 'Escape') closeSchedAuditModal();
  });

  /* ---------- Init ---------- */
  renderColToggleList();
  renderHead();
  renderBody();
});
