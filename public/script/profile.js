window.addEventListener('DOMContentLoaded', function() {
    const profileImage = document.getElementById('profileImage');
    const width = profileImage.offsetWidth;
    profileImage.style.marginTop = Math.floor(width/4) + 'px';
    profileImage.style.marginBottom = Math.floor(width/4)  + 'px'; 
    
    if(document.getElementById("follow-link")){
        document.getElementById("follow-link").addEventListener("click", async ()=>{
            const userIdHidden = document.getElementById("userIdHidden").value;
            const response = await axios.patch("/user/followUser", { userId: userIdHidden });
            if(response.data.message == "success"){
                this.window.location.reload();
            }else{
                alert("something went wrong . server error")
            }
        });
    }else{
        document.getElementById("following-link").addEventListener("click", async ()=>{
            const userIdHidden = document.getElementById("userIdHidden").value;
            const response = await axios.patch("/user/unFollowUser", { userId: userIdHidden });
            if(response.data.message == "success"){
                this.window.location.reload();
            }else{
                alert("something went wrong . server error")
            }
        })
    } 

    document.querySelectorAll('.svg-heart').forEach((icon) => {
        icon.addEventListener("click", async function(e) {
            await likePost(icon);
        })
    });


    document.querySelectorAll(".profile-fa-comment-dots").forEach((commentBtn) => {
        commentBtn.addEventListener("click", ()=>{
            handleComments(commentBtn);
        })
    })


    document.querySelectorAll('.profileShareButton').forEach((shareBtn) => {
        shareBtn.addEventListener('click', () => {
            copyToClipboard();
        });
    });
});





// Function to handle showing comments and adding/deleting comments
async function handleComments(commentBtn) {
    const blogId = commentBtn.getAttribute('data-blog-id');
    const response = await axios.get(`/user/showComments/${blogId}`);
    if (response) {
        document.getElementById("profileModal").innerHTML = response.data;
        document.getElementById("profileModal").style.display = "flex";

        // Attach close modal event listener
        attachCloseModalListener();

        attachDeleteCommentListener();

        // Attach event listener for adding comments
        attachAddCommentListener();
    } else {
        alert("Server error @ comment show");
    }
}

// Function to attach event listener for adding comments
function attachAddCommentListener() {
    document.getElementById("commentDoneBtn").addEventListener("click", async () => {
        const userId = document.getElementById("commentHiddenUserId").value;
        const blogId = document.getElementById("commentHiddenBlogId").value;
        const comment = document.getElementById("commentInput").value;
        if (comment.trim() !== "") {
            const response = await axios.patch("/user/addComment", { userId, blogId, comment });
            if (response) {
                document.getElementById("profileModal").innerHTML = response.data;
                document.getElementById("profileModal").style.display = "flex";

                // Attach close modal event listener
                attachCloseModalListener();

                // Attach delete comment event listener
                attachDeleteCommentListener();

                // Attach event listener for adding comments
                attachAddCommentListener();
            } else {
                alert("Server error @ comment show");
            }
        }
    });
}

// Function to attach delete comment event listener
function attachDeleteCommentListener() {
    document.querySelectorAll(".fa-trash").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", async(e) => {
            const commentId = e.target.getAttribute("data-comment-id");
            const blogId = document.getElementById("commentHiddenBlogId").value;
            const response = await axios.patch("/user/deleteComment", { commentId, blogId });
            if (response) {
                showSuccessMessage("Comment deleted..");
                document.getElementById("profileModal").innerHTML = response.data;
                document.getElementById("profileModal").style.display = "flex";

                // Attach close modal event listener
                attachCloseModalListener();

                // Reattach delete comment event listener
                attachDeleteCommentListener();

                // Attach event listener for adding comments
                attachAddCommentListener();
            }
        });
    });
}

// Function to attach close modal event listener
function attachCloseModalListener() {
    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("profileModal").style.display = "none";
    });
}

// Function to show success message
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




// Function to handle copying URL to clipboard
function copyToClipboard() {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy)
        .then(() => Swal.fire({
            icon: 'success',
            title: 'Copied to Clipboard!',
            text: 'URL copied to your clipboard successfully.',
            confirmButtonText: 'OK'
        }))
        .catch((error) => console.error('Error copying to clipboard:', error));
}



// Function to handle liking a post
async function likePost(icon) {
    const blogId = icon.getAttribute("data-like-blog-id");
    const userId = icon.getAttribute("data-like-user-id");
    const isLiked = icon.getAttribute("data-isliked");

    const response = await axios.patch("/user/likePost", { blogId, userId, isLiked });
    if (response.data.message === "success") {
        icon.classList.toggle('active');
        window.location.reload();
    } else {
        alert("Server error");
    }
}


  
let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

document.getElementById("profile-image-container").addEventListener("click", ()=>{
    document.getElementById("profile-image-input").click();
})

document.getElementById("profile-image-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById("editProfileImg").src = e.target.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById("editProfileImg").src = "";
    }
});







