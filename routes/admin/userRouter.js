const adminUserRouter = require('express').Router()

adminUserRouter.get('/login', async(req, res) => {
    res.render('login/login')
})

module.exports = {adminUserRouter}