const { db_Select } = require("../MasterModule");

module.exports = {
    memData : (id) =>{
        return new Promise(async (resolve, reject) => {
            var fields = "member_id,member_name,gurd_name,memb_addr,gender,dob,doa,designation,pf_no,branch_name",
              table_name = "md_member",
              where = id > 0 ? `id = ${id}` : null,
              order = null;
            var resDt = await db_Select(fields, table_name, where, order);
            resolve(resDt);
          });
    }
}