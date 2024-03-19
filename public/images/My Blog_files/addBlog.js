document.getElementById('blogImage').addEventListener('change', function() {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.color = "red";
        errorElement.style.paddingLeft = "20px";
        errorElement.style.fontSize = "small";
        errorElement.textContent = message;
        setTimeout(() => {
            errorElement.style.display = "none";
        }, 5000);
    }
}

document.getElementById("addBlogBtn").addEventListener("click", async (e) => {
    try {
        e.preventDefault();

        let title = document.getElementById("blogTitle").value;
        let type = document.getElementById("blogType").value;
        let description = document.getElementById("blogDescription").value;
        let imgFile = document.getElementById("blogImage").files[0];

        if (!title.trim()) {
            showError("titleError", "Please enter a title");
            return;
        } else if (/^\d/.test(title)) {
            showError("titleError", "Title cannot start with a number");
            return;
        }

        if (!type.trim()) {
            showError("typeError", "Please enter a type");
            return;
        } else if (/^\d/.test(type)) {
            showError("typeError", "Type cannot start with a number");
            return;
        }

        if (!description.trim()) {
            showError("descriptionError", "Please enter a description");
            return;
        } else if (/^\d/.test(description)) {
            showError("descriptionError", "Description cannot start with a number");
            return;
        }

        if (!imgFile) {
            showError("imgError", "Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append('blogTitle', title);
        formData.append('blogType', type);
        formData.append('blogDescription', description);
        formData.append('blogImage', imgFile);

        const response = await axios.post("/user/addBlog", formData);
        console.log(response.data);
        if(response.data.message == "success"){
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Blog added successfully",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/user/home'; 
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        alert(error);
    }
});
