const { db_Insert } = require('../../modules/MasterModule');
const { calData } = require('../../modules/admin/Calendar_adminModule');

const calendarRouter = require('express').Router();

calendarRouter.get("/calendar", async (req, res) => {
    var id = req.query.sl_no > 0 ? req.query.sl_no : null;
    var bank_id = req.session.user.bank_id
    var resDt = await calData(id, bank_id);
    // console.log(resDt,'123');
    // if (resDt.suc > 0) {
    res.render("admin/calendar_view", {
      cal_dt: resDt,
      heading: "Calendar",
      sub_heading: "Event List",
      dateFormat,
    });
    // }
  });

calendarRouter.get("/calendar_edit", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    var bank_id = req.session.user.bank_id
    var calDt = null;
    if (id > 0) {
        var res_dt = await calData(id, bank_id);
        calDt = res_dt.suc > 0 ? res_dt.msg : null;
        console.log(calDt,'123');
    }
    res.render("admin/calendar_edit", {
        cal_data: calDt,
        heading: "Calendar",
        sub_heading: `Event List ${id > 0 ? 'Edit' : 'Add'}`,
        breadcrumb: `<ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/admin/calendar">Event list</a></li> 
        <li class="breadcrumb-item active">Event List ${id > 0 ? 'Edit' : 'Add'} </li>
        </ol>`,
        dateFormat,
    });
});

calendarRouter.post("/calendar_edit", async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    user = req.session.user.user_name,
    bank_id = req.session.user.bank_id;

    id = data.sl_no;
    
    var table_name = "td_calendar",
        fields = id > 0 ? `cal_dt = '${data.cal_dt}', cal_event = '${data.cal_event}', modified_by = '${user}', modified_dt = '${datetime}'`:"(bank_id, cal_dt, cal_event, created_by, created_dt)",
        values = `(${bank_id}, '${data.cal_dt}', '${data.cal_event}', '${user}', '${datetime}')`,
        whr = id > 0 ? `sl_no = ${id}` : null,
        flag = id > 0 ? 1 : 0;

    var resDt = await db_Insert(table_name, fields, values, whr, flag);
    if (resDt.suc > 0) {
        req.session.message = {
            type: "success",
            message: "Successfully Saved",
        };
        res.redirect("/admin/calendar");
        // res_dt = { suc: 1, msg: resDt.msg };
    } else {
        // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
        req.session.message = {
            type: "danger",
            message: "Data Not Inserted!!",
        };
        res.redirect("/admin/calendar_edit?id=" + id);
    }
});

module.exports = { calendarRouter }