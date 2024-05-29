const { memData } = require('../../modules/admin/Member_adminModule');

const memberRouter = require('express').Router();

memberRouter.get("/member", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    var resDt = await memData(id);
    console.log(resDt,'123');
    res.render("member_dtls/member_view", {
      mem_dt: resDt,
      heading: "Member Details",
      sub_heading: "Member Details List",
      dateFormat,
    });
  });

module.exports = {memberRouter}
