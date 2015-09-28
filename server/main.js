var express = require('express');
var app = express();
var server = require('http').Server(app);

// deklarisemo i vezujemo socket.io za server...
var io = require('socket.io')(server);

//app.get('/', function(req, res){
//    res.send('pusi karu!');
//    console.log('something connected to express...');
//});
app.use(express.static('app'));

io.on('connection', function (socket) {
    console.log("Something connected to Socket.io...");
    socket.emit("messages",["Hello","Hi There", "How Are You?"]);
});


server.listen(80, function(){
    console.log('Listening on port 80...');
});















