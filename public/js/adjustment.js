// document.addEventListener('DOMContentLoaded', async () => {
//   const container = document.getElementById('request-container');
//   const res = await fetch('/adjustments');
//   const requests = await res.json();

//   requests.forEach(req => {
//     const box = document.createElement('div');
//     box.className = 'adjustment-box';
//     box.innerHTML = `
//       <p><strong>Subject:</strong> ${req.subject}</p>
//       <p><strong>Time:</strong> ${req.starttime} - ${req.endtime}</p>
//       <p><strong>Replacing:</strong> ${req.replacingTeacher}</p>
//       <textarea placeholder="Reason (if rejecting)" id="reason-${req._id}"></textarea>
//       <button onclick="respond('${req._id}', 'ACCEPTED')">Accept</button>
//       <button onclick="respond('${req._id}', 'REJECTED')">Reject</button>
//     `;
//     container.appendChild(box);
//   });
// // });

// async function respond(id, status) {
//   const reason = document.getElementById(`reason-${id}`).value;

//   const res = await fetch('/respondAdjustment', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ id, status, reason })
//   });

//   const result = await res.json();
//   alert(result.message);
//   location.reload();
// }
