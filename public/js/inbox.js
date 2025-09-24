

document.addEventListener('DOMContentLoaded', async () => {

    const back = document.getElementById('back');
    back.addEventListener('click',()=>{
        window.location.href='/teacherpage';
    })
  try {
    const res = await fetch('/myLeaveRequests', { method: 'GET',credentials:'include' });
    const data = await res.json();

    const list = document.getElementById('leave-list');

    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = '<p>No leave requests found.</p>';
      return;
    }

    data.forEach(leave => {
      const card = document.createElement('div');
      card.className = 'leave-card';

      card.innerHTML = `
      <p><strong>Email:</strong> ${leave.email}</p>
        <p><strong>From:</strong> ${leave.fromDate}</p>
        <p><strong>To:</strong> ${leave.toDate}</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>
        <p><strong>Status:</strong> <span class="${leave.status.toLowerCase()}">${leave.status}</span></p>
      `;

      list.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load leaves:', err);
    document.getElementById('leave-list').innerHTML = '<p>Error loading leaves.</p>';
  }
});
