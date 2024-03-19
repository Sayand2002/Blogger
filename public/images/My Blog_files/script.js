
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const main = document.getElementById("main");

signUpButton.addEventListener("click",()=>{
  main.classList.add("right-panel-active");
})

signInButton.addEventListener("click",()=>{
  main.classList.remove("right-panel-active");
})

// image setting 
const div = document.createElement('div');

function dragNdrop(event) {
  const fileName = URL.createObjectURL(event.target.files[0]);
  const preview = document.getElementById("preview");

  // Create and set attributes for the image
  const previewImg = document.createElement("img");
  previewImg.setAttribute("height", "300"); 
  previewImg.setAttribute("width", "300"); 
  previewImg.style.borderRadius = "50%";
  previewImg.setAttribute("src", fileName);

  // Create and set attributes for the editDiv
  const editDiv = document.createElement("div");
  editDiv.id = "editImg";
  editDiv.innerHTML = '<i class="fa-solid fa-pen"></i>'; 

  // Apply styles to the editDiv
  editDiv.style.width = "20%";
  editDiv.style.height = "20%";
  editDiv.style.position = "absolute";
  editDiv.style.bottom = "20px";
  editDiv.style.right = "20px";
  editDiv.style.backgroundColor = "#fac61c";
  editDiv.style.padding = "10px";
  editDiv.style.borderRadius = "50%";
  editDiv.style.display = "flex";
  editDiv.style.justifyContent = "center";
  editDiv.style.alignItems = "center";
  editDiv.style.zIndex = "100";

  editDiv.addEventListener("click", () => {
    window.location.reload();
});

  // Append the image and editDiv to the preview div
  preview.innerHTML = "";
  preview.appendChild(previewImg);
  preview.appendChild(editDiv);

  // Show/hide elements as needed
  const signupProceedButton = document.getElementById("signupProceed");
  signupProceedButton.style.display = "flex";
  document.getElementById("chooseImgLabel").style.display = "none";
  document.getElementById("skipLink").style.display = "none";
}

function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}

function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

async function validateSignUp(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{4,}$/;

    if (!emailRegx.test(email)) {
        showError("Email not valid!")
        return false;
    }
    if (password.length < 4) {
        showError("Password should contain more than 4 characters!")
        return false;
    }
    if (!passwordRegx.test(password)) {
        showError("Password should contain letters and digits !")
        return false;
    }

    try {
        const response = await axios.post("/user/signup", { txt: username, email: email, Pswd: password });
        console.log(response.data);
        if(response.data.message === "exist"){
            showError("Email already exist!");
        }else if(response.data.message === "success"){
            window.location.href = "/user/setProfile";
        }
    } catch (error) {
        alert(error)
    }
}


function showError(message) {
  const errorBox = document.getElementById("error-box");
  errorBox.innerText = message;
  errorBox.classList.add("visible");

  setTimeout(() => {
    errorBox.classList.remove("visible");
  }, 5000);
}

document.getElementById("signInBtn").addEventListener("click", async(e)=>{
  try {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginData = {
      email: email,
      password: password
    }
    const response = await axios.post("/user/login", loginData);
    if(response.data.message === "Invalid"){
      showError("Invalid email or password");
    }else{
      window.location.href = "/user/home";
    }
  } catch (error) {
    alert(error);
  }
})

//create account button click
function redirectSignUP(){
  window.location.href = "/user";
}



