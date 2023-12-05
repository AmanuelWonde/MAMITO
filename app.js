const express = require("express");
const app = express();

const http = require('http');
const server = http.createServer(app);

const bodyParser = require("body-parser");
const cors = require("cors");

// express configurations
app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use(express.static("./public"));

// WebSocket Configurations
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('deleted_conversation', (username, id) => {
    console.log(username, id);
    io.emit(username, {
      conversationId: id,
      status: 1025
    });
  });

  socket.on('chat', (status, receiver, result) => {
    console.log(status, result.receiver);
    io.emit(receiver, {
      status: status,
      data: result
    });
  });
});

app.use("/user", require("./Routes/user").router);
app.use("/conversation", require("./Routes/conversation").router);
app.use("/chats", require("./Routes/chat").router);
app.use("/questions", require("./Routes/questionRoutes"));
app.use("/answers", require("./Routes/answerRoutes"));
app.use("/match", require("./Routes/matchRoutes"));
app.use("/verify-user", require("./Routes/userVerificationRoutes"));
app.use("/admin", require("./Routes/adminRoutes"));

server.listen(3000, "0.0.0.0", () => {
  console.log("server started");
});

module.exports = { io };