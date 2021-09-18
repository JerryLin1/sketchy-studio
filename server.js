// ============== Magic =================
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// ======================================

const gameState = require("./server/gameState.js");

const port = process.env.PORT || 6567;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// ============== Helper Functions =================
function randomId(length) {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
}

function numberOfClientsInRoom(roomId) {
  return Object.keys(rooms[roomId].clients).length;
}
// =================================================

const rooms = {};

io.on("connection", (socket) => {

  console.log(`${socket.id} has connected.`);
  socket.room = undefined;
  socket.nickname = `Player # ${socket.id.substring(0, 4).toUpperCase()}`;

  // socket.emit("newPaint", socket);
  console.log(`${socket.id} has connected.`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected.`);
  });

  socket.on("createRoom", () => {
    let roomId = randomId(8);
    socket.emit("redirect", roomId + "/lobby");
    rooms[roomId] = new Room();

    console.log("room created " + roomId);
    console.dir(rooms, {depth: null});
  });

  socket.on("joinRoom", info => {
    socket.join(info.roomId);
    rooms[info.roomId].clients[socket.id] = new Client(info.nickname, info.roomId);
    io.to(info.roomId).emit("updateClientList", rooms[info.roomId].clients);
    console.log(rooms[info.roomId].clients);
  })

  socket.on("startGame", ()=> {
    if (rooms[roomId].clients[socket.id].isHost && rooms[roomId].gameState === gameState.LOBBY) {
      rooms[roomId].gameState = gameState.DRAWING;
      setTimeout(() => {
        startDescribingPhase();
      }, 90000);
    }
  })

  socket.on("draw", (paintedLines) => {
    if (rooms[roomId].gameState === gameState.DRAWING) {
      rooms[socket.roomId].originalDrawings[socket.id] = paintedLines;
    }
    else if (rooms[roomId])
    io.emit("draw", paintedLines)
  });

  function startDescribingPhase() {

  }

});

// Make new room like rooms[roomId] = new Room();
function Room() {
  this.clients = {};
  this.speaker = "";
  this.gameState = gameState.LOBBY;
  this.disconnected = 0;
  
  this.originalDrawings = {
    // TODO: socket.id: paintedLines. Emitted by client when time runs out
  }
  
  // more stuff here if need be
}
// Add new client like rooms[roomId].clients[socket.id] = new Client()
function Client(nickname, roomId) {
  this.nickname = nickname;
  this.disconnected = false;
  this.isHost = (numberOfClientsInRoom(roomId) === 1);
  // TODO: Add avatar property

  // Paint is an array of the lines drawn by the client, which can be emitted and recreated on client side
  this.paint = [];
}
// function addClient() {

// }
