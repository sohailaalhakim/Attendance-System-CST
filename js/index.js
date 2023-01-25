window.addEventListener("load", () => {
    chekIfUNotlogin();
    getUserNameLocalStorage();
    displayAttendanceTabNav();



    //admin tables
    displaypendingTable();
    displayUsersTable();

    //security tables


    //employee tables
    displayDailyReport();
    displayMonthlyReportFirstTime();
    // $('#pendingTable').DataTable();



});


$("#showRangePicker").ready(
    function() {
        $("#showRangePicker").click(function() {
            whenClickedMonthlyEmpDatePicker();
        });
    }
);

//////////////////////////!/  ADMIN ////////////////////////////
//////////////////////!  PENDING Table /////////////////////////

async function displaypendingTable() {
    const userType = getUserTypeLocalStorage();
    if (userType == "admin") {
        document.getElementById("pendingContainer").style.display = "block";
        let pendingTable = document.getElementById("pendingTable");
        let pendingusers = await getPendingUsers();
        if (pendingusers.length == 0) {
            pendingTable.innerText = "No pending users...";
            pendingTable.style.textAlign = "center";
            pendingTable.style.fontSize = "20px";
            return;
        };
        let pendingTableData = pendingusers.map((user) => {
            return {
                "id": user.id,
                "fName": user.fName,
                "email": user.email,
                "age": user.age,
                "address": user.address,
                "acctions": `
                <td>
                <button onclick="acceptItem(${user.id}, '${user.email}')">Accept</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
                        `
            }
        });
        pendingTableData = { "data": pendingTableData };
        setDataToPendingTable(pendingTableData);
    } else {
        document.getElementById("pendingContainer").style.display = "none";
    }
}

function setDataToPendingTable(jsonData) {
    $('#pendingTable').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        "columns": [
            { "data": "id" },
            { "data": "fName" },
            { "data": "email" },
            { "data": "age" },
            { "data": "address" },
            { "data": "acctions" },
        ]
    });
}

const acceptItem = async(id, email) => {
    const newUserName = generateUsername();
    const newUserPassword = generatePassword();
    try {
        await sendEmail(email, newUserName, newUserPassword);
        await fetch(`http://localhost:3000/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                verify: true,
                userName: newUserName,
                password: newUserPassword,
            }),
        });
    } catch (error) {
        console.log("error", error);
    }
};
//send email
const sendEmail = async(reemail, username, password) => {
    let ebody = `Hello, <br> <br>
       Your account has been accepted. <br> <br>
       Your username is: <b>${username}</b> <br>
       Your password is: <b>${password}</b><br>
        <br><br>
        Thank you <br>
        <b>Admin</b>`;
    await Email.send({
        SecureToken: "032d4627-7f09-4455-97ed-08bf7b81f21d",
        To: reemail,
        From: "sooasdminsooo@gmail.com",
        Subject: "Username and Password for your account",
        Body: ebody,
    }).then(
        message => alert(message)
    );
};



// Generate a random @ + 8-character username
function generateUsername() {
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return "@" + username;
}


// Generate a random 6-character password
function generatePassword() {
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}


//////////////////////////!/  ADMIN ////////////////////////////
////////////////////////!  USERS Table /////////////////////////
async function displayUsersTable() {
    const data = getLocalStorageData();
    if (data.type == "admin") {
        document.getElementById("usersContainer").style.display = "block";
        const users = await getUsers();
        const allUsersTable = document.getElementById("allUsersTable");
        let employeesAndSecurity = users.filter((user) => user.type != "admin" && user.verify == true);
        if (employeesAndSecurity.length == 0) {
            allUsersTable.innerText = "No users...";
            allUsersTable.style.textAlign = "center";
            allUsersTable.style.fontSize = "20px";
            return;
        };
        let usersTableData = employeesAndSecurity.map((user) => {
            return {
                "id": user.id,
                "fName": user.fName,
                "email": user.email,
                "userName": user.userName,
                "age": user.age,
                "address": user.address,
                "acctions": `<td> <button onclick="deleteUser(${user.id})">Delete</button> </td>`
            }
        });
        usersTableData = { "data": usersTableData };
        setDataToUsersTable(usersTableData);
    } else {
        document.getElementById("usersContainer").style.display = "none";
    }
}

function setDataToUsersTable(jsonData) {
    $('#allUsersTable').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        "columns": [
            { "data": "id" },
            { "data": "fName" },
            { "data": "email" },
            { "data": "userName" },
            { "data": "age" },
            { "data": "address" },
            { "data": "acctions" },
        ]
    });
}

//////////////////////////!/  ADMIN /////////////////////////////
////////////////////////!  DAILY ALL EMPLOYEE ///////////////////
async function displayALLDialyEmpTable() {
    const data = getLocalStorageData();
    if (data.type == "admin") {
        document.getElementById("allDailyEmpContainer").style.display = "block";
        const users = await getUsers();
        const allUsersTable = document.getElementById("allDailyEmpTable");
        let employeesAndSecurity = users.filter((user) => user.type != "admin" && user.verify == true);
        if (employeesAndSecurity.length == 0) {
            allUsersTable.innerText = "No users...";
            allUsersTable.style.textAlign = "center";
            allUsersTable.style.fontSize = "20px";
            return;
        };
        let usersTableData = employeesAndSecurity.map((user) => {
            return {
                "id": user.id,
                "fName": user.fName,
                "email": user.email,
                "userName": user.userName,
                "age": user.age,
                "address": user.address,
                "acctions": `<td> <button onclick="deleteUser(${user.id})">Delete</button> </td>`
            }
        });
        usersTableData = { "data": usersTableData };
        setDataToUsersTable(usersTableData);
    } else {
        document.getElementById("allDailyEmpContainer").style.display = "none";
    }
}

function setDataToUsersTable(jsonData) {
    $('#allUsersTable').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        "columns": [
            { "data": "id" },
            { "data": "fName" },
            { "data": "email" },
            { "data": "userName" },
            { "data": "age" },
            { "data": "address" },
            { "data": "acctions" },
        ]
    });
}



//////////////////////////?/ EMPLOYEE /////////////////////////
////////////////?/ DAILY EMPLOYEE REPORTS Table ////////////////



async function displayDailyReport() {
    const data = getLocalStorageData();
    if (data.type == "employee") {
        document.getElementById("dailyEmpContainer").style.display = "block";
        const dailyEmpBody = document.getElementById("dailyEmpBody");
        let dailyEmpTable = document.getElementById("dailyEmpTable");
        const date = new Date().toLocaleDateString();
        const attendanceofUser = await getAttendanceByUserIdAndDate(data.id, date);
        if (attendanceofUser != null || attendanceofUser != undefined) {
            const row = document.createElement("tr");
            let status = getStatus(attendanceofUser.status, attendanceofUser.arrival, attendanceofUser.leaving);
            row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.fName + ' ' + data.lName}</td>
        <td>${attendanceofUser.date}</td>
        <td>${attendanceofUser.arrival}</td>
        <td>${attendanceofUser.leaving}</td>
        <td>${getLateTime(attendanceofUser.arrival)}</td>
        <td>${status}</td>`;
            dailyEmpBody.appendChild(row);
        } else {
            dailyEmpTable.innerText = "No attendance yet...";
            dailyEmpTable.style.textAlign = "center";
            dailyEmpTable.style.fontSize = "20px";
            return;
        }
    } else {
        document.getElementById("dailyEmpContainer").style.display = "none";
    }
}

// get late time difference between arrival time and attendance time
const getLateTime = (value) => {
    let lateTime = "00:00:00";
    const attendanceTime = '09:00:00';
    const time = value.split(":");
    const attendanceTimeSplit = attendanceTime.split(":");
    const hours = parseInt(time[0]) - parseInt(attendanceTimeSplit[0]);
    const minutes = parseInt(time[1]) - parseInt(attendanceTimeSplit[1]);
    const seconds = parseInt(time[2]) - parseInt(attendanceTimeSplit[2]);
    if (hours > 0) {
        lateTime = hours + ":" + minutes + ":" + seconds;
    } else if (hours == 0) {
        if (minutes > 0) {
            lateTime = hours + ":" + minutes + ":" + seconds;
        } else if (minutes == 0) {
            if (seconds > 0) {
                lateTime = hours + ":" + minutes + ":" + seconds;
            }
        }
    }
    return lateTime == "00:00:00" ? "On Time" : lateTime;
}


const getStatus = (status, arrival, leaving) => {
    if (status == 'absent') {
        return 'Absent';
    } else {
        if (isLate(arrival) && isLeavingEarly(leaving)) {
            if (leaving == "") return 'Late and Still present';
            return 'Late and Leaving Early';
        } else if (isLate(arrival)) {
            return 'Late';
        } else if (isLeavingEarly(leaving)) {
            return 'Leaving Early';
        } else {
            return 'On Time';
        }
    }
}


function isLate(value) {
    const attendanceTime = '09:00:00';
    const time = value.split(":");
    const attendanceTimeSplit = attendanceTime.split(":");
    if (time[0] > attendanceTimeSplit[0]) {
        return true;
    }
    if (time[0] == attendanceTimeSplit[0] && time[1] > attendanceTimeSplit[1]) {
        return true;
    }
    if (time[0] == attendanceTimeSplit[0] && time[1] == attendanceTimeSplit[1] && time[2] > attendanceTimeSplit[2]) {
        return true;
    }
    return false;
}

function isLeavingEarly(value) {
    const leavingTime = '17:00:00';
    const time = value.split(":");
    const leavingTimeSplit = leavingTime.split(":");
    if (time[0] < leavingTimeSplit[0]) {
        return true;
    }
    if (time[0] == leavingTimeSplit[0] && time[1] < leavingTimeSplit[1]) {
        return true;
    }
    if (time[0] == leavingTimeSplit[0] && time[1] == leavingTimeSplit[1] && time[2] < leavingTimeSplit[2]) {
        return true;
    }
    return false;
}

//////////////////////////?/  EMPLOYEE /////////////////////////
////////////////?/ Monthly EMPLOYEE REPORTS Table //////////////
//TODO:: get attendance from date to date
async function getAttendanceFromDateToDate(fromDate, toDate) {
    const start = changedateformatForDataBase(fromDate);
    const end = changedateformatForDataBase(toDate);
    const data = getLocalStorageData();
    const allUserAttendance = await getAttendanceByUserId(data.id);
    const filteredAttendance = allUserAttendance.filter(attendance => {
        const date = attendance.date;
        return date >= start && date <= end;
    });
    return filteredAttendance;
}

async function displayMonthlyReport(startInput, endInput) {
    const data = getLocalStorageData();
    if (data.type == "employee") {
        document.getElementById("monthlyEmpContainer").style.display = "block";
        const monthlyEmpBody = document.getElementById("monthlyEmpBody");
        while (monthlyEmpBody.firstChild) {
            monthlyEmpBody.removeChild(monthlyEmpBody.firstChild);
        }
        const attendances = await getAttendanceFromDateToDate(startInput, endInput);
        for (const attend of attendances) {
            let status = getStatus(attend.status, attend.arrival, attend.leaving);
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${attend.id}</td>
            <td>${data.fName + ' ' + data.lName}</td>
            <td>${attend.date}</td>
            <td>${attend.arrival}</td>
            <td>${attend.leaving}</td>
            <td>${getLateTime(attend.arrival)}</td>
            <td>${status}</td>`;
            monthlyEmpBody.appendChild(row);
        }
    } else {
        document.getElementById("monthlyEmpContainer").style.display = "none";
    }
}

function getMonthlyReport() {
    const startInput = document.getElementById("start-date").value;
    const endInput = document.getElementById("end-date").value;
    if (startInput == "" || endInput == "") {
        alert("Please select start and end date");
        return;
    } else if (startInput > endInput) {
        alert("Start date must be less than end date");
        return;
    } else {
        displayMonthlyReport(startInput, endInput);
    }
}

//TODO:: display monthly report first time
async function displayMonthlyReportFirstTime() {
    const data = getLocalStorageData();
    if(data.type != "employee")return;
    const firstDay = await getFirstAttendanceByUserId(data.id);
    const lastDay = await getLastAttendanceByUserId(data.id);
    displayMonthlyReport(firstDay.date, lastDay.date);

}

async function whenClickedMonthlyEmpDatePicker() {
    const data = getLocalStorageData();
    const startInput = document.getElementById("start-date");
    const endInput = document.getElementById("end-date");
    const startInputLapel = document.getElementsByClassName("label-start-date");
    const endInputGroup = document.getElementsByClassName("end-date-input-group");
    const firstDay = await getFirstAttendanceByUserId(data.id);
    const lastDay = await getLastAttendanceByUserId(data.id);
    if (firstDay != null && lastDay != null) {
        const f = changedateformatForInput(firstDay.date);
        const l = changedateformatForInput(lastDay.date);
        if (f == l) {
            startInput.value = f;
            endInput.style.display = "none";
            endInputGroup[0].style.display = "none";
            startInputLapel[0].innerHTML = "The only date you have attendance is: " + f;
            document.getElementById("start-date").setAttribute("min", f);
            document.getElementById("start-date").setAttribute("max", l);
            return;
        }
        document.getElementById("start-date").setAttribute("min", f);
        document.getElementById("start-date").setAttribute("max", l);
        document.getElementById("end-date").setAttribute("min", f);
        document.getElementById("end-date").setAttribute("max", l);
    }
}

function changedateformatForInput(val) {
    var date = new Date(val);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}

function changedateformatForDataBase(val) {
    var date = new Date(val);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return month + "/" + day + "/" + year;
}