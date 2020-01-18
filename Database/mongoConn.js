'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var dbConfig = require('../Config/db');
const dotenv = require('dotenv');
dotenv.config();


console.log('trying to connect to db...  '+process.env.NODE_ENV);

if(process.env.NODE_ENV=='prod'){
    var url=dbConfig.url;
}else if(process.env.NODE_ENV=='dev'){
    var url=dbConfig.testing_url;
}else{
    console.log("Sorry no env variable found");
    process.exit();
}



mongoose.connect(url,{
    useNewUrlParser: true
});

var mongoConn = mongoose.connection;

mongoConn.on('error', console.error.bind(console, 'Connection error: '));
mongoConn.once('open', function(callback) {
    console.log('Successfully connected to MongoDB /.');
});

autoIncrement.initialize(mongoConn);

module.exports = mongoConn;
