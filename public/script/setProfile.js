document.getElementById("signupProceed").addEventListener("click", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('User-Img', file);

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    try {
        const response = await axios.post("/user/profileImg", formData, config);
        if (response.data && response.data.message === "success") {
            await showSuccessMessage('Image uploaded successfully!');
            window.location.href = "/user";
        } else {
            const errorMessage = response.data && response.data.error ? response.data.error : "An error occurred";
            alert(errorMessage);
        }

    } catch (error) {
        alert(error)
    }
});


async function showSuccessMessage(message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    await Toast.fire({
        icon: 'success',
        title: message
    });
}

