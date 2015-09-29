//setovanje id-ja za novog korisnika ili uzimanje starog za starog korisika...
function randomId(){
    return Math.floor(Math.random() * 1e11);
}
var userId = localStorage.getItem("userId") || randomId();
localStorage.setItem("userId", userId);
console.log("Cao ja sam korisnik #" + userId);

var socket = io.connect('http://localhost', {'forceNew':true});

//kada se konektuje korisnik, saljemo serveru poruku o ID-ju...
socket.emit("porukaIdKorisnika", userId);

var messageCache;

// server je poslao nizPorukaBrowseru paket koji parsiramo u stranicu...
socket.on('nizPorukaBrowseru', function(data){
    console.info(data);
    //snimamo podatke za ubuduce...
    messageCache = data;
    render();
});

function render(){
    var data = messageCache;
    var html = data.sort(function(a, b){
        return a.ts - b.ts;
    }).map(function(data, index){
        return (
        '<form class="message" onsubmit="return likeMessage(messageCache[' + index + '])">' +
        '<div class="name">' + data.userName + '</div> <a href="' + data.content.link + '" class="message" target=blank >' + data.content.text + '</a>' +
        '<div class="time">' + moment(data.ts).fromNow() +  '</div>' +

        '<input type="submit" class="likes-count" value="' + data.likedBy.length + ' Likes">' +
        '</form>'
        );
    }).join(" ");

    document.getElementById("messages").innerHTML = html;

}

function likeMessage(message){
    var index = message.likedBy.indexOf(userId);
    if(index<0){
        message.likedBy.push(userId);
    }else {
        message.likedBy.splice(index, 1);
    }

    socket.emit("update-message", message);
    render();
    return false;
}

function addMessage(e) {
    var payload = {
        messageId: randomId(),
        userName: document.getElementById("username").value,
        content: {
                text: document.getElementById("message").value,
                link: document.getElementById("linkAddress").value
        },
        likedBy: [],
        ts: Date.now()
    };
    socket.emit("new-message", payload);
    return false;
}

