     const Socket = io();

document.addEventListener('DOMContentLoaded',async()=>{
  let selectedTeacher = "";
     let teacherList = document.getElementById('teacherList')
     let ul = document.createElement('ul');
     try{
     const res =  await fetch('/getlist');
     if(!res.ok){
        console.log('error in res');
     }
     const data = await res.json();
     if(data){
        data.forEach(element => {
          const li = document.createElement('li');
          li.style.cursor = 'pointer';
          li.style.hover = 'light grey';
          li.textContent =  element.userName;
          li.dataset.email = element.Email;
          ul.appendChild(li);
      });
      teacherList.appendChild(ul);
      ul.addEventListener('click',(e)=>{
            const target = e.target;
            const clickedLi = target.closest('li');
            if(clickedLi && ul.contains(clickedLi)){
               ul.querySelectorAll('li').forEach(li => {
            li.style.backgroundColor = '';
            li.style.color = '';
          });

          // Highlight selected
          clickedLi.style.backgroundColor = "blue";
          clickedLi.style.color = 'white';

          // Save selected email
          selectedTeacher = clickedLi.dataset.email;
          console.log("Selected Teacher:", selectedTeacher);
          //get data from chatdata 

          
          //---close -----------close -----------------close-------
            }
        
      })
     }
     
     console.log('teacher list',data);
     }catch(err){
        console.log('server error');
     }



const sendBtn = document.querySelector('button');
// const chatBox = document.getElementById('chatBox');

// sendBtn.addEventListener('click', () => {
//   const msg = input.value.trim();
//   if (msg) {
//     socket.emit('adminMessage', msg);
//     input.value = '';
//   }
// });
// const Asign = document.getElementById('Asign');
// const Asignobject = {};
// Asign.addEventListener('click',()=>{
    
// })

// Receive messages from server
Socket.on('chatMessage', (msg) => {
  if(typeof msg === 'object'&& msg!==null){
  const div = document.createElement('div');
  div.innerHTML = `Teacher: ${msg.status} subject ${msg.subject} lectureNo ${msg.lectureNo} at ${msg.lecturetime} on ${msg.day} in room ${msg.room}`;
  document.getElementById('chatBox').appendChild(div);

 div.addEventListener('click', () => {
    // Reset all
    document.querySelectorAll('#chatBox div').forEach(el => el.classList.remove('selected'));
    // Add selected class to clicked
    div.classList.add('selected');
      
    const Asign = document.getElementById('Asign');
    Asign.addEventListener('click',async()=>{
          console.log('assign');
      let obj ={
          Email: selectedTeacher,
          day:msg.day,
          lecture:msg.lectureNo,
          subject:msg.subject,
          lecturetime:msg.lecturetime,
          room:msg.room 
      }
      try{
      const res = await fetch('/addAdjustment',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(obj)
      })
      if(!res.ok){
        console.log('error in res');
        return;
      }
      console.log('adjustment saved');
    }catch(err){
      console.log('failed to fecth',err);
    }
    })
  });
  }else {
      const div = document.createElement('div');
      div.textContent = msg;
         document.getElementById('chatBox').appendChild(div);

  }
});

//sends msg 
sendBtn.addEventListener('click',()=>{
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if(msg){
    // const adminMsg = document.querySelector('.adminMsg');
    const p = document.createElement('p');
    // p.textContent = msg;
    // .appendChild(p);
p.textContent = `Admin: ${msg}`;
      document.getElementById('chatBox').appendChild(p);
    Socket.emit('chatMessage',msg);
    input.value = '';
  }
})

})