// const save = document.getElementById("save");
// const timeDetail = JSON.parse(localStorage.getItem("timeDetail")) || [];
// const id = JSON.parse(localStorage.getItem("selectedTeacher"));
// function addinArr(id,lecture, subject, starttime, endtime, room, day) {
        
//   const object = {
//     id:id,
//     lec: lecture,
//     sub: subject,
//     StT: starttime,
//     EdT: endtime,
//     room: room,
//     day: day
//   };
//   timeDetail.push(object);
//   localStorage.setItem("timeDetail", JSON.stringify(timeDetail));
//   console.log(object);
// }

// save.addEventListener("click", (e) => {
//   e.preventDefault();
//   const lecture = document.getElementById("lecture").value.trim();
//   const subject = document.getElementById("subject").value.trim();
//   const starttime = document.getElementById("start-time").value.trim();
//   const endtime = document.getElementById("end-time").value.trim();
//   const room = document.getElementById("room").value.trim();
//   const day = document.getElementById("day").value;

//   if (!lecture || !subject || !starttime || !endtime || !room || !day) {
//     alert("Missing detail");
//     return;
//   }

//   addinArr(id,lecture, subject, starttime, endtime, room, day);
         
//   // Clear fields
//   document.getElementById("lecture").value = "";
//   document.getElementById("subject").value = "";
//   document.getElementById("start-time").value = "";
//   document.getElementById("end-time").value = "";
//   document.getElementById("room").value = "";
//   document.getElementById("day").value = "Monday";

//   // Redirect only — fillcells will run on dashboard load
//   window.location.href = "dashboard.html";
// });

// const cancel = document.getElementById("cancel");
// cancel.addEventListener("click", () => {
//   window.location.href="dashboard.html";
// });

// //------------------------
// // let identity = JSON.parse(localStorage.getItem("identity"));

const save = document.getElementById("save");

save.addEventListener("click", async (e) => {
  e.preventDefault();

 const params = new URLSearchParams(window.location.search);
const selectedTeacher = params.get("selectedTeacher");
const loginEmail = params.get("loginEmail");

  console.log("Selected Teacher:", selectedTeacher);
  console.log("Login Email:", loginEmail);

  const lecture = document.getElementById("lecture").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const starttime = document.getElementById("start-time").value.trim();
  const endtime = document.getElementById("end-time").value.trim();
  const room = document.getElementById("room").value.trim();
  const day = document.getElementById("day").value;
  // const teacherEmail = document.getElementById("form-teacher").value;  // select ka value

  if (!lecture || !subject || !starttime || !endtime || !room || !day || !selectedTeacher) {
    alert("Missing detail");
    return;
  }

  // Object bana rahe hain jo server ko bhejna hai
  const timetableEntry = { lecture, subject, starttime, endtime, room, day, selectedTeacher,loginEmail };

  try {
    const response = await fetch("/timedetail/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timetableEntry)
    });

    const result = await response.json();
    alert(result.message || "Saved!");
     const url = `/dashboard?loginEmail=${encodeURIComponent(loginEmail)}&selectedTeacher=${encodeURIComponent(selectedTeacher)}`;
     window.location.href = url;

  } catch (err) {
    console.error("Error saving timetable:", err);
    alert("Failed to save timetable.");
  }
});


// async function loadFormOptions(){
//     try{
//       const response = await fetch('/timedetail/teacherOptions');
//       if(!response.ok){
//         console.error('failed to fetch');
//         return;
//       }

//       const data = await response.json();
//       console.log(data);
//       const select = document.getElementById('form-teacher');
//       if(!select){
//         console.error('select not found');
//         return;
//       }
//       // select.innerHTML ='<option value=""> Select Teacher</option>';
//           const teachers = Array.isArray(data) ? data : (data.teachers || []);
//          teachers.forEach(teacher => {
          
//           const option = document.createElement('option');
//           option.value = teacher.Email;
//           option.textContent = teacher.userName;
//           option.addEventListener('click',()=>{
//                id = teacher.Email;
//           })
//           select.appendChild(option);
//          });
// }catch(err){
//   console.log('server error',err);
// }
// }


// document.addEventListener('DOMContentLoaded', () => {
//     loadFormOptions();                 // dropdown fill
//   });