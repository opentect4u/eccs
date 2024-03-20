const { db_Select } = require("./MasterModule");

module.exports = {
    calendar_dtls: (bank_id) => {
        return new Promise(async (resolve, reject) => {
            var select = "*",
                table_name = `td_calendar`,
                whr = `bank_id = '${bank_id}'`,
                order = null;
            var calendar_dt = await db_Select(select, table_name, whr, order);
            resolve(calendar_dt);
        });
    }
}