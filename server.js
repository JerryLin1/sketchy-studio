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
  // socket.emit("newPaint", socket);
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
// Add new client like rooms[roomId].clients[socket.id] = new Client()
function Client(nickname) {
  this.nickname = nickname;
  // Paint is an array of the lines drawn by the client, which can be emitted and recreated on client side
  this.paint = [];
}
// function addClient() {

// }
