const express = require('express')
const router = express.Router()
const {getUserByPhoneNumber , addNewUser ,checkOTP , updateUser} = require('./users.controller')


router.get('/users/:phone',getUserByPhoneNumber)
router.post('/users/addnew', addNewUser)
router.post('/users/checkotp' , checkOTP)
router.post('/users/update' , updateUser)


module.exports = router