const { db_Select, db_Insert } = require("./MasterModule"),
dateFormat = require('dateformat');

module.exports = {
    notification_dtls: (bank_id) => {
        return new Promise(async (resolve, reject) => {
            var select = "*",
                table_name = `td_notification`,
                whr = `bank_id = '${bank_id}'`,
                order = null;
            var noti_dt = await db_Select(select, table_name, whr, order);
            resolve(noti_dt);
        });
    },

    notify_flag_save: (data, io) =>{
        return new Promise(async (resolve, reject) => {
            var datetime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
            var select = "view_flag",
                table_name = `td_notification`,
                whr = `bank_id = '${bank_id}'`,
                order = null;
            var noti_dt = await db_Select(select, table_name, whr, order);
            var ic_dt = await db_Insert('td_notification',`view_flag = 'Y', modified_by = '${data.user}',   modified_dt = '${datetime}'`, null, `id = ${data.id}`, 1)
            io.emmit(noti_dt)
            resolve(ic_dt);
        });
    }
}