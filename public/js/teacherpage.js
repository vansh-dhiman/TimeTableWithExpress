

function updateDateTime() {
  const now = new Date();
  document.getElementById("current-date").textContent = now.toLocaleDateString();
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const loginEmail = params.get("loginEmail");
  console.log("Login Email:", loginEmail);

  updateDateTime(); // initial run
  setInterval(updateDateTime, 1000);
  loadTeacherdata(loginEmail);

  let navigationbar = document.querySelector(".menu");
  navigationbar.addEventListener('click',(e)=>{
        let target = e.target;

        const clickedLi = target.closest('li');
        
        if(clickedLi && navigationbar.contains(clickedLi)){
          const clickedText = clickedLi.textContent.trim();
          switch(clickedText){
            case 'dashboard':
              window.location.href = "/dashboard"
              break;

              case 'calander':
                window.location.href = "/calander"
                break;

               case 'RequestLeave':
                // window.location.href = '/leave';
                console.log('leave h');
                requestForLeave();
                   break;

                 case 'Inbox':
                   window.location.href = '/inbox';
                 break;

                default:
                console.log('Unknown menu item');
      
          }
        }
  });
});

async function loadTeacherdata(loginEmail) {
  try {
    const response = await fetch('/teacherpage/teacherdata');
    if (!response.ok) {
      console.error('Failed to fetch');
      return;
    }

    const data = await response.json();
    const teachers = Array.isArray(data) ? data : (data.teachers || []);
    const teacher = teachers.find(t => t.Email?.toLowerCase() === loginEmail?.toLowerCase());

    if (teacher) {
          let profile_name_of_user = document.querySelector('#teachername');
          profile_name_of_user.textContent = teacher.userName;

      const dayArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const tbody = document.querySelector("table tbody");
      tbody.innerHTML = "";

      dayArr.forEach(day => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = day;
        tr.appendChild(th);

        for (let i = 1; i <= 8; i++) {
        //   console.log("Checking", day, "Lecture:", i);
          const td = document.createElement("td");

          const match = teacher.timetable?.find(item =>
            item.day === day && String(item.lecture) === String(i)
          );

          console.log("Match result:", match);

          if (match) {
            console.log("matched");
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
    }
  } catch (err) {
    console.log("server error:", err);
  }
}

function requestForLeave() {
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

  submitBtn.addEventListener("click", () => {
    const fromDate = document.getElementById("from-date").value;
    const toDate = document.getElementById("to-date").value;
    const reason = document.getElementById("reason").value;

    if (!fromDate || !toDate || !reason.trim()) {
      alert("Please fill all fields!");
      return;
    }

    console.log("Leave Request Submitted:");
    console.log("From:", fromDate);
    console.log("To:", toDate);
    console.log("Reason:", reason);

    // TODO: send to backend with fetch if needed
    // fetch('/submitLeave', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fromDate, toDate, reason, loginEmail })
    // });

    alert("Leave request submitted!");
    document.body.removeChild(leaveBox);
    TimeTable.style.display = "block";
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
