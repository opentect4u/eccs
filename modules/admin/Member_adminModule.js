const { db_Select } = require("../MasterModule");

module.exports = {
  memData: (member_id = 0) => {
    return new Promise(async (resolve, reject) => {
      var fields =
          "a.member_id,a.member_name, a.branch_code branch_name,a.gurd_name,a.memb_addr,a.gender,a.dob,a.doa,a.designation,a.pf_no",
        table_name = "md_member a",
        where = member_id > 0 ? `a.member_id = '${member_id}'` : null,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      resolve(resDt);
    });
  },

  member_dt: (data) => {
    return new Promise(async (resolve, reject) => {
      var fields =
          "a.member_id,a.member_name,a.gurd_name,a.memb_addr,a.gender,a.dob,a.doa,a.designation,a.pf_no",
        table_name = "md_member a",
        where = data.pf_no > 0 ? `a.pf_no = '${data.pf_no}'` : null,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      // console.log(resDt, "sp");
      resolve(resDt);
    });
  },
  branch_list: () => {
    return new Promise(async (resolve, reject) => {
      var fields = "sl_no, branch_name",
        table_name = "md_branch",
        where = null,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      // console.log(resDt);
      resolve(resDt);
    });
  },

  memberData: (member_id) => {
    return new Promise(async (resolve, reject) => {
      var fields = "a.*",
        table_name = "md_member a",
        where = member_id > 0 ? `a.member_id = ${member_id}` : null,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      resolve(resDt);
    });
  },
};
