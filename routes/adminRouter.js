const express = require('express'),
    adminRouter = express.Router();

const { dashboardRouter } = require('./admin/dashboardRouter');
const { adminUserRouter } = require('./admin/userRouter');

adminRouter.use((req, res, next) => {
    var user = req.session.user
    if(!user && req.path != '/login'){
        res.redirect('/admin/login')
    }else{
        next()
    }
})

adminRouter.use(adminUserRouter)
adminRouter.use(dashboardRouter)

module.exports = {adminRouter}