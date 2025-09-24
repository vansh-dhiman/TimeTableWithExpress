

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
           body:JSON.stringify(formdata),
           credentials:'include'
        });
        if(resp.ok){
         const data = await resp.json();
         console.log(data.message);
         if(data.role === "teacher"){
            console.log("teacherpage",data.Email);
            window.location.href='/teacherpage';
            // const url = `/teacherpage?loginEmail=${encodeURIComponent(Email)}`;
            //  window.location.href = url;
         }
         if(data.role === "admin") {
            console.log("/dashboard");
             window.location.href='/dashboard';
            // const URL = `/dashboard`;
            // window.location.href = URL;
         }
        }else{
         data = await resp.json();
            console.log(data.message);
            console.log("user not found response");
            alert('user not found response')
        }
     }catch(err){
           console.log("fetch failed",err);
     }
});

const forgotbtn = document.querySelector('#forgot');
if(forgotbtn){
forgotbtn.addEventListener('click',(e)=>{
   e.preventDefault();
   window.location.href = '/forgot';
});
}
const newAccbtn = document.querySelector('#newAcct');
newAccbtn.addEventListener('click',(e)=>{
   e.preventDefault();
   window.location.href = "/signup";
})