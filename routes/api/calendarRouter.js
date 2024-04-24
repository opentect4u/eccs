const { calendar_dtls } = require('../../modules/CalendarModule');

const calendarRouter = require('express').Router();

calendarRouter.get("/get_cal_dtls", async (req, res) =>{
    var data = req.query;
    // console.log(data);
    var cal_dtls = await calendar_dtls();
   //  console.log(cal_dtls);
    if(cal_dtls.suc > 0){
        if(cal_dtls.msg.length > 0){
           res.send(cal_dtls)
        }else{
           res.send({suc: 0, msg: "Data not found"})
        }
      }else{
         res.send(cal_dtls)
      }
})

module.exports = {calendarRouter}