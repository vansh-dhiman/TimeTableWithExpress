
// document.addEventListener("DOMContentLoaded", () => {
//   const btn = document.querySelector("#login");

//   btn.addEventListener("click", async (e) => {
//     e.preventDefault();

//     const name = document.querySelector("#Uname").value.trim().toLowerCase();
//     const password = document.querySelector("#Pass").value.trim();
//     const adminRole = document.getElementById("admin");
//     const teacherRole = document.getElementById("teacher");

//     let role = "";
//     if (adminRole?.checked) role = "admin";
//     else if (teacherRole?.checked) role = "teacher";

//     if (!name || !password || !role) {
//       console.log("⚠ Fields missing.");
//       return;
//     }

//     const obj = { username: name, password, role };

//     try {
//       const resp = await fetch("/login/user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(obj),
//       });

//       if (!resp.ok) {
//         const msg = await resp.text();
//         console.log("❌ Server rejected:", msg);
//         return;
//       }

//       const data = await resp.json();
//       if (data.valid) {
//         console.log("✅ VALID USER:", data.user);
//       } else {
//         console.log("❌ INVALID USER.");
//       }
//     } catch (err) {
//       console.error("Network error:", err);
//     }
//   });
// });

//   // if (!name || !password) {
//   //   alert("Please fill the fields first!");
//   //   return;
//   // }

//   // if (!adminRole.checked && !teacherRole.checked) {
//   //   alert("Please select a role.");
//   //   return;
//   // }

//   // let userDetail = JSON.parse(localStorage.getItem("userDetail")) || [];
//   // let user = userDetail.find(
//   //   (user) =>
//   //     user.userEmail.toLowerCase() === name && user.userPass === password
//   // );

//   // if (!user) {
//   //   alert("Invalid email or password!");
//   //   return;
//   // }

// //   // Save role & redirect based on match
// //   if (adminRole.checked && user.role === "Admin") {
// //     localStorage.setItem("role", JSON.stringify(`${name} (Admin)`));
// //     window.location.href = "dashboard.html";
// //   } else if (teacherRole.checked && user.role === "Teacher") {
// //     localStorage.setItem("role", JSON.stringify(`${name} (Teacher)`));
// //     window.location.href = "dashboard.html";
// //   } else {
// //     alert("Incorrect role selected.");
// //   }

const btn = document.querySelector("#login");
 btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const Email = document.querySelector("#Uname").value.trim().toLowerCase();
    const password = document.querySelector("#Pass").value.trim();
    const adminRole = document.getElementById("admin");
    const teacherRole = document.getElementById("teacher");

    let role = "";
    if (adminRole?.checked) role = "admin";
    else if (teacherRole?.checked) role = "teacher";

    if (!Email || !password || !role) {
      console.log(" Fields missing.");
      return;
    }
     const formdata = {
        Email:Email,
        password:password,
        role:role
     }
     try{
        const resp = await fetch('/login/user',{
           method: "POST",
           headers: {
            "Content-Type":"application/json"
           },
           body:JSON.stringify(formdata)
        });
        if(resp.ok){
         const data = await resp.json();
         console.log(data);
         if(data.role === "teacher"){
            console.log("teacherpage",data.Email);
            const url = `/teacherpage?loginEmail=${encodeURIComponent(data.Email)}`;
             window.location.href = url;
         }
         if(data.role === "admin") {
            console.log("/dashboard");
            const URL = `/dashboard?loginEmail=${encodeURIComponent(data.Email)}`;
            window.location.href = URL;
         }
        }else{
            console.log("error in response");
        }
     }catch(err){
           console.log("fetch failed",err);
     }
});