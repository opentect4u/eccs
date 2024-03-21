const express = require("express"),
  apiRouter = express.Router();

const { calendarRouter } = require("./api/calendarRouter");
const { contactRouter } = require("./api/contactRouter");
const { downloadFormRouter } = require("./api/downloadFormRouter");
const { feedbackRouter } = require("./api/feedbackRouter");
const { holidayhomeRouter } = require("./api/holidayhomeRouter");
const { notificationRouter } = require("./api/notificationRouter");
const { reportRouter } = require("./api/reportRouter");
const { userRouter } = require("./api/userRouter");

apiRouter.use(userRouter);
apiRouter.use(reportRouter);
apiRouter.use(calendarRouter);
apiRouter.use(contactRouter);
apiRouter.use(downloadFormRouter);
apiRouter.use(feedbackRouter);
apiRouter.use(holidayhomeRouter);
apiRouter.use(notificationRouter);

module.exports = { apiRouter };
