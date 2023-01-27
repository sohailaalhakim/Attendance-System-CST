$(document).ready(function() {
    getDataForDatatables();

    $("#itemContainer").click(function(e){
        $("#itemContainer").hide();
    })
});

function getDataForDatatables() {

    var jsonData = {
        "data": [{
                "id": 1,
                "verify": true,
                "fName": "Mazen",
                "lName": "Mohamed",
                "age": "25",
                "email": "sooasdminsooo@gmail.com",
                "userName": "mazenn770",
                "password": "123456",
                "address": " 1234 5th Ave, New York, NY 10001",
                "type": "admin"
            },
            {
                "id": 2,
                "verify": true,
                "fName": "Mazen",
                "lName": "Mohamed",
                "age": "25",
                "email": "sooasdminsooo@gmail.com",
                "userName": "mazenn770",
                "password": "123456",
                "address": " 1234 5th Ave, New York, NY 10001",
                "type": "admin"
            },
            {
                "id": 3,
                "verify": true,
                "fName": "Mazen",
                "lName": "Mohamed",
                "age": "25",
                "email": "sooasdminsooo@gmail.com",
                "userName": "mazenn770",
                "password": "123456",
                "address": " 1234 5th Ave, New York, NY 10001",
                "type": "admin"
            },
        ]
    };
    setDataToTable(jsonData);
}

function setDataToTable(jsonData) {
    $('#employee').DataTable({
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
            { "data": "type" },
        ]
    });
}