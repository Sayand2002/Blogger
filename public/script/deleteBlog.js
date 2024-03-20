document.querySelectorAll(".deleteBlogBtn").forEach((button) => {

    button.addEventListener("click", async(event) => {

        const blogId = button.getAttribute("data-blog-id");
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this blog. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.delete(`https://blogger-1.onrender.com/user/deleteBlog/${blogId}`);
                if(response.data.message == "success"){
                      Swal.fire(
                        'Deleted!',
                        'Your blog has been deleted.',
                        'success'
                      ).then(()=>{
                        window.location.reload();
                      });
                }else{
                    Swal.fire(
                        'Something went wrong!',
                        'failed'
                      );
                }
            
            }
          });
    });

});