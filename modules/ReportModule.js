const { db_Select } = require("./MasterModule");

const report_demand = (tb_name,member_id,month,year) =>{
    return new Promise(async (resolve, reject) => {
        var select = "*",
          table_name = `${tb_name}`,
          whr = `member_id = ${member_id} AND month = ${month} AND year = ${year}`,
          order = null;
        var demand_dt = await db_Select(select, table_name, whr, order);
        resolve(demand_dt);
      });
};

const report_networth = (tb_name,member_id,month,year) =>{
    return new Promise(async (resolve, reject) => {
        var select = "a.id, a.month, a.year, a.ac_type_id, b.name ac_name, a.member_id, a.member_name, a.dep_loan_flag, a.prn_amt, a.intt_amt, a.intt_rt, a.opening_dt",
          table_name = `${tb_name} a, md_ac_type b`,
          whr = `a.ac_type_id=b.id AND a.member_id = ${member_id} AND a.month = ${month} AND a.year = ${year}`,
          order = null;
        var networth_dt = await db_Select(select, table_name, whr, order);
        resolve(networth_dt);
      });
};

module.exports = { report_demand,report_networth };