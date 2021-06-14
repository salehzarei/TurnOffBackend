const axios = require('axios')
const FormData = require('form-data')
const { getUserByPhoneNumber, addNewUser } = require('./users.service')

module.exports = {
    getUserByPhoneNumber: (req, res) => {
        const phone = req.params.phone
        getUserByPhoneNumber(phone, (err, result) => {
            const form = new FormData()
            form.append('receptor', String(phone));
            form.append('token', '1111');
            form.append('template', 'verify')
            if (err) {
                console.log(err)
                return
            }
            if (!result) {
                return res.json.status(200)({
                    success: -1,
                    messeage: "کاربری با این شماره پیدا نشد",


                }),

                    axios.post('https://api.kavenegar.com/v1/5265387043523979774A6E2F42597A4C6768463771336F68772B78694556646957764D6A2B656B667364773D/verify/lookup.json', form, {
                        headers: form.getHeaders()
                    })
                        .then(function (response) {
                            console.log(response.data);

                        })
                        .catch(function (error) {
                            console.log(error);
                        });


            }
            return res.json({
                success: 1,
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
    }

}