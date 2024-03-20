const { holiday_home_data } = require('../../modules/HolidayhomeModule');

const holidayhomeRouter = require('express').Router();

holidayhomeRouter.get("/get_holiday_home_dtls",async (req, res) =>{
    var data = req.query;
    // console.log(data);
    var holiday_home_dtls = await holiday_home_data(data.bank_id);
    // console.log(holiday_home_dtls);
    if(holiday_home_dtls.suc > 0){
        if(holiday_home_dtls.msg.length > 0){
           res.send(holiday_home_dtls)
        }else{
           res.send({suc: 0, msg: "Data not found"})
        }
      }else{
         res.send(holiday_home_dtls)
      }
})

module.exports = {holidayhomeRouter}