const { conData } = require('../../modules/admin/Contact_adminModule');

const contactRouter = require('express').Router();

contactRouter.get("/contact", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    var resDt = await conData(id);
    console.log(resDt,'123');
    res.render("contact_dtls/contact_view", {
      con_dt: resDt,
      heading: "Contact Details",
      sub_heading: "Contact Details List",
      dateFormat,
    });
  });

  contactRouter.get("/contact_edit", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    var conDt = null;
    if (id > 0) {
        var res_dt = await conData(id);
        conDt = res_dt.suc > 0 ? res_dt.msg : null;
        console.log(conDt,'123');
    }
    res.render("contact_dtls/contact_edit", {
        con_data: conDt,
        heading: "Contact Details",
        sub_heading: `Contact Details List ${id > 0 ? 'Edit' : 'Add'}`,
        breadcrumb: `<ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/contact_dtls/contact_view">Contact Details list</a></li> 
        <li class="breadcrumb-item active">Contact Details List ${id > 0 ? 'Edit' : 'Add'} </li>
        </ol>`,
        dateFormat,
    });
});  

module.exports = {contactRouter}