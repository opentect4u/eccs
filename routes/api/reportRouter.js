const { report_demand, report_networth } = require("../../modules/ReportModule");

const reportRouter = require("express").Router();

reportRouter.get("/demand_report", async (req, res) => {
  var data = req.query;
  // console.log(data);
  var demand_details = await report_demand(data.tb_name,data.member_id,data.month,data.year)
  // console.log(demand_details);
  if(demand_details.suc > 0){
    if(demand_details.msg.length > 0){
       res.send(demand_details)
    }else{
       res.send({suc: 0, msg: "Data not found"})
    }
  }else{
     res.send(demand_details)
  }
});

reportRouter.get("/networth_report", async (req, res) => {
  var data = req.query;
  // console.log(data);
  var networth_details = await report_networth(data.tb_name,data.member_id,data.month,data.year)
  // console.log(networth_details);
  if(networth_details.suc > 0){
    if(networth_details.msg.length > 0){
       res.send(networth_details)
    }else{
       res.send({suc: 0, msg: "Data not found"})
    }
  }else{
     res.send(networth_details)
  }
})

module.exports = { reportRouter };
