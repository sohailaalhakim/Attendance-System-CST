window.addEventListener("load", () => {
    chekIfUNotlogin();
    getUserNameLocalStorage();
    displayAttendanceTabNav();


    //admin tables
    displaypendingTable();
    displayUsersTable();



    //display the daily report table for the employee and admin
    displayDailyReportFirstTime();

    //؟ Display the monthly report table for the employee and admin
    displayMonthlyReportFirstTime();



});


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////!/  ADMIN //////////////////////////////////
//////////////////////!  PENDING Table ///////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

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
                "name": user.fName + " " + user.lName,
                "email": user.email,
                "age": user.age,
                "address": user.address,
                "acctions": `
                <td>
                <button onclick="acceptItem(${user.id}, '${user.email}')"><i class="fa-solid fa-check"></i></button>
                <button type="button" onclick="deleteUser(${user.id})">&#10006;</button>
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
            { "data": "name" },
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


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////!/  ADMIN //////////////////////////////////
////////////////////////!  USERS Table ///////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

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
                "name": user.fName + " " + user.lName,
                "email": user.email,
                "userName": user.userName,
                "age": user.age,
                "address": user.address,
                "acctions": `<td> <button onclick="deleteUser(${user.id})">&#10006;</button> </td>`
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
            { "data": "name" },
            { "data": "email" },
            { "data": "userName" },
            { "data": "age" },
            { "data": "address" },
            { "data": "acctions" },
        ]
    });
}



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//*-------------------------------------------------------------------
//*--------------------- DAILY REPORTS Table  ----------------------
//*-------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//TODO:: display daily report first time
async function displayDailyReportFirstTime() {
    const date = new Date().toLocaleDateString();
    if (getUserTypeLocalStorage() == "employee") {
        displayUserDailyReport(date);
    } else {
        displayAllUserDailyReport(date);
    }
}




//////////////////////////!/  ADMIN //////////////////////////////////
////////////////////////!  DAILY ALL EMPLOYEE ////////////////////////


$("#showAllDailyDatePicker").ready(
    function() {
        $("#showAllDailyDatePicker").click(function() {
            whenClickedDailyEmpDatePicker();
        });
    }
);


async function displayAllUserDailyReport(dateInput) {
    const data = getLocalStorageData();
    if (data.type == "admin") {
        document.getElementById("allDailyEmpContainer").style.display = "block";
        const allDailyEmpTable = document.getElementById("allDailyEmpTable");
        const allDailyEmpBody = document.getElementById("allDailyEmpBody");
        const attendances = await getDailyReportByDate(dateInput);
        console.log(attendances);
        if (attendances.length == 0) {
            while (allDailyEmpBody.firstChild) {
                allDailyEmpBody.removeChild(allDailyEmpBody.firstChild);
            }
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="7" style="text-align:center; font-size:20px;">There is no attendance in this period...</td>`
            allDailyEmpBody.appendChild(row);
            return;
        } else {
            allDailyEmpBody.innerHTML = "";
        }
        let dailyUserTableData = attendances.map((attend) => {
            let status = getStatus(attend.status, attend.arrival, attend.leaving);
            return {
                "id": attend.id,
                "name": data.fName + " " + data.lName,
                "date": attend.date,
                "arrival": attend.arrival,
                "leaving": attend.leaving,
                "late_duration": getLateTime(attend.arrival),
                "status": status
            }
        });
        dailyUserTableData = { "data": dailyUserTableData };
        setDataToAllUserDailyReport(dailyUserTableData);
    } else {
        document.getElementById("allDailyEmpContainer").style.display = "none";
    }
}


function setDataToAllUserDailyReport(jsonData) {
    $('#allDailyEmpTable').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "date" },
            { "data": "arrival" },
            { "data": "leaving" },
            { "data": "late_duration" },
            { "data": "status" },
        ]
    });
}




//////////////////////////?/ EMPLOYEE /////////////////////////
////////////////?/ DAILY EMPLOYEE REPORTS Table ////////////////
$("#showDailyDatePicker").ready(
    function() {
        $("#showDailyDatePicker").click(function() {
            whenClickedDailyEmpDatePicker();
        });
    }
);

async function displayUserDailyReport(date) {
    const data = getLocalStorageData();
    if (data.type == "employee") {
        document.getElementById("dailyEmpContainer").style.display = "block";
        const dailyEmpBody = document.getElementById("dailyEmpBody");
        const dailyEmpTable = document.getElementById("dailyEmpTable");
        const attendanceofUser = await getAttendanceByUserIdAndDate(data.id, date);
        dailyEmpBody.innerText = "";
        dailyEmpBody.style.fontSize = "15px";
        console.log(attendanceofUser, "attend");
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

            console.log(row);
            //add row to table
            dailyEmpBody.appendChild(row);
        } else {
            const row = document.createElement("tr");
            row.innerHTML = ` <td colspan="7">No attendance for this day ${date}...</td>`;
            dailyEmpBody.appendChild(row);
            return;
        }
    } else {
        document.getElementById("dailyEmpContainer").style.display = "none";
    }

}


// async function displayUserDailyReport(date) {
//     const data = getLocalStorageData();
//     if (data.type == "employee") {
//         document.getElementById("dailyEmpContainer").style.display = "block";
//         const dailyEmpTable = document.getElementById("dailyEmpTable");
//         const attend = await getAttendanceByUserIdAndDate(data.id, date);
//         if (attend == null || attend == undefined) {
//             console.log("null");
//             dailyEmpTable.innerText = "No attendance yet...";
//             dailyEmpTable.style.textAlign = "center";
//             dailyEmpTable.style.fontSize = "20px";
//             return;
//         } else {
//             dailyEmpTable.innerText = "";
//             dailyEmpTable.style.fontSize = "15px";
//         }
//         const status = getStatus(attend.status, attend.arrival, attend.leaving);

//         const dailyUserTableData = {
//             "data": [{
//                 "id": attend.id,
//                 "name": data.fName + " " + data.lName,
//                 "date": attend.date,
//                 "arrival": attend.arrival,
//                 "leaving": attend.leaving,
//                 "late_duration": getLateTime(attend.arrival),
//                 "status": status
//             }]
//         };
//         setDataToUserDailyReport(dailyUserTableData);
//     } else {
//         document.getElementById("dailyEmpContainer").style.display = "none";
//     }
// }


// function setDataToUserDailyReport(jsonData) {
//     $('#dailyEmpTable').DataTable({
//         pagination: "bootstrap",
//         filter: true,
//         data: jsonData.data,
//         destroy: true,
//         lengthMenu: [5, 10, 25],
//         pageLength: 10,
//         "columns": [
//             { "data": "id" },
//             { "data": "name" },
//             { "data": "date" },
//             { "data": "arrival" },
//             { "data": "leaving" },
//             { "data": "late_duration" },
//             { "data": "status" },
//         ]
//     });
// }


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//*-------------------------------------------------------------------
//*--------------------- MONTHLY REPORTS Table  ----------------------
//*-------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


//TODO:: display monthly report first time


async function displayMonthlyReportFirstTime() {
    const data = getLocalStorageData();
    if (data.type == "employee") {
        const firstDay = await getFirstAttendanceByUserId(data.id);
        const lastDay = await getLastAttendanceByUserId(data.id);
        if (firstDay == null || lastDay == null) return;
        displayUserMonthlyReport(firstDay.date, lastDay.date);
    } else {
        const firstDay = await getFirstAttendance();
        const lastDay = await getLastAttendance();
        if (firstDay == null || lastDay == null) return;
        displayAllUserMonthlyReport(firstDay.date, lastDay.date);
    }

}




//////////////////////////!/  ADMIN //////////////////////////////////
////////////////!/ ALL Monthly EMPLOYEE REPORTS Table ////////////////

$("#showAllMonthlyRangePicker").ready(
    function() {
        $("#showAllMonthlyRangePicker").click(function() {
            whenClickedMonthlyEmpDatePicker();
        });
    }
);


//TODO:: get attendance from date to date
async function getAllUserAttendanceFromDateToDate(fromDate, toDate) {
    const start = changedateformatForDataBase(fromDate);
    const end = changedateformatForDataBase(toDate);
    const allUsersAttendance = await getAttendance();
    const filteredAttendance = allUsersAttendance.filter(attendance => {
        const date = attendance.date;
        return date >= start && date <= end;
    });
    return filteredAttendance;
}


//TODO:: display all user monthly report
async function displayAllUserMonthlyReport(startInput, endInput) {
    const data = getLocalStorageData();
    if (data.type == "admin") {
        document.getElementById("allMonthlyEmpContainer").style.display = "block";
        const allUserMonthlyEmpTable = document.getElementById("allUserMonthlyEmpTable");
        const allMonthlyEmpBody = document.getElementById("allMonthlyEmpBody");
        const attendances = await getAllUserAttendanceFromDateToDate(startInput, endInput);
        if (attendances.length == 0) {
            while (allMonthlyEmpBody.firstChild) {
                allMonthlyEmpBody.removeChild(allMonthlyEmpBody.firstChild);
            }
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="7" style="text-align:center; font-size:20px;">There is no attendance in this period...</td>`
            allMonthlyEmpBody.appendChild(row);
            return;
        } else {
            allMonthlyEmpBody.innerHTML = "";
        }





        let allMonthlyUsersTableData = await Promise.all(attendances.map(async(attend) => {
            let status = getStatus(attend.status, attend.arrival, attend.leaving);
            const userData = await getUserById(attend.id);
            return {
                "id": attend.id,
                "name": userData.fName + " " + userData.lName,
                "date": attend.date,
                "arrival": attend.arrival,
                "leaving": attend.leaving,
                "late_duration": getLateTime(attend.arrival),
                "status": status
            }
        }));
        allMonthlyUsersTableData = { "data": allMonthlyUsersTableData };
        setDataToAllUserMonthlyReport(allMonthlyUsersTableData);
    } else {
        document.getElementById("allMonthlyEmpContainer").style.display = "none";
    }
}


function setDataToAllUserMonthlyReport(jsonData) {
    $('#allUserMonthlyEmpTable').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "date" },
            { "data": "arrival" },
            { "data": "leaving" },
            { "data": "late_duration" },
            { "data": "status" },
        ]
    });
}


//////////////////////////?/  EMPLOYEE /////////////////////////
////////////////?/ Monthly EMPLOYEE REPORTS Table //////////////
$("#showRangePicker").ready(
    function() {
        $("#showRangePicker").click(function() {
            whenClickedMonthlyEmpDatePicker();
        });
    }
);




//TODO:: get attendance from date to date
async function getUserAttendanceFromDateToDate(fromDate, toDate) {
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

//TODO:: display monthly report for employee
async function displayUserMonthlyReport(startInput, endInput) {
    const data = getLocalStorageData();
    if (data.type == "employee") {
        document.getElementById("monthlyEmpContainer").style.display = "block";
        const monthlyEmpTable = document.getElementById("monthlyEmpTable");
        const monthlyEmpBody = document.getElementById("monthlyEmpBody");
        const attendances = await getUserAttendanceFromDateToDate(startInput, endInput);

        if (attendances.length == 0) {
            while (monthlyEmpBody.firstChild) {
                monthlyEmpBody.removeChild(monthlyEmpBody.firstChild);
            }
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="7" style="text-align:center; font-size:20px;">There is no attendance in this period...</td>`
            monthlyEmpBody.appendChild(row);
            return;
        } else {
            monthlyEmpBody.innerHTML = "";
        }


        let monthlyUserTableData = attendances.map((attend) => {
            let status = getStatus(attend.status, attend.arrival, attend.leaving);
            return {
                "id": attend.id,
                "name": data.fName + " " + data.lName,
                "date": attend.date,
                "arrival": attend.arrival,
                "leaving": attend.leaving,
                "late_duration": getLateTime(attend.arrival),
                "status": status
            }
        });
        monthlyUserTableData = { "data": monthlyUserTableData };
        setDataToUserMonthlyReport(monthlyUserTableData);
    } else {
        document.getElementById("monthlyEmpContainer").style.display = "none";
    }
}


function setDataToUserMonthlyReport(jsonData) {
    $('#monthlyEmpTable').DataTable({
        pagination: "bootstrap",
        filter: true,
        data: jsonData.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "date" },
            { "data": "arrival" },
            { "data": "leaving" },
            { "data": "late_duration" },
            { "data": "status" },
        ]
    });
}


///////////////////////////////////////////////////////////////////////
//*---------------------- Picker Dialog Funcation  --------------------
///////////////////////////////////////////////////////////////////////


//TODO:: Monthly Report Picker Dialog
function saveChangeMonthlyReport() {
    const startInput = document.getElementById("start-date").value;
    const endInput = document.getElementById("end-date").value;
    if (startInput == "" || endInput == "") {
        customWarningAlert("Please select start and end date");
        return;
    } else if (startInput > endInput) {
        customErrorAlert("Start date must be less than end date");
        return;
    } else {
        if (getUserTypeLocalStorage() == "employee") {
            displayUserMonthlyReport(startInput, endInput);
        } else {
            displayAllUserMonthlyReport(startInput, endInput);
        }
    }
}


async function whenClickedMonthlyEmpDatePicker() {
    const data = getLocalStorageData();
    const startInput = document.getElementById("start-date");
    const endInput = document.getElementById("end-date");
    const startInputLapel = document.getElementsByClassName("label-start-date");
    const endInputGroup = document.getElementsByClassName("end-date-input-group");


    var f;
    var l;

    if (data.type == "employee") {
        const firstDayUser = await getFirstAttendanceByUserId(data.id);
        const lastDayUser = await getLastAttendanceByUserId(data.id);
        f = changedateformatForInput(firstDayUser.date);
        l = changedateformatForInput(lastDayUser.date);
    } else {
        const firstDayAll = await getFirstAttendance();
        const lastDayAll = await getLastAttendance();
        f = changedateformatForInput(firstDayAll.date);
        l = changedateformatForInput(lastDayAll.date);
    }

    if (f == l) {
        startInput.value = f;
        endInput.style.display = "none";
        endInputGroup[0].style.display = "none";
        startInputLapel[0].innerHTML = "The only date you have attendance is: " + f;
        document.getElementById("start-date").setAttribute("min", f);
        document.getElementById("start-date").setAttribute("max", l);
        return;
    }


    if (f != null && l != null) {
        document.getElementById("start-date").setAttribute("min", f);
        document.getElementById("start-date").setAttribute("max", l);
        document.getElementById("end-date").setAttribute("min", f);
        document.getElementById("end-date").setAttribute("max", l);
    }
}

//todo:: Daily Report Picker Dialog
function saveChangeDailyReport() {
    let dateInput = document.getElementById("date-of-day").value;
    console.log(dateInput);
    if (dateInput == "") {
        customWarningAlert("Please select date");
        return;
    } else {
        dateInput = changedateformatForDataBase(dateInput);
        if (getUserTypeLocalStorage() == "employee") {
            displayUserDailyReport(dateInput);
        } else {
            displayAllUserDailyReport(dateInput);
        }
    }
}

async function whenClickedDailyEmpDatePicker() {
    const data = getLocalStorageData();
    const dateInput = document.getElementById("date-of-day");
    const dateInputLapel = document.getElementsByClassName("label-date-of-day");

    var f;
    var l;

    if (data.type == "employee") {
        const firstDayUser = await getFirstAttendanceByUserId(data.id);
        const lastDayUser = await getLastAttendanceByUserId(data.id);
        f = changedateformatForInput(firstDayUser.date);
        l = changedateformatForInput(lastDayUser.date);
    } else {
        const firstDayAll = await getFirstAttendance();
        const lastDayAll = await getLastAttendance();
        f = changedateformatForInput(firstDayAll.date);
        l = changedateformatForInput(lastDayAll.date);
    }

    if (f == l) {
        dateInput.value = f;
        dateInputLapel[0].innerHTML = "The only date you have attendance is: " + f;
        document.getElementById("date-of-day").setAttribute("min", f);
        document.getElementById("date-of-day").setAttribute("max", l);
        return;
    }

    if (f != null && l != null) {
        document.getElementById("date-of-day").setAttribute("min", f);
        document.getElementById("date-of-day").setAttribute("max", l);
    }
}



///////////////////////////////////////////////////////////////////////
//*------------------------ Change Date formate  ----------------------
///////////////////////////////////////////////////////////////////////


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


///////////////////////////////////////////////////////////////////////
//*-------------------------- Status for Report  ----------------------
///////////////////////////////////////////////////////////////////////
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