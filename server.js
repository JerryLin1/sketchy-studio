// ============== Magic =================
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// ======================================

const port = process.env.PORT || 6567;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const rooms = {};

io.on("connection", (socket) => {
  console.log(`${socket.id} has connected.`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected.`);
  });
  socket.on("draw", (line) => {
    socket.broadcast.emit("draw", line)
  });
});

// Make new room like rooms[roomId] = new Room();
function Room() {
  this.clients = {};
  // TODO: more stuff here
}
