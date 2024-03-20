const { db_Insert } = require("../../modules/MasterModule");
const { bank_details, user_details, save_user_data, login_data, profile_data, pass_data } = require("../../modules/UserModule");

const userRouter = require("express").Router();
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');

userRouter.get("/bank_dt", async (req, res) => {
  var data = req.query;
  // console.log(data);
  var bank_dtls = await bank_details(data.bank_id);
  // console.log(bank_dtls);
  if(bank_dtls.suc > 0){
    if(bank_dtls.msg.length > 0){
       res.send(bank_dtls)
    }else{
       res.send({suc: 0, msg: "Data not found"})
    }
  }else{
     res.send(bank_dtls)
  }
});

userRouter.get("/check_user", async (req, res) => {
  var data = req.query, result;
  // console.log(data);
  try{
    var user_dtls = await user_details(data.tb_name, data.phone);
    if(user_dtls.suc > 0){
      if(user_dtls.msg.length > 0){
        result = {suc: 1, msg: "Phone number is registered", data: user_dtls.msg}
      }else{
        result = {suc: 2, msg: "No phone number found", data: []}
      }
    }else{
      result = user_dtls
    }
  }catch(err){
    // console.log(err);
    result = {suc: 0, msg: "Please enter phone number", data: []}
  }
  res.send(result);
});

userRouter.get('/login_otp', async (req, res) => {
  var data = req.query;
  var otp = Math.floor(1000 + Math.random() * 9000);
  // console.log(otp);
res.send({ suc: 1, msg: 'Otp Sent', otp: 1234 })
});

userRouter.post('/save_user', async (req, res) =>{
  var data = req.body;
  // console.log(data);
  var user_save_dt = await save_user_data(data);
  // console.log(user_save_dt);
  if(user_save_dt.suc > 0){
    if(user_save_dt.msg.length > 0){
       res.send({suc: 1, msg: "Saved Successfully"})
    }else{
       res.send({suc: 0, msg: "Data not Saved"})
    }
  }else{
     res.send({user_save_dt})
  }
});

userRouter.post("/login", async (req, res) => {
  var data = req.body,
    result;
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  // console.log(data);
  var log_dt = await login_data(data);
  // console.log(log_dt);
  if (log_dt.suc > 0) {
    if (log_dt.msg.length > 0) {
        if (await bcrypt.compare(data.password, log_dt.msg[0].password)) {
          try{
            await db_Insert('td_user', `last_login="${datetime}"`, null, `user_id=${log_dt.msg[0].user_id}`, 1)
          }catch(err){
            // console.log(err);
          }
          result = {
            suc: 1,
            msg: "successfully loggedin",
            data: log_dt.msg,
          };
        } else {
          result = {
            suc: 0,
            msg: "Please check your userid or password",
            data: [],
          };
        }
    } else {
      result = { suc: 0, msg: "No data found",  data: [], };
    }
  } else {
    result = { suc: 0, msg: log_dt.msg };
  }
  res.send(result);
});

userRouter.get("/get_pofile_dtls", async (req, res) =>{
  var data = req.query;
  // console.log(data);
  var profile_dtls = await profile_data(data.bank_id)
  // console.log(profile_dtls);
  if(profile_dtls.suc > 0){
    if(profile_dtls.msg.length > 0){
       res.send(profile_dtls)
    }else{
       res.send({suc: 0, msg: "Data not found"})
    }
  }else{
     res.send(profile_dtls)
  }
});

userRouter.post("/change_password", async (req, res) =>{
  var data = req.body, result;
  // console.log(data);
  const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  var pwd_dt = await pass_data(data);
  // console.log(pwd_dt);

  if(pwd_dt.suc > 0) {
    if(pwd_dt.msg.length > 0) {
      if (await bcrypt.compare(data.old_pwd, pwd_dt.msg[0].password)) {
        var pass = bcrypt.hashSync(data.new_pwd, 10);
        var table_name = "td_user",
        fields = `password = '${pass}', modified_by = '${data.user_name}', modified_dt='${datetime}'`,
        where = `id = '${data.id}'`,
        flag = 1;
        var change_pass = await db_Insert(table_name,fields,null,where,flag)
        result = change_pass
        result = {
          suc: 1,
          msg: "Password changed successfully",
          data: pwd_dt.msg,
        };
      }else {
        result = {
          suc: 0,
          msg: "Please check your password",
          data: [],
        };
      }
    }else {
      result = { suc: 0, msg: "No data found",  data: [], };
    }
  }else {
    result = { suc: 0, msg: pwd_dt.msg };
  }
  res.send(result);
});

module.exports = { userRouter };
