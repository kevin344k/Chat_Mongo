//codigo del servidor
const http = require("http");
const mongoose = require("mongoose");

const express = require("express");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
//servidor http
const server = http.createServer(app);

//static files
app.use(express.static(path.join(__dirname, "public")));

//conexión a la base de datos

mongoose
  .connect("mongodb://localhost/chat-database")
  .then((db) => console.log("db is connected"))
  .catch((err) => console.log(err));

//settings
// configuracion del puerto para que no sea el puerto del s.o

app.set("port", process.env.PORT || 3000);

//websockets
const io = new Server(server);

require("./sockets")(io);

// startir the server
server.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
