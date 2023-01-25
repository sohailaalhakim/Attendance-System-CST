//? Local Storage

//TODO:: get local storage data
function getLocalStorageData() {
    const data = JSON.parse(localStorage.getItem("userData"));
    return data;
}

//TODO:: set local storage data
function setLocalStorageData(data) {
    localStorage.setItem("userData", JSON.stringify(data));
}

//TODO:: get user name from local storage
function getUserNameLocalStorage() {
    const data = JSON.parse(localStorage.getItem("userData"));
    document.getElementById("user-name").innerHTML = data.fName;
    return data.fName;
}

//TODO:: get user type from local storage
function getUserTypeLocalStorage() {
    const data = JSON.parse(localStorage.getItem("userData"));
    return data.type;
}

// TODO:: clear local storage
function clearLocalStorage() {
    localStorage.clear();
}

function logout() {
    localStorage.removeItem("userData");
    window.location.href = "/login.html";
}

////--------------------------------------------------------------////
//? check if user is login or not

//TODO:: check if user is not login
async function chekIfUNotlogin() {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data == null || data.isAuth == undefined) {
        await swal("You need to login first?", {
            dangerMode: true,
            buttons: true,
        });
        window.location.href = "http://127.0.0.1:5500/login.html";
    }
}

//TODO:: check if user is login
async function chekIfULogin() {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data != null && data.isAuth == true) {
        window.location.href = "http://127.0.0.1:5500/index.html";
    }
}


////--------------------------------------------------------------////
//? Server Requests (API) USERS DATA

//TODO:: get users
async function getUsers() {
    try {
        const response = await fetch("http://localhost:3000/users");
        if (response.ok) {
            const users = await response.json();
            return users;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get user by id
async function getUserById(id) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get user by username
async function getUserByUsername(uname) {
    try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        const response = await fetch(`http://localhost:3000/users?userName=${uname}`, requestOptions);
        if (response.ok) {
            const user = await response.json();
            return user[0];
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: add user
async function addUser(user) {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: update user
async function updateUser(id, data) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}


//TODO:: delete user
async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get user type by id
async function getUserTypeById(id) {
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        if (response.ok) {
            const user = await response.json();
            return user.type;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get pending users
async function getPendingUsers() {
    try {
        const response = await fetch("http://localhost:3000/users?verify=false");
        if (response.ok) {
            const users = await response.json();
            return users;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}



////--------------------------------------------------------------////
//? Server Requests (API) ATTENDANCE DATA

//TODO:: get attendance
async function getAttendance() {
    try {
        const response = await fetch("http://localhost:3000/attendance");
        if (response.ok) {
            const attendance = await response.json();
            return attendance;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: add attendance if success return true else return false
async function addAttendanceApi(attendance) {
    try {
        const response = await fetch("http://localhost:3000/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(attendance),
        });
        if (response.ok) {
            const attendance = await response.json();
            return true;
        } else {
            return false;
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: update attendance
async function updateAttendance(id, data) {
    try {
        const response = await fetch(`http://localhost:3000/attendance/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const attendance = await response.json();
            return true;
        } else {
            return false;
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get attendance by user id
async function getAttendanceByUserId(id) {
    try {
        const response = await fetch(`http://localhost:3000/attendance?userId=${id}`);
        if (response.ok) {
            const attendance = await response.json();
            return attendance;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}


//TODO:: get attendance by user id and date
async function getAttendanceByUserIdAndDate(id, date) {
    try {
        const response = await fetch(`http://localhost:3000/attendance?userId=${id}&date=${date}`);
        if (response.ok) {
            const attendance = await response.json();
            return attendance[0];
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get first attendance by user id
async function getFirstAttendanceByUserId(id) {
    try {
        const response = await fetch(`http://localhost:3000/attendance?userId=${id}&_sort=date&_order=asc&_limit=1`);
        if (response.ok) {
            const attendance = await response.json();
            return attendance[0];
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

//TODO:: get last attendance by user id
async function getLastAttendanceByUserId(id) {
    try {
        const response = await fetch(`http://localhost:3000/attendance?userId=${id}&_sort=date&_order=desc&_limit=1`);
        if (response.ok) {
            const attendance = await response.json();
            return attendance[0];
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}



////--------------------------------------------------------------////

//TODO:: Display Attendance Tab Nav
async function displayAttendanceTabNav() {
    const reAttendance = document.getElementById("re-attendance");
    const userType = getUserTypeLocalStorage();
    if (userType == "admin" || userType == "security") {
        reAttendance.style.display = "block";
    }
}