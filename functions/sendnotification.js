var FCM = require('fcm-node');
var serverKey = require('../config/turnoff-d4a5b-firebase-adminsdk-mh501-b4c75f03ee.json')
//var serverKey = 'AAAA8dFiwso:APA91bGlZbXlzZoPFGy5WnDGS8VV5AaXRhYZO6MtQVsWwEcIcG_8Map6qT3I1kp_8UpILKvtWzylAsjP2XVWn-J3OQgVF3z9et65yTewdI-JxtLJmlciF4Syx0LCweQ_L-MFLTqKZZpY'; //put your server key here
var fcm = new FCM(serverKey)

module.exports = {
    sendNotificatio: (req, res) => {
        const body = req.body
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: body.firbaseToken,
            // collapse_key: 'turnoff-d4a5b',

            notification: {
                title: 'اعلان قطعی برق موقت شما',
                body: 'سلام به جان خودم تا 15 دقیقه دیگر برق شما به مدت یکساعت قطع خواهد شد میگی نه نگاه کن!'
            },

            data: {  //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        }
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!", err)
            } else {
                console.log("ارسال انجام شده با پاسخ از سمت سرور: ", response)

                if (response.failureCount == 1)
                    return res.json({
                        success: 0,
                        messeage: "پیام به درستی ارسال نشد",
                        data: response
                    })
                if (response.failureCount == 0)
                    return res.json({
                        success: 1,
                        messeage: "پیام با موفقیت ارسال شده",
                        data: response
                    })

            }
        })
    },
    sendCastNotification: (req, res) => {
        const body = req.body
        console.log(body.registration_ids)
        var payloadMulticast = {

            registration_ids: body.registration_ids,
            // registration_ids: [
            //     'dBszBaOrRDWpVNcSrMxq-m:APA91bF9u-Dx-t3gbzNra6ZDtQpRW7u-m_j046zzCvlCcm4YxHfn9_lBvPbcGGcTMep9S7eC3KvJzK3szucpVnn9UtlPTEWUK2g10xYRF_z3rF01hwsqs6Y7VIqNoGrYYGy8DJ6O0LHl', //valid token among invalid tokens to see the error and ok response''
            // ],
            data: {
                url: "news"
            },
            // priority: 'high',
            //content_available: true,
            notification: { title: 'اعلان قطعی برق', body: 'سلام براساس برنامه امروز ساعت 14:30 به مدیت یک ساعت برق محله شما قطع خواهد شد', sound: "default", badge: "1" }
        };
        fcm.send(payloadMulticast, function (err, response) {
            //  callbackLog('sendMulticast', err, res);
            console.log(response)
            if (err) {
                console.log(err)
            } else {
                if (response.failureCount == 1) {
                    res.json({
                        success: 0,
                        messeage: "پیام به درستی ارسال نشد",
                        data: response
                    })


                }

                if (response.failureCount == 0)
                    res.json({
                        success: 1,
                        messeage: "پیام با موفقیت ارسال شده",
                        data: response
                    })

            }



        });
        return null

    },

    sendCast(data) {
        return new Promise((resolve, reject) => {
            console.log(data)
            var payloadMulticast = {

                registration_ids: [data],
                data: {
                    url: "news"
                },
                notification: { title: 'اعلان قطعی برق', body: 'سلام براساس برنامه امروز ساعت 14:30 به مدیت یک ساعت برق محله شما قطع خواهد شد', sound: "default", badge: "1" }
            };
            fcm.send(payloadMulticast, function (err, response) {
                //  callbackLog('sendMulticast', err, res);
                console.log(response)
                if (err) {
                    console.log(err)
                } else {
                    if (response.failureCount == 1)
                        console.log("Send Message Failure")
                    if (response.failureCount == 0)
                        console.log("Message Send Succesfully")
                }
            });
            resolve()
        }, 100)

    }
}