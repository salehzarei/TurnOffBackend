const axios = require('axios')
const Joi = require('joi')
var otpGenerator = require('otp-generator')
const FormData = require('form-data')
var FCM = require('fcm-node');
//var serverKey = 'AAAA8dFiwso:APA91bGlZbXlzZoPFGy5WnDGS8VV5AaXRhYZO6MtQVsWwEcIcG_8Map6qT3I1kp_8UpILKvtWzylAsjP2XVWn-J3OQgVF3z9et65yTewdI-JxtLJmlciF4Syx0LCweQ_L-MFLTqKZZpY'; //put your server key here
var serverKey = require('../../config/turnoff-d4a5b-firebase-adminsdk-mh501-b4c75f03ee.json')
var fcm = new FCM(serverKey)


const { getUserByPhoneNumber, getUserByToken, addNewUser, addNewOTP, checkOTP, updateUserData, getAdsData } = require('./users.service')


module.exports = {


    sendNotificatio: (req, res) => {

        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: 'dBszBaOrRDWpVNcSrMxq-m:APA91bF9u-Dx-t3gbzNra6ZDtQpRW7u-m_j046zzCvlCcm4YxHfn9_lBvPbcGGcTMep9S7eC3KvJzK3szucpVnn9UtlPTEWUK2g10xYRF_z3rF01hwsqs6Y7VIqNoGrYYGy8DJ6O0LHl',
            // collapse_key: 'turnoff-d4a5b',

            notification: {
                title: 'اعلان قطعی برق موقت شما',
                body: 'سلام تا 15 دقیقه دیگر برق شما به مدت یکساعت قطع خواهد شد'
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

    getUserByPhoneNumber: (req, res) => {
        const phone = req.params.phone
        // const schema = Joi.object({ phone: Joi.number() })

        // try {
        //     const value = schema.validate({});
        //     console.log(value)
        // }
        // catch (err) { }



        getUserByPhoneNumber(phone, (err, result) => {
            const otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });
            console.log(otp)
            const form = new FormData()
            form.append('receptor', String(phone));
            form.append('token', otp);
            form.append('template', 'verify')
            if (err) {
                console.log(err)
                return
            }
            if (!result) {
                return res.json({
                    success: -1,
                    messeage: "کاربری با این شماره پیدا نشد کد احراز ارسال گردید",


                }),


                    addNewOTP({ phone: phone, otp: otp }, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(result)

                    }),

                    axios.post('https://api.kavenegar.com/v1/5265387043523979774A6E2F42597A4C6768463771336F68772B78694556646957764D6A2B656B667364773D/verify/lookup.json', form, {
                        headers: form.getHeaders()
                    })
                        .then(function (response) {
                            console.log(response.data);

                        })
                        .catch(function (error) {
                            console.log(error);
                        }
                        );


            }
            return res.json({
                success: 1,
                data: result
            })
        })
    },

    getUserData: (req, res) => {
        const body = req.body
        getUserByToken(body.turnofftoken, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: 'خطا در بازیابی اطلاعات کاربر'
                })
            }

            if (!result) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: 'توکن نامعتبر است یا کاربر حذف شده'
                })
            }


            return res.status(200).json({
                success: 1,
                message: "کاربر با موفقیت یافت شد",
                data: result
            })
        })


    },


    addNewUser: (req, res) => {
        const body = req.body
        addNewUser(body, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: 'خطا در ذخیر سازی کاربر جدید'
                })
            }
            return res.status(200).json({
                success: 1,
                message: "کاربر با موفقیت اضافه شد",
                data: result

            })
        })
    },

    updateUser: (req, res) => {
        const body = req.body
        updateUserData(body, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: 'به روزرسانی با خطا مواجه شد'
                })
            }
            if (result.affectedRows == 0) {
                return res.status(500).json({
                    success: 0,
                    message: 'توکن اشتباه است یا ثبت نشده'
                })
            }
            return res.status(200).json({
                success: 1,
                message: "به روز رسانی با موفقیت انجام شد",
                data: result
            })
        })

    },

    checkOTP: (req, res) => {
        const body = req.body
        checkOTP(body, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: 'احراز هویت ناموفق بود'
                })
            }
            if (result.length != []) {
                // ثبت نام کاربر اولیه با اطلاعات خام

                const newUserBody =
                {
                    "userphone": result[0].phone,
                    "status": true,
                    "notetype": [
                        "notification"
                    ],
                    "selectedcompany": [
                        "bargh",
                    ],
                    "charge": 0,
                    "remindtime": 60,
                    "addresses": []

                }

                addNewUser(newUserBody, (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            success: 0,
                            message: 'خطا در ذخیر سازی کاربر جدید'
                        })
                    }
                    return res.status(200).json({
                        success: 1,
                        message: "کاربر با موفقیت اضافه شد",
                        data: result

                    })
                })

            }
            // اگر کد پیدا نشد یعنی اشتباه است پس
            if (result.length == []) {
                return res.status(500).json({
                    success: 0,
                    message: 'کد احراز هویت صحیح نیست،مجددا تلاش کنید',
                    data: result
                })
            }


        })

    },

    getAdsData: (req, res) => {
        const data = req.body;
        getAdsData(data, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: 'خطا در بازخوانی بنرهای تبلیغاتی'
                })
            }
            if (result.length == []) {
                return res.status(500).json({
                    success: 0,
                    message: 'بنر تبلیغاتی وجود ندارد مومن خد !',
                    data: result
                })
            }
            return res.status(200).json({
                success: 1,
                message: "بنرهای تبلیغاتی باموفقیت خوانده شدند",
                data: result

            })

        })

    }

}