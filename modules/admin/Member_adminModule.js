const { db_Select } = require("../MasterModule");

module.exports = {
  memData: (id) => {
    return new Promise(async (resolve, reject) => {
      var fields =
          "a.member_id,a.member_name,a.gurd_name,a.memb_addr,a.gender,a.dob,a.doa,a.designation,a.pf_no,b.branch_name",
        table_name = "md_member a, md_branch b",
        where = `a.branch_code = b.sl_no AND a.member_id = '${id}'`,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      resolve(resDt);
    });
  },

  member_dt: (data) => {
    return new Promise(async (resolve, reject) => {
      var fields =
          "a.member_id,a.member_name,a.gurd_name,a.memb_addr,a.gender,a.dob,a.doa,a.designation,a.pf_no,b.branch_name",
        table_name = "md_member a, md_branch b",
        where = `a.branch_code = b.sl_no AND a.pf_no = '${data.pf_no}'`,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      console.log(resDt, "sp");
      resolve(resDt);
    });
  },
  branch_list: () => {
    return new Promise(async (resolve, reject) => {
      var fields = "a.branch_name",
        table_name = "md_branch a, md_member b",
        where = `a.sl_no = b.branch_code`,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      console.log(resDt);
      resolve(resDt);
    });
  },

  memberData: (id) => {
    return new Promise(async (resolve, reject) => {
      var fields = "a.*,b.branch_name",
        table_name = "md_member a, md_branch b",
        where = id > 0 ? `a.member_id = ${id}` : null,
        order = null;
      var resDt = await db_Select(fields, table_name, where, order);
      resolve(resDt);
    });
  },
};
