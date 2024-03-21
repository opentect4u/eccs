const { notify_flag_save } = require('../../modules/NotificationModule');

const notificationRouter = require('express').Router();

notificationRouter.post('/noti_view_flag', async (req, res) =>{
    var data = req.body;
    console.log(data);
    var noti_save_dt = await notify_flag_save(data, req.io)
    console.log(noti_save_dt);
    res.send({noti_save_dt})
  });

module.exports = {notificationRouter}