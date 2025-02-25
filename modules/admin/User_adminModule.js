const { db_Select } = require('../MasterModule');
bcrypt = require('bcrypt'),
dateFormat = require('dateformat');

module.exports = {
    // admin_login_data : (data) => {
    //     return new Promise(async (resolve, reject) => {
    //       var select = "a.*,b.*",
    //       table_name = "td_user a , md_bank b",
    //       whr = `a.bank_id = b.bank_id AND a.user_type = 'A' AND a.active_flag = 'Y' AND a.user_id = '${data.user_id}'`,
    //       // whr = `bank_id = ${data.bank_id} AND user_id = ${data.user_id}`,
    //       order = null;
    //     var login_dt = await db_Select(select, table_name, whr, order);
    //     resolve(login_dt);
    //     });
    // }

    admin_login_data : (data) => {
      return new Promise(async (resolve, reject) => {
        var select = "*",
        table_name = "td_user",
        whr = `user_type = 'A' AND active_flag = 'Y' AND user_id = '${data.user_id}'`,
        // whr = `bank_id = ${data.bank_id} AND user_id = ${data.user_id}`,
        order = null;
      var login_dt = await db_Select(select, table_name, whr, order);
      resolve(login_dt,'ll');
      });
  },

  userData: (id) => {
    return new Promise(async (resolve, reject) => {
      var fields = "a.*",
        table_name = "td_user a",
        where = id > 0 ? `a.id = ${id}` : null,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      resolve(resDt);
    });
  },
}
 