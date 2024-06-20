const {
  db_Select,
  db_Insert,
  db_Delete,
} = require("../../modules/MasterModule");
const {
  memData,
  member_dt,
  branch_list,
  memberData,
} = require("../../modules/admin/Member_adminModule");

const memberRouter = require("express").Router();
const dateFormat = require('dateformat')

memberRouter.get("/member", async (req, res) => {
//  var member_id = req.query.member_id > 0 ? req.query.member_id : [];
  // console.log(member_id,'kkkk');
  var resDt = await memData();
  // console.log(resDt, "123");
  res.render("member_dtls/member_view", {
    mem_dt: resDt.suc > 0 ? resDt.msg : [],
    heading: "Member Details",
    sub_heading: "Member Details List",
    dateFormat,
  });
});

memberRouter.post("/member_dtls", async (req, res) => {
  var data = req.body;
  // console.log(data, "oooo");
  var resDt = await member_dt(data);
  // console.log(resDt);
  res.send(resDt);
});

memberRouter.get("/member_edit", async (req, res) => {
  var member_id = req.query.member_id > 0 ? req.query.member_id : [];
  // console.log(member_id,'jjj');
  var memDt = null;
  var branch_lt = await branch_list();
  if (member_id > 0) {
    var res_dt = await memberData(member_id);
    memDt = res_dt.suc > 0 ? res_dt.msg : null;
    // console.log(memDt, "123");
  }
  res.render("member_dtls/member_edit", {
    mem_dt: branch_lt.suc > 0 ? branch_lt.msg : [],
    // mem_data: memDt.suc > 0 ? memDt.msg : [],
    mem_data: memDt,
    heading: "Member Details",
    sub_heading: `Member Details List ${member_id > 0 ? "Edit" : "Add"}`,
    breadcrumb: `<ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/member">Member Details list</a></li> 
        <li class="breadcrumb-item active">Member Details List ${
          member_id > 0 ? "Edit" : "Add"
        } </li>
        </ol>`,
    dateFormat,
  });
});

memberRouter.post("/member_dtls_save", async (req, res) => {
  var data = req.body;
  // console.log(data, "iiii");
  var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    user = req.session.user.user_name,
    member_id = data.member_id;

  var table_name = "md_member",
    fields =
    member_id > 0
        ? `branch_code = '${data.brn_name}', member_name = '${data.mem_nm}',
      gurd_name= '${data.gurd_nm}', memb_addr= '${data.mem_addr}', gender = '${data.gen}', dob = '${data.dob}', 
      doa = '${data.doa}', emp_code = '${data.emp_code}', designation = '${data.desg}', pf_no = '${data.pf_no}', 
      email_id = '${data.email_id}', phone_no = '${data.phone}', modified_by = '${user}', modified_dt = '${datetime}'`
        : "(member_id, branch_code, member_name, gurd_name, memb_addr, gender, dob, doa, emp_code, designation, pf_no, email_id, phone_no, created_by, created_dt)",
    values = `('${data.mem_id}', '${data.brn_name}', '${data.mem_nm}', '${data.gurd_nm}', '${data.mem_addr}',
      '${data.gen}', '${data.dob}', '${data.doa}', '${data.emp_code}', '${data.desg}', '${data.pf_no}', '${data.email_id}',
      '${data.phone}', '${user}', '${datetime}')`,
    whr = member_id > 0 ? `member_id = ${member_id}` : null,
    flag = member_id > 0 ? 1 : 0;

  var resDt = await db_Insert(table_name, fields, values, whr, flag);
  if (resDt.suc > 0) {
    req.session.message = {
      type: "success",
      message: "Successfully Saved",
    };
    res.redirect("/admin/member");
    // res_dt = { suc: 1, msg: resDt.msg };
  } else {
    // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
    req.session.message = {
      type: "danger",
      message: "Data Not Inserted!!",
    };
    res.redirect("/admin/member_edit?member_id=" + member_id);
  }
});

memberRouter.get("/mem_data_delete", async (req, res) => {
  var data = req.query;
  // console.log(data, "po");
  var table_name = "md_member",
    whr = `member_id=${data.member_id}`;
  var res_dt = await db_Delete(table_name, whr);
  res.redirect("/admin/member");
});

module.exports = { memberRouter };
