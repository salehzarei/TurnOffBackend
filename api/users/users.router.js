const express = require('express')
const router = express.Router()
const {getUserByPhoneNumber , addNewUser} = require('./users.controller')


router.get('/users/:phone',getUserByPhoneNumber)
router.post('/users/addnew', addNewUser)


module.exports = router