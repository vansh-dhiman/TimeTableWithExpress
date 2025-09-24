   const Socket = io();

document.addEventListener('DOMContentLoaded', () => {
  
  const admin_message = document.getElementById('admin-message');
  const chatForm = document.getElementById('chatForm');
  const input = document.getElementById('teacher-input');

//  Load admin message
fetch('/getadminmessage')
  .then((res) => res.json())
  .then((data) => {

    if (data.adjustmentdata.length > 0) {
      for (let i = 0; i < data.adjustmentdata.length; i++) {
        const msg = data.adjustmentdata[i];
        const msg2 = data.adjustmentdata[i];

        const p = document.createElement('p');
        p.innerHTML = `
          Admin: Please confirm for 
          <strong>${msg.subject}</strong> <br>
          at <strong>${msg.lectureTime}</strong> <br>
          on <strong>${msg.day}</strong> in room <strong>${msg.room}</strong>
        `;
        admin_message.appendChild(p);
        let confirm = document.createElement('button');
        let reject = document.createElement('button');
        confirm.textContent = 'confirm';
        reject.textContent = 'reject';
        confirm.setAttribute('id','confirm');
        reject.setAttribute('id','reject');
        confirm.addEventListener('click',()=>{
              const msg = {status:"Confirmed!",
                          subject: msg2.subject,
                          lectureNo:msg2.lectureNo,
                          lecturetime: msg2.lectureTime,
                          day: msg2.day, 
                          room: msg2.room
                          };
                          // console.log(msg2.lectureNo);
              if(msg){
              let teacher_msg_div = document.createElement('div');
              teacher_msg_div.setAttribute('class','teacher-msg-div');
              teacher_msg_div.innerHTML = `Teacher: ${msg.status} ${msg.subject} at ${msg.lecturetime} on ${msg.day} in room ${msg.room}`;
              chat_div.appendChild(teacher_msg_div);
              Socket.emit('chatMessage',msg);
             }
        });
        reject.addEventListener('click',()=>{
           const msg = `Rejected!
                          ${msg2.subject}
                           at ${msg2.lectureTime}
                           on ${msg2.day} in room ${msg2.room}`;
              if(msg){
              let teacher_msg_div = document.createElement('div');
              teacher_msg_div.setAttribute('class','teacher-msg-div');
              teacher_msg_div.textContent = `Teacher: ${msg}`;
              chat_div.appendChild(teacher_msg_div);
              Socket.emit('chatMessage',msg);
             }
        })
                admin_message.appendChild(confirm);
                 admin_message.appendChild(reject);

      }
    } else {
      admin_message.textContent = "No adjustment data found.";
    }
  })
  .catch((err) => {
    console.error("Fetch error:", err);
    admin_message.textContent = "Error fetching data.";
  });


    // let teacher_message = document.getElementById('teacher-message');
  // Submit teacher message
  // chatForm.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   const messageInput = input.value.trim();

  //   if (!messageInput) return alert('Please enter a message');

  //   try {
  //     const res = await fetch('/sendTeachermsg', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ messageInput })
  //     });

  //     const result = await res.json();
  //     if (!res.ok) return alert('Error: ' + result.message);

  //     alert('Message sent!');
  //     teacher_message.textContent = input.value;
  //     input.value = '';
  //   } catch (err) {
  //     console.error('Send error:', err);
  //     alert('Message not sent due to server error');
  //   }
  // });

  // socket chat part   --------------------- socket ----- socket ------
  let chat_div = document.querySelector('.chatBox');
  const send = document.getElementById('submit');
  send.addEventListener('click',()=>{
    const input = document.getElementById('teacher-input');
    const msg = input.value.trim();
    if(msg){
      let teacher_msg_div = document.createElement('div');
      teacher_msg_div.setAttribute('class','teacher-msg-div');
      teacher_msg_div.textContent = `Teacher: ${msg}`;
      chat_div.appendChild(teacher_msg_div);
    Socket.emit('chatMessage',msg);
    input.value = "";
    }
  })
  // recieve msg from socket-------
  Socket.on('chatMessage',(msg)=>{
    const admin_msg_div = document.createElement('div');
    admin_msg_div.setAttribute('class','admin-msg-div');
    admin_msg_div.textContent =  `Admin: ${msg}`;
    chat_div.appendChild(admin_msg_div);
  }) 
  
});
