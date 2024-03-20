const dashboardRouter = require('express').Router();

dashboardRouter.get('/dashboard', (req, res) => {
    res.render("dashboard/view");
})

module.exports = { dashboardRouter }