const { db_Select, db_Insert } = require("./MasterModule"),
dateFormat = require('dateformat');

const notification_dtls = (bank_id) => {
    return new Promise(async (resolve, reject) => {
        var select = "*",
            table_name = `td_notification`,
            whr = `bank_id = '${bank_id}'`,
            order = null;
        var noti_dt = await db_Select(select, table_name, whr, order);
        resolve(noti_dt);
    });
}

module.exports = {
    notification_dtls,
    notify_flag_save: (data, io) =>{
        return new Promise(async (resolve, reject) => {
            var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
            var noti_dt = await notification_dtls(data.bank_id);
            // console.log(noti_dt,data.bank_id,'lalall');
            var ic_dt = await db_Insert('td_notification',`view_flag = 'Y', modified_by = '${data.user}', modified_dt = '${datetime}'`, null, `id = ${data.id}`, 1)
            io.emit('send notification', noti_dt)
            resolve(ic_dt);
        });
    }
}