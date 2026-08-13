document.addEventListener('DOMContentLoaded', () => {

  const STATUS_ITEMS = [
    { name: 'API Gateway', sub: 'Operational' },
    { name: 'Telephony Gateway', sub: 'Operational' },
    { name: 'Database Cluster', sub: 'Operational' },
    { name: 'Reporting Service', sub: 'Operational' }
  ];

  document.getElementById('supportStatusRow').innerHTML = STATUS_ITEMS.map(s =>
    '<div class="support-status-card">' +
    '<span class="support-status-dot"></span>' +
    '<div><div class="support-status-name">' + s.name + '</div><div class="support-status-sub">' + s.sub + '</div></div>' +
    '</div>'
  ).join('');

  const FAQS = [
    { q: 'How do I reset an agent\'s password?', a: 'Go to Users, locate the agent, and click the Reset Password icon in the row actions. A temporary password will be generated and can be shared securely with the agent.' },
    { q: 'Why is a schedule showing "completed with failures"?', a: 'Open the schedule\'s audit log from the Schedules page to see which step failed. Common causes include an expired campaign or a missing skill assignment.' },
    { q: 'How do I add a new skill to multiple agents at once?', a: 'Use the Skill to Agent page under Skills. Select the skill on the left, then move the desired agents into the assigned pane and save.' },
    { q: 'Where can I see a full history of changes made in the portal?', a: 'The System Wide Audit page under Administration lists every change across Users, Skills, Schedules, Campaigns, and Security, with filters by module, user, and date.' },
    { q: 'How do I request access to a new feature or module?', a: 'Submit a support ticket using the form on this page with priority set to Medium or higher, and the platform team will follow up.' }
  ];

  document.getElementById('faqList').innerHTML = FAQS.map((f, i) =>
    '<div class="faq-item" data-i="' + i + '">' +
    '<button class="faq-q">' + f.q + '<svg class="icon"><use href="#icon-caret"/></svg></button>' +
    '<div class="faq-a">' + f.a + '</div>' +
    '</div>'
  ).join('');

  document.getElementById('faqList').addEventListener('click', (e) => {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    q.closest('.faq-item').classList.toggle('open');
  });

  document.getElementById('supportSubmitBtn').addEventListener('click', () => {
    const subject = document.getElementById('supportSubject');
    if (!subject.value.trim()) {
      subject.focus();
      return;
    }
    const ticketNum = Math.floor(1000 + (subject.value.length * 37 + document.getElementById('supportDesc').value.length * 13) % 9000);
    document.getElementById('ticketNum').textContent = ticketNum;
    document.getElementById('supportConfirm').classList.add('show');
    subject.value = '';
    document.getElementById('supportDesc').value = '';
    document.getElementById('supportPriority').value = 'High';
  });

  document.getElementById('diagReportLink').addEventListener('click', (e) => {
    e.preventDefault();
    const win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to generate a report.'); return; }
    win.document.write(
      '<html><head><title>Diagnostic Report</title><style>' +
      'body{font-family:Segoe UI,Arial,sans-serif;padding:24px;color:#333}' +
      'h1{font-size:18px;margin-bottom:2px}p{color:#777;font-size:12px;margin-top:0}' +
      'table{border-collapse:collapse;width:100%;margin-top:16px}' +
      'th,td{border:1px solid #ddd;padding:8px 10px;font-size:12.5px;text-align:left}' +
      'th{background:#f4f5f7}</style></head><body>' +
      '<h1>System Diagnostic Report</h1>' +
      '<p>Generated ' + new Date().toLocaleString() + '</p>' +
      '<table><thead><tr><th>Service</th><th>Status</th></tr></thead><tbody>' +
      STATUS_ITEMS.map(s => '<tr><td>' + s.name + '</td><td>' + s.sub + '</td></tr>').join('') +
      '</tbody></table></body></html>'
    );
    win.document.close();
    win.focus();
    win.print();
  });

});
