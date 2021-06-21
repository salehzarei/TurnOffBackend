const express = require('express')
const router = express.Router()
const {getUserByPhoneNumber, getUserData , addNewUser ,checkOTP , updateUser ,getAdsData} = require('./users.controller')
const {sendNotificatio , sendCastNotification} = require('../../functions/sendnotification')


router.get('/users/:phone',getUserByPhoneNumber)
router.post('/users/getdata' , getUserData)
router.post('/users/addnew', addNewUser)
router.post('/users/checkotp' , checkOTP)
router.post('/users/update' , updateUser)
router.get('/ads',getAdsData)
router.post('/sendNotif',sendNotificatio)
router.post('/sendCastNotif' , sendCastNotification)



module.exports = router