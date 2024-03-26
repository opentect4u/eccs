const { db_Select, db_Insert } = require('../../modules/MasterModule');
const fs = require('fs');
const fileUpload = require("express-fileupload");

const upload_formRouter = require('express').Router();

upload_formRouter.use(fileUpload())

upload_formRouter.get('/form', async (req, res) =>{
    var bank_id = req.session.user.bank_id
    var fields = "sl_no, bank_id, title, file_path, created_by, created_dt",
        table_name = "td_forms",
        where = `bank_id = ${bank_id}`,
        order = null;
    var resDt = await db_Select(fields, table_name, where, order);
    // console.log(resDt,'lala');
    res.render("form_upload/form", {
        heading: "Upload Form",
        form_list: resDt.suc > 0 ? resDt.msg : null,
    });
})

upload_formRouter.post('/upload_form', async(req, res) => {
   var data = req.body, err = [];
   var bank_id = req.session.user.bank_id
   const user_id = req.session.user.id;
   const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
   console.log(data,'body');
   console.log(req.files, 'Files');
   var photos = req.files ? req.files.photo ? true : false : false
   if(photos){
    var photo = req.files.photo
    var dir = 'assets/forms',
      sub_dir = `${dir}/${bank_id}`;
    if (!fs.existsSync(sub_dir)) {
      fs.mkdirSync(sub_dir);
    }
    if(Array.isArray(photo)){
      let i = 0
      for(let dt of photo){
        console.log(dt,'frm_data');
        try{
          if(dt.size <= 1 * 1024 * 1024){
            let fileName = Date.now() + "_" + dt.name;
            let title = Array.isArray(data.title) ? data.title[i] : data.title;

            dt.mv(sub_dir + "/" + fileName, async (err) => {
              if (err) {
                err.push(err);
              } else {
                // console.log(Array.isArray(data.title),data.title,i,'rrr');
                // console.log(title,'tt');
                // if (frm_up) {
                //   var table_name = "td_forms",
                //     fields = `file_path = '${fileName}', modified_by = '${user_data.user}', modified_dt = '${datetime}'`,
                //     values = null;
                //     whr = `bank_id= '${data.bank_id}'`, 
                //     flag = 1;
                //   res_dt = await db_Insert(table_name, fields, values, whr, flag);
                // } else {
                  var table_name = "td_forms",
                    fields = `(bank_id, title, file_path, created_by, created_dt)`,
                    values = `('${bank_id}', '${title}', '${fileName}','${user_id}','${datetime}')`;
                  whr = null, 
                  flag = 0;
                  res_dt = await db_Insert(table_name, fields, values, whr, flag);
                // }
                // req.flash("success", "Form added Successful");
                // res.redirect("/admin/form");
                // console.log(res_dt);
              }
            });
          }
        } catch{
          console.log(err);
          err.push(err)
        }
        i++
      }
    }else{
      try{
        if(photo.size <= 1 * 1024 * 1024){
          let fileName = Date.now() + "_" + photo.name;
          photo.mv(sub_dir + "/" + fileName, async (err) => {
            if (err) {
              err.push(err);
            } else {
              let title = data.title;
              console.log(title,'tot');
              // if (frm_up) {
              //   var table_name = "td_forms",
              //     fields = `file_path = '${fileName}', modified_by = '${user_data.user}', modified_dt = '${datetime}'`,
              //     values = null;
              //     whr = `bank_id= '${data.bank_id}'`, 
              //     flag = 1;
              //   res_dt = await db_Insert(table_name, fields, values, whr, flag);
              // } else {
                var table_name = "td_forms",
                  fields = `(bank_id, title, file_path, created_by, created_dt)`,
                  values = `('${bank_id}', '${title}', '${fileName}','${user_id}','${datetime}')`;
                whr = null, 
                flag = 0;
                res_dt = await db_Insert(table_name, fields, values, whr, flag);
              // }
              // req.flash("success", "Form added Successful");
              // res.redirect("/admin/form");
              // console.log(res_dt);
            }
          });
        }
      } catch{
        console.log(err);
        err.push(err)
      }
    }
    if(err.length > 0){
      console.log(err);
    }
    req.session.message = {
      type: "success",
      message: "File uploaded Successfully",
    };
    res.redirect("/admin/form");
   }else{
    req.session.message = {
      type: "danger",
      message: "No file selected",
    };
    res.redirect("/admin/form");
   }
  });
  
module.exports = {upload_formRouter}  