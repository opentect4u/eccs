const { db_Select } = require("../MasterModule");

module.exports = {
    conData : (id) =>{
        return new Promise(async (resolve, reject) => {
            var fields = "id,designation,contact_person,contact_phone",
              table_name = "md_contact_info",
              where = id > 0 ? `id = ${id}` : null,
              order = null;
            var resDt = await db_Select(fields, table_name, where, order);
            resolve(resDt);
          });
    }
}