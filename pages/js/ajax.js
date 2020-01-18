


function call(url,type,data){

    return new Promise((resolve,reject) => {
        $.ajax({
            url: url,
            type: type,
            data: data?JSON.stringify(data):null,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                //console.log('data ', data);
                resolve(data);
            },
            error: function (err) {
                //console.log("Error while calling"+ err);
                reject(err);
            }
        });
    });
}
