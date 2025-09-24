document.addEventListener('DOMContentLoaded', async () => {
  const leaveContainer = document.getElementById('leave-container');
  const backBtn = document.getElementById('back-btn');

  backBtn.addEventListener('click', () => {
    window.location.href = '/dashboard';
  });

  try {
    const res = await fetch('/leaveRequests', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch leave requests');
    
    const leaves = await res.json();
    console.log(leaves);

    if (leaves.length === 0) {
      leaveContainer.innerHTML = '<p>No leave requests.</p>';
      return;
    }

    leaves.forEach(leave => {
      const card = document.createElement('div');
      card.className = 'leave-card';
      card.innerHTML = `
        <p><strong>Email:</strong> ${leave.email}</p>
        <p><strong>From:</strong> ${leave.fromDate}</p>
        <p><strong>To:</strong> ${leave.toDate}</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>
      `;

      const approveBtn = document.createElement('button');
      approveBtn.className = 'btn-approve';
      approveBtn.textContent = 'Approve';
      approveBtn.addEventListener('click', async () => {
        await handleLeaveStatus('/statusAprove', leave._id,leave.email);
      });

      const rejectBtn = document.createElement('button');
      rejectBtn.className = 'btn-reject';
      rejectBtn.textContent = 'Reject';
      rejectBtn.addEventListener('click', async () => {
        await handleLeaveStatus('/statusReject', leave._id,leave.email);
      });

      card.appendChild(approveBtn);
      card.appendChild(rejectBtn);
      leaveContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Error:', err);
    leaveContainer.innerHTML = '<p>Error loading leave requests.</p>';
  }
});

async function handleLeaveStatus(url, id, email) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Server error');
        const data = await res.json();
        console.log(data.status);
    alert(`${url.includes('Aprove') ? 'Approved' : 'Rejected'} leave for ${email}`);
   
    if(data.status === 'Approved'){
      const url = `/adjustment?id=${encodeURIComponent(id)}`;
      window.location.href = url;
      return;
    }
    location.reload();
  } catch (err) {
    console.error(err);
    alert('Action failed');

  }
}
