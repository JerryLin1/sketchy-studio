// ============== Magic =================
const { info } = require("console");
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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
    console.dir(rooms, { depth: null });
  });

  socket.on("joinRoom", info => {
    socket.join(info.roomId);
    socket.room = info.roomId;
    rooms[info.roomId].clients[socket.id] = new Client(info.nickname, info.roomId);
    io.to(info.roomId).emit("updateClientList", rooms[info.roomId].clients);
    console.log(rooms[info.roomId].clients);
  })

  socket.on("draw", (paintedLines) => {
    if (rooms[roomId].gameState === gameState.DRAWING) {
      rooms[socket.roomId].originalDrawings[socket.id] = paintedLines;
    }
    else if (rooms[roomId].gameState === gameState.DESCRIBE) {
      // rooms[socket.roomId].originalDrawings[socket.id] = paintedLines;
    }
    io.emit("draw", paintedLines)
  });

  socket.on("startGame", () => {
    if (rooms[socket.room].clients[socket.id].isHost && rooms[socket.room].gameState === gameState.LOBBY) {
      rooms[socket.room].gameState = gameState.DRAWING;
      rooms[socket.room].rounds = [];

      io.to(socket.room).emit("startDrawingPhase");
      setTimeout(() => {
        // Assign a random describer to an original drawing by another artist
        let originalDrawings = Object.entries(rooms[socket.room].originalDrawings);
        for (const [artist, drawing] of originalDrawings) {
          let clientIds = Object.keys(rooms[socket.room].clients);
          let randomClient = clientIds[getRandomInt(0, clientIds.length)];
          while (randomClient === artist) {
            randomClient = clientIds[getRandomInt(0, clientIds.length)];
          }

          rooms[socket.room].rounds.push(new Round(drawing, artist, randomClient));
        }

        startDescribingPhase();
      }, 90000);
    }
  })

  function startDescribingPhase() {

    // TODO: Wipe drawing phase info idk

    let currentRound = rooms[socket.room].currentRound;
    let currentRoundInfo = rooms[socket.room].rounds[currentRound];

    socket.to(currentRoundInfo.describer).emit("startDescribingPhase");
    socket.to(currentRoundInfo.describer).emit("describer", (currentRoundInfo.originalDrawing, currentRoundInfo.originalArtist));
    rooms[socket.room].gameState = gameState.DESCRIBE;
    setTimeout(() => { startRoundResultPhase() }, 120000);
  }

  function startRoundResultPhase() {
    io.to(socket.room).emit("startRoundResultPhase");
    rooms[socket.room].gameState = gameState.ROUND_RESULTS;
    setTimeout(() => {
      rooms[socket.room].currentRound
      < Object.keys(rooms[socket.room].rounds).length
      ? startDescribingPhase() : startGameResultPhase()
    }, 5000);
    rooms[socket.room].currentRound++;

  }

  function startGameResultPhase() {
    io.to(socket.room).emit("startGameResultPhase");
    rooms[socket.room].gameState = gameState.GAME_RESULTS;

    // TODO: handle exit

  }

});

// Make new room like rooms[roomId] = new Room();
function Room() {
  this.clients = {};
  this.speaker = "";
  this.gameState = gameState.LOBBY;
  this.disconnected = 0;
  this.currentRound = 0;

  this.originalDrawings = {
    // TODO: socket.id: paintedLines. Emitted by client when time runs out
  }

  // more stuff here if need be
}

// Add new client like rooms[roomId].clients[socket.id] = new Client()
function Client(nickname, roomId) {
  this.nickname = nickname;
  this.disconnected = false;
  this.isHost = (numberOfClientsInRoom(roomId) === 0);
  // TODO: Add avatar property

  // Paint is an array of the lines drawn by the client, which can be emitted and recreated on client side
  this.paint = [];
}


function Round(originalDrawing, originalArtist, describer) {
  this.originalDrawing = undefined;
  this.originalArtist = undefined; //id
  this.describer = undefined; //id
  this.copies = {};
}
