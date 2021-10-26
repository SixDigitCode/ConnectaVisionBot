const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.log("Error: "+err.message);
    } else {
        console.log("Connected to the users database");
    }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    chat_id TEXT,
    message_id TEXT,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    socket_id TEXT,
    session_id TEXT,
    profile_pic TEXT,
    profile_pic_expiration TEXT
);`);

db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT,
    players TEXT,
    game_state TEXT
);`);

db.run(`CREATE TABLE IF NOT EXISTS profilepics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    profile_pic TEXT,
    timestamp TEXT
);`);

exports.printDb = function() {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM users", function(err, data) {
            console.log(data);
            resolve();
        });
    });
}
exports.printGameDb = function() {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM games", function(err, data) {
            console.log(data);
            resolve();
        });
    });
}
exports.printProfilePicDb = function() {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM profilepics", function(err, data) {
            console.log(data);
            resolve();
        });
    });
}
exports.createPlayerInformation = function(userid, chatid, messageid) {
    //User ID is query.from.id, such as 1222470114
    //Chat ID is query.chat_instance, such as 1214367568078169812
    //Message ID is query.inline_message_id, such as AQAAABMAAAABi5W5FAgVPZWlLEc
    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM users WHERE user_id = ? AND message_id = ? ;`,userid, messageid, function(err, data) {
            // console.log("================\nHEREISTHEDATA");
            // console.log(data);
            // console.log("=================");
            if (data == null || data.length == 0) {
                db.run(`INSERT INTO users (chat_id, user_id, message_id) VALUES (?,?,?)`, chatid, userid, messageid, function() {
                    resolve();
                });
            } else { //Entries already exist for this player
                db.run(`UPDATE users
                SET session_id = NULL,
                    socket_id = NULL,
                    chat_id = ?
                WHERE user_id = ?
                    AND message_id = ?;`, chatid, userid, messageid, function() {
                    resolve();
                });
            }
            // setTimeout(exports.printDb, 1000);
        });
    });
    // db.run();
    // db.run(userid, chatid, messageid); //Prevents against SQL injections

    // db.prepare("INSERT INTO foo VALUES (?)", variable);
    //You can also do db.prepare("insert or wahtever (?,?,?)")
    //and then run db.run(val1, val2, val3, etc);

    // var playerID = userid+":"+chatid+":"+messageid;
    // var playerID = uuidv4();
    // console.log("Player telegram ID is "+playerID);
    // printDb();
    //Format is like this: userid:chatid:messageid
    //Room format is chatid:messageid
    // return playerID;
    //TODO: Maybe scramble this and save it somewhere so we're not handing out the user's ID? Does it matter?
    //TODO: Save this ID somewhere so we know who is supposed to be playing and so we can keep track of the chat
}

// exports.generateNewSessionID = function(playerID) {
exports.generateNewSessionID = function(userid, messageid) {

    return new Promise(function(resolve, reject) {
        var sessionid = uuidv4();
        // console.log("Generated session ID "+sessionid);
        db.run(`UPDATE users
            SET session_id = ?
            WHERE user_id = ? AND message_id = ?`,
        sessionid, userid, messageid, function(err, data) {resolve(sessionid);});
    });
}

exports.getPlayerInfoFromSessionID =  function(sessionID) {
    //FUTURE TODO: Make this faster (i.e. a session-id-to-player-id table, but make sure only one session id exists per player id)
    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM users WHERE session_id = ?`, sessionID, function(err, rows) {
            // console.log("Here are the rows");
            // console.log(rows);
            resolve(rows[0]); //JSON object with player info from the table
        });
    });
}

//TODO: Should player IDs expire?

exports.storePlayerInformation = function(userid, messageid, firstname, lastname, username) {
    return new Promise(function(resolve, reject) {

        // console.log("Storing user id "+userid+" and message id "+messageid);
        db.run(`UPDATE users
            SET first_name = ?,
            last_name = ?,
            username = ?
            WHERE user_id = ? AND message_id = ?;`,
        firstname, lastname, username,  userid, messageid, resolve);

    });
    //TODO: Should this reset session and socket IDs?


    // var playerID = exports.getPlayerTelegramID(userid, chatid, messageid);
    // db.playerinfo[playerID] = {
    //     "user_id": userid,
    //     "chat_id": chatid,
    //     "message_id": messageid,
    //     "real_name": realname,
    //     "username": username
    // }
}

// exports.setProfilePic = function(userid, profilepic) {
//     return new Promise(function(resolve, reject) {
//         // console.log("Storing user id "+userid+" and message id "+messageid);
//         db.run(`UPDATE users
//             SET profile_pic = ?
//             WHERE user_id = ?`,
//         firstname, lastname, username,  userid, messageid, resolve);
//     });
// }

// exports.getPlayerInformation

exports.assignSocketID = function(socketID, userid, messageid) {
    //TODO: Turn db.run() into an async function
    return new Promise(function(resolve, reject) {

        db.run(`UPDATE users
            SET socket_id = ?
            WHERE  user_id = ? AND message_id = ?`,
        socketID, userid, messageid, resolve);

    });


    //TODO: Is the user_id the ID of the bot???

    // if (db.historicusers[playerID]) {
    //     //If the player ID has been used before
    //     db.activeusers[db.historicusers[playerID]] = null;
    //     //Remove the old player from the active users so only one
    //     //socket.io client can have the player ID (to prevent someone
    //     //from opening 50 browser tabs and playing as 50 different people)
    //
    //     //Deletes the old socket ID as the user has refreshed or used another device
    // }

    //FUTURE TODO: Maybe let historic users expire in the future?

    // db.activeusers[socketID] = {
    //     "display_name": realname,
    //     "chat_id": chatID,
    //     "user_id": userID
    // };
    // db.activeusers[socketID] = playerID;
    // db.historicusers[playerID] = socketID;
    //Kick out the old socket ID as only one player can play at a time
}

exports.removeSocketID = function(socketID) {
    return new Promise(function(resolve, reject) {
        db.run(`UPDATE users
            SET socket_id = NULL
            WHERE  socket_id = ?`,
        socketID, resolve);
    });
}

exports.getPlayerInfoFromSocketID = function(socketID) {
    // console.log("Getting player information from socket id "+socketID);
    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM users WHERE socket_id = ?`, socketID, function(err, rows) {
            // console.log(rows);
            resolve(rows[0]);
        });
    });
}

exports.getPlayerInfoFromUserAndRoomID = function(userid, roomid) {
    // console.log("Getting player information from user id "+userid+" and roomid "+roomid);
    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM users WHERE user_id = ? AND message_id = ?`, userid, roomid, function(err, rows) {
            // console.log(rows);
            // console.log(rows);
            resolve(rows[0]);
        });
    });
}

exports.getAllPlayersInRoom = function(messageid) {
    return new Promise(function(resolve, reject) {
        // exports.printDb();
        // console.log("Targeting message ID "+messageid);
        db.all(`SELECT * FROM users WHERE message_id = ?`, messageid, function(err, rows) {
            // console.log(rows);
            if (rows == undefined) {
                // console.log("Got nothing");
                return [];
            }
            // console.log(rows);
            rows = rows.filter(item => {
                return item.socket_id !== null;
            });
            // console.log("Rows got filtered");
            // console.log(rows);
            resolve(rows)
        });
    });
}


exports.getGameData = function(messageid) {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM games WHERE message_id = ?", messageid, function(err, data) {
            // console.log("Got data back from database!!!");
            // console.log(data);
            // console.log("VVV This is the data");
            // console.log(data);
            // console.log(data.length);
            if (data && data.length > 0) {
                // data.game_state = JSON.parse(data.game_state);
                resolve(JSON.parse(data[0].game_state));
            } else {
                resolve(null);
            }
        });
    });
}

exports.setGameData = function(messageid, gamedata) {
    // console.log("===============UPDATING GAME DATA");
    // return new Promise(function(resolve, reject) {
    //     db.run(`UPDATE games
    //         SET game_state = ?
    //         WHERE message_id = ?`,
    //     JSON.stringify(gamedata), messageid, function() {
    //         exports.printGameDb();
    //         resolve();
    //     });
    // });


    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM games WHERE message_id = ?;`, messageid, function(err, data) {
            // console.log("================\nHEREISTHEDATA");
            // console.log(data);
            // console.log("=================");
            if (data == null || data.length == 0) {
                db.run(`INSERT INTO games (message_id, game_state) VALUES (?,?)`, messageid, JSON.stringify(gamedata), function() {
                    resolve();
                });
            } else { //Entries already exist for this player
                db.run(`UPDATE games
                SET game_state = ?
                WHERE message_id = ?;`, JSON.stringify(gamedata), messageid, function() {
                    resolve();
                });
            }
            // setTimeout(exports.printDb, 1000);
        });
    });
}

const PROFILE_PIC_TIMEOUT = 5 * 24 * 60 * 60 * 1000; //5 days

exports.setProfilePic = function(userid, profilepic_path) {
    // console.log("===============UPDATING GAME DATA");
    // return new Promise(function(resolve, reject) {
    //     db.run(`UPDATE games
    //         SET game_state = ?
    //         WHERE message_id = ?`,
    //     JSON.stringify(gamedata), messageid, function() {
    //         exports.printGameDb();
    //         resolve();
    //     });
    // });


    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM profilepics WHERE user_id = ?;`, userid, function(err, data) {
            var timestamp = Date.now() + PROFILE_PIC_TIMEOUT;
            // console.log("================\nHEREISTHEDATA");
            // console.log(data);
            // console.log("=================");
            if (data == null || data.length == 0) {
                db.run(`INSERT INTO profilepics (user_id, profile_pic, timestamp) VALUES (?,?,?);`, userid, profilepic_path, timestamp, function() {
                    resolve();
                });
            } else { //Entries already exist for this player
                db.run(`UPDATE profilepics
                SET profile_pic = ?,
                    timestamp = ?
                WHERE user_id = ?;`, profilepic_path, timestamp, userid, function() {
                    resolve();
                });
            }
            // setTimeout(exports.printDb, 1000);
        });
    });
}

exports.getProfilePic = function(userid) {
    return new Promise(function(resolve, reject) {

        db.all(`SELECT * FROM profilepics WHERE user_id = ?;`, userid, function(err, data) {
            if (data.length == 0) {
                resolve(null);
            } else {
                resolve(data[0]);
            }
        });

    });
}


//TODO: Maybe add a room number next to the "Play gameName" button in Telegram?

// exports.registerToRoom = function(playerID) {
//     // db.rooms[]
// }

// TODO: Have a function that runs every 15min or so and have a last_seen timestamp next to each message--if the client stops sending stuff, remove the item from the database
// This should check if the user has joined

// setInterval(exports.printDb, 5000);
