// let verificationApprovalObj = {
//     documents: [],
//     photos: [],
//     availability: []
// };
var pageNo = 0
var pageNoT = 0
var pageNoW = 0
var pageNoF = 0
var tableA,tableT,tabeleW,tableF;
// var colaHeaders = ['name', 'email', 'city', 'status', 'doctor.name', 'clinic.clinic.clinicName', 'registeredOn']; //clinic.clinic.clinicname is not comming in populate
var colaHeaders = ['registeredOn', 'time', 'doctor.name', 'client.name', 'details', 'status'];
var dataAll = [];
var dataToday = [];
var dataWeek = [];
var dataFollow = [];
var clientData = null;
var reschedule = false;
var appointmentObject = {}

function populateAppointmentTable(data) {
    console.log('populating all', data);

    tableA = $('#viewAll').DataTable({
        paging: true,
        "autoWidth": false,
        // draw: 1,
        // processing: true,
        // serverSide: true,
        data: data,
        columns: [{
            data: colaHeaders[0],
            title: 'Date'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[1],
            title: colaHeaders[1].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[2],
            title: 'Doctor'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[3],
            title: 'patient'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[4],
            title: colaHeaders[4].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[5],
            title: colaHeaders[5].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: null,
            title: 'Actions'
        },
        ],
        "columnDefs": [{
            "targets": -1,
            className: 'dt-right',
            "data": null,
            "defaultContent": `<button class="btn"><i class="fa fa-times"></i></button>
            <button class="btn"><i class="fa fa-envelope"></i></button>
            <button class="btn"><i class="fa fa-repeat"></i></button>`
        },
        {
            "targets": 6,
            className: 'dt-right'
        }
        ],
        language: {
            searchPlaceholder: "  Search....",
            search: "",
        }
    });



    $('#viewAll tbody').on('click', 'button', function () {

        // console.log('clicked', $(this).find('i').hasClass('fa-check'));
        var data = tableA.row($(this).parents('tr')).data();

        selectedRow = tableA.row($(this).parents('tr'));
        console.log('selected:', selectedRow)

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableA.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        if ($(this).find('i').hasClass('fa-times')) {

            //cancel appointment
            console.log("inside cancel");

            cancelAppointment(data._id)



        } else if ($(this).find('i').hasClass('fa-envelope')) {

            //send sms

        } else if ($(this).find('i').hasClass('fa-repeat')) {

            //reschedule appointment
            reschedule = true
            hideOnReschedule(data.doctor.availability)
            appointmentObject = {
                "_id": data.doctor._id
            }
            $('#book_appointment_number').val(data.client.number)
            showModalClient(data.client)
            $('#bookAppointment').modal('show')
        }

    });

}

function populateTodaysAppointment(data) {
    console.log('populating todays');

    tableT = $('#todays').DataTable({
        paging: true,
        "autoWidth": false,
        // draw: 1,
        // processing: true,
        // serverSide: true,
        data: data,
        columns: [{
            data: colaHeaders[0],
            title: 'Date'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[1],
            title: colaHeaders[1].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[2],
            title: 'Doctor'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[3],
            title: 'patient'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[4],
            title: colaHeaders[4].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[5],
            title: colaHeaders[5].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: null,
            title: 'Actions'
        },
        ],
        "columnDefs": [{
            "targets": -1,
            className: 'dt-right',
            "data": null,
            "defaultContent": `<button class="btn"><i class="fa fa-times"></i></button>
            <button class="btn"><i class="fa fa-envelope"></i></button>
            <button class="btn"><i class="fa fa-repeat"></i></button>`
        },
        {
            "targets": 6,
            className: 'dt-right'
        }
        ],
        language: {
            searchPlaceholder: "  Search....",
            search: "",
        }
    });



    $('#todays tbody').on('click', 'button', function () {

        console.log('clicked', $(this).find('i').hasClass('fa-check'));
        var data = tableT.row($(this).parents('tr')).data();

        selectedRow = tableT.row($(this).parents('tr'));


        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableT.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }


        if ($(this).find('i').hasClass('fa-times')) {

            //cancel appointment
            cancelAppointment(data._id)

        } else if ($(this).find('i').hasClass('fa-envelope')) {

            //send sms

        } else if ($(this).find('i').hasClass('fa-repeat')) {

            //reschedule appointment
            reschedule = true
            hideOnReschedule(data.doctor.availability)
            appointmentObject = {
                _id: data.doctor._id
            }
            $('#book_appointment_number').val(data.client.number)
            showModalClient(data.client)
            $('#bookAppointment').modal('show')
        }

    });
}



function populateWeeksAppointment(data) {
    console.log('populating weeks');

    tableW = $('#weeks').DataTable({
        paging: true,
        "autoWidth": false,
        // draw: 1,
        // processing: true,
        // serverSide: true,
        data: data,
        columns: [{
            data: colaHeaders[0],
            title: 'Date'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[1],
            title: colaHeaders[1].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[2],
            title: 'Doctor'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[3],
            title: 'patient'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[4],
            title: colaHeaders[4].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[5],
            title: colaHeaders[5].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: null,
            title: 'Actions'
        },
        ],
        "columnDefs": [{
            "targets": -1,
            className: 'dt-right',
            "data": null,
            "defaultContent": `<button class="btn"><i class="fa fa-times"></i></button>
            <button class="btn"><i class="fa fa-envelope"></i></button>
            <button class="btn"><i class="fa fa-repeat"></i></button>`
        },
        {
            "targets": 6,
            className: 'dt-right'
        }
        ],
        language: {
            searchPlaceholder: "  Search....",
            search: "",
        }
    });



    $('#weeks tbody').on('click', 'button', function () {

        console.log('clicked', $(this).find('i').hasClass('fa-check'));
        var data = tableW.row($(this).parents('tr')).data();

        selectedRow = tableW.row($(this).parents('tr'));

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableW.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }


        if ($(this).find('i').hasClass('fa-times')) {

            //cancel appointment
            cancelAppointment(data._id)

        } else if ($(this).find('i').hasClass('fa-envelope')) {

            //send sms

        } else if ($(this).find('i').hasClass('fa-repeat')) {

            //reschedule appointment
            reschedule = true
            hideOnReschedule(data.doctor.availability)
            appointmentObject = {
                _id: data.doctor._id
            }
            $('#book_appointment_number').val(data.client.number)
            showModalClient(data.client)
            $('#bookAppointment').modal('show')
        }

    });
}

function populateFollowUpsAppointment(data) {
    console.log('populating followUps');

    tableF = $('#followUps').DataTable({
        paging: true,
        "autoWidth": false,
        // draw: 1,
        // processing: true,
        // serverSide: true,
        data: data,
        columns: [{
            data: colaHeaders[0],
            title: 'Date'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[1],
            title: colaHeaders[1].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[2],
            title: 'Doctor'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[3],
            title: 'patient'.toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[4],
            title: colaHeaders[4].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: colaHeaders[5],
            title: colaHeaders[5].toUpperCase(),
            defaultContent: 'N/A'
        },
        {
            data: null,
            title: 'Actions'
        },
        ],
        "columnDefs": [{
            "targets": -1,
            className: 'dt-right',
            "data": null,
            "defaultContent": `<button class="btn"><i class="fa fa-times"></i></button>
            <button class="btn"><i class="fa fa-envelope"></i></button>
            <button class="btn"><i class="fa fa-repeat"></i></button>`
        },
        {
            "targets": 6,
            className: 'dt-right'
        }
        ],
        language: {
            searchPlaceholder: "  Search....",
            search: "",
        }
    });



    $('#followUps tbody').on('click', 'button', function () {

        console.log('clicked', $(this).find('i').hasClass('fa-check'));
        var data = tableF.row($(this).parents('tr')).data();

        selectedRow = tableF.row($(this).parents('tr'));

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableF.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        if ($(this).find('i').hasClass('fa-times')) {

            //cancel appointment
            cancelAppointment(data._id)


        } else if ($(this).find('i').hasClass('fa-envelope')) {

            //send sms

        } else if ($(this).find('i').hasClass('fa-repeat')) {

            //reschedule appointment
            reschedule = true
            hideOnReschedule(data.doctor.availability)
            appointmentObject = {
                _id: data.doctor._id
            }
            $('#book_appointment_number').val(data.client.number)
            showModalClient(data.client)
            $('#bookAppointment').modal('show')
        }

    });
}

$(document).ready(function () {
    // $('.dropdown-item').on('click', 'a', function(e) {
    //     console.log(e.relatedTarget);
    //     if (e.relatedTarget) {
    //         $(e.relatedTarget).removeClass('active');
    //     }
    // });    

    console.log('appointments document ready');

    //TODAY TABLE

    getAppointments(pageNoT, 'TODAY')
        .then(data => data.map(el => {

            if (el.registeredOn) {


                var dateObj = new Date(el.registeredOn);
                el.time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.registeredOn = newdate;
            }
            return el;
        }))
        .then(data => {

            $('#count_today_appointments').text(data.length);
            populateTodaysAppointment(data);

        })
        .catch(err => console.log('err ', err));


    //WEEKS TABLE
    getAppointments(pageNoW, 'WEEK')
        .then(data => data.map(el => {

            if (el.registeredOn) {

                var dateObj = new Date(el.registeredOn);
                el.time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.registeredOn = newdate;
            }
            return el;
        }))
        .then(data => {

            $('#count_week_appointments').text(data.length);

            populateWeeksAppointment(data);

        })
        .catch(err => console.log('err ', err));


    // FOLLOW_UP TABLE
    getAppointments(pageNoF, 'FOLLOW_UP')
        .then(data => data.map(el => {

            if (el.registeredOn) {

                var dateObj = new Date(el.registeredOn);
                el.time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.registeredOn = newdate;
            }
            return el;
        }))
        .then(data => {
            $('#count_unclosed_entries').text(data.length);
            populateFollowUpsAppointment(data);
        })
        .catch(err => console.log('err ', err));


    // ALL TABLE
    getAppointments(pageNo)
        .then(data => data.map(el => {

            if (el.registeredOn) {

                var dateObj = new Date(el.registeredOn);
                el.time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.registeredOn = newdate;
            }
            return el;
        }))
        .then(data => {
            populateAppointmentTable(data);
        })
        .catch(err => console.log('err ', err));


});


function getAllAppointments(pageNo, status) {

    return new Promise((resolve, reject) => {


        let data = {
            pageNo: pageNo
        };

        if (status) data.status = status

        console.log(data)

        $.ajax({
            url: '/getAllAppointments',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log('data ', data);
                resolve(data.data);
            },
            error: function (err) {
                reject(err);
            }
        })
    });

}


function getAppointments(pageNo, type, status) {

    return new Promise((resolve, reject) => {


        let data = {
            pageNo: pageNo
        };

        if (status) data.status = status;
        if (type) data.type = type;

        console.log(data)

        $.ajax({
            url: '/getAppointments',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log('data ', data);
                resolve(data.data);
                if (data.nextPage && data.type == 'TODAY') {
                    getNextAppointment(pageNoT+1,data.type)
                }
                

                if (data.nextPage && data.type == 'WEEK') {
                    getNextAppointment(pageNoW+1,data.type)
                }
                
                if (data.nextPage && data.type == 'FOLLOW_UP') {
                    getNextAppointment(pageNoF+1,data.type)
                }
                

                if (data.nextPage && data.type == 'ALL') {
                    getNextAppointment(pageNo+1)
                }
                
                
            },
            error: function (err) {
                reject(err);
            }
        })
    });

}



function changePageAppointments(incVal, type, ele) {

    let pageNo = parseInt(ele.find('span').text()) - 1;

    pageNo += incVal;

    console.log('change page ', pageNo, type);


    // if(status === 'VERIFIED' && (!nextPageVerified)) return; 
    // else if( !nextPageVerifs ) return;

    if (pageNo < 0) return pageNo -= incVal;




    getAppointments(pageNo, type)
        .then(data => data.map(el => {

            if (el.registeredOn) {

                var dateObj = new Date(el.registeredOn);
                el.time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.registeredOn = newdate;
            }
            return el;
        }))
        .then(data => {


            // var datatable = (status === 'REGISTERED') ? ($('#verifs').DataTable()) : ($('#verified_table').DataTable());
            var datatable = ele.parent().find('table').DataTable();

            datatable.clear();
            datatable.rows.add(data);
            datatable.draw();

            ele.find('span').text(pageNo + 1);

        })
        .catch(err => console.log('err ', err));


}

async function selectClient() {

    var number = $('#book_appointment_number').val();
    if (!number || number.length != 10) {
        alert("Please Enter a valid number")
        return;
    }
    else {
        data = {
            number: number
        }
    }

    await $.ajax({
        url: '/manage/getClientByNumber',
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log('data ', data);
            if (data.success) {
                $('#clientDetails').show()
                showModalClient(data.data)
            }
            else {
                alert("Client Not Registered")
            }
            // resolve(data.data);
        },
        error: function (err) {
            console.log("Error while calling");
            // reject(err);
        }
    })

}

function showModalClient(data) {
    clientData = data
    $('#client_name').text(data.name)
    $('#client_number').text(data.number)
    $('#client_gender').text(data.gender)
    $('#client_city').text(data.city)
}

function cancelAppointment(id) {
    let data1 = {
        status: 'CANCELLED',
        id: id
    }

    $.ajax({
        url: '/updateAppointment',
        type: 'POST',
        data: JSON.stringify(data1),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if (selectedRow) selectedRow.remove().draw();
            // sendConfirmationSms(clientData.number,"Hello "+clientData.name+" your appointment has been booked")
            console.log('response ', data);
        },
        error: function (err) {
            alert(err.message);
        }
    });
}

function hideOnReschedule(availability) {
    clientData = null;
    $('#book_appointment_address').empty();

    $('#book_appointment_address').append('<option value="" disabled selected>&nbsp;Select Address*</option>');
    $('#book_appointment_number').val(''); //patient change later
    $('#book_appointment_date').val('');
    $('#book_appointment_details').val('');

    $('#client_name').text("");
    $('#client_number').text("");
    $('#client_gender').text("");
    $('#client_city').text("");

    for (let i = 0; i < availability.length; i++) {
        let element = availability[i];

        var opt = document.createElement("option");
        opt.value = element.address;
        opt.innerHTML = `${element.address}  (${element.from} - ${element.to})`; // whatever property it has

        // then append it to the select element
        console.log('option ', opt);

        $('#book_appointment_address').append(opt);

    }
}

function getNextAppointment(pageNo,type,status) {

    let data = {
        pageNo: pageNo
    };

    if (status) data.status = status;
    if (type) data.type = type;
    $.ajax({
        url: '/getAppointments',
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log('data ', data);
            if(data.data){
                convertToDateA(data.data)
            }
            if (data.type == 'TODAY') {
                tableT.rows.add(data.data).draw()
                if (data.nextPage){
                getNextAppointment(pageNoT+1,data.type)}
            }
            

            if (data.type == 'WEEK') {
                tableW.rows.add(data.data).draw()
                if (data.nextPage){

                getNextAppointment(pageNoW+1,data.type)}
            }
            
            if (data.type == 'FOLLOW_UP') {
                tableF.rows.add(data.data).draw()
                if (data.nextPage){
                getNextAppointment(pageNoF+1,data.type)}
            }
            

            if (data.type == 'ALL') {
                console.log("After Date");
                console.log(data.data)
                tableA.rows.add(data.data).draw()
                if (data.nextPage){
                    
                getNextAppointment(pageNo+1)}
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function convertToDateA(date){
    console.log("Inside Date");
    for(i=0;i<date.length;i++){
    console.log(date[i].registeredOn);
    
    var dateObj = new Date(date[i].registeredOn);

    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var newdate = year + "/" + month + "/" + day;

    date[i].registeredOn = newdate;
    console.log(date[i].registeredOn);
    
    }
}  