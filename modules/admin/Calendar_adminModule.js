const {db_Select} = require('../MasterModule')
module.exports = {
    calData : (id, bank_id) =>{
        return new Promise(async (resolve, reject) => {
            var fields = "sl_no,bank_id,cal_dt,cal_event",
              table_name = "td_calendar",
              where = id > 0 ? `sl_no = ${id}` : `bank_id = ${bank_id}`,
              order = `ORDER BY cal_dt`;
            var resDt = await db_Select(fields, table_name, where, order);
            resolve(resDt);
          });
    }
}