var GameManager = require("./game_engine.js");
var UserManager = require("./users_manager.js");
//TODO: Maybe use GameInstance as an object? (i.e. new GameInstance or something)

var gameInstance = function(room_id) { //Message ID is the "room" ID--one per game
    console.log("FIRING UP GAME INSTANCE with room ID "+room_id);
    //TODO: Maybe keep track of the users in the room automatically?
    this.players = [];
    this.room_id = room_id;
    console.log("this.room_id = "+this.room_id);

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
            board: [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ],
            players: {
                1: null,
                2: null
            },
            currentTurn: 1,
            winner: null
        });
        console.log(this.gameState);
        console.log("Gamestate loaded");
    }).bind(this);
    loadGameState();
    // console.log(this.gameState);
    //TODO: What if player logs on with a different socket ID? Does it matter?

    //TODO: What to do if node script is restarted and there are "phantom" players without active games?
    //TODO: Maybe save game state in storage?
    var sendGameStateToAllClients = function(gameState) {
        // GameManager.sendMessageToAll("Literally a test", 'hi');
        GameManager.sendMessageToAll(this.room_id, {
            "type": "gameState",
            "gameState": gameState
        });
    }.bind(this);
    //TODO: Maybe make players repeatedly send back "I'm active!" messages?
    var allocatePlayer = function(player) {
        console.log("Allocating player");
        if (this.gameState.players[1] == null || this.gameState.players[1].user_id == player.user_id) {
            // console.log("Player 1 joined");
            //The User ID check is used to prevent the same player from reloading the page and showing up as player 2
            if (this.gameState.players[1] == null) {
                this.gameState.players[1] = player;
                this.gameState.players[1].wins = 0; //Resets the wins if the player is new
            } else {
                // this.gameState.players[1] = player;
            }

            this.gameState.players[1].inactive = false;
        } else if (this.gameState.players[2] == null || this.gameState.players[2].user_id == player.user_id) {
            // console.log("Player 2 joined");
            if (this.gameState.players[2] == null) {
                this.gameState.players[2] = player;
                this.gameState.players[2].wins = 0;
            } else {
                // this.gameState.players[2] = player;
            }
            this.gameState.players[2].inactive = false;
        } else {
            //TODO: Send error message to client that there isn't space
        }
        // (this.room_id, this.gameState);
        // console.log(this.gameState.players);
        GameManager.saveGameState(this.room_id, this.gameState);
    }.bind(this);

    var getPlayerColor = function(player) { //TODO: Check player IDs here instead of the whole thing
        //Player could log on with different socket ID
        if (this.gameState.players[1].user_id == player.user_id) {
            return 1;
        } else if (this.gameState.players[2].user_id == player.user_id) {
            return 2;
        } else {
            return 0;
        }
    }.bind(this);

    var checkForWin = function(board) {
        /*
        board: [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ],

        */
        var checkForHorizWin = function(board, x, y) {
            if (x >= board[y].length - 3) {
                return false;
            }
            //board[y][x]
            var firstPiece = board[y][x];
            if (board[y][x] == firstPiece &&
                board[y][x + 1] == firstPiece &&
                board[y][x + 2] == firstPiece &&
                board[y][x + 3] == firstPiece) {
                return firstPiece;
            } else {
                return false;
            }
        }

        var checkForVertWin = function(board, x, y) {
            // console.log("x: "+x+" y: "+y);
            //board[y][x]
            // console.log(y+" > "+(board.length - 3));
            if (y >= board.length - 3) {
                return false;
            }

            var firstPiece = board[y][x];
            if (board[y][x] == firstPiece &&
                board[y + 1][x] == firstPiece &&
                board[y + 2][x] == firstPiece &&
                board[y + 3][x] == firstPiece) {
                return firstPiece;
            } else {
                return false;
            }
        }

        var checkForDiagWin = function(board, x, y) {
            if (x >= board[y].length - 3 || y >= board.length - 3) {
                return false;
            }
            //board[y][x]
            var firstPiece = board[y][x];
            if (board[y][x] == firstPiece &&
                board[y + 1][x + 1] == firstPiece &&
                board[y + 2][x + 2] == firstPiece &&
                board[y + 3][x + 3] == firstPiece) {
                return firstPiece;
            } else {
                return false;
            }
        }

        var checkForUpDiagWin = function(board, x, y) {
            if (x >= (board[y].length - 3) || y <= 2) {
                return false;
            }
            //board[y][x]
            var firstPiece = board[y][x];
            if (board[y][x] == firstPiece &&
                board[y - 1][x + 1] == firstPiece &&
                board[y - 2][x + 2] == firstPiece &&
                board[y - 3][x + 3] == firstPiece) {
                return firstPiece;
            } else {
                return false;
            }
        }

        var winner = null;
        for (var y = 0; y < board.length; y++) { //Subtract three because we only care about the top left corner
            for (var x = 0; x < board[y].length; x++) {
                var winTest = checkForHorizWin(board, x, y) || checkForVertWin(board, x, y) || checkForDiagWin(board, x, y) || checkForUpDiagWin(board, x, y);
                if (winTest) {
                    console.log("Ding ding ding! We got a winner! "+winTest);
                    winner = winTest;
                    return winner;
                }
            }
        }
        return winner;


    }

    var resetRound = (function() {
        console.log(this.gameState);
        this.gameState.board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];
        this.gameState.winner = null;
        sendGameStateToAllClients(this.gameState);
        GameManager.saveGameState(this.room_id, this.gameState);
    }).bind(this);
    //TODO: Modify GameManager to allow for custom data to be assigned (JSON format) to players in the sql database

    //TODO: Create a sendToSocketID function
    //TODO: Create a sendMessageToAll function
    //TODO: Track player 1 vs 2, player colors
    //TODO: Figure out how to tell client who is who (i.e. color/name/wins/etc)
    this.onPlayerJoin = function(player, player_id) {
        //i.e. send a message to all the players that someone joined. Up to the developer of the game.
        console.log("onPlayerJoin ran!! "+player.first_name);
        allocatePlayer(player);
        // if (this.gameState.players[2].user_id == player.user_id) {
        //     this.gameState.players[2].inactive = true;
        // }
        sendGameStateToAllClients(this.gameState);
    };
    this.onPlayerLeave = function(player) {
        // console.log("onPlayerLeave ran!! "+player.first_name)
        if (this.gameState.players[1].user_id == player.user_id) {
            console.log("Player 1 is inactive");
            this.gameState.players[1].inactive = true;
        } else if (this.gameState.players[2].user_id == player.user_id) {
            console.log("Player 2 is inactive");
            this.gameState.players[2].inactive = true;
        }
        console.log(this.gameState);
        sendGameStateToAllClients(this.gameState);
        //TODO: Un-allocate player from the game and send message to client that they left
    };
    //TODO: Player status should be "inactive" or "active" in this.gameState.players
    this.onMessage = async function(message, player) { //Players array contains the socket ID and it's up to date.
        // var player = await UserManager.getPlayerInfoFromSocketID(socket_id);
        // console.log("Got message "+message);

        //FUTURE: Notify if second player disconnects?
        if (message.type == "move") {
            console.log("Got a move");
            console.log("Is it player's turn? "+(getPlayerColor(player) == this.gameState.currentTurn));
            console.log("Player color is "+getPlayerColor(player));
            console.log("Current turn is "+this.gameState.currentTurn);
            console.log("Is there no winner? "+(this.gameState.winner == null));
            console.log("Is player 1 not null? "+(this.gameState.players[1] !== null));

            // console.log("Moving at "+message.x+", "+message.y);
            // console.log("player color is ")
            if (getPlayerColor(player) == this.gameState.currentTurn
                && this.gameState.winner == null
                && this.gameState.players[1] !== null) {
                    console.log("Player is correct");
                this.gameState.board[message.y][message.x] = getPlayerColor(player);
                var winner = checkForWin(this.gameState.board);
                if (winner) {
                    GameManager.sendMessageToAll(this.room_id, {type: "winner", winner: winner});
                    // this.gameState.winner = winner;
                    this.gameState.players[winner].wins += 1;
                    this.gameState.winner = winner;

                    GameManager.setHighScore(this.gameState.players[winner].user_id, this.room_id, this.gameState.players[winner].wins);
                    //TODO: Set high scores here
                    //TODO: Give players a button to play again instead of waiting 8s
                    setTimeout(resetRound, 8000);
                }
                if (this.gameState.currentTurn == 1) {
                    this.gameState.currentTurn = 2;
                } else {
                    this.gameState.currentTurn = 1;
                }
            }

            //TODO: Store player IDs along with player object in gameState?
            // GameManager.sendMessageToAll(this.room_id, {
            //     "type": "gameState",
            //     "gameState": gameState
            // });

            //TODO: Figure out how to send the animation
            sendGameStateToAllClients(this.gameState);
            //TODO: Reject messages from clients that aren't in the list
            GameManager.saveGameState(this.room_id, this.gameState);
        }
    }.bind(this);
    //TODO: Prevent moves if the client is the only one
}
//TODO: Only activate on canvas click
// console.log("URL is "+process.env.HEROKU_UR+"");
var url = process.env.HEROKU_URL+"connect4/index.html";
if (!process.env.HEROKU_URL) {
    console.log("Using example.com url");
    url = 'https://www.example.com/connect4/index.html';
}
console.log("URL is "+url);
GameManager.registerGame({
    'short_name': 'connect4',
    'display_name': 'Connect Four',
    'url': url, //change this to incorporate serving files?
    'gameInstance': gameInstance
});
//TODO: Keep track of number of wins?
//TODO: Add # of wins to each player obj and save it somehow
//TODO: Save gameState in SQL database?

//TODO: Incorporate sending data from a game to the game manager
//TODO: The game manager should give the game a unique room ID
//TODO: Save game instances after restart?

//TODO: Maybe turn this into a chat room test?
