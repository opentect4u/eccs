const { months, years, db_Insert } = require('../../modules/MasterModule');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const fileUpload = require("express-fileupload");
const csv = require('fast-csv');
const upload_demandRouter = require('express').Router();

upload_demandRouter.use(fileUpload())

upload_demandRouter.get('/demand', async (req, res) =>{
    var bank_id = req.session.user.bank_id
    // console.log(req.session.user);
    res.render("demand_upload/demand", {
        heading: "Upload Demand",
        months: months,
        years : years,
    });
});

upload_demandRouter.post('/upload_demand_csv', async (req, res) =>{
    var data = req.body, res_dt;
    // console.log(data,'456');
    var table = req.session.user.dmd_tab_name
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var csv_file = req.files.import_csv
    if(csv_file){
        var csv_file_name = csv_file.name
        csv_file.mv('assets/csv/' + csv_file_name, async (err) => {
            if(err){
                // console.log(err);
            } else {
                var csv_data = await uploadCsv('assets/csv/' + csv_file_name)
                for (let dt of csv_data){
                    const [emp_code,member_id,unit_code,member_name,dob,month,year,tf_clr_bal,gl_loan_amt,gl_outstanding,cl_loan_amt,cl_outstanding,gl_id,cl_id,tf_prn,gl_tot,gl_run,gl_principal,gl_interest,cl_tot,cl_run,cl_principal,cl_interest,total_demand,ltc_id,ltc_sanc_amt,ltc_curr_prn,ltc_tot_instl,ltc_curent_instl,ltc_prn,ltc_intt] = dt
                    // console.log(dt,'123456789');
                    // console.log(emp_code,member_id, 'lalalalala');
                var table_name = `${table}`,
                fields = `(emp_code,member_id,unit_code,member_name,dob,month,year,tf_clr_bal,gl_loan_amt,gl_outstanding,cl_loan_amt,cl_outstanding,gl_id,cl_id,tf_prn,gl_tot,gl_run,gl_principal,gl_interest,cl_tot,cl_run,cl_principal,cl_interest,total_demand,ltc_id,ltc_sanc_amt,ltc_curr_prn,ltc_tot_instl,ltc_curent_instl,ltc_prn,ltc_intt,created_at)`,
                values = `('${emp_code}', '${member_id}','${unit_code}','${member_name}','${dob}','${data.months}','${data.years}','${tf_clr_bal}','${gl_loan_amt}','${gl_outstanding}','${cl_loan_amt}','${cl_outstanding}','${gl_id}','${cl_id}','${tf_prn}','${gl_tot}','${gl_run}','${gl_principal}','${gl_interest}','${cl_tot}','${cl_run}','${cl_principal}','${cl_interest}','${total_demand}','${ltc_id}','${ltc_sanc_amt}','${ltc_curr_prn}','${ltc_tot_instl}','${ltc_curent_instl}','${ltc_prn}','${ltc_intt}','${datetime}')`;
                whr = null,
                flag = 0;
                res_dt = await db_Insert(table_name,fields,values,whr,flag);
            }
            if(res_dt.suc > 0){
                req.session.message = {
                    type: "success",
                    message: "Demand CSV file uploaded Successfully",
                };
              }else{
                req.session.message = {
                    type: "danger",
                    message: "Demand CSV file not uploaded Successfully",
                };
                res.redirect("/admin/demand");
              }
               
            }

        })
    }
});

upload_demandRouter.post('/upload_networth_csv', async (req, res) =>{
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
                    const [ac_type_id, acc_num,member_id,member_name,dep_loan_flag,prn_amt,intt_amt,intt_rt] = dt
                    // console.log(dt,'123456789');
                    // console.log(member_id, 'lalalalala');
                var table_name = `${table}`,
                fields = `(month,year,ac_type_id,member_id,member_name,dep_loan_flag,prn_amt,intt_amt,intt_rt,opening_dt)`,
                values = `('${data.months}','${data.years}','${ac_type_id}','${member_id}','${member_name}','${dep_loan_flag}','${prn_amt}','${intt_amt}','${intt_rt}','${datetime}')`;
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
            }
            res.redirect("/admin/networth");
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

module.exports = {upload_demandRouter}