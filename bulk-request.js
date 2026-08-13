document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data ---------- */
  const requests = [
    { owner: 'portal owner', file: '',                  profile: 'Agent Create',     platform: 'UCCE',
      requested: 'Mar 16, 2020', completed: '',          status: 'waiting' },
    { owner: 'portal owner', file: '',                  profile: 'Agent Update',     platform: 'Finesse',
      requested: 'Mar 16, 2020', completed: '',          status: 'waiting' },
    { owner: 'portal owner', file: '',                  profile: 'Skill Assignment', platform: 'UCCE',
      requested: 'Mar 16, 2020', completed: '',          status: 'waiting' },
    { owner: 'rbarrows',     file: 'agents_batch7.csv', profile: 'Agent Create',     platform: 'UCCE',
      requested: 'Mar 14, 2020', completed: 'Mar 14, 2020', status: 'complete' },
    { owner: 'rbarrows',     file: 'team_move.csv',     profile: 'Team Move',        platform: 'Finesse',
      requested: 'Mar 12, 2020', completed: '',          status: 'running' },
    { owner: 'csupervisor',  file: 'skills_q1.csv',     profile: 'Skill Assignment', platform: 'Interaction Manager',
      requested: 'Mar 10, 2020', completed: '',          status: 'failed' },
    { owner: 'portal owner', file: 'pwd_reset.csv',     profile: 'Password Reset',   platform: 'Control Hub',
      requested: 'Mar 08, 2020', completed: '',          status: 'scheduled' },
    { owner: 'jabracks',     file: 'agents_batch6.csv', profile: 'Agent Create',     platform: 'UCCE',
      requested: 'Mar 02, 2020', completed: 'Mar 02, 2020', status: 'complete' }
  ];

  const STATUS_LABEL = {
    waiting:   'Waiting for file',
    running:   'In progress',
    complete:  'Completed',
    failed:    'Failed',
    scheduled: 'Scheduled'
  };

  const strip = document.getElementById('bulkStrip');
  const filters = { profile: '', platform: '', status: '', search: '' };

  /* ---------- Render ---------- */
  function visibleRows() {
    return requests.filter(r =>
      (filters.profile === '' || r.profile === filters.profile) &&
      (filters.platform === '' || r.platform === filters.platform) &&
      (filters.status === '' || r.status === filters.status) &&
      (filters.search === '' ||
        (r.owner + ' ' + r.file + ' ' + r.profile + ' ' + r.platform)
          .toLowerCase().includes(filters.search))
    );
  }

  function card(r, index) {
    return '<div class="bulk-card" data-index="' + index + '">' +
      '<span class="bulk-avatar"><svg class="icon"><use href="#icon-user"/></svg></span>' +
      '<div class="bulk-body">' +
        '<div class="bulk-owner" title="' + r.owner + '">' + r.owner + '</div>' +
        '<div class="bulk-line"><svg class="icon"><use href="#icon-file"/></svg>' +
          'File: <b>' + (r.file || '&mdash;') + '</b></div>' +
        '<div class="bulk-line"><svg class="icon"><use href="#icon-clock"/></svg>' +
          'Request: <b>' + r.requested + '</b></div>' +
        '<div class="bulk-line"><svg class="icon"><use href="#icon-check-circle"/></svg>' +
          'Complete: <b>' + (r.completed || '&mdash;') + '</b></div>' +
        '<div class="bulk-chips">' +
          '<span class="bulk-status ' + r.status + '">' + STATUS_LABEL[r.status] + '</span>' +
        '</div>' +
        '<div class="bulk-chips">' +
          '<span class="bulk-actions-wrap">' +
            '<button class="bulk-chip actions-toggle">&#9662;Actions</button>' +
            '<div class="bulk-menu" hidden>' +
              '<button data-act="upload"><svg class="icon"><use href="#icon-upload"/></svg>Upload file</button>' +
              '<button data-act="download"><svg class="icon"><use href="#icon-download"/></svg>Download file</button>' +
              '<button data-act="log"><svg class="icon"><use href="#icon-eye"/></svg>View log</button>' +
              '<button data-act="delete" class="danger"><svg class="icon"><use href="#icon-trash"/></svg>Delete</button>' +
            '</div>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function newCard() {
    return '<div class="bulk-card new">' +
      '<span class="bulk-avatar"><svg class="icon"><use href="#icon-plus"/></svg></span>' +
      '<div class="bulk-body">' +
        '<div class="bulk-owner">First Name Last Name</div>' +
        '<div class="bulk-line"><svg class="icon"><use href="#icon-file"/></svg>' +
          'File: <b>NewFileName.txt</b></div>' +
        '<div class="bulk-line"><svg class="icon"><use href="#icon-clock"/></svg>Requested:</div>' +
        '<div class="bulk-line"><svg class="icon"><use href="#icon-check-circle"/></svg>Completed:</div>' +
        '<div class="bulk-chips">' +
          '<button class="bulk-chip" id="createBtn">Create new request</button>' +
        '</div>' +
        '<div class="bulk-chips">' +
          '<span class="bulk-actions-wrap">' +
            '<button class="bulk-chip actions-toggle">&#9662;Actions</button>' +
            '<div class="bulk-menu" hidden>' +
              '<button data-act="template"><svg class="icon"><use href="#icon-download"/></svg>Download template</button>' +
              '<button data-act="import"><svg class="icon"><use href="#icon-upload"/></svg>Import file</button>' +
            '</div>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function render() {
    const rows = visibleRows();
    strip.innerHTML = newCard() +
      rows.map(r => card(r, requests.indexOf(r))).join('') +
      (rows.length === 0
        ? '<div class="bulk-empty"><svg class="icon"><use href="#icon-inbox"/></svg>' +
          '<div>No bulk requests match these filters</div></div>'
        : '');
  }

  /* ---------- Card interactions ---------- */
  strip.addEventListener('click', (e) => {
    /* Actions dropdown */
    const toggle = e.target.closest('.actions-toggle');
    if (toggle) {
      e.stopPropagation();
      const menu = toggle.nextElementSibling;
      const wasHidden = menu.hidden;
      document.querySelectorAll('.bulk-menu').forEach(m => { m.hidden = true; });
      menu.hidden = !wasHidden;
      return;
    }

    if (e.target.closest('#createBtn')) {
      const profile = prompt('Profile for the new request:', 'Agent Create');
      if (!profile || !profile.trim()) return;
      requests.unshift({
        owner: 'Administrator', file: '', profile: profile.trim(), platform: 'UCCE',
        requested: 'Today', completed: '', status: 'waiting'
      });
      render();
      return;
    }

    const action = e.target.closest('.bulk-menu button');
    if (!action) return;

    const cardEl = action.closest('.bulk-card');
    const req = cardEl.dataset.index ? requests[cardEl.dataset.index] : null;
    document.querySelectorAll('.bulk-menu').forEach(m => { m.hidden = true; });

    switch (action.dataset.act) {
      case 'template':
        download('bulk_request_template.csv',
          'Username,First Name,Last Name,Team,Skill,Platform\n');
        break;
      case 'import':
      case 'upload': {
        const file = prompt('File name to upload:', 'bulk_upload.csv');
        if (file && file.trim() && req) {
          req.file = file.trim();
          req.status = 'running';
          render();
        }
        break;
      }
      case 'download':
        if (!req.file) {
          alert('No file has been uploaded for this request yet.');
          break;
        }
        download(req.file, 'Bulk request file: ' + req.file + '\n');
        break;
      case 'log':
        alert(req.owner + ' — ' + req.profile + '\n\n' +
              'Platform: ' + req.platform + '\n' +
              'Status: ' + STATUS_LABEL[req.status] + '\n' +
              'Requested: ' + req.requested + '\n' +
              'Completed: ' + (req.completed || 'not completed'));
        break;
      case 'delete':
        if (confirm('Delete this bulk request?')) {
          requests.splice(requests.indexOf(req), 1);
          render();
        }
        break;
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.bulk-menu').forEach(m => { m.hidden = true; });
  });

  function download(name, content) {
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------- Filters ---------- */
  document.getElementById('profileFilter').addEventListener('change', (e) => {
    filters.profile = e.target.value;
    render();
  });

  document.getElementById('platformFilter').addEventListener('change', (e) => {
    filters.platform = e.target.value;
    render();
  });

  document.getElementById('statusFilter').addEventListener('change', (e) => {
    filters.status = e.target.value;
    render();
  });

  document.getElementById('searchFilter').addEventListener('input', (e) => {
    filters.search = e.target.value.trim().toLowerCase();
    render();
  });

  /* ---------- Purge schedule ---------- */
  document.getElementById('purgeBtn').addEventListener('click', () => {
    const done = requests.filter(r => r.status === 'complete').length;
    if (done === 0) {
      alert('There are no completed requests to purge.');
      return;
    }
    if (confirm('Purge ' + done + ' completed request(s) from the schedule?')) {
      for (let i = requests.length - 1; i >= 0; i--) {
        if (requests[i].status === 'complete') requests.splice(i, 1);
      }
      render();
    }
  });

  render();
});
