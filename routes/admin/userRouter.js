const adminUserRouter = require('express').Router();
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { db_Insert } = require('../../modules/MasterModule');
const { admin_login_data } = require('../../modules/admin/User_adminModule');


adminUserRouter.get('/login', async (req, res) => {
    res.render('login/login')
});

adminUserRouter.post('/login', async (req, res) => {
    var data = req.body,
        result;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    console.log(data);
    var log_dt = await admin_login_data(data);
    console.log(log_dt);
    if (log_dt.suc > 0) {
        if (log_dt.msg.length > 0) {
            if (await bcrypt.compare(data.password, log_dt.msg[0].password)) {
                try {
                    await db_Insert('td_user', `last_login="${datetime}"`, null, `user_id=${log_dt.msg[0].user_id}`, 1)
                } catch (err) {
                    console.log(err);
                }
                req.session.message = {
                    type: "success",
                    message: "Successfully loggedin",
                };
                req.session.user = log_dt.msg;
                res.redirect("/admin/dashboard");
            } else {
                req.session.message = {
                    type: "warning",
                    message: "Please check your userid or password",
                };
                res.redirect("/admin/login");
            }
        } else {
            req.session.message = {
                type: "warning",
                message: "Please check your userid or password",
            };
            res.redirect("/admin/login");
        }
    } else {
        req.session.message = {
            type: "warning",
            message: "Please check your userid or password",
        };
        res.redirect("/admin/login");
    }
})

adminUserRouter.get('/logout', async (req, res) => {
    var user = req.session.user
    req.session.destroy(() => {
      res.redirect('/admin/login');
    });
  })

module.exports = { adminUserRouter }