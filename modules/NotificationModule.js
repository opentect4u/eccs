const { db_Select } = require("./MasterModule");

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
    }
}