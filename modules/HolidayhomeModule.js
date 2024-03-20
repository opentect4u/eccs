const { db_Select } = require("./MasterModule");

module.exports = {
     holiday_home_data: (bank_id) =>{
      return new Promise(async (resolve, reject) =>{
        var select = "sl_no,hh_place,hh_address,hh_phone,hh_email,hh_contact_person,hh_charge",
        table_name = "td_holiday_home",
        where = `bank_id = '${bank_id}'`,
        order = null;
        var holiday_home_dt = await db_Select(select, table_name, where, order);
        resolve(holiday_home_dt);
      })
    }
}