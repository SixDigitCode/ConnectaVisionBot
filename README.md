# ConnectaVisionBot
True multiplayer games in Telegram!

@ConnectaVisionBot is a first-of-its-kind Telegram bot that lets you play multiplayer games LIVE with your friends! While previous gaming implementations on Telegram were independent (i.e. players play the game independently and see each others scores afterward), this is the first Telegram bot (as far as I know) that allows players to play together live.

## Getting up and running
The open-source version of Connectavision doesn't include Telegram API tokens. In order to run Connectavision yourself, you'll need to [create a bot](https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token) and get its API token. Create a file named `token.js` in the root directory and put the following inside it:

```js
exports.TELEGRAM_TOKEN = "[YOUR TELEGRAM BOT TOKEN HERE]";
```
That's it! Connectavision normally runs using long polling (unless the `NODE_ENV` environment variable is set to `production`, in which case it will use webhooks and will need to be portforwarded). `users.db` (the database containing which users correspond to which players) should be automatically created for you.

If you'd like, you can also enable the shared shopping list (shopshare) application by uncommenting `// var shopshare = require("./shopshare.js");` in app.js. I didn't include this in the published version as I deployed it to Heroku and I don't want to deal with a separate storage service to save shopping list items long-term.

## A basic structural overview
If you're interested in developing new games for Connectavision or you'd like to learn how it works, here's a basic overview:

Each game (such as connect4.js or pictionary.js) runs as its own independent JS file, which imports game_engine.js and users_manager.js. A gameInstance prototype is defined, and a new instance is created for each active game. A game is defined as one game message sent to one conversation. So, for instance, if I sent Pictionary to you three times, each time it would be recognized as a separate game (and each game would run independently, so players could end up with different scores). On instantiation, the gameInstance is provided a room ID, also known as a message ID. This ID is used to talk to the `UserManager` database, and is used to interact with all the players in the room. Register your game prototype using the following function call:
```js
GameManager.registerGame({
    'short_name': 'pictionary',
    'display_name': 'Pictionary',
    'url': url, //This is the HTML file to open when your game is clicked on
    'gameInstance': gameInstance
});
```

Your gameInstance prototype should have the following event handlers:
```js
this.onPlayerJoin(player_info, player_id); //This runs when a new player joins. You should keep track of all players in your game's gameState
this.onPlayerLeave(player_info); //Runs when a player leaves the game (i.e. closes the browser window)
this.onMessage(message, player_info); //Runs when a message is sent to the server from a player
```

Hopefully this helps! I'd recommend you look at pictionary.js (it's a little neater than connect4) to see how it talks to the game engine and clients. If you have any questions, please message me on Reddit at u/sixdigitcode. Thanks!
