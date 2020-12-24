require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const usersRouter = require('./src/routes/users');
const postsRouter = require('./src/routes/posts');
const dbConnect = require('./src/config/db');
const http = require("http");
const cors = require('cors');
const User = require('../server/src/models/user.model')
const Post = require('../server/src/models/post.model')

const app = express();

const server = http.createServer(app);
const socket = require("socket.io");



const io = socket(server);

// const PORT = process.env.PORT || 8000;
dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const sessionMiddleware = session({
  name: 'sid',
  secret: process.env.SECRETSESSION,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
  }),
  saveUninitialized: false,
  cookie: { secure: false },
})
// register middleware in Express
app.use(sessionMiddleware);
// register middleware in Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
  // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
  // connections, as 'socket.request.res' will be undefined in that case
});

io.on('connection', async (socket) => {
  console.log('9999999999999999999999')

  const session = socket.request.session;

  if (session.user) {
    console.log('88888888888888888')
    session.connections++;
    session.save();

    await User.findOneAndUpdate({ _id: session.user.id }, { socketID: socket.id })


    socket.on("wrong notification", async body => {
      console.log('wrong', body.offenderSocketID)
      io.to(body.offenderSocketID).emit("wrong notification", body);
    })


    socket.on("message notification", async body => {
      console.log("message notification", body.offenderSocketID)
      const wrong = await Post.findById(body.wrongID)
      // console.log(wrong);
      const offender = await User.findById(wrong.offenderId);
      const author = await User.findById(wrong.authorId);
      console.log(offender.socketID);
      console.log(author.socketID);
      if (body.offenderSocketID === offender.socketID) {
        return io.to(author.socketID).emit("message notification", body)
      }
      return io.to(offender.socketID).emit("message notification", body)
    })

    socket.on("message", async body => {
      const wrong = await Post.findById(body.id)
      wrong.sms.push({ message: body.message, login: body.login})
      await wrong.save()
      console.log(wrong);

      io.emit("private message", wrong.sms)
    })
  }
});

app.use((req, res, next) => {
  res.locals.login = req.session?.user?.login;
  res.locals.id = req.session?.user?.id;
  next();
});

app.use('/', postsRouter);
app.use('/users', usersRouter);


server.listen(8000, () => console.log("Server is running on port 8000"));
