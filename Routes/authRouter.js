const express = require('express');
const router = express.Router();
const path = require('path');

var createCookie = require('../Controllers/authController');



//create cookie after login

router.get('/login',(req,res)=>{
    res.sendFile('/login_management.html', { root: path.join(__dirname, '../pages/html') });    
});

router.post('/login', createCookie.login,createCookie.createCookie);

module.exports=router;