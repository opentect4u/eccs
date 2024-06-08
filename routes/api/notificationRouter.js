const { db_Delete } = require('../../modules/MasterModule');
const { notify_flag_save } = require('../../modules/NotificationModule');

const notificationRouter = require('express').Router();

notificationRouter.post('/noti_view_flag', async (req, res) =>{
    var data = req.body;
   //  console.log(data);
    var noti_save_dt = await notify_flag_save(data, req.io)
   //  console.log(noti_save_dt);
    res.send({noti_save_dt})
  });

  notificationRouter.get("/notify_delete", async (req, res) => {
    var data = req.query
    // console.log(data,'123');
    var table_name = 'td_notification',
    whr = `id=${data.id}`
    var res_dt = await db_Delete(table_name,whr)
    if(res_dt.suc > 0){
      if(res_dt.msg.length > 0){
         res.send({suc: 1, msg: "Deleted Successfully"})
      }else{
         res.send({suc: 0, msg: "Data not deleted"})
      }
    }else{
       res.send(res_dt)
    }
  });  

  notificationRouter.get("/clear_all_notify", async (req, res) => {
      var data = req.query
      // console.log(data,'888');
      var table_name = 'td_notification'
      whr = `send_user_id = ${data.send_user_id}`
      var res_dt = await db_Delete(table_name,whr)
      if(res_dt.suc > 0){
        if(res_dt.msg.length > 0){
           res.send({suc: 1, msg: "All notification removed Successfully"})
        }else{
           res.send({suc: 0, msg: "All notification not removed Successfully"})
        }
      }else{
         res.send(res_dt)
      }
  })

module.exports = {notificationRouter}