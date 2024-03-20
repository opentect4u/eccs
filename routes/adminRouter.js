const express = require('express'),
    adminRouter = express.Router();

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

module.exports = {adminRouter}