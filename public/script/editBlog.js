document.querySelectorAll(".blogEditBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const blogId =  btn.getAttribute("data-edit-blog-id");
        window.location.href = `https://blogger-1.onrender.com/user/editBlog/${blogId}`;
    })
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

document.getElementById("editBlogBtn").addEventListener("click", async (e) => {
    try {
        e.preventDefault();

        let title = document.getElementById("blogTitle").value;
        let type = document.getElementById("blogType").value;
        let description = document.getElementById("blogDescription").value;
        let blogId = document.getElementById("editBlogBtn").getAttribute("data-blog-id");
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

        const formData = new FormData();
        formData.append('blogTitle', title);
        formData.append('blogType', type);
        formData.append('blogDescription', description);
        formData.append("blogId", blogId);
        formData.append('blogImage', imgFile);

        const response = await axios.patch("https://blogger-1.onrender.com/user/editBlog", formData);
        if(response.data.message == "success"){
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Blog edited successfully",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'https://blogger-1.onrender.com/user/profile'; 
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
