const axios = require('axios')
const Joi = require('joi')
var otpGenerator = require('otp-generator')
const FormData = require('form-data')
const { getUserByPhoneNumber, getUserByToken, addNewUser, addNewOTP, checkOTP, updateUserData } = require('./users.service')

module.exports = {
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

    }

}