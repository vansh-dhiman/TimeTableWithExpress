let selectedTeacher = "";
let loginEmail = "";

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  loginEmail = params.get("loginEmail");
  selectedTeacher = params.get("selectedTeacher");


  updateDateTime();
  setInterval(updateDateTime, 1000);
  loadOptions(loginEmail, selectedTeacher);
});

function updateDateTime() {
  const now = new Date();
  document.getElementById("current-date").textContent = now.toLocaleDateString();
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}

async function loadOptions(loginEmail, selectedTeacher) {
  try {
    const response = await fetch('/dashboard/teacherOptions');
    if (!response.ok) {
      console.error('Failed to fetch teacher options');
      return;
    }

    const data = await response.json();
    const select = document.getElementById('select-teacher');
    if (!select) {
      console.error('Dropdown not found');
      return;
    }

    const teachers = Array.isArray(data) ? data : (data.teachers || []);
      
    teachers.forEach(teacher => {
      if (teacher.Email === loginEmail || teacher.role === 'admin') {
        return; // skip current logged-in user
      }
      const option = document.createElement('option');
      option.value = teacher.Email;
      option.textContent = teacher.userName;

      if (teacher.Email === selectedTeacher) {
        option.selected = true;
      }

      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      selectedTeacher = select.value;
      const teacher = teachers.find(t => t.Email?.toLowerCase() === selectedTeacher.toLowerCase());
      if (teacher) {
         
        renderTimetable(teacher);
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

function renderTimetable(teacher) {
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

