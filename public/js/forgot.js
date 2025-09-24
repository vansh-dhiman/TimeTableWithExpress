document.addEventListener('DOMContentLoaded', () => {

    let emailInput = document.getElementById('email');
    const sendbtn = document.getElementById('send');
    let card = document.querySelector('.card');
    let generated = false;
    sendbtn.addEventListener('click', async (e) => {
        e.preventDefault();
        //check user valid or not---------
        try {
            const resp = await fetch('/checkuservalid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailInput: emailInput.value })
            });
            if (!resp.ok) {
                console.log('error in response');
                return;
            }
            console.log('user valid');
            //ager user valid hai tooo -------------token generate kro
            generateToken(emailInput.value);
        } catch (err) {
            console.log('server error', err);
            return;
        }
        //---------close ------------ close-------------

        //function to generate  token -----
        async function generateToken(email) {
            try {
                const resp = await fetch('/generatetoken', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ emailInput: email })
                })
                if (!resp.ok) {
                    console.log(resp.message);
                    return;
                }
                const data = await resp.json();
                if(data){
                console.log(data.message);
                const token = data.token;
                console.log("he"+token);
                await setnewpass(token);
                console.log("hhhhhhhhhhhh");
                }

            } catch (err) {
                console.log('failed to fecth', err);
                return;
            }
        }
    });



   async function setnewpass(token) {

        console.log('verify verify');
        // Hide the first card
        document.querySelector('.card').style.display = 'none';

        // Create new container
        let card2 = document.createElement('div');
        card2.classList.add('reset-card');

        // OTP Label + Input (readonly)
        let otpLabel = document.createElement('label');
        otpLabel.textContent = 'Your OTP:';
        otpLabel.setAttribute('for', 'otp');

        let otpInput = document.createElement('input');
        otpInput.type = 'text';
        otpInput.id = 'otp';
        otpInput.name = 'otp';
        // otpInput.value = token; // pre-filled token
        // otpInput.readOnly = true;

        // New Password Label + Input
        let passLabel = document.createElement('label');
        passLabel.textContent = 'New Password:';
        passLabel.setAttribute('for', 'newPass');

        let passInput = document.createElement('input');
        passInput.type = 'password';
        passInput.id = 'newPass';
        passInput.name = 'newPass';
        passInput.placeholder = 'Enter new password';
        passInput.required = true;

        // Confirm Password Label + Input
        let cpassLabel = document.createElement('label');
        cpassLabel.textContent = 'Confirm Password:';
        cpassLabel.setAttribute('for', 'confirmPass');

        let cpassInput = document.createElement('input');
        cpassInput.type = 'password';
        cpassInput.id = 'confirmPass';
        cpassInput.name = 'confirmPass';
        cpassInput.placeholder = 'Confirm new password';
        cpassInput.required = true;

        // Submit Button
        let submitBtn = document.createElement('button');
        submitBtn.textContent = 'Reset Password';
        submitBtn.type = 'submit';
        submitBtn.classList.add('reset-btn');

        // Append all elements to the form
        let form = document.createElement('form');
        form.classList.add('reset-form');
        form.appendChild(otpLabel);
        form.appendChild(otpInput);
        form.appendChild(passLabel);
        form.appendChild(passInput);
        form.appendChild(cpassLabel);
        form.appendChild(cpassInput);
        form.appendChild(submitBtn);

        // Handle form submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (passInput.value !== cpassInput.value) {
                alert('Passwords do not match!');
                return;
            }

            try {
                const resp = await fetch('/resetpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: otpInput.value,
                        newPassword: passInput.value
                    })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    alert(data.message || 'Reset failed');
                    return;
                }
                alert('Password reset successful!');
                location.href = '/login';
            } catch (err) {
                console.error('Error:', err);
                alert('Something went wrong');
            }
        });

        // Append form to the new card
        card2.appendChild(form);

        // Add to body
        document.body.appendChild(card2);
    }

})