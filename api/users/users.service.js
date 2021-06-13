const pool = require('../../config/database')
const jwt = require('jsonwebtoken')


module.exports = {

    getUserByPhoneNumber: (phone, callback) => {
        pool.query('SELECT * FROM `users` WHERE `userphone` = ?', [phone], (err, result, fields) => {
            
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
            'INSERT INTO `users` (`userphone`, `status`, `notetype`, `selectedcompany`, `charge`, `remindtime` , `addresses` , `userToken`) VALUES (?,?,?,?,?,?,?,?)', [
            data.userphone,
            data.status,
            notetype,
            selectedcompany,
            data.charge,
            data.remindtime,
            addresses,
            jwt.sign({ userToken: data.userphone }, 'turnofftoken'),
            // 'register new user'
        ], (error, result, fields) => {
            if (error) {
                return callback(error)
            }
            return callback(null, result)
        }
        )
    },

}