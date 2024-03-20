const {db_Select} = require('../MasterModule')
module.exports = {
    getholidayhome : (id, bank_id) =>{
        return new Promise(async (resolve, reject) => {
            var fields = "sl_no,bank_id,hh_place,hh_address,hh_phone,hh_email,hh_contact_person,hh_charge,created_by,created_dt",
              table_name = "td_holiday_home",
              where = id > 0 ? `sl_no = ${id}` : `bank_id = ${bank_id}`,
              order = null;
            var resDt = await db_Select(fields, table_name, where, order);
            resolve(resDt);
          });
    }
}