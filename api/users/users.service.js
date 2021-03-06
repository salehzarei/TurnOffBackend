const pool = require('../../config/database')
const jwt = require('jsonwebtoken')

module.exports = {

    getAllUserFireBaseToken: (res, callback) => {
        pool.query('SELECT `firbaseToken` FROM `users` ', (err, rows, fields) => {

            if (err) {
                return callback(err)
            }
         
            return callback(rows, err)
        })

    },

    getUserByPhoneNumber: (phone, callback) => {
        pool.query('SELECT * FROM `users` WHERE `userphone` = ?', [phone], (err, result, fields) => {

            if (err) {
                return callback(err)
            }

            return callback(null, result[0])
        })
    },

    getUserByToken: (token, callback) => {
        pool.query('SELECT * FROM `users` WHERE `userToken` = ?', [token], (err, result, fields) => {

            if (err) {
                return callback(err)
            }

            return callback(null, result[0])
        })
    },


    addNewUser: (data, callback) => {
        var notetype = JSON.stringify(data.notetype);
        var selectedcompany = JSON.stringify(data.selectedcompany)
        var addresses = JSON.stringify(data.addresses)
        pool.query(
            'INSERT INTO `users` (`userphone`, `status`, `notetype`, `selectedcompany`, `charge`, `remindtime` , `addresses` , `userToken`, `firbaseToken`) VALUES (?,?,?,?,?,?,?,?,?)', [
            data.userphone,
            data.status,
            notetype,
            selectedcompany,
            data.charge,
            data.remindtime,
            addresses,
            jwt.sign({ userToken: data.userphone }, 'turnofftoken'),
            ""
            // 'register new user'
        ], (error, result, fields) => {
            if (error) {
                return callback(error)
            }
            return callback(null, result)
        }
        )
    },

    addNewOTP: (data, callback) => {
        // اضافه کردن کد احراز هویت و شماره تماس در جدول
        pool.query('INSERT INTO `otp` (`phone`, `otp`) VALUES (?,?)', [data.phone, data.otp], (err, result, fields) => {
            if (err) { return callback(err) } return callback(null, result)
        })
    },

    checkOTP: (data, callback) => {
        // جستجو کد احراز هویت و شماره تماس در جدول
        pool.query('SELECT * FROM `otp` WHERE `phone` LIKE ? AND `otp` LIKE ?', [data.phone, data.otp], (err, result, fields) => {
            if (err) {
                return callback(err)
            } return callback(null, result)
        })
    },

    updateUserData: (data, callback) => {
        console.log(data)
        // به روز رسانی اطلاعات کاربری
        var notetype = JSON.stringify(data.notetype);
        var selectedcompany = JSON.stringify(data.selectedcompany)
        var addresses = JSON.stringify(data.addresses)
        pool.query('UPDATE `users` SET `userphone` = ?, `status` = ?, `notetype` = ?, `selectedcompany` = ?, `charge` = ? , `remindtime` = ?  , `addresses`= ? , `firbaseToken`= ?  WHERE `userToken` = ?', [
            data.userphone,
            data.status,
            notetype,
            selectedcompany,
            data.charge,
            data.remindtime,
            addresses,
            data.firbaseToken,
            data.userToken

        ], (error, result, fields) => {
            if (error) {
                return callback(error)
            }
            return callback(null, result)
        })
    },

    getAdsData: (data, callback) => {
        console.log(data)
        // لود اطلاعات بنر تبلیغاتی
        pool.query('SELECT * FROM `ads`', (err, result, fields) => {

            if (err) {
                return callback(err)
            }

            return callback(null, result)
        })
    }



}