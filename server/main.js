var express = require('express');
var app = express();
var server = require('http').Server(app);

// deklarisemo i vezujemo socket.io za server...
var io = require('socket.io')(server);

var messages = [
    {
        userId: 1,
        messageId: 9,
        userName: 'Milos Kovacevic',
        content: {
            text: 'Molderfcking crnnja in da haus!',
            link: 'http://awoiaf.westeros.org/index.php/House_Stonetree'
        },
        likedBy:[4],
        ts: Date.now() - 10000
    },
    {
        userId: 2,
        messageId: 11,
        userName: 'Arya Stark',
        content: {
            text: 'We\'ll come see this inn.',
            link: 'http://gameofthrones.wikia.com/wiki/Inn_at_the_Crossroads'
        },
        likedBy:[2,3,4],
        ts: Date.now() - 10000
    },
    {
        userId: 3,
        messageId: 16,
        userName: 'Cersei Lannister',
        content: {
            text: 'Her scheming forced this on me.',
            link: 'http://gameofthrones.wikia.com/wiki/Margaery_Tyrell'
        },
        likedBy:[1],
        ts: Date.now() - 10000
    },
    {
        userId: 4,
        messageId: 17,
        userName: 'Sasa Djordjevic',
        content: {
            text: 'Najbolji srpski kosarkas ikada',
            link: 'http://sr.wikipedia.org/sr/Александар_Ђорђевић_(кошаркаш)'
        },
        likedBy:[3],
        ts: Date.now() - 10000
    }
];

app.use(express.static('app'));

//pri necijoj konekciji na server, u konzolu upisi notifikaciju i posalji niz poruka tom korisniku
io.on('connection', function (socket) {

    //server prima poruku od klijenta o uzetom id-ju...
    socket.on("porukaIdKorisnika", function(podaci){
        console.log("Konektovan korisnik sa id-jem #" + podaci);
    });

    //saljemo poruke browseru...
    socket.emit("nizPorukaBrowseru", messages);

    // a ukoliko nam korisnik preko browsera salje poruku, obradjujemo je...
    socket.on('new-message', function (data) {
        console.log(data.userName);
        console.log(data.content.text);

        //novu poruku saljemo u messages objekat i onda saljemo citav messages objekat browseru ponovo...
        messages.push(data);

        //ako ovako posaljemo , onda ce samo trenutni soket, odnosno browser da primi messages objekat i da se refreshuje
        // socket.emit("nizPorukaBrowseru", messages);

        // a ako uradimo ovako onda ce svaki soket koji je otvoren prema serveru da primi objekat i refreshuje browser
        io.sockets.emit("nizPorukaBrowseru", messages);
    });

    socket.on("update-message", function (data) {
        var message = messages.filter(function(message){
            return message.messageId == data.messageId;
        })[0];
        message.likedBy = data.likedBy;
        io.sockets.emit('nizPorukaBrowseru', messages);
    });


});


server.listen(80, function(){
    console.log('Listening on port 80...');
});















