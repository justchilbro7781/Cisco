document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Dummy data (matches the rest of the site) ---------- */
  const attributes = [
    { name: 'CumulusCity',       type: 'Boolean', value: 'true',           agents: 4 },
    { name: 'CumulusHealthCare', type: 'Boolean', value: 'true',           agents: 0 },
    { name: 'CumulusFinance',    type: 'Boolean', value: 'false',          agents: 0 },
    { name: 'VIPStatus',         type: 'Boolean', value: 'false',          agents: 2 },
    { name: 'CustomerTier',      type: 'String',  value: 'Premium',        agents: 6 },
    { name: 'Language',          type: 'String',  value: 'English',        agents: 9 },
    { name: 'Region',            type: 'String',  value: 'North America',  agents: 5 },
    { name: 'CallReason',        type: 'String',  value: 'Billing',        agents: 3 },
    { name: 'AccountType',       type: 'String',  value: 'Enterprise',     agents: 4 },
    { name: 'ChannelPreference', type: 'String',  value: 'Chat',           agents: 6 },
    { name: 'ContractLevel',     type: 'String',  value: 'Gold',           agents: 3 },
    { name: 'Priority',          type: 'Number',  value: '1',              agents: 7 }
  ];

  const agentAttributes = [
    { user: 'amacdowell', name: 'MacDowell, Andy',     count: 3 },
    { user: 'annika',     name: 'Hamilton, Annika',    count: 2 },
    { user: 'bbrown',     name: 'Brown, Beacham',      count: 4 },
    { user: 'csupervisor', name: 'Supervisor, Cathy',  count: 5 },
    { user: 'hliang',     name: 'Liang, Helen',        count: 1 },
    { user: 'jabracks',   name: 'Bracksted, James',    count: 3 },
    { user: 'Jdoe',       name: 'Doe, Jane',           count: 2 },
    { user: 'jopeters',   name: 'Petreson, Josh',      count: 0 },
    { user: 'rbarrows',   name: 'Barrows, Rick',       count: 6 },
    { user: 'sjeffers',   name: 'Jefferson, Sandra',   count: 4 },
    { user: 'vbcpod1',    name: 'POD1, VBC',           count: 1 }
  ];

  /* ---------- Reusable dynamic-column grid ---------- */
  function setupGrid(cfg) {
    const id = cfg.idPrefix;
    const el = suffix => document.getElementById(id + suffix);
    const body = el('Body');
    const gridHead = el('Head');
    const gridColgroup = el('Colgroup');
    const noRecords = el('NoRecords');
    const recordCount = el('RecordCount');
    const colToggleList = el('ColToggleList');

    const filters = {};
    cfg.columns.forEach(c => { if (!c.isActions) filters[c.key] = ''; });
    let sortKey = cfg.defaultSortKey;
    let sortDir = 1;

    function visibleColumns() {
      return cfg.columns.filter(c => c.visible);
    }

    function visibleRows() {
      return cfg.data
        .map((row, i) => ({ row, i }))
        .filter(({ row }) =>
          cfg.columns.every(c => c.isActions ||
            String(row[c.key]).toLowerCase().includes(filters[c.key])))
        .sort((a, b) => {
          if (!sortKey) return 0;
          const va = a.row[sortKey], vb = b.row[sortKey];
          if (typeof va === 'number') return (va - vb) * sortDir;
          return String(va).localeCompare(String(vb), undefined, { numeric: true }) * sortDir;
        });
    }

    function renderHead() {
      const cols = visibleColumns();
      gridColgroup.innerHTML = '<col style="width:36px">' +
        cols.map(c => '<col style="width:' + c.width + '">').join('');

      gridHead.innerHTML =
        '<tr class="head-row">' +
          '<th class="col-expand"></th>' +
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

      rows.forEach(({ row, i }) => {
        const tr = document.createElement('tr');
        tr.dataset.index = i;
        tr.innerHTML = '<td class="col-expand"></td>' +
          cols.map(c => {
            if (c.isActions) {
              return '<td class="col-actions">' +
                '<button class="row-btn edit-btn" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
                '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
              '</td>';
            }
            return '<td' + (c.align === 'left' ? ' class="attr-cell-left"' : '') + '>' + c.cell(row) + '</td>';
          }).join('');
        body.appendChild(tr);
      });

      recordCount.textContent = rows.length;
      noRecords.hidden = rows.length > 0;
    }

    body.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const row = cfg.data[tr.dataset.index];

      if (e.target.closest('.edit-btn')) {
        cfg.onEdit(row, renderBody);
        return;
      }
      if (e.target.closest('.delete-btn')) {
        if (confirm('Delete "' + row[cfg.columns[0].key] + '"?')) {
          cfg.data.splice(cfg.data.indexOf(row), 1);
          renderBody();
        }
      }
    });

    function renderColToggleList() {
      colToggleList.innerHTML = cfg.columns.map(c =>
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
      const col = cfg.columns.find(c => c.key === btn.dataset.col);
      col.visible = !col.visible;
      renderColToggleList();
      renderHead();
      renderBody();
    });

    function exportCsv(filename, rows) {
      const csv = [cfg.exportHeader.join(',')]
        .concat(rows.map(r => cfg.exportRow(r).join(',')))
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
      const rowsHtml = rows.map(r =>
        '<tr>' + cfg.exportRow(r).map(v => '<td>' + String(v).replace(/^"|"$/g, '') + '</td>').join('') + '</tr>'
      ).join('');
      win.document.write(
        '<html><head><title>' + cfg.exportTitle + '</title><style>' +
        'body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#333}' +
        'h2{font-size:15px} table{width:100%;border-collapse:collapse;margin-top:10px}' +
        'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left} th{background:#f2f4f6}' +
        '</style></head><body>' +
        '<h2>Webex Contact Center Enterprise &mdash; ' + cfg.exportTitle + '</h2>' +
        '<table><thead><tr>' + cfg.exportHeader.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody></table></body></html>'
      );
      win.document.close();
      win.focus();
      win.print();
    }

    const actionsMenu = el('ActionsMenu');
    el('ActionsBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      actionsMenu.hidden = !actionsMenu.hidden;
    });
    document.addEventListener('click', () => { actionsMenu.hidden = true; });

    actionsMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      switch (btn.dataset.action) {
        case 'new':
          cfg.onNew(renderBody);
          break;
        case 'clear-filters':
          Object.keys(filters).forEach(k => { filters[k] = ''; });
          renderHead();
          renderBody();
          break;
        case 'export-all-csv':
          exportCsv(id + '_all.csv', cfg.data);
          break;
        case 'export-visible-csv':
          exportCsv(id + '_visible.csv', visibleRows().map(({ row }) => row));
          break;
        case 'export-all-pdf':
          exportPdf(cfg.data);
          break;
        case 'export-visible-pdf':
          exportPdf(visibleRows().map(({ row }) => row));
          break;
      }
    });

    renderColToggleList();
    renderHead();
    renderBody();

    return { renderBody, renderHead };
  }

  /* ---------- Attributes grid ---------- */
  setupGrid({
    idPrefix: 'attr',
    data: attributes,
    defaultSortKey: 'name',
    exportTitle: 'Attributes',
    exportHeader: ['Attribute Name', 'Type', 'Value', 'Agent Count'],
    exportRow: r => ['"' + r.name + '"', r.type, '"' + r.value + '"', r.agents],
    columns: [
      { key: 'name', label: 'Attribute Name', width: '32%', visible: true, sortable: true,
        cell: r => '<span class="attr-name-cell"><svg class="icon"><use href="#icon-tag2"/></svg>' +
          '<span class="attr-name">' + r.name + '</span></span>' },
      { key: 'value', label: 'Value', width: '28%', visible: true, sortable: true,
        cell: r => r.type === 'Boolean'
          ? '<span class="attr-value-tag ' + (r.value === 'true' ? 'bool-true' : 'bool-false') + '">' + r.value + '</span>'
          : '<span class="attr-value-tag">' + r.value + '</span>' },
      { key: 'agents', label: 'Agent Count', width: '20%', visible: true, sortable: true,
        cell: r => '<span class="count-pill' + (r.agents === 0 ? ' zero' : '') + '">' + r.agents + '</span>' },
      { key: 'actions', label: 'Buttons', width: '90px', visible: true, sortable: false, isActions: true }
    ],
    onEdit: (row, rerender) => {
      const value = prompt('Value for ' + row.name + ':', row.value);
      if (value !== null && value.trim() !== '') {
        row.value = value.trim();
        rerender();
      }
    },
    onNew: (rerender) => {
      const name = prompt('New attribute name:');
      if (name && name.trim()) {
        attributes.push({ name: name.trim(), type: 'String', value: '', agents: 0 });
        rerender();
      }
    }
  });

  /* ---------- Agent attribute-count grid ---------- */
  setupGrid({
    idPrefix: 'agentAttr',
    data: agentAttributes,
    defaultSortKey: 'user',
    exportTitle: 'Agent Attributes',
    exportHeader: ['Agent Name', 'Attribute Count'],
    exportRow: r => ['"' + r.user + ' - ' + r.name + '"', r.count],
    columns: [
      { key: 'user', label: 'Agent Name', width: '60%', visible: true, sortable: true, align: 'left',
        cell: r => '<span class="username-cell"><svg class="icon"><use href="#icon-user"/></svg>' +
          '<b>' + r.user + '</b> - <span class="im-muted">' + r.name + '</span></span>' },
      { key: 'count', label: 'Attribute Count', width: '25%', visible: true, sortable: true,
        cell: r => '<span class="count-pill' + (r.count === 0 ? ' zero' : '') + '">' + r.count + '</span>' },
      { key: 'actions', label: 'Buttons', width: '90px', visible: true, sortable: false, isActions: true }
    ],
    onEdit: (row, rerender) => {
      const count = prompt('Attribute count for ' + row.user + ':', row.count);
      if (count !== null && !isNaN(count)) {
        row.count = Number(count);
        rerender();
      }
    },
    onNew: (rerender) => {
      const user = prompt('Agent username:');
      if (user && user.trim()) {
        agentAttributes.push({ user: user.trim(), name: '', count: 0 });
        rerender();
      }
    }
  });

  /* ---------- Footer ---------- */
  document.getElementById('attrSave').addEventListener('click', () => {
    alert('Attribute assignments saved.');
  });
  document.getElementById('attrCancel').addEventListener('click', () => {
    location.reload();
  });
});
