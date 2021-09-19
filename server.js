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
    rooms[info.roomId].clients[socket.id] = new Client(info.nickname, info.roomId, info.avatar);
    io.to(info.roomId).emit("updateClientList", rooms[info.roomId].clients);
    console.log(rooms[info.roomId].clients);
  })

  socket.on("draw", (paintedLines) => {
    let currentRound = rooms[socket.room].currentRound;
    if (rooms[socket.room].gameState === gameState.DRAWING) {
      rooms[socket.room].originalDrawings[socket.id] = paintedLines;
    }
    else if (rooms[socket.room].gameState === gameState.DESCRIBE) {
      rooms[socket.room].rounds[currentRound].copies.push({
        name: rooms[socket.room].clients[socket.id].nickname,
        id: socket.id,
        drawing: paintedLines,
        avatar: rooms[socket.room].clients[socket.id].avatar
      });
    }
    io.emit("draw", paintedLines)
  });

  socket.on("startGame", () => {
    if (rooms[socket.room].clients[socket.id].isHost && rooms[socket.room].gameState === gameState.LOBBY) {
      rooms[socket.room].gameState = gameState.DRAWING;

      io.to(socket.room).emit("startDrawingPhase");

      rooms[socket.room].nextPhase = setTimeout(() => {
        assignDescribers();
        startDescribingPhase();
      }, 120000);
    }
  })

  socket.on("finishedDrawing", () => {
    rooms[socket.room].finishedDrawing++;
    if (rooms[socket.room].finishedDrawing === numberOfClientsInRoom(socket.room)
      || rooms[socket.room].gameState === gameState.DESCRIBE && rooms[socket.room].finishedDrawing === numberOfClientsInRoom(socket.room) - 1) {
      clearTimeout(rooms[socket.room].nextPhase);
      console.log("finished");
      rooms[socket.room].finishedDrawing = 0;

      if (rooms[socket.room].gameState === gameState.DRAWING) {
        if (rooms[socket.room].currentRound === 0) {
          assignDescribers();
        }
        startDescribingPhase();

      } else if (rooms[socket.room].gameState === gameState.DESCRIBE) {
        startRoundResultsPhase();
      }
    }
  })

  socket.on("nextRound", () => {
    if (rooms[socket.room].currentRound === rooms[socket.room].rounds.length) {
      console.log("game results")
      startGameResultsPhase();
    } else if (rooms[socket.room].currentRound < rooms[socket.room].rounds.length) {
      startDescribingPhase();


    }
  })

  function startDescribingPhase() {
    if (rooms[socket.room].nextPhase !== undefined) {
      clearTimeout(rooms[socket.room].nextPhase);
    }
    io.to(socket.room).emit("startDrawingPhase");
    io.to(socket.room).emit("newState", "DESCRIBE");
    io.to(socket.room).emit("resetCanvas");


    let currentRound = rooms[socket.room].currentRound;
    let currentRoundInfo = rooms[socket.room].rounds[currentRound];

    rooms[socket.room].rounds[currentRound].copies.push(
      {
        name: rooms[socket.room].clients[currentRoundInfo.originalArtist].nickname + "(The original artist!)",
        id: socket.id,
        drawing: currentRoundInfo.originalDrawing,
        avatar: rooms[socket.room].clients[currentRoundInfo.originalArtist].avatar
      }
    )


    io.to(currentRoundInfo.describer).emit("startDescribingPhase");
    let artist = rooms[socket.room].clients[currentRoundInfo.originalArtist].nickname;
    io.to(currentRoundInfo.describer).emit("describer", { drawing: currentRoundInfo.originalDrawing, artist: artist });
    rooms[socket.room].gameState = gameState.DESCRIBE;
    rooms[socket.room].nextPhase = setTimeout(() => { startRoundResultsPhase() }, 10000);
  }

  function startRoundResultsPhase() {
    if (rooms[socket.room].nextPhase !== undefined) {
      clearTimeout(rooms[socket.room].nextPhase);
    }
    io.to(socket.room).emit("startRoundResultsPhase");
    io.to(socket.room).emit("receiveDrawings", rooms[socket.room].rounds[rooms[socket.room].currentRound].copies);
    io.to(socket.id).emit("receiveIsDescriber", rooms[socket.room].rounds[rooms[socket.room].currentRound].describer);

    rooms[socket.room].gameState = gameState.ROUND_RESULTS;
    rooms[socket.room].currentRound++;
  }

  function startGameResultsPhase() {
    io.to(socket.room).emit("startGameResultsPhase");
    console.log("HERE");

    let clientName = "";
    let max = 0;
    for (let client of rooms[socket.room].clients) {
      if (client.points > max) {
        max = client.points;
        clientName = client.nickname;
      }
    }

    rooms[socket.room].gameState = gameState.GAME_RESULTS;
    io.to(socket.room).emit("receiveWinner", {points: max, name: client.nickname});

  }

  function assignDescribers() {
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
  }

  socket.on("nextImage", () => {
    io.to(socket.room).emit("goNext");
  })

  socket.on("prevImage", () => {
    io.to(socket.room).emit("goPrev");
  })

  socket.on("voteFor", id => {
    rooms[socket.room].clients[id].points ++;
  })

});

// Make new room like rooms[roomId] = new Room();
function Room() {
  this.clients = {};
  this.speaker = "";
  this.gameState = gameState.LOBBY;
  this.disconnected = 0;
  this.currentRound = 0;
  this.finishedDrawing = 0;
  this.nextPhase = undefined;
  this.rounds = [];

  this.originalDrawings = {
    // TODO: socket.id: paintedLines. Emitted by client when time runs out
  }

  // more stuff here if need be
}

// Add new client like rooms[roomId].clients[socket.id] = new Client()
function Client(nickname, roomId, avatar) {
  this.nickname = nickname;
  this.disconnected = false;
  this.isHost = (numberOfClientsInRoom(roomId) === 0);
  this.points = 0;
  this.avatar = (info.avatar === null) ?
    {
      bodyNum: -1,
      eyesNum: -1,
      hairNum: -1,
      mouthNum: -1,
      shirtNum: -1
    } :
    avatar;

  // Paint is an array of the lines drawn by the client, which can be emitted and recreated on client side
  this.paint = [];
}


function Round(originalDrawing, originalArtist, describer) {
  this.originalDrawing = originalDrawing;
  this.originalArtist = originalArtist; //id
  this.describer = describer; //id
  this.copies = [];
}
