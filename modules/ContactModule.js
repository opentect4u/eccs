const { db_Select } = require("./MasterModule");

module.exports = {
    bank_contact_dtls: (bank_id) => {
        return new Promise(async (resolve, reject) => {
            var select = "bank_id,bank_name,bank_address,email_id,telephone_no",
                table_name = `md_bank`,
                whr = `bank_id = '${bank_id}'`,
                order = null;
            var contact_dt = await db_Select(select, table_name, whr, order);
            resolve(contact_dt);
        });
    }
}   