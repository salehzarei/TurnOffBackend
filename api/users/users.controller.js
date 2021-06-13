const { getUserByPhoneNumber , addNewUser } = require('./users.service')

module.exports = {
    getUserByPhoneNumber: (req, res) => {
        const phone = req.params.phone
        console.log(phone)
        getUserByPhoneNumber(phone, (err, result) => {
            if (err) {
                console.log(err)
                return
            }
            if (!result) {
                return res.json({
                    success: -1,
                    messeage: "کاربری با این شماره پیدا نشد"
                })
            }
            return res.json({
                success: 1,
                data: result
            })
        })
    } ,
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