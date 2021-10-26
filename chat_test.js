var GameManager = require("./game_engine.js");


var gameInstance = function(room_id) { //Message ID is the "room" ID--one per game
    //TODO: Maybe keep track of the users in the room automatically?
    this.players = [];
    this.room_id = room_id;
    //TODO: Create a sendToSocketID function
    //TODO: Create a sendMessageToAll function
    this.onPlayerJoin = function(player, player_id) {
        //i.e. send a message to all the players that someone joined. Up to the developer of the game.
        console.log("onPlayerJoin ran!! "+player.first_name);
    };
    this.onPlayerLeave = function(player) {
        console.log("onPlayerLeave ran!! "+player.first_name)
    };
    this.onMessage = function(message, player) { //Players array contains the socket ID and it's up to date.
        console.log("onMessage ran!! "+JSON.stringify(message));

        GameManager.sendMessageToAll(this.room_id, player.first_name+": "+message);
        //use GameManager.sendMessageToAll() or GameManager.sendToSocketID() here
    };
}

GameManager.registerGame({
    'short_name': 'tictactoe',
    'display_name': 'Tic-Tac-Toe',
    'url': 'https://www.example.com/chat_test.html', //change this to incorporate serving files?
    'gameInstance': gameInstance
});
//TODO: Incorporate sending data from a game to the game manager
//TODO: The game manager should give the game a unique room ID
//TODO: Save game instances after restart?

//TODO: Maybe turn this into a chat room test?
