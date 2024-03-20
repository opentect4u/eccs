const { db_Select } = require("./MasterModule");

module.exports = {
     download_form_data: (bank_id) =>{
      return new Promise(async (resolve, reject) =>{
        var select = "bank_id,title,file_path",
        table_name = "td_forms",
        where = `bank_id = '${bank_id}'`,
        order = null;
        var download_dt = await db_Select(select, table_name, where, order);
        resolve(download_dt);
      })
    }
}