document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data ---------- */
  const sites = [
    {
      name: 'site-001',
      departments: [
        { name: 'Product', billingUnits: ['BU-Product-01', 'BU-Product-02'] },
        { name: 'Sales', billingUnits: ['BU-Sales-01'] },
        { name: 'Support', billingUnits: ['BU-Support-01', 'BU-Support-02', 'BU-Support-03'] }
      ]
    }
  ];

  let selSite = null;
  let selDept = null;
  let selBu = null;
  const search = { site: '', dept: '', bu: '' };

  const el = id => document.getElementById(id);

  /* ---------- Generic list renderer ---------- */
  function renderList(cfg) {
    const list = el(cfg.listId);
    const empty = el(cfg.emptyId);
    const rows = cfg.items.filter(i => i.name.toLowerCase().includes(search[cfg.level]));

    list.innerHTML = '';
    rows.forEach(item => {
      const li = document.createElement('li');
      li.dataset.name = item.name;
      if (cfg.selected && item.name === cfg.selected.name) li.classList.add('selected');
      li.innerHTML =
        '<span class="loc-name">' + item.name + '</span>' +
        (cfg.subCount ? '<span class="loc-sub" title="' + cfg.subLabel + '">' + cfg.subCount(item) + '</span>' : '') +
        '<span class="loc-row-btns">' +
          '<button class="loc-row-btn edit" title="Edit"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
          '<button class="loc-row-btn del" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
        '</span>';
      list.appendChild(li);
    });

    el(cfg.countId).textContent = rows.length;
    empty.hidden = rows.length > 0;
    list.hidden = rows.length === 0;
  }

  function render() {
    /* Sites */
    renderList({
      level: 'site', listId: 'siteList', emptyId: 'siteEmpty', countId: 'siteCount',
      items: sites, selected: selSite,
      subLabel: 'Departments', subCount: s => s.departments.length
    });

    /* Departments */
    const depts = selSite ? selSite.departments : [];
    renderList({
      level: 'dept', listId: 'deptList', emptyId: 'deptEmpty', countId: 'deptCount',
      items: depts, selected: selDept,
      subLabel: 'Billing units', subCount: d => d.billingUnits.length
    });

    /* Billing units */
    const bus = selDept ? selDept.billingUnits.map(n => ({ name: n })) : [];
    renderList({
      level: 'bu', listId: 'buList', emptyId: 'buEmpty', countId: 'buCount',
      items: bus, selected: selBu ? { name: selBu } : null
    });

    /* Locked / unlocked panels */
    setLocked('dept', !selSite);
    setLocked('bu', !selDept);

    el('deptEmpty').querySelector('.loc-empty-hint').textContent =
      selSite ? 'No departments in this site yet.' : 'Select a site to see its departments.';
    el('buEmpty').querySelector('.loc-empty-hint').textContent =
      selDept ? 'No billing units in this department yet.' : 'Select a department to see its billing units.';

    /* Trail chips */
    setChip('trailSite', selSite ? selSite.name : 'No site selected', !!selSite);
    setChip('trailDept', selDept ? selDept.name : 'No department', !!selDept);
    setChip('trailBu', selBu || 'No billing unit', !!selBu);
  }

  function setLocked(level, locked) {
    document.querySelector('.loc-panel[data-level="' + level + '"]').classList.toggle('locked', locked);
    document.querySelector('.loc-actions-btn[data-menu="' + level + '"]').disabled = locked;
    el(level + 'Search').disabled = locked;
  }

  function setChip(id, text, on) {
    const chip = el(id);
    chip.querySelector('span').textContent = text;
    chip.classList.toggle('set', on);
  }

  /* ---------- Selection + row actions ---------- */
  function wireList(listId, onSelect, onEdit, onDelete) {
    el(listId).addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const name = li.dataset.name;

      if (e.target.closest('.edit')) {
        const value = prompt('Rename:', name);
        if (value !== null && value.trim() !== '') onEdit(name, value.trim());
        render();
        return;
      }
      if (e.target.closest('.del')) {
        if (confirm('Delete "' + name + '"?')) onDelete(name);
        render();
        return;
      }
      onSelect(name);
      render();
    });
  }

  wireList('siteList',
    name => {
      selSite = sites.find(s => s.name === name);
      selDept = null;
      selBu = null;
    },
    (old, next) => { sites.find(s => s.name === old).name = next; },
    name => {
      sites.splice(sites.findIndex(s => s.name === name), 1);
      if (selSite && selSite.name === name) { selSite = null; selDept = null; selBu = null; }
    }
  );

  wireList('deptList',
    name => {
      selDept = selSite.departments.find(d => d.name === name);
      selBu = null;
    },
    (old, next) => { selSite.departments.find(d => d.name === old).name = next; },
    name => {
      selSite.departments.splice(selSite.departments.findIndex(d => d.name === name), 1);
      if (selDept && selDept.name === name) { selDept = null; selBu = null; }
    }
  );

  wireList('buList',
    name => { selBu = name; },
    (old, next) => { selDept.billingUnits[selDept.billingUnits.indexOf(old)] = next; },
    name => {
      selDept.billingUnits.splice(selDept.billingUnits.indexOf(name), 1);
      if (selBu === name) selBu = null;
    }
  );

  /* ---------- Search ---------- */
  [['siteSearch', 'site'], ['deptSearch', 'dept'], ['buSearch', 'bu']].forEach(([id, level]) => {
    el(id).addEventListener('input', (e) => {
      search[level] = e.target.value.trim().toLowerCase();
      render();
    });
  });

  /* ---------- Per-panel Actions menus ---------- */
  document.querySelectorAll('.loc-actions-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = el('menu-' + btn.dataset.menu);
      const wasHidden = menu.hidden;
      document.querySelectorAll('.loc-menu').forEach(m => { m.hidden = true; });
      menu.hidden = !wasHidden;
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.loc-menu').forEach(m => { m.hidden = true; });
  });

  document.querySelectorAll('.loc-menu').forEach(menu => {
    const level = menu.id.replace('menu-', '');
    menu.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.dataset.action === 'new') {
        const name = prompt('New name:');
        if (name && name.trim()) {
          if (level === 'site') sites.push({ name: name.trim(), departments: [] });
          if (level === 'dept') selSite.departments.push({ name: name.trim(), billingUnits: [] });
          if (level === 'bu') selDept.billingUnits.push(name.trim());
        }
      } else if (btn.dataset.action === 'export') {
        const rows = level === 'site' ? sites.map(s => s.name)
                   : level === 'dept' ? selSite.departments.map(d => d.name)
                   : selDept.billingUnits.slice();
        const header = level === 'site' ? 'Site Name'
                     : level === 'dept' ? 'Department Name' : 'Billing Unit Name';
        const url = URL.createObjectURL(
          new Blob([[header].concat(rows).join('\n')], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = level + 's.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
      render();
    });
  });

  render();
});
