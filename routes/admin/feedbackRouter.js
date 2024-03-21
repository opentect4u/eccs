const { getFeedBack } = require('../../modules/admin/Feedback_adminModule');

const feedbackRouter = require('express').Router();

feedbackRouter.get('/feedback', async (req, res) => {
    var id = null;
    var resDt = await getFeedBack(id);
    // console.log(resDt);
    res.render("feedback/view", {
      req_dt: resDt,
      heading: "Feedback",
      sub_heading: "Feedback List",
      dateFormat,
    });
  })

module.exports = {feedbackRouter}