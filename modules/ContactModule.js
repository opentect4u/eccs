const { db_Select } = require("./MasterModule");

module.exports = {
    bank_contact_dtls: () => {
        return new Promise(async (resolve, reject) => {
            var select = "*",
                table_name = `md_contact_info`,
                whr = null,
                order = null;
            var contact_dt = await db_Select(select, table_name, whr, order);
            resolve(contact_dt);
        });
    }
}   