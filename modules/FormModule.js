const { db_Select } = require("./MasterModule");

module.exports = {
    form_data: (data) =>{
     return new Promise(async (resolve, reject) =>{
       var select = "*",
       table_name = "td_forms",
       where = null,
       order = null;
       var form_dt = await db_Select(select, table_name, where, order);
       resolve(form_dt);
     })
   },
}