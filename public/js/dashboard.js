let selectedTeacher = "";
let loginEmail = "";

document.addEventListener('DOMContentLoaded', async() => {
    try{
      const res = await fetch('/getloginEmail',{
        method:'POST',
        credentials:'include'
      })
      if(!res.ok){
        console.log('error in response');
        return;
      }
      const data = await res.json();
      console.log(data);
      loginEmail = data.loginEmail;
      userName = data.userName;
      console.log(userName);
    }catch(err){
        console.log('fetch failed ',err);
    }
    let profile_name_of_user = document.getElementById('adminname');
    profile_name_of_user.textContent = userName;

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
  
  // const params = new URLSearchParams(window.location.search);
  // loginEmail = params.get("loginEmail");
  // console.log(loginEmail);
  // selectedTeacher = params.get("selectedTeacher");

 let currentteacher = loginEmail;
  updateDateTime();
  setInterval(updateDateTime, 1000);
  loadOptions(loginEmail, selectedTeacher);

  let navigationbar = document.querySelector(".menu");
  navigationbar.addEventListener('click',(e)=>{
        let target = e.target;

        const clickedLi = target.closest('li');
        
        if(clickedLi && navigationbar.contains(clickedLi)){
          const clickedText = clickedLi.textContent.trim();
          switch(clickedText){
            case 'Dashboard':
              window.location.href = "/adjustment"
              break;

              case 'calander':
                window.location.href = "/calander"
                break;

               case 'ApproveLeave':
                 window.location.href = '/leavePage';
                   break;

                 case 'Inbox':
                  //  window.location.href = '/inbox';
                 break;

                 case 'Chatbox':
                  window.location.href = '/adminchat'
                  break;

                default:
                console.log('Unknown menu item');
      
          }
        }
  });
});
//-----------------//-------------------//------------
function updateDateTime() {
  const now = new Date();
  document.getElementById("current-date").textContent = now.toLocaleDateString();
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}
//-------------------------------------------------
async function loadOptions(selectedTeacher) {
  try {
    const response = await fetch('/dashboard/teacherOptions');
    if (!response.ok) {
      console.error('Failed to fetch teacher options');
      return;
    }
    const data = await response.json();
    const select = document.getElementById('select-teacher');
    select.innerHTML = `<option disabled selected>Select a teacher</option>`;

    if (!select) {
      console.error('Dropdown not found');
      return;
    }
    const teachers = Array.isArray(data) ? data : (data.teachers || []);
    teachers.forEach(teacher => {
      // if (teacher.Email === loginEmail || teacher.role === 'admin') {
      //   return; // skip current logged-in user
      // }
      const option = document.createElement('option');
      option.value = teacher.Email;
      option.textContent = teacher.userName;
      if (teacher.Email === selectedTeacher) {
        option.selected = true;
      }
      select.appendChild(option);
     });
// jab select kregege to render hoga timetable------
  select.addEventListener('change', async () => {
  selectedTeacher = select.value;
  try {
    const resp = await fetch('/datafortable'); 
    const lectureDatabase = await resp.json(); 
    const teacherData = lectureDatabase.filter(
      t => t.Email?.toLowerCase() === selectedTeacher.toLowerCase()
    );
  console.log(teacherData)
    if (teacherData.length!=0) {
      renderTimetable(teacherData[0]); 
    } else {
      console.log("Teacher not found in lecture database.");
    }
  } catch (err) {
    console.error('Fetch failed:', err);  
  }
});
    if (selectedTeacher) {
      select.value = selectedTeacher;
      select.dispatchEvent(new Event('change'));
    }
  } catch (err) {
    console.log('Server error', err);
  }
}
//render krne ke liye 
function renderTimetable(teacher) {
  currentteacher = teacher;
  console.log(teacher);
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

      const match = teacher.timetable?.find(item =>
        item.day === day && String(item.lecture) === String(i)
      );
      console.log(match)
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
}

const add = document.getElementById('ADD-TT');
add.addEventListener('click', () => {
  const select = document.getElementById("select-teacher");
  selectedTeacher = select.value; // always get current selected

  if (!selectedTeacher || selectedTeacher.trim() === "") {
    alert(`please select`);
    return;
  }

  const url = `/timedetail?selectedTeacher=${encodeURIComponent(selectedTeacher)}&loginEmail=${encodeURIComponent(loginEmail)}`;
  window.location.href = url;
});

    
