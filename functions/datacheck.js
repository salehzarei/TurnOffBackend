const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const { getAllUserFireBaseToken } = require('../api/users/users.service')

const scheduler = new ToadScheduler()

//const task = new Task('simple task', () => { console.log("Task!") })
const task = new Task('بازخوانی اطلاعات جدول قطعی', () => {
    console.log("Task!"), getAllUserFireBaseToken(null, (rows, err) => {
        if (err) {
            console.log(err)
        }
        console.log(JSON.parse(rows))
        var rowsString = "";
        // for (var i = 0; i < rows.length; i++) {
        //     var row = rows[i];
        //     if(i==0) rowsString = row.firbaseToken;
        //     else rowsString+="," + row.firbaseToken;
        // } 
    });
})

const job = new SimpleIntervalJob({ seconds: 50, }, task)

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