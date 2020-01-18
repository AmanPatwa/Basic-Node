const express = require('express');
const router = express.Router(),
       path = require('path') ;

const GlobalCont = require('../Controllers/GlobalController');    


router.get('/',async (req,res)=>{
    res.sendFile('/dashboard.html', { root: path.join(__dirname, '../pages/html') });
});

router.get('/uploadFile',async (req,res)=>{
    res.sendFile('/form.html', { root: path.join(__dirname, '../pages/html') });
});

router.get('/appointments',async (req,res)=>{
    res.sendFile('/dashboard.html', { root: path.join(__dirname, '../pages/html') });
});

router.get('/patients',async (req,res)=>{
    res.sendFile('/dashboard.html', { root: path.join(__dirname, '../pages/html') });
});

router.get('/account',async (req,res)=>{
    res.sendFile('/dashboard.html', { root: path.join(__dirname, '../pages/html') });
});

router.get('/settings',async (req,res)=>{
    res.sendFile('/dashboard.html', { root: path.join(__dirname, '../pages/html') });
});

router.get('/help',async (req,res)=>{
    res.sendFile('/dashboard.html', { root: path.join(__dirname, '../pages/html') });
});


// Doctor & Clinic
router.post('/getAll',GlobalCont.getAllUsers);
router.post('/getById',GlobalCont.getUserById);
router.post('/update',GlobalCont.update);
router.post('/updateNewDoctor',GlobalCont.addNewDoctorUsingCrm);
router.post('/updateNewClinic',GlobalCont.addNewClinicUsingCrm);


// Appointment
router.post('/getAppointments',GlobalCont.getAppointments);
router.post('/getAllAppointments',GlobalCont.getAllAppointments);
router.post('/updateAppointment',GlobalCont.updateAppointment);


// CLient
router.post('/getClient',GlobalCont.getClient);
router.post('/getAllClients',GlobalCont.getAllClients);
router.post('/updateClient',GlobalCont.updateClient);


router.post('/uploadFile',GlobalCont.uploadFile);
router.post('/sendSgMail',GlobalCont.sendSendGrid);

router.post('/trueCallback',GlobalCont.trueCallback);


module.exports=router;