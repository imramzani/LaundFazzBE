if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const cors = require("cors");
const routes = require("./routes");
// const UserRouter = require('./routes/userRouter')

const http = require("http");
const { Server } = require("socket.io");
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", //ubahjadi localhost utk react
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
});

let arrChat = [];
io.on("connection", (socket) => {
  console.log("User Connected :", socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User IDL ${socket.id} joined room ${data}`);
  });

  socket.on("disconnect", () => {
    arrChat = [];
    console.log("User Disconnected");
  });
  socket.on("chatFromClient", (payload) => {
    // console.log(req.Credentials)
    console.log(payload, "<<<<<Test payload");
    arrChat;
    arrChat.push(payload);
    console.log(arrChat);
    io.to(payload.room).emit("messageFromServer", arrChat);
  });
});

// server.listen(PORT, () => {
//   console.log(`server on port ${PORT}`)
// })

// app.use('/users', UserRouter)
//app.use(errorHandler) bintang
app.use("/", routes);

app.use(errorHandler); //mas steven

module.exports = app;
