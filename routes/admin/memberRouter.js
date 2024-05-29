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

  memberRouter.get("/member_edit", async (req, res) => {
    var id = req.query.id > 0 ? req.query.id : null;
    // var conDt = null;
    // if (id > 0) {
    //     var res_dt = await conData(id);
    //     conDt = res_dt.suc > 0 ? res_dt.msg : null;
    //     console.log(conDt,'123');
    // }
    res.render("member_dtls/member_edit", {
        // con_data: conDt,
        // heading: "Contact Details",
        // sub_heading: `Contact Details List ${id > 0 ? 'Edit' : 'Add'}`,
        // breadcrumb: `<ol class="breadcrumb">
        // <li class="breadcrumb-item"><a href="/admin/contact">Contact Details list</a></li> 
        // <li class="breadcrumb-item active">Contact Details List ${id > 0 ? 'Edit' : 'Add'} </li>
        // </ol>`,
        dateFormat,
    });
});  

module.exports = {memberRouter}
