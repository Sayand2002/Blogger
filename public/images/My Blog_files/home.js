
document.querySelectorAll('.shareDiv').forEach((shareBtn) => {
    shareBtn.addEventListener('click', () => {
        const urlToCopy = window.location.href;
        navigator.clipboard.writeText(urlToCopy)
            .then(() => Swal.fire({
                icon: 'success',
                title: 'Copied to Clipboard! ',
                text: 'URL cpoied to your clipboard successfully.',
                confirmButtonText: 'OK'
            }))
            .catch((error) => console.error('Error copying to clipboard:', error));
    });
})


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.svg-heart').forEach((icon) => {
        icon.addEventListener("click", async function(e) {
            const blogId = icon.getAttribute("data-like-blog-id");
            const userId = icon.getAttribute("data-like-user-id");
            const isLiked = icon.getAttribute("data-isliked");

            const response = await axios.patch("/user/likePost", {blogId: blogId, userId: userId, isLiked: isLiked});
            if(response.data.message == "success"){
                icon.classList.toggle('active');
                window.location.reload()
            }else{
                alert("server error")
            }
          })
    });
  });

document.querySelectorAll(".view-author").forEach(async (author) => {
    author.addEventListener("click", async()=>{
        const userId = author.getAttribute("data-user-id");
        window.location.href = `/user/viewOtherUserProfile/${userId}`;
    })
});



document.querySelectorAll(".fa-comment-dots").forEach((commentBtn) => {
    commentBtn.addEventListener("click" , async () => {
        const blogId = commentBtn.getAttribute('data-blog-id');
        const response = await axios.get("/user/comments", {blogId: blogId});
        document.getElementById("homeModal").style.display = "flex";
    })
})


document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("homeModal").style.display = "none";
})