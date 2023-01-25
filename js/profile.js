window.addEventListener("load", () => {

    //? Check if user is logged in
    chekIfUNotlogin();

    //? get user name from local storage and display it in nav bar
    getUserNameLocalStorage();

    //? display attendance tab in nav bar
    displayAttendanceTabNav();


    //? get user data from local storage and display it in profile page
    getUserData();

    //? get user image from local storage and display it in profile page
    getUserImage();

});



async function getUserData() {
    const localData = getLocalStorageData();
    const userfullname = document.getElementById("user-fullname");
    const usertype = document.getElementById("user-type");
    const useremail = document.getElementById("user-email");
    const useraddress = document.getElementById("user-address");
    const userage = document.getElementById("user-age");
    userfullname.innerHTML = localData.fName + " " + localData.lName;
    usertype.innerHTML = localData.type;
    useremail.innerHTML = localData.email;
    useraddress.innerHTML = localData.address;
    userage.innerHTML = localData.age;
}




async function getUserImage() {
    const userimage = document.getElementById("user-image");
    if (window.location.href.includes("profile.html")) {
        const userType = await getUserTypeLocalStorage();
        switch (userType) {
            case "admin":
                userimage.src = "https://icons.veryicon.com/png/o/miscellaneous/admin-dashboard-flat-multicolor/admin-roles.png";
                break;
            case "security":
                userimage.src = "https://bootdey.com/img/Content/avatar/avatar4.png";
                break;
            case "employee":
                userimage.src = "https://bootdey.com/img/Content/avatar/avatar7.png";
                break;
        }
    }
}