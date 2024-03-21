const { db_Select, db_Insert } = require('../../modules/MasterModule');

const upload_formRouter = require('express').Router();

upload_formRouter.get('/form', async (req, res) =>{
    var bank_id = req.session.user.bank_id
    var fields = "sl_no, bank_id, title, file_path, created_by, created_dt",
        table_name = "td_forms",
        where = `bank_id = ${bank_id}`,
        order = null;
    var resDt = await db_Select(fields, table_name, where, order);
    console.log(resDt);
    res.render("form_upload/form", {
        heading: "Upload Form",
        form_list: resDt.suc > 0 ? resDt.msg : null,
    });
})

upload_formRouter.post('/upload_form', async(req, res) => {
   var data = req.body;
   console.log(data);

   if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const uploadedFile = req.files.photo;
  console.log(uploadedFile);

  const allowedFileTypes = ["application/pdf"];
  if (!allowedFileTypes.includes(uploadedFile.mimetype)) {
    return res
      .status(400)
      .send("Invalid file type. Only PDF are allowed.");
  }

  // Check file size
   console.log("//////////////",uploadedFile.size)
  if (uploadedFile.size > 1 * 1024 * 1024) {
    return res.status(400).send("Each File size exceeds the limit of 1 MB.");
  }

  // Move the file to a directory (you can modify the destination path as needed)
  let fileName = Date.now() + "_" + uploadedFile.name;
  uploadedFile.mv("assets/forms/" + fileName, async (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      const user_data = req.session.user.msg[0];
      let bank_img = data.bank_image;

      if (bank_img) {
        let filePathToDelete = "forms/" + bank_img;

        if (fs.existsSync(filePathToDelete)) {
          fs.unlinkSync(filePathToDelete);
        }

        var table_name = "td_forms",
          fields = `file_path = '${fileName}', modified_by = '${user_data.user}', modified_dt = '${datetime}'`,
          values = null;
        (whr = `bank_id= '${data.bank_id}'`), (flag = 1);
        res_dt = await db_Insert(table_name, fields, values, whr, flag);
      } else {
        var table_name = "td_forms",
          fields = `(bank_id, title, file_path, created_by, created_dt)`,
          values = `('${data.bank}', '${data.title}', '${fileName}','${user_data.id}','${datetime}')`;
        (whr = null), (flag = 0);
        res_dt = await db_Insert(table_name, fields, values, whr, flag);
      }

      req.flash("success", "Form added Successful");
      res.redirect("/admin/form");
      console.log(res_dt);
    }
  });
  });
  
module.exports = {upload_formRouter}  