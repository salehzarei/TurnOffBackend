const { json } = require('express');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const { getAllUserFireBaseToken } = require('../api/users/users.service')
const { sendCast } = require("../functions/sendnotification")

const scheduler = new ToadScheduler()
var rowsString = [];
//const task = new Task('simple task', () => { console.log("Task!") })
const task = new Task('ارسال پوشنتیفیکشن به همه اعضا', () => {
    console.log("Task!"),
        getAllUserFireBaseToken(null, (rows, err) => {
            if (err) {
                console.log(err)
            }
            // تبدیل datarow به  object
            var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
            rowsString = []
            for (var i = 0; i < resultArray.length; i++) {
                var row = rows[i];
             rowsString.push(row.firbaseToken)
             }

            /// ارسال نوتیفیکشن خودکار
            // sendCastNotification(JSON.parse(`{"body":{"registration_ids":[${JSON.stringify(rowsString)}]}}`) )
            sendCast(rowsString)
        });
})

const job = new SimpleIntervalJob({ minutes: 30, }, task)

var methods = {
    dosomejob: () => {
        scheduler.addSimpleIntervalJob(job)
    },
    stopjob: () => {
        // when stopping your app
        scheduler.stop()
    }
}

module.exports = methods