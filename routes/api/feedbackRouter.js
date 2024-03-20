const { feedback_data } = require('../../modules/FeedbackModule');

const feedbackRouter = require('express').Router();

feedbackRouter.post("/save_feedback_dtls", async (req, res) =>{
    var data = req.body;
    // console.log(data,'lalalalaal');
    var feedback_dtls = await feedback_data(data);
    console.log(feedback_dtls);
    if(feedback_dtls.suc > 0){
        if(feedback_dtls.msg.length > 0){
            res.send({suc: 1, msg: "Saved Successfully"})
        }else{
            res.send({suc: 0, msg: "Data not Saved"})
        }
      }else{
         res.send(feedback_dtls)
      }
})

module.exports = {feedbackRouter}