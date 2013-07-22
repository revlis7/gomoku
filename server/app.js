var io = require('socket.io').listen(8000);

var room  = ['', ''];
var pattern = new Array(225);
var current = '';

io.sockets.on('connection', function (socket) {
  // 
  socket.on('signin', function (user) {
    console.log(user);

    for(var i = 0; i < room.length; i++) {
      if(room[i] == '') {
        socket.emit('conn_ok', 'server connnected');

        room[i] = user;
        if(i == 0) {
          current = user;
        }
        break;
      }
    }
    io.sockets.emit('update_pattern', pattern);
    console.log(room);
  });

  socket.on('turn', function(user, target) {
    // check user's turn
    if(current != user) {
      return;
    }
    // check pattern is correct
    if(pattern[target] == 1 || pattern[target] == 2) {
      return;
    }

    for(var i = 0; i < room.length; i++) {
      if(room[i] == user) {
        // update pattern
        console.log('update pattern');
        if(i == 0) {
          pattern[target] = 1;
          current = room[1];
        } else {
          pattern[target] = 2;
          current = room[0];
        }
        break;
      }
    }
    io.sockets.emit('update_pattern', pattern);
  });

  socket.on('disconnect', function() {
    room = ['', ''];
    pattern = new Array(225);
    current = '';
    console.log('user disconnected');
  });
});