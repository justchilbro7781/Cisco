document.addEventListener('DOMContentLoaded', () => {
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function createDefaultShifts() {
    return [
      { open: '8:00 AM', close: '10:00 PM', range: '1', rangeMin: '0', rangeMax: '1000000', disabled: false },
      { open: 'N/A', close: 'N/A', range: '0', rangeMin: '0', rangeMax: '0', disabled: true },
      { open: 'N/A', close: 'N/A', range: '0', rangeMin: '0', rangeMax: '0', disabled: true },
      { open: 'N/A', close: 'N/A', range: '0', rangeMin: '0', rangeMax: '0', disabled: true }
    ];
  }

  function createDefaultSchedule() {
    const schedule = {};
    DAYS.forEach(d => { schedule[d] = createDefaultShifts(); });
    schedule['Sunday'][0].open = ''; schedule['Sunday'][0].close = ''; schedule['Sunday'][0].disabled = true; schedule['Sunday'][0].range = '0'; schedule['Sunday'][0].rangeMin = '0'; schedule['Sunday'][0].rangeMax = '0';
    schedule['Saturday'][0].open = '9:00 AM'; schedule['Saturday'][0].close = '4:00 PM';
    return schedule;
  }

  const controls = [
    { name: 'VBCSchedule',           type: 'Schedule', value: '',   status: 'Active',   updatedBy: 'Administrator', updated: '08/15/2026 09:00 AM',
      detail: 'VBC Schedule Page - Hours of operation with configurable shifts per day.',
      code: 'VBCSchedule', description: 'VBC Schedule Page', timeZone: 'US/Eastern',
      normalSchedule: createDefaultSchedule(),
      specialSchedule: createDefaultSchedule()
    },
    { name: 'Account_Lookup',        type: 'Table',    value: '',   status: 'Active',   updatedBy: 'rbarrows',    updated: '03/30/2020 10:22 AM',
      detail: '412 account numbers mapped to their owning business unit.' },
    { name: 'Cumulus_Offer_Callback', type: 'Switch',  value: 'Off', status: 'Active',  updatedBy: 'rbarrows',    updated: '03/24/2020 01:40 AM',
      detail: 'Turns the in-queue callback offer on or off for all Cumulus queues.' },
    { name: 'Emerg_Closed_A',        type: 'Switch',   value: 'Off', status: 'Active',  updatedBy: 'rbarrows',    updated: '03/24/2020 01:40 AM',
      detail: 'Emergency closure switch for site A. When on, all calls hear the closed message.' },
    { name: 'Cumulus_HOOPS',         type: 'Schedule', value: '',   status: 'Active',   updatedBy: 'portalowner', updated: '03/24/2020 01:06 AM',
      detail: 'Hours of operation: Mon-Fri 09:00-18:00, Sat 10:00-14:00, Sun closed.',
      code: 'Cumulus_HOOPS', description: 'Cumulus Hours of Operation', timeZone: 'US/Eastern',
      normalSchedule: createDefaultSchedule(),
      specialSchedule: createDefaultSchedule()
    },
    { name: 'A_HOOPS',               type: 'Schedule', value: '',   status: 'Active',   updatedBy: 'portalowner', updated: '03/24/2020 12:48 AM',
      detail: 'Hours of operation for site A: Mon-Fri 08:00-20:00.',
      code: 'A_HOOPS', description: 'Site A Hours of Operation', timeZone: 'US/Eastern',
      normalSchedule: createDefaultSchedule(),
      specialSchedule: createDefaultSchedule()
    },
    { name: 'Text1',                 type: 'Text',     value: '"Offer promotion X to the customer"', status: 'Inactive', updatedBy: 'portalowner', updated: '03/16/2020 04:06 PM',
      detail: 'Free text value read by the routing script and shown on the agent desktop.' },
    { name: 'Blocked_Phone_Numbs',   type: 'Table',    value: '',   status: 'Active',   updatedBy: 'portalowner', updated: '03/16/2020 03:53 PM',
      detail: '28 blocked numbers. Calls from these numbers are rejected before queueing.' }
  ];

  const TYPE_ICON = { Table: 'icon-table', Switch: 'icon-toggle', Schedule: 'icon-calendar', Text: 'icon-type' };

  /* ---------- Column configuration (drives grid head/body + the Columns checklist) ---------- */
  const COLUMNS = [
    { key: 'name',      label: 'Control Name',      width: '18%', visible: true, sortable: true, align: 'left',
      filterType: 'text',
      cell: c => c.name },
    { key: 'type',      label: 'Control Type',      width: '10%', visible: true, sortable: true,
      filterType: 'select',
      options: [{ value: 'table', label: 'Table' }, { value: 'switch', label: 'Switch' },
                { value: 'schedule', label: 'Schedule' }, { value: 'text', label: 'Text' }],
      cell: c => '<span class="ctrl-type"><svg class="icon"><use href="#' + TYPE_ICON[c.type] + '"/></svg>' + c.type + '</span>' },
    { key: 'value',     label: 'Control Value',     width: '21%', visible: true, sortable: true,
      filterType: 'text',
      cell: c => c.type === 'Switch'
        ? '<button class="mini-switch ' + (c.value === 'On' ? 'on' : 'off') + '" title="Toggle"><span></span>' + c.value + '</button>'
        : '<span class="cell-value">' + c.value + '</span>' },
    { key: 'status',    label: 'Status',            width: '9%',  visible: true, sortable: true,
      filterType: 'select',
      options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }],
      cell: c => '<span class="status-tag ' + c.status.toLowerCase() + '">' + c.status + '</span>' },
    { key: 'updatedBy', label: 'Last Update By',    width: '12%', visible: true, sortable: true,
      filterType: 'text',
      cell: c => '<span class="im-muted">' + c.updatedBy + '</span>' },
    { key: 'updated',   label: 'Last Update Date',  width: '14%', visible: true, sortable: true,
      filterType: 'text',
      cell: c => '<span class="im-muted">' + c.updated + '</span>' }
  ];

  const body = document.getElementById('gridBody');
  const gridHead = document.getElementById('gridHead');
  const gridColgroup = document.getElementById('gridColgroup');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const filters = {};
  COLUMNS.forEach(c => { filters[c.key] = ''; });
  let sortKey = null;
  let sortDir = 1;

  let currentEditIndex = -1;
  let currentEditControl = null;
  let currentScheduleTab = 'normal';
  let currentDayIndex = 1;
  let tempControl = null;
  let tempScheduleTab = 'normal';
  let tempSchedule = null;

  function visibleColumns() {
    return COLUMNS.filter(c => c.visible);
  }

  function visibleRows() {
    return controls
      .map((c, i) => ({ c, i }))
      .filter(({ c }) =>
        COLUMNS.every(col => String(c[col.key] || '').toLowerCase().includes(filters[col.key]))
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        return String(a.c[sortKey]).localeCompare(String(b.c[sortKey])) * sortDir;
      });
  }

  function colspan() {
    return visibleColumns().length + 2;
  }

  /* ---------- Head / colgroup (rebuilt whenever columns change) ---------- */
  function renderHead() {
    const cols = visibleColumns();

    gridColgroup.innerHTML = '<col style="width:36px">' +
      cols.map(c => '<col style="width:' + c.width + '">').join('') +
      '<col style="width:104px">';

    gridHead.innerHTML =
      '<tr class="head-row">' +
        '<th class="col-expand"><span class="head-caret"><svg class="icon icon-caret"><use href="#icon-caret"/></svg></span></th>' +
        cols.map(c =>
          '<th data-key="' + c.key + '"' +
            (sortKey === c.key ? ' class="sorted-' + (sortDir === 1 ? 'asc' : 'desc') + '"' : '') + '>' +
            c.label + '<span class="head-caret"><svg class="icon icon-caret"><use href="#icon-caret"/></svg></span>' +
          '</th>'
        ).join('') +
        '<th class="col-actions"></th>' +
      '</tr>' +
      '<tr class="filter-row">' +
        '<th></th>' +
        cols.map(c => {
          if (c.filterType === 'select') {
            return '<th><select class="filter-select" data-filter="' + c.key + '" aria-label="Filter ' + c.label + '">' +
              '<option value=""></option>' +
              c.options.map(o => '<option value="' + o.value + '"' + (filters[c.key] === o.value ? ' selected' : '') + '>' + o.label + '</option>').join('') +
            '</select></th>';
          }
          return '<th><input type="text" class="filter-input" data-filter="' + c.key + '" aria-label="Filter ' + c.label + '" value="' + (filters[c.key] || '') + '"></th>';
        }).join('') +
        '<th></th>' +
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

    gridHead.querySelectorAll('.filter-select').forEach(select => {
      select.addEventListener('change', () => {
        filters[select.dataset.filter] = select.value;
        renderBody();
      });
    });
  }

  function renderBody() {
    const rows = visibleRows();
    const cols = visibleColumns();
    body.innerHTML = '';

    rows.forEach(({ c, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        cols.map(col => '<td' + (col.align === 'left' ? ' class="cell-left"' : '') + '>' + col.cell(c) + '</td>').join('') +
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

  function render() {
    renderHead();
    renderBody();
  }

  /* ---------- Row interactions ---------- */
  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const idx = parseInt(tr.dataset.index, 10);
    const item = controls[idx];

    if (e.target.closest('.mini-switch')) {
      item.value = item.value === 'On' ? 'Off' : 'On';
      item.updated = 'Just now';
      renderBody();
      return;
    }

    if (e.target.closest('.edit-btn') || e.target.closest('.sched-btn')) {
      openEditControlModal(idx);
      return;
    }

    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete control "' + item.name + '"?')) {
        controls.splice(idx, 1);
        renderBody();
      }
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
        '<td colspan="' + colspan() + '"><div class="detail-grid">' +
          '<div><span>Control Name</span>' + item.name + '</div>' +
          '<div><span>Control Type</span>' + item.type + '</div>' +
          '<div><span>Status</span>' + item.status + '</div>' +
          '<div><span>Control Value</span>' + (item.value || '\u2014') + '</div>' +
          '<div><span>Last Update By</span>' + item.updatedBy + '</div>' +
          '<div><span>Last Update Date</span>' + item.updated + '</div>' +
          '<div class="wide"><span>Details</span>' + item.detail + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

  /* ============================================================
     ACTIONS MENU (Add New Control, Clear filters, CSV/PDF export,
     Columns checklist, drag-to-reorder, custom scrollbars)
     ============================================================ */
  const actionsMenu = document.getElementById('actionsMenu');
  const actColumnsList = document.getElementById('actColumnsList');

  document.getElementById('actionsBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    actionsMenu.hidden = !actionsMenu.hidden;
    if (!actionsMenu.hidden) {
      renderColumnsList();
      requestAnimationFrame(() => { updateHScrollbar(); updateVScrollbar(); });
    }
  });

  document.addEventListener('click', () => { actionsMenu.hidden = true; });
  actionsMenu.addEventListener('click', (e) => e.stopPropagation());

  /* ---------- Columns checklist ---------- */
  function renderColumnsList() {
    actColumnsList.innerHTML = COLUMNS.map(c =>
      '<div class="act-col-chip" draggable="true" data-col="' + c.key + '">' +
        '<span class="act-col-drag"><svg class="icon"><use href="#icon-menu"/></svg></span>' +
        '<label class="act-col-check">' +
          '<input type="checkbox" data-col="' + c.key + '"' + (c.visible ? ' checked' : '') + '>' +
          '<span>' + c.label + '</span>' +
        '</label>' +
      '</div>'
    ).join('');
    updateHScrollbar();
  }

  actColumnsList.addEventListener('change', (e) => {
    const cb = e.target.closest('input[type="checkbox"]');
    if (!cb) return;
    const col = COLUMNS.find(c => c.key === cb.dataset.col);
    if (col) col.visible = cb.checked;
    render();
  });

  /* ---------- Clear filters / export actions ---------- */
  function exportCsv(filename, rows) {
    const cols = visibleColumns();
    const header = cols.map(c => c.label).join(',');
    const csv = [header]
      .concat(rows.map(c => cols.map(col =>
        '"' + String(c[col.key] || '').replace(/"/g, '""') + '"'
      ).join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf(rows) {
    const cols = visibleColumns();
    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups to export as PDF.');
      return;
    }
    const rowsHtml = rows.map(c =>
      '<tr>' + cols.map(col => '<td>' + (c[col.key] || '') + '</td>').join('') + '</tr>'
    ).join('');
    win.document.write(
      '<html><head><title>Routing controls export</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#333}' +
      'h2{font-size:15px} table{width:100%;border-collapse:collapse;margin-top:10px}' +
      'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}' +
      'th{background:#f2f4f6}' +
      '</style></head><body>' +
      '<h2>Webex Contact Center Enterprise &mdash; Routing Controls</h2>' +
      '<table><thead><tr>' + cols.map(c => '<th>' + c.label + '</th>').join('') + '</tr></thead>' +
      '<tbody>' + rowsHtml + '</tbody></table>' +
      '</body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  }

  actionsMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    switch (btn.dataset.action) {
      case 'new': {
        const name = prompt('New control name:');
        if (name && name.trim()) {
          controls.unshift({
            name: name.trim(), type: 'Switch', value: 'Off', status: 'Active',
            updatedBy: 'Administrator', updated: 'Just now',
            detail: 'New routing control. Configure its value before use.'
          });
          render();
        }
        break;
      }
      case 'clearFilters':
        COLUMNS.forEach(c => { filters[c.key] = ''; });
        renderHead();
        renderBody();
        break;
      case 'exportAllCsv':
        exportCsv('routing-controls_all.csv', controls);
        break;
      case 'exportVisibleCsv':
        exportCsv('routing-controls_visible.csv', visibleRows().map(({ c }) => c));
        break;
      case 'exportAllPdf':
        exportPdf(controls);
        break;
      case 'exportVisiblePdf':
        exportPdf(visibleRows().map(({ c }) => c));
        break;
    }
  });

  /* ---------- Drag & drop reordering ----------
     Shared for the top action sections (Add New / Clear filters / Exports)
     and for the Columns checklist chips. Reordering the column chips also
     reorders the underlying COLUMNS array so the grid follows. */
  function enableDragReorder(container, itemSelector, axis, onReorder) {
    let dragEl = null;

    container.addEventListener('dragstart', (e) => {
      const item = e.target.closest(itemSelector);
      if (!item) return;
      dragEl = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    });

    container.addEventListener('dragover', (e) => {
      if (!dragEl) return;
      e.preventDefault();
      const target = e.target.closest(itemSelector);
      if (!target || target === dragEl || target.parentElement !== dragEl.parentElement) return;
      const rect = target.getBoundingClientRect();
      const before = axis === 'x'
        ? (e.clientX - rect.left) < rect.width / 2
        : (e.clientY - rect.top) < rect.height / 2;
      target.parentElement.insertBefore(dragEl, before ? target : target.nextSibling);
    });

    container.addEventListener('drop', (e) => { e.preventDefault(); });

    container.addEventListener('dragend', () => {
      if (dragEl) dragEl.classList.remove('dragging');
      dragEl = null;
      if (onReorder) onReorder();
    });
  }

  enableDragReorder(document.querySelector('.act-scroll'), '.act-section', 'y');
  enableDragReorder(actColumnsList, '.act-col-chip', 'x', () => {
    const order = Array.from(actColumnsList.querySelectorAll('.act-col-chip')).map(el => el.dataset.col);
    COLUMNS.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
    renderHead();
    renderBody();
  });

  /* ---------- Custom scrollbars ---------- */
  function wireScrollbar({ viewport, thumb, prevBtn, nextBtn, axis, step }) {
    function update() {
      const size = axis === 'x' ? viewport.clientWidth : viewport.clientHeight;
      const scrollSize = axis === 'x' ? viewport.scrollWidth : viewport.scrollHeight;
      const scrollPos = axis === 'x' ? viewport.scrollLeft : viewport.scrollTop;
      const trackSize = axis === 'x' ? thumb.parentElement.clientWidth : thumb.parentElement.clientHeight;

      if (scrollSize <= size + 1) {
        thumb.parentElement.parentElement.hidden = true;
        return;
      }
      thumb.parentElement.parentElement.hidden = false;

      const thumbSize = Math.max(24, (size / scrollSize) * trackSize);
      const thumbPos = (scrollPos / (scrollSize - size)) * (trackSize - thumbSize);
      if (axis === 'x') {
        thumb.style.width = thumbSize + 'px';
        thumb.style.left = thumbPos + 'px';
      } else {
        thumb.style.height = thumbSize + 'px';
        thumb.style.top = thumbPos + 'px';
      }
    }

    viewport.addEventListener('scroll', update);
    prevBtn.addEventListener('click', () => {
      viewport.scrollBy(axis === 'x' ? { left: -step, behavior: 'smooth' } : { top: -step, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      viewport.scrollBy(axis === 'x' ? { left: step, behavior: 'smooth' } : { top: step, behavior: 'smooth' });
    });

    return update;
  }

  const updateHScrollbar = wireScrollbar({
    viewport: actColumnsList,
    thumb: document.getElementById('actHScrollThumb'),
    prevBtn: document.getElementById('actHScrollLeft'),
    nextBtn: document.getElementById('actHScrollRight'),
    axis: 'x', step: 120
  });

  const updateVScrollbar = wireScrollbar({
    viewport: document.querySelector('.act-scroll'),
    thumb: document.getElementById('actVScrollThumb'),
    prevBtn: document.getElementById('actVScrollTop'),
    nextBtn: document.getElementById('actVScrollBottom'),
    axis: 'y', step: 100
  });

  /* ============================================================
     EDIT CONTROL MODAL (Image 1)
     ============================================================ */
  const editControlModal = document.getElementById('editControlModal');
  const ecTitle = document.getElementById('ecTitle');
  const ecControlName = document.getElementById('ecControlName');
  const ecControlCode = document.getElementById('ecControlCode');
  const ecControlDesc = document.getElementById('ecControlDesc');
  const ecTimeZone = document.getElementById('ecTimeZone');
  const ecSchedBody = document.getElementById('ecSchedBody');

  function deepCopySchedule(sched) {
    const out = {};
    DAYS.forEach(d => {
      out[d] = sched[d].map(s => ({
        open: s.open, close: s.close, range: s.range,
        rangeMin: s.rangeMin, rangeMax: s.rangeMax, disabled: !!s.disabled
      }));
    });
    return out;
  }

  function ensureScheduleFields(ctrl) {
    if (!ctrl.normalSchedule) ctrl.normalSchedule = createDefaultSchedule();
    if (!ctrl.specialSchedule) ctrl.specialSchedule = createDefaultSchedule();
    if (!ctrl.code) ctrl.code = ctrl.name;
    if (!ctrl.description) ctrl.description = '';
    if (!ctrl.timeZone) ctrl.timeZone = 'US/Eastern';
  }

  function openEditControlModal(idx) {
    currentEditIndex = idx;
    const ctrl = controls[idx];
    ensureScheduleFields(ctrl);

    currentScheduleTab = 'normal';
    tempControl = {
      name: ctrl.name,
      code: ctrl.code,
      description: ctrl.description,
      timeZone: ctrl.timeZone,
      normalSchedule: deepCopySchedule(ctrl.normalSchedule),
      specialSchedule: deepCopySchedule(ctrl.specialSchedule)
    };

    ecTitle.textContent = 'Edit Control: ' + ctrl.name;
    ecControlName.value = tempControl.name;
    ecControlCode.value = tempControl.code;
    ecControlDesc.value = tempControl.description;
    ecTimeZone.value = tempControl.timeZone;

    document.querySelectorAll('#ecTabs .ec-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.etab === 'normal');
    });

    renderEcDaysGrid();
    editControlModal.hidden = false;
  }

  function closeEditControlModal() {
    editControlModal.hidden = true;
    currentEditIndex = -1;
    tempControl = null;
  }

  function renderEcDaysGrid() {
    const sched = tempControl[currentScheduleTab + 'Schedule'];
    let html = '';

    for (let si = 0; si < 1; si++) {
      html += '<tr>';
      html += '<td class="ec-shift-label-td">Shift ' + (si + 1) + '</td>';
      DAYS.forEach((d, di) => {
        const shifts = sched[d];
        const shift = shifts[si];
        if (shift && !shift.disabled && shift.open && shift.close) {
          html += '<td class="ec-shift-cell" data-day="' + di + '" data-shift="' + si + '">' +
            shift.open + ' - ' + shift.close +
          '</td>';
        } else if (shift && shift.disabled && si === 0) {
          html += '<td class="ec-shift-cell closed" data-day="' + di + '" data-shift="' + si + '"></td>';
        } else {
          html += '<td class="ec-shift-cell empty" data-day="' + di + '" data-shift="' + si + '"></td>';
        }
      });
      html += '</tr>';
    }

    ecSchedBody.innerHTML = html;
  }

  /* Tab switching for Normal/Special schedule */
  document.querySelectorAll('#ecTabs .ec-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ecTabs .ec-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScheduleTab = btn.dataset.etab;
      renderEcDaysGrid();
    });
  });

  /* Click on day header button to open Day Schedule modal */
  document.querySelectorAll('.ec-day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const di = parseInt(btn.dataset.day, 10);
      tempScheduleTab = currentScheduleTab;
      tempSchedule = tempControl[currentScheduleTab + 'Schedule'];
      currentDayIndex = di;
      openDayScheduleModal();
    });
  });

  /* Click on a shift cell to open Day Schedule modal */
  document.getElementById('ecDaysGrid').addEventListener('click', (e) => {
    const cell = e.target.closest('.ec-shift-cell');
    if (cell) {
      const di = parseInt(cell.dataset.day, 10);
      if (di >= 0) {
        tempScheduleTab = currentScheduleTab;
        tempSchedule = tempControl[currentScheduleTab + 'Schedule'];
        currentDayIndex = di;
        openDayScheduleModal();
      }
    }
  });

  /* Add shift button */
  document.getElementById('ecAddShiftBtn').addEventListener('click', () => {
    const sched = tempControl[currentScheduleTab + 'Schedule'];
    DAYS.forEach(d => {
      if (sched[d].length < 6) {
        sched[d].push({ open: 'N/A', close: 'N/A', range: '0', rangeMin: '0', rangeMax: '0', disabled: true });
      }
    });
    renderEcDaysGrid();
  });

  /* Edit Control modal - Save */
  document.getElementById('ecSave').addEventListener('click', () => {
    const name = ecControlName.value.trim();
    if (!name) {
      alert('Control Name is required.');
      ecControlName.focus();
      return;
    }
    const ctrl = controls[currentEditIndex];
    ctrl.name = name;
    ctrl.code = ecControlCode.value.trim() || name;
    ctrl.description = ecControlDesc.value.trim();
    ctrl.timeZone = ecTimeZone.value;
    ctrl.normalSchedule = tempControl.normalSchedule;
    ctrl.specialSchedule = tempControl.specialSchedule;
    ctrl.updatedBy = 'Administrator';
    ctrl.updated = 'Just now';
    render();
    closeEditControlModal();
  });

  document.getElementById('ecCancel').addEventListener('click', closeEditControlModal);
  document.getElementById('ecClose').addEventListener('click', closeEditControlModal);

  /* ============================================================
     DAY SCHEDULE MODAL (Image 2)
     ============================================================ */
  const dayScheduleModal = document.getElementById('dayScheduleModal');
  const dsTitle = document.getElementById('dsTitle');
  const dsIntervals = document.getElementById('dsIntervals');
  const dsTraffic = document.getElementById('dsTraffic');
  const dsRoutes = document.getElementById('dsRoutes');
  const dsTableBody = document.getElementById('dsTableBody');

  function openDayScheduleModal() {
    const dayName = DAYS[currentDayIndex];
    dsTitle.textContent = 'Edit Control: ' + tempControl.name + ' - ' + dayName;
    renderDsTable();
    dayScheduleModal.hidden = false;
  }

  function closeDayScheduleModal() {
    dayScheduleModal.hidden = true;
  }

  function renderDsTable() {
    const dayName = DAYS[currentDayIndex];
    const shifts = tempSchedule[dayName];
    let html = '';

    shifts.forEach((sh, si) => {
      html += '<tr data-shift="' + si + '">' +
        '<td class="shift-label">Shift ' + (si + 1) + '</td>' +
        '<td>' +
          '<input type="text" class="ds-shift-input" data-field="open" ' +
          (sh.disabled ? 'readonly' : '') + ' value="' + (sh.open || '') + '" placeholder="' + (sh.disabled ? 'N/A' : 'e.g. 8:00 AM') + '">' +
        '</td>' +
        '<td>' +
          '<input type="text" class="ds-shift-input" data-field="close" ' +
          (sh.disabled ? 'readonly' : '') + ' value="' + (sh.close || '') + '" placeholder="' + (sh.disabled ? 'N/A' : 'e.g. 10:00 PM') + '">' +
        '</td>' +
        '<td>' +
          '<input type="text" class="ds-shift-input" data-field="range" ' +
          (sh.disabled ? 'readonly' : '') + ' value="' + (sh.range || '') + '" style="display:inline-block; width:calc(100% - 90px); vertical-align:middle;">' +
          '<span class="ds-range-label">' + (sh.rangeMin || '0') + ' to ' + (sh.rangeMax || '1000000') + '</span>' +
        '</td>' +
        '<td class="ds-disabled-cell">' +
          '<input type="checkbox" data-field="disabled" ' + (sh.disabled ? 'checked' : '') + '>' +
        '</td>' +
      '</tr>';
    });

    dsTableBody.innerHTML = html;
  }

  /* Day Schedule table - input changes */
  dsTableBody.addEventListener('input', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const si = parseInt(tr.dataset.shift, 10);
    const field = e.target.dataset.field;
    const dayName = DAYS[currentDayIndex];
    const shift = tempSchedule[dayName][si];

    if (field === 'disabled') {
      shift.disabled = e.target.checked;
      if (shift.disabled) {
        shift.open = 'N/A';
        shift.close = 'N/A';
        shift.range = '0';
      } else if (shift.open === 'N/A') {
        shift.open = '';
        shift.close = '';
      }
      renderDsTable();
    } else {
      shift[field] = e.target.value;
    }
  });

  dsTableBody.addEventListener('change', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const si = parseInt(tr.dataset.shift, 10);
    const field = e.target.dataset.field;
    const dayName = DAYS[currentDayIndex];
    const shift = tempSchedule[dayName][si];

    if (field === 'disabled') {
      shift.disabled = e.target.checked;
      if (shift.disabled) {
        shift.open = 'N/A';
        shift.close = 'N/A';
        shift.range = '0';
      } else if (shift.open === 'N/A') {
        shift.open = '';
        shift.close = '';
      }
      renderDsTable();
    }
  });

  /* Prev / Next day navigation */
  document.getElementById('dsPrevBtn').addEventListener('click', () => {
    saveCurrentDayShiftsFromDom();
    currentDayIndex = (currentDayIndex - 1 + DAYS.length) % DAYS.length;
    const dayName = DAYS[currentDayIndex];
    dsTitle.textContent = 'Edit Control: ' + tempControl.name + ' - ' + dayName;
    renderDsTable();
  });

  document.getElementById('dsNextBtn').addEventListener('click', () => {
    saveCurrentDayShiftsFromDom();
    currentDayIndex = (currentDayIndex + 1) % DAYS.length;
    const dayName = DAYS[currentDayIndex];
    dsTitle.textContent = 'Edit Control: ' + tempControl.name + ' - ' + dayName;
    renderDsTable();
  });

  function saveCurrentDayShiftsFromDom() {
    const dayName = DAYS[currentDayIndex];
    const rows = dsTableBody.querySelectorAll('tr');
    rows.forEach((tr, si) => {
      const openInput = tr.querySelector('input[data-field="open"]');
      const closeInput = tr.querySelector('input[data-field="close"]');
      const rangeInput = tr.querySelector('input[data-field="range"]');
      const disabledInput = tr.querySelector('input[data-field="disabled"]');
      const shift = tempSchedule[dayName][si];
      if (openInput) shift.open = openInput.value;
      if (closeInput) shift.close = closeInput.value;
      if (rangeInput) shift.range = rangeInput.value;
      if (disabledInput) shift.disabled = disabledInput.checked;
    });
  }

  /* Day Schedule modal - Save */
  document.getElementById('dsSave').addEventListener('click', () => {
    saveCurrentDayShiftsFromDom();
    closeDayScheduleModal();
    renderEcDaysGrid();
  });

  document.getElementById('dsCancel').addEventListener('click', closeDayScheduleModal);
  document.getElementById('dsClose').addEventListener('click', closeDayScheduleModal);

  /* Close modals on overlay click */
  editControlModal.addEventListener('click', (e) => {
    if (e.target === editControlModal) closeEditControlModal();
  });

  dayScheduleModal.addEventListener('click', (e) => {
    if (e.target === dayScheduleModal) {
      saveCurrentDayShiftsFromDom();
      closeDayScheduleModal();
      renderEcDaysGrid();
    }
  });

  /* Escape key to close top modal */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!dayScheduleModal.hidden) {
        saveCurrentDayShiftsFromDom();
        closeDayScheduleModal();
        renderEcDaysGrid();
      } else if (!editControlModal.hidden) {
        closeEditControlModal();
      }
    }
  });

  render();
});
