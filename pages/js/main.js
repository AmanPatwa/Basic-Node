var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var documents = ['Document', 'Credential'];
var pageNoVd = 0;
var pageNoV = 0;
var nextPageVerifs = true, nextPageVerified = true;
var clinicDetails; var doctorDetails;

let verificationApprovalObj = {
    documents: [],
    photos: [],
    availability: []
};

let selectedRow;

var table, table2;


var verificationDummy = [{
    city: "Mumbai",
    gender: "1",
    name: "test",
    number: "8828183820",
    role: "DOCTOR",
    status: "REGISTERED",
},
{
    city: "Mumbai",
    gender: "1",
    name: "test",
    number: "8828183820",
    role: "DOCTOR",
    status: "REGISTERED",
},
{
    city: "Mumbai",
    gender: "1",
    name: "test",
    number: "8828183820",
    role: "DOCTOR",
    status: "REGISTERED",
}
];

var colHeaders = ['role', 'name', 'email', 'city', 'dateRegister'];

var tableColumns = [{
    data: colHeaders[0],
    title: colHeaders[0].toUpperCase(),
    defaultContent: 'N/A'
},
{
    data: colHeaders[1],
    title: colHeaders[1].toUpperCase(),
    defaultContent: 'N/A'
},
{
    data: colHeaders[2],
    title: colHeaders[2].toUpperCase(),
    defaultContent: 'N/A'
},
{
    data: colHeaders[3],
    title: colHeaders[3].toUpperCase(),
    defaultContent: 'N/A'
},
{
    data: colHeaders[4],
    title: 'Registered On'.toUpperCase(),
    defaultContent: 'N/A'
},
{
    data: null,
    title: 'Actions'
},
];

function populateTable(data) {
    console.log('populating ', data);

    table = $('#verifs').DataTable({
        // sDom: 'lrtip',
        "scrollX": true,
        paging: true,
        "autoWidth": false,
        // draw: 1,
        // processing: true,
        // serverSide: true,
        data: data,
        columns: tableColumns,
        "columnDefs": [{
            "targets": -1,
            className: 'dt-right',
            "data": null,
            "defaultContent": `<button class="btn"><i class="fa fa-check"></i></button>
            <button class="btn"><i class="fa fa-phone"></i></button>`
        }, {
            "targets": 4,
            className: 'dt-right'
        }],
        language: {
            searchPlaceholder: "  Search....",
            search: "",
        }
    });



    $('#verifs tbody').on('click', 'button', function () {

        console.log('clicked', $(this).find('i').hasClass('fa-check'));
        var data = table.row($(this).parents('tr')).data();

        verificationApprovalObj = {
            ...data,
        };

        selectedRow = table.row($(this).parents('tr'));

        //create arrays if not exists
        if (!verificationApprovalObj.documents) verificationApprovalObj.documents = [];
        if (!verificationApprovalObj.photos) verificationApprovalObj.photos = []; //["../images/fav_icon.png","../images/fav_icon.png","../images/fav_icon.png"];
        if (!verificationApprovalObj.availability) verificationApprovalObj.availability = [];


        console.log('verificationApprovalObj ', verificationApprovalObj);

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        if ($(this).find('i').hasClass('fa-check')) {

            //verify the profile

            //show modal
            if (verificationApprovalObj.role === 'DOCTOR') {

                $("#Verif_Modal").modal('show');
                populateModal(verificationApprovalObj);
            } else {
                populateClinicModal(verificationApprovalObj);
                $('#verif_clinic_Modal').modal('show');
            }

        }
        else if ($(this).find('i').hasClass('fa-phone')) {

            // call

            console.log("number:" + verificationApprovalObj.number)
            var data = {
                to: verificationApprovalObj.number
            }

            call('/manage/call', 'POST', data)
                .then((data) => console.log(data))
                .catch((err) => console.log(err));

            // $.ajax({
            //     url: '/manage/call',
            //     type: 'POST',
            //     data: JSON.stringify(data),
            //     dataType: 'json',
            //     contentType: 'application/json',
            //     success: function (data) {
            //         console.log('data ', data);
            //         // resolve(data.data);
            //     },
            //     error: function (err) {
            //         console.log("Error while calling");
            //         // reject(err);
            //     }
            // })
            //call
        }
        else {

        }

    });

}

function populateVerifiedTable(data) {

    console.log('populating Verified ', data);

    table2 = $('#verified_table').DataTable({
        // sDom:'lrtip',
        paging: true,
        "autoWidth": false,
        // draw: 1,
        // processing: true,
        // serverSide: true,
        data: data,
        columns: tableColumns,
        "columnDefs": [{
            "targets": -1,
            className: 'dt-right',
            "data": null,
            "defaultContent": `<button class="btn"><i class="fa fa-phone"></i></button><button class="btn"><i class="fa fa-calendar-check-o"></i></button>`
        }, {
            "targets": 4,
            className: 'dt-right'
        }],
        language: {
            searchPlaceholder: "  Search....",
            search: "",
        }
    });



    $('#verified_table tbody').on('click', 'button', function () {

        console.log('clicked', $(this).find('i').hasClass('fa-check'));
        var data = table2.row($(this).parents('tr')).data();

        verificationApprovalObj = {
            ...data,
        };

        selectedRow = table2.row($(this).parents('tr'));

        //create arrays if not exists
        if (!verificationApprovalObj.documents) verificationApprovalObj.documents = [];
        if (!verificationApprovalObj.photos) verificationApprovalObj.photos = []; //["../images/fav_icon.png","../images/fav_icon.png","../images/fav_icon.png"];
        if (!verificationApprovalObj.availability) verificationApprovalObj.availability = [];


        console.log('verificationApprovalObj ', verificationApprovalObj);

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table2.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        //handle click


        if ($(this).find('i').hasClass('fa-calendar-check-o')) {

            // create appointment

            reschedule = false
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

            for (let i = 0; i < verificationApprovalObj.availability.length; i++) {
                let element = verificationApprovalObj.availability[i];

                var opt = document.createElement("option");
                opt.value = element.address;
                opt.innerHTML = `${element.address}  (${element.from} - ${element.to})`; // whatever property it has

                // then append it to the select element
                console.log('option ', opt);

                $('#book_appointment_address').append(opt);

            }
            $('#clientDetails').hide()
            $("#bookAppointment").modal('show');
        }
    });

}


$(document).ready(function () {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let i = 0; i < days.length; i++) {


        $('#day_wrapper').append(`
    
    <div class="day_row">    
    
    <div class="row mb-3">

        <div class="col-2 myDay" id="avail_${days[i]}">${days[i]}</div>

        <div class="col-2" >
            <label class="switch">
            <input type="checkbox" onclick="time($(this))" unchecked>
            <span class="slider round"></span>
            </label>
        </div>

        <div class="col-2" >
            <div class="input-group bootstrap-timepicker timepicker"
                style="z-index: 99999 !important; width:100%;">
                <input  type="text" class="form-control input-small myTimepicker timefrom">
                <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
            </div>
        </div>

        <div class="col-1 text-center">
            <span class="hideDash"> - </span>
        </div>

        <div class="col-2" >
                <div class="input-group bootstrap-timepicker timepicker"
                    style="z-index: 99999 !important;">
                    <input  type="text" class="form-control input-small myTimepicker timeto">
                    <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
                </div>
        </div>

        <div class="col-3">
            <label class="text-primary hideLabel" onclick="addAnothereHour($(this).parent())">Add Another</button>
        </div>
            
    </div>

    </div>

    `);
    }

    $('.myTimepicker').hide()
    $('.hideDash').hide()
    $('.hideLabel').hide()

    var timepickerOptions = {
        template: 'dropdown',
        appendWidgetTo: 'body',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down",
            previous: "fa fa-chevron-left",
            next: "fa fa-chevron-right",
            today: "fa fa-clock-o",
            clear: "fa fa-trash-o"
        },
    };

    $('.myTimepicker').each(function () {
        $(this).timepicker(timepickerOptions);
    });

    // $('#new_addAvailability').modal('show');


    getOverView();
    getAppointmentOverview();

    getVerifications(pageNoV)
        .then(data => data.map(el => {

            if (el.registeredOn) {

                var dateObj = new Date(el.registeredOn);

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.dateRegister = newdate;
            }
            return el;
        }))
        .then(data => {
            populateTable(data);
        })
        .catch(err => console.log('err ', err));


    getVerifications(pageNoVd, 'VERIFIED')
        .then(data => data.map(el => {

            if (el.registeredOn) {

                var dateObj = new Date(el.registeredOn);

                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();

                var newdate = year + "/" + month + "/" + day;

                el.dateRegister = newdate;
            }
            return el;
        }))
        .then(data => {
            populateVerifiedTable(data);
        })
        .catch(err => console.log('err ', err));

});

function addAnothereHour(time) {


    time.parent().after(`
    <div class="row mb-3 hideRow">
        <div class="col-4"></div>
        <div class="col-2">
            <div class="input-group bootstrap-timepicker timepicker"
                style="z-index: 99999 !important; width:100%;">
                <input  type="text" class="form-control input-small myTimepicker timefrom">
                <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
            </div>
        </div>

        <div class="col-1 text-center">
            <span class="hideDash1"> - </span>
        </div>

        <div class="col-2" >
            <div class="input-group bootstrap-timepicker timepicker"
                style="z-index: 99999 !important;">
                <input  type="text" class="form-control input-small myTimepicker timeto">
                <span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>
            </div>
        </div>
        
    `)

    var timepickerOptions = {
        template: 'dropdown',
        appendWidgetTo: 'body',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down",
            previous: "fa fa-chevron-left",
            next: "fa fa-chevron-right",
            today: "fa fa-clock-o",
            clear: "fa fa-trash-o"
        },
    };

    $('.myTimepicker').each(function () {
        $(this).timepicker(timepickerOptions);
    });

}

function time(i) {
    console.log("i", i.prop("checked"));
    console.log("dsjfk", i.parent().parent().parent().parent().find('.hideRow'));

    if (i.prop("checked")) {
        i.parent().parent().siblings().find('.myTimepicker').show()
        i.parent().parent().siblings().find('.hideDash').show()
        i.parent().parent().siblings().find('.text-primary').show()
    }
    else {
        i.parent().parent().siblings().find('.myTimepicker').hide()
        i.parent().parent().siblings().find('.hideDash').hide()
        i.parent().parent().siblings().find('.text-primary').hide()
        if (i.parent().parent().parent().parent().find('.hideRow')) {
            i.parent().parent().parent().parent().find('.hideRow').remove()
        }

        // $('.hideRow').hide()
    }
}

function getVerifications(pageNo, status, query) {

    return new Promise((resolve, reject) => {


        let data = {
            status: (status) ? (status) : ('REGISTERED'),
            pageNo: pageNo
        };

        if (query) data.query = query;

        console.log(data)

        $.ajax({
            url: '/getAll',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log('data ', data);
                resolve(data.data);
                console.log("After resolve")
                if (data.nextPage && data.status == 'REGISTERED') {
                    getNextData(data.nextPage, data.status, ++pageNoV)
                }
                if (data.nextPage && data.status == 'VERIFIED') {
                    getNextData(data.nextPage, data.status, ++pageNoVd)
                }


            },
            error: function (err) {
                reject(err);
            }
        })
    });

}


// populate Doctor modal
function populateModal(data) {

    console.log('populate modal data', data);

    if (!data._id) {
        //create new

        $('#verif_modal_approvBtn').hide();
        $('#verif_modal_regText').hide();
    } else {

        $('#verif_modal_approvBtn').show();
        $('#verif_modal_regText').show();
    }

    //populate data
    if (data.name) {
        $("#verif_modal_drName").text('Dr. ' + data.name);
    }
    else {
        $("#verif_modal_drName").text('');
    }
    if (data.dateRegister) { $("#verif_modal_regDate").text(data.dateRegister); }
    else {
        $("#verif_modal_regDate").text('');
    }

    if (data.repNo) { $("#verif_modal_repNo").val(data.repNo); }
    else { $("#verif_modal_repNo").val(''); }

    if (data.accNo) { $("#verif_modal_accNo").val(data.accNo); }
    else { $("#verif_modal_accNo").val(''); }

    if (data.number) { $("#verif_modal_number").val(data.number); }
    else { $("#verif_modal_number").val(''); }

    if (data.city) { $('#verif_modal_city').val(data.city) }
    else { $('#verif_modal_city').val('') }

    if (data.lat) { $('#verif_modal_lat').val(data.lat) }
    else { $('#verif_modal_lat').val('') }

    if (data.long) { $('#verif_modal_long').val(data.lat) }
    else { $('#verif_modal_long').val('') }

    let splitname = [];

    if (data.name) splitname = data.name.trim().split(' ');


    $('#verif_modal_fname').val(splitname[0]);

    if (splitname.length === 2) {
        $('#verif_modal_lname').val(splitname[1]);
    } else {
        $('#verif_modal_mname').val(splitname[1]);
        $('#verif_modal_lname').val(splitname[2]);

    }

    // if (data.gender === "Male") $("#verif_modal_gender").val(0);
    // if (data.gender === "Female") $("#verif_modal_gender").val(1);

    if (data.gender) $("#verif_modal_gender").val(data.gender.trim());
    data.referenceNo ? $('#verif_modal_refNo').val(data.referenceNo) : $('#verif_modal_refNo').val('')

    data.WorkingSince ? $('#verif_modal_working').val(data.WorkingSince) : $('#verif_modal_working').val('')
    data.dob ? $('#verif_modal_dob').val(data.dob) : $('#verif_modal_dob').val('')
    // if(data) $('#verif_modal_gender').val(data.gender)

    if (data.profile_photo) { $("#profile_photo").attr("src", data.profile_photo); }
    else {
        $("#profile_photo").attr("src", '../images/profile.png');
    }

    populateGrid(verificationApprovalObj.documents, $("#documentGrid"), "DOC");
    populateGrid(verificationApprovalObj.availability, $("#availGrid"), "AVAL");
    populateGrid(verificationApprovalObj.treatments, $("#treatmentGrid"), "TREAT");
    populateGrid(verificationApprovalObj.accommodations, $("#accommodationsGrid"), "ACCOMO");
    populateGrid(verificationApprovalObj.photos, $("#photoGrid"), "PHOTO");
    populateGrid(verificationApprovalObj.clinics, $("#clinicGrid"), "CLINIC");

}


// populate Clinic Modal
function populateClinicModal(data) {

    console.log('populate clinic modal data', data);


    if (!data._id) {
        //create new

        $('#verif_modal_approvBtn_clinic').hide();
        $('#verif_modal_regText_clinic').hide();

    } else {
        $('#verif_modal_approvBtn_clinic').show();
        $('#verif_modal_regText_clinic').show();

    }


    //populate data
    if (data.name) {
        $("#verif_modal_drName_clinic").text(data.name);
    }
    else { $("#verif_modal_drName_clinic").text(''); }

    if (data.dateRegister) { $("#verif_modal_regDate_clinic").text(data.dateRegister); }
    else { $("#verif_modal_regDate_clinic").text(''); }

    if (data.repNo) { $("#verif_modal_repNo_clinic").val(data.repNo); }
    else { $("#verif_modal_repNo_clinic").text(''); }

    if (data.accNo) { $("#verif_modal_accNo_clinic").val(data.accNo); }
    else { $("#verif_modal_accNo_clinic").text(''); }

    if (data.number) { $("#verif_modal_number_clinic").val(data.number); }
    else { $("#verif_modal_number_clinic").val(''); }

    if (data.clinic.clinicName) {
        $("#verif_modal_cname_clinic").val(data.clinic.clinicName);
    }
    else {
        $("#verif_modal_cname_clinic").val('');
    }
    if (data.clinic.clinicAddress) {
        $('#verif_modal_address_clinic').val(data.clinic.clinicAddress);
    }
    else {
        $('#verif_modal_address_clinic').val('');
    }
    if (data.clinic.clinicPinCode) { $('#verif_modal_pincode_clinic').val(data.clinic.clinicPinCode); }
    else {
        $('#verif_modal_pincode_clinic').val('')
    }

    let splitname = [];

    if (data.name) splitname = data.name.trim().split(' ');


    $('#verif_modal_fname_clinic').val(splitname[0]);

    if (splitname.length === 2) {
        $('#verif_modal_lname_clinic').val(splitname[1]);
    } else {
        $('#verif_modal_mname_clinic').val(splitname[1]);
        $('#verif_modal_lname_clinic').val(splitname[2]);

    }

    // if (data.gender === "Male") $("#verif_modal_gender").val(0);
    // if (data.gender === "Female") $("#verif_modal_gender").val(1);

    if (data.gender) $("#verif_modal_gender_clinic").val(data.gender.trim());
    if (data.referenceNo) $('#verif_modal_refNo_clinic').val(data.referenceNo); else $('#verif_modal_refNo_clinic').val('');
    if (data.WorkingSince) $('#verif_modal_working_clinic').val(data.WorkingSince); else $('#verif_modal_working_clinic').val('');
    if (data.dob) $('#verif_modal_dob_clinic').val(data.dob); else $('#verif_modal_dob_clinic').val('');
    // if(data) $('#verif_modal_gender').val(data.gender)

    if (data.profile_photo) { $("#profile_photo_clinic").attr("src", data.profile_photo); }
    else {
        $("#profile_photo_clinic").attr("src", '../images/profile.png');
    }

    populateGridClinic(verificationApprovalObj.documents, $("#documentGrid_clinic"), "DOC");
    populateGridClinic(verificationApprovalObj.availability, $("#availGrid_clinic"), "AVAL");
    populateGridClinic(verificationApprovalObj.treatments, $("#treatmentGrid_clinic"), "TREAT");
    populateGridClinic(verificationApprovalObj.accommodations, $("#accommodationsGrid_clinic"), "ACCOMO");
    populateGridClinic(verificationApprovalObj.photos, $("#photoGrid_clinic"), "PHOTO");
    populateGridClinic(verificationApprovalObj.doctors, $("#doctorGrid_clinic"), "DOCTOR");

}

// populate grid of doctor modal
function populateGrid(array, Grid, type) {

    let elem = ``;
    if (array) {


        if (array.length !== 0) {

            let dup = [...array];
            let newDoc = [];
            while (dup.length) newDoc.push(dup.splice(0, 3));

            for (let i = 0; i < newDoc.length; i++) {

                const row = newDoc[i];
                elem += `<div class="row verif_form_row">`;
                for (let j = 0; j < 3; j++) {
                    if (row[j]) {
                        const current = row[j];
                        let element;
                        if (type === "DOC") element = `<div class="col verif_items "><div class="row"> <b class="col-10">${current.title}</b> <button class="col-1 p-0" type="button"              onclick="delItem(verificationApprovalObj.documents,     $('#documentGrid'),     'DOC',  ${j})" style="float:right; height:30px;" id="${j}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button></div> <br>Type -  ${current.type} <br></div>`;
                        if (type === "AVAL") element = `<div class="col verif_items"><p> <b>${current.day}</b> <button type="button"                 onclick="delItem(verificationApprovalObj.availability,  $('#availGrid'),        'AVAL', ${j})" style="float:right;" id="${j + ' avail'}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button> <br> <pre>${current.timeSlots.join('\n')}</pre>${current.address} </p></div>`;
                        if (type === "TREAT") element = `<div class="col verif_items"><div class="row"> <b class="col-10">${current.treatment}</b> <button class="col-1 p-0" type="button"           onclick="delItem(verificationApprovalObj.treatments,    $('#treatmentGrid'),    'TREAT',${j})" style="float:right; height:30px;" id="${j + ' avail'}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button></div>${current.duration}<br>${current.priceFrom} - ${current.priceTo}</div>`;
                        if (type === "ACCOMO") element = `<div class="col verif_items"><p> <b>${current.accommodation_name}</b> <button type="button"  onclick="delItem(verificationApprovalObj.accommodations,$('#accommodationsGrid'),'ACCOMO',${j})" style="float:right;" id="${j + ' avail'}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button> <br>${current.accommodation_price}<br>${current.accommodation_address}</p></div>`;
                        if (type === "PHOTO") element = `<div class="col "><img src="${current}" alt="user photo" class="img-thumbnail"></div>`;
                        if (type === "DOCTOR") element = `<div class="col verif_items "><div class="row"> <b class="col-10">${current.name}</b> <button class="col-1 p-0" type="button"              onclick="delItem(verificationApprovalObj.doctors,     $('#doctorGrid_clinic'),     'DOCTOR',  ${j})" style="float:right; height:30px;" id="${j}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button></div> <br>${current.number} <br></div>`;
                        if (type === "CLINIC") element = `<div class="col verif_items "><div class="row"> <b class="col-10">${current.clinic.clinicName}</b> <button class="col-1 p-0" type="button"              onclick="delItem(verificationApprovalObj.clinics,     $('#clinicGrid'),     'CLINIC',  ${j})" style="float:right; height:30px;" id="${j}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button></div> <br>${current.number} <br> ${current.clinic.clinicPinCode}</div>`;


                        elem += element;

                    } else {
                        elem += `<div class="col"></div>`;
                    }
                }
                elem += ` </div>`;
            }

        } else if (array.length === 0) {
            elem = null;
        }

    }
    Grid.html(elem);

}

function delItem(array, Grid, type, i) {

    if (type == 'CLINIC') {
        console.log("Entire Array", array);
        console.log("Array to be deleted", array[i]);


        var data = {
            clinicId: array[i]._id,
            docId: verificationApprovalObj._id
        }


        console.log("data", data);

        call('manage/removeMapping', 'POST', data)
            .then(res => {
                console.log("response:", res);

            })
    }

    if (type == 'DOCTOR') {
        console.log("Entire Array", array);
        console.log("Array to be deleted", array[i]);
        var data = {
            clinicId: verificationApprovalObj._id,
            docId: array[i]._id
        }
        console.log("data", data);
        call('manage/removeMapping', 'POST', data)
            .then(res => {
                console.log("response:", res);

            })
    }
    array.splice(i, 1);
    populateGrid(array, Grid, type);
}

// function populateClinicModal(data) {

//     console.log('populate clinic modal data', data);


//     //populate data
//     if (data.name) {
//         $("#verif_modal_drName_clinic").text(data.name);
//     }
//     else { $("#verif_modal_drName_clinic").text(''); }

//     if (data.dateRegister) { $("#verif_modal_regDate_clinic").text(data.dateRegister); }
//     else { $("#verif_modal_regDate_clinic").text(''); }

//     if (data.repNo) { $("#verif_modal_repNo_clinic").text(data.repNo); }
//     else { $("#verif_modal_repNo_clinic").text(''); }

//     if (data.accNo) { $("#verif_modal_accNo_clinic").text(data.accNo); }
//     else { $("#verif_modal_accNo_clinic").text(''); }

//     if (data.number) { $("#verif_modal_number_clinic").text(data.number); }
//     else { $("#verif_modal_number_clinic").text(''); }

//     if (data.clinic.clinicName) {
//         $("#verif_modal_cname_clinic").val(data.clinic.clinicName);
//     }
//     else {
//         $("#verif_modal_cname_clinic").val('');
//     }
//     if (data.clinic.clinicAddress) {
//         $('#verif_modal_address_clinic').val(data.clinic.clinicAddress);
//     }
//     else {
//         $('#verif_modal_address_clinic').val('');
//     }
//     if (data.clinic.clinicPinCode) { $('#verif_modal_pincode_clinic').val(data.clinic.clinicPinCode); }
//     else {
//         $('#verif_modal_pincode_clinic').val('')
//     }

//     let splitname = [];

//     if (data.name) splitname = data.name.trim().split(' ');


//     $('#verif_modal_fname_clinic').val(splitname[0]);

//     if (splitname.length === 2) {
//         $('#verif_modal_lname_clinic').val(splitname[1]);
//     } else {
//         $('#verif_modal_mname_clinic').val(splitname[1]);
//         $('#verif_modal_lname_clinic').val(splitname[2]);

//     }

//     // if (data.gender === "Male") $("#verif_modal_gender").val(0);
//     // if (data.gender === "Female") $("#verif_modal_gender").val(1);

//     if (data.gender) $("#verif_modal_gender_clinic").val(data.gender.trim());
//     if (data.referenceNo) $('#verif_modal_refNo_clinic').val(data.referenceNo); else $('#verif_modal_refNo_clinic').val('');
//     if (data.WorkingSince) $('#verif_modal_working_clinic').val(data.WorkingSince); else $('#verif_modal_working_clinic').val('');
//     if (data.dob) $('#verif_modal_dob_clinic').val(data.dob); else $('#verif_modal_dob_clinic').val('');
//     // if(data) $('#verif_modal_gender').val(data.gender)

//     if (data.profile_photo) { $("#profile_photo_clinic").attr("src", data.profile_photo); }
//     else {
//         $("#profile_photo_clinic").attr("src", '../images/profile.png');
//     }

//     populateGridClinic(verificationApprovalObj.documents, $("#documentGrid_clinic"), "DOC");
//     populateGridClinic(verificationApprovalObj.availability, $("#availGrid_clinic"), "AVAL");
//     populateGridClinic(verificationApprovalObj.treatments, $("#treatmentGrid_clinic"), "TREAT");
//     populateGridClinic(verificationApprovalObj.accommodations, $("#accommodationsGrid_clinic"), "ACCOMO");
//     populateGridClinic(verificationApprovalObj.photos, $("#photoGrid_clinic"), "PHOTO");
//     populateGridClinic(verificationApprovalObj.doctors, $("#doctorGrid_clinic"), "DOCTOR");
// }

// populate grid of clinic modal 
function populateGridClinic(array, Grid, type) {

    let elem = ``;
    if (array) {


        if (array.length !== 0) {

            let dup = [...array];
            let newDoc = [];
            while (dup.length) newDoc.push(dup.splice(0, 3));

            for (let i = 0; i < newDoc.length; i++) {

                const row = newDoc[i];
                elem += `<div class="row verif_form_row">`;
                for (let j = 0; j < 3; j++) {
                    if (row[j]) {
                        const current = row[j];
                        let element;
                        if (type === "DOC") element = `<div class="col verif_items "><p> <b>${current.title}</b> <button type="button"              onclick="delItem(verificationApprovalObj.documents,     $('#documentGrid_clinic'),     'DOC',  ${j})" style="float:right;" id="${j}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button> <br>Type -  ${current.type} <br></p></div>`;
                        if (type === "AVAL") element = `<div class="col verif_items"><p> <b>${current.day}</b> <button type="button"                 onclick="delItem(verificationApprovalObj.availability,  $('#availGrid_clinic'),        'AVAL', ${j})" style="float:right;" id="${j + ' avail'}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button> <br><pre>${current.timeSlots.join('\n')}</pre>${current.address} </p></div>`;
                        if (type === "TREAT") element = `<div class="col verif_items"><p> <b>${current.treatment}</b> <button type="button"           onclick="delItem(verificationApprovalObj.treatments,    $('#treatmentGrid_clinic'),    'TREAT',${j})" style="float:right;" id="${j + ' avail'}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button> <br>${current.duration}<br>${current.priceFrom} - ${current.priceTo} </p></div>`;
                        if (type === "ACCOMO") element = `<div class="col verif_items"><p> <b>${current.accommodation_name}</b> <button type="button"  onclick="delItem(verificationApprovalObj.accommodations,$('#accommodationsGrid_clinic'),'ACCOMO',${j})" style="float:right;" id="${j + ' avail'}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button> <br>${current.accommodation_price}<br>${current.accommodation_address}</p></div>`;
                        if (type === "PHOTO") element = `<div class="col "><img src="${current}" alt="user photo" class="img-thumbnail"></div>`;
                        if (type === "DOCTOR") element = `<div class="col verif_items "><div class="row"> <b class="col-10">${current.name}</b> <button class="col-1 p-0" type="button"              onclick="delItem(verificationApprovalObj.doctors,     $('#doctorGrid_clinic'),     'DOCTOR',  ${j})" style="float:right; height:30px;" id="${j}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button></div> <br>${current.number} <br></div>`;
                        if (type === "CLINIC") element = `<div class="col verif_items "><div class="row"> <b class="col-10">${current.clinic.clinicName}</b> <button class="col-1 p-0" type="button"              onclick="delItem(verificationApprovalObj.clinics,     $('#clinicGrid'),     'CLINIC',  ${j})" style="float:right; height:30px;" id="${j}"><span><i class="fa fa-trash" aria-hidden="true"></i></span></button></div> <br>${current.number} <br> ${current.clinic.pincode}</div>`;

                        elem += element;

                    } else {
                        elem += `<div class="col"></div>`;
                    }
                }
                elem += ` </div>`;
            }

        } else if (array.length === 0) {
            elem = null;
        }

    }
    Grid.html(elem);

}

// validation functions
function checkWorkingSince() {
    var dob = $('#verif_modal_dob').val();
    var WorkingSince = $('#verif_modal_working').val();
    var d1 = new Date(dob);
    var d2 = new Date(WorkingSince);
    var dob_year = d1.getUTCFullYear();
    var ws_year = d2.getUTCFullYear();
    var diff = ws_year - dob_year;
    console.log(dob, WorkingSince, d1, d2, dob_year, ws_year, diff);
    if (diff >= 18) {
        return 1;
    }
    else {
        return 0;
    }

}

function checkFutureWorkingDate() {
    var today = new Date();
    var WorkingSince = $('#verif_modal_working').val();
    var ws = new Date(WorkingSince);
    console.log(today, WorkingSince, ws);
    if (ws < today) {
        return 1;
    }
    else {
        return 0;
    }

}
function checkFuturedobDate() {
    var today = new Date();
    var dob = $('#verif_modal_dob').val();
    var dob_date = new Date(dob);
    console.log(today, dob, dob_date);
    if (dob_date < today) {
        return 1;
    }
    else {
        return 0;
    }

}
function checkWorkingSinceClinic() {
    var dob = $('#verif_modal_dob_clinic').val();
    var EstablishmentDate = $('#verif_modal_dname_clinic').val();
    var d1 = new Date(dob);
    var d2 = new Date(EstablishmentDate);
    var dob_year = d1.getUTCFullYear();
    var ed_year = d2.getUTCFullYear();
    var diff = ed_year - dob_year;

    if (diff >= 18) {
        return 1;
    }
    else {
        return 0;
    }

}

function checkFutureWorkingDateClinic() {
    var today = new Date();
    var EstablishmentDate = $('#verif_modal_dname_clinic').val();
    var ed = new Date(EstablishmentDate);

    if (ed < today) {
        return 1;
    }
    else {
        return 0;
    }

}
function checkFuturedobDateClinic() {
    var today = new Date();
    var dob = $('#verif_modal_dob_clinic').val();
    var dob_date = new Date(dob);
    console.log(today, dob, dob_date);
    if (dob_date < today) {
        return 1;
    }
    else {
        return 0;
    }

}

// Approve Doctor
function approveDoctor(status) {

    if (verificationApprovalObj.role === 'DOCTOR') {

        verificationApprovalObj.name = $('#verif_modal_fname').val();
        if ($('#verif_modal_mname').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_mname').val();
        if ($('#verif_modal_lname').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_lname').val(); else return alert('enter full name');
        if (($('#verif_modal_number').val() !== '') && ($('#verif_modal_number').val().length == 10)) verificationApprovalObj.number = $('#verif_modal_number').val(); else return alert('enter valid number');
        if ($('#verif_modal_refNo').val() !== '') verificationApprovalObj.referenceNo = $('#verif_modal_refNo').val(); else return alert('enter registration number');
        if ($('#verif_modal_working').val() !== '') {
            if (checkFutureWorkingDate()) {
                if (checkWorkingSince()) {

                    verificationApprovalObj.WorkingSince = $('#verif_modal_working').val();
                }
                else {
                    return alert('minimum difference between birth and working since should be 18');

                }
            }
            else {
                return alert("enter a valid working since date");
            }
        }
        else {
            return alert('enter working since');
        }

        if ($('#verif_modal_dob').val() !== '') {
            if (checkFuturedobDate()) {
                verificationApprovalObj.dob = $('#verif_modal_dob').val();
            }
            else {
                return alert("enter a valid date of birth");
            }
        }
        else {
            return alert('enter DOB');
        }
        if ($('#verif_modal_gender').val().trim() !== '') verificationApprovalObj.gender = $('#verif_modal_gender').val().trim(); else return alert('enter gender');
        if ($('#verif_modal_fees').val() !== '') verificationApprovalObj.fees = $('#verif_modal_fees').val(); else return alert('enter fees');
        if ($('#verif_modal_city').val() !== '') verificationApprovalObj.city = $('#verif_modal_city').val(); else return alert('enter city');
        if ($('#verif_modal_lat').val() !== '' && $('#verif_modal_long').val() !== '') { verificationApprovalObj.location = {
            type: "Point",
            coordinates: [parseFloat($('#verif_modal_long').val()), parseFloat($('#verif_modal_lat').val())]
        } }
        else return alert('Latitude or Longitude Missing');
        // if ($('#verif_modal_long').val() !== '') verificationApprovalObj.long = $('#verif_modal_long').val(); else return alert('enter longitude');

        if ($('#verif_modal_repNo').val() !== '') verificationApprovalObj.repNo = $('#verif_modal_repNo').val();
        if ($('#verif_modal_accNo').val() !== '') verificationApprovalObj.accNo = $('#verif_modal_accNo').val();

    } else {
        //clinic
        let clinic = {};
        clinic.clinicName = $('#verif_modal_cname_clinic').val();
        // clinic.estdate = $('#verif_modal_dname_clinic').val();
        clinic.clinicAddress = $('#verif_modal_address_clinic').val();
        clinic.clinicPinCode = $('#verif_modal_pincode_clinic').val();
        clinic.maplink = $('#verif_modal_maplink_clinic').val();

        if (!clinic.clinicName || !clinic.clinicAddress || !clinic.clinicPinCode || !clinic.maplink) {
            return alert('enter clinic details');
        }


        verificationApprovalObj.name = $('#verif_modal_fname_clinic').val();
        if ($('#verif_modal_mname_clinic').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_mname_clinic').val();
        if ($('#verif_modal_lname_clinic').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_lname_clinic').val(); else return alert('enter full name');
        if ($('#verif_modal_dname_clinic').val() !== '') {
            if (checkFutureWorkingDateClinic()) {
                if (checkWorkingSinceClinic()) {
                    clinic.estdate = $('#verif_modal_dname_clinic').val();
                    //  verificationApprovalObj.WorkingSince = $('#verif_modal_dname_clinic').val();     
                }
                else {
                    return alert('minimum difference between birth and working since should be 18');

                }
            }
            else {
                return alert("enter a valid working since date");
            }
        }
        else {
            return alert('enter extablishment date');
        }
        if ($('#verif_modal_refNo_clinic').val() !== '') verificationApprovalObj.referenceNo = $('#verif_modal_refNo_clinic').val(); else return alert('enter registration');
        // if ($('#verif_modal_working_clinic').val() !== '') verificationApprovalObj.WorkingSince = $('#verif_modal_working_clinic').val(); else return alert('enter working since');
        // if ($('#verif_modal_dob_clinic').val() !== '') verificationApprovalObj.dob = $('#verif_modal_dob_clinic').val(); else return alert('enter DOB');
        if ($('#verif_modal_dob_clinic').val() !== '') {
            if (checkFuturedobDateClinic()) {
                verificationApprovalObj.dob = $('#verif_modal_dob_clinic').val();
            }
            else {
                return alert("enter a valid date of birth");
            }
        }
        else {
            return alert('enter DOB');
        }
        if ($('#verif_modal_gender_clinic').val().trim() !== '') verificationApprovalObj.gender = $('#verif_modal_gender_clinic').val().trim(); else return alert('enter gender');

        if (($('#verif_modal_number_clinic').val() !== '') && ($('#verif_modal_number_clinic').val().length == 10)) verificationApprovalObj.number = $('#verif_modal_number_clinic').val(); else return alert('enter correct number number');

        if ($('#verif_modal_repNo_clinic').val() !== '') verificationApprovalObj.repNo = $('#verif_modal_repNo_clinic').val();
        if ($('#verif_modal_accNo_clinic').val() !== '') verificationApprovalObj.accNo = $('#verif_modal_accNo_clinic').val();


        verificationApprovalObj.clinic = clinic;

        if (!verificationApprovalObj.doctors || verificationApprovalObj.doctors.length === 0) return alert('enter atleast one doctors');


    }

    if (!verificationApprovalObj.photos || verificationApprovalObj.photos.length === 0) return alert('enter atleast one photo');
    // if(!verificationApprovalObj.documents || verificationApprovalObj.documents.length === 0 ) return alert('enter atleast one document');
    if (!verificationApprovalObj.availability || verificationApprovalObj.availability.length === 0) return alert('enter atleast one availability');
    if (!verificationApprovalObj.treatments || verificationApprovalObj.treatments.length === 0) return alert('enter atleast one treatment');

    let hasQualification = false;

    for (let i = 0; i < verificationApprovalObj.documents.length; i++) {

        if (verificationApprovalObj.documents[i].type === 'Qualification') {
            hasQualification = true;
            break;
        }
    }

    if (!hasQualification) return alert('enter atleast one Qualification');


    var data = {
        ...verificationApprovalObj
    };

    data.status = status;

    if (verificationApprovalObj._id)
        data.id = verificationApprovalObj._id;

    console.log('data before sending', data);

    call('/update', 'POST', data)
        .then((data) => {
            console.log(data);
            console.log('response ', data);
            if (!data.success) alert('something went wrong');

        })
        .catch((err) => {
            console.log('err', err);
            alert('something went wrong');
        });

    // $.ajax({
    //     url: '/update',
    //     type: 'POST',
    //     data: JSON.stringify(data),
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function (data) {
    //         console.log('response ', data);
    //         if (!data.success) alert('something went wrong');

    //         //send sms


    //     },
    //     error: function (err) {
    //         console.log('err', err);
    //         alert('something went wrong');
    //     }
    // });

    sendConfirmationSms(verificationApprovalObj.number, "Your Profile for Claraa HealthCare has been verified");

    //close modal
    $("#Verif_Modal").modal('hide');
    $('#verif_clinic_Modal').modal('hide');

    if (selectedRow) selectedRow.remove().draw(); //updating 

    clearData();
}

function save(status, role) {




    if (verificationApprovalObj.role === 'DOCTOR') {

        verificationApprovalObj.name = $('#verif_modal_fname').val();
        if ($('#verif_modal_mname').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_mname').val(); 
        if ($('#verif_modal_lname').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_lname').val(); else return alert('enter full name');
        if (($('#verif_modal_number').val() !== '') && ($('#verif_modal_number').val().length == 10)) verificationApprovalObj.number = $('#verif_modal_number').val(); else return alert('enter valid number');
        if ($('#verif_modal_refNo').val() !== '') verificationApprovalObj.referenceNo = $('#verif_modal_refNo').val();
        if ($('#verif_modal_working').val() !== '') {
            if (checkFutureWorkingDate()) {
                if (checkWorkingSince()) {

                    verificationApprovalObj.WorkingSince = $('#verif_modal_working').val();
                }
                else {
                    return alert('minimum difference between birth and working since should be 18');

                }
            }
            else {
                return alert("enter a valid working since date");
            }
        }

        if ($('#verif_modal_dob').val() !== '') {
            if (checkFuturedobDate()) {
                verificationApprovalObj.dob = $('#verif_modal_dob').val();
            }
            else {
                return alert("enter a valid date of birth");
            }
        }

        if ($('#verif_modal_gender').val() !== null && $('#verif_modal_gender').val() !== undefined) verificationApprovalObj.gender = $('#verif_modal_gender').val().trim(); else return alert('enter gender');
        if ($('#verif_modal_fees').val() !== '') verificationApprovalObj.fees = $('#verif_modal_fees').val();
        if ($('#verif_modal_city').val() !== '') verificationApprovalObj.city = $('#verif_modal_city').val();
        if ($('#verif_modal_lat').val() !== '' && $('#verif_modal_long').val() !== '') { verificationApprovalObj.location = {
            type: "Point",
            coordinates: [parseFloat($('#verif_modal_long').val()), parseFloat($('#verif_modal_lat').val())]
        } }



        if ($('#verif_modal_repNo').val() !== '') verificationApprovalObj.repNo = $('#verif_modal_repNo').val();
        if ($('#verif_modal_accNo').val() !== '') verificationApprovalObj.accNo = $('#verif_modal_accNo').val();

    } else {
        //clinic
        let clinic = {};
        clinic.clinicName = $('#verif_modal_cname_clinic').val();
        // clinic.estdate = $('#verif_modal_dname_clinic').val();
        clinic.clinicAddress = $('#verif_modal_address_clinic').val();
        clinic.clinicPinCode = $('#verif_modal_pincode_clinic').val();
        clinic.maplink = $('#verif_modal_maplink_clinic').val();

        verificationApprovalObj.name = $('#verif_modal_fname_clinic').val();
        if ($('#verif_modal_mname_clinic').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_mname_clinic').val(); 
        if ($('#verif_modal_lname_clinic').val() !== '') verificationApprovalObj.name += ' ' + $('#verif_modal_lname_clinic').val(); else return alert('enter full name');
        if ($('#verif_modal_dname_clinic').val() !== '') {
            if (checkFutureWorkingDateClinic()) {
                if (checkWorkingSinceClinic()) {
                    clinic.estdate = $('#verif_modal_dname_clinic').val();
                    //  verificationApprovalObj.WorkingSince = $('#verif_modal_dname_clinic').val();     
                }
                else {
                    return alert('minimum difference between birth and working since should be 18');

                }
            }
            else {
                return alert("enter a valid working since date");
            }
        }

        if ($('#verif_modal_refNo_clinic').val() !== '') verificationApprovalObj.referenceNo = $('#verif_modal_refNo_clinic').val();

        if ($('#verif_modal_dob_clinic').val() !== '') {
            if (checkFuturedobDateClinic()) {
                verificationApprovalObj.dob = $('#verif_modal_dob_clinic').val();
            }
            else {
                return alert("enter a valid date of birth");
            }
        }

        if ($('#verif_modal_gender_clinic').val() !== null && $('#verif_modal_gender_clinic').val() !== undefined) verificationApprovalObj.gender = $('#verif_modal_gender_clinic').val().trim(); else return alert('enter gender');

        if (($('#verif_modal_number_clinic').val() !== '') && ($('#verif_modal_number_clinic').val().length == 10)) verificationApprovalObj.number = $('#verif_modal_number_clinic').val(); else return alert('enter valid number');

        if ($('#verif_modal_repNo_clinic').val() !== '') verificationApprovalObj.repNo = $('#verif_modal_repNo_clinic').val();
        if ($('#verif_modal_accNo_clinic').val() !== '') verificationApprovalObj.accNo = $('#verif_modal_accNo_clinic').val();


        verificationApprovalObj.clinic = clinic;

    }

    var data = {
        ...verificationApprovalObj
    };

    data.status = status;

    if (!data.registeredOn) {
        var dateObj = new Date();
        data.registeredOn = dateObj.getTime();

        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var newdate = year + "/" + month + "/" + day;

        data.dateRegister = newdate;
    }

    if (!data.role) data.role = role;

    if (verificationApprovalObj._id)
        data.id = verificationApprovalObj._id;

    console.log('data before sending', data);

    if (!verificationApprovalObj._id) {
        if (role === 'DOCTOR') {
            console.log("doctorData", data);

            call('/updateNewDoctor', 'POST', data)
                .then((data) => {
                    console.log(data);
                    console.log('response ', data);
                    if (!data.success) alert('something went wrong');

                    if (data.result[0]._id) {
                        //new saved
                        table.row.add(data.result[0]).draw();
                    }

                })
                .catch((err) => {
                    console.log('err', err);
                    alert('something went wrong');
                });
        }
        else {
            console.log("clinicData", data);

            // call('/updateNewClinic', 'POST', data)
            // .then((data) => {
            //     console.log(data);
            //     console.log('response ', data);
            //     if (!data.success) alert('something went wrong');

            //     if(data.data._id){
            //         //new saved
            //         table.row.add(data.data).draw();
            //     }

            // })
            // .catch((err) => {
            //     console.log('err', err);
            //     alert('something went wrong');
            // });
        }
    }
    else {

        call('/update', 'POST', data)
            .then((data) => {
                console.log(data);
                console.log('response ', data);
                if (!data.success) alert('something went wrong');

                if (data.data._id) {
                    //new saved
                    table.row.add(data.data).draw();
                }

            })
            .catch((err) => {
                console.log('err', err);
                alert('something went wrong');
            });
    }


    //close modal
    $("#Verif_Modal").modal('hide');
    $('#verif_clinic_Modal').modal('hide');

    if (selectedRow) selectedRow.data(data).draw(); //updating 


    //clear object
    clearData();
}

function clearData(element) {

    //clear object
    $('#verif_clinic_Modal h4').addClass('cAfter')
    $('#Verif_Modal h4').addClass('cAfter')
    verificationApprovalObj = {
        documents: [],
        photos: [],
        availability: [],
        clinic: {}
    };
    selectedRow = null;

    populateModal(verificationApprovalObj)
    populateClinicModal(verificationApprovalObj)
    clearForm($('#verif_clinic_Modal'));
    clearForm($('#Verif_Modal'));
}

function clearForm(element) {
    element.find('form').trigger("reset");
}

function getOverView() {


    call('/manage/getOverView', 'GET', null)
        .then((data) => {
            console.log(data);
            $('#count_new_registration').text(data.newReg);

            $('#count_verified_profiles').text(data.verified);

        })
        .catch((err) => console.log(err));

    // $.ajax({
    //     url: '/manage/getOverView',
    //     type: 'GET',
    //     contentType: 'application/json',
    //     success: function (data) {
    //         console.log('overview ', data);
    //         $('#count_new_registration').text(data.newReg);

    //         $('#count_verified_profiles').text(data.verified);
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     }
    // })

}


// add Document
async function uploadDoc() {

    let docJson = {};
    if ($('#inputDocType :selected').val() != '') {
        // var type = documents[$('#inputDocType :selected').val()]
        var type = $('#inputDocType :selected').val();
    } else {
        alert("Please Enter Valid Document Type")
        return
    }
    var title = $('#inputDocTitle').val()
    var formdata = new FormData();
    var f = $('#fileLabel').text()
    if (f == 'Upload file') {
        alert("Please upload valid file")
        return
    }
    console.log(JSON.stringify(f, undefined, 3))
    var image = document.getElementById('inputDocFile').files
    var details = $('#inputDocDetails').val()

    if (type == '' || title == '' || details == '') {
        alert("Enter all the details");
        return;
    }

    try {
        if (image != '') {
            for (var i = 0; i < image.length; i++) {
                formdata.append("profileImage", image[i])
            }


            await $.ajax({
                url: '/uploadFile',
                type: 'POST',
                beforeSend: function () {
                    console.log("Before Upload")
                    // $('#uploadLoad').css("display","block")
                    // $("#wait").css("display", "block");
                    $("#wait").show();
                },
                complete: function () {
                    console.log("Upload Complete")
                    // $("#wait").css("display", "none");
                    $("#wait").hide();
                },
                timeout: 10000,
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    // console.log('data '+ JSON.stringify(data,undefined,3))
                    docJson['documents'] = {
                        [type]: data.link[0]
                    }
                    console.log('data upload', data);

                    console.log("docJson" + JSON.stringify(docJson))
                },
                error: function (err) {
                    console.log(err)
                }
            })
        } else {
            alert("Please upload a valid document")
            return
        }
    } catch (err) {
        alert('File Size Too Large')
        return
    }
    console.log("Type:" + type);

    docJson.type = type
    docJson.title = title
    docJson.details = details

    $('#addDocument').modal('hide')
    $('#fileLabel').text('Upload file')
    $('#inputDocFile').val('')
    $('#inputDocType').val('')
    $('#inputDocTitle').val('')
    $('#inputDocDetails').val('')


    console.log(docJson);
    verificationApprovalObj.documents.push(docJson);
    if (verificationApprovalObj.role === 'DOCTOR') populateGrid(verificationApprovalObj.documents, $("#documentGrid"), "DOC");
    else populateGridClinic(verificationApprovalObj.documents, $("#documentGrid_clinic"), "DOC");

    clearForm($('#addDocument'));
}

// add Availability
function approveAvail() {

    let availJson = {}

    if ($('#inputAvailDay :selected').val() != '') {
        var day = days[$('#inputAvailDay :selected').val()]
    } else {
        alert("Please Enter Valid Day")
        return
    }
    // var time = $('#inputAvailTime').val()
    var from = $('#timepicker1').val();
    var to = $('#timepicker2').val();

    var address = $('#inputAvailAddress').val()
    var pincode = $('#inputAvailPincode').val()


    if (day == '' || from == '' || to == '' || address == '' || pincode == '') {
        alert("Please Enter all the details")
        return
    }

    availJson.day = day
    // availJson.time = time
    availJson.from = from
    availJson.to = to

    availJson.address = address;
    availJson.pincode = pincode;


    $('#addAvailability').modal('hide')
    $('#inputAvailDay').val('')
    $('#inputAvailTime').val('')
    $('#inputAvailAddress').val('')
    $('#inputAvailPincode').val('')

    console.log(availJson);
    verificationApprovalObj.availability.push(availJson);

    if (verificationApprovalObj.role === 'DOCTOR') populateGrid(verificationApprovalObj.availability, $("#availGrid"), "AVAL");
    else populateGridClinic(verificationApprovalObj.availability, $("#availGrid_clinic"), "AVAL");

    clearForm($('#addAvailability'));
}

// add availabiility new
function newApproveAvail() {

    // {
    //     "day": "Monday",
    //     "from": "2:15 PM",
    //     "to": "2:15 PM",
    //     "address": "A1 mercentile bank hsg society,road no.5,natwar nagar, jogeshwari (e).",
    //     "pincode": "400060"
    // }


    let address = $('#new_inputAvailAddress').val();
    let pincode = $('#new_inputAvailPincode').val();

    if (!address || !pincode || address == '' || pincode == '') {
        return alert('enter address and pincode');
    }

    let availabilities = [];

    $('#day_wrapper').children().each(function () {

        let checked = $(this).find("input[type='checkbox']").prop('checked');

        if (checked) {
            let day = $(this).find('.myDay').text();
            let from = $(this).find('.myTimepicker.timefrom').map(function () {
                console.log('this ', this);

                return $(this).val();
            }).get();

            let to = $(this).find('.myTimepicker.timeto').map(function () {
                return $(this).val();
            }).get();

            let timeSlots = [];

            for (let k = 0; k < from.length; k++) {
                timeSlots.push(`${from[k]} - ${to[k]}`);
            }

            availabilities.push({ day, from, to, address, pincode, timeSlots });
        }
    });

    console.log('availabilties ', availabilities);

    verificationApprovalObj.availability.push(...availabilities);

    $('#new_addAvailability').modal('hide');
    $('.hideRow').remove();
    $('#new_inputAvailAddress').val('');
    $('#new_inputAvailPincode').val('');

    //uncheck all 
    $('.switch').find(':checkbox:checked').trigger('click');

    if (verificationApprovalObj.role === 'DOCTOR') populateGrid(verificationApprovalObj.availability, $("#availGrid"), "AVAL");
    else populateGridClinic(verificationApprovalObj.availability, $("#availGrid_clinic"), "AVAL");

    // clearForm($('#new_addAvailability'));


}

// add Photo
async function loadPhotos(input) {

    // var input = document.getElementById('photos_add_input');

    var len = input.files.length;

    var formdata = new FormData();

    for (var i = 0; i < len; i++) {
        formdata.append("profileImage", input.files[i])
    }

    var uploadedImages = [];

    await $.ajax({
        url: '/uploadFile',
        type: 'POST',
        beforeSend: function () {
            console.log("Before Upload")
            $("#wait").show();
        },
        complete: function () {
            console.log("Upload Complete")
            $("#wait").hide();
        },
        data: formdata,
        processData: false,
        contentType: false,
        success: function (data) {
            uploadedImages = data.link;
        },
        error: function (err) {
            console.log(err)
        }
    });


    if (!verificationApprovalObj.photos) verificationApprovalObj.photos = [];

    for (let i = 0; i < uploadedImages.length; i++) {

        // verificationApprovalObj.photos.push(URL.createObjectURL(input.files[i]));
        verificationApprovalObj.photos.push(uploadedImages[i]);
    }

    if (verificationApprovalObj.role === 'DOCTOR') populateGrid(verificationApprovalObj.photos, $("#photoGrid"), "PHOTO");
    else populateGridClinic(verificationApprovalObj.photos, $("#photoGrid_clinic"), "PHOTO");

}

// change Profile Pic
async function loadProfilePhotos(input) {



    // var input = document.getElementById('profile_photo_input');

    var formdata = new FormData();

    console.log('inside upload photo ', input);
    formdata.append("profileImage", input.files[0])

    await $.ajax({
        url: '/uploadFile',
        type: 'POST',
        beforeSend: function () {
            console.log("Before Upload")
            $("#wait").show();
        },
        complete: function () {
            console.log("Upload Complete")
            $("#wait").hide();
        },
        data: formdata,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.success)
                verificationApprovalObj.profile_photo = data.link[0];

        },
        error: function (err) {
            console.log(err)
        }
    });


    if (verificationApprovalObj.role === 'DOCTOR') populateModal(verificationApprovalObj);
    else populateClinicModal(verificationApprovalObj);
}

// add Treatment
function addTreatment() {

    var treatment = $("#treatment_type_clinic").val();
    var duration = $("#treatment_duration_clinic").val();
    var priceTo = $("#treatment_price_clinic_to").val();
    var priceFrom = $("#treatment_price_clinic_from").val();
    var category = $('input[name=treatment_category_clinic]:checked').val();

    if (treatment == '' || duration == '' || priceTo == '' || priceFrom == '' || category == '') {
        alert("Please Enter all the details");
        return
    }


    if (!verificationApprovalObj.treatments) verificationApprovalObj.treatments = [];

    verificationApprovalObj.treatments.push({
        treatment,
        duration,
        priceTo,
        priceFrom,
        category
    });

    $("#addClinicTreatment").modal('hide');


    if (verificationApprovalObj.role === 'DOCTOR') populateGrid(verificationApprovalObj.treatments, $("#treatmentGrid"), "TREAT");
    else populateGridClinic(verificationApprovalObj.treatments, $("#treatmentGrid_clinic"), "TREAT");

    clearForm($('#addClinicTreatment'));

}

// add Accomodations
function addAccommodations() {

    let inputs = $('#addAccommodations_form').serializeArray();

    console.log('inputs ', inputs);

    if (!verificationApprovalObj.accommodations) verificationApprovalObj.accommodations = [];

    let accommo = {};

    for (let i = 0; i < inputs.length; i++) {
        const el = inputs[i];

        if (!el.value || el.value === '') return alert('enter ' + el.name.split('_').join(' '));
        accommo[el.name] = el.value;

    }


    verificationApprovalObj.accommodations.push(accommo);


    $("#addAccommodations").modal('hide');


    if (verificationApprovalObj.role === 'DOCTOR') populateGrid(verificationApprovalObj.accommodations, $("#accommodationsGrid"), "ACCOMO");
    else populateGridClinic(verificationApprovalObj.accommodations, $("#accommodationsGrid_clinic"), "ACCOMO");

    clearForm($('#addAccommodations'));

}


function sendConfirmationSms(number, message) {

    data = {
        number: number,
        message: message
    };
    console.log('date before sms', data);

    $.ajax({
        url: '/manage/sendSms',
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log('response of confirmation', data);
        },
        error: function (err) {
            console.log('err', err);
            alert('something went wrong');
        }
    });

}

function submitAppointment() {

    let patient = $('#book_appointment_number').val(); //patient change later
    let date = $('#book_appointment_date').val().split('-').map(el => Number(el));
    let time = $('#timepicker3').val().split(/:| /);
    let address = $('#book_appointment_address').val();
    let details = $('#book_appointment_details').val();

    // new Date(year, month, day, hours, minutes, seconds, milliseconds)

    if (!address || !details || !date || !time || !clientData) {
        return alert('fill complete info');
    }

    if (time[2] === 'PM') time[0] = Number(time[0]) + 12;

    time[1] = Number(time[1]);

    let dateObj = new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0, 0);

    var schedule = reschedule ? 'RESCHEDULED' : 'SCHEDULED'
    console.log("appointmentId", appointmentObject._id)
    var doctorId = reschedule ? appointmentObject._id : verificationApprovalObj._id

    let data = {
        address,
        details,
        registeredOn: dateObj.getTime(),
        status: schedule,
        doctor: doctorId,
        docId: doctorId,
        client: clientData._id,
    };

    console.log('appointment before sending ', data);

    call('/updateAppointment', 'POST', data)
        .then((data) => {
            sendConfirmationSms(clientData.number, "Hello " + clientData.name + " your appointment has been booked")
            console.log('response ', data);

        })
        .catch((err) => console.log(err));

    // $.ajax({
    //     url: '/updateAppointment',
    //     type: 'POST',
    //     data: JSON.stringify(data),
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function (data) {
    //         sendConfirmationSms(clientData.number, "Hello " + clientData.name + " your appointment has been booked")
    //         console.log('response ', data);
    //     },
    //     error: function (err) {
    //         alert(err.message);
    //     }
    // });

    $("#bookAppointment").modal('hide');

    clearForm($('#bookAppointment'));

}

function getAppointmentOverview() {


    call('/manage/getAppointmentOverview', 'POST')
        .then((data) => {
            console.log(data);
            $('#count_today_appointments').text(data.today)
            $('#count_week_appointments').text(data.week)
            $('#count_unclosed_entries').text(data.follow)

        })
        .catch((err) => console.log(err));

    // $.ajax({
    //     url: '/manage/getAppointmentOverview',
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function (data) {
    //         console.log("overview", data)
    //         $('#count_today_appointments').text(data.today)
    //         $('#count_week_appointments').text(data.week)
    //         $('#count_unclosed_entries').text(data.follow)
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     }
    // })
}



function getNextData(nextPage, status, pageNo) {
    console.log("next page", nextPage)
    if (!nextPage) return

    console.log("Inside Next Data");

    let data = {
        status: status,
        pageNo: pageNo
    };

    // if(query) data.query = query;

    console.log(data);

    call('/getAll', 'POST', data)
        .then((data) => {
            console.log(data);
            $('#count_today_appointments').text(data.today)
            $('#count_week_appointments').text(data.week)
            $('#count_unclosed_entries').text(data.follow)
            if (data.data) {
                convertToDate(data.data)
            }
            if (data.status == 'REGISTERED') {

                table.rows.add(data.data).draw()
                if (data.nextPage) {
                    getNextData(data.nextPage, data.status, ++pageNoV)
                }
            }
            if (data.status == 'VERIFIED') {
                table2.rows.add(data.data).draw()
                if (data.nextPage) {
                    getNextData(data.nextPage, data.status, ++pageNoVd)
                }
            }

        })
}

function convertToDate(date) {
    for (i = 0; i < date.length; i++) {
        var dateObj = new Date(date[i].registeredOn);

        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var newdate = year + "/" + month + "/" + day;

        date[i].dateRegister = newdate;
    }
}
//search doctor / Clinic by number
async function selectUser(ele, role) {

    var number = ele.val();

    if (!number || number.length != 10) {
        alert("Please Enter a valid number")
        return;
    }
    else {
        data = {
            number: number,
            role: role
        }
    }

    await $.ajax({
        url: '/manage/getUserByNumber',
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log('data ', data);
            if (data.success) {

                if (role === 'DOCTOR') {
                    doctorDetails = data.data;
                    populateDoctorInClinic(data.data);
                } else {
                    clinicDetails = data.data;
                    populateClinicInDoctor(data.data.clinic);
                }
            }
            else {

                alert(role + " Not Registered. Please Manually Enter All the Detais")
            }
            // resolve(data.data);
        },
        error: function (err) {
            console.log("Error while calling");
            // reject(err);
        }
    })
}

function populateClinicInDoctor(data) {
    $('#addClinicInDoctor').text('Add')
    $('#clinic_name_doctor').val(data.clinicName)
    $('#clinic_address_doctor').val(data.clinicAddress)
    $('#clinic_pincode_doctor').val(data.clinicPinCode)
}
function populateDoctorInClinic(data) {
    $('#addDoctorInClinic_btn').text('Add')
    $('#doctor_name_clinic').val(data.name)
    // $('#doctor_qualification_clinic').val(data.qualification)
    $('#doctor_description_clinic').val(data.description)
}

async function addClinicInDoctor() {


    if (!verificationApprovalObj.clinics) verificationApprovalObj.clinics = [];

    try {


        if ($('#addClinicInDoctor').text() == 'Create New') {

            // clinic is not present in our database

            var number = $('#clinic_number_doctor').val()
            var name = $('#clinic_name_doctor').val()
            var address = $('#clinic_address_doctor').val()
            var pincode = $('#clinic_pincode_doctor').val()

            if (!name || !address || !pincode || !number) {
                alert("Please Enter All The Details")
                return
            }

            // create a new clinic

            let data = {
                number: number,
                clinic: {
                    clinicAddress: address,
                    clinicName: name,
                    clinicPinCode: pincode
                },
                status: 'REGISTERED'
            };

            if (verificationApprovalObj._id) {
                let res = await call('/update', 'POST', data)

                if (!res.success) throw new Error('something went wrong');
                data._id = res.data._id;

                let response = await call('/manage/mapDocClinic', 'POST', { docId: verificationApprovalObj._id, clinicId: res.data._id });
                console.log('response ', response);

                if (!response.success) throw new Error('something went wrong');
            }

            verificationApprovalObj.clinics.push(data);
            populateGrid(verificationApprovalObj.clinics, $("#clinicGrid"), "CLINIC");



        }
        else {

            // clinic is  present in our database
            if (verificationApprovalObj._id) {
                if (!clinicDetails._id) throw new Error('clinicDetails Id not found');

                let response = await call('/manage/mapDocClinic', 'POST', { docId: verificationApprovalObj._id, clinicId: clinicDetails._id })

                if (!response.success) throw new Error('something went wrong');
            }
            verificationApprovalObj.clinics.push(clinicDetails);
            populateGrid(verificationApprovalObj.clinics, $("#clinicGrid"), "CLINIC");

        }

    } catch (err) { console.log('error in add Clinic in doc', err) };

    $('#addDoctorClinic').modal('hide');
    $('#addClinicInDoctor').text("Create New");

    clearForm($('#addDoctorClinic'));
}

async function addDoctorInClinic() {

    if (!verificationApprovalObj.doctors) verificationApprovalObj.doctors = [];

    try {

        if ($('#addDoctorInClinic_btn').text() == 'Create New') {

            // doctor is not present in our db

            var name = $("#doctor_name_clinic").val();
            var number = $("#add_doctor_number_clinic").val();
            // var qualification = $("#doctor_qualification_clinic").val();
            var description = $("#doctor_description_clinic").val();


            if (!name || !description || !number) {
                alert("Please Enter All The Details");
                return;
            }

            // create new doctor

            let data = {
                name: name,
                number: number,
                description: description,
                status: "REGISTERED"
            };


            let res = await call('/update', 'POST', data);


            if (!res.success) throw new Error('something went wrong');


            data._id = res.data._id;
            let response = await call('/manage/mapDocClinic', 'POST', { clinicId: verificationApprovalObj._id, docId: res.data._id });

            console.log('response ', response);

            if (!response.success) throw new Error('something went wrong');

            verificationApprovalObj.doctors.push(data);
            populateGridClinic(verificationApprovalObj.doctors, $("#doctorGrid_clinic"), "DOCTOR");



        }
        else {

            // doctor is  present in our database

            if (!doctorDetails._id) throw new Error('doctorDetails Id not found');

            let response = await call('/manage/mapDocClinic', 'POST', { docId: doctorDetails._id, clinicId: verificationApprovalObj._id })

            if (!response.success) throw new Error('something went wrong');

            verificationApprovalObj.doctors.push(doctorDetails);
            populateGridClinic(verificationApprovalObj.doctors, $("#doctorGrid_clinic"), "DOCTOR");


        }



    } catch (err) {
        console.log('error in add Clinic in doc', err)
    }


    $("#addClinicDoctor").modal('hide');
    $('#addDoctorInClinic_btn').text('Create New');

    clearForm($('#addClinicDoctor'));
}
