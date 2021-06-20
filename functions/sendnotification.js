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
                console.log("Successfully sent with response: ", response)
               return res.json({
                success: 1,
                messeage: "پیام با موفقیت ارسال شد",
                data : response
               })
            }
        })
        // var payloadMulticast = {
        //     registration_ids:["4564654654654654",
        //         '123123123',
        //         'dBszBaOrRDWpVNcSrMxq-m:APA91bF9u-Dx-t3gbzNra6ZDtQpRW7u-m_j046zzCvlCcm4YxHfn9_lBvPbcGGcTMep9S7eC3KvJzK3szucpVnn9UtlPTEWUK2g10xYRF_z3rF01hwsqs6Y7VIqNoGrYYGy8DJ6O0LHl', //valid token among invalid tokens to see the error and ok response''
        //         '123133213123123'],
        //     data: {
        //         url: "news"
        //     },
        //     priority: 'high',
        //     content_available: true,
        //     notification: { title: 'Hello', body: 'Multicast', sound : "default", badge: "1" }
        // };
        // fcm.send(payloadMulticast,function(err,res){
        //     callbackLog('sendMulticast',err,res);
        // });

    },
}