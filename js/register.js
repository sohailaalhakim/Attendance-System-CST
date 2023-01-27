window.addEventListener('load', function() {
    const firstName = this.document.getElementById('fname');
    const lastName = this.document.getElementById('lname');
    const address = this.document.getElementById('address');
    const email = this.document.getElementById('email');
    const age = this.document.getElementById('age');


    firstName.addEventListener('blur', function() {
        validateNameBorderForm(firstName, lastName);
    });

    lastName.addEventListener('blur', function() {
        validateNameBorderForm(lastName, address);
    });

    address.addEventListener('blur', function() {
        validateNameBorderForm(address, email);
    });

    email.addEventListener('blur', function() {
        if (!isEmailValid()) {
            email.style.border = "2px solid red";
        } else {
            email.style.border = "2px solid green"
            age.focus();
        }
    });

    age.addEventListener('blur', function() {
        validateAgeBorderForm();
    });

    this.document.forms[0].addEventListener('submit', function(e) {
        e.preventDefault();

        let data = Object.fromEntries(new FormData(e.target).entries());
        console.log(data, "data");

        if (!(isNameValid(firstName) && isNameValid(lastName) && isNameValid(address) && isEmailValid() && isAgeValid())) {
            e.preventDefault();
            firstName.focus();
        } else {
            e.preventDefault();
            RegisterPost(data);
        }
    }, ); //end of submit event
}); //end of load function

/********************functions***********************/

function validateNameBorderForm(currentInput, nextInput) {
    if (!isNameValid(currentInput)) {
        currentInput.style.border = "2px solid red";
    } else {
        currentInput.style.border = "2px solid green";
        nextInput.focus();
    }
}

function validateAgeBorderForm() {
    if (!isAgeValid()) {
        age.style.border = "2px solid red";
    } else {
        age.style.border = "2px solid green"
    }
}

// function to check the firstName,lastName,address input
function isNameValid(V) {
    var namePattern = /^[a-zA-Z-,]+$/;
    return V.value.match(namePattern);
}

// function to check the email input
function isEmailValid() {
    var emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return email.value.match(emailPattern);
}

// function to check the age input
function isAgeValid() {
    return !(isNaN(age.value) || age.value < 1 || age.value > 100);
}



//Register data 
async function RegisterPost(data) {
    if (await isUserExist(data.email)) {
        customErrorAlert("E-mail User already exist");
        return;
    } else {
        console.log(data);
        const newUsers = {
            fName: data.fname,
            lName: data.lname,
            address: data.address,
            email: data.email,
            age: data.age,
            type: "employee",
            verify: false,
            userName: '',
            password: '',
        };

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(newUsers);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const response = await fetch("http://localhost:3000/users", requestOptions);
        const result = await response.json();
        console.log(result);
        if (result) {
            await customSuccessAlert({
                title: "User created successfully",
                showConfirmButton: true,
                confirmFunction: () => {
                    window.location.href = "login.html";
                }
            });
        } else {
            customErrorAlert("Error creating user");
        }
    }
}


//check if user already exist and await result  
async function isUserExist(email) {
    const users = await getUsers();
    const user = users.find((user) => user.email === email);
    if (user) return true;
    return false;
}

//get users from server
async function getUsers() {
    const response = await fetch("http://localhost:3000/users");
    const users = await response.json();
    return users;
}