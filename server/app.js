var io = require('socket.io').listen(8000);

var lobby_max = 100;
var room_max  = 2;

var lobby = new Array(lobby_max);
var user_list = {};

var pattern = new Array(lobby_max);
var current = new Array(lobby_max);

io.sockets.on('connection', function (socket) {
  socket.on('signin', function (user) {
    for(var i = 0; i < lobby.length; i++) {
      if(typeof lobby[i] === "undefined" || lobby[i] === null) {
        lobby[i] = new Array();
      }
      if(lobby[i].length != room_max) {
        lobby[i].push(user);
        user_list[socket.id] = { "user" : user, "lobby" : i };
        if(lobby[i].length == room_max) {
          current[i] = lobby[i][0];
          pattern[i] = new Array();
          for(var n = 0; n < 255; n++) {
            pattern[i][n] = 0;
          }
        }

        socket.emit('message', 'server connnected');
        io.sockets.emit('update_pattern', pattern[i]);
        console.log('user connected');
        console.log(user_list);
        console.log(lobby[i]);
        return;
      }
    }
    socket.emit('message', 'server full');
  });

  socket.on('turn', function (target) {
    if(user_list[socket.id]) {
      console.log('user\'s turn');
      var user_lobby = user_list[socket.id].lobby;
      var user_name  = user_list[socket.id].user;
console.log('lobby: ' + user_lobby);
console.log('user: ' + user_name);
console.log('current_user: ' + current);
console.log('pattern: ' + pattern[user_lobby][target]);

      // check user's turn
      if(current[user_lobby] != user_name) {
        return;
      }
      // check pattern is correct
      if(pattern[user_lobby][target] == 1 || pattern[user_lobby][target] == 2) {
        return;
      }

      var team = lobby[user_lobby].indexOf(user_name);

      if(team == 0) {
        pattern[user_lobby][target] = 1;
        current[user_lobby] = lobby[user_lobby][1];
      } else {
        pattern[user_lobby][target] = 2;
        current[user_lobby] = lobby[user_lobby][0];
      }

      io.sockets.emit('update_pattern', pattern[user_lobby]);
    }
  });

  socket.on('disconnect', function () {
    if(user_list[socket.id]) {
      var user_lobby = user_list[socket.id].lobby;
      var user_name  = user_list[socket.id].user;

      lobby[user_lobby].splice(lobby[user_lobby].indexOf(user_name), 1);
      delete user_list[socket.id];
      pattern[user_lobby] = null;
      current[user_lobby] = null;

      io.sockets.emit('update_pattern', pattern);
      console.log('user disconnected');
      console.log(user_list);
      console.log(lobby[user_lobby]);
    }
  });
});