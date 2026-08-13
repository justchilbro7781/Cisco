document.addEventListener('DOMContentLoaded', () => {

  const GADGETS = [
    'Call Control', 'Team Message', 'Wrapup Reasons', 'Case Info',
    'Webex Chat', 'Reporting Gadget', 'Browser Pop', 'Workflow Notifications'
  ];

  let LAYOUTS = [
    { id: 1, name: 'Default Agent Layout', team: 'All Teams', type: 'Agent', active: true, modified: '07/22/2026', gadgets: ['Call Control', 'Team Message', 'Wrapup Reasons', 'Case Info'] },
    { id: 2, name: 'Supervisor Layout', team: 'CumulusMain', type: 'Supervisor', active: true, modified: '06/30/2026', gadgets: ['Call Control', 'Team Message', 'Reporting Gadget'] },
    { id: 3, name: 'Sales Agent Layout', team: 'A_Sales', type: 'Agent', active: true, modified: '08/01/2026', gadgets: ['Call Control', 'Case Info', 'Webex Chat', 'Browser Pop'] },
    { id: 4, name: 'Legacy Layout (Archived)', team: '—', type: 'Agent', active: false, modified: '03/12/2025', gadgets: ['Call Control'] }
  ];
  let nextId = 5;

  const body = document.getElementById('layoutBody');
  const recordCount = document.getElementById('recordCount');

  function renderBody() {
    recordCount.textContent = LAYOUTS.length;
    body.innerHTML = LAYOUTS.map(l =>
      '<tr data-id="' + l.id + '">' +
      '<td></td>' +
      '<td>' + l.name + '</td>' +
      '<td>' + l.team + '</td>' +
      '<td>' + l.type + '</td>' +
      '<td><span class="status-pill2 ' + (l.active ? 'on' : 'off') + '"><svg class="icon"><use href="#' + (l.active ? 'icon-check-circle' : 'icon-circle') + '"/></svg>' + (l.active ? 'Active' : 'Inactive') + '</span></td>' +
      '<td>' + l.modified + '</td>' +
      '<td class="col-actions">' +
      '<button class="row-btn" data-act="edit" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
      '<button class="row-btn" data-act="clone" title="Clone"><svg class="icon"><use href="#icon-copy"/></svg></button>' +
      '<button class="row-btn" data-act="delete" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
      '</td>' +
      '</tr>'
    ).join('');
  }

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
    if (action === 'new') openModal(null);
    else if (action === 'export-all-csv') exportCsv();
    else if (action === 'export-all-pdf') exportPdf();
    else if (action === 'clear-filters') { /* no filters on this page */ }
    actionsMenu.hidden = true;
  });

  function exportCsv() {
    const csv = ['Layout Name,Team,Type,Status,Last Modified']
      .concat(LAYOUTS.map(l => ['"' + l.name + '"', l.team, l.type, l.active ? 'Active' : 'Inactive', l.modified].join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent-desktop-layouts.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to export as PDF.'); return; }
    const rows = LAYOUTS.map(l => '<tr><td>' + l.name + '</td><td>' + l.team + '</td><td>' + l.type + '</td><td>' + (l.active ? 'Active' : 'Inactive') + '</td><td>' + l.modified + '</td></tr>').join('');
    win.document.write('<html><head><title>Agent Desktop Layouts</title><style>body{font-family:Segoe UI,Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px 10px;font-size:12.5px;text-align:left}th{background:#f4f5f7}</style></head><body><h2>Agent Desktop Layouts</h2><table><thead><tr><th>Name</th><th>Team</th><th>Type</th><th>Status</th><th>Modified</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>');
    win.document.close();
    win.focus();
    win.print();
  }

  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const layout = LAYOUTS.find(l => l.id === Number(tr.dataset.id));
    const act = e.target.closest('.row-btn');
    if (!act) return;
    const action = act.dataset.act;
    if (action === 'edit') openModal(layout);
    else if (action === 'clone') {
      const clone = Object.assign({}, layout, { id: nextId++, name: layout.name + ' (Copy)', gadgets: layout.gadgets.slice() });
      LAYOUTS.push(clone);
      renderBody();
    } else if (action === 'delete') {
      if (confirm('Delete layout "' + layout.name + '"?')) {
        LAYOUTS = LAYOUTS.filter(l => l.id !== layout.id);
        renderBody();
      }
    }
  });

  /* ---------- Modal ---------- */
  const modal = document.getElementById('layoutModal');
  const modalTitle = document.getElementById('layoutModalTitle');
  const nameField = document.getElementById('layoutName');
  const teamField = document.getElementById('layoutTeam');
  const activeField = document.getElementById('layoutActive');
  const gadgetGrid = document.getElementById('gadgetGrid');
  const previewEl = document.getElementById('layoutPreview');
  let editingId = null;
  let selectedGadgets = [];

  function renderGadgetGrid() {
    gadgetGrid.innerHTML = GADGETS.map(g =>
      '<label class="gadget-check"><input type="checkbox" value="' + g + '"' + (selectedGadgets.includes(g) ? ' checked' : '') + '>' + g + '</label>'
    ).join('');
  }

  function renderPreview() {
    if (!selectedGadgets.length) {
      previewEl.innerHTML = '<div class="layout-preview-empty">No gadgets selected yet.</div>';
      return;
    }
    previewEl.innerHTML = selectedGadgets.map(g => '<div class="layout-preview-box">' + g + '</div>').join('');
  }

  gadgetGrid.addEventListener('change', (e) => {
    if (e.target.tagName !== 'INPUT') return;
    const val = e.target.value;
    if (e.target.checked) { if (!selectedGadgets.includes(val)) selectedGadgets.push(val); }
    else selectedGadgets = selectedGadgets.filter(g => g !== val);
    renderPreview();
  });

  function openModal(layout) {
    editingId = layout ? layout.id : null;
    modalTitle.textContent = layout ? 'Edit Desktop Layout' : 'New Desktop Layout';
    nameField.value = layout ? layout.name : '';
    teamField.value = layout ? layout.team : 'All Teams';
    activeField.checked = layout ? layout.active : true;
    modal.querySelector('input[name="layoutType"][value="' + (layout ? layout.type : 'Agent') + '"]').checked = true;
    selectedGadgets = layout ? layout.gadgets.slice() : ['Call Control'];
    renderGadgetGrid();
    renderPreview();
    switchTab('general');
    modal.hidden = false;
  }

  function closeModal() { modal.hidden = true; }

  document.getElementById('layoutModalClose').addEventListener('click', closeModal);
  document.getElementById('layoutCancelBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function switchTab(name) {
    modal.querySelectorAll('.page-tab').forEach(t => t.classList.toggle('active', t.dataset.ltab === name));
    modal.querySelectorAll('.page-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.lpanel === name));
  }

  modal.querySelectorAll('.page-tab').forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.ltab));
  });

  document.getElementById('layoutSaveBtn').addEventListener('click', () => {
    const name = nameField.value.trim();
    if (!name) { nameField.focus(); return; }
    const type = modal.querySelector('input[name="layoutType"]:checked').value;
    if (editingId) {
      const l = LAYOUTS.find(x => x.id === editingId);
      Object.assign(l, { name, team: teamField.value, type, active: activeField.checked, gadgets: selectedGadgets.slice(), modified: todayStr() });
    } else {
      LAYOUTS.push({ id: nextId++, name, team: teamField.value, type, active: activeField.checked, gadgets: selectedGadgets.slice(), modified: todayStr() });
    }
    renderBody();
    closeModal();
  });

  function todayStr() {
    const d = new Date();
    return String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0') + '/' + d.getFullYear();
  }

  renderBody();
});
