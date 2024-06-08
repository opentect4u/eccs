const { download_form_data } = require('../../modules/DownloadFormModule');

const downloadFormRouter = require('express').Router();

downloadFormRouter.get("/get_download_form_dtls", async (req, res) =>{
    var data = req.query;
   //  console.log(data);
    var frm_dtls = await download_form_data(data.bank_id);
   //  console.log(frm_dtls);
    if(frm_dtls.suc > 0){
        if(frm_dtls.msg.length > 0){
           res.send(frm_dtls)
        }else{
           res.send({suc: 0, msg: "Data not found"})
        }
      }else{
         res.send(frm_dtls)
      }
})

module.exports = {downloadFormRouter}