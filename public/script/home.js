
// document.getElementById("heart").addEventListener("click", ()=>{
//     document.getElementById("heart").classList.toggle("is-active");
// })

// document.getElementById('shareButton').addEventListener('click', () => {
//     const urlToCopy = window.location.href;
//     navigator.clipboard.writeText(urlToCopy)
//         .then(() => alert('URL copied to clipboard'))
//         .catch((error) => console.error('Error copying to clipboard:', error));
// });

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