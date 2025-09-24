
let signup = document.querySelector("#signup");
signup.addEventListener("click", async (e) => {
         e.preventDefault();

        const CurrName = document.querySelector("#SUname").value.trim();
        const CurrMail = document.querySelector("#Smail").value.trim().toLowerCase();
        const CurrPhon = document.querySelector("#mobile").value.trim();
        const CurrPass = document.querySelector("#Spass").value.trim();
        let adminRole = document.getElementById("admin");
        let teacherRole = document.getElementById("teacher");

        let role;
        if(adminRole?.checked){ role = "admin";}
        else if(teacherRole?.checked){ role = "teacher";}

        if (!CurrName || !CurrMail || !CurrPhon || !CurrPass ) {
            alert("Please fill all fields.");
            return;
        }
        if (!adminRole.checked && !teacherRole.checked) {
            alert("Please select a role.");
            return;
        }
        const formdata = {
            userName:CurrName,
            Email:CurrMail,
            password:CurrPass,
            mobile:CurrPhon,
            role:role
        }
        try{
            const resp = await fetch('/signup/user',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(formdata)
            });
            if(resp.ok){
                const msg = await resp.json();
                console.log('Success:', msg);
                alert(msg.message || 'signup success');
                window.location.href = "/login";
            }else {
                const errortext = await resp.json();
                // console.error('Error',errortext);
                alert('Signup failed: '+ (errortext.message||errortext));
            }
        }catch (error){
            console.log('Fetch Failed:',error);
        }
});