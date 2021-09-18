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
    console.log(`Listening on port ${port}`)
});

io.on("connection", (socket) => {
  console.log(`${socket.id} has connected.`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected.`);
  });
});
