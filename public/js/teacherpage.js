

function updateDateTime() {
  const now = new Date();
  document.getElementById("current-date").textContent = now.toLocaleDateString();
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}
 let loginEmail = null;
document.addEventListener('DOMContentLoaded', () => {
  // const params = new URLSearchParams(window.location.search);
  // const loginEmail = params.get("loginEmail");
  // console.log("Login Email:", loginEmail);

 const logout = document.getElementById('logout-btn');
    logout.addEventListener('click',async()=>{
      try{
        const res = await fetch('/logout',{
          method:'GET',
          credentials:'include'
        });
        if(!res.ok){
          alert('error in res');
          return;
        }
        alert('you have been logged out');
        window.location.href='/login';
      }catch(err){
        alert('failed to fetch');
      }
    })
    
  updateDateTime(); // initial run
  setInterval(updateDateTime, 1000);
  loadTeacherdata();

  let leaveStatus = document.getElementById('leaveStatus');
  // checkstatus(loginEmail);

  let navigationbar = document.querySelector(".menu");
  navigationbar.addEventListener('click',(e)=>{
        let target = e.target;

        const clickedLi = target.closest('li');
        
        if(clickedLi && navigationbar.contains(clickedLi)){
          const clickedText = clickedLi.textContent.trim();
          switch(clickedText){
            case 'dashboard':
                window.location.href = '/adjustmentRequest.html';

              break;

              case 'calander':
                window.location.href = "/calander"
                break;

               case 'RequestLeave':
                // window.location.href = '/leave';
                console.log('leave h');
                requestForLeave(loginEmail);
                   break;

                 case 'Inbox':
                   window.location.href = '/inbox';
                 break;

                 case 'adjustmentRequests':
                   window.location.href = '/getteacher_chatpage';
                 break;

                default:
                console.log('Unknown menu item');
      
          }
        }
  });
});

async function loadTeacherdata() {
  try {
    const response = await fetch('/teacherdata', {
      method: 'POST'
      // headers: {
      //   "Content-Type": "application/json"
      // },
      // body: JSON.stringify({  }) 
    });

    if (!response.ok) {
      console.error('Failed to fetch');
      return;
    }

    const text = await response.text();
console.log('Raw server response:', text);

const data = JSON.parse(text);

    const timetabledata = Array.isArray(data.timetable) ? data.timetable : [];
    const teacherName = data.userName;
    loginEmail = data.loginEmail;


    // const profile_name_of_user = document.querySelector('#teachername');
    // profile_name_of_user.textContent = teacherName;


    const dayArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    dayArr.forEach(day => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = day;
      tr.appendChild(th);

      for (let i = 1; i <= 8; i++) {
        const td = document.createElement("td");

        const match = timetabledata.find(item =>
          item.day === day && String(item.lecture) === String(i)
        );

        if (match) {
          td.innerHTML = `
            <b>${match.subject}</b><br>
            <small>${match.starttime} - ${match.endtime}</small><br> 
            <small>Room: ${match.room}</small>
          `;
        }

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.log("Server error:", err);
  }
}

function requestForLeave(loginEmail) {
  let TimeTable = document.querySelector(".Time-table");
  TimeTable.style.display = "none";

  const leaveBox = document.createElement("div");
  leaveBox.id = "leave-box";

  const leaveContent = document.createElement("div");
  leaveContent.className = "leave-content";

  const heading = document.createElement("span");
  heading.className = "leave-heading";
  heading.textContent = "Leave Request";

  function createField(labelText, inputType, inputId) {
    const field = document.createElement("div");
    field.className = "form-field";

    const label = document.createElement("span");
    label.textContent = labelText;

    let input;
    if (inputType === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else {
      input = document.createElement("input");
      input.type = inputType;
    }
    input.id = inputId;

    field.appendChild(label);
    field.appendChild(input);
    return field;
  }

  // Buttons
  const btnDiv = document.createElement("div");
  btnDiv.className = "btn-group";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.className = "submit-btn";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "cancel-btn";

  // Add button logic
  cancelBtn.addEventListener("click", () => {
    document.body.removeChild(leaveBox);
    TimeTable.style.display = "block";
  });

  submitBtn.addEventListener("click", async() => {
    const fromDate = document.getElementById("from-date").value;
    const toDate = document.getElementById("to-date").value;
    const reason = document.getElementById("reason").value;

    if (!loginEmail||!fromDate || !toDate || !reason.trim()) {
      alert("Please fill all fields!");
      return;
    }
     
    const formData ={
       email:loginEmail,
       fromDate:fromDate,
        toDate:toDate,
        reason:reason,
        status:"PENDING"
       }; 
       
    try{
     const leaveResp = await fetch('/submitLeave',{
        method:"POST",
        headers: {
              "Content-Type": "application/json"
        },
        body:JSON.stringify({formData})
     });
     if(!leaveResp.ok){
      console.log('error in leaveRes');
      alert("failed to submit leave");
     }else{
      const data = await leaveResp.json();
      console.log('leaveRes:',data);
      leaveStatus.src="https://cdn-icons-png.flaticon.com/512/1027/1027650.png"
      alert("Leave request submitted!");
      document.body.removeChild(leaveBox);
      TimeTable.style.display = "block";
     }
     
    }catch(err){
      console.log("failed to fetch",err);
      alert("failed to fetch");
    }
  });

  // Create & append form fields
  leaveContent.appendChild(heading);
  leaveContent.appendChild(createField("Leave From", "date", "from-date"));
  leaveContent.appendChild(createField("Leave To", "date", "to-date"));
  leaveContent.appendChild(createField("Reason", "textarea", "reason"));
  btnDiv.appendChild(submitBtn);
  btnDiv.appendChild(cancelBtn);
  leaveContent.appendChild(btnDiv);

  leaveBox.appendChild(leaveContent);
  document.body.appendChild(leaveBox);
}

