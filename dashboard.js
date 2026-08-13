document.addEventListener('DOMContentLoaded', () => {

  /* ================= Data ================= */

  const AVATAR_COLORS = ['#049fd9', '#2e7d4a', '#a86a12', '#c9484f', '#7b5fc4', '#0a7ba8'];
  function avatarColor(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }
  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  const KPIS = [
    {
      label: 'Total Interactions Today', value: '1,842', icon: 'icon-phone2', color: 'blue',
      trend: '+12.4%', up: true, spark: [12, 18, 14, 22, 19, 27, 24, 31, 28, 36, 33, 42]
    },
    {
      label: 'Active Agents', value: '9 / 11', icon: 'icon-users', color: 'green',
      trend: '+2', up: true, spark: [6, 7, 7, 8, 7, 8, 9, 8, 9, 9, 8, 9]
    },
    {
      label: 'Avg Handle Time', value: '4m 12s', icon: 'icon-clock', color: 'orange',
      trend: '-8.3%', up: true, spark: [5.6, 5.4, 5.1, 5.2, 4.9, 4.7, 4.8, 4.5, 4.4, 4.3, 4.2, 4.1]
    },
    {
      label: 'SLA Compliance', value: '96.4%', icon: 'icon-shield-check', color: 'green',
      trend: '+1.8%', up: true, spark: [90, 91, 92, 91, 93, 94, 93, 95, 94, 96, 95, 96]
    }
  ];

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const VOLUME = [1120, 1240, 1180, 1360, 1510, 1430, 1600, 1720, 1650, 1780, 1690, 1842];

  const UTILIZATION = [
    { team: 'A_Sales', pct: 88 },
    { team: 'CumulusMain', pct: 74 },
    { team: 'CumulusCallGen', pct: 65 },
    { team: 'CumulusOutbound', pct: 79 },
    { team: 'CumulusUWF', pct: 58 }
  ];

  const CHANNEL_MIX = [
    { label: 'Voice', pct: 52, color: '#049fd9' },
    { label: 'Chat', pct: 24, color: '#2e7d4a' },
    { label: 'Email', pct: 14, color: '#f5a623' },
    { label: 'SMS', pct: 6, color: '#7b5fc4' },
    { label: 'Facebook', pct: 4, color: '#c9484f' }
  ];

  const ACTIVITY = [
    { icon: 'icon-login', color: 'green', text: '<b>rbarrows</b> logged in to Finesse Desktop', time: '2 min ago' },
    { icon: 'icon-megaphone', color: 'blue', text: 'Campaign <b>CumulusOutboundAgent</b> started', time: '18 min ago' },
    { icon: 'icon-target', color: 'blue', text: 'Skill <b>A_Sales</b> assigned to 2 agents', time: '34 min ago' },
    { icon: 'icon-warning', color: 'red', text: 'Schedule <b>Friday_Rush</b> completed with failures', time: '1h ago' },
    { icon: 'icon-check-circle', color: 'green', text: '<b>csupervisor</b> resolved escalation #4821', time: '2h ago' },
    { icon: 'icon-user-plus2', color: 'blue', text: 'New agent <b>Jane Doe</b> onboarded', time: '3h ago' },
    { icon: 'icon-warning', color: 'orange', text: 'SLA breach on <b>CumulusHealthCare</b> queue', time: '5h ago' }
  ];

  const PROGRESS = [
    { name: 'Q3 Cumulus Rollout', pct: 72, due: 'Due Aug 28', team: ['Rick Barrows', 'Sandra Jefferson', 'Cathy Supervisor'] },
    { name: 'Agent Onboarding Batch 12', pct: 45, due: 'Due Sep 05', team: ['Jane Doe', 'Josh Petreson'] },
    { name: 'IVR Redesign — CumulusMain', pct: 90, due: 'Due Aug 16', team: ['Andy MacDowell', 'Helen Liang', 'James Bracksted'] }
  ];

  const INTERACTIONS = [
    { id: 'INT-10482', agent: 'Rick Barrows', channel: 'Voice', status: 'resolved', duration: '6m 12s', date: 'Today' },
    { id: 'INT-10481', agent: 'Cathy Supervisor', channel: 'Chat', status: 'escalated', duration: '12m 40s', date: 'Today' },
    { id: 'INT-10480', agent: 'Helen Liang', channel: 'Email', status: 'progress', duration: '2m 05s', date: 'Today' },
    { id: 'INT-10479', agent: 'James Bracksted', channel: 'Voice', status: 'resolved', duration: '4m 33s', date: 'Today' },
    { id: 'INT-10478', agent: 'Annika Hamilton', channel: 'SMS', status: 'resolved', duration: '1m 58s', date: 'Yesterday' },
    { id: 'INT-10477', agent: 'Beacham Brown', channel: 'Facebook', status: 'escalated', duration: '9m 21s', date: 'Yesterday' }
  ];

  const CAL_EVENTS = { 13: 'blue', 14: 'blue', 20: 'orange', 25: 'green', 28: 'blue' };

  const STATUS_LABEL = { resolved: 'Resolved', progress: 'In Progress', escalated: 'Escalated' };
  const CHANNEL_ICON = { Voice: 'icon-phone2', Chat: 'icon-list', Email: 'icon-file', SMS: 'icon-list', Facebook: 'icon-megaphone' };

  /* ================= KPI cards ================= */

  function sparklineSvg(values, color) {
    const w = 70, h = 26, pad = 2;
    const min = Math.min(...values), max = Math.max(...values);
    const range = (max - min) || 1;
    const pts = values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return [x, y];
    });
    const line = pts.map(p => p.join(',')).join(' ');
    const area = 'M' + pts[0][0] + ',' + h + ' L' + line.split(' ').join(' L') + ' L' + pts[pts.length - 1][0] + ',' + h + ' Z';
    const gid = 'sg' + Math.round(min * 100 + max);
    return '<svg class="dash-kpi-spark" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.28"/>' +
      '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#' + gid + ')" stroke="none"/>' +
      '<polyline points="' + line + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  const COLOR_HEX = { blue: '#049fd9', green: '#2e7d4a', orange: '#a86a12', red: '#c9484f' };

  function renderKpis() {
    const wrap = document.getElementById('dashKpiRow');
    wrap.innerHTML = KPIS.map(k => {
      const trendIcon = k.up ? 'icon-trend-up' : 'icon-trend-down';
      const trendClass = k.up ? 'up' : 'down';
      return '<div class="dash-kpi-card">' +
        '<div class="dash-kpi-top">' +
        '<div class="dash-kpi-icon ' + k.color + '"><svg class="icon"><use href="#' + k.icon + '"/></svg></div>' +
        '<span class="dash-kpi-trend ' + trendClass + '"><svg class="icon"><use href="#' + trendIcon + '"/></svg>' + k.trend + '</span>' +
        '</div>' +
        '<div class="dash-kpi-mid">' +
        '<span class="dash-kpi-value">' + k.value + '</span>' +
        sparklineSvg(k.spark, COLOR_HEX[k.color]) +
        '</div>' +
        '<div class="dash-kpi-label">' + k.label + '</div>' +
        '</div>';
    }).join('');
  }

  /* ================= Line chart ================= */

  function renderLineChart() {
    const w = 520, h = 190, padL = 30, padR = 10, padT = 14, padB = 22;
    const min = 0, max = Math.max(...VOLUME) * 1.12;
    const innerW = w - padL - padR, innerH = h - padT - padB;
    const pts = VOLUME.map((v, i) => {
      const x = padL + (i / (VOLUME.length - 1)) * innerW;
      const y = padT + innerH - (v / max) * innerH;
      return [x, y];
    });
    const line = pts.map(p => p.join(',')).join(' ');
    const area = 'M' + pts[0][0] + ',' + (padT + innerH) + ' L' + line.split(' ').join(' L') + ' L' + pts[pts.length - 1][0] + ',' + (padT + innerH) + ' Z';

    let gridLines = '';
    for (let i = 0; i <= 3; i++) {
      const y = padT + (innerH / 3) * i;
      gridLines += '<line x1="' + padL + '" y1="' + y + '" x2="' + (w - padR) + '" y2="' + y + '" stroke="#f0f0f0" stroke-width="1"/>';
    }

    const dots = pts.map(p => '<circle class="dash-line-pt" cx="' + p[0] + '" cy="' + p[1] + '" r="2.6"/>').join('');
    const labels = MONTHS.map((m, i) => {
      if (i % 2 !== 0) return '';
      return '<text class="dash-line-axis-label" x="' + pts[i][0] + '" y="' + (h - 5) + '" text-anchor="middle">' + m + '</text>';
    }).join('');

    document.getElementById('dashLineChart').innerHTML =
      '<svg class="dash-line-chart" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">' +
      '<defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#049fd9" stop-opacity="0.22"/>' +
      '<stop offset="100%" stop-color="#049fd9" stop-opacity="0"/></linearGradient></defs>' +
      gridLines +
      '<path d="' + area + '" fill="url(#lineFill)" stroke="none"/>' +
      '<polyline points="' + line + '" fill="none" stroke="#049fd9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots + labels + '</svg>';
  }

  /* ================= Bar chart ================= */

  function renderBarChart() {
    const w = 260, h = 190, padL = 8, padR = 8, padT = 20, padB = 30;
    const innerW = w - padL - padR, innerH = h - padT - padB;
    const barGap = 10;
    const barW = (innerW - barGap * (UTILIZATION.length - 1)) / UTILIZATION.length;

    const bars = UTILIZATION.map((u, i) => {
      const x = padL + i * (barW + barGap);
      const barH = (u.pct / 100) * innerH;
      const y = padT + innerH - barH;
      const color = u.pct >= 80 ? '#2e7d4a' : (u.pct >= 60 ? '#049fd9' : '#f5a623');
      return '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + barH + '" rx="3" fill="' + color + '"/>' +
        '<text class="dash-bar-value-label" x="' + (x + barW / 2) + '" y="' + (y - 5) + '" text-anchor="middle">' + u.pct + '%</text>' +
        '<text class="dash-bar-axis-label" x="' + (x + barW / 2) + '" y="' + (h - 6) + '" text-anchor="middle">' + shortTeam(u.team) + '</text>';
    }).join('');

    document.getElementById('dashBarChart').innerHTML =
      '<svg class="dash-bar-chart" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">' +
      '<line x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (w - padR) + '" y2="' + (padT + innerH) + '" stroke="#e6e6e6"/>' +
      bars + '</svg>';
  }

  function shortTeam(t) {
    return t.replace('Cumulus', 'C.').replace('A_Sales', 'Sales');
  }

  /* ================= Donut chart ================= */

  function renderDonutChart() {
    const size = 120, r = 48, cx = size / 2, cy = size / 2, sw = 15;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const segs = CHANNEL_MIX.map(seg => {
      const len = (seg.pct / 100) * circ;
      const dash = len + ' ' + (circ - len);
      const el = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + seg.color + '" ' +
        'stroke-width="' + sw + '" stroke-dasharray="' + dash + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += len;
      return el;
    }).join('');

    const svg = '<svg class="dash-donut-chart" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#f2f2f2" stroke-width="' + sw + '"/>' +
      segs +
      '<text class="dash-donut-center-num" x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle">52%</text>' +
      '<text class="dash-donut-center-label" x="' + cx + '" y="' + (cy + 12) + '" text-anchor="middle">VOICE</text>' +
      '</svg>';

    const legend = CHANNEL_MIX.map(seg =>
      '<div class="dash-donut-legend-row"><span class="dash-donut-dot" style="background:' + seg.color + '"></span>' +
      seg.label + '<span class="pct">' + seg.pct + '%</span></div>'
    ).join('');

    document.getElementById('dashDonutChart').innerHTML =
      '<div class="dash-donut-wrap">' + svg + '<div class="dash-donut-legend">' + legend + '</div></div>';
  }

  /* ================= Activity ================= */

  function renderActivity() {
    document.getElementById('dashActivity').innerHTML = ACTIVITY.map(a =>
      '<div class="dash-activity-item">' +
      '<div class="dash-activity-dot ' + a.color + '"><svg class="icon"><use href="#' + a.icon + '"/></svg></div>' +
      '<div class="dash-activity-text">' + a.text + '<span class="dash-activity-time">' + a.time + '</span></div>' +
      '</div>'
    ).join('');
  }

  /* ================= Project progress ================= */

  function renderProgress() {
    document.getElementById('dashProgress').innerHTML = PROGRESS.map(p =>
      '<div class="dash-progress-item">' +
      '<div class="dash-progress-item-head">' +
      '<span class="dash-progress-name">' + p.name + '</span>' +
      '<span class="dash-progress-pct">' + p.pct + '%</span>' +
      '</div>' +
      '<div class="dash-progress-bar-track"><div class="dash-progress-bar-fill" style="width:' + p.pct + '%"></div></div>' +
      '<div class="dash-progress-foot">' +
      '<div class="dash-progress-avatars">' +
      p.team.map(n => '<span class="dash-avatar" style="background:' + avatarColor(n) + '" title="' + n + '">' + initials(n) + '</span>').join('') +
      '</div>' +
      '<span class="dash-progress-due">' + p.due + '</span>' +
      '</div>' +
      '</div>'
    ).join('');
  }

  /* ================= Interactions table ================= */

  function renderInteractions() {
    document.getElementById('dashOrdersBody').innerHTML = INTERACTIONS.map(r =>
      '<tr>' +
      '<td>' + r.id + '</td>' +
      '<td>' + r.agent + '</td>' +
      '<td><span class="dash-channel-cell"><svg class="icon"><use href="#' + (CHANNEL_ICON[r.channel] || 'icon-list') + '"/></svg>' + r.channel + '</span></td>' +
      '<td><span class="dash-status-pill ' + r.status + '">' + STATUS_LABEL[r.status] + '</span></td>' +
      '<td>' + r.duration + '</td>' +
      '<td>' + r.date + '</td>' +
      '<td><button class="dash-row-view-btn" title="View interaction"><svg class="icon"><use href="#icon-eye"/></svg></button></td>' +
      '</tr>'
    ).join('');
  }

  /* ================= Calendar ================= */

  const today = new Date();
  let calYear = today.getFullYear();
  let calMonth = today.getMonth();

  function renderCalendar() {
    const first = new Date(calYear, calMonth, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

    document.getElementById('dashCalTitle').textContent = MONTHS[calMonth] === undefined
      ? ''
      : first.toLocaleString('en-US', { month: 'long' }) + ' ' + calYear;

    const dow = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    let cells = dow.map(d => '<div class="dash-cal-dow">' + d + '</div>').join('');

    for (let i = 0; i < startDow; i++) {
      const d = daysInPrevMonth - startDow + i + 1;
      cells += '<div class="dash-cal-day other-month">' + d + '</div>';
    }

    const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth();
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === today.getDate();
      const evColor = isCurrentMonth ? CAL_EVENTS[d] : null;
      const dots = evColor ? '<span class="dash-cal-dots"><span class="dot dot-' + evColor + '"></span></span>' : '';
      cells += '<div class="dash-cal-day' + (isToday ? ' today' : '') + '">' + d + dots + '</div>';
    }

    const totalCells = startDow + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= trailing; d++) {
      cells += '<div class="dash-cal-day other-month">' + d + '</div>';
    }

    document.getElementById('dashCalGrid').innerHTML = cells;
  }

  document.getElementById('dashCalPrev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });

  document.getElementById('dashCalNext').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });

  /* ================= Quick actions ================= */

  function exportKpiCsv() {
    const csv = ['Metric,Value,Trend']
      .concat(KPIS.map(k => ['"' + k.label + '"', '"' + k.value + '"', k.trend].join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups to generate a report.');
      return;
    }
    const rowsHtml = KPIS.map(k => '<tr><td>' + k.label + '</td><td>' + k.value + '</td><td>' + k.trend + '</td></tr>').join('');
    win.document.write(
      '<html><head><title>Dashboard Report</title><style>' +
      'body{font-family:Segoe UI,Arial,sans-serif;padding:24px;color:#333}' +
      'h1{font-size:18px;margin-bottom:2px}p{color:#777;font-size:12px;margin-top:0}' +
      'table{border-collapse:collapse;width:100%;margin-top:16px}' +
      'th,td{border:1px solid #ddd;padding:8px 10px;font-size:12.5px;text-align:left}' +
      'th{background:#f4f5f7}</style></head><body>' +
      '<h1>Contact Center Dashboard Report</h1>' +
      '<p>Generated ' + new Date().toLocaleString() + '</p>' +
      '<table><thead><tr><th>Metric</th><th>Value</th><th>Trend</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>' +
      '</body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  }

  const QUICK_ACTIONS = [
    { label: 'Create Report', icon: 'icon-doc-report', run: printReport },
    { label: 'Add User', icon: 'icon-user-plus2', href: 'users.html' },
    { label: 'Export Data', icon: 'icon-download', run: exportKpiCsv },
    { label: 'New Campaign', icon: 'icon-megaphone', href: 'campaigns.html' }
  ];

  function renderQuickActions() {
    const wrap = document.getElementById('dashQuickActions');
    wrap.innerHTML = QUICK_ACTIONS.map((a, i) =>
      '<button type="button" class="dash-qa-btn" data-qa="' + i + '">' +
      '<span class="dash-qa-icon"><svg class="icon"><use href="#' + a.icon + '"/></svg></span>' +
      '<span class="dash-qa-label">' + a.label + '</span>' +
      '</button>'
    ).join('');
    wrap.querySelectorAll('.dash-qa-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = QUICK_ACTIONS[Number(btn.dataset.qa)];
        if (a.href) window.location.href = a.href;
        else if (a.run) a.run();
      });
    });
  }

  /* ================= Init ================= */

  renderKpis();
  renderLineChart();
  renderBarChart();
  renderDonutChart();
  renderActivity();
  renderProgress();
  renderInteractions();
  renderCalendar();
  renderQuickActions();

});
