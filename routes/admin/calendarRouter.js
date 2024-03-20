const calendarRouter = require('express').Router();

calendarRouter.get("/calendar_edit", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    var calDt = null;
    if (id > 0) {
        var res_dt = await calData(id);
        calDt = res_dt.suc > 0 ? res_dt.msg : null;
        // console.log(ardb_data);
    }
    res.render("admin/calendar_edit", {
        cal_data: calDt,
        heading: "Calendar",
        sub_heading: "Event List Edit",
        dateFormat,
    });
});

calendarRouter.post("/calendar_edit", async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        user = req.session.user.USER_NAME,
        id = data.sl_no;
    var pax_id = db_id,
        table_name = "TD_CALENDAR",
        fields =
            id > 0
                ? "CAL_DT = :0, CAL_EVENT = :1, MODIFIED_BY = :2, MODIFIED_DT = :3"
                : "SL_NO, CAL_DT, CAL_EVENT, CREATED_BY, CREATED_DT",
        fieldIndex = `((SELECT Decode(MAX(SL_NO),1,MAX(SL_NO),0)+1 FROM TD_CALENDAR), :0, :1, :2, :3)`,
        values = [
            dateFormat(data.cal_dt, "dd-mmm-yy"),
            data.cal_event,
            user,
            dateFormat(datetime, "dd-mmm-yy"),
        ],
        where = id > 0 ? `SL_NO = ${id}` : null,
        flag = id > 0 ? 1 : 0;
    var resDt = await Api_Insert(
        pax_id,
        table_name,
        fields,
        fieldIndex,
        values,
        where,
        flag
    );
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