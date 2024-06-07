const { form_data, user_state_data, demand_data, demand_data1, demand_data2 } = require('../../modules/FormModule');

const formRouter = require('express').Router();

formRouter.get("/get_loan_form",async (req, res) =>{
    var data = req.query;
    // console.log(data);
    var form_dtls = await form_data(data)
    if(form_dtls.suc > 0){
        if(form_dtls.msg.length > 0){
           res.send(form_dtls)
        }else{
           res.send({suc: 0, msg: "Data not found"})
        }
      }else{
         res.send(form_dtls)
      }
})

module.exports = {formRouter}
