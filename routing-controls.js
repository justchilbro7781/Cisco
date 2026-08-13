document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (7 records) ---------- */
  const controls = [
    { name: 'Account_Lookup',        type: 'Table',    value: '',   status: 'Active',   updatedBy: 'rbarrows',    updated: '03/30/2020 10:22 AM',
      detail: '412 account numbers mapped to their owning business unit.' },
    { name: 'Cumulus_Offer_Callback', type: 'Switch',  value: 'Off', status: 'Active',  updatedBy: 'rbarrows',    updated: '03/24/2020 01:40 AM',
      detail: 'Turns the in-queue callback offer on or off for all Cumulus queues.' },
    { name: 'Emerg_Closed_A',        type: 'Switch',   value: 'Off', status: 'Active',  updatedBy: 'rbarrows',    updated: '03/24/2020 01:40 AM',
      detail: 'Emergency closure switch for site A. When on, all calls hear the closed message.' },
    { name: 'Cumulus_HOOPS',         type: 'Schedule', value: '',   status: 'Active',   updatedBy: 'portalowner', updated: '03/24/2020 01:06 AM',
      detail: 'Hours of operation: Mon-Fri 09:00-18:00, Sat 10:00-14:00, Sun closed.' },
    { name: 'A_HOOPS',               type: 'Schedule', value: '',   status: 'Active',   updatedBy: 'portalowner', updated: '03/24/2020 12:48 AM',
      detail: 'Hours of operation for site A: Mon-Fri 08:00-20:00.' },
    { name: 'Text1',                 type: 'Text',     value: '"Offer promotion X to the customer"', status: 'Inactive', updatedBy: 'portalowner', updated: '03/16/2020 04:06 PM',
      detail: 'Free text value read by the routing script and shown on the agent desktop.' },
    { name: 'Blocked_Phone_Numbs',   type: 'Table',    value: '',   status: 'Active',   updatedBy: 'portalowner', updated: '03/16/2020 03:53 PM',
      detail: '28 blocked numbers. Calls from these numbers are rejected before queueing.' }
  ];

  const TYPE_ICON = { Table: 'icon-table', Switch: 'icon-toggle', Schedule: 'icon-calendar', Text: 'icon-type' };

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { name: '', type: '', value: '', status: '', updatedBy: '', updated: '' };
  let sortKey = null;
  let sortDir = 1;

  /* ---------- Render ---------- */
  function visibleRows() {
    return controls
      .map((c, i) => ({ c, i }))
      .filter(({ c }) =>
        c.name.toLowerCase().includes(filters.name) &&
        c.value.toLowerCase().includes(filters.value) &&
        c.updatedBy.toLowerCase().includes(filters.updatedBy) &&
        c.updated.toLowerCase().includes(filters.updated) &&
        (filters.type === '' || c.type.toLowerCase() === filters.type) &&
        (filters.status === '' || c.status.toLowerCase() === filters.status)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        return String(a.c[sortKey]).localeCompare(String(b.c[sortKey])) * sortDir;
      });
  }

  function render() {
    const rows = visibleRows();
    body.innerHTML = '';

    rows.forEach(({ c, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        '<td class="cell-left">' + c.name + '</td>' +
        '<td><span class="ctrl-type"><svg class="icon"><use href="#' + TYPE_ICON[c.type] + '"/></svg>' +
          c.type + '</span></td>' +
        '<td>' + (c.type === 'Switch'
          ? '<button class="mini-switch ' + (c.value === 'On' ? 'on' : 'off') + '" title="Toggle">' +
            '<span></span>' + c.value + '</button>'
          : '<span class="cell-value">' + c.value + '</span>') + '</td>' +
        '<td><span class="status-tag ' + c.status.toLowerCase() + '">' + c.status + '</span></td>' +
        '<td class="im-muted">' + c.updatedBy + '</td>' +
        '<td class="im-muted">' + c.updated + '</td>' +
        '<td class="col-actions">' +
          '<button class="row-btn edit-btn" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
          (c.type === 'Schedule'
            ? '<button class="row-btn sched-btn" title="Edit schedule"><svg class="icon"><use href="#icon-calendar"/></svg></button>'
            : '') +
          '<button class="row-btn data-btn" title="View data"><svg class="icon"><use href="#icon-table"/></svg></button>' +
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
    const item = controls[tr.dataset.index];

    if (e.target.closest('.mini-switch')) {
      item.value = item.value === 'On' ? 'Off' : 'On';
      item.updated = 'Just now';
      render();
      return;
    }

    if (e.target.closest('.edit-btn')) {
      const name = prompt('Edit control name:', item.name);
      if (name !== null && name.trim() !== '') {
        item.name = name.trim();
        render();
      }
      return;
    }

    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete control "' + item.name + '"?')) {
        controls.splice(controls.indexOf(item), 1);
        render();
      }
      return;
    }

    if (e.target.closest('.sched-btn')) {
      alert('Schedule editor for ' + item.name);
      return;
    }

    if (e.target.closest('.data-btn')) {
      alert(item.name + '\n\n' + item.detail);
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
        '<td colspan="8"><div class="detail-grid">' +
          '<div><span>Control Name</span>' + item.name + '</div>' +
          '<div><span>Control Type</span>' + item.type + '</div>' +
          '<div><span>Status</span>' + item.status + '</div>' +
          '<div><span>Control Value</span>' + (item.value || '—') + '</div>' +
          '<div><span>Last Update By</span>' + item.updatedBy + '</div>' +
          '<div><span>Last Update Date</span>' + item.updated + '</div>' +
          '<div class="wide"><span>Details</span>' + item.detail + '</div>' +
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

  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', () => {
      filters[select.dataset.filter] = select.value;
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
      const name = prompt('New control name:');
      if (name && name.trim()) {
        controls.unshift({
          name: name.trim(), type: 'Switch', value: 'Off', status: 'Active',
          updatedBy: 'Administrator', updated: 'Just now',
          detail: 'New routing control. Configure its value before use.'
        });
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Control Name,Control Type,Control Value,Status,Last Update By,Last Update Date']
        .concat(visibleRows().map(({ c }) =>
          ['"' + c.name + '"', c.type, '"' + c.value.replace(/"/g, '') + '"',
           c.status, c.updatedBy, '"' + c.updated + '"'].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'routing-controls.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    render();
  });

  render();
});
