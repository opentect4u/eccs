const { db_Select } = require('../MasterModule');
bcrypt = require('bcrypt'),
dateFormat = require('dateformat');

module.exports = {
    admin_login_data : (data) => {
        return new Promise(async (resolve, reject) => {
          var select = "a.*,b.*",
          table_name = "td_user a , md_bank b",
          whr = `a.bank_id = b.bank_id AND a.user_type = 'A' AND a.active_flag = 'Y' AND a.user_id = '${data.user_id}'`,
          // whr = `bank_id = ${data.bank_id} AND user_id = ${data.user_id}`,
          order = null;
        var login_dt = await db_Select(select, table_name, whr, order);
        resolve(login_dt);
        });
    }
}
 