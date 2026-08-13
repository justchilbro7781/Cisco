document.addEventListener('DOMContentLoaded', () => {

  const CONTACTS = [
    { name: 'Rick Barrows', phone: '(614) 555-0142' },
    { name: 'Sandra Jefferson', phone: '(614) 555-0177' },
    { name: 'Cathy Supervisor', phone: '(614) 555-0103' },
    { name: 'Helen Liang', phone: '(614) 555-0198' },
    { name: 'James Bracksted', phone: '(614) 555-0165' },
    { name: 'Jane Doe', phone: '(614) 555-0121' },
    { name: 'Josh Petreson', phone: '(614) 555-0134' },
    { name: 'Andy MacDowell', phone: '(614) 555-0159' },
    { name: 'Annika Hamilton', phone: '(614) 555-0187' },
    { name: 'Beacham Brown', phone: '(614) 555-0146' },
    { name: 'VBC POD1', phone: '(614) 555-0100' },
    { name: 'IT Helpdesk', phone: '(800) 555-0111' },
    { name: 'Facilities', phone: '(800) 555-0122' },
    { name: 'Emergency Line', phone: '(800) 555-0911' }
  ];

  let PHONE_BOOKS = [
    { id: 1, name: 'Corporate Directory', type: 'Global', teams: 'All Teams', updated: '08/05/2026', contacts: ['Rick Barrows', 'Sandra Jefferson', 'Cathy Supervisor', 'Helen Liang', 'James Bracksted', 'Jane Doe', 'Josh Petreson', 'Andy MacDowell'] },
    { id: 2, name: 'Sales Contacts', type: 'Team', teams: 'A_Sales', updated: '07/29/2026', contacts: ['Rick Barrows', 'Sandra Jefferson'] },
    { id: 3, name: 'Cumulus Support Escalation', type: 'Team', teams: 'CumulusMain, CumulusOutbound', updated: '08/10/2026', contacts: ['Cathy Supervisor', 'Helen Liang', 'James Bracksted'] },
    { id: 4, name: 'Emergency Contacts', type: 'Global', teams: 'All Teams', updated: '01/15/2026', contacts: ['IT Helpdesk', 'Facilities', 'Emergency Line'] }
  ];
  let nextId = 5;

  const body = document.getElementById('pbBody');
  const recordCount = document.getElementById('recordCount');

  function renderBody() {
    recordCount.textContent = PHONE_BOOKS.length;
    body.innerHTML = PHONE_BOOKS.map(pb =>
      '<tr data-id="' + pb.id + '">' +
      '<td>' + pb.name + '</td>' +
      '<td>' + pb.contacts.length + '</td>' +
      '<td><span class="status-pill2 ' + (pb.type === 'Global' ? 'info' : 'warn') + '">' + pb.type + '</span></td>' +
      '<td>' + pb.teams + '</td>' +
      '<td>' + pb.updated + '</td>' +
      '<td class="col-actions">' +
      '<button class="row-btn" data-act="edit" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
      '<button class="row-btn" data-act="export" title="Export"><svg class="icon"><use href="#icon-download"/></svg></button>' +
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
    if (action === 'new') {
      const pb = { id: nextId++, name: 'New Phone Book', type: 'Team', teams: 'Unassigned', updated: todayStr(), contacts: [] };
      PHONE_BOOKS.push(pb);
      renderBody();
      openModal(pb);
    } else if (action === 'import') {
      alert('Select a CSV file from your computer to import contacts. (Demo only)');
    } else if (action === 'export-all-csv') {
      exportCsv();
    } else if (action === 'export-all-pdf') {
      exportPdf();
    }
    actionsMenu.hidden = true;
  });

  function exportCsv() {
    const csv = ['Phone Book Name,# Contacts,Type,Assigned Teams,Last Updated']
      .concat(PHONE_BOOKS.map(pb => ['"' + pb.name + '"', pb.contacts.length, pb.type, '"' + pb.teams + '"', pb.updated].join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phone-books.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to export as PDF.'); return; }
    const rows = PHONE_BOOKS.map(pb => '<tr><td>' + pb.name + '</td><td>' + pb.contacts.length + '</td><td>' + pb.type + '</td><td>' + pb.teams + '</td><td>' + pb.updated + '</td></tr>').join('');
    win.document.write('<html><head><title>Phone Books</title><style>body{font-family:Segoe UI,Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px 10px;font-size:12.5px;text-align:left}th{background:#f4f5f7}</style></head><body><h2>Phone Books</h2><table><thead><tr><th>Name</th><th># Contacts</th><th>Type</th><th>Teams</th><th>Updated</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>');
    win.document.close();
    win.focus();
    win.print();
  }

  function todayStr() {
    const d = new Date();
    return String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0') + '/' + d.getFullYear();
  }

  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const pb = PHONE_BOOKS.find(x => x.id === Number(tr.dataset.id));
    const act = e.target.closest('.row-btn');
    if (!act) return;
    const action = act.dataset.act;
    if (action === 'edit') openModal(pb);
    else if (action === 'export') exportSinglePdf(pb);
    else if (action === 'delete') {
      if (confirm('Delete phone book "' + pb.name + '"?')) {
        PHONE_BOOKS = PHONE_BOOKS.filter(x => x.id !== pb.id);
        renderBody();
      }
    }
  });

  function exportSinglePdf(pb) {
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to export as PDF.'); return; }
    const rows = pb.contacts.map(name => {
      const c = CONTACTS.find(x => x.name === name);
      return '<tr><td>' + name + '</td><td>' + (c ? c.phone : '') + '</td></tr>';
    }).join('');
    win.document.write('<html><head><title>' + pb.name + '</title><style>body{font-family:Segoe UI,Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px 10px;font-size:12.5px;text-align:left}th{background:#f4f5f7}</style></head><body><h2>' + pb.name + '</h2><table><thead><tr><th>Name</th><th>Phone</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>');
    win.document.close();
    win.focus();
    win.print();
  }

  /* ---------- Edit modal (dual pane, click-to-move) ---------- */
  const modal = document.getElementById('pbModal');
  const modalTitle = document.getElementById('pbModalTitle');
  const availList = document.getElementById('pbAvailList');
  const assignedList = document.getElementById('pbAssignedList');
  const availCount = document.getElementById('pbAvailCount');
  const assignedCount = document.getElementById('pbAssignedCount');
  const availSearch = document.getElementById('pbAvailSearch');
  const assignedSearch = document.getElementById('pbAssignedSearch');

  let editingId = null;
  let assigned = [];
  let availFilter = '';
  let assignedFilter = '';

  function renderPanes() {
    const availNames = CONTACTS.map(c => c.name).filter(n => !assigned.includes(n));
    const availRows = availNames.filter(n => n.toLowerCase().includes(availFilter));
    const assignedRows = assigned.filter(n => n.toLowerCase().includes(assignedFilter));

    availCount.textContent = availRows.length + ' records';
    assignedCount.textContent = assignedRows.length + ' records';

    availList.innerHTML = availRows.map(n => '<li data-name="' + n + '">' + n + '</li>').join('') || '<li style="color:#b7bfc5;cursor:default">No contacts found</li>';
    assignedList.innerHTML = assignedRows.map(n => '<li class="checked" data-name="' + n + '">' + n + '</li>').join('') || '<li style="color:#b7bfc5;cursor:default">No contacts added</li>';
  }

  availList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-name]');
    if (!li) return;
    assigned.push(li.dataset.name);
    renderPanes();
  });

  assignedList.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-name]');
    if (!li) return;
    assigned = assigned.filter(n => n !== li.dataset.name);
    renderPanes();
  });

  availSearch.addEventListener('input', (e) => { availFilter = e.target.value.trim().toLowerCase(); renderPanes(); });
  assignedSearch.addEventListener('input', (e) => { assignedFilter = e.target.value.trim().toLowerCase(); renderPanes(); });

  function openModal(pb) {
    editingId = pb.id;
    modalTitle.textContent = 'Edit Phone Book — ' + pb.name;
    assigned = pb.contacts.slice();
    availFilter = '';
    assignedFilter = '';
    availSearch.value = '';
    assignedSearch.value = '';
    renderPanes();
    modal.hidden = false;
  }

  function closeModal() { modal.hidden = true; }

  document.getElementById('pbModalClose').addEventListener('click', closeModal);
  document.getElementById('pbCancelBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.getElementById('pbSaveBtn').addEventListener('click', () => {
    const pb = PHONE_BOOKS.find(x => x.id === editingId);
    if (pb) {
      pb.contacts = assigned.slice();
      pb.updated = todayStr();
      renderBody();
    }
    closeModal();
  });

  renderBody();
});
