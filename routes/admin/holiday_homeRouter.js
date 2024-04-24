const { db_Insert } = require('../../modules/MasterModule');
const { getholidayhome } = require('../../modules/admin/Holiday_homeModule');

const holiday_homeRouter = require('express').Router();

holiday_homeRouter.get('/holiday_home', async (req, res) => {
    var id = req.query.sl_no > 0 ? req.query.sl_no : null;
    var bank_id = req.session.user.bank_id
    var resDt = await getholidayhome(id);
    // console.log(resDt);
    res.render("holiday_home/view", {
      req_dt: resDt,
      heading: "Holiday home",
      sub_heading: "Holidayhome List",
      dateFormat,
    });
  });

  holiday_homeRouter.get("/holiday_home_edit", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    var bank_id = req.session.user.bank_id
    var holidayDt = null;
    if (id > 0) {
        var res_dt = await getholidayhome(id);
        holidayDt = res_dt.suc > 0 ? res_dt.msg : null;
        // console.log(holidayDt,'123');
    }
    res.render("holiday_home/edit", {
        holi_data: holidayDt,
        heading: "Holiday Home",
        sub_heading: `Holiday Home List ${id > 0 ? 'Edit' : 'Add'}`,
        breadcrumb: `<ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/holiday_home">Holiday Home list</a></li> 
        <li class="breadcrumb-item active">Holiday Home List ${id > 0 ? 'Edit' : 'Add'} </li>
        </ol>`,
        dateFormat,
    });
});

holiday_homeRouter.post("/holiday_home_edit", async (req, res) => {
  var data = req.body;
  // console.log(data,'lalalal');
  var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
  user = req.session.user.user_name,
  bank_id = req.session.user.bank_id;

  id = data.sl_no;
  
  var table_name = "td_holiday_home",
      fields = id > 0 ? `hh_place = '${data.place}', hh_address = '${data.address}', 
      hh_phone = '${data.phone}', hh_email = '${data.email}', hh_contact_person = '${data.contact_person}', hh_charge = '${data.charge}', modified_by = '${user}', modified_dt = '${datetime}'`:"(bank_id, hh_place, hh_address, hh_phone, hh_email, hh_contact_person, hh_charge, created_by, created_dt)",
      values = `('0', '${data.place}', '${data.address}', '${data.phone}', '${data.email}', '${data.contact_person}', '${data.charge}', '${user}', '${datetime}')`,
      whr = id > 0 ? `sl_no = ${id}` : null,
      flag = id > 0 ? 1 : 0;

  var resDt = await db_Insert(table_name, fields, values, whr, flag);
  // console.log(resDt);
  if (resDt.suc > 0) {
      req.session.message = {
          type: "success",
          message: "Successfully Saved",
      };
      res.redirect("/admin/holiday_home");
      // res_dt = { suc: 1, msg: resDt.msg };
  } else {
      // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
      req.session.message = {
          type: "danger",
          message: "Data Not Inserted!!",
      };
      res.redirect("/admin/holiday_home_edit?id=" + id);
  }
});

module.exports = {holiday_homeRouter}