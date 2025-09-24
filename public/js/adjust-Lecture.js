document.addEventListener('DOMContentLoaded', async () => {
  let freeTeachersContainer = document.querySelector('.freeTeachersContainer');
  let lectureDay = document.getElementById('lectureDay');
  let lectureNo = document.getElementById('lectureNo');
  let lectureTime = document.getElementById('lectureTime');
  let lectureSubject = document.getElementById('lectureSubject');
  let lectureRoom = document.getElementById('lectureRoom');

  let prevBtn = document.getElementById('prevBtn');
  let nextBtn = document.getElementById('nextBtn');
  let assignBtn = document.getElementById('assignBtn');
  let backBtn = document.getElementById('backBtn');
  let chatName = document.getElementById('chatName');

  let teacherSelect = document.getElementById('teacherSelect');
  let sendRequestBtn = document.getElementById('sendRequestBtn');

  let selectedEmail = null;
  let selectedName = null;
  let object = {};
  backBtn.addEventListener('click', () => {
    window.location.href = '/leavePage';
  });

  const params = new URLSearchParams(window.location.search);
  const teacherid = params.get('id');

  try {
    const resp = await fetch(`/getLectures?teacherid=${teacherid}`);
    if (!resp.ok) {
      alert('Error fetching lectures');
      return;
    }

    const data = await resp.json();
    const timetable = data.timetable;
    const leaveEmail = data.leaveEmail;
    const userDoc = data.userDoc;

    if (!timetable || timetable.length === 0) {
      alert('No lectures found');
      return;
    }

    let i = 0;

    function showLectures(i) {
      let lec = timetable[i];
      lectureDay.textContent = lec.day;
      lectureNo.textContent = lec.lecture;
      lectureTime.textContent = `${lec.starttime}-${lec.endtime}`;
      lectureSubject.textContent = lec.subject;
      lectureRoom.textContent = lec.room;
      // object = {
      //   email: selectedEmail,
      //   day: lectureDay.textContent,
      //   lectureNo: lectureNo.textContent,
      //   subject: lectureSubject.textContent,
      //   lectureTime: lectureTime.textContent,
      //   room: lectureRoom.textContent
      // }
      getOptions(userDoc, lec, leaveEmail);
    }

    showLectures(i);

    nextBtn.addEventListener('click', () => {
      if (i < timetable.length - 1) {
        i++;
        showLectures(i);
      }
    });

    prevBtn.addEventListener('click', () => {
      if (i > 0) {
        i--;
        showLectures(i);
      }
    });

    async function getOptions(userDoc, lec, leaveEmail) {
      teacherSelect.innerHTML = `<option value="">-- Select Teacher --</option>`;

      for (const element of userDoc) {
        if (element.role !== 'admin' && element.Email !== leaveEmail) {
          const valid = await checkAvailable(
            element.Email,
            lec.day,
            lec.lecture,
            lec.date
          );
          if (valid) {
            const option = document.createElement('option');
            option.textContent = element.userName;
            option.value = element.Email;
            teacherSelect.appendChild(option);
          }
        }
      }
    }

    teacherSelect.addEventListener('change', () => {
      const selectedOption = teacherSelect.options[teacherSelect.selectedIndex];
      console.log(selectedOption);

      chatName.textContent = selectedOption.textContent;
      selectedEmail = selectedOption.value;
      selectedName = selectedOption.textContent;
      object = {
        email: selectedEmail,
        day: lectureDay.textContent,
        lectureNo: lectureNo.textContent,
        subject: lectureSubject.textContent,
        lectureTime: lectureTime.textContent,
        room: lectureRoom.textContent
      };
    });

    sendRequestBtn.addEventListener('click', async () => {

      if (!selectedEmail) {
        alert("Please select a teacher first.");
        return;
      }
      console.log(object);
      // const obj = {
      //   email: selectedEmail,
      //   day: lectureDay.textContent,
      //   lectureNo: lectureNo.textContent,
      //   subject: lectureSubject.textContent,
      //   lectureTime: lectureTime.textContent,
      //   room: lectureRoom.textContent
      // };
      console.log(selectedEmail);

      try {
        const res = await fetch('/senddataTOteacher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(object)
        });

        const result = await res.json();
        if (res.ok) {
          alert("Request sent successfully!");
        } else {
          alert("Failed to send request: " + result.message);
        }
      } catch (err) {
        console.error("Send request failed:", err);
        alert("Server error while sending request.");
      }
    });

    async function checkAvailable(checkTeacherAvailable, checkDay, checklecture, checkDate) {
      try {
        const res = await fetch('/checkTeacherAvailable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            checkTeacherAvailable,
            checkDay,
            checklecture,
            checkDate
          })
        });

        const result = await res.json();
        return res.ok && result.message === 'available';
      } catch (err) {
        console.error('Server error:', err);
        return false;
      }
    }

  } catch (err) {
    console.error('Error:', err);
  }
});
