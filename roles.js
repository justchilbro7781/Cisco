document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (15 records) ---------- */
  const roles = [
    { name: 'All Agent Role Group',                        description: 'All Agent Role Group',                        users: 12, features: 11 },
    { name: 'All Campaign Admin Role Group',               description: 'All Campaign Admin Role Group',               users: 7,  features: 7 },
    { name: 'All Interaction Manager Admin Role Group',    description: 'All Interaction Manager Admin Role Group',    users: 2,  features: 30 },
    { name: 'All Interaction Manager Developer Role Group', description: 'All Interaction Manager Developer Role Group', users: 2, features: 27 },
    { name: 'All Manager Role Group',                      description: 'All Manager Role Group',                      users: 3,  features: 68 },
    { name: 'All Program Admin Role Group',                description: 'All Program Admin Role Group',                users: 3,  features: 141 },
    { name: 'All Program Owner Role Group',                description: 'All Program Owner Role Group',                users: 2,  features: 146, system: true },
    { name: 'All Regular User Role Group',                 description: 'All Regular User Role Group',                 users: 4,  features: 12 },
    { name: 'All Routing Control Admin Role Group',        description: 'All Routing Control Admin Role Group',        users: 2,  features: 7 },
    { name: 'All Routing Control Manager Role Group',      description: 'All Routing Control Manager Role Group',      users: 3,  features: 4 },
    { name: 'All Routing Control User Role Group',         description: 'All Routing Control User Role Group',         users: 9,  features: 2 },
    { name: 'All Supervisor Role Group',                   description: 'All Supervisor Role Group',                   users: 7,  features: 74 },
    { name: 'All User Defined Role Group',                 description: 'All User Defined Role Group',                 users: 0,  features: 1 },
    { name: 'DCloud_Admin_Role',                           description: 'Dcloud Admin Role',                           users: 2,  features: 145 },
    { name: 'Dcloud_Supervisor_Role',                      description: 'DCloud Supervisor Role',                      users: 5,  features: 82 }
  ];

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { name: '', description: '', users: '', features: '' };
  let sortKey = null;
  let sortDir = 1;

  function visibleRows() {
    return roles
      .map((r, i) => ({ r, i }))
      .filter(({ r }) =>
        r.name.toLowerCase().includes(filters.name) &&
        r.description.toLowerCase().includes(filters.description) &&
        String(r.users).includes(filters.users) &&
        String(r.features).includes(filters.features)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = a.r[sortKey], vb = b.r[sortKey];
        if (typeof va === 'number') return (va - vb) * sortDir;
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
        '<td class="cell-left">' + r.name + '</td>' +
        '<td>' + r.description + '</td>' +
        '<td><span class="count-pill' + (r.users === 0 ? ' zero' : '') + '">' + r.users + '</span></td>' +
        '<td><span class="count-pill feat">' + r.features + '</span></td>' +
        '<td class="col-actions">' +
          '<button class="row-btn edit-btn" title="Edit role"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="row-btn users-btn" title="Assigned users"><svg class="icon"><use href="#icon-user"/></svg></button>' +
          (r.system ? '' :
          '<button class="row-btn perms-btn" title="Permissions"><svg class="icon"><use href="#icon-user-cog"/></svg></button>') +
          '<button class="row-btn copy-btn" title="Clone role"><svg class="icon"><use href="#icon-copy"/></svg></button>' +
          '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
          '<button class="row-btn data-btn" title="Feature list"><svg class="icon"><use href="#icon-table"/></svg></button>' +
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
    const role = roles[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      const name = prompt('Edit role name:', role.name);
      if (name !== null && name.trim() !== '') {
        role.name = name.trim();
        render();
      }
      return;
    }
    if (e.target.closest('.users-btn')) {
      alert(role.name + '\n\nActive users: ' + role.users);
      return;
    }
    if (e.target.closest('.perms-btn')) {
      alert('Permissions for ' + role.name + '\n\nAssigned features: ' + role.features);
      return;
    }
    if (e.target.closest('.copy-btn')) {
      const copy = Object.assign({}, role, { name: role.name + ' (copy)', users: 0 });
      roles.splice(roles.indexOf(role) + 1, 0, copy);
      render();
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (role.users > 0) {
        alert('Cannot delete "' + role.name + '" — ' + role.users + ' users are still assigned to it.');
        return;
      }
      if (confirm('Delete role "' + role.name + '"?')) {
        roles.splice(roles.indexOf(role), 1);
        render();
      }
      return;
    }
    if (e.target.closest('.data-btn')) {
      alert(role.name + '\n\n' + role.features + ' features assigned to this role group.');
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
          '<div><span>Role Name</span>' + role.name + '</div>' +
          '<div><span>Active Users</span>' + role.users + '</div>' +
          '<div><span>Assigned Features</span>' + role.features + '</div>' +
          '<div><span>Role Type</span>' + (role.system ? 'System defined' : 'User manageable') + '</div>' +
          '<div class="wide"><span>Description</span>' + role.description + '</div>' +
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
      const name = prompt('New role name:');
      if (name && name.trim()) {
        roles.push({ name: name.trim(), description: name.trim(), users: 0, features: 0 });
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Name,Description,Active Users,Assigned Features']
        .concat(visibleRows().map(({ r }) =>
          ['"' + r.name + '"', '"' + r.description + '"', r.users, r.features].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'roles.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    render();
  });

  render();
});
