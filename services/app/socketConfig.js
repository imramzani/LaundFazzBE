// const http = require("http");
// const { Server } = require("socket.io");
const server = require('./bin/http')
// const io = new Server(server, {
//     cors: {
//       origin: "*", //ubahjadi localhost utk react
//       methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//       preflightContinue: false,
//       optionsSuccessStatus: 204,
//     }
//   });
  const io = require("socket.io")(server, {
    cors: {
      // origin: ["http://localhost:3000", "http://localhost:19006"],
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
  });

  let arrChat = [];
//   io.on('connection', socket => {

//     // all socket listener here
    
//   });
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
  socket.on("send-message", (data) => {
    io.emit("room-detail", data);
  });
  socket.on("typing-start", (data) => {
    io.emit("typing-start", data);
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

module.exports = io;
// const io = require('socket.io')();



// module.exports = io;