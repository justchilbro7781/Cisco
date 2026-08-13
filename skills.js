document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (48 records) ---------- */
  const skills = [
    { name: 'A_Sales',                          description: '',                                     agents: 2, type: 'business' },
    { name: 'AcqueonOutboundAgent',              description: 'Acqueon Outbound Agent',               agents: 1, type: 'business' },
    { name: 'AcqueonOutboundIVR',                description: 'Acqueon Outbound IVR',                 agents: 2, type: 'business' },
    { name: 'AcqueonOutboundPreview',            description: 'Acqueon Outbound Preview',             agents: 2, type: 'business' },
    { name: 'AcqueonOutboundSimulator',          description: 'Acqueon Outbound Simulator',           agents: 1, type: 'business' },
    { name: 'CIM_CALLBACK',                      description: 'CIM Callback',                         agents: 1, type: 'cim' },
    { name: 'CIM_DELAYED',                       description: 'CIM Delayed Callback',                 agents: 1, type: 'cim' },
    { name: 'CIM_EIM',                           description: 'CIM Email',                            agents: 0, type: 'cim', uwf: 'email' },
    { name: 'CIM_WIM',                           description: 'CIM Chat',                             agents: 0, type: 'cim', uwf: 'chat' },
    { name: 'Claims',                            description: 'eGain Analytics',                      agents: 0, type: 'business' },
    { name: 'ConsiliumOutboundAgent',            description: 'Consilium Outbound Agent',             agents: 1, type: 'business' },
    { name: 'ConsiliumOutboundIVR',              description: 'Consilium Outbound IVR',               agents: 1, type: 'business' },
    { name: 'ConsiliumOutboundPreview',          description: 'Consilium Outbound Preview',           agents: 1, type: 'business' },
    { name: 'ConsiliumOutboundSimulator',        description: 'Consilium Outbound Simulator',         agents: 0, type: 'business' },
    { name: 'CUCM_PG_1.CIM_BC.default.13802',        description: '', agents: 0, type: 'system' },
    { name: 'CUCM_PG_1.CIM_EIM.default.43958',       description: '', agents: 0, type: 'system', uwf: 'email' },
    { name: 'CUCM_PG_1.CIM_OUTBOUND.def.74114',      description: '', agents: 0, type: 'system' },
    { name: 'CUCM_PG_1.CIM_WIM.default.04270',       description: '', agents: 0, type: 'system', uwf: 'chat' },
    { name: 'CUCM_PG_1.Cisco_Voice.defa.01370',      description: '', agents: 0, type: 'system' },
    { name: 'CUCM_PG_1.CCE_Chat.default.97456',      description: '', agents: 0, type: 'system', uwf: 'chat' },
    { name: 'CUCM_PG_1.ECE_Email.defaul.11266',      description: '', agents: 0, type: 'system', uwf: 'email' },
    { name: 'CUCM_PG_1.ECE_Outbound.def.25076',      description: '', agents: 0, type: 'system' },
    { name: 'CUCM_PG_1.EGAIN_CHAT.defau.03187',      description: '', agents: 0, type: 'system', uwf: 'chat' },
    { name: 'CUCM_PG_1.EGAIN_EMAIL.defa.05821',      description: '', agents: 0, type: 'system', uwf: 'email' },
    { name: 'CUCM_PG_1.RONA.default.09214',          description: '', agents: 0, type: 'system' },
    { name: 'CUCM_PG_1.Generic.default.00112',       description: '', agents: 0, type: 'system' },
    { name: 'CUCM_PG_1.Facebook.default.08820',      description: '', agents: 0, type: 'system', uwf: 'facebook' },
    { name: 'CUCM_PG_1.SMS.default.06541',           description: '', agents: 0, type: 'system', uwf: 'sms' },
    { name: 'CumulusCB',            description: 'Cumulus Call Back',                agents: 0, type: 'business' },
    { name: 'CumulusCertification', description: 'Cumulus Certification',            agents: 0, type: 'business' },
    { name: 'CumulusChat',          description: 'Cumulus Chat',                     agents: 1, type: 'business', uwf: 'chat' },
    { name: 'CumulusChatEnglish',   description: 'Cumulus Chat English',             agents: 0, type: 'business', uwf: 'chat' },
    { name: 'CumulusChatItalian',   description: 'Cumulus Chat Italian',             agents: 0, type: 'business', uwf: 'chat' },
    { name: 'CumulusChatSpanish',   description: 'Cumulus Chat Spanish',             agents: 0, type: 'business', uwf: 'chat' },
    { name: 'CumulusCity',          description: 'Cumulus City Call Generator',      agents: 0, type: 'business' },
    { name: 'CumulusEmail',         description: 'Cumulus Email',                    agents: 0, type: 'business', uwf: 'email' },
    { name: 'CumulusFacebook',      description: 'Cumulus Facebook',                 agents: 0, type: 'business', uwf: 'facebook' },
    { name: 'CumulusFinance',       description: 'Cumulus Finance',                  agents: 0, type: 'business' },
    { name: 'CumulusHealthCare',    description: 'Cumulus Health Care',              agents: 0, type: 'business' },
    { name: 'CumulusInbound',       description: 'Cumulus Inbound',                  agents: 2, type: 'business' },
    { name: 'CumulusOutbound',      description: 'Cumulus Outbound',                 agents: 1, type: 'business' },
    { name: 'CumulusRLM',           description: 'Cumulus Resource Load Management', agents: 0, type: 'business' },
    { name: 'CumulusSMS',           description: 'Cumulus SMS',                      agents: 0, type: 'business', uwf: 'sms' },
    { name: 'CumulusTask',          description: 'Cumulus Task',                     agents: 0, type: 'business' },
    { name: 'CumulusTravel',        description: 'Cumulus Travel',                   agents: 0, type: 'business' },
    { name: 'CumulusUtility',       description: 'Cumulus Utility',                  agents: 0, type: 'business' },
    { name: 'CumulusUWF',           description: 'Cumulus Universal Work Flow',      agents: 2, type: 'business' },
    { name: 'CumulusVIVR',          description: 'Cumulus Visual IVR',               agents: 0, type: 'business' }
  ];

  function skillTypeLabel(skill) {
    if (skill.skillType) return skill.skillType;
    if (skill.uwf) return skill.uwf.charAt(0).toUpperCase() + skill.uwf.slice(1);
    if (skill.type === 'cim') return 'CIM';
    if (skill.type === 'system') return 'System';
    return 'Cisco_Voice';
  }

  /* Maps the "Skill type" dropdown value to our internal classification,
     used for the dot color and the UWF Skill Type filter. */
  const SKILL_TYPE_META = {
    Cisco_Voice:   { type: 'business' },
    CIM_BC:        { type: 'cim' },
    CIM_EIM:       { type: 'cim', uwf: 'email' },
    CIM_OUTBOUND:  { type: 'cim' },
    CIM_WIM:       { type: 'cim', uwf: 'chat' },
    ECE_Chat:      { type: 'system', uwf: 'chat' },
    ECE_Email:     { type: 'system', uwf: 'email' },
    ECE_Outbound:  { type: 'system' },
    EGAIN_CHAT:    { type: 'system', uwf: 'chat' },
    EGAIN_EMAIL:   { type: 'system', uwf: 'email' },
    EGAIN_OUTBOUND: { type: 'system' },
    EGAIN_SOCIAL:  { type: 'system', uwf: 'facebook' },
    Tasks:         { type: 'business' },
    MCAL_Chat:     { type: 'system', uwf: 'chat' },
    MCAL_Email:    { type: 'system', uwf: 'email' },
    MCAL_Outbound: { type: 'system' },
    MCAL_SMS:      { type: 'system', uwf: 'sms' },
    MCAL_Facebook: { type: 'system', uwf: 'facebook' }
  };

  /* ---------- Column configuration ---------- */
  const COLUMNS = [
    { key: 'name', label: 'Name', width: '24%', visible: true, sortable: true,
      cell: s => '<span class="skill-name-cell">' +
        '<span class="skill-type-dot ' + s.type + '" title="' + s.type + '"></span>' +
        '<span class="skill-name">' + s.name + '</span></span>' },
    { key: 'description', label: 'Description', width: '30%', visible: true, sortable: true,
      cell: s => s.description || '<span class="skill-desc-empty">&mdash;</span>' },
    { key: 'agents', label: '# of Agents', width: '12%', visible: true, sortable: true,
      cell: s => '<span class="count-pill' + (s.agents === 0 ? ' zero' : '') + '">' + s.agents + '</span>' },
    { key: 'skillType', label: 'Skill Type', width: '13%', visible: true, sortable: true,
      cell: s => skillTypeLabel(s) },
    { key: 'actions', label: 'Buttons', width: '112px', visible: true, sortable: false, isActions: true }
  ];

  const body = document.getElementById('gridBody');
  const gridHead = document.getElementById('gridHead');
  const gridColgroup = document.getElementById('gridColgroup');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const colToggleList = document.getElementById('colToggleList');

  const filters = { name: '', description: '', agents: '' };
  let typeFilter = '';
  let sortKey = 'name';
  let sortDir = 1;

  function visibleColumns() {
    return COLUMNS.filter(c => c.visible);
  }

  function visibleRows() {
    return skills
      .map((s, i) => ({ s, i }))
      .filter(({ s }) =>
        s.name.toLowerCase().includes(filters.name) &&
        s.description.toLowerCase().includes(filters.description) &&
        String(s.agents).includes(filters.agents) &&
        (typeFilter === '' ||
          (typeFilter === 'uwf' ? !!s.uwf : s.uwf === typeFilter))
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        if (sortKey === 'skillType') return skillTypeLabel(a.s).localeCompare(skillTypeLabel(b.s)) * sortDir;
        const va = a.s[sortKey], vb = b.s[sortKey];
        if (typeof va === 'number') return (va - vb) * sortDir;
        return String(va).localeCompare(String(vb), undefined, { numeric: true }) * sortDir;
      });
  }

  /* ---------- Header / colgroup ---------- */
  function renderHead() {
    const cols = visibleColumns();

    gridColgroup.innerHTML = '<col style="width:36px">' +
      cols.map(c => '<col style="width:' + c.width + '">').join('');

    gridHead.innerHTML =
      '<tr class="head-row">' +
        '<th class="col-expand"><span class="head-caret"><svg class="icon icon-caret"><use href="#icon-caret"/></svg></span></th>' +
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
          c.key === 'skillType' ? '<th></th>' :
          '<th><input type="text" class="filter-input" data-filter="' + c.key + '" aria-label="Filter ' + c.label + '" value="' +
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

  /* ---------- Body ---------- */
  function renderBody() {
    const rows = visibleRows();
    const cols = visibleColumns();
    body.innerHTML = '';

    rows.forEach(({ s, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        cols.map(c => {
          if (c.isActions) {
            return '<td class="col-actions">' +
              '<button class="row-btn edit-btn" title="Edit skill"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
              '<button class="row-btn agents-btn" title="Assigned agents"><svg class="icon"><use href="#icon-user"/></svg></button>' +
              '<button class="row-btn audit-btn" title="Skill Audit"><svg class="icon"><use href="#icon-table"/></svg></button>' +
            '</td>';
          }
          return '<td>' + c.cell(s) + '</td>';
        }).join('');
      body.appendChild(tr);
    });

    recordCount.textContent = rows.length;
    noRecords.hidden = rows.length > 0;
  }

  function colspan() {
    return visibleColumns().length + 1;
  }

  /* ---------- Row interactions ---------- */
  body.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const skill = skills[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      openEditSkillModal(skill);
      return;
    }
    if (e.target.closest('.agents-btn')) {
      window.location.href = 'agent-to-skill.html?skill=' + encodeURIComponent(skill.name);
      return;
    }
    if (e.target.closest('.audit-btn')) {
      openSkillAuditModal(skill);
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
          '<div><span>Name</span>' + skill.name + '</div>' +
          '<div><span>Skill Type</span>' + skillTypeLabel(skill) + '</div>' +
          '<div><span># of Agents</span>' + skill.agents + '</div>' +
          '<div class="wide"><span>Description</span>' + (skill.description || 'No description') + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

  /* ---------- Edit skill dialog ---------- */
  const editSkillModal = document.getElementById('editSkillModal');
  const skillNameInput = document.getElementById('skillNameInput');
  const skillDescInput = document.getElementById('skillDescInput');
  const skillAgentsInput = document.getElementById('skillAgentsInput');
  const skillTypeInput = document.getElementById('skillTypeInput');
  let editingSkill = null;

  function openEditSkillModal(skill) {
    editingSkill = skill;
    document.getElementById('editSkillTitle').textContent = 'Edit Skill:' + skill.name;
    skillNameInput.value = skill.name;
    skillNameInput.classList.remove('invalid');
    skillDescInput.value = skill.description;
    skillAgentsInput.value = skill.agents;
    skillTypeInput.value = skillTypeLabel(skill);
    editSkillModal.hidden = false;
    skillNameInput.focus();
    skillNameInput.select();
  }

  function closeEditSkillModal() {
    editSkillModal.hidden = true;
    editingSkill = null;
  }

  function saveEditSkillModal() {
    const name = skillNameInput.value.trim();
    if (name === '') {
      skillNameInput.classList.add('invalid');
      skillNameInput.focus();
      return;
    }
    editingSkill.name = name;
    editingSkill.description = skillDescInput.value.trim();
    closeEditSkillModal();
    renderBody();
  }

  document.getElementById('editSkillSave').addEventListener('click', saveEditSkillModal);
  document.getElementById('editSkillCancel').addEventListener('click', closeEditSkillModal);
  document.getElementById('editSkillClose').addEventListener('click', closeEditSkillModal);

  editSkillModal.addEventListener('click', (e) => {
    if (e.target === editSkillModal) closeEditSkillModal();
  });

  skillNameInput.addEventListener('input', () => skillNameInput.classList.remove('invalid'));

  document.addEventListener('keydown', (e) => {
    if (editSkillModal.hidden) return;
    if (e.key === 'Escape') closeEditSkillModal();
    if (e.key === 'Enter' && e.target === skillNameInput) saveEditSkillModal();
  });

  /* ---------- Create skill dialog ---------- */
  const createSkillModal = document.getElementById('createSkillModal');
  const newSkillNameInput = document.getElementById('newSkillNameInput');
  const newSkillDescInput = document.getElementById('newSkillDescInput');
  const newSkillTypeInput = document.getElementById('newSkillTypeInput');
  const createSkillTitle = document.getElementById('createSkillTitle');

  function updateCreateSkillTitle() {
    const name = newSkillNameInput.value.trim();
    createSkillTitle.textContent = 'Create Skill:' + name;
  }

  function openCreateSkillModal() {
    newSkillNameInput.value = '';
    newSkillNameInput.classList.remove('invalid');
    newSkillDescInput.value = '';
    newSkillTypeInput.value = 'Cisco_Voice';
    updateCreateSkillTitle();
    createSkillModal.hidden = false;
    newSkillNameInput.focus();
  }

  function closeCreateSkillModal() {
    createSkillModal.hidden = true;
  }

  function saveCreateSkillModal() {
    const name = newSkillNameInput.value.trim();
    if (name === '') {
      newSkillNameInput.classList.add('invalid');
      newSkillNameInput.focus();
      return;
    }
    const meta = SKILL_TYPE_META[newSkillTypeInput.value] || { type: 'business' };
    skills.push({
      name: name,
      description: newSkillDescInput.value.trim(),
      agents: 0,
      type: meta.type,
      uwf: meta.uwf,
      skillType: newSkillTypeInput.value
    });
    closeCreateSkillModal();
    renderBody();
  }

  newSkillNameInput.addEventListener('input', () => {
    newSkillNameInput.classList.remove('invalid');
    updateCreateSkillTitle();
  });

  document.getElementById('createSkillSave').addEventListener('click', saveCreateSkillModal);
  document.getElementById('createSkillCancel').addEventListener('click', closeCreateSkillModal);
  document.getElementById('createSkillClose').addEventListener('click', closeCreateSkillModal);

  createSkillModal.addEventListener('click', (e) => {
    if (e.target === createSkillModal) closeCreateSkillModal();
  });

  document.addEventListener('keydown', (e) => {
    if (createSkillModal.hidden) return;
    if (e.key === 'Escape') closeCreateSkillModal();
    if (e.key === 'Enter' && e.target === newSkillNameInput) saveCreateSkillModal();
  });

  /* ---------- Skill audit dialog ---------- */
  const AUDIT_AGENTS = [
    'James Bracksted', 'Andy MacDowell', 'Annika Hamilton',
    'Beacham Brown', 'Cathy Supervisor', 'Helen Liang'
  ];

  function last6Months() {
    const out = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    }
    return out;
  }

  function auditLogFor(skill) {
    const n = Math.min(AUDIT_AGENTS.length, Math.max(2, skill.agents + 3));
    const times = ['04:34 PM', '04:31 PM', '04:31 PM', '04:31 PM', '04:31 PM', '04:28 PM'];
    return AUDIT_AGENTS.slice(0, n).map((name, i) => ({
      text: 'Admin Dcloud added agent ' + name,
      time: times[i] || '04:0' + i + ' PM'
    }));
  }

  const skillAuditModal = document.getElementById('skillAuditModal');
  const skillAuditChips = document.getElementById('skillAuditChips');
  const skillAuditResults = document.getElementById('skillAuditResults');
  const skillAuditDateBadge = document.getElementById('skillAuditDateBadge');
  let auditSkill = null;
  let auditActiveMonth = null;

  function openSkillAuditModal(skill) {
    auditSkill = skill;
    auditActiveMonth = null;
    document.getElementById('skillAuditTitle').textContent = 'Skill audit: ' + skill.name;
    document.getElementById('skillAuditType').value = 'All';
    document.getElementById('skillAuditSearch').value = '';
    document.getElementById('skillAuditUpdated').textContent = 'Last Updated: 04/13/2022';

    const months = last6Months();
    skillAuditChips.innerHTML = months.map((m, i) =>
      '<button class="audit-chip' + (i === months.length - 1 ? ' active' : '') + '" data-month="' + m + '">' + m + '</button>'
    ).join('');
    auditActiveMonth = months[months.length - 1];

    renderSkillAuditResults();
    skillAuditModal.hidden = false;
  }

  function closeSkillAuditModal() {
    skillAuditModal.hidden = true;
    auditSkill = null;
  }

  function renderSkillAuditResults() {
    const months = last6Months();
    const isLatest = auditActiveMonth === months[months.length - 1];

    if (!isLatest || !auditSkill) {
      skillAuditDateBadge.hidden = true;
      skillAuditResults.innerHTML = '<div class="audit-empty">No records found for the given query</div>';
      return;
    }

    skillAuditDateBadge.hidden = false;
    document.getElementById('skillAuditDateText').textContent = '04/13/2022';

    const log = auditLogFor(auditSkill);
    skillAuditResults.innerHTML =
      '<div class="audit-log-list">' +
        log.map(entry =>
          '<div class="audit-log-item">' +
            '<span class="audit-log-icon"><svg class="icon"><use href="#icon-check-circle"/></svg></span>' +
            '<span class="audit-log-text">' + entry.text + '</span>' +
            '<span class="audit-log-time"><svg class="icon"><use href="#icon-clock"/></svg>' + entry.time + '</span>' +
          '</div>'
        ).join('') +
      '</div>';
  }

  skillAuditChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.audit-chip');
    if (!chip) return;
    auditActiveMonth = chip.dataset.month;
    skillAuditChips.querySelectorAll('.audit-chip').forEach(c =>
      c.classList.toggle('active', c === chip));
    renderSkillAuditResults();
  });

  document.getElementById('skillAuditSearchBtn').addEventListener('click', renderSkillAuditResults);
  document.getElementById('skillAuditSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') renderSkillAuditResults();
  });
  document.getElementById('skillAuditType').addEventListener('change', renderSkillAuditResults);

  document.getElementById('skillAuditClose').addEventListener('click', closeSkillAuditModal);
  document.getElementById('skillAuditCloseBtn').addEventListener('click', closeSkillAuditModal);

  skillAuditModal.addEventListener('click', (e) => {
    if (e.target === skillAuditModal) closeSkillAuditModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!skillAuditModal.hidden && e.key === 'Escape') closeSkillAuditModal();
  });

  /* ---------- Column visibility checklist ---------- */
  function renderColToggleList() {
    colToggleList.innerHTML = COLUMNS.map(c =>
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
    const col = COLUMNS.find(c => c.key === btn.dataset.col);
    col.visible = !col.visible;
    renderColToggleList();
    renderHead();
    renderBody();
  });

  /* ---------- Toolbar dropdown filter ---------- */
  document.getElementById('skillTypeFilter').addEventListener('change', (e) => {
    typeFilter = e.target.value;
    renderBody();
  });

  /* ---------- Export helpers ---------- */
  function exportCsv(filename, rows) {
    const csv = ['Name,Description,# of Agents,Skill Type']
      .concat(rows.map(s =>
        ['"' + s.name + '"', '"' + s.description + '"', s.agents, skillTypeLabel(s)].join(',')))
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
    if (!win) {
      alert('Please allow pop-ups to export as PDF.');
      return;
    }
    const rowsHtml = rows.map(s =>
      '<tr><td>' + s.name + '</td><td>' + (s.description || '') + '</td><td>' + s.agents +
      '</td><td>' + skillTypeLabel(s) + '</td></tr>'
    ).join('');
    win.document.write(
      '<html><head><title>Skills export</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#333}' +
      'h2{font-size:15px} table{width:100%;border-collapse:collapse;margin-top:10px}' +
      'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}' +
      'th{background:#f2f4f6}' +
      '</style></head><body>' +
      '<h2>Webex Contact Center Enterprise &mdash; Skills</h2>' +
      '<table><thead><tr><th>Name</th><th>Description</th><th># of Agents</th><th>Skill Type</th></tr></thead>' +
      '<tbody>' + rowsHtml + '</tbody></table>' +
      '</body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  }

  function exportMembershipByAgent() {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups to export.');
      return;
    }
    const rowsHtml = skills.filter(s => s.agents > 0).map(s =>
      '<tr><td>' + s.name + '</td><td>' + skillTypeLabel(s) + '</td><td>' + s.agents + '</td></tr>'
    ).join('');
    win.document.write(
      '<html><head><title>Skill membership by agent</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#333}' +
      'h2{font-size:15px} table{width:100%;border-collapse:collapse;margin-top:10px}' +
      'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}' +
      'th{background:#f2f4f6}' +
      '</style></head><body>' +
      '<h2>Webex Contact Center Enterprise &mdash; Skill Membership By Agent</h2>' +
      '<table><thead><tr><th>Skill</th><th>Type</th><th>Assigned Agent Count</th></tr></thead>' +
      '<tbody>' + rowsHtml + '</tbody></table>' +
      '</body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  }

  /* ---------- Actions menu ---------- */
  const actionsMenu = document.getElementById('actionsMenu');

  document.getElementById('actionsBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    actionsMenu.hidden = !actionsMenu.hidden;
  });

  document.addEventListener('click', () => { actionsMenu.hidden = true; });

  actionsMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    switch (btn.dataset.action) {
      case 'new':
        openCreateSkillModal();
        break;
      case 'export-membership':
        exportMembershipByAgent();
        break;
      case 'clear-filters':
        Object.keys(filters).forEach(k => { filters[k] = ''; });
        typeFilter = '';
        document.getElementById('skillTypeFilter').value = '';
        renderHead();
        renderBody();
        break;
      case 'export-all-csv':
        exportCsv('skills_all.csv', skills);
        break;
      case 'export-visible-csv':
        exportCsv('skills_visible.csv', visibleRows().map(({ s }) => s));
        break;
      case 'export-all-pdf':
        exportPdf(skills);
        break;
      case 'export-visible-pdf':
        exportPdf(visibleRows().map(({ s }) => s));
        break;
    }
  });

  /* ---------- Init ---------- */
  renderColToggleList();
  renderHead();
  renderBody();
});
