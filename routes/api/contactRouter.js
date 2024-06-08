const { bank_contact_dtls } = require('../../modules/ContactModule');

const contactRouter = require('express').Router();

contactRouter.get("/get_contact_dtls", async (req, res) =>{
    var data = req.query;
   //  console.log(data);
    var contact_dtls = await bank_contact_dtls()
   //  console.log(contact_dtls);
    if(contact_dtls.suc > 0){
        if(contact_dtls.msg.length > 0){
           res.send(contact_dtls)
        }else{
           res.send({suc: 0, msg: "Data not found"})
        }
      }else{
         res.send(contact_dtls)
      }
})

module.exports = {contactRouter}