const notiRouter = require('express').Router(),
dateFormat = require('dateformat');

const { db_Select, db_Insert } = require('../../modules/MasterModule');
const { notification_dtls } = require('../../modules/NotificationModule');

notiRouter.get("/notification", async (req, res) => {
    var bank_id = req.session.user.bank_id
    var fields = "emp_code, user_name",
        table_name = "td_user",
        where = `user_type != 'A' AND active_flag = 'Y'`,
        order = null;
    var resDt = await db_Select(fields, table_name, where, order);
    // console.log(resDt);
    res.render("notification/entry", {
        heading: "Send Notification",
        emp_list: resDt.suc > 0 ? resDt.msg : null,
    });
});

// notiRouter.post("/notification", async (req, res) => {
//     var data = req.body;
//     var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
//         user = req.session.user.user_name,
//         bank_id = req.session.user.bank_id, resDt;
//     if(data.user_id != 'all' && data.user_id > 0){
//         var table_name = "td_notification",
//             fields = "(bank_id, narration, send_user_id, created_by, created_dt)",
//             values = `('0', '${data.narration}', '${data.user_id}', '${user}', '${datetime}')`,
//             whr = null,
//             flag = 0;
//         resDt = await db_Insert(table_name, fields, values, whr, flag);
//     }else{
//         var fields = "emp_code, user_name",
//         table_name = "td_user",
//         where = `user_type != 'A' AND active_flag = 'Y'`,
//         order = null;
//         var user_list = await db_Select(fields, table_name, where, order);
//         if(user_list.suc > 0){
//             for(let dt of user_list.msg){
//                 var table_name = "td_notification",
//                     fields = "(bank_id, narration, send_user_id, created_by, created_dt)",
//                     values = `('0', '${data.narration}', '${dt.emp_code}', '${user}', '${datetime}')`,
//                     whr = null,
//                     flag = 0;
//                 resDt = await db_Insert(table_name, fields, values, whr, flag);
//             }
//         }else{
//             resDt = {suc: 0, msg: 'No data found'}
//         }
//     }
//     console.log(resDt.suc);
//     if (resDt.suc > 0) {
//         var ioDt = await SendNotification(bank_id);
//         req.io.emit('notification', ioDt);
//         req.session.message = {
//             type: "success",
//             message: "Notification Sent Successfully",
//         };
//         res.redirect("/admin/notification");
//         // res_dt = { suc: 1, msg: resDt.msg };
//     } else {
//         // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
//         req.session.message = {
//             type: "danger",
//             message: "Notification Not Sent",
//         };
//         res.redirect("/admin/notification");
//     }
// });

notiRouter.post("/notification", async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        user = req.session.user.user_name,
        bank_id = req.session.user.bank_id, resDt;
    // if(data.user_id != 'all' && data.user_id > 0){
    //     var table_name = "td_notification",
    //         fields = "(bank_id, narration, send_user_id, created_by, created_dt)",
    //         values = `('0', '${data.narration}', '${data.user_id}', '${user}', '${datetime}')`,
    //         whr = null,
    //         flag = 0;
    //     resDt = await db_Insert(table_name, fields, values, whr, flag);
    // }else{
        var fields = "emp_code, user_name",
        table_name = "td_user",
        where = `user_type != 'A' AND active_flag = 'Y'`,
        order = null;
        var user_list = await db_Select(fields, table_name, where, order);
        if(user_list.suc > 0){
            for(let dt of user_list.msg){
                var table_name = "td_notification",
                    fields = "(bank_id, narration, send_user_id, created_by, created_dt)",
                    values = `('0', '${data.narration}', '${dt.emp_code}', '${user}', '${datetime}')`,
                    whr = null,
                    flag = 0;
                resDt = await db_Insert(table_name, fields, values, whr, flag);
            }
        }else{
            resDt = {suc: 0, msg: 'No data found'}
        }
    // }
    console.log(resDt.suc);
    if (resDt.suc > 0) {
        var ioDt = await notification_dtls();
        req.io.emit('send notification', ioDt);
        req.session.message = {
            type: "success",
            message: "Notification Sent Successfully",
        };
        res.redirect("/admin/notification");
        // res_dt = { suc: 1, msg: resDt.msg };
    } else {
        // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
        req.session.message = {
            type: "danger",
            message: "Notification Not Sent",
        };
        res.redirect("/admin/notification");
    }
});

const SendNotification = () => {
    return new Promise(async (resolve, reject) => {
    var fields = "emp_code, user_name",
        table_name = "td_user",
        where = `user_type != 'A' AND active_flag = 'Y'`,
        order = null;
    var resDt = await db_Select(fields, table_name, where, order);
    resolve(resDt)
    })
}

module.exports = { notiRouter }