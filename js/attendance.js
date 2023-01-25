window.addEventListener("load", () => {
    //? Check if user is logged in
    chekIfUNotlogin();

    //? get user name from local storage and display it in nav bar
    getUserNameLocalStorage();


    //? attendance form submit event
    document.getElementById("attendance-form").addEventListener('submit', function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        if (data.username == "") {
            alert("Please enter username of employee to attend");
            return;
        } else {
            attendEmployeeInDataBase(data);
        }
    });

});


//? attend employee in database
async function attendEmployeeInDataBase(data) {
    const currentUser = await getUserByUsername(data.username); 
    const date = new Date().toLocaleDateString();
    console.log(currentUser,'currentUser')
    const attendanceofUser = await getAttendanceByUserIdAndDate(currentUser.id, date);
    if (currentUser.verify == false || currentUser.type == "security") {
        alert("You can't attend this user");
        return;
    } else {
        if (attendanceofUser == undefined) {
            if (data.status == "leaving") {
                alert("You can't leave before arrival");
                return;
            }
            addAttendance(data, currentUser);
        } else {
            if (data.status == "present") {
                alert("You can't attend twice");
                return;
            } else if (data.status == "leaving" && attendanceofUser.leaving != "") {
                alert("You can't leave twice");
                return;
            } else if (data.status == "absent") {
                alert("You can't absent user is already attended");
                return;
            }
            editAttendance(attendanceofUser.id);
        }
    }
}

//? add employee attendance function post request
async function addAttendance(data, user) {
    var attendance;
    if (data.status == "present") {
        attendance = {
            userId: user.id,
            date: new Date().toLocaleDateString(),
            arrival: new Date().toLocaleTimeString(),
            leaving: "",
            status: "present"
        }
    } else {
        attendance = {
            userId: user.id,
            date: new Date().toLocaleDateString(),
            arrival: "",
            leaving: "",
            status: "absent"
        }
    }
    let res = addAttendanceApi(attendance);
    if (res) {
        alert("Employee Attendance successfully");
        document.getElementById("attendance-form").reset();
        return;
    } else {
        throw new alert("Error in attendance");
    }
}


//? edit employee attendance function patch request
async function editAttendance(attendanceId) {
    var attendance = { leaving: new Date().toLocaleTimeString() };
    let res = updateAttendance(attendanceId, attendance);
    if (res) {
        alert("Employee Leaving successfully");
        document.getElementById("attendance-form").reset();
    } else {
        throw new alert("Error in leaving");
    }
}