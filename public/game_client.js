var socket = io();

function getURLAttr(attr_name) {
    if (window.location.search == "") {
        return null; //No search query in URL
    }
    var parts = window.location.search.substring(1).split("&");
    for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split("=");
        if (pair[0] == attr_name) {
            return pair[1];
        }
    }
    return null;
}

var GameClient = {
    onConnect: () => {},
    onRegister: () => {},
    onDeregister: () => {}, //TODO: Implement this
    onMessage: () => {},
    sendMessage: function(message) {
        socket.emit('message', message);
    }
}

socket.on('connect', (data) => {
    GameClient.onConnect();
    // console.log("Sending registration");
    // console.log("Player ID: " + playerID);
    var playerID = getURLAttr("session");
    //TODO: Handle error if URL attr is not found
    socket.emit("register", playerID);
});

socket.on('register_status', (status) => {
    // document.write(JSON.stringify(status));
    if (status.err_code !== 0) {
        GameClient.onDeregister(status);
        // alert(JSON.stringify(status));
    } else {
        GameClient.onRegister(status);
    }
});

socket.on('message', (message) => {
    // console.log("Message fired");
    GameClient.onMessage(message);
});
