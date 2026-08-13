document.addEventListener('DOMContentLoaded', () => {
  const flows = [
    {
      name: 'Cumulus_Main_IVR', status: 'live', modified: '12 Apr 2022',
      nodes: [
        { type: 'start', icon: 'icon-play',      title: 'Incoming Call',    sub: 'Dialed number 1800-CUMULUS', kind: 'Start',
          props: { 'Entry point': '1800-CUMULUS', 'Media type': 'Voice', 'Business hours': 'Mon-Fri 09:00-18:00' } },
        { type: 'node',  icon: 'icon-audio',     title: 'Play Welcome',     sub: 'welcome_greeting.wav', kind: 'Prompt',
          props: { 'Audio file': 'welcome_greeting.wav', 'Interruptible': 'Yes', 'Repeat': '1' } },
        { type: 'node',  icon: 'icon-menu-node', title: 'Main Menu',        sub: '1 Sales · 2 Support · 3 Billing', kind: 'Menu',
          props: { 'Prompt': 'menu_main.wav', 'Timeout': '5 sec', 'Max retries': '3', 'No input action': 'Repeat menu' } },
        { type: 'node',  icon: 'icon-queue',     title: 'Queue to Skill',   sub: 'Precision queue CumulusInbound', kind: 'Queue',
          props: { 'Queue': 'CumulusInbound', 'Priority': 'Normal', 'Overflow after': '120 sec', 'Music': 'hold_music.wav' } },
        { type: 'end',   icon: 'icon-stop-circle', title: 'Disconnect',     sub: 'goodbye.wav then hang up', kind: 'End',
          props: { 'Audio file': 'goodbye.wav', 'Survey': 'Enabled', 'Reason': 'Normal clearing' } }
      ]
    },
    {
      name: 'Cumulus_Sales_Flow', status: 'live', modified: '11 Apr 2022',
      nodes: [
        { type: 'start', icon: 'icon-play',   title: 'Sales Entry',   sub: 'From main menu option 1', kind: 'Start',
          props: { 'Entry point': 'Main menu · 1', 'Media type': 'Voice' } },
        { type: 'node',  icon: 'icon-audio',  title: 'Play Sales Prompt', sub: 'menu_sales.wav', kind: 'Prompt',
          props: { 'Audio file': 'menu_sales.wav', 'Interruptible': 'Yes' } },
        { type: 'node',  icon: 'icon-queue',  title: 'Queue to Sales', sub: 'Precision queue CumulusOutbound', kind: 'Queue',
          props: { 'Queue': 'CumulusOutbound', 'Priority': 'High', 'Overflow after': '90 sec' } },
        { type: 'end',   icon: 'icon-stop-circle', title: 'End Call', sub: 'Wrap up and disconnect', kind: 'End',
          props: { 'Wrap-up': '30 sec', 'Reason': 'Normal clearing' } }
      ]
    },
    {
      name: 'Cumulus_Support_Flow', status: 'live', modified: '11 Apr 2022',
      nodes: [
        { type: 'start', icon: 'icon-play',   title: 'Support Entry', sub: 'From main menu option 2', kind: 'Start',
          props: { 'Entry point': 'Main menu · 2', 'Media type': 'Voice' } },
        { type: 'node',  icon: 'icon-menu-node', title: 'Priority Check', sub: 'Premium or standard customer', kind: 'Decision',
          props: { 'Condition': 'CustomerTier == Premium', 'True branch': 'Premium queue', 'False branch': 'Standard queue' } },
        { type: 'node',  icon: 'icon-queue',  title: 'Queue to Support', sub: 'Precision queue CumulusHealthCare', kind: 'Queue',
          props: { 'Queue': 'CumulusHealthCare', 'Priority': 'Normal', 'Overflow after': '150 sec' } },
        { type: 'end',   icon: 'icon-stop-circle', title: 'End Call', sub: 'Survey then disconnect', kind: 'End',
          props: { 'Survey': 'Enabled', 'Reason': 'Normal clearing' } }
      ]
    },
    {
      name: 'Cumulus_Callback', status: 'testing', modified: '08 Apr 2022',
      nodes: [
        { type: 'start', icon: 'icon-play',  title: 'Callback Offer', sub: 'Triggered when wait > 3 min', kind: 'Start',
          props: { 'Trigger': 'Estimated wait > 180 sec', 'Media type': 'Voice' } },
        { type: 'node',  icon: 'icon-audio', title: 'Offer Callback', sub: 'callback_offer.wav', kind: 'Prompt',
          props: { 'Audio file': 'callback_offer.wav', 'Interruptible': 'Yes' } },
        { type: 'node',  icon: 'icon-phone', title: 'Collect Number', sub: 'Confirm caller ID or enter new', kind: 'Input',
          props: { 'Min digits': '10', 'Max digits': '12', 'Timeout': '10 sec' } },
        { type: 'end',   icon: 'icon-check-circle', title: 'Callback Booked', sub: 'Queued for the next free agent', kind: 'End',
          props: { 'Queue': 'CumulusInbound', 'Retries': '3', 'Retry gap': '15 min' } }
      ]
    },
    {
      name: 'Cumulus_After_Hours', status: 'draft', modified: '01 Apr 2022',
      nodes: [
        { type: 'start', icon: 'icon-clock', title: 'Out of Hours', sub: 'Outside business hours', kind: 'Start',
          props: { 'Schedule': 'Mon-Fri 18:00-09:00', 'Media type': 'Voice' } },
        { type: 'node',  icon: 'icon-audio', title: 'Play Closed Message', sub: 'after_hours.wav', kind: 'Prompt',
          props: { 'Audio file': 'after_hours.wav', 'Interruptible': 'No' } },
        { type: 'end',   icon: 'icon-stop-circle', title: 'Disconnect', sub: 'Hang up after message', kind: 'End',
          props: { 'Reason': 'Out of hours' } }
      ]
    },
    {
      name: 'Cumulus_Email_Routing', status: 'draft', modified: '25 Mar 2022',
      nodes: [
        { type: 'start', icon: 'icon-mail',  title: 'Inbound Email', sub: 'support@cumulus.example', kind: 'Start',
          props: { 'Mailbox': 'support@cumulus.example', 'Media type': 'Email' } },
        { type: 'node',  icon: 'icon-menu-node', title: 'Classify Subject', sub: 'Keyword based routing', kind: 'Decision',
          props: { 'Rules': '4', 'Default branch': 'General queue' } },
        { type: 'end',   icon: 'icon-check-circle', title: 'Assign to Queue', sub: 'Precision queue CumulusEmail', kind: 'End',
          props: { 'Queue': 'CumulusEmail', 'SLA': '4 hours' } }
      ]
    }
  ];

  const listEl = document.getElementById('flowList');
  const canvas = document.getElementById('canvas');
  const propsEl = document.getElementById('props');
  let selFlow = flows[0];
  let selNode = 0;
  let filter = '';

  const STATUS = { live: 'Live', draft: 'Draft', testing: 'Testing' };

  function renderList() {
    const rows = flows.filter(f => f.name.toLowerCase().includes(filter));
    listEl.innerHTML = '';
    rows.forEach(f => {
      const li = document.createElement('li');
      li.dataset.name = f.name;
      if (f === selFlow) li.classList.add('selected');
      li.innerHTML =
        '<span class="dz-flow-name">' + f.name + '</span>' +
        '<span class="dz-flow-meta">' +
          '<span class="im-tag ' + f.status + '">' + STATUS[f.status] + '</span>' +
          '<span>' + f.nodes.length + ' nodes</span>' +
          '<span>' + f.modified + '</span>' +
        '</span>';
      listEl.appendChild(li);
    });
    document.getElementById('flowCount').textContent = rows.length;
  }

  function renderCanvas() {
    document.getElementById('canvasTitle').textContent = selFlow.name;
    document.getElementById('nodeCount').textContent = selFlow.nodes.length + ' nodes';

    canvas.innerHTML = '';
    selFlow.nodes.forEach((n, i) => {
      if (i > 0) {
        const line = document.createElement('div');
        line.className = 'dz-connector';
        canvas.appendChild(line);
      }
      const node = document.createElement('button');
      node.className = 'dz-node ' + n.type + (i === selNode ? ' selected' : '');
      node.dataset.index = i;
      node.innerHTML =
        '<span class="dz-node-icon"><svg class="icon"><use href="#' + n.icon + '"/></svg></span>' +
        '<span class="dz-node-text">' +
          '<span class="dz-node-title">' + n.title + '</span>' +
          '<span class="dz-node-sub">' + n.sub + '</span>' +
        '</span>' +
        '<span class="dz-node-type">' + n.kind + '</span>';
      canvas.appendChild(node);
    });
  }

  function renderProps() {
    const n = selFlow.nodes[selNode];
    propsEl.innerHTML =
      '<div class="dz-prop-row"><span class="dz-prop-label">Node</span>' +
        '<span class="dz-prop-value">' + n.title + '</span></div>' +
      '<div class="dz-prop-row"><span class="dz-prop-label">Type</span>' +
        '<span class="dz-prop-value">' + n.kind + '</span></div>' +
      Object.keys(n.props).map(k =>
        '<div class="dz-prop-row"><span class="dz-prop-label">' + k + '</span>' +
        '<span class="dz-prop-value">' + n.props[k] + '</span></div>').join('');
  }

  function render() {
    renderList();
    renderCanvas();
    renderProps();
  }

  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    selFlow = flows.find(f => f.name === li.dataset.name);
    selNode = 0;
    render();
  });

  canvas.addEventListener('click', (e) => {
    const node = e.target.closest('.dz-node');
    if (!node) return;
    selNode = Number(node.dataset.index);
    render();
  });

  document.getElementById('flowSearch').addEventListener('input', (e) => {
    filter = e.target.value.trim().toLowerCase();
    renderList();
  });

  document.getElementById('newFlowBtn').addEventListener('click', () => {
    const name = prompt('New flow name:');
    if (!name || !name.trim()) return;
    const flow = {
      name: name.trim(), status: 'draft', modified: 'Today',
      nodes: [
        { type: 'start', icon: 'icon-play', title: 'Start', sub: 'Entry point not configured', kind: 'Start',
          props: { 'Entry point': 'Not set', 'Media type': 'Voice' } },
        { type: 'end', icon: 'icon-stop-circle', title: 'End', sub: 'Disconnect', kind: 'End',
          props: { 'Reason': 'Normal clearing' } }
      ]
    };
    flows.unshift(flow);
    selFlow = flow;
    selNode = 0;
    render();
  });

  document.getElementById('publishBtn').addEventListener('click', () => {
    if (selFlow.status === 'live') {
      alert(selFlow.name + ' is already live.');
      return;
    }
    if (confirm('Publish "' + selFlow.name + '" to production?')) {
      selFlow.status = 'live';
      selFlow.modified = 'Today';
      render();
    }
  });

  render();
});
