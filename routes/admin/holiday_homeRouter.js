const { getholidayhome } = require('../../modules/admin/Holiday_homeModule');

const holiday_homeRouter = require('express').Router();

holiday_homeRouter.get('/holiday_home', async (req, res) => {
    var id = req.query.sl_no > 0 ? req.query.sl_no : null;
    var bank_id = req.session.user.bank_id
    var resDt = await getholidayhome(id,bank_id);
    console.log(resDt);
    res.render("holiday_home/view", {
      req_dt: resDt,
      heading: "Holiday home",
      sub_heading: "Holidayhome List",
      dateFormat,
    });
  })

module.exports = {holiday_homeRouter}