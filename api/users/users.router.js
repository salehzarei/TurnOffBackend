const express = require('express')
const router = express.Router()
const {getUserByPhoneNumber, getUserData , addNewUser ,checkOTP , updateUser ,getAdsData , sendNotificatio} = require('./users.controller')


router.get('/users/:phone',getUserByPhoneNumber)
router.post('/users/getdata' , getUserData)
router.post('/users/addnew', addNewUser)
router.post('/users/checkotp' , checkOTP)
router.post('/users/update' , updateUser)
router.get('/ads',getAdsData)
router.post('/sendNotif',sendNotificatio)



module.exports = router