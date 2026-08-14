document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data (16 records) ---------- */
  const users = [
    { first: 'Admin',   last: 'Dcloud',      agentId: '',      username: 'Administrator',    team: '',                type: 'admin',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-10000' },
    { first: 'Andy',    last: 'MacDowell',   agentId: '1033',  username: 'amacdowell',        team: 'A_Sales',         type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11033' },
    { first: 'Annika',  last: 'Hamilton',    agentId: '1086',  username: 'annika',             team: 'CumulusOutbound', type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11086' },
    { first: 'Beacham', last: 'Brown',       agentId: '1032',  username: 'bbrown',             team: 'A_Sales',         type: 'supervisor', status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11032' },
    { first: 'Brady',   last: 'Maxwell',     agentId: '',      username: 'bmaxwell',           team: '',                type: 'agent',      status: 'inactive', ccStatus: 'Disabled', platformId: 'PF-10001' },
    { first: 'Cathy',   last: 'Supervisor',  agentId: '1331',  username: 'csupervisor',        team: 'CumulusCallGen',  type: 'supervisor', status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11331' },
    { first: 'Faisal',  last: 'Khan',        agentId: '',      username: 'fkhan',              team: '',                type: 'agent',      status: 'inactive', ccStatus: 'Disabled', platformId: 'PF-10002' },
    { first: 'Helen',   last: 'Liang',       agentId: '1083',  username: 'hliang',             team: 'CumulusUWF',      type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11083' },
    { first: 'IcApps',  last: 'SystemUser',  agentId: '',      username: 'icAppsSystemUser',   team: '',                type: 'system',     status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-10003' },
    { first: 'James',   last: 'Brackated',   agentId: '1084',  username: 'jabracks',           team: 'CumulusUWF',      type: 'supervisor', status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11084' },
    { first: 'Jane',    last: 'Doe',         agentId: '1040',  username: 'Jdoe',               team: 'A_Sales',         type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11040' },
    { first: 'Josh',    last: 'Peterson',    agentId: '1081',  username: 'jopeters',           team: 'CumulusCRM',      type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11081' },
    { first: 'portal',  last: 'owner',       agentId: '',      username: 'portalowner',        team: '',                type: 'admin',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-10004' },
    { first: 'Rick',    last: 'Barrows',     agentId: '1082',  username: 'rbarrows',           team: 'CumulusMain',     type: 'supervisor', status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11082' },
    { first: 'Sandra',  last: 'Jefferson',   agentId: '1080',  username: 'sjeffers',           team: 'CumulusMain',     type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-11080' },
    { first: 'VBC',     last: 'POD1',        agentId: '10980', username: 'vbcpod1',            team: 'VBCTeam',         type: 'agent',      status: 'active',   ccStatus: 'Enabled',  platformId: 'PF-20980' }
  ];

  const AVATAR_COLOR = { admin: '#c9484f', supervisor: '#f0ad4e', agent: '#049fd9', system: '#8a8a8a' };

  function initials(u) {
    const a = (u.first || '?').charAt(0);
    const b = (u.last || '').charAt(0);
    return (a + b).toUpperCase();
  }

  /* ---------- Column configuration ---------- */
  const COLUMNS = [
    { key: 'first',    label: 'First Name',                     width: '16%', visible: true,  sortable: true,
      cell: u => '<span class="user-cell">' +
        '<span class="user-avatar" style="background:' + AVATAR_COLOR[u.type] + '">' + initials(u) + '</span>' +
        '<span class="user-name">' + u.first + '</span></span>' },
    { key: 'last',      label: 'Last Name',                      width: '14%', visible: true,  sortable: true,
      cell: u => u.last, align: 'left' },
    { key: 'agentId',   label: 'Agent ID',                       width: '10%', visible: true,  sortable: true,
      cell: u => u.agentId || '<span class="im-muted">&mdash;</span>' },
    { key: 'username',  label: 'Username',                       width: '15%', visible: true,  sortable: true,
      cell: u => '<span class="username-cell"><svg class="icon"><use href="#icon-user"/></svg>' + u.username + '</span>' },
    { key: 'team',      label: 'Agent Team',                     width: '14%', visible: true,  sortable: true,
      cell: u => u.team
        ? '<span class="team-pill">' + u.team + '</span>'
        : '<span class="team-pill none">No team</span>' },
    { key: 'ccStatus',  label: 'Id Contact Center User Status',  width: '13%', visible: true,  sortable: true,
      cell: u => '<span class="type-tag ' + (u.ccStatus === 'Enabled' ? 'agent' : 'system') + '">' + u.ccStatus + '</span>' },
    { key: 'status',    label: 'Status',                         width: '10%', visible: true,  sortable: true,
      cell: u => '<span class="type-tag ' + (u.status === 'active' ? 'agent' : 'system') + '">' +
        (u.status === 'active' ? 'Active' : 'Inactive') + '</span>' },
    { key: 'platformId', label: 'Platform Id',                   width: '11%', visible: true,  sortable: true,
      cell: u => '<span class="im-muted">' + u.platformId + '</span>' },
    { key: 'actions',   label: 'Buttons',                        width: '172px', visible: true,  sortable: false,
      isActions: true }
  ];

  const body = document.getElementById('gridBody');
  const gridHead = document.getElementById('gridHead');
  const gridColgroup = document.getElementById('gridColgroup');
  const noRecords = document.getElementById('noRecords');
  const recordCount = document.getElementById('recordCount');
  const colToggleList = document.getElementById('colToggleList');

  const filters = {};
  COLUMNS.forEach(c => { filters[c.key] = ''; });
  let typeFilter = '';
  let statusFilter = '';
  let sortKey = 'first';
  let sortDir = 1;

  function visibleColumns() {
    return COLUMNS.filter(c => c.visible);
  }

  function visibleRows() {
    return users
      .map((u, i) => ({ u, i }))
      .filter(({ u }) =>
        COLUMNS.every(c => c.isActions || String(u[c.key] || '').toLowerCase().includes(filters[c.key])) &&
        (typeFilter === '' || u.type === typeFilter) &&
        (statusFilter === '' || u.status === statusFilter)
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        return String(a.u[sortKey] || '').localeCompare(String(b.u[sortKey] || ''), undefined, { numeric: true }) * sortDir;
      });
  }

  /* ---------- Header / colgroup (rebuilt whenever columns change) ---------- */
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

    rows.forEach(({ u, i }) => {
      const tr = document.createElement('tr');
      tr.dataset.index = i;
      tr.innerHTML =
        '<td class="col-expand"><button class="row-caret" title="Show details">' +
          '<svg class="icon"><use href="#icon-caret"/></svg></button></td>' +
        cols.map(c => {
          if (c.isActions) {
            return '<td class="col-actions">' +
              '<button class="row-btn edit-btn" title="Edit user"><svg class="icon"><use href="#icon-pencil"/></svg></button>' +
              '<button class="row-btn skills-btn" title="+/- Skills"><svg class="icon"><use href="#icon-target"/></svg></button>' +
              '<button class="row-btn key-btn" title="Reset password"><svg class="icon"><use href="#icon-lock"/></svg></button>' +
              '<button class="row-btn copy-btn" title="Clone user"><svg class="icon"><use href="#icon-copy"/></svg></button>' +
              '<button class="row-btn access-btn" title="Edit access group"><svg class="icon"><use href="#icon-shield"/></svg></button>' +
              '<button class="row-btn toggle-btn ' + (u.status === 'active' ? 'is-active' : 'is-inactive') + '" ' +
                'title="' + (u.status === 'active' ? 'Deactivate user (click to turn off)' : 'Activate user (click to turn on)') + '">' +
                '<svg class="icon"><use href="#icon-' + (u.status === 'active' ? 'check-circle' : 'circle') + '"/></svg></button>' +
              '<button class="row-btn summary-btn" title="Access summary"><svg class="icon"><use href="#icon-list"/></svg></button>' +
              '<button class="row-btn delete-btn" title="Delete"><svg class="icon"><use href="#icon-trash"/></svg></button>' +
              '<button class="row-btn audit-btn" title="User audit"><svg class="icon"><use href="#icon-clock-history"/></svg></button>' +
            '</td>';
          }
          return '<td' + (c.align === 'left' ? ' class="cell-left"' : '') + '>' + c.cell(u) + '</td>';
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
    const user = users[tr.dataset.index];

    if (e.target.closest('.edit-btn')) {
      openEditUserModal(user);
      return;
    }
    if (e.target.closest('.key-btn')) {
      openResetPasswordModal(user);
      return;
    }
    if (e.target.closest('.copy-btn')) {
      openCloneModal(user);
      return;
    }
    if (e.target.closest('.skills-btn')) {
      openSkillsModal(user);
      return;
    }
    if (e.target.closest('.access-btn')) {
      openGroupsModal(user);
      return;
    }
    if (e.target.closest('.toggle-btn')) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      user.ccStatus = user.status === 'active' ? 'Enabled' : 'Disabled';
      renderBody();
      return;
    }
    if (e.target.closest('.summary-btn')) {
      openSummaryModal(user);
      return;
    }
    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete user "' + user.username + '"?')) {
        users.splice(users.indexOf(user), 1);
        renderBody();
      }
      return;
    }
    if (e.target.closest('.audit-btn')) {
      openAuditModal(user);
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
          '<div><span>Username</span>' + user.username + '</div>' +
          '<div><span>Agent ID</span>' + (user.agentId || '&mdash;') + '</div>' +
          '<div><span>Agent Team</span>' + (user.team || '&mdash;') + '</div>' +
          '<div><span>User Type</span>' + user.type + '</div>' +
          '<div><span>Status</span>' + (user.status === 'active' ? 'Active' : 'Inactive') + '</div>' +
          '<div><span>Platform Id</span>' + user.platformId + '</div>' +
        '</div></td>';
      tr.insertAdjacentElement('afterend', detail);
      caret.classList.add('open');
    }
  });

  /* ---------- Clone user dialog ---------- */
  const PROFILES = {
    admin: 'Administrator_Launchpad',
    supervisor: 'Supervisor_Launchpad',
    agent: 'Agent_Desktop',
    system: 'System_Profile'
  };
  const ROLES = {
    admin: 'Dcloud_Admin_Role',
    supervisor: 'Dcloud_Supervisor_Role',
    agent: 'All_Agent_Role_Group',
    system: 'All_System_Role_Group'
  };

  const cloneModal = document.getElementById('cloneModal');
  const cFields = ['cUsername', 'cFirst', 'cLast', 'cPhone', 'cEmail', 'cAgentId', 'cEnterprise', 'cDesc', 'cPassword']
    .reduce((o, id) => { o[id] = document.getElementById(id); return o; }, {});
  let cloneSource = null;

  function openCloneModal(user) {
    cloneSource = user;
    const fullName = user.first + ' ' + user.last;
    document.getElementById('cloneTitle').textContent = 'Clone User: ' + user.username;
    document.getElementById('cloneSourceName').textContent = fullName;
    document.getElementById('cloneSourceName2').textContent = fullName;

    Object.values(cFields).forEach(f => { f.value = ''; f.classList.remove('invalid'); });

    document.getElementById('cSite').value = 'Unassigned Site';
    document.getElementById('cDept').value = 'Unassigned Department';
    document.getElementById('cBillingUnit').value = 'Unassigned BU';
    document.getElementById('cDeskSettings').value =
      user.type === 'supervisor' ? 'SupervisorDeskSettings' : 'DefaultAgentDeskSettings';

    const profileSel = document.getElementById('cProfile');
    const roleSel = document.getElementById('cRole');
    profileSel.innerHTML = Object.values(PROFILES).map(p =>
      '<option' + (p === PROFILES[user.type] ? ' selected' : '') + '>' + p + '</option>').join('');
    roleSel.innerHTML = Object.values(ROLES).map(r =>
      '<option' + (r === ROLES[user.type] ? ' selected' : '') + '>' + r + '</option>').join('');

    const teamSel = document.getElementById('cTeam');
    const teamNames = Array.from(new Set(users.map(u => u.team).filter(Boolean)));
    teamSel.innerHTML = '<option value="">No team</option>' +
      teamNames.map(t => '<option' + (t === user.team ? ' selected' : '') + '>' + t + '</option>').join('');

    switchCloneTab('info');
    cloneModal.hidden = false;
    cFields.cUsername.focus();
  }

  function closeCloneModal() {
    cloneModal.hidden = true;
    cloneSource = null;
  }

  function switchCloneTab(tab) {
    document.querySelectorAll('#cloneTabs .modal-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.ctab === tab));
    document.getElementById('cloneInfoTab').hidden = tab !== 'info';
    document.getElementById('cloneCollectionsTab').hidden = tab !== 'collections';
  }

  document.getElementById('cloneTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.modal-tab');
    if (tab) switchCloneTab(tab.dataset.ctab);
  });

  function saveCloneModal() {
    const required = ['cUsername', 'cFirst', 'cLast', 'cPhone', 'cAgentId', 'cEnterprise'];
    let firstInvalid = null;
    required.forEach(id => {
      const bad = cFields[id].value.trim() === '';
      cFields[id].classList.toggle('invalid', bad);
      if (bad && !firstInvalid) firstInvalid = cFields[id];
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const clone = Object.assign({}, cloneSource, {
      first: cFields.cFirst.value.trim(),
      last: cFields.cLast.value.trim(),
      username: cFields.cUsername.value.trim(),
      agentId: cFields.cAgentId.value.trim(),
      team: document.getElementById('cTeam').value || '',
      status: 'active',
      ccStatus: 'Enabled'
    });

    users.splice(users.indexOf(cloneSource) + 1, 0, clone);
    closeCloneModal();
    renderBody();
  }

  document.getElementById('cloneSave').addEventListener('click', saveCloneModal);
  document.getElementById('cloneCancel').addEventListener('click', closeCloneModal);
  document.getElementById('cloneClose').addEventListener('click', closeCloneModal);

  cloneModal.addEventListener('click', (e) => {
    if (e.target === cloneModal) closeCloneModal();
  });

  Object.values(cFields).forEach(f => {
    f.addEventListener('input', () => f.classList.remove('invalid'));
  });

  document.addEventListener('keydown', (e) => {
    if (!cloneModal.hidden && e.key === 'Escape') closeCloneModal();
  });

  /* ---------- Edit user dialog ---------- */
  const CC_ROLE = { admin: 'Administrator', supervisor: 'Supervisor', agent: 'Agent', system: 'Agent' };

  const editUserModal = document.getElementById('editUserModal');
  let editingUser = null;

  function openEditUserModal(user) {
    editingUser = user;
    document.getElementById('editUserTitle').textContent = 'Edit User: ' + user.username;

    document.getElementById('eUsername').value = user.username;
    document.getElementById('eFirst').value = user.first;
    document.getElementById('eLast').value = user.last;
    document.getElementById('ePhone').value = user.phone || '';
    document.getElementById('eEmail').value = user.email || (user.username + '@dcloud.cisco.com');
    document.getElementById('eEnterprise').value = user.enterpriseName || (user.last + '_' + user.first);
    document.getElementById('eDesc').value = user.description || '';

    document.getElementById('eSite').value = user.site || 'Unassigned Site';
    document.getElementById('eDept').value = user.dept || 'Unassigned Department';
    document.getElementById('eBillingUnit').value = user.billingUnit || 'Unassigned BU';
    document.getElementById('eUserType').value = user.userTypeLabel ||
      (user.type === 'supervisor' ? 'Supervisor User' : user.type === 'system' ? 'System User' : 'Standard User');

    const eProfileSel = document.getElementById('eProfile');
    const eRoleSel = document.getElementById('eRole');
    eProfileSel.innerHTML = Object.values(PROFILES).map(p =>
      '<option' + (p === (user.profile || PROFILES[user.type]) ? ' selected' : '') + '>' + p + '</option>').join('');
    eRoleSel.innerHTML = Object.values(ROLES).map(r =>
      '<option' + (r === (user.role || ROLES[user.type]) ? ' selected' : '') + '>' + r + '</option>').join('');

    document.getElementById('eCcUser').value = user.ccUserRole || CC_ROLE[user.type];
    document.getElementById('eDeskSettings').value =
      user.deskSettings || (user.type === 'supervisor' ? 'SupervisorDeskSettings' : 'DefaultAgentDeskSettings');
    document.getElementById('ePlatform').value = user.platform || 'CUCM_PG_1';
    document.getElementById('eFullUserName').value = user.username + '@dcloud.cisco.com';

    const eTeamSel = document.getElementById('eTeam');
    const eTeamNames = Array.from(new Set(users.map(u => u.team).filter(Boolean)));
    eTeamSel.innerHTML = '<option value="">No team</option>' +
      eTeamNames.map(t => '<option' + (t === user.team ? ' selected' : '') + '>' + t + '</option>').join('');

    document.getElementById('eAgentId').value = user.agentId || '';

    switchEditUserTab('cc');
    editUserModal.hidden = false;
    document.getElementById('eUsername').focus();
  }

  function closeEditUserModal() {
    editUserModal.hidden = true;
    editingUser = null;
  }

  function switchEditUserTab(tab) {
    document.querySelectorAll('#editUserTabs .mini-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.etab === tab));
    document.getElementById('editCcTab').hidden = tab !== 'cc';
    document.getElementById('editAgentIdTab').hidden = tab !== 'agentid';
  }

  document.getElementById('editUserTabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.mini-tab');
    if (tab) switchEditUserTab(tab.dataset.etab);
  });

  function saveEditUserModal() {
    const usernameField = document.getElementById('eUsername');
    const firstField = document.getElementById('eFirst');
    const lastField = document.getElementById('eLast');
    [usernameField, firstField, lastField].forEach(f => f.classList.remove('invalid'));

    let firstInvalid = null;
    [usernameField, firstField, lastField].forEach(f => {
      if (f.value.trim() === '') {
        f.classList.add('invalid');
        if (!firstInvalid) firstInvalid = f;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    Object.assign(editingUser, {
      username: usernameField.value.trim(),
      first: firstField.value.trim(),
      last: lastField.value.trim(),
      phone: document.getElementById('ePhone').value.trim(),
      email: document.getElementById('eEmail').value.trim(),
      enterpriseName: document.getElementById('eEnterprise').value.trim(),
      description: document.getElementById('eDesc').value.trim(),
      site: document.getElementById('eSite').value,
      dept: document.getElementById('eDept').value,
      billingUnit: document.getElementById('eBillingUnit').value,
      userTypeLabel: document.getElementById('eUserType').value,
      profile: document.getElementById('eProfile').value,
      role: document.getElementById('eRole').value,
      ccUserRole: document.getElementById('eCcUser').value,
      deskSettings: document.getElementById('eDeskSettings').value,
      platform: document.getElementById('ePlatform').value,
      team: document.getElementById('eTeam').value,
      agentId: document.getElementById('eAgentId').value.trim()
    });

    closeEditUserModal();
    renderBody();
  }

  document.getElementById('editUserSave').addEventListener('click', saveEditUserModal);
  document.getElementById('editUserCancel').addEventListener('click', closeEditUserModal);
  document.getElementById('editUserClose').addEventListener('click', closeEditUserModal);

  editUserModal.addEventListener('click', (e) => {
    if (e.target === editUserModal) closeEditUserModal();
  });

  ['eUsername', 'eFirst', 'eLast'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => e.target.classList.remove('invalid'));
  });

  document.addEventListener('keydown', (e) => {
    if (!editUserModal.hidden && e.key === 'Escape') closeEditUserModal();
  });

  /* ---------- Edit groups dialog ---------- */
  const GROUPS = ['All General Group', 'All System Group', 'Dept_A_Admins',
                  'Cumulus_Admins', 'Cumulus_Supervisors', 'Reporting_Viewers'];

  const userGroups = {};
  function groupsFor(username) {
    if (!userGroups[username]) userGroups[username] = [];
    return userGroups[username];
  }
  userGroups.rbarrows = ['Cumulus_Admins'];
  userGroups.Administrator = ['All System Group', 'All General Group'];
  userGroups.portalowner = ['All System Group'];

  const groupsModal = document.getElementById('groupsModal');
  const gAssignedList = document.getElementById('gAssignedList');
  const gAvailableList = document.getElementById('gAvailableList');
  let groupsUser = null;
  let gAssigned = [];
  let gAvailable = [];
  let gChecked = {};
  const gFilter = { assigned: '', available: '' };
  const gSort = { assigned: 1, available: 1 };

  function openGroupsModal(user) {
    groupsUser = user;
    gAssigned = groupsFor(user.username).slice();
    gAvailable = GROUPS.filter(g => gAssigned.indexOf(g) === -1);
    gChecked = {};
    gFilter.assigned = gFilter.available = '';
    document.getElementById('gAssignedFilter').value = '';
    document.getElementById('gAvailableFilter').value = '';
    document.getElementById('groupsTitle').textContent = 'Edit Groups For User: ' + user.username;
    groupsModal.hidden = false;
    renderGroups();
  }

  function closeGroupsModal() {
    groupsModal.hidden = true;
    groupsUser = null;
  }

  function gRowsFor(side) {
    const list = side === 'assigned' ? gAssigned : gAvailable;
    return list
      .filter(g => g.toLowerCase().includes(gFilter[side]))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()) * gSort[side]);
  }

  function renderGroupPane(side, listEl, countId, posId, allId) {
    const rows = gRowsFor(side);
    listEl.innerHTML = '';

    if (rows.length === 0) {
      listEl.innerHTML = '<li class="sup-empty-list">No records</li>';
    } else {
      rows.forEach(g => {
        const li = document.createElement('li');
        li.dataset.group = g;
        if (gChecked[g]) li.classList.add('checked');
        li.innerHTML =
          '<svg class="sup-avatar"><use href="#icon-search"/></svg>' +
          '<span class="who"><b>' + g + '</b></span>' +
          '<input type="checkbox"' + (gChecked[g] ? ' checked' : '') + ' aria-label="Select ' + g + '">';
        listEl.appendChild(li);
      });
    }

    document.getElementById(countId).textContent =
      rows.length === 0 ? 'No records' : rows.length + (rows.length === 1 ? ' record' : ' records');
    document.getElementById(posId).textContent = rows.length === 0 ? '0/0' : '1/1';
    document.getElementById(allId).checked = rows.length > 0 && rows.every(g => gChecked[g]);
  }

  function renderGroups() {
    renderGroupPane('assigned', gAssignedList, 'gAssignedCount', 'gAssignedPos', 'gAssignedAll');
    renderGroupPane('available', gAvailableList, 'gAvailableCount', 'gAvailablePos', 'gAvailableAll');
    document.getElementById('gMoveRight').disabled = !gAssigned.some(g => gChecked[g]);
    document.getElementById('gMoveLeft').disabled = !gAvailable.some(g => gChecked[g]);
  }

  [gAssignedList, gAvailableList].forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-group]');
      if (!li) return;
      gChecked[li.dataset.group] = !gChecked[li.dataset.group];
      renderGroups();
    });
  });

  document.getElementById('gMoveRight').addEventListener('click', () => {
    const moving = gAssigned.filter(g => gChecked[g]);
    gAssigned = gAssigned.filter(g => !gChecked[g]);
    gAvailable = gAvailable.concat(moving);
    moving.forEach(g => { gChecked[g] = false; });
    renderGroups();
  });

  document.getElementById('gMoveLeft').addEventListener('click', () => {
    const moving = gAvailable.filter(g => gChecked[g]);
    gAvailable = gAvailable.filter(g => !gChecked[g]);
    gAssigned = gAssigned.concat(moving);
    moving.forEach(g => { gChecked[g] = false; });
    renderGroups();
  });

  document.getElementById('gAssignedAll').addEventListener('change', (e) => {
    gRowsFor('assigned').forEach(g => { gChecked[g] = e.target.checked; });
    renderGroups();
  });

  document.getElementById('gAvailableAll').addEventListener('change', (e) => {
    gRowsFor('available').forEach(g => { gChecked[g] = e.target.checked; });
    renderGroups();
  });

  document.getElementById('gAssignedFilter').addEventListener('input', (e) => {
    gFilter.assigned = e.target.value.trim().toLowerCase();
    renderGroups();
  });

  document.getElementById('gAvailableFilter').addEventListener('input', (e) => {
    gFilter.available = e.target.value.trim().toLowerCase();
    renderGroups();
  });

  document.querySelectorAll('.sup-sort[data-gsort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.gsort;
      gSort[side] = -gSort[side];
      btn.querySelector('.arrow').innerHTML = gSort[side] === 1 ? '&#9650;' : '&#9660;';
      renderGroups();
    });
  });

  document.getElementById('groupsSave').addEventListener('click', () => {
    userGroups[groupsUser.username] = gAssigned.slice();
    closeGroupsModal();
  });

  document.getElementById('groupsCancel').addEventListener('click', closeGroupsModal);
  document.getElementById('groupsClose').addEventListener('click', closeGroupsModal);

  groupsModal.addEventListener('click', (e) => {
    if (e.target === groupsModal) closeGroupsModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!groupsModal.hidden && e.key === 'Escape') closeGroupsModal();
  });

  /* ---------- User audit dialog ---------- */
  const auditModal = document.getElementById('auditModal');
  const auditChips = document.getElementById('auditChips');
  const auditResults = document.getElementById('auditResults');
  let auditUser = null;
  let auditMonth = null;

  function last6Months() {
    const out = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    }
    return out;
  }

  function openAuditModal(user) {
    auditUser = user;
    auditMonth = null;
    document.getElementById('auditTitle').textContent = 'User audit: ' + user.username;
    document.getElementById('auditType').value = 'All';
    document.getElementById('auditSearch').value = '';

    auditChips.innerHTML = last6Months().map(m =>
      '<button class="audit-chip" data-month="' + m + '">' + m + '</button>').join('');

    renderAuditResults();
    auditModal.hidden = false;
  }

  function closeAuditModal() {
    auditModal.hidden = true;
    auditUser = null;
  }

  function renderAuditResults() {
    auditResults.innerHTML = '<div class="audit-empty">No records found for the given query</div>';
  }

  auditChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.audit-chip');
    if (!chip) return;
    const month = chip.dataset.month;
    auditMonth = auditMonth === month ? null : month;
    auditChips.querySelectorAll('.audit-chip').forEach(c =>
      c.classList.toggle('active', c.dataset.month === auditMonth));
    renderAuditResults();
  });

  document.getElementById('auditSearchBtn').addEventListener('click', renderAuditResults);
  document.getElementById('auditSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') renderAuditResults();
  });
  document.getElementById('auditType').addEventListener('change', renderAuditResults);

  document.getElementById('auditClose').addEventListener('click', closeAuditModal);
  document.getElementById('auditCloseBtn').addEventListener('click', closeAuditModal);

  auditModal.addEventListener('click', (e) => {
    if (e.target === auditModal) closeAuditModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!auditModal.hidden && e.key === 'Escape') closeAuditModal();
  });

  /* ---------- Access summary dialog ---------- */
  const CHILD_CATEGORIES = [
    { key: 'teams', label: 'Cumuls Teams', type: 'Agent Team',
      data: () => Array.from(new Set(users.map(u => u.team).filter(Boolean))).map(n => ({ object: n })) },
    { key: 'users', label: 'Cumuls Users', type: 'User',
      data: () => users.map(u => ({ object: u.username })) },
    { key: 'callflows', label: 'Cumulus CallFlows', type: 'Flow',
      data: () => ['Cumulus_Main_IVR', 'Cumulus_Sales_Flow', 'Cumulus_Support_Flow',
                    'Cumulus_Callback', 'Cumulus_After_Hours', 'Cumulus_Email_Routing'].map(n => ({ object: n })) },
    { key: 'pqs', label: 'Cumulus PQs', type: 'Precision Queue',
      data: () => ['CumulusCB', 'CumulusCertification', 'CumulusChat', 'CumulusChatEnglish',
                    'CumulusChatItalian', 'CumulusChatSpanish', 'CumulusCity', 'CumulusEmail',
                    'CumulusFinance', 'CumulusHealthCare', 'CumulusInbound', 'CumulusOutbound',
                    'CumulusRLM', 'CumulusTask', 'CumulusTravel', 'CumulusUtility',
                    'CumulusUWF', 'CumulusVIVR'].map(n => ({ object: n })) },
    { key: 'routing', label: 'Cumulus Routing Controls', type: 'Routing Controls',
      data: () => ['Emerg_Closed_A', 'A_HOOPS', 'Blocked_Phone_Numbs', 'Account_Lookup',
                    'Text1', 'Cumulus_Offer_Callback', 'Cumulus_HOOPS'].map(n => ({ object: n })) },
    { key: 'skills', label: 'Cumulus Skill Groups', type: 'Skill Group',
      data: () => ['Sales Skill', 'Support Skill', 'Billing Skill', 'VIP Skill'].map(n => ({ object: n })) },
    { key: 'agents', label: 'Cumulus_Agents', type: 'Agent',
      data: () => users.filter(u => u.type === 'agent').map(u => ({ object: u.username })) },
    { key: 'audio', label: 'Cumulus_Audio', type: 'Audio Prompt',
      data: () => ['welcome_greeting.wav', 'hold_music.wav', 'menu_main.wav', 'menu_sales.wav',
                    'menu_support.wav', 'estimated_wait.wav', 'callback_offer.wav', 'after_hours.wav',
                    'holiday_closure.wav', 'agent_transfer.wav', 'survey_invite.wav', 'goodbye.wav'].map(n => ({ object: n })) },
    { key: 'platforms', label: 'Cumulus_Platforms', type: 'Platform',
      data: () => ['CUCM_PG_1', 'CUCM_PG_2'].map(n => ({ object: n })) },
    { key: 'profiles', label: 'Profiles', type: 'Profile',
      data: () => Object.values(PROFILES).map(n => ({ object: n })) }
  ];

  const summaryModal = document.getElementById('summaryModal');
  const asTree = document.getElementById('asTree');
  const asContent = document.getElementById('asContent');
  let summaryUser = null;
  let asSelected = null;
  let asSearchTerm = '';

  function openSummaryModal(user) {
    summaryUser = user;
    asSelected = null;
    asSearchTerm = '';
    document.getElementById('asSearch').value = '';
    document.getElementById('summaryTitle').textContent = user.username + ' Access Summary';
    renderAsTree();
    summaryModal.hidden = false;
  }

  function closeSummaryModal() {
    summaryModal.hidden = true;
    summaryUser = null;
  }

  function renderAsTree() {
    const groups = groupsFor(summaryUser.username);

    if (groups.length === 0) {
      asTree.innerHTML = '<div class="as-empty-tree">No access groups assigned</div>';
      asContent.innerHTML = '<div class="as-content-empty">This user has no access groups.</div>';
      return;
    }

    asTree.innerHTML = groups.map((g, gi) => {
      const children = CHILD_CATEGORIES.filter(c =>
        asSearchTerm === '' ||
        c.label.toLowerCase().includes(asSearchTerm) ||
        g.toLowerCase().includes(asSearchTerm));
      if (children.length === 0) return '';
      return '<li class="as-group' + (gi === 0 ? '' : ' collapsed') + '" data-group="' + g + '">' +
        '<button class="as-group-head">' +
          '<span class="as-group-toggle">&#9660;</span><span>' + g + '</span>' +
        '</button>' +
        '<ul class="as-children">' +
          children.map(c =>
            '<li><button class="as-child' +
              (asSelected && asSelected.group === g && asSelected.key === c.key ? ' selected' : '') + '" ' +
              'data-group="' + g + '" data-key="' + c.key + '">' + c.label + '</button></li>'
          ).join('') +
        '</ul>' +
      '</li>';
    }).join('');

    if (!asSelected) {
      const firstGroup = groups[0];
      const firstCat = CHILD_CATEGORIES[0];
      selectAsChild(firstGroup, firstCat.key);
    } else {
      renderAsContent();
    }
  }

  function selectAsChild(group, key) {
    asSelected = { group: group, key: key };
    asTree.querySelectorAll('.as-child').forEach(b =>
      b.classList.toggle('selected', b.dataset.group === group && b.dataset.key === key));
    renderAsContent();
  }

  function renderAsContent() {
    if (!asSelected) {
      asContent.innerHTML = '<div class="as-content-empty">Select an item from the tree.</div>';
      return;
    }
    const cat = CHILD_CATEGORIES.find(c => c.key === asSelected.key);
    const rows = cat.data();
    asContent.innerHTML =
      '<div class="as-content-title">Collection: ' + cat.label + '</div>' +
      (rows.length === 0
        ? '<div class="as-content-empty">No objects in this collection.</div>'
        : '<table class="as-table"><thead><tr><th>Object</th><th>Type</th></tr></thead><tbody>' +
          rows.map(r => '<tr><td>' + r.object + '</td><td class="type-cell">' + cat.type + '</td></tr>').join('') +
          '</tbody></table>');
  }

  asTree.addEventListener('click', (e) => {
    const head = e.target.closest('.as-group-head');
    if (head) {
      head.closest('.as-group').classList.toggle('collapsed');
      return;
    }
    const child = e.target.closest('.as-child');
    if (child) {
      selectAsChild(child.dataset.group, child.dataset.key);
    }
  });

  document.getElementById('asSearch').addEventListener('input', (e) => {
    asSearchTerm = e.target.value.trim().toLowerCase();
    renderAsTree();
  });

  document.getElementById('asExpandAll').addEventListener('click', () => {
    asTree.querySelectorAll('.as-group').forEach(g => g.classList.remove('collapsed'));
  });

  document.getElementById('asCollapseAll').addEventListener('click', () => {
    asTree.querySelectorAll('.as-group').forEach(g => g.classList.add('collapsed'));
  });

  document.getElementById('asDownload').addEventListener('click', () => {
    if (!asSelected) return;
    const cat = CHILD_CATEGORIES.find(c => c.key === asSelected.key);
    const rows = cat.data();
    const csv = ['Object,Type'].concat(rows.map(r => '"' + r.object + '",' + cat.type)).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = cat.label.replace(/\s+/g, '_') + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('summaryClose').addEventListener('click', closeSummaryModal);

  summaryModal.addEventListener('click', (e) => {
    if (e.target === summaryModal) closeSummaryModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!summaryModal.hidden && e.key === 'Escape') closeSummaryModal();
  });

  /* ================================================================
     RESET PASSWORD MODAL
     ================================================================ */
  const resetPasswordModal = document.getElementById('resetPasswordModal');
  let rpwUser = null;
  let rpwCurrentGenerated = '';

  const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const LOWER = 'abcdefghijkmnpqrstuvwxyz';
  const NUMS  = '23456789';
  const SPECS = '!@#$%^&*-_=+?';

  function generatePassword(len) {
    len = len || 14;
    const all = UPPER + LOWER + NUMS + SPECS;
    let p = '';
    p += UPPER[Math.floor(Math.random() * UPPER.length)];
    p += LOWER[Math.floor(Math.random() * LOWER.length)];
    p += NUMS[Math.floor(Math.random() * NUMS.length)];
    p += SPECS[Math.floor(Math.random() * SPECS.length)];
    for (let i = 4; i < len; i++) {
      p += all[Math.floor(Math.random() * all.length)];
    }
    return p.split('').sort(() => Math.random() - 0.5).join('');
  }

  function rpwInitials(u) {
    const a = (u.first || '?').charAt(0);
    const b = (u.last || '').charAt(0);
    return (a + b).toUpperCase();
  }

  function openResetPasswordModal(user) {
    rpwUser = user;
    document.getElementById('rpwSubtitle').textContent = user.username + ' @ Webex Contact Center';
    document.getElementById('rpwUserName').textContent = user.first + ' ' + user.last;
    document.getElementById('rpwUserUsername').textContent = user.username;
    document.getElementById('rpwUserTeam').textContent = user.team || 'No team';
    const pill = document.getElementById('rpwUserStatus');
    pill.textContent = user.status === 'active' ? 'Active' : 'Inactive';
    pill.className = 'rpw-status-pill ' + user.status;

    const avatar = document.getElementById('rpwAvatar');
    avatar.textContent = rpwInitials(user);
    avatar.style.background = AVATAR_COLOR[user.type];

    document.querySelector('input[name="rpwMode"][value="auto"]').checked = true;
    document.getElementById('rpwManualSection').hidden = true;
    document.getElementById('rpwAutoSection').hidden = false;

    document.getElementById('rpwNewPass').value = '';
    document.getElementById('rpwConfirmPass').value = '';
    document.getElementById('rpwNewPass').classList.remove('invalid');
    document.getElementById('rpwConfirmPass').classList.remove('invalid');
    document.getElementById('rpwStrengthLabel').textContent = '';
    document.getElementById('rpwStrengthLabel').className = 'rpw-strength-label';
    document.querySelector('.rpw-strength-bars').className = 'rpw-strength-bars';
    document.getElementById('rpwMatch').textContent = '';
    document.getElementById('rpwMatch').className = 'rpw-match';
    document.querySelectorAll('.rpw-req').forEach(r => r.classList.remove('pass'));

    document.getElementById('rpwForceChange').checked = true;
    document.getElementById('rpwSendEmail').checked = true;
    document.getElementById('rpwToast').hidden = true;

    rpwCurrentGenerated = generatePassword(14);
    document.getElementById('rpwGenPass').textContent = rpwCurrentGenerated;
    document.getElementById('rpwCopyGen').classList.remove('copied');

    resetPasswordModal.hidden = false;
  }

  function closeResetPasswordModal() {
    resetPasswordModal.hidden = true;
    rpwUser = null;
  }

  document.querySelectorAll('input[name="rpwMode"]').forEach(r => {
    r.addEventListener('change', () => {
      const mode = document.querySelector('input[name="rpwMode"]:checked').value;
      document.getElementById('rpwManualSection').hidden = mode !== 'manual';
      document.getElementById('rpwAutoSection').hidden = mode !== 'auto';
    });
  });

  document.getElementById('rpwToggleNew').addEventListener('click', () => {
    const i = document.getElementById('rpwNewPass');
    i.type = i.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('rpwToggleConfirm').addEventListener('click', () => {
    const i = document.getElementById('rpwConfirmPass');
    i.type = i.type === 'password' ? 'text' : 'password';
  });

  function checkPasswordReqs(pw) {
    return {
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      num: /[0-9]/.test(pw),
      spec: /[^A-Za-z0-9]/.test(pw)
    };
  }

  function passwordStrength(pw) {
    if (!pw) return { level: 0, label: '' };
    const r = checkPasswordReqs(pw);
    let score = Object.values(r).filter(Boolean).length;
    if (pw.length >= 12 && score >= 4) score = 5;
    if (score <= 1) return { level: 1, label: 'Weak' };
    if (score === 2) return { level: 2, label: 'Fair' };
    if (score === 3 || score === 4) return { level: 3, label: 'Good' };
    return { level: 4, label: 'Strong' };
  }

  function updateRpwStrengthUI() {
    const pw = document.getElementById('rpwNewPass').value;
    const reqs = checkPasswordReqs(pw);
    document.querySelectorAll('.rpw-req').forEach(el => {
      const key = el.dataset.req;
      el.classList.toggle('pass', reqs[key]);
      const svg = el.querySelector('use');
      if (svg) {
        svg.setAttribute('href', reqs[key] ? '#icon-check' : '#icon-circle');
      }
    });
    const st = passwordStrength(pw);
    const barsEl = document.querySelector('.rpw-strength-bars');
    const labelEl = document.getElementById('rpwStrengthLabel');
    const cls = ['', 'weak', 'fair', 'good', 'strong'][st.level] || '';
    barsEl.className = 'rpw-strength-bars ' + cls;
    labelEl.textContent = st.label;
    labelEl.className = 'rpw-strength-label ' + cls;

    const conf = document.getElementById('rpwConfirmPass').value;
    const matchEl = document.getElementById('rpwMatch');
    if (conf === '' || pw === '') {
      matchEl.textContent = '';
      matchEl.className = 'rpw-match';
    } else if (conf === pw) {
      matchEl.textContent = 'Passwords match';
      matchEl.className = 'rpw-match ok';
    } else {
      matchEl.textContent = 'Passwords do not match';
      matchEl.className = 'rpw-match bad';
    }
  }

  document.getElementById('rpwNewPass').addEventListener('input', updateRpwStrengthUI);
  document.getElementById('rpwConfirmPass').addEventListener('input', updateRpwStrengthUI);

  document.getElementById('rpwRefreshGen').addEventListener('click', () => {
    rpwCurrentGenerated = generatePassword(14);
    document.getElementById('rpwGenPass').textContent = rpwCurrentGenerated;
    document.getElementById('rpwCopyGen').classList.remove('copied');
  });

  document.getElementById('rpwCopyGen').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(rpwCurrentGenerated);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = rpwCurrentGenerated;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e2) {}
      document.body.removeChild(ta);
    }
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1500);
  });

  document.getElementById('rpwSave').addEventListener('click', () => {
    const mode = document.querySelector('input[name="rpwMode"]:checked').value;
    const toast = document.getElementById('rpwToast');
    const toastText = document.getElementById('rpwToastText');
    let finalPass = '';

    if (mode === 'manual') {
      const np = document.getElementById('rpwNewPass');
      const cp = document.getElementById('rpwConfirmPass');
      np.classList.remove('invalid');
      cp.classList.remove('invalid');
      if (!np.value.trim()) {
        np.classList.add('invalid');
        np.focus();
        return;
      }
      const reqs = checkPasswordReqs(np.value);
      const passed = Object.values(reqs).filter(Boolean).length;
      if (passed < 3) {
        np.classList.add('invalid');
        np.focus();
        return;
      }
      if (np.value !== cp.value) {
        cp.classList.add('invalid');
        cp.focus();
        return;
      }
      finalPass = np.value;
    } else {
      finalPass = rpwCurrentGenerated;
    }

    const force = document.getElementById('rpwForceChange').checked;
    const email = document.getElementById('rpwSendEmail').checked;
    let msg = 'Password has been reset for ' + rpwUser.username;
    if (force) msg += ' (force change on login)';
    if (email) msg += ', email notification sent';
    msg += '.';
    toastText.textContent = msg;
    toast.hidden = false;
    setTimeout(() => {
      closeResetPasswordModal();
    }, 1600);
  });

  document.getElementById('rpwCancel').addEventListener('click', closeResetPasswordModal);
  document.getElementById('rpwClose').addEventListener('click', closeResetPasswordModal);
  resetPasswordModal.addEventListener('click', (e) => {
    if (e.target === resetPasswordModal) closeResetPasswordModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!resetPasswordModal.hidden && e.key === 'Escape') closeResetPasswordModal();
  });

  /* ================================================================
     USER SKILLS MODAL
     ================================================================ */
  const SKILLS_LIST = [
    { name: 'A_Sales', type: 'voice',  agents: 2 },
    { name: 'CumulusMain', type: 'voice', agents: 2 },
    { name: 'CumulusCRM', type: 'voice', agents: 1 },
    { name: 'CumulusUWF', type: 'voice', agents: 3 },
    { name: 'CumulusOutbound', type: 'voice', agents: 1 },
    { name: 'CumulusCallGen', type: 'voice', agents: 1 },
    { name: 'CumulusCB', type: 'voice', agents: 0 },
    { name: 'CumulusCertification', type: 'voice', agents: 0 },
    { name: 'CumulusFinance', type: 'voice', agents: 0 },
    { name: 'CumulusHealthCare', type: 'voice', agents: 0 },
    { name: 'CumulusInbound', type: 'voice', agents: 2 },
    { name: 'CumulusCity', type: 'voice', agents: 0 },
    { name: 'CumulusTravel', type: 'voice', agents: 0 },
    { name: 'CumulusUtility', type: 'voice', agents: 0 },
    { name: 'CumulusRLM', type: 'voice', agents: 0 },
    { name: 'CumulusTask', type: 'voice', agents: 0 },
    { name: 'CumulusVIVR', type: 'voice', agents: 0 },
    { name: 'CumulusChat', type: 'chat', agents: 1 },
    { name: 'CumulusChatEnglish', type: 'chat', agents: 0 },
    { name: 'CumulusChatItalian', type: 'chat', agents: 0 },
    { name: 'CumulusChatSpanish', type: 'chat', agents: 0 },
    { name: 'CUCM_PG_1.CCE_Chat.default.97456', type: 'chat', agents: 0 },
    { name: 'CIM_WIM', type: 'chat', agents: 0 },
    { name: 'CumulusEmail', type: 'email', agents: 0 },
    { name: 'CIM_EIM', type: 'email', agents: 0 },
    { name: 'CUCM_PG_1.ECE_Email.defaul.11266', type: 'email', agents: 0 },
    { name: 'CUCM_PG_1.EGAIN_EMAIL.defa.05821', type: 'email', agents: 0 },
    { name: 'CIM_CALLBACK', type: 'cim', agents: 1 },
    { name: 'CIM_DELAYED', type: 'cim', agents: 1 },
    { name: 'CIM_OUTBOUND', type: 'cim', agents: 2 },
    { name: 'CUCM_PG_1.CIM_BC.default.13802', type: 'cim', agents: 0 },
    { name: 'CUCM_PG_1.CIM_OUTBOUND.def.74114', type: 'cim', agents: 0 },
    { name: 'CUCM_PG_1.Generic.default.00112', type: 'system', agents: 0 },
    { name: 'CUCM_PG_1.RONA.default.09214', type: 'system', agents: 0 },
    { name: 'CUCM_PG_1.Cisco_Voice.defa.01370', type: 'system', agents: 0 },
    { name: 'CUCM_PG_1.ECE_Outbound.def.25076', type: 'system', agents: 0 },
    { name: 'CumulusSMS', type: 'system', agents: 0 },
    { name: 'CumulusFacebook', type: 'system', agents: 0 },
    { name: 'AcqueonOutboundAgent', type: 'voice', agents: 1 },
    { name: 'AcqueonOutboundIVR', type: 'voice', agents: 2 },
    { name: 'AcqueonOutboundPreview', type: 'voice', agents: 2 },
    { name: 'ConsiliumOutboundAgent', type: 'voice', agents: 1 },
    { name: 'ConsiliumOutboundIVR', type: 'voice', agents: 1 },
    { name: 'ConsiliumOutboundPreview', type: 'voice', agents: 1 }
  ];

  const userSkills = {};
  function skillsFor(username) {
    if (!userSkills[username]) userSkills[username] = [];
    return userSkills[username];
  }
  userSkills.amacdowell = ['A_Sales', 'CumulusMain'];
  userSkills.annika = ['CumulusOutbound', 'CumulusChat'];
  userSkills.bbrown = ['A_Sales', 'CumulusInbound'];
  userSkills.csupervisor = ['CumulusCallGen', 'CumulusMain', 'CumulusUWF'];
  userSkills.hliang = ['CumulusUWF', 'CumulusEmail'];
  userSkills.jabracks = ['CumulusUWF', 'CumulusCRM'];
  userSkills.Jdoe = ['A_Sales', 'CumulusInbound'];
  userSkills.jopeters = ['CumulusCRM', 'CumulusChat'];
  userSkills.rbarrows = ['CumulusMain', 'CumulusUWF', 'CumulusCB'];
  userSkills.sjeffers = ['CumulusMain', 'CumulusCity'];
  userSkills.vbcpod1 = ['CumulusOutbound', 'CumulusTask'];

  const skillsModal = document.getElementById('skillsModal');
  let skillsUser = null;
  let usAssigned = [];
  let usAvailable = [];
  let usChecked = {};
  const usFilter = { assigned: '', available: '' };
  const usSort = { assigned: 1, available: 1 };
  let usTypeFilter = 'all';

  function openSkillsModal(user) {
    skillsUser = user;
    const assignedNames = skillsFor(user.username).slice();
    usAssigned = SKILLS_LIST.filter(s => assignedNames.indexOf(s.name) !== -1);
    usAvailable = SKILLS_LIST.filter(s => assignedNames.indexOf(s.name) === -1);
    usChecked = {};
    usFilter.assigned = usFilter.available = '';
    usTypeFilter = 'all';
    document.getElementById('usAssignedFilter').value = '';
    document.getElementById('usAvailableFilter').value = '';

    document.getElementById('usSubtitle').textContent = user.username + ' — skill assignment';
    document.getElementById('usUserName').textContent = user.first + ' ' + user.last;
    document.getElementById('usUserUsername').textContent = user.username;
    document.getElementById('usUserTeam').textContent = user.team || 'No team';

    const av = document.getElementById('usAvatar');
    av.textContent = initials(user);
    av.style.background = AVATAR_COLOR[user.type];

    document.querySelectorAll('.us-type-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.uskill === 'all');
    });

    renderSkills();
    skillsModal.hidden = false;
  }

  function closeSkillsModal() {
    skillsModal.hidden = true;
    skillsUser = null;
  }

  function skillMatchesType(skill) {
    if (usTypeFilter === 'all') return true;
    if (usTypeFilter === 'voice') return skill.type === 'voice';
    return skill.type === usTypeFilter;
  }

  function usRowsFor(side) {
    const list = side === 'assigned' ? usAssigned : usAvailable;
    const f = usFilter[side];
    return list
      .filter(s => skillMatchesType(s))
      .filter(s => s.name.toLowerCase().includes(f) ||
                   (s.type && s.type.toLowerCase().includes(f)))
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) * usSort[side]);
  }

  function renderSkillPane(side, listEl, countId, allId) {
    const rows = usRowsFor(side);
    listEl.innerHTML = '';
    if (rows.length === 0) {
      listEl.innerHTML = '<li class="sup-empty-list">No skills</li>';
    } else {
      rows.forEach(s => {
        const li = document.createElement('li');
        li.dataset.skill = s.name;
        if (usChecked[s.name]) li.classList.add('checked');
        const ttype = s.type === 'voice' ? 'business' : s.type;
        li.innerHTML =
          '<span class="skill-type-dot ' + s.type + '"></span>' +
          '<span class="who"><b>' + s.name + '</b>' +
          '<i style="font-style:normal;margin-left:6px"><span class="skill-type-tag ' + s.type + '">' + s.type.toUpperCase() + '</span></i>' +
          '</span>' +
          '<span class="skill-agent-count' + (s.agents === 0 ? ' zero' : '') + '">' + s.agents + ' ag</span>' +
          '<input type="checkbox"' + (usChecked[s.name] ? ' checked' : '') + ' aria-label="Select ' + s.name + '">';
        listEl.appendChild(li);
      });
    }
    const label = document.getElementById(countId);
    label.textContent = rows.length === 0 ? '0 records' :
      rows.length + (rows.length === 1 ? ' record' : ' records');
    document.getElementById(allId).checked = rows.length > 0 && rows.every(s => usChecked[s.name]);
  }

  function renderSkills() {
    renderSkillPane('assigned', document.getElementById('usAssignedList'), 'usAssignedPos', 'usAssignedAll');
    renderSkillPane('available', document.getElementById('usAvailableList'), 'usAvailablePos', 'usAvailableAll');

    const assignable = usAvailable.filter(s => usChecked[s.name]).length > 0;
    const removable = usAssigned.filter(s => usChecked[s.name]).length > 0;

    document.getElementById('usMoveRight').disabled = !removable;
    document.getElementById('usMoveLeft').disabled = !assignable;
    document.getElementById('usMoveOneRight').disabled = !removable;
    document.getElementById('usMoveOneLeft').disabled = !assignable;
    document.getElementById('usMoveAllRight').disabled = usAssigned.length === 0;
    document.getElementById('usMoveAllLeft').disabled = usAvailable.length === 0;

    document.getElementById('usAssignedCount').textContent = usAssigned.length;
    document.getElementById('usAvailableCount').textContent = usAvailable.length;

    const totalChecked = Object.keys(usChecked).filter(k => usChecked[k]).length;
    const bar = document.getElementById('usSelectedBar');
    if (totalChecked > 0) {
      bar.hidden = false;
      document.getElementById('usSelectedCount').textContent = totalChecked + (totalChecked === 1 ? ' skill selected' : ' skills selected');
    } else {
      bar.hidden = true;
    }
  }

  [document.getElementById('usAssignedList'), document.getElementById('usAvailableList')].forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-skill]');
      if (!li) return;
      usChecked[li.dataset.skill] = !usChecked[li.dataset.skill];
      renderSkills();
    });
  });

  document.querySelectorAll('.us-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.us-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      usTypeFilter = btn.dataset.uskill;
      renderSkills();
    });
  });

  document.getElementById('usMoveRight').addEventListener('click', () => {
    const moving = usAssigned.filter(s => usChecked[s.name]);
    usAssigned = usAssigned.filter(s => !usChecked[s.name]);
    usAvailable = usAvailable.concat(moving);
    moving.forEach(s => { usChecked[s.name] = false; });
    renderSkills();
  });

  document.getElementById('usMoveLeft').addEventListener('click', () => {
    const moving = usAvailable.filter(s => usChecked[s.name]);
    usAvailable = usAvailable.filter(s => !usChecked[s.name]);
    usAssigned = usAssigned.concat(moving);
    moving.forEach(s => { usChecked[s.name] = false; });
    renderSkills();
  });

  document.getElementById('usMoveOneRight').addEventListener('click', () => {
    const moving = usAssigned.filter(s => usChecked[s.name]);
    usAssigned = usAssigned.filter(s => !usChecked[s.name]);
    usAvailable = usAvailable.concat(moving);
    moving.forEach(s => { usChecked[s.name] = false; });
    renderSkills();
  });

  document.getElementById('usMoveOneLeft').addEventListener('click', () => {
    const moving = usAvailable.filter(s => usChecked[s.name]);
    usAvailable = usAvailable.filter(s => !usChecked[s.name]);
    usAssigned = usAssigned.concat(moving);
    moving.forEach(s => { usChecked[s.name] = false; });
    renderSkills();
  });

  document.getElementById('usMoveAllRight').addEventListener('click', () => {
    const all = usAssigned.slice();
    usAvailable = usAvailable.concat(usAssigned.filter(s => skillMatchesType(s)));
    usAssigned = usAssigned.filter(s => !skillMatchesType(s));
    all.forEach(s => { usChecked[s.name] = false; });
    renderSkills();
  });

  document.getElementById('usMoveAllLeft').addEventListener('click', () => {
    const all = usAvailable.slice();
    usAssigned = usAssigned.concat(usAvailable.filter(s => skillMatchesType(s)));
    usAvailable = usAvailable.filter(s => !skillMatchesType(s));
    all.forEach(s => { usChecked[s.name] = false; });
    renderSkills();
  });

  document.getElementById('usAssignedAll').addEventListener('change', (e) => {
    usRowsFor('assigned').forEach(s => { usChecked[s.name] = e.target.checked; });
    renderSkills();
  });

  document.getElementById('usAvailableAll').addEventListener('change', (e) => {
    usRowsFor('available').forEach(s => { usChecked[s.name] = e.target.checked; });
    renderSkills();
  });

  document.getElementById('usAssignedFilter').addEventListener('input', (e) => {
    usFilter.assigned = e.target.value.trim().toLowerCase();
    renderSkills();
  });

  document.getElementById('usAvailableFilter').addEventListener('input', (e) => {
    usFilter.available = e.target.value.trim().toLowerCase();
    renderSkills();
  });

  document.querySelectorAll('.sup-sort[data-ussort]').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.ussort;
      usSort[side] = -usSort[side];
      btn.querySelector('.arrow').innerHTML = usSort[side] === 1 ? '&#9650;' : '&#9660;';
      renderSkills();
    });
  });

  document.getElementById('usClearSelection').addEventListener('click', () => {
    usChecked = {};
    renderSkills();
  });

  document.getElementById('usSave').addEventListener('click', () => {
    userSkills[skillsUser.username] = usAssigned.map(s => s.name);
    closeSkillsModal();
  });

  document.getElementById('usCancel').addEventListener('click', closeSkillsModal);
  document.getElementById('usClose').addEventListener('click', closeSkillsModal);
  skillsModal.addEventListener('click', (e) => {
    if (e.target === skillsModal) closeSkillsModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!skillsModal.hidden && e.key === 'Escape') closeSkillsModal();
  });

  /* ---------- Toolbar dropdown filters ---------- */
  document.getElementById('userTypeFilter').addEventListener('change', (e) => {
    typeFilter = e.target.value;
    renderBody();
  });

  document.getElementById('statusFilterU').addEventListener('change', (e) => {
    statusFilter = e.target.value;
    renderBody();
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

  /* ---------- Export helpers ---------- */
  function exportCsv(filename, rows) {
    const cols = visibleColumns();
    const header = ['First Name', 'Last Name', 'Agent ID', 'Username', 'Agent Team',
                     'Id Contact Center User Status', 'Status', 'Platform Id'];
    const csv = [header.join(',')]
      .concat(rows.map(u => [
        '"' + u.first + '"', '"' + u.last + '"', u.agentId, u.username, '"' + u.team + '"',
        u.ccStatus, u.status, u.platformId
      ].join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf(rows) {
    const cols = visibleColumns().filter(c => !c.isActions);
    const labels = cols.map(c => c.key === 'first' ? 'First Name' :
      c.key === 'last' ? 'Last Name' : c.key === 'agentId' ? 'Agent ID' :
      c.key === 'username' ? 'Username' : c.key === 'team' ? 'Agent Team' :
      c.key === 'ccStatus' ? 'Id Contact Center User Status' :
      c.key === 'status' ? 'Status' : 'Platform Id');

    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups to export as PDF.');
      return;
    }
    const rowsHtml = rows.map(u =>
      '<tr>' + cols.map(c => '<td>' + (u[c.key] || '') + '</td>').join('') + '</tr>'
    ).join('');
    win.document.write(
      '<html><head><title>Users export</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#333}' +
      'h2{font-size:15px} table{width:100%;border-collapse:collapse;margin-top:10px}' +
      'th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}' +
      'th{background:#f2f4f6}' +
      '</style></head><body>' +
      '<h2>Webex Contact Center Enterprise &mdash; Users</h2>' +
      '<table><thead><tr>' + labels.map(l => '<th>' + l + '</th>').join('') + '</tr></thead>' +
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
      case 'clear-filters':
        COLUMNS.forEach(c => { filters[c.key] = ''; });
        typeFilter = '';
        statusFilter = '';
        document.getElementById('userTypeFilter').value = '';
        document.getElementById('statusFilterU').value = '';
        renderHead();
        renderBody();
        break;
      case 'export-all-csv':
        exportCsv('users_all.csv', users);
        break;
      case 'export-visible-csv':
        exportCsv('users_visible.csv', visibleRows().map(({ u }) => u));
        break;
      case 'export-all-pdf':
        exportPdf(users);
        break;
      case 'export-visible-pdf':
        exportPdf(visibleRows().map(({ u }) => u));
        break;
    }
  });

  /* ---------- Init ---------- */
  renderColToggleList();
  renderHead();
  renderBody();
});
