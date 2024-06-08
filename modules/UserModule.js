const { db_Select, db_Insert } = require("./MasterModule"),
bcrypt = require('bcrypt'),
dateFormat = require('dateformat');

const bank_details = (bank_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = `md_bank`,
      whr = `bank_id = '${bank_id}'`,
      order = null;
    var bank_dt = await db_Select(select, table_name, whr, order);
    resolve(bank_dt);
  });
};

const member_details = (pf_no) => {
  return new Promise(async (resolve, reject) => {
    var select = "emp_code,branch_code,member_id,member_name",
      table_name = `md_member`,
      whr = `pf_no = '${pf_no}'`,
      order = null;
    var member_dt = await db_Select(select, table_name, whr, order);
    resolve(member_dt);
  });
};

const user_details = (tb_name, phone) => {
  return new Promise(async (resolve, reject) => {
    var select = "*",
      table_name = `${tb_name}`,
      whr = `phone_no = ${phone}`,
      order = null;
    var user_dt = await db_Select(select, table_name, whr, order);
    resolve(user_dt);
  });
};

const save_user_data = (data) => {
  return new Promise(async (resolve, reject) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var password = bcrypt.hashSync(data.password, 10);
    var table_name = 'td_user',
    fields = `(emp_code, user_name, user_id, password, created_by, created_dt)`,
    values = `('${data.emp_code}', '${data.user_name}', '${data.user_id}', '${password}', '${data.user_name}', '${datetime}')`,
    whr = null,
    flag = 0;
    user_data = await db_Insert(table_name, fields, values, whr, flag);
    resolve(user_data);
  });
};

// const login_data = (data) => {
//   return new Promise(async (resolve, reject) => {
//     var select = "a.*,b.*",
//     table_name = "td_user a , md_member b",
//     whr = `a.bank_id = b.bank_id AND a.user_type = 'U' AND a.active_flag = 'Y' AND user_id = ${data.user_id}`,
//     // whr = `bank_id = ${data.bank_id} AND user_id = ${data.user_id}`,
//     order = null;
//   var login_dt = await db_Select(select, table_name, whr, order);
//   resolve(login_dt);
//   });
// };

const login_data = (data) => {
  return new Promise(async (resolve, reject) => {
    // var select = "DISTINCT a.*,b.*,c.bank_id,c.bank_name",
    var select = "a.*,b.*",
    // table_name = "td_user a , md_member b, md_bank c",
    table_name = "td_user a , md_member b",
    whr = `a.user_id = b.pf_no AND a.user_type = 'U' AND a.active_flag = 'Y' AND a.user_id = ${data.user_id}`,
    order = null;
  var login_dt = await db_Select(select, table_name, whr, order);
  resolve(login_dt);
  });
};

const profile_data = (member_id) => {
  return new Promise(async (resolve, reject) => {
    // var select = "a.member_id,a.emp_code,a.user_name,a.user_id,b.*,c.branch_name",
    // table_name = "td_user a, md_member b, md_branch c",
    // whr = `a.member_id = b.member_id
    // AND a.emp_code = b.emp_code
    // AND a.user_id = b.phone_no
    // AND b.branch_code = c.sl_no
    // AND a.member_id = '${member_id}'
    // AND a.emp_code = '${emp_code}'`,
    // order = null;
    var select = "a.member_id,a.member_name,a.gurd_name,a.memb_addr,a.gender,a.dob,a.doa,a.designation,a.pf_no,b.branch_name",
    table_name = `md_member a, md_branch b`,
    whr = `a.branch_code = b.sl_no AND a.member_id = '${member_id}'`,
    order = null;
  var profile_dt = await db_Select(select, table_name, whr, order);
  resolve(profile_dt);
  });
};

const pass_data = (data) => {
  return new Promise(async (resolve, reject) => {
    var select = "id,password",
    table_name = "td_user",
    whr = `id='${data.id}'`,
    order = null;
  var pwd_dt = await db_Select(select, table_name, whr, order);
  resolve(pwd_dt);
  });
};

const verify_phone = (bank_id,user_id) => {
  return new Promise(async (resolve, reject) => {
    var select = "id,user_id,bank_id,emp_code",
      table_name = `td_user`,
      whr = `bank_id = '${bank_id}' AND user_id = '${user_id}'`,
      order = null;
    var verify_dt = await db_Select(select, table_name, whr, order);
    resolve(verify_dt);
  });
};

module.exports = { bank_details, user_details, save_user_data,login_data, profile_data, pass_data,verify_phone,member_details };
