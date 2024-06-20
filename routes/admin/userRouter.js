const adminUserRouter = require('express').Router();
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { db_Insert, db_Delete, db_Select } = require('../../modules/MasterModule');
const { admin_login_data } = require('../../modules/admin/User_adminModule');


adminUserRouter.get('/login', async (req, res) => {
    res.render('login/login')
});

adminUserRouter.post('/login', async (req, res) => {
    var data = req.body,
        result;
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // console.log(data,'pp');
    var log_dt = await admin_login_data(data);
    // console.log(log_dt);
    if (log_dt.suc > 0) {
        if (log_dt.msg.length > 0) {
            if (await bcrypt.compare(data.password, log_dt.msg[0].password)) {
                try {
                    await db_Insert('td_user', `last_login="${datetime}"`, null, `user_id='${log_dt.msg[0].user_id}'`, 1)
                } catch (err) {
                    console.log(err);
                }
                req.session.message = {
                    type: "success",
                    message: "Successfully loggedin",
                };
                req.session.user = log_dt.msg[0];
                res.redirect("/admin/calendar");
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

  adminUserRouter.get('/user_list', async (req, res) => {
    var bank_id = req.session.user.bank_id;
    var resDt = await AllUserList();
    // console.log(resDt);
    res.render("user/user_list", {
        req_dt: resDt,
        heading: "Registered User List",
        sub_heading: "User List",
        dateFormat,
    });
})

adminUserRouter.get('/user_delete', async (req, res) => {
    var id = req.query.id;
    var resDt = await db_Delete('td_user', `id = '${id}'`);
    if (resDt.suc > 0) {
        req.session.message = {
            type: "success",
            message: "Successfully Deleted",
        };
        res.redirect("/admin/user_list");
        //   // res_dt = { suc: 1, msg: resDt.msg };
    } else {
        // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
        req.session.message = {
            type: "danger",
            message: "Please try again later!!",
        };
        res.redirect("/admin/user_list");
    }
})

const AllUserList = () => {
    return new Promise(async (resolve, reject) => {
        var fields = "id, emp_code, user_name, user_id, active_flag, last_login",
            table_name = "td_user",
            where = `user_type != 'A' AND active_flag = 'Y'`,
            order = null;
        var resDt = await db_Select(fields, table_name, where, order);
        resolve(resDt)
    })
}

adminUserRouter.post('/password', async (req, res) =>{
    user = req.session.user
    user_name = req.session.user.user_name
    // console.log(user,"123456");
    const datetime = dateFormat(new Date(), "yyyy-mm-dd");
    
    var data = req.body,result;
    // console.log(data,"123");
  
    var select = "id,password",
    table_name = "td_user",
    whr = `id='${user.id}'`;
    var res_dt = await db_Select(select,table_name,whr,null)
    // console.log(res_dt,"1234");
  
    if(res_dt.suc > 0) {
      if(res_dt.msg.length > 0) {
        if (await bcrypt.compare(data.old_pwd, res_dt.msg[0].password)) {
          var pass = bcrypt.hashSync(data.new_pwd, 10);
          var table_name = "td_user",
          fields = `password = '${pass}', modified_by='${user_name}', modified_dt='${datetime}'`,
          where2 = `id = '${user.id}'`,
          flag = 1;
          var forget_pass = await db_Insert(table_name,fields,null,where2,flag)
          result = forget_pass
          res.redirect("/admin/logout");
        }else {
          res.redirect("/admin/calendar");
        }
      }else {
          res.redirect("/admin/calendar");
        }
    }else {
      res.redirect("/admin/calendar");
    }
});

adminUserRouter.post('/save_flag', async (req, res) =>{
    user = req.session.user
    user_name = req.session.user.user_name
    // console.log(user,"123456");
    const datetime = dateFormat(new Date(), "yyyy-mm-dd");
    
    var data = req.body;
    // console.log(data);
    var table_name = "td_user",
          fields = `active_flag = '${data.isChecked}', modified_by='${user_name}', modified_dt='${datetime}'`,
          where2 = `emp_code = '${data.emp_code}'`,
          flag = 1;
          var active_dt = await db_Insert(table_name,fields,null,where2,flag)
        //   console.log(active_dt,'pp');
    res.send(active_dt)    
})

module.exports = { adminUserRouter }