document.addEventListener('DOMContentLoaded', () => {
  const collections = [
    { name: 'All_Cumulus_Agents',    description: 'Every agent in the Cumulus organisation', type: 'Agents',    items: 148 },
    { name: 'Sales_Teams',           description: 'Sales agent teams across all sites',      type: 'Teams',     items: 6 },
    { name: 'Support_Teams',         description: 'Support agent teams across all sites',    type: 'Teams',     items: 9 },
    { name: 'Inbound_Queues',        description: 'All inbound precision queues',            type: 'Queues',    items: 12 },
    { name: 'Outbound_Campaigns',    description: 'Agent and IVR based outbound campaigns',  type: 'Campaigns', items: 12 },
    { name: 'Chat_Queues',           description: 'Precision queues handling web chat',      type: 'Queues',    items: 4 },
    { name: 'Supervisor_Group',      description: 'All supervisors with dashboard access',   type: 'Agents',    items: 7 },
    { name: 'HealthCare_Queues',     description: 'Queues for the health care line of business', type: 'Queues', items: 3 }
  ];

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { name: '', description: '', type: '', items: '' };
  let sortKey = null;
  let sortDir = 1;

  const TYPE_ICON = { Agents: 'icon-user', Teams: 'icon-users', Queues: 'icon-target', Campaigns: 'icon-megaphone' };

  function visibleRows() {
    return collections
      .map((c, i) => ({ c, i }))
      .filter(({ c }) =>
        c.name.toLowerCase().includes(filters.name) &&
        c.description.toLowerCase().includes(filters.description) &&
        String(c.items).includes(filters.items) &&
        (filters.type === '' || c.type.toLowerCase() === filters.type)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = a.c[sortKey], vb = b.c[sortKey];
        if (typeof va === 'number') return (va - vb) * sortDir;
        return String(va).localeCompare(String(vb)) * sortDir;
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
        '<td>' + c.description + '</td>' +
        '<td><span class="ctrl-type"><svg class="icon"><use href="#' + TYPE_ICON[c.type] + '"/></svg>' +
          c.type + '</span></td>' +
        '<td><span class="count-pill">' + c.items + '</span></td>' +
        '<td class="col-actions">' +
          '<button class="row-btn edit-btn" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="row-btn items-btn" title="View items"><svg class="icon"><use href="#icon-table"/></svg></button>' +
          '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
        '</td>';
      body.appendChild(tr);
    });

    recordCount.textContent = rows.length;
    noRecords.hidden = rows.length > 0;
  }

  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const item = collections[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      const name = prompt('Edit collection name:', item.name);
      if (name !== null && name.trim() !== '') {
        item.name = name.trim();
        render();
      }
      return;
    }
    if (e.target.closest('.items-btn')) {
      alert(item.name + '\n\n' + item.items + ' ' + item.type.toLowerCase() + ' in this collection.');
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete collection "' + item.name + '"?')) {
        collections.splice(collections.indexOf(item), 1);
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
          '<div><span>Collection</span>' + item.name + '</div>' +
          '<div><span>Object Type</span>' + item.type + '</div>' +
          '<div><span>Items</span>' + item.items + '</div>' +
          '<div class="wide"><span>Description</span>' + item.description + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

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
      const name = prompt('New collection name:');
      if (name && name.trim()) {
        collections.push({ name: name.trim(), description: name.trim(), type: 'Agents', items: 0 });
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Collection Name,Description,Object Type,Items']
        .concat(visibleRows().map(({ c }) =>
          ['"' + c.name + '"', '"' + c.description + '"', c.type, c.items].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'collections.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    render();
  });

  render();
});
