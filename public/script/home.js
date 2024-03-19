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

// Function to view author's profile
function viewAuthorProfile(author) {
    const userId = author.getAttribute("data-user-id");
    window.location.href = `/user/viewOtherUserProfile/${userId}`;
}

// Function to handle showing comments and adding/deleting comments
async function handleHomeComments(commentBtn) {
    const blogId = commentBtn.getAttribute('data-blog-id');
    const response = await axios.get(`/user/showComments/${blogId}`);
    if (response) {
        document.getElementById("homeModal").innerHTML = response.data;
        document.getElementById("homeModal").style.display = "flex";

        // Attach close modal event listener
        attachHomeCloseModalListener();

        attachHomeDeleteCommentListener();

        // Attach event listener for adding comments
        attachHomeAddCommentListener();
    } else {
        alert("Server error @ comment show");
    }
}

// Function to attach event listener for adding comments
function attachHomeAddCommentListener() {
    document.getElementById("commentDoneBtn").addEventListener("click", async () => {
        const userId = document.getElementById("commentHiddenUserId").value;
        const blogId = document.getElementById("commentHiddenBlogId").value;
        const comment = document.getElementById("commentInput").value;
        if (comment.trim() !== "") {
            const response = await axios.patch("/user/addComment", { userId, blogId, comment });
            if (response) {
                document.getElementById("homeModal").innerHTML = response.data;
                document.getElementById("homeModal").style.display = "flex";

                // Attach close modal event listener
                attachHomeCloseModalListener();

                // Attach delete comment event listener
                attachHomeDeleteCommentListener();

                // Attach event listener for adding comments
                attachHomeAddCommentListener();
            } else {
                alert("Server error @ comment show");
            }
        }
    });
}

// Function to attach delete comment event listener
function attachHomeDeleteCommentListener() {
    document.querySelectorAll(".fa-trash").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", async(e) => {
            const commentId = e.target.getAttribute("data-comment-id");
            const blogId = document.getElementById("commentHiddenBlogId").value;
            const response = await axios.patch("/user/deleteComment", { commentId, blogId });
            if (response) {
                showSuccessMessage("Comment deleted..");
                document.getElementById("homeModal").innerHTML = response.data;
                document.getElementById("homeModal").style.display = "flex";

                // Attach close modal event listener
                attachHomeCloseModalListener();

                // Reattach delete comment event listener
                attachHomeDeleteCommentListener();

                // Attach event listener for adding comments
                attachHomeAddCommentListener();
            }
        });
    });
}

// Function to attach close modal event listener
function attachHomeCloseModalListener() {
    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("homeModal").style.display = "none";
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

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.svg-heart').forEach((icon) => {
        icon.addEventListener("click", async function(e) {
            await likePost(icon);
        })
    });

    document.querySelectorAll(".view-author").forEach((author) => {
        author.addEventListener("click", () => {
            viewAuthorProfile(author);
        });
    });

    document.querySelectorAll(".home-fa-comment-dots").forEach((commentBtn) => {
        commentBtn.addEventListener("click", () => {
            handleHomeComments(commentBtn);
        });
    });

    document.querySelectorAll('.shareDiv').forEach((shareBtn) => {
        shareBtn.addEventListener('click', () => {
            copyToClipboard();
        });
    });
});
