const express = require('express'),
    adminRouter = express.Router();

const { calendarRouter } = require('./admin/calendarRouter');
const { dashboardRouter } = require('./admin/dashboardRouter');
const { feedbackRouter } = require('./admin/feedbackRouter');
const { holiday_homeRouter } = require('./admin/holiday_homeRouter');
const { notiRouter } = require('./admin/notificationRouter');
const { upload_demandRouter } = require('./admin/upload_demandRouter');
const { upload_formRouter } = require('./admin/upload_formRouter');
const { upload_networthRouter } = require('./admin/upload_networthRouter');
const { adminUserRouter } = require('./admin/userRouter');

adminRouter.use((req, res, next) => {
    var user = req.session.user
    if(!user && req.path != '/login'){
        res.redirect('/admin/login')
    }else{
        next()
    }
})

adminRouter.use(adminUserRouter);
adminRouter.use(dashboardRouter);
adminRouter.use(calendarRouter);
adminRouter.use(feedbackRouter);
adminRouter.use(notiRouter);
adminRouter.use(holiday_homeRouter);
adminRouter.use(upload_formRouter);
adminRouter.use(upload_demandRouter);
adminRouter.use(upload_networthRouter);

module.exports = {adminRouter}