document.addEventListener('DOMContentLoaded', () => {

  const AUDIT_LOG = [
    { ts: '2026-08-12 09:14:02', module: 'Users', user: 'csupervisor', action: 'Reset Password', details: 'Reset password for agent jopeters', ip: '10.42.6.101' },
    { ts: '2026-08-12 08:52:41', module: 'Schedules', user: 'sjeffers', action: 'Schedule Failed', details: 'Friday_Rush completed with failures (2 skills unassigned)', ip: '10.42.6.118' },
    { ts: '2026-08-11 17:30:12', module: 'Campaigns', user: 'rbarrows', action: 'Campaign Started', details: 'Started CumulusOutboundAgent for CumulusOutbound team', ip: '10.42.6.104' },
    { ts: '2026-08-11 15:05:37', module: 'Skills', user: 'hliang', action: 'Skill Assigned', details: 'Assigned A_Sales skill to 2 agents via Skill to Agent', ip: '10.42.6.122' },
    { ts: '2026-08-11 11:44:09', module: 'Security', user: 'jabracks', action: 'Access Group Updated', details: 'Added rbarrows to Supervisor_AccessGroup', ip: '10.42.6.109' },
    { ts: '2026-08-10 16:20:55', module: 'Agent Teams', user: 'csupervisor', action: 'Team Created', details: 'Created new team CumulusHealthCare', ip: '10.42.6.101' },
    { ts: '2026-08-10 13:12:03', module: 'Routing Controls', user: 'annika', action: 'Routing Rule Modified', details: 'Updated overflow threshold for Voice queue to 90s', ip: '10.42.6.133' },
    { ts: '2026-08-09 10:02:44', module: 'Users', user: 'bbrown', action: 'User Deactivated', details: 'Deactivated user account vbcpod1', ip: '10.42.6.140' },
    { ts: '2026-08-08 14:47:21', module: 'Schedules', user: 'jopeters', action: 'Schedule Created', details: 'Created Weekend_Overflow recurring schedule', ip: '10.42.6.127' },
    { ts: '2026-08-07 09:30:00', module: 'Security', user: 'csupervisor', action: 'Role Modified', details: 'Updated permissions on Supervisor role', ip: '10.42.6.101' },
    { ts: '2026-08-06 18:11:52', module: 'Campaigns', user: 'jdoe', action: 'Campaign Paused', details: 'Paused AcqueonOutboundAgent for maintenance', ip: '10.42.6.115' },
    { ts: '2026-08-05 12:00:19', module: 'Skills', user: 'hliang', action: 'Skill Created', details: 'Created new UWF skill "Cisco_Voice"', ip: '10.42.6.122' }
  ];

  const body = document.getElementById('auditBody');
  const recordCount = document.getElementById('recordCount');
  const moduleFilter = document.getElementById('auditModuleFilter');
  const fromFilter = document.getElementById('auditFrom');
  const toFilter = document.getElementById('auditTo');
  const searchFilter = document.getElementById('auditSearch');

  function colspan() { return 7; }

  function filteredRows() {
    const mod = moduleFilter.value;
    const from = fromFilter.value;
    const to = toFilter.value;
    const q = searchFilter.value.trim().toLowerCase();
    return AUDIT_LOG.filter(r => {
      if (mod && r.module !== mod) return false;
      const day = r.ts.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (q && !(r.user + ' ' + r.action + ' ' + r.details).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderBody() {
    const rows = filteredRows();
    recordCount.textContent = rows.length;
    body.innerHTML = rows.map((r, i) =>
      '<tr data-i="' + i + '">' +
      '<td class="col-expand"><button class="row-caret" title="Show details"><svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
      '<td>' + r.ts + '</td>' +
      '<td><span class="audit-module-tag">' + r.module + '</span></td>' +
      '<td>' + r.user + '</td>' +
      '<td>' + r.action + '</td>' +
      '<td>' + r.details + '</td>' +
      '<td>' + r.ip + '</td>' +
      '</tr>'
    ).join('');
    body.dataset.rows = JSON.stringify(rows);
  }

  body.addEventListener('click', (e) => {
    const caret = e.target.closest('.row-caret');
    if (!caret) return;
    const tr = caret.closest('tr');
    const next = tr.nextElementSibling;
    if (next && next.classList.contains('detail-row')) {
      next.remove();
      caret.classList.remove('open');
      return;
    }
    body.querySelectorAll('.detail-row').forEach(d => d.remove());
    body.querySelectorAll('.row-caret.open').forEach(c => c.classList.remove('open'));
    const rows = JSON.parse(body.dataset.rows || '[]');
    const r = rows[Number(tr.dataset.i)];
    const detail = document.createElement('tr');
    detail.className = 'detail-row';
    detail.innerHTML =
      '<td colspan="' + colspan() + '"><div class="detail-grid">' +
      '<div><span>Timestamp</span>' + r.ts + '</div>' +
      '<div><span>Module</span>' + r.module + '</div>' +
      '<div><span>User</span>' + r.user + '</div>' +
      '<div><span>IP Address</span>' + r.ip + '</div>' +
      '<div class="wide"><span>Details</span>' + r.details + '</div>' +
      '</div></td>';
    tr.insertAdjacentElement('afterend', detail);
    caret.classList.add('open');
  });

  moduleFilter.addEventListener('change', renderBody);
  fromFilter.addEventListener('change', renderBody);
  toFilter.addEventListener('change', renderBody);
  searchFilter.addEventListener('input', renderBody);

  document.getElementById('auditClearBtn').addEventListener('click', () => {
    moduleFilter.value = '';
    fromFilter.value = '';
    toFilter.value = '';
    searchFilter.value = '';
    renderBody();
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
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'export-all-csv') exportCsv();
    else if (action === 'export-all-pdf') exportPdf();
    actionsMenu.hidden = true;
  });

  function exportCsv() {
    const csv = ['Timestamp,Module,User,Action,Details,IP Address']
      .concat(filteredRows().map(r => [r.ts, r.module, r.user, '"' + r.action + '"', '"' + r.details + '"', r.ip].join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-wide-audit.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to export as PDF.'); return; }
    const rows = filteredRows().map(r =>
      '<tr><td>' + r.ts + '</td><td>' + r.module + '</td><td>' + r.user + '</td><td>' + r.action + '</td><td>' + r.details + '</td><td>' + r.ip + '</td></tr>'
    ).join('');
    win.document.write('<html><head><title>System Wide Audit</title><style>body{font-family:Segoe UI,Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px 10px;font-size:12px;text-align:left}th{background:#f4f5f7}</style></head><body><h2>System Wide Audit</h2><table><thead><tr><th>Timestamp</th><th>Module</th><th>User</th><th>Action</th><th>Details</th><th>IP</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>');
    win.document.close();
    win.focus();
    win.print();
  }

  renderBody();
});
