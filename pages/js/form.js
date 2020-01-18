function uploadImage(){
    console.log("inside upload")
    var formdata = new FormData();
    var image = document.getElementById('image').files
    for(var i=0;i<image.length;i++){
        formdata.append("profileImage",image[i])
    }

    $.ajax({
        url: '/uploadFile',
        type: 'POST',
        data: formdata,
        processData:false,
        contentType:false,
        success: function (data) {
            console.log('data '+ JSON.stringify(data))
        },
        error: function(err){
            console.log(err)
        }
    })
}