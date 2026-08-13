document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Data ---------- */
  const step = (attr, desc, value, wait, agents) => ({
    attribute: attr,
    description: desc,
    type: 'Boolean',
    value: value,
    wait: wait,
    agents: agents
  });

  const queues = [
    { name: 'CumulusCB',           description: 'Cumulus Call Back',            agents: 3, steps: [step('CumulusCB', 'Cumulus Call Back', 'true', 'N/A', 3)] },
    { name: 'CumulusCertification', description: 'Cumulus Certification',        agents: 2, steps: [step('CumulusCertification', 'Cumulus Certification', 'true', 'N/A', 2)] },
    { name: 'CumulusChat',         description: 'Cumulus Chat Queue',            agents: 6, steps: [step('CumulusChat', 'Cumulus Chat', 'true', 'N/A', 6), step('CumulusChat', 'Cumulus Chat', 'false', '30', 8)] },
    { name: 'CumulusChatEnglish',  description: 'Cumulus Chat English',          agents: 4, steps: [step('CumulusChatEnglish', 'Cumulus Chat English', 'true', 'N/A', 4)] },
    { name: 'CumulusChatItalian',  description: 'Cumulus Chat Italian',          agents: 2, steps: [step('CumulusChatItalian', 'Cumulus Chat Italian', 'true', 'N/A', 2)] },
    { name: 'CumulusChatSpanish',  description: 'Cumulus Chat Spanish',          agents: 3, steps: [step('CumulusChatSpanish', 'Cumulus Chat Spanish', 'true', 'N/A', 3)] },
    { name: 'CumulusCity',         description: 'Cumulus City Call Generator',   agents: 4, steps: [step('CumulusCity', 'Cumulus City', 'true', 'N/A', 4)] },
    { name: 'CumulusEmail',        description: 'Cumulus Email Queue',           agents: 5, steps: [step('CumulusEmail', 'Cumulus Email', 'true', 'N/A', 5)] },
    { name: 'CumulusFinance',      description: 'Cumulus Finance Department',    agents: 7, steps: [step('CumulusFinance', 'Cumulus Finance', 'true', 'N/A', 7), step('CumulusFinance', 'Cumulus Finance', 'false', '45', 12)] },
    { name: 'CumulusHealthCare',   description: 'Cumulus Health Care',           agents: 6, steps: [step('CumulusHealthCare', 'Cumulus Health Care', 'true', 'N/A', 6)] },
    { name: 'CumulusInbound',      description: 'Cumulus Inbound Voice',         agents: 9, steps: [step('CumulusInbound', 'Cumulus Inbound', 'true', 'N/A', 9)] },
    { name: 'CumulusOutbound',     description: 'Cumulus Outbound Voice',        agents: 8, steps: [step('CumulusOutbound', 'Cumulus Outbound', 'true', 'N/A', 8)] },
    { name: 'CumulusRLM',          description: 'Cumulus Remote Location Mgmt',  agents: 2, steps: [step('CumulusRLM', 'Cumulus RLM', 'true', 'N/A', 2)] },
    { name: 'CumulusTask',         description: 'Cumulus Task Routing',          agents: 4, steps: [step('CumulusTask', 'Cumulus Task', 'true', 'N/A', 4)] },
    { name: 'CumulusTravel',       description: 'Cumulus Travel Desk',           agents: 5, steps: [step('CumulusTravel', 'Cumulus Travel', 'true', 'N/A', 5)] },
    { name: 'CumulusUtility',      description: 'Cumulus Utility Services',      agents: 3, steps: [step('CumulusUtility', 'Cumulus Utility', 'true', 'N/A', 3)] },
    { name: 'CumulusUWF',          description: 'Cumulus Universal Work Flow',   agents: 4, steps: [step('CumulusUWF', 'Cumulus UWF', 'true', 'N/A', 4)] },
    { name: 'CumulusVIVR',         description: 'Cumulus Video IVR',             agents: 2, steps: [step('CumulusVIVR', 'Cumulus VIVR', 'true', 'N/A', 2)] }
  ];

  const listEl = document.getElementById('queueList');
  const emptyEl = document.getElementById('queueEmpty');
  const searchEl = document.getElementById('queueSearch');
  const stepsEl = document.getElementById('pqSteps');

  let selected = queues.find(q => q.name === 'CumulusCity');

  /* ---------- Queue list ---------- */
  function renderList() {
    const term = searchEl.value.trim().toLowerCase();
    const rows = queues.filter(q => q.name.toLowerCase().includes(term));

    listEl.innerHTML = '';
    rows.forEach(q => {
      const li = document.createElement('li');
      li.dataset.name = q.name;
      li.innerHTML = '<span>' + q.name + '</span>' +
                     '<span class="pq-agent-pill" title="Agents">' + q.agents + '</span>';
      if (selected && q.name === selected.name) li.classList.add('selected');
      listEl.appendChild(li);
    });

    document.getElementById('queueCount').textContent = rows.length;
    emptyEl.hidden = rows.length > 0;
  }

  /* ---------- Detail + steps ---------- */
  function renderDetail() {
    if (!selected) return;
    document.getElementById('pqName').textContent = selected.name;
    document.getElementById('pqDescription').textContent = selected.description;
    document.getElementById('pqAgents').textContent = selected.agents;
    document.getElementById('pqStepCount').textContent = selected.steps.length;

    stepsEl.innerHTML = '';
    selected.steps.forEach((s, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'pq-step' + (idx === 0 ? '' : ' collapsed');
      wrap.innerHTML =
        '<button class="pq-step-header">' +
          '<span class="pq-step-toggle"><svg class="icon"><use href="#icon-caret"/></svg></span>' +
          '<span>Step ' + (idx + 1) + '</span>' +
          '<span class="pq-step-agents">' + s.agents + ' agents</span>' +
        '</button>' +
        '<div class="pq-step-body">' +
          '<div class="pq-criteria-row">' +
            '<span class="pq-criteria"><span>Criteria</span><span class="pq-expr">(<b>' + s.attribute +
              '</b> == <span class="val">' + s.value + '</span>)</span></span>' +
            '<span class="pq-criteria"><span>Wait Time</span><input class="pq-wait" value="' + s.wait + '" readonly></span>' +
            '<span class="pq-criteria"><span># of Agents</span><b>' + s.agents + '</b></span>' +
          '</div>' +
          '<div class="pq-attrs-wrap"><table class="pq-attrs">' +
            '<thead><tr><th>Attribute</th><th>Description</th><th>Type</th><th>Attribute Value</th></tr></thead>' +
            '<tbody><tr>' +
              '<td>' + s.attribute + '</td>' +
              '<td>' + s.description + '</td>' +
              '<td><span class="pq-type-tag">' + s.type + '</span></td>' +
              '<td><select class="pq-attr-select">' +
                '<option' + (s.value === 'true' ? ' selected' : '') + '>true</option>' +
                '<option' + (s.value === 'false' ? ' selected' : '') + '>false</option>' +
              '</select></td>' +
            '</tr></tbody>' +
          '</table></div>' +
        '</div>';
      stepsEl.appendChild(wrap);
    });
  }

  /* ---------- Interactions ---------- */
  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    selected = queues.find(q => q.name === li.dataset.name);
    renderList();
    renderDetail();
  });

  searchEl.addEventListener('input', renderList);

  /* Click a step header -> that step's section opens / closes */
  stepsEl.addEventListener('click', (e) => {
    const header = e.target.closest('.pq-step-header');
    if (!header) return;
    header.closest('.pq-step').classList.toggle('collapsed');
  });

  function setAll(collapsed) {
    stepsEl.querySelectorAll('.pq-step').forEach(box => {
      box.classList.toggle('collapsed', collapsed);
    });
  }

  document.getElementById('expandAll').addEventListener('click', () => setAll(false));
  document.getElementById('collapseAll').addEventListener('click', () => setAll(true));

  renderList();
  renderDetail();
});
