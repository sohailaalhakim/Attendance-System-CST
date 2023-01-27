window.addEventListener("load", () => {
    //? Check if user is logged in
    chekIfUNotlogin();

    //? get user name from local storage and display it in nav bar
    getUserNameLocalStorage();


    //? attendance form submit event
    document.getElementById("attendance-form").addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        if (data.username == "") {
            customErrorAlert("Please enter username of employee to attend");

        } else {
            await attendEmployeeInDataBase(data);
        }
    });

});


//? attend employee in database
async function attendEmployeeInDataBase(data) {
    const currentUser = await getUserByUsername(data.username);
    const date = new Date().toLocaleDateString();
    console.log(currentUser, 'currentUser')
    const attendanceofUser = await getAttendanceByUserIdAndDate(currentUser.id, date);
    if (currentUser.verify == false || currentUser.type == "security") {
        customWarningAlert("You can't attend this user");
        return;
    } else {
        if (attendanceofUser == undefined) {
            if (data.status == "leaving") {
                customWarningAlert("You can't leave before arrival");
                return;
            }
            await addAttendance(data, currentUser);
        } else {
            if (data.status == "present") {
                customErrorAlert("You can't attend twice");
                return;
            } else if (data.status == "leaving" && attendanceofUser.leaving != "") {
                customErrorAlert("You can't leave twice");
                return;
            } else if (data.status == "absent") {
                customWarningAlert("You can't be absent user is already attended");

                return;
            }
            await editAttendance(attendanceofUser.id);
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

    const res = await addAttendanceApi(attendance);
    if (res) {
        // document.getElementById("attendance-form").reset();
        await customSuccessAlert({ title: "Employee Attendance successfully", timer: 20000 });

        // cancel reload page

        return;
    } else {
        throw new customErrorAlert("Error in attendance");
    }
}


//? edit employee attendance function patch request
async function editAttendance(attendanceId) {
    var attendance = { leaving: new Date().toLocaleTimeString() };
    let res = await updateAttendance(attendanceId, attendance);
    if (res) {
        // document.getElementById("attendance-form").reset();
        await customSuccessAlert({ title: "Employee Attendance successfully", timer: 20000 });
        return;
    } else {
        throw new customErrorAlert("Error in leaving");
    }
}