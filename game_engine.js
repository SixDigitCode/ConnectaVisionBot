const express = require("express");
const bodyParser = require('body-parser');

const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const UserManager = require("./users_manager.js");
const token = require("")

const TOKEN = process.env.TELEGRAM_TOKEN || token.TELEGRAM_TOKEN;
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

// const express = require('express');

const gameName = "tictactoe";

const queries = {};
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
    bot = new TelegramBot(TOKEN);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new TelegramBot(TOKEN, {polling: true}); //TODO: Do we need polling here?
}

bot.onText(/start|help|game/, (msg) => {
    bot.sendMessage(msg.from.id, "Connectavision lets you play multiplayer games (such as Pictionary or Tic-Tac-Toe) with your friends! To get started, open a conversation and enter @Connectavisionbot into the text field to search for a game!");
});

var registeredGames = {};

var gameInstances = {};

exports.registerGame = function(game) { //TODO: Instead use a function (i.e. new Game(short_name) or whatever)
    /*
    Game should be:
    {
        'short_name': 'tictactoe',
        'display_name': 'Tic-Tac-Toe',
        'url': 'https://www.example.com/index.html', //change this to incorporate serving files?


    }

    */
    return new Promise(function(resolve, reject) {
        registeredGames[game.short_name] = game;
    });
    //TODO: Set up dummy events until the real ones are set by the game JS file?
}

//TODO: Keep track of game short name along with database entries

bot.on("callback_query", async function(query) {
    // console.log("printing query");
    // console.log(query);

    // var playerID = UserManager.getPlayerTelegramID(query.from.id, query.message.chat.id, query.message.message_id);
    await UserManager.createPlayerInformation(query.from.id, query.chat_instance, query.inline_message_id); //TODO: Maybe wait for this to complete?
    await UserManager.storePlayerInformation(query.from.id, query.inline_message_id, query.from.first_name, query.from.last_name, query.from.username);



    //Combine the From ID and chat instance to create the player ID--one player per room

    // console.log("hey");

    var sessionID = await UserManager.generateNewSessionID(query.from.id, query.inline_message_id);

    // await UserManager.printDb();
    // console.log("Got here 1");
    //use query.inline_message_id for the ID of the game message (this differs per game--perfect for room management)
    //chat_instance is an identifier for the chat


    // TODO: IMMEDIATE: MIGRATE THE CHATID AND MESSAGEID TO USE query.chat_instance AND query.inline_message_id (maybe, check if inline_message_id works)
    /*
    {
      id: '5630141887254694508',
      from: {
        id: 1310869559,
        is_bot: false,
        first_name: 'James',
        last_name: 'McNonexistent',
        username: 'mildlyconfusing',
        language_code: 'en'
      },
      inline_message_id: 'AQAAABEAAAABi5W576eBiB3HZgc',
      chat_instance: '1214367568078169812',
      game_short_name: 'tictactoe'
    }
    */


    //TODO: Set this up so people can't spoof it (i.e. save it somewhere)

    // console.log(query);
    // console.log("HEYYY");
    if (!registeredGames[query.game_short_name]) {
        console.log(query.game_short_name+" isn't available");
        bot.answerCallbackQuery(query.id, "Sorry, "+query.game_short_name+" is not available.");
    } else {
        // queries[query.id] = query;
        var gameHandler = registeredGames[query.game_short_name];
        // let gameurl = "https://www.example.com/index.html?session="+sessionID;
        let gameurl = gameHandler.url+"?session="+sessionID;

        //Ensures there is a handler set up for this message ID. If not, it creates one
        if (!gameInstances[query.inline_message_id]) {
            createGameInstance(gameHandler, query, query.inline_message_id);
        }

        // console.log(gameurl);
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});

function createGameInstance(gameHandler, query, inline_message_id) {
    console.log("Creating game instance for "+query.game_short_name+" with message ID "+query.inline_message_id);
    gameInstances[query.inline_message_id] = new gameHandler.gameInstance(query.inline_message_id);
}

var accessPromise = function(path) {
    return new Promise(function(resolve, reject) {
        fs.mkdir(path, resolve);
    });
}
var mkdirPromise = function(path) {
    return new Promise(function(resolve, reject) {
        fs.access(path, resolve);
    });
}

exports.fetchProfilePic = async function(userid) { //1222470114
    //TODO: Track profile pic timeout time and use the cached version if possible
    //TODO: Add instructions to tell user how to get their profile pic to work.
    //      Add bot response to a command (i.e. /profilepicsetup) that teaches users
    //      how to allow the profile pic (for iOS/Windows/Mac/Android/etc--it should
    //      ask which system you have). To see a profile pic, the user must add
    //      the bot in their privacy settings AND have a chat going with the bot.
    //      Maybe add an option for the user to specify which profile photo?

    //TODO: Maybe don't allow clients to request photos if they haven't played the game in a while?

    //TODO: Add a "delete all my data" command
    //NEXT STEPS TODO: Get this profile pic cached stat!!
    //GAME IDEA: Drawphone?
    var cachedProfilePic = await UserManager.getProfilePic(userid);
    // console.log(cachedProfilePic);
    var photoPath;
    // console.log("Does it not exist: "+(!cachedProfilePic));
    // console.log("Has it timed out: "+(Number(cachedProfilePic.timestamp) > Date.now()));

    if (!cachedProfilePic || Number(cachedProfilePic.timestamp) < Date.now()) {
        // console.log("Downloading profile pic from Telegram");
        var profilePhotos = await bot.getUserProfilePhotos(userid);

        if (profilePhotos.photos.length == 0) {
            photoPath = "profilepics/unknown.png"; //No profile photos or the profile photos are private
        } else { //If we have access to at least one profile pic
            var dirpath = "profilepics/"+userid;

            var dirError = await accessPromise(dirpath);
            if (dirError) {
                await mkdirPromise(dirpath);
            }
            photoPath = await bot.downloadFile(profilePhotos.photos[0][0].file_id, dirpath);
            // photoPath = file;
        }
        // console.log("Saving profilepic");
        await UserManager.setProfilePic(userid, photoPath);
        // console.log("Saved");
        // await UserManager.printProfilePicDb();
    } else {
        // console.log("Using cached profilepic: "+cachedProfilePic.profile_pic);
        photoPath = cachedProfilePic.profile_pic;
    }


    // console.log(profilePhotos);




    // var filepath = await bot.downloadFile(profilePhotos.photos[0][0].file_id, dirpath);
    // return filepath;
    return photoPath;
    //Use profilePhotos.photos[0][0].file_id as this is the smallest one
}
//FUTURE: Implement a keep-alive function to check if the connection is still live

//TODO: What about games like tic-tac-toe where there is a limit of 2 players? Should another room get created?
//  Include buttons below the game like "Room 1 (4/5 players)", "Room 2 (1/5 players)", etc?

bot.on("inline_query", function(iq) {
    console.log("Got inline query");
    var availableGames = [];
    var i = 0;
    for (property in registeredGames) {
        console.log(registeredGames[property].reply_markup);
        availableGames.push({type: "game", id: i.toString(), game_short_name: registeredGames[property].short_name, reply_markup: registeredGames[property].reply_markup});
        i++;
    }
    bot.answerInlineQuery(iq.id, availableGames);
});

bot.on("polling_error", console.log);

// app.get("/highscore/:score", function(req, res, next) {
//     if (!Object.hasOwnProperty.call(queries, req.query.id)) {
//         return next();
//     }
//
//     let query = queries[req.query.id];
//     let options;
//     if (query.message) {
//         options = {
//             chat_id: query.message.chat.id,
//             message_id: query.message.message_id
//         };
//     } else {
//         options = {
//             inline_message_id: query.inline_message_id
//         }
//     }
//     bot.setGameScore(query.from.id, parseInt(req.params.score), options, function(err, result) {});
// });

app.get('/', (req, res) => {
    res.send('<h1>Hi there</h1>');
});

app.get('/profilepic', async (req, res) => {
    //TODO: How to ensure profile pics are private--only readable by users in the same room
    //There's probably a fancy SQL query for that. Maybe include session ID in with request?

    //TODO: Maybe have a profile pic timeout? Right now the profile pic will redownload as a new
    //      user is created for every message. Add a profile_pic_timeout field where if the
    //      UNIX timestamp is greater than the profile pic expiry time, re-download it?
    // console.log(req.query.sessionid, req.query.userid);
    if (isNaN(Number(req.query.userid)) || req.query.sessionid == "") {
        // res.send("Invalid query. Must include valid user ID and session ID")
        res.sendFile(__dirname+"/profilepics/unknown.png");
        return; //Makes sure the user ID is a number (for security reasons and if the query is empty)
    }

    //All this is meant to protect profile photos. If a user shares their profile
    //photo, it can only be seen by others in the game room, and every request
    //to get a profile picture must have an attached session ID proving who
    //the person is and whose photos they should have access to. Under normal
    //operation, these people should already be in the room so it's no big deal
    var player = await UserManager.getPlayerInfoFromSessionID(req.query.sessionid);
    // console.log(player);
    if (player == undefined || player == null) {
        // res.send("It doesn't look like your session ID is active anymore");
        res.sendFile(__dirname+"/profilepics/unknown.png");
        return;
    }
    // console.log("Message id is "+player.message_id);
    var playersInRoom = await UserManager.getAllPlayersInRoom(player.message_id);

    var requestedIdIsInRoom = false;
    // console.log(playersInRoom);
    for (var i = 0; i < playersInRoom.length; i++) {
        // console.log("Checking "+playersInRoom[i].user_id);
        requestedIdIsInRoom = requestedIdIsInRoom || (playersInRoom[i].user_id == req.query.userid);
    }

    if (requestedIdIsInRoom) {
        // console.log("Player authenticated and whatnot, sending profile photo");
        var path = await exports.fetchProfilePic(req.query.userid);
        res.sendFile(__dirname+"/"+path);
    } else {
        // res.send("Access denied");
        res.sendFile(__dirname+"/profilepics/unknown.png");
    }


    // await exports.fetchProfilePic()
});

app.post('/' + bot.token, (req, res) => {
    console.log("Got post request to /"+bot.token);
    console.log(req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
})

//TODO: Is there a way to tell which JS file
// async function sendMessageToAllInRoom(message_id, message_type, message_content) {
//     var othersInRoom = await UserManager.getAllPlayersInRoom(player.message_id);
//     console.log(othersInRoom);
//     for (var i = 0; i < othersInRoom.length; i++) {
//         io.to(othersInRoom[i].socket_id).emit("receive_message", message);
//     }
// }
//TODO: Poker?
//TODO: Or maybe Uno?
io.on('connection', (socket) => {
    var player = null;
    // console.log(socket);
    socket.on('disconnect', async () => {
        //TODO: Try/catch this? Sometimes players are never registered and when it's null JS gets angry
        // console.log("User disconnected. Removing socket ID");
        var player = await UserManager.getPlayerInfoFromSocketID(socket.id);
        if (player == undefined || gameInstances[player.message_id] == undefined) {
            socket.emit("register_status", {"succeeded":false, "err_code": "Error: Looks like this game was disconnected (you may have signed in on another device). Try re-launching the game from Telegram"});
            return; //This happens if the player opens a new tab and the socket ID is replaced
        }
        var players = await UserManager.getAllPlayersInRoom(player.message_id);
        //TODO: Why does the above line fail on disconnect?

        // if (gameInstances[player.message_id] == undefined) {
        //     createGameInstance(player.message_id);
        // }
        //TODO: Store game short name alongside player name and look it up to create the game instance here ^^^?

        gameInstances[player.message_id].players = players;
        gameInstances[player.message_id].onPlayerLeave(player, socket);

        await UserManager.removeSocketID(socket.id);
        // setTimeout(UserManager.printDb, 500);
    });
    socket.on('register', async (sessionID) => {
        player = await UserManager.getPlayerInfoFromSessionID(sessionID);
        // console.log("User registered with session ID "+sessionID+" and player ID "+playerID);
        //TODO: Add code to check if player ID is real
        //TODO: Maybe auto-generate player ID on button click so it can be reset?
        // console.log(player);
        if (player) { //Check if player ID is legit here
            UserManager.assignSocketID(socket.id, player.user_id, player.message_id);
            //TODO: Set some sort of counter to make sure the user is logged on?
            // socket.emit("register_status", {"succeeded": true, "err_code": 0, "user_id": player.user_id,"first_name":player.first_name, "last_name": player.last_name, "room": player.message_id, "socket_id": player.socket_id});
            socket.emit("register_status", {"succeeded": true, "err_code": 0, "player": player});
            //TODO: Maybe send over the player object instead of all these IDs?
            //TODO: Do this whenever the client sends a message

            // var player = await UserManager.getPlayerInfoFromSocketID(socket.id);
            var players = await UserManager.getAllPlayersInRoom(player.message_id);

            // console.log(gameInstances);
            // console.log(player);
            if (gameInstances[player.message_id] == undefined) {
                //If the server has been restarted and the game has closed
                socket.emit("register_status", {"succeeded":false, "err_code": "Error: Looks like this game was disconnected. Try re-launching the game from Telegram"});
                return;
            }
            gameInstances[player.message_id].players = players;
            gameInstances[player.message_id].onPlayerJoin(player, socket.id);

            //TODO: Update list of players for everyone in the game
            // await sendMessageToAllInRoom(player.message_id, 'players', players);
            //TODO: Have a game.js file (ex. tictactoe.js) and have it talk to game_engine.js?
            //Here is where the game should keep track of player roles--i.e. who is "X", who is "O", etc
        } else {
            socket.emit("register_status", {"succeeded":false, "err_code": "Error: Your session expired (you may have logged in on another device). Try re-launching the game from Telegram"});
        }
    });
    // socket.on('chat_message', async function(message) { //TODO: Do bugtesting to see what happens if player is null when these other things are called
    //     // var player = await UserManager.getPlayerInfoFromSocketID(socket.id);
    //     // console.log("THIS IS THE PLAYERR");
    //     // console.log(player);
    //     await sendMessageToAllInRoom(player.message_id, 'receive_message', message);
    // });
    socket.on('message', async function(message) {
        // console.log("PLAYER IS ");
        // console.log(player);
        if (player == null || gameInstances[player.message_id] == undefined) {
            socket.emit("register_status", {"succeeded":false, "err_code": "Error: Your session expired (you may have logged in on another device). Try re-launching the game from Telegram"});
        } else {
            gameInstances[player.message_id].onMessage(message, player);
        }
    });
});

exports.sendMessageToAll = async function(message_id, message) {
    var othersInRoom = await UserManager.getAllPlayersInRoom(message_id);
    for (var i = 0; i < othersInRoom.length; i++) {
       io.to(othersInRoom[i].socket_id).emit("message", message);
    }
}

exports.sendMessageToClient = async function(room_id, user_id, message) {
    //TODO: Maybe use the player ID instead?
    var player = await UserManager.getPlayerInfoFromUserAndRoomID(user_id, room_id);
    // console.log("Socket ID is "+socketID);
    io.to(player.socket_id).emit("message", message);
}

exports.useGameState = async function(message_id, default_value) {
    // console.log("Getting game state");
    var state = await UserManager.getGameData(message_id) || default_value;
    // console.log("This is the game state");
    // console.log(state);
    return state;
    // return new Proxy(state, { //A proxy is used to auto-update data in realtime as it's changed
    //     set: function(target, key, value) {
    //         console.log("Got change to game data!");
    //         state[key] = value;
    //         console.log(state);
    //         UserManager.setGameData(state);
    //         console.log("Saving game data to DB");
    //         return true;
    //     },
    //     get: function(target, key, receiver) {
    //         return "hey, it works";
    //     }
    // })
}

exports.saveGameState = function(message_id, value) {
    UserManager.setGameData(message_id, value);
}

exports.setHighScore = function(user_id, message_id, score) {
    console.log("Setting high score for user "+user_id+" message "+message_id+" with score "+score);
    try {
        bot.setGameScore(user_id, score, {
            force: true, //Allow lower numbers to be set
            inline_message_id: message_id,
            // id: message_id
        });
    } catch (err) { //Sometimes anonymous admins in groups cause issues when trying to set the score
        console.log(err);
    }
}
//message id is 'AQAAAJsAAADiad1Ifh1UBhIuekE'
exports.setPlayButtonText = function(message_id, game_shortname, new_text) {
    //TODO: Is it {inline_keyboard:[[]]} ???
    bot.editMessageReplyMarkup({
        inline_keyboard: [[
        {
            "text": new_text,
            //TODO: Do we need callbackGame?
            "callback_game": "pictionary"
        }
    ]]}, {
        inline_message_id: message_id
    });
}

//TODO: Set high score function

// TODO: Function to get other players but only show info like name and session ID?
// TODO: Change the "Play [game name]" button to something lke "Play [game name] (Sally, Fred, and George are playing right now)"
// TODO: Add support for multiple games
// TODO: Send deactivation message to existing clients when the session ID is updated

//Next steps:
//Set up an event wrapper system with JSON
//Send events when someone joins/leaves a room
//Handle requests for all the players (i.e. names, session IDs, user IDs, etc)


//Implement the following
//Send a message to the server from client
//Send a message from server to ALL clients in a specific room
//Send a message from server to ONE client using their player/socket ID
//Set up receiving of message from server

console.log("Will listen on "+(process.env.PORT || 4000));
server.listen(process.env.PORT || 4000, () => {
    console.log("Listening on port "+(process.env.PORT || 4000));
});
//TODO: Remove message_id and replace with room_id?
