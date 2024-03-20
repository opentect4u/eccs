const { report_demand, report_networth } = require("../../modules/ReportModule");

const reportRouter = require("express").Router();

reportRouter.get("/demand_report", async (req, res) => {
  var data = req.query;
  // console.log(data);
  var demand_details = await report_demand(data.tb_name,data.member_id,data.month,data.year)
  // console.log(demand_details);
  res.send(demand_details);
});

reportRouter.get("/networth_report", async (req, res) => {
  var data = req.query;
  // console.log(data);
  var networth_details = await report_networth(data.tb_name,data.member_id,data.month,data.year)
  // console.log(networth_details);
  res.send(networth_details);
})

module.exports = { reportRouter };
