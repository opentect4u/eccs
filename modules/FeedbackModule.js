const { db_Select, db_Insert } = require("./MasterModule");
const dateFormat = require('dateformat');

module.exports = {
    feedback_data: (data) =>{
     return new Promise(async (resolve, reject) =>{
      var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var date = dateFormat(data.date, "yyyy-mm-dd");
      table_name = "td_feedback",
       fields = `(bank_id,user_id,date,rating,remarks,created_by,created_dt)`,
       values = `('0', '${data.emp_code}', '${date}', '${data.rating}', '${data.remarks}', '${data.user_name}', '${datetime}')`,
      whr = null,
      flag = 0;
       var feedback_dt = await db_Insert(table_name, fields, values, whr, flag );
       resolve(feedback_dt);
     })
   }
};
