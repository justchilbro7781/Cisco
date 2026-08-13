document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data ---------- */
  const campaigns = [
    { name: 'AcqueonOutboundAgent',     enabled: true, description: 'AcqueonOutboundAgent',     type: 'Agent Based' },
    { name: 'AcqueonOutboundIVR',       enabled: true, description: 'AcqueonOutboundIVR',       type: 'IVR Based' },
    { name: 'AcqueonOutboundPreview',   enabled: true, description: 'AcqueonOutboundPreview',   type: 'Agent Based' },
    { name: 'AcqueonOutboundSimulator', enabled: true, description: 'AcqueonOutboundSimulator', type: 'Agent Based' },
    { name: 'ConsiliumOutboundAgent',     enabled: true, description: 'ConsiliumOutboundAgent',     type: 'Agent Based' },
    { name: 'ConsiliumOutboundIVR',       enabled: true, description: 'ConsiliumOutboundIVR',       type: 'IVR Based' },
    { name: 'ConsiliumOutboundPreview',   enabled: true, description: 'ConsiliumOutboundPreview',   type: 'Agent Based' },
    { name: 'ConsiliumOutboundSimulator', enabled: true, description: 'ConsiliumOutboundSimulator', type: 'Agent Based' },
    { name: 'CumulusOutboundAgent',     enabled: true, description: 'CumulusOutboundAgent',     type: 'Agent Based' },
    { name: 'CumulusOutboundIVR',       enabled: true, description: 'CumulusOutboundIVR',       type: 'IVR Based' },
    { name: 'CumulusOutboundPreview',   enabled: true, description: 'CumulusOutboundPreview',   type: 'Agent Based' },
    { name: 'CumulusOutboundSimulator', enabled: true, description: 'CumulusOutboundSimulator', type: 'Agent Based' }
  ];

  const body = document.getElementById('gridBody');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = { name: '', enabled: '', description: '', type: '' };
  let sortKey = null;
  let sortDir = 1;

  /* ---------- Render ---------- */
  function visibleRows() {
    return campaigns
      .map((c, i) => ({ c, i }))
      .filter(({ c }) =>
        c.name.toLowerCase().includes(filters.name) &&
        c.description.toLowerCase().includes(filters.description) &&
        c.type.toLowerCase().includes(filters.type) &&
        (filters.enabled === '' || (filters.enabled === 'yes') === c.enabled)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const va = a.c[sortKey], vb = b.c[sortKey];
        if (typeof va === 'boolean') return (va === vb ? 0 : va ? 1 : -1) * sortDir;
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
        '<td>' + c.name + '</td>' +
        '<td><button class="toggle ' + (c.enabled ? 'on' : 'off') + '" title="Toggle enabled">' +
          '<span class="toggle-text">' + (c.enabled ? 'YES' : 'NO') + '</span>' +
          '<span class="toggle-knob"></span></button></td>' +
        '<td>' + c.description + '</td>' +
        '<td>' + c.type + '</td>' +
        '<td class="col-edit"><button class="edit-btn" title="Edit">' +
          '<svg class="icon"><use href="#icon-pencil"/></svg></button></td>';
      body.appendChild(tr);
    });

    recordCount.textContent = rows.length;
    noRecords.hidden = rows.length > 0;
  }

  /* ---------- Row interactions ---------- */
  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const campaign = campaigns[tr.dataset.index];

    const toggle = e.target.closest('.toggle');
    if (toggle) {
      campaign.enabled = !campaign.enabled;
      render();
      return;
    }

    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const name = prompt('Edit campaign name:', campaign.name);
      if (name !== null && name.trim() !== '') {
        campaign.name = name.trim();
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
          '<div><span>Name</span>' + campaign.name + '</div>' +
          '<div><span>Type</span>' + campaign.type + '</div>' +
          '<div><span>Enabled</span>' + (campaign.enabled ? 'YES' : 'NO') + '</div>' +
          '<div class="wide"><span>Description</span>' + campaign.description + '</div>' +
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
    filters.enabled = e.target.value;
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
      const name = prompt('New campaign name:');
      if (name && name.trim()) {
        campaigns.push({
          name: name.trim(),
          enabled: true,
          description: name.trim(),
          type: 'Agent Based'
        });
        render();
      }
    } else if (btn.dataset.action === 'export') {
      const csv = ['Campaign Name,Enabled,Campaign Description,Campaign Type']
        .concat(visibleRows().map(({ c }) =>
          [c.name, c.enabled ? 'YES' : 'NO', c.description, c.type].join(',')))
        .join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'campaigns.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      render();
    }
  });

  render();
});
