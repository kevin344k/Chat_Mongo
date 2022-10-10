const Chat = require("./models/Chat.js");

module.exports = function (io) {
  let users = {};

  io.on("connection", async (socket) => {
    console.log("nuevo usuario conectado");

    let messages= await Chat.find({}).sort({"_id":1})

    socket.emit('load old msgs',messages);
     
    socket.on("new user", (data, cb) => {
      console.log(data);
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });
    //escucha el evento del cliente
    socket.on("send message", async (data, cb) => {
      var msg = data.trim(); //trim quita los espacios que estan demas en un texto
      //The .substr() method returns a portion of the string, starting at the specified index and extending for a given number of characters afterwards.
      //  /w joe jkhjkhkhjk
      // joe lkkjuvygy
      if (msg.substr(0, 3) === "/w ") {
        msg = msg.substr(3);
        const index = msg.indexOf(" ");
        if (index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);

          if (name in users) {
            users[name].emit("whisper", {
              msg,
              nick: socket.nickname,
            });
          } else {
            cb("Error! Please enter a valid user");
          }
        } else {
          cb("Error! Please enter your message");
        }
      } else {
        ///mensajes grupales
        //objeto para guardar los datos en la base de datos
        var newMsg = new Chat({
          nick: socket.nickname,
          msg
        });

        await newMsg.save();

        io.sockets.emit("new message", {
          msg: data,
          nick: socket.nickname,
        });
      }
    });

/*     socket.on("disconnect", (data) => {
      if (!socket.nickname) return;

      delete users[socket.nickname];
      updateNicknames();
    }); */

    function updateNicknames() {
      io.sockets.emit("usernames", Object.keys(users));
    }
  });
};
