require('dotenv').config()
const express = require('express')
// {use}= require('./api/users/users.router')
const app = express()
const usersRouter = require('./api/users/users.router')


// اجرای مکرر بازخوانی اطلاعات قطعی برق
const doajob = require('./functions/datacheck')
const checkUserData =  require('./functions/checkUserData')
doajob.dosomejob()
checkUserData.fetchUserData()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', usersRouter)



app.listen(process.env.APP_PORT, () => {
    console.log("Server UP and Run in Port : ", process.env.APP_PORT)
})









