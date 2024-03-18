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

    // setting like bttn
    document.querySelectorAll('.svg-heart').forEach((icon) => {
        icon.addEventListener("click", async function() {
            const response = await axios.patch("/user/likePost", {})
            icon.classList.toggle('active');
          })
    });

});
  
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







