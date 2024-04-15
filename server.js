const express = require("express");
var app = express(),
  fs = require("fs"),
  path = require("path"),
  port = process.env.PORT || 3002,
  http = require('http'),
  {Server} = require('socket.io'),
  session = require('express-session');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));
app.use("views", express.static(path.join(__dirname, "views")));

app.set("view engine", "ejs");


// SESSION
app.use(
  session({
    secret: "ECCS",//project name secretKey
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 36000000,//time 1000 h
    },
  })
);
// END

var server = http.createServer(app)
var io = new Server(server)

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.active = req.path.split("/")[2];
  res.locals.message = req.session.message;
  req.io = io;
  delete req.session.message;
  next()
})


const { apiRouter } = require("./routes/apiRouter");
const { notification_dtls } = require("./modules/NotificationModule");
const { adminRouter } = require("./routes/adminRouter");
app.use('/api', apiRouter)
app.use('/admin', adminRouter)

app.get('/test', (req, res) => {
  const {join} = require('path')
  res.sendFile(join(__dirname, 'test.html'))
})

// error handler, if no route has been caught
app.get("/*", (req, res) => {
  res.send({suc: 0, msg: "404 not found"}); 
  res.end();
});

app.post("/*", (req, res) => {
  res.send({suc: 0, msg: "404 not found"}); 
  res.end();
});

var users = []
io.on('connection', (socket) => {
  console.log(socket.id, 'SocketID connected');
  users.push(socket.id)

  socket.on('notification', async (data) => {
    // console.log(data);

    var notify_dtls = await notification_dtls(data.bank_id)
    // console.log(notify_dtls);
    socket.emit('send notification', notify_dtls)

    // if(users.length > 1)
    // socket.to(users[1]).emit('send notification', {suc: 1, msg: `${socket.id} send a message -> Private Message`})
  })

  socket.on('disconnect', () => {
    var i = users.indexOf(socket.id)
    users.splice(i, 1)
  })
})

server.listen(port, (err) => {
  if (err) throw new Error(err);
  else console.log(`App is running  at http://localhost:${port}`);
});
