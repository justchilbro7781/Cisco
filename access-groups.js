document.addEventListener('DOMContentLoaded', () => {
  const groups = [
    { name: 'Cumulus_All',            description: 'Every user in the Cumulus organisation', type: 'Custom',     members: 148 },
    { name: 'Cumulus_Sales',          description: 'Sales department users and supervisors', type: 'Department', members: 34 },
    { name: 'Cumulus_Support',        description: 'Support department users',               type: 'Department', members: 52 },
    { name: 'Cumulus_HealthCare',     description: 'Health care line of business',           type: 'Department', members: 21 },
    { name: 'Site_001_Users',         description: 'All users belonging to site-001',        type: 'Site',       members: 148 },
    { name: 'Campaign_Admins',        description: 'Users who can manage outbound campaigns', type: 'Custom',    members: 7 },
    { name: 'Routing_Control_Owners', description: 'Owners of routing control objects',      type: 'Custom',     members: 5 },
    { name: 'Reporting_Viewers',      description: 'Read only access to reports and dashboards', type: 'Custom', members: 63 },
    { name: 'Interaction_Designers',  description: 'Designers working on IVR and chat flows', type: 'Custom',    members: 4 }
  ];

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { name: '', description: '', type: '', members: '' };
  let sortKey = null;
  let sortDir = 1;

  function visibleRows() {
    return groups
      .map((g, i) => ({ g, i }))
      .filter(({ g }) =>
        g.name.toLowerCase().includes(filters.name) &&
        g.description.toLowerCase().includes(filters.description) &&
        String(g.members).includes(filters.members) &&
        (filters.type === '' || g.type.toLowerCase() === filters.type)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = a.g[sortKey], vb = b.g[sortKey];
        if (typeof va === 'number') return (va - vb) * sortDir;
        return String(va).localeCompare(String(vb)) * sortDir;
      });
  }

  function render() {
    const rows = visibleRows();
    body.innerHTML = '';

    rows.forEach(({ g, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        '<td class="cell-left">' + g.name + '</td>' +
        '<td>' + g.description + '</td>' +
        '<td><span class="ctrl-type"><svg class="icon"><use href="#icon-' +
          (g.type === 'Site' ? 'building' : g.type === 'Department' ? 'sitemap' : 'key') +
          '"/></svg>' + g.type + '</span></td>' +
        '<td><span class="count-pill">' + g.members + '</span></td>' +
        '<td class="col-actions">' +
          '<button class="row-btn edit-btn" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="row-btn members-btn" title="Members"><svg class="icon"><use href="#icon-user"/></svg></button>' +
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
    const group = groups[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      const name = prompt('Edit access group name:', group.name);
      if (name !== null && name.trim() !== '') {
        group.name = name.trim();
        render();
      }
      return;
    }
    if (e.target.closest('.members-btn')) {
      alert(group.name + '\n\nMembers: ' + group.members);
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete access group "' + group.name + '"?')) {
        groups.splice(groups.indexOf(group), 1);
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
          '<div><span>Access Group</span>' + group.name + '</div>' +
          '<div><span>Type</span>' + group.type + '</div>' +
          '<div><span>Members</span>' + group.members + '</div>' +
          '<div class="wide"><span>Description</span>' + group.description + '</div>' +
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
      const name = prompt('New access group name:');
      if (name && name.trim()) {
        groups.push({ name: name.trim(), description: name.trim(), type: 'Custom', members: 0 });
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Access Group Name,Description,Type,Members']
        .concat(visibleRows().map(({ g }) =>
          ['"' + g.name + '"', '"' + g.description + '"', g.type, g.members].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'access-groups.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    render();
  });

  render();
});
