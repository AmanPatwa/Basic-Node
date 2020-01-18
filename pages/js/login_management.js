function proceed(){
    var cat = $('#inputMain :selected').val()
    var num = $('#inputNumber').val()
    var pass = $('#inputPassword').val()

    if(!num || !pass || cat=="You are a?" ){
        alert("Please Provide All The Details")
        return;
    }
    if (isNaN(num) || num.length != 10) {
        alert("Please Enter Valid Number");
        return;
    }
    if(cat == '1'){
        login_details = {
            cat : "MANAGEMENT",
            num : num,
            pass: pass
        }
    }
    else if(cat == '2'){
        login_details = {
            cat : "ACCOUNTANT",
            num : num,
            pass: pass
        }
    }

    $.ajax({
        url: "/auth/login",
        type: 'POST',
        data: JSON.stringify(login_details),
        dataType: 'json',
        contentType: 'application/json',
        success: function (res) {
            if(res.success){
                redirect()
            }
            else{
                alert(res.message)
            }

        }
    })

}

function redirect(){
    if(window.location.pathname === '/auth/login' ){

        window.location.href='/';

    }
}