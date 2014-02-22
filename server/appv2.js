var io = require('socket.io').listen(8000);

var mario_id = null;
var luigi_id = null;

var mario = null;
var luigi = null;

var pattern = new Array();

var init_pattern = function () {
  for (var n = 0; n < 255; n++) {
    if (n === 25) {
      pattern[n] = 1;
    } else if (n === 47) {
      pattern[n] = 2;
    } else {
      pattern[n] = 0;
    }
  }
}

io.sockets.on('connection', function (socket) {
  // user sign in
  socket.on('signin', function (user) {
    if (mario === null) {
      mario_id = socket.id;
      mario    = user;

      socket.emit('message', 'server connnected');
      console.log('user connected');

      // initialize pattern
      if (luigi) {
        socket.emit('update_rival', luigi);
        io.sockets.socket(luigi_id).emit('update_rival', mario);
        init_pattern();
        io.sockets.emit('update_pattern', pattern);
      }
    } else if (luigi === null) {
      luigi_id = socket.id;
      luigi    = user;

      socket.emit('message', 'server connnected');
      console.log('user connected');

      // initialize pattern
      if (mario) {
        socket.emit('update_rival', mario);
        io.sockets.socket(mario_id).emit('update_rival', luigi);
        init_pattern();
        io.sockets.emit('update_pattern', pattern);
      }
    } else {
      console.log('server full');
      socket.emit('message', 'server full');
      // kick user
      socket.disconnect();
    }
  });

  // user sign out
  socket.on('disconnect', function () {
    if (mario_id === socket.id) {
      mario_id = null;
      mario    = null;
    } else if (luigi_id === socket.id) {
      luigi_id = null;
      luigi    = null;
    }
    console.log('user disconnected');
  });

  /*
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
  */
});