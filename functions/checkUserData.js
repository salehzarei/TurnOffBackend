const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const pool = require('../config/database')

const scheduler = new ToadScheduler()

const task = new Task('بازخوانی اطلاعات آدرس کاربران', () => {
    console.log("Fetch User Data Task!")
    console.log(Date(Date.now()))
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    // prints date & time in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);
})

getUpTimeProgram('"street":"خدادای 16"')

const job = new SimpleIntervalJob({ seconds: 30, }, task)


// fetch Data 
function getUpTimeProgram(req) {
  pool.query(`SELECT * FROM users WHERE addresses LIKE '%${JSON.stringify(req)}"%' `, (err, rows, fields) => {
      console.log(req)

        if (err) {
            console.log(err)
        }
        console.log(rows)

       // return callback(rows, err)
    })

}


var methods = {
    fetchUserData: () => {
        scheduler.addSimpleIntervalJob(job)
    },
    stopjob: () => {
        // when stopping your app
        scheduler.stop()
    }
}

module.exports = methods