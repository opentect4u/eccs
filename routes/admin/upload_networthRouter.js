const upload_networthRouter = require('express').Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const fileUpload = require("express-fileupload");
const csv = require('fast-csv');
const { months, years } = require('../../modules/MasterModule');

upload_networthRouter.use(fileUpload())


upload_networthRouter.get('/networth', async (req, res) =>{
    var bank_id = req.session.user.bank_id
    // console.log(req.session.user);
    res.render("networth_upload/networth", {
        heading: "Upload Networth",
        months: months,
        years: years,
    });
});

upload_networthRouter.post('/upload_networth_csv1', async (req, res) =>{
    var data = req.body, res_dt;
    // console.log(data,'456');
    var table = req.session.user.ntw_tab_name
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var csv_file = req.files.import_csv
    if(csv_file){
        var csv_file_name = csv_file.name
        csv_file.mv('assets/csv_networth/' + csv_file_name, async (err) => {
            if(err){
                // console.log(err);
            } else {
                var csv_data = await uploadCsv('assets/csv_networth/' + csv_file_name)
                for (let dt of csv_data){
                    const [ac_type_id,member_id,member_name,dep_loan_flag,prn_amt,intt_amt,intt_rt] = dt
                    // console.log(dt,'123456789');
                    // console.log(id,member_id, 'lalalalala');
                var table_name = `${table}`,
                fields = `(month,year,ac_type_id,member_id,member_name,dep_loan_flag,prn_amt,intt_amt,intt_rt,opening_dt)`,
                values = `('${data.months}','${data.years}','${ac_type_id}','${member_id}','${member_name}','${dep_loan_flag}','${prn_amt}','${intt_amt}','${intt_rt}','$'${datetime}')`;
                whr = null,
                flag = 0;
                res_dt = await db_Insert(table_name,fields,values,whr,flag);
            }
            if(res_dt.suc > 0){
                req.session.message = {
                    type: "success",
                    message: "Networth CSV file uploaded Successfully",
                };
              }else{
                req.session.message = {
                    type: "danger",
                    message: "Networth CSV file not uploaded Successfully",
                };
                res.redirect("/admin/networth");
              }
            }

        })
    }
});

function uploadCsv(uriFile) {
    let stream = fs.createReadStream(uriFile);
    let csvDataColl = [];
    const addData = (data) => csvDataColl.push(data);
    return new Promise(async (resolve, reject) => {
        let fileStream = csv
            .parse()
            .on("data", function (data) {
                addData(data);
            })
            .on("end", function () {
                csvDataColl.shift();
                // console.log(csvDataColl);
                fs.unlinkSync(uriFile)
                resolve(csvDataColl)
            })
            stream.pipe(fileStream);
            // console.log('Closed');
        })
}


module.exports = {upload_networthRouter}