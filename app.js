const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3000;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
    console.log("New client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Server up on port ${port}`));

const getApiAndEmit = "TODO"