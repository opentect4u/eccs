const { db_Select } = require("../MasterModule");

module.exports = {
    getFeedBack : (id) => {
        return new Promise(async (resolve, reject) => {
           var fields = "sl_no, bank_id, user_id, date, rating, remarks, created_by, created_dt",
            table_name = "td_feedback",
            where = id > 0 ? `sl_no =${id}` : "",
            order = null;
          var resDt = await db_Select(fields, table_name, where, order);
          resolve(resDt);
        });
      }
}