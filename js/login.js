 // show hide password
 function showHidePassword() {
     var x = document.getElementById("password");
     var y = document.getElementById("show-hide-icon");
     if (x.type === "password") {
         x.type = "text";
         y.innerHTML = '<i class="fa fa-eye"></i>';
     } else {
         x.type = "password";
         y.innerHTML = '<i class="fa fa-eye-slash"></i>';
     }
 }

 window.addEventListener('load', function() {
     const userName = this.document.getElementById('userName');
     const password = this.document.getElementById('password');
     const btn = this.document.getElementById('submit');



     // validate user name
     userName.addEventListener('blur', function() {
         if (!isUserNameValid(userName)) {
             userName.style.border = "2px solid red";
         } else {
             userName.style.border = "2px solid green";
             password.focus();
         }
     });

     // validate password
     password.addEventListener('blur', function() {
         if (!isPasswordValid(password)) {
             password.style.border = "2px solid red";
         } else {
             password.style.border = "2px solid green";
             btn.focus();
         }
     });


     this.document.forms[0].addEventListener('submit', function(e) {
         e.preventDefault();

         let data = Object.fromEntries(new FormData(e.target).entries());
         console.log(data, "data");

         if (!(isUserNameValid(userName) && isPasswordValid(password))) {
             e.preventDefault();
             userName.focus();
         } else {
             e.preventDefault();
             LoginPost(data);
         }
     }, ); //end of submit event
 }); //end of load function

 /********************functions***********************/


 // validate user name
 function isUserNameValid(userName) {
     var userNamePattern = /^[a-zA-Z0-9@]{3,}$/;
     return userName.value.match(userNamePattern);
 }

 // validate password
 function isPasswordValid(password) {
     var passwordPattern = /^[a-zA-Z0-9!@#$%^&*()_+-=]{3,}$/;
     return password.value.match(passwordPattern);
 }


 // login post
 async function LoginPost(data) {
     if (await isPasswordCorrect(data.userName, data.password)) {
         // navigate to home page 
         window.location.href = "http://127.0.0.1:5500/index.html";
     } else {
         alert("Invalid username or password.");
     }
 }

 //check if paasword is correct and await result
 async function isPasswordCorrect(userName, password) {
     const users = await getUsers();
     const user = users.find((user) => user.userName === userName);
     if (!user) return false;
     if (user.password === password) {
         saveData(user);
         return true;
     };
     return false;
 }

 //get users from server
 async function getUsers() {
     const response = await fetch("http://localhost:3000/users");
     const users = await response.json();
     return users;
 }


 // local Storage data
 async function saveData(userData) {
     const rawData = {
         id: userData.id,
         verify: userData.verify,
         fName: userData.fName,
         lName: userData.lName,
         age: userData.age,
         email: userData.email,
         userName: userData.userName,
         password: userData.password,
         address: userData.address,
         type: userData.type,
         isAuth: true
     };
     localStorage.setItem("userData", JSON.stringify(rawData));
     const data = localStorage.getItem("userData");
     console.log(data);
 }


 // check if user is auth and redirect to home page
 function isAuth() {
     const data = localStorage.getItem("userData");
     if (data) {
         const userData = JSON.parse(data);
         if (userData.isAuth) {
             window.location.href = "http://http://127.0.0.1:5500/index.html";
         }
     }
 }