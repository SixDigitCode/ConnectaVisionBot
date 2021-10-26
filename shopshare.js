var GameManager = require("./game_engine.js");
var UserManager = require("./users_manager.js");
//TODO: Maybe use GameInstance as an object? (i.e. new GameInstance or something)

var gameInstance = function(room_id) { //Message ID is the "room" ID--one per game
    console.log("FIRING UP GAME INSTANCE with room ID "+room_id);
    //TODO: Maybe keep track of the users in the room automatically?
    this.players = [];
    this.room_id = room_id;

    //TODO: Create version of useState for this
    // this.gameState = {
    //     board: [
    //         [0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0],
    //         [0, 0, 0, 0, 0, 0, 0]
    //     ],
    //     players: {
    //         1: null,
    //         2: null
    //     },
    //     currentTurn: 1,
    //     winner: null
    // }
    this.gameState = null;

    var loadGameState = (async function() {
        console.log("Loading game state");
        this.gameState = await GameManager.useGameState(this.room_id, {
            users: [], //0: player 0, 1: player 1, etc. Limit of 10? Does player 0 decide when to start the game?
            items: [],
            nextId: 1

            // Items look like this:
            /*

                {
                    "id": 1,
                    "name": "Flour",
                    "assignee": 2, //User index. Can be null if no one is assigned to it
                    "createdby": 2,
                    "quantity": 2,
                    "donestatus": 0, //0: not done, 1: checked, 2: cleared
                    "completedby": 5 //Player number
                }

            */
        });
        console.log(this.gameState);
        console.log("Gamestate loaded");
        for (var i = 0; i < this.gameState.users.length; i++) {
            this.gameState.users[i].active = false;
        }
    }).bind(this);
    loadGameState();
    // console.log(this.gameState);
    //TODO: What if player logs on with a different socket ID? Does it matter?

    //TODO: What to do if node script is restarted and there are "phantom" players without active games?
    //TODO: Maybe save game state in storage?

    //TODO: More robust idle detection (i.e. last connect time)
    var sendGameStateToAllClients = function(gameState) {
        GameManager.saveGameState(this.room_id, this.gameState);
        // GameManager.sendMessageToAll("Literally a test", 'hi');
        GameManager.sendMessageToAll(this.room_id, {
            "type": "gameState",
            "gameState": this.gameState
        });
    }.bind(this);
    //TODO: Maybe make players repeatedly send back "I'm active!" messages?
    //TODO: Modify GameManager to allow for custom data to be assigned (JSON format) to players in the sql database

    this.onPlayerJoin = function(player, player_id) {
        // console.log("Player joined: "+JSON.stringify(player));
        var user = player;
        var playerExistsInDb = false;
        var playerInDb = null;
        for (var i = 0; i < this.gameState.users.length; i++) {
            if (this.gameState.users[i].user_id == user.user_id) {
                playerInDb = this.gameState.users[i];
                playerExistsInDb = true;
            }
        }
        if (!playerExistsInDb) { //A new player we've never seen before
            // if (this.gameState.users >= MAX_PLAYERS) {
                //Reject and tell client they are too late
            // } else {
                //TODO: Assign the ID (0, 1, 2 ... 10) to the player when it is added to the array
            var p = player;
            p.playernum = this.gameState.users.length; //The ID of the player (0, 1, 2, 3... etc)
            p.active = true;
            this.gameState.users.push(p);

            console.log("Sending playerinfo msg");
            GameManager.sendMessageToClient(this.room_id, player.user_id, {
                "type": "playerinfo",
                "player": p
            });
            //Add the player to the players list
            GameManager.saveGameState(this.room_id, this.gameState);
            // }
        } else {
            this.gameState.users[playerInDb.playernum].active = true;
            GameManager.sendMessageToClient(this.room_id, playerInDb.user_id, {
                "type": "playerinfo",
                "player": playerInDb
            });
        }
        sendGameStateToAllClients();
        GameManager.sendMessageToAll(this.room_id, {
            "type": "gameState",
            "gameState": this.gameState
        });

        sendSuggestionsListToClient(user.user_id);
    };
    this.onPlayerLeave = function(player) {
        //TODO: Check if player is idle and update their idleness status
        //TODO: Should the game manager manage the player list--i.e. find out who is idle and notify the game JS file if there are changes?
        var playerNum = getPlayerNum(player.user_id);
        //TODO: Maybe add an activity timeout (i.e. if player hasn't sent a heartbeat before such-and-such a time)

        console.log(player.first_name+" left");

        this.gameState.users[playerNum].active = false;

        // if (this.gameState.players[1].user_id == player.user_id) {
        //     console.log("Player 1 is inactive");
        //     this.gameState.players[1].inactive = true;
        // } else if (this.gameState.players[2].user_id == player.user_id) {
        //     console.log("Player 2 is inactive");
        //     this.gameState.players[2].inactive = true;
        // }
        console.log(this.gameState);
        sendGameStateToAllClients(this.gameState);
    };
    //TODO: Maybe make drawing tools width: fit-content as wide screens make for some awkwardly large spacing
    // TODO: Set up players and stuff (joining/etc) and then get back to sending the drawing to everyone


    //TODO: Set up revealWord function on boot if there is a timestamp set?
    //TODO: Track how many guesses there are.

    // var startGame = (function() {
    //
    // }).bind(this);

    var getPlayerNum = (function(user_id) {
        for (var i = 0; i < this.gameState.users.length; i++) {
            if (this.gameState.users[i].user_id == user_id) {
                return this.gameState.users[i].playernum;
            }
        }
        return; //Number not found
    }).bind(this);

    var sendSuggestionsListToClient = (async function(user_id) {
        exports.printSuggestionDb();
        // db.all("SELECT * FROM suggestions WHERE user_id = ?", user_id, function(err, data) {
        var suggestions = await exports.getSuggestionsForUser(user_id);
        GameManager.sendMessageToClient(this.room_id, user_id, {
        // UserManager.sendMessageToClient(this.room_id, user_id, {
            "type": "suggestions",
            "suggestions": suggestions
        });
        // });
    }).bind(this);


    //TODO: Player status should be "inactive" or "active" in this.gameState.players
    this.onMessage = (async function(message, player) { //Players array contains the socket ID and it's up to date.
        // var player = await UserManager.getPlayerInfoFromSocketID(socket_id);
        // console.log("Got message "+message);
        var playerNum = getPlayerNum(player.user_id);
        if (message.type == "newitem") {
            //message.name
            this.gameState.items.push({
                id: this.gameState.nextId,
                name: message.name,
                assignee: null,
                createdby: playerNum,
                quantity: message.quantity,
                donestatus: 0,
                completedby: null
            });

            this.gameState.nextId++;

            sendGameStateToAllClients();
            //TODO: Protect against XSS here?
        } else if (message.type == "donestatus") {
            console.log("Got done status");
            //message.id, message.status
            for (var i = 0; i < this.gameState.items.length; i++) {

                if (this.gameState.items[i].id == message.id) {
                    this.gameState.items[i].donestatus = message.status;
                    if (message.status == 1) {
                        this.gameState.items[i].completedby = playerNum;
                    } else {
                        this.gameState.items[i].completedby = null;
                    }

                    break;
                }
            }
            sendGameStateToAllClients();
        } else if (message.type == "claim") {
            for (var i = 0; i < this.gameState.items.length; i++) {

                if (this.gameState.items[i].id == message.id) {
                    // this.gameState.items[i].donestatus = message.status;
                    this.gameState.items[i].assignee = message.assignto;
                    break;
                }
            }
            sendGameStateToAllClients();
        } else if (message.type == "delete") { //message.items
            for (var i = this.gameState.items.length - 1; i >= 0; i--) {
                //Loop backwards as we're removing items so stuff doesn't get skipped

                if (message.items.indexOf(this.gameState.items[i].id) > -1) {
                    // this.gameState.items[i].donestatus = message.status;
                    this.gameState.items.splice(i, 1);
                }
            }
            sendGameStateToAllClients();
        } else if (message.type == "clearchecked") {
            for (var i = this.gameState.items.length - 1; i >= 0; i--) {
                //Loop backwards as we're removing items so stuff doesn't get skipped
                var playerCanRemove = this.gameState.items[i].completedby == playerNum;

                if (this.gameState.items[i].donestatus == 1 && playerCanRemove) {
                    // this.gameState.items[i].donestatus = message.status;
                    this.gameState.items.splice(i, 1);
                }
            }
            sendGameStateToAllClients();
        } else if (message.type == "removesuggestion") {
            await exports.removeSuggestion(player.user_id, message.suggestion);
            await sendSuggestionsListToClient(player.user_id);
        } else if (message.type == "addsuggestion") {
            await exports.addSuggestion(player.user_id, message.suggestion);
            await sendSuggestionsListToClient(player.user_id);
            //TODO: Maybe have a maximum length? (i.e. 500 characters)
        }

    }).bind(this);
    //TODO: Prevent moves if the client is the only one
}

const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database("./shopshare_suggestions.db", (err) => {
    if (err) {
        console.log("Error: "+err.message);
    } else {
        console.log("Connected to the suggestions database");
    }
});

db.run(`CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    suggestion TEXT
);`);

exports.printSuggestionDb = function() {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM suggestions", function(err, data) {
            console.log(data);
            resolve();
        });
    });
}

exports.addSuggestion = function(user_id, suggestion) {
    return new Promise(function(resolve, reject) {
        db.all(`INSERT INTO suggestions (user_id, suggestion) VALUES (?,?)`, user_id, suggestion, function(err, data) {
            // console.log(data);
            // resolve();
            resolve();
        });
    });
}

exports.removeSuggestion = function(user_id, suggestion) {
    return new Promise(function(resolve, reject) {
        db.all(`DELETE FROM suggestions WHERE user_id = ? AND suggestion = ?`, user_id, suggestion, function(err, data) {
            // console.log(data);
            // resolve();
            resolve();
        });
    });
}

exports.getSuggestionsForUser = function(user_id) {
    return new Promise(function(resolve, reject) {
        db.all(`SELECT suggestion FROM suggestions WHERE user_id = ?`, user_id, function(err, data) {
            // console.log(data);
            // resolve();
            var suggestions = [];

            for (var i = 0; i < data.length; i++) {
                suggestions.push(data[i].suggestion);
            }

            resolve(suggestions);
        });
    });
}
//TODO: Change text to Shopping list (X items);

// exports.

//TODO: Only activate on canvas click
var url = process.env.HEROKU_URL+"shopshare/index.html";
if (!process.env.HEROKU_URL) {
    console.log("Using example.com url");
    url = 'https://www.example.com/shopshare/index.html';
}
console.log("URL is "+url);
GameManager.registerGame({
    'short_name': 'shopshare',
    'display_name': 'ShopShare',
    'url': url, //change this to incorporate serving files?
    'gameInstance': gameInstance,
    'reply_markup': {
        inline_keyboard: [[
        {
            "text": "Open shopping list",
            //TODO: Do we need callbackGame?
            "callback_game": "shopshare"
        }
    ]]}
});
//TODO: Keep track of number of wins?
//TODO: Add # of wins to each player obj and save it somehow
//TODO: Save gameState in SQL database?

//TODO: Incorporate sending data from a game to the game manager
//TODO: The game manager should give the game a unique room ID
//TODO: Save game instances after restart?

//TODO: Maybe turn this into a chat room test?
