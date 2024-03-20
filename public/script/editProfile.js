

document.getElementById("editProfileSubmitBtn").addEventListener("click", async (e) => {
    try {
        e.preventDefault();


        const username = document.getElementById("editEmail1").value;
        const password = document.getElementById("editPassword").value;
        const reEnterPassword = document.getElementById("editReEnterPassword1").value;
        const newProfileImg = document.getElementById("profile-image-input").files[0];

        const usernameErr = document.getElementById("editProfileUsernameErr");
        const passwordErr = document.getElementById("editProfilePasswordErr");
        const reEnterPasswordErr = document.getElementById("editProfileReEnterPasswordErr");
        const imageErr = document.getElementById("editProfileImgErr");
        let passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{4,}$/;


        if (!username.trim()) {
            showEditProfileError(usernameErr, "Please enter a username");
            return;
        } else if (/^\d/.test(username)) {
            showEditProfileError(usernameErr, "Username cannot start with a number");
            return;
        }

        if (password.length < 4) {
            showEditProfileError(passwordErr, "Password should contain more than 4 characters!")
            return;
        }
        if (!passwordRegx.test(password)) {
            showEditProfileError(passwordErr, "Password should contain letters and digits !")
            return;
        }

        if (password != reEnterPassword) {
            showEditProfileError(reEnterPasswordErr, "Password does'nt match");
            return;
        }

        if(!newProfileImg){
            showEditProfileError(imageErr, "Password does'nt match");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("newProfileImg", newProfileImg);

        const response = await axios.patch("/user/editProfile", formData);
        if(response.data.message == "success"){
            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                onOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
        
            await Toast.fire({
                icon: 'success',
                title: "Profile updated successfully"
            }).then(() => {
                window.location.href = "/user"; 
            });
        
        }else{
            alert("Edit profile server error")
        }

    } catch (error) {
        alert("Edit profile error")
    }
});


function showEditProfileError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        setTimeout(() => {
            errorElement.style.display = "none";
        }, 5000);
    }
}
