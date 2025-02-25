const { db_Select, db_Insert } = require("./MasterModule"),
dateFormat = require('dateformat');

const notification_dtls = () => {
    return new Promise(async (resolve, reject) => {
        var select = "*",
            table_name = `td_notification`,
            whr = null,
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
            // console.log(noti_dt,'lalall');
            var ic_dt = await db_Insert('td_notification',`view_flag = 'Y', modified_by = '${data.user}', modified_dt = '${datetime}'`, null, `id = ${data.id}`, 1)
            var noti_dt = await notification_dtls();
            io.emit('send notification', noti_dt)
            resolve(ic_dt);
        });
    },
    
    noti_save: (data) => {
        return new Promise(async (resolve, reject) => {
            var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
            // console.log(noti_dt,data.bank_id,'lalall');
            var ic_dt = await db_Insert('td_notification', `(bank_id, narration, created_by, created_dt)`, `('0', '${data.msg}', '${data.user}', '${datetime}')`, null, 0)
            resolve(ic_dt);
        })
    }
}