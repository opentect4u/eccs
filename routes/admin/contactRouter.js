const { db_Delete, db_Insert } = require('../../modules/MasterModule');
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
        <li class="breadcrumb-item"><a href="/admin/contact">Contact Details list</a></li> 
        <li class="breadcrumb-item active">Contact Details List ${id > 0 ? 'Edit' : 'Add'} </li>
        </ol>`,
        dateFormat,
    });
});  

contactRouter.post("/contact_edit", async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    user = req.session.user.user_name,

    id = data.id;
    
    var table_name = "md_contact_info",
        fields = id > 0 ? `designation = '${data.desig}', contact_person = '${data.name}', contact_phone = '${data.phone}', modified_by = '${user}', modified_dt = '${datetime}'`:"(designation, contact_person, contact_phone, created_by, created_dt)",
        values = `('${data.desig}', '${data.name}', '${data.phone}', '${user}', '${datetime}')`,
        whr = id > 0 ? `id = ${id}` : null,
        flag = id > 0 ? 1 : 0;

    var resDt = await db_Insert(table_name, fields, values, whr, flag);
    if (resDt.suc > 0) {
        req.session.message = {
            type: "success",
            message: "Successfully Saved",
        };
        res.redirect("/admin/contact");
        // res_dt = { suc: 1, msg: resDt.msg };
    } else {
        // res_dt = { suc: 0, msg: "You have entered a wrong PIN" };
        req.session.message = {
            type: "danger",
            message: "Data Not Inserted!!",
        };
        res.redirect("/admin/contact_edit?id=" + id);
    }
});

contactRouter.get("/con_data_delete", async (req, res) => {
    var data = req.query
    console.log(data);
    var table_name = 'md_contact_info',
    whr = `id=${data.id}`
    var res_dt = await db_Delete(table_name,whr)
   res.redirect('/admin/contact')
  });

module.exports = {contactRouter}