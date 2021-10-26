var GameManager = require("./game_engine.js");
var UserManager = require("./users_manager.js");
//TODO: Maybe use GameInstance as an object? (i.e. new GameInstance or something)

var generateWordChoices = function() {
    var superHardWords = ["Atlantis","overture","refund","big bang theory","fowl","time zone","drift","retire","demanding","mooch","decipher","steamboat","ma'am","in-law","disgust","con","comparison","leap year","try","convenience store","slam dunk","buccaneer","P.O. box","first mate","haberdashery","president","psychologist","water vapor","name","doubloon","fad","navigate","plot","welder","crow's nest","mortified","cause","digestion","effect","doubtful","flight","scalawag","companion","gymnast","stockholder","inertia","rhythm","pen pal","sapphire","pomp","promise","voicemail","remain","parley","acoustics","cartography","emigrate","tinting","czar","inquisition","pastry","password","siesta","scatter","turret","guru","soulmate","implode","positive","today","neutron","descendant","intern","infect","blueprint","history","blunt","stun","realm","galaxy","channel","apparatus","tournament","wealth","credit","tribe","cloudburst","crew","regret","cartoonist","food court","theory","gravel","slump","zero","castaway","good-bye","gondola","aristocrat","license","destruction","enemy","irrational","knowledge","opinion","panic","quarantine","Chick-fil-A","memory","whiplash","snag","wormhole","temper","periwinkle","voice","form","one-way street","armada","profit","reimbursement","chord","soul","cranium","ironic","default","reaction","pawnshop","offstage","archaeologist","mine car","employee","rainwater","insurance","treatment","courthouse","junk drawer","random","risk","philosopher","cramp","smidgen","eureka","admire","dugout","flotsam","freshwater","tug","pelt","telepathy","transpose","education","translate","texture","error","gallop","statement","sidekick","dud","practice","brainstorm","doppelganger","lichen","silt","improve","population","hang ten","society","committee","bushel","community","carat","zone defense","dictate","deceive","feeder road","group","interference","jig","mayhem","crisp","fake flowers","confidant","interject","fun house","dispatch","emperor","incisor","destination","landfill","sophomore","exhibition","problem","debt","preteen","exponential","century","steel drum","blacksmith","ornithologist","forklift","grain","trademark","paranoid","punishment","vanquish","property","fathom","ligament","rhyme","friction","tattle","tutor","schedule","stowaway","expired","sleet","zip code","creator","hypothermia","representative","wish","observatory","opaque","income tax","clue","infection","dryer sheet","wasabi","confide","cutlass","coast","wetlands","kilogram","swag","reward","condition","figment","VIP","organization","county fair","gentleman","twang","semester","hearse","duvet","loiterer","riddle","copyright","rest stop","upgrade","sickle","bed and breakfast","Everglades","cubit","protestant","addendum","writhe","shame","member","stout","cashier","champion","chaos","stuff","mortal","joke","compromise","standing ovation","consent","danger","index","depth","ice fishing","diversify","inning","aftermath","lyrics","acre","discovery","nutmeg","hay wagon","hobby","doubt","feeling","pride","climate","stagecoach","fragment","rival","income","occupant","fun","quiver","detail","vision","prepare","brunette","flutter","villain","parody","Zen","ray","handful","cover","language","title","altitude","resourceful","trawler","publisher","stranger","system","layover","fuel","guess"];

    var hardWords = ["end zone","pawn","fiddle","servant","drive-through","bobsled","glue gun","dashboard","wig","hermit crab","swamp","flock","newsletter","team","cheat","coworker","miner","blizzard","human","irrigation","stage fright","bookstore","crime","husband","fur","foam","learn","cape","university","reveal","firefighter","nightmare","wax","pail","ringleader","sweater vest","downpour","pet store","reservoir","ratchet","sash","lecture","lance","cough","edit","country","fog","telephone booth","wedding cake","truck stop","shower curtain","commercial","speakers","knight","trail","vacation","snore","degree","earache","bride","fast food","water buffalo","grandpa","kneel","cliff","bonnet","runt","elf","koala","garden hose","hot tub","devious","zoo","peace","icicle","hurdle","sunrise","plantation","baby-sitter","lunar rover","parent","art gallery","swing dancing","snag","zipper","shrew","stationery","bruise","carat","ruby","customer","sponge","thaw","hydrogen","bargain","caviar","rudder","download","cousin","eraser","tablespoon","cream","orbit","religion","gumball","drugstore","first class","propose","drawback","idea","dryer sheets","snarl","cubicle","plastic","hand soap","clog","landscape","vanilla","goalkeeper","bleach","manatee","hairspray","cockpit","gold","dream","script","oar","clown","zoom","puppet","biscuit","musician","sunburn","leak","ski goggles","science","tow truck","foil","migrate","double","pile","staple","sheep dog","fireman pole","last","crate","costume","competition","jeans","engaged","post office","back flip","mime","scuba diving","jazz","mascot","thief","chestnut","omnivore","connection","pharmacist","elope","trombone","houseboat","braid","mold","chisel","fade","win","midnight","sap","lace","tackle","sticky note","produce","page","pharaoh","van","swarm","florist","monsoon","actor","runoff","wind","sled","economics","dust bunny","lie","honk","rib","beluga whale","eighteen-wheeler","arcade","geologist","pickup truck","poison","stutter","pest","printer ink","time","ditch","freshman","story","company","half","dead end","pro","spaceship","hospital","quadrant","goblin","wrap","beanstalk","bulldog","molar","cabin","neighborhood","baseboards","ivy","dawn","quartz","density","quit","cliff diving","picnic","groom","cleaning spray","letter opener","punk","twist","flu","sweater","dance","world","distance","sugar","passenger","ream","shrink ray","point","pain","cattle","chameleon","toll road","centimeter","print","grocery store","toothpaste","glitter","jigsaw","professor","soak","coach","stadium","heater","saddle","vet","jungle","trip","hang glider","electrical outlet","baguette","factory","injury","Jedi","spare","photosynthesis","logo","swoop","toddler","calm","dress shirt","carpet","sneeze","sandpaper","tow","record","movie","airport security","barbershop","police","coil","steam","imagine","vehicle","lap","compare","cartoon","plow","president","chicken coop","pilot","thrift store","bookend","water cycle","prize","cherub","ornament","junk","testify","landlord","government","s'mores","dizzy","school","cheerleader","date","synchronized swimming","taxi","coastline","CD","son-in-law","season","mirror","cowboy","vegetarian","seat","taxidermist","diver","yolk","log-in","applause","check","haircut","driveway","acrobat","boxing","hour","earthquake","limit","darts","hipster","wooly mammoth","cell phone charger","chime","clique","right","juggle","peasant","darkness","drought","great-grandfather","myth","macho","mine","somersault","pocket","prime meridian","yacht","cloak","owner","scream","lung","shack","tugboat","tiptoe","publisher","fresh water","expert","nap","deliver","ski lift","homework","dentist","gas station","rut","best friend","car dealership","sushi","signal","loveseat","atlas","balance beam","fabric","albatross","drill bit","ashamed","ticket","blueprint","sun block","wag","turtleneck","gasoline","delivery","mysterious","deep","safe","tearful","sandbox","vitamin","raft","tide","taxes","crow's nest","password","stopwatch","leather","crust","scuff mark","gallon","RV","cellar","lipstick","diagonal","stage","guarantee","fiance","jaw","crane","chairman","moth","ping pong","cello","bedbug","roommate","snooze","cruise ship","comfy","rim","barber","toy store","athlete","carnival","level","living room","rhythm","cable car","mast","volleyball","amusement park","mayor","laser","toolbox","apathetic","yak","Quidditch","headache","drip","lullaby","wobble","frost","clamp","shelter","wool","judge","sword swallower","cot","crop duster","cushion","vein","important","stuffed animal","softball","accounting","yardstick","song","quicksand","bald","obey","recess","mat","stow","time machine","stay","hovercraft","grasslands","germ","boulevard","chariot","partner","border","avocado","brand","handle","putty","shampoo","plumber","organ","prey","yodel","concession stand","receipt","oxcart","hail","correct","dew","skating rink","plank","chemical","thunder","robe","tip","student","sleep","videogame","yawn","violent","golf cart","welder","tin","palace","rind","baggage","parking garage","interception","traffic jam","rubber","postcard","torch","humidity","nanny","glue stick","fortress","dripping","think","macaroni","retail","weather","cardboard","cargo","chef","roller coaster","Heinz 57","hut","rodeo","full","aircraft carrier","hoop","geyser","lumberyard","pigpen","extension cord","drain","chariot racing","disc jockey","cuckoo clock","gold medal","cure","wheelie","dodgeball","fizz","Internet","recycle","tank","carpenter","salmon","gown","conveyor belt","parade","cruise","classroom","stew","aunt","whisk","chess","dent","flavor","trapped","invent","tag","attack","captain","black belt","front","catalog","advertisement","startup","suit","blush","pizza sauce","fireside","dorsal","wallow","chain mail","laundry detergent","boa constrictor","lunch tray","optometrist","surround","yard","tourist","ounce","character","birthday","banister","ceiling fan","ginger","exercise","edge","washing machine","vanish"];

    var mediumWords = ["rocket","waist","cliff","artist","locket","knot","stingray","school bus","loaf","horse","solar system","aircraft","whisk","package","spool","vest","penguin","tricycle","sail","sheep","race car","bicycle","school","sack","map","sushi","submarine","family","see","face","sneeze","hot-air balloon","coat","rib","nut","chocolate chip cookie","mouth","paper","iron","scarf","pogo stick","toaster","cage","mop","constellation","dustpan","drumstick","waffle","sidewalk","dock","teapot","barrel","penny","dolphin","yarn","seahorse","plug","germ","ask","shallow","noon","poodle","treasure","potato","baseball","button","net","lifejacket","cave","saxophone","laundry basket","pelican","crumb","floor","pinwheel","children","hair dryer","cobweb","bib","panda","rainbow","knight","blue jeans","t-shirt","printer","cricket","Jupiter","king","jelly","unite","eel","cocoon","quadruplets","bushes","wreath","roof","swimming pool","rose","cook","braid","city","popsicle","wing","jacket","pilot","key","homeless","catfish","windmill","spell","cardboard","radish","grape","hippopotamus","full moon","blueprint","drums","dragon","dog leash","park","wall","stove","frog","belt","apologize","magnet","muscle","maid","hip","stocking","safety goggles","ink","stapler","newlywed","well","nature","bald eagle","kiss","propeller","maze","wave","glue","curtains","match","money","sunset","kettle","unicorn","bell","curtain","needle","marker","step","ticket","organ","third plate","extension cord","aunt","yacht","meat","magic carpet","glove","skirt","tongue","subway","nun","seashell","jump","ribbon","hill","wrist","marshmallow","pizza","pop","box","pineapple","snail","chip","screwdriver","attic","pet","tape","iPad","hiss","deer","paper clips","pot","teeth","tire","table","helium","waterfall","buggy","pond","swing","skunk","strap","thermometer","go","tail","peach","hotel","sister","fox","headband","slide","hail","bagel","safe","fairies","calendar","crayon","torch","cub","squirrel","east","cobra","letter","coconut","fang","monkey","clam","chimney","contain","napkin","fire hydrant","jail","birthday","hero","jewelry","barn","newborn","cake","harp","garage","doghouse","doormat","mail","curve","baby","astronaut","turkey","farmer","butcher","trap","throat","fist","lobster","cheetah","lighthouse","sidekick","rowboat","cucumber","crust","toilet paper","sunglasses","banana split","oven","gasoline","computer","heel","scar","stick","chalk","howl","paint","spill","yo-yo","cactus","rolly polly","eye patch","pipe","crack","queen","present","yardstick","pear","stump","bucket","angel","positive","round","camera","piranha","insect","porcupine","notepad","spider web","librarian","dominoes","grill","river","shade","rat","tower","tulip","rain","teacher","faucet","farm","banana peel","salt","empty","hummingbird","tusk","mold","cover","nest","watering can","bomb","hunter","cracker","forest","lung","alarm clock","eclipse","pea","prince","enter","sleeping bag","movie theater","lock","refrigerator","ambulance","sign","ship","reindeer","harmonica","wooly mammoth","soda","wheelchair","owl","zebra","baker","chest","batteries","eagle","bubble","growl","palace","scarecrow","tractor","back","deep","rainstorm","gold","flashlight","fungus","coyote","orange","saltwater","seed","rope","hoof","bag","towel","boot","apple pie","tongs","doorknob","fern","elbow","necktie","gingerbread man","feast","anvil","oar","backbone","brick","banjo","hammer","melt","tennis","bug spray","password","gift","princess","swim","pie","blowfish","kitchen","platypus","base","save","sandal","pitchfork","goblin","shape","doctor","vegetable","pinecone","pencil","middle","elevator","bakery","gum","dimple","fork","puddle","breakfast","pretzel","store","porthole","corndog","fan","rug","knee","shark","sink","playground","airport","trophy","roller blading","toy","plant","run","lawnmower","trampoline","timer","compass","tiger","lightsaber","cabin","picture frame","toast","drill","cheeseburger","goose","pine tree","chameleon","jet ski","sunburn","slope","throne","escalator","gumball","donkey","stroller","mattress","bell pepper","spot","quarter","soup","sky","drink","spine","detective","sea turtle","jungle","volcano","paw","pen","happy","brush","violin","beach","skateboard","half","hug","railroad","twig","cash","lipstick","onion","mouse","lucky","hair","muffin","crib","mug","ski","ring","nail","snow","mushroom","neighbor","tub","church","glass","ironing board","wick","hen","plate","wreck","weight","globe","narwhal","black widow","wrench","soccer","pancake","rattle","list","electricity","room","clownfish","door","highway","cannon","tie","french fries","fur","north","summer","peck","open","cell phone","carousel","goldfish","hole","chess","plank","desk","hopscotch","stamp","leak","lemon","goat","bowtie","pail","cougar","wagon","wallet","sock","hurricane","merry-go-round","root","limousine","light switch","stork","aquarium","hockey","liquid","elephant","stain","worm","orphan","hot dog","piano","parka","corn","chart","pantry","saddle","stomach","pajamas","rhinoceros","field","milk","dress","corner","chain","tooth","pollution","coin","seal","cemetery","wax","carpet","draw","sit","pool","pendulum","state","truck","candle","tightrope","trunk","straw","sailboat","toe","pirate","pillowcase","salt and pepper","shelf","ping pong","pickle","blanket","lip","crown","cast","outside","cockroach","rocking chair","lamp","target","powder","scale","DVD","blimp","tent","rake","flamingo","birthday cake","oil","flagpole","college","celery","skate","video camera","silverware","sponge","garbage truck","frame","anemone","colored pencil","outer space","daddy longlegs","mud","porch","firefighter","minivan","hospital","zoo","tip","marry","claw","snowball","frying pan","black hole","hurdle","wood","thumb","cheek","mask","sword","bus","cheerleader","snowflake","vase","honey","cul-de-sac","zookeeper","monster","washing machine","beehive","restaurant","spear","hairbrush","kite","strawberry","string","gravity","girlfriend","trash can","hook","broccoli","electrical outlet","circus","sunflower","sprinkler","tadpole","soap","bat","America","island","ladder","tank","rock","horn","forehead","toothbrush","envelope","gate","shake","lid","inch","crow","shower","shipwreck","hula hoop","coil","cork","juice","magazine","latitude","closed","eraser","storm","dig","dragonfly","tuba","Ferris wheel","flute","gap","bagpipe","fanny pack","earmuffs","television","ferry","helicopter","scissors","rice","read","tissue","graph","notebook","ladybug","suitcase","equator","dump truck","mirror","lake","stem","pocket","castle","molecule","babysitter","food","desert","start","fin","front porch","photograph","flood","music","starfish","shopping cart","pulley","address","fruit","window","bathroom scale","dinner","crater","sleeve","bike","golf","spring","squirt gun","meteor","beaver","party","saw","curb","corn dog","spare","telephone","taxi","stoplight","kayak","fax","chef","cowboy","shoulder","garden","spaceship","shovel","class","watch","fishing pole","newspaper","baggage","surfboard","cello","pumpkin","time","smile","garbage","seesaw","trip","dad","song","paperclip","log","spoon","unicycle","magic","top hat","day","seaweed","nurse","razor","TV","trapeze","wedge","giant","whistle","cotton candy","guitar","shampoo","dirt","grandma","campfire","sand","puppet","page","motorcycle","bacteria","mouse pad","drawer","battery","windshield","ice","popcorn","easel","lawn mower","collar","trumpet","mini blinds","parachute","robin","pan","coal","janitor","free","umbrella","brain","three-toed sloth","mailbox","library","purse","canoe","shadow","wheelbarrow","thief","light bulb","neck","bottle","scientist","mitten","dollar","mailman","zipper","coast","lap","smoke","ceiling fan","connect","art","quicksand","chin","sleep","manatee","road","hourglass","jar","basket","bathtub","ocean","parachuting","museum","snowboarding","peanut","puzzle","quilt","clown","cape","lunchbox"];

    var easyWords = ["pig","lips","caterpillar","ants","rainbow","jellyfish","cupcake","seashell","grass","island","coat","bee","doll","eye","lion","car","bus","swimming pool","boy","knee","bathroom","hand","ball","jacket","flag","ocean","pillow","snowflake","football","grapes","bumblebee","music","monster","book","house","lemon","cookie","dragon","dream","eyes","wheel","balloon","triangle","sunglasses","zebra","feet","ant","bed","rocket","river","candle","float","smile","crack","alligator","bunny","plant","snake","bird","airplane","duck","kitten","Earth","starfish","ear","monkey","lollipop","sun","branch","blanket","orange","carrot","star","cube","octopus","dinosaur","hippo","candy","jail","cow","drum","bench","hamburger","hat","light","mouse","inchworm","snail","cat","shirt","nose","alive","person","jar","tail","motorcycle","whale","zigzag","fish","suitcase","backpack","man","feather","line","mitten","stairs","woman","robot","cheese","turtle","king","chimney","bracelet","comb","egg","worm","zoo","pizza","fly","pen","coin","apple","baseball","oval","skateboard","frog","spoon","camera","cloud","horse","beach","slide","ladybug","Mickey Mouse","window","rabbit","helicopter","desk","head","leg","crayon","bat","clock","socks","pants","boat","butterfly","diamond","bug","ears","box","face","night","square","milk","pie","bear","finger","basketball","banana","mouth","nail","cherry","arm","bounce","family","bike","broom","fire","sea","beak","baby","bowl","popsicle","lamp","blocks","bark","girl","bell","tree","elephant","spider","bunk bed","rock","purse","leaf","ship","spider web","shoe","kite","mountains","moon","table","rain","sheep","curl","daisy","snowman","train","legs","swing","mountain","cup","pencil","truck","dog","sea turtle","circle","flower","glasses","crab","owl","roly poly\\\/pill bug\\\/doodle bug","ring","love","lizard","door","heart","button","giraffe","chicken","hair","chair","bridge","key","hook","neck","ghost","computer","bow","bread","corn","ice cream cone","water","angel","fork","bone"];

    return {
        1: easyWords[Math.floor(Math.random() * easyWords.length)],
        2: mediumWords[Math.floor(Math.random() * mediumWords.length)],
        3: hardWords[Math.floor(Math.random() * hardWords.length)],
        4: superHardWords[Math.floor(Math.random() * superHardWords.length)],
    }
}

var MAX_PLAYERS = 10;
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

            /*
            [{"type":"lineWidth","lineWidth":2},{"type":"strokeStyle","strokeStyle":"black"},{"type":"beginPath"},{"type":"move","x":0.5671641791044776,"y":0.3522388059701492},{"type":"move","x":0.5492537313432836,"y":0.3701492537313433},{"type":"move","x":0.5194029850746269,"y":0.3880597014925373},{"type":"move","x":0.4925373134328358,"y":0.41492537313432837},{"type":"move","x":0.46865671641791046,"y":0.44477611940298506},{"type":"move","x":0.44477611940298506,"y":0.4716417910447761},{"type":"move","x":0.417910447761194,"y":0.5014925373134328},{"type":"move","x":0.382089552238806,"y":0.5343283582089552},{"type":"move","x":0.3522388059701492,"y":0.5611940298507463},{"type":"move","x":0.32238805970149254,"y":0.5880597014925373},{"type":"move","x":0.2955223880597015,"y":0.608955223880597},{"type":"move","x":0.2716417910447761,"y":0.6298507462686567},{"type":"move","x":0.24776119402985075,"y":0.6447761194029851},{"type":"move","x":0.2298507462686567,"y":0.6567164179104478},{"type":"closePath"}]
            */
            players: [], //0: player 0, 1: player 1, etc. Limit of 10? Does player 0 decide when to start the game?
            /* Player object:
                {
                    first_name, last_name, user_id, etc like a regular player obj
                    moves: [{"type": "lineWidth", "lineWidth": 2}], //List of moves
                    points: 99999 //Total points (guessing and drawing)
                }

            */
            drawer: 0, //Player that is currently drawing
            gameRunning: false,
            gameStarted: false,
            gameFinished: false,
            word: "", //TODO: How to keep this secret from players?
            hint: " ",
            endTime: 0, //UNIX timestamp of the end time
            wordValue: 0,
            numGuessedCorrectly: 0,
            guesses: []
        });
        if (this.gameState.endTime !== 0) {
            //Round has already begun, so set up the round end time
            setupRoundEndTimeout();
        }
        console.log(this.gameState);
        console.log("Gamestate loaded");

        for (var i = 0; i < this.gameState.players.length; i++) {
            this.gameState.players[i].active = false; //All players are inactive if the server restarted!
        }

        GameManager.saveGameState(this.room_id, this.gameState);

        updatePlayButtonText();
        // endRound();
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

    var updatePlayButtonText = (function() {
        var activePlayers = 0;
        for (var i = 0; i < this.gameState.players.length; i++) {
            if (this.gameState.players[i].active) {
                activePlayers++;
            }
        }
        GameManager.setPlayButtonText(this.room_id, "pictionary", "Play Pictionary ("+activePlayers+"/"+MAX_PLAYERS+" online)")
    }).bind(this);

    //TODO: Modify GameManager to allow for custom data to be assigned (JSON format) to players in the sql database

    this.onPlayerJoin = function(player, player_id) {
        // console.log("Player joined: "+JSON.stringify(player));
        var playerExistsInDb = false;
        var playerInDb = null;
        for (var i = 0; i < this.gameState.players.length; i++) {
            if (this.gameState.players[i].user_id == player.user_id) {
                playerInDb = this.gameState.players[i];
                playerExistsInDb = true;
            }
        }
        if (!playerExistsInDb) { //A new player we've never seen before
            if (this.gameState.players >= MAX_PLAYERS) {
                //Reject and tell client they are too late
            } else {
                //TODO: Assign the ID (0, 1, 2 ... 10) to the player when it is added to the array
                var p = player;
                p.playernum = this.gameState.players.length; //The ID of the player (0, 1, 2, 3... etc)
                p.active = true;
                p.correct = false;
                p.points = 0;
                this.gameState.players.push(p);

                console.log("Sending playerinfo msg");
                GameManager.sendMessageToClient(this.room_id, player.user_id, {
                    "type": "playerinfo",
                    "player": p
                });
                //Add the player to the players list
                GameManager.saveGameState(this.room_id, this.gameState);
            }
        } else {
            this.gameState.players[playerInDb.playernum].active = true;
            GameManager.sendMessageToClient(this.room_id, playerInDb.user_id, {
                "type": "playerinfo",
                "player": playerInDb
            });

            if (this.gameState.drawer == playerInDb.playernum && this.gameState.word == "") {
                sendWordChoiceToDrawer();
            }
        }

        GameManager.sendMessageToAll(this.room_id, {
            "type": "gameState",
            "gameState": this.gameState
        });

        GameManager.sendMessageToClient(this.room_id, player.user_id, {
            "type": "newmoves",
            "moves": this.allMoves
        }); //Sends all the moves (so far) to the client that just joined
        updatePlayButtonText();
    };
    this.onPlayerLeave = function(player) {
        //TODO: Check if player is idle and update their idleness status
        //TODO: Should the game manager manage the player list--i.e. find out who is idle and notify the game JS file if there are changes?
        var playerNum = getPlayerNum(player.user_id);
        //TODO: Maybe add an activity timeout (i.e. if player hasn't sent a heartbeat before such-and-such a time)

        console.log(player.first_name+" left");

        this.gameState.players[playerNum].active = false;

        // if (this.gameState.players[1].user_id == player.user_id) {
        //     console.log("Player 1 is inactive");
        //     this.gameState.players[1].inactive = true;
        // } else if (this.gameState.players[2].user_id == player.user_id) {
        //     console.log("Player 2 is inactive");
        //     this.gameState.players[2].inactive = true;
        // }
        console.log(this.gameState);
        sendGameStateToAllClients(this.gameState);
        updatePlayButtonText();
    };
    //TODO: Maybe make drawing tools width: fit-content as wide screens make for some awkwardly large spacing
    // TODO: Set up players and stuff (joining/etc) and then get back to sending the drawing to everyone

    this.allMoves = []; //TODO: CLear when canvas is cleared to save on bandwidth

    var sendWordChoiceToDrawer = (function() {
        var choices = generateWordChoices();
        this.gameState.wordChoices = choices;
        // console.log(this.gameState.)
        if (this.gameState.drawer == this.gameState.length) {
            // console.log(this.gameState);
            console.log("Game should be over but isn't"); //End the game somewhere else
            return;
        }
        console.log(this.gameState);
        GameManager.sendMessageToClient(this.room_id, this.gameState.players[this.gameState.drawer].user_id, {
            "type": "chooseword",
            "words": choices
        });
        //Message is like {1: easy, 2: medium, 3: hard, 4: superhard}
    }).bind(this);

    var generateHint = (function() {
        //NEXT STEPS TODO: Ignore spaces
        var blanks = "";
        for (var i = 0; i < this.gameState.word.length; i++) {
            if (this.gameState.word[i] == " ") {
                blanks += " ";
            } else {
                blanks += "_";
            }
            //TODO: Add letters to the hint as time goes on
        }
        this.gameState.hint = blanks.split("").join(" ");
    }).bind(this);

    var beginRound = (function(is_first_start) {

        if (!is_first_start) {
            //Don't increment the drawer if it is the first round
            console.log("==========Increasing drawer");
            this.gameState.drawer++;
        }

        // if (this.gameState.drawer )

        this.gameState.gameRunning = true;
        this.gameState.hint = " ";

        for (var i = this.gameState.drawer; i < this.gameState.players.length; i++) {
            //This code skips any inactive drawers so the game doesn't get hung up.
            if (this.gameState.players[i].active) {
                break;
            } else {
                this.gameState.drawer = i;
                //TODO: Maybe send a "so-and-so is inactive, skipping..." message?
            }
        }

        if (this.gameState.drawer >= this.gameState.players.length) {
            this.gameState.drawer = this.gameState.players.length - 1;
            console.log("Round should have ended");
            //TODO: Send "Game over" message
            return;
        }

        //TODO: Check if all the players have drawn here and if so end the game

        sendWordChoiceToDrawer();
        sendGameStateToAllClients();
    }).bind(this);

    var resetRound = (function() {
        this.gameState.word = "";
        this.gameState.hint = " ";
        this.gameState.gameRunning = false;
        this.gameState.guesses = [];
        this.gameState.wordValue = 0;
        this.gameState.numGuessedCorrectly = 0;

        this.allMoves = [];

        console.log("Resetting round");
        GameManager.sendMessageToAll(this.room_id, {
            "type": "clearcanvas"
        });

        //NEXT STEPS TODO: Get high scores working
        for (var i = 0; i < this.gameState.players.length; i++) {
            this.gameState.players[i].correct = false;
        }
    }).bind(this);

    //TODO: Set up revealWord function on boot if there is a timestamp set?
    //TODO: Track how many guesses there are.

    var endRound = (async function() {
        // return;

        console.log("Round ended");
        clearTimeout(roundEndTimeout);

        var timeoutPromise = function(ms) {
            return new Promise(function(resolve, reject) {
                setTimeout(resolve, ms);
            });
        }

        //TODO: Find out when the last player has gone and don't do any of this
        var isLast = false;
        if (this.gameState.drawer >= (this.gameState.players.length - 1)) {
            //End of game
            isLast = true;
            this.gameState.gameFinished = true;

            for (var i = 0; i < this.gameState.players.length; i++) {
                console.log("Setting high score");
                console.log(this.gameState.players[i].user_id);
                GameManager.setHighScore(this.gameState.players[i].user_id, this.room_id, this.gameState.players[i].points);
                await timeoutPromise(100);
            }
        }

        sendGameStateToAllClients();

        GameManager.sendMessageToAll(this.room_id, {
            "type": "revealword",
            "word": this.gameState.word,
            "gameover": isLast
        });
        if (!isLast) {
            setTimeout((() => {
                console.log("hiding scores");
                //TODO: Fix image is too large on "the word was" screen if text spans multiple lines
                GameManager.sendMessageToAll(this.room_id, {"type": "hidescores"});
                resetRound();

                // if ((this.gameState.drawer + 1) >= this.gameState.)
                beginRound(false);
                // sendGameStateToAllClients();

            }).bind(this), 10 * 1000);
        }
        //TODO: Send message to all players as to how many points people got

    }).bind(this);

    var setupRoundEndTimeout = function() {
        clearTimeout(roundEndTimeout);
        var timeLeft = this.gameState.endTime - Date.now();
        if (timeLeft <= 0) {
            endRound();
        } else {
            roundEndTimeout = setTimeout(endRound, timeLeft);
        }
    }.bind(this);

    // var startGame = (function() {
    //
    // }).bind(this);

    var getPlayerNum = (function(user_id) {
        for (var i = 0; i < this.gameState.players.length; i++) {
            if (this.gameState.players[i].user_id == user_id) {
                return this.gameState.players[i].playernum;
            }
        }
        return; //Number not found
    }).bind(this);


    var roundEndTimeout;

    //TODO: Player status should be "inactive" or "active" in this.gameState.players
    this.onMessage = (async function(message, player) { //Players array contains the socket ID and it's up to date.
        // var player = await UserManager.getPlayerInfoFromSocketID(socket_id);
        // console.log("Got message "+message);
        if (message.type == "newmoves") {
            // console.log("Got moves");
            //TODO: Maybe make sure only the drawer can add moves
            this.allMoves = this.allMoves.concat(message.moves);
            // console.log("Sending moves");
            // console.log(message.moves);
            GameManager.sendMessageToAll(this.room_id, {
                "type": "newmoves",
                "moves": message.moves
            });
            //TODO: Add support for profile photos using getUserProfilePhotos() in the bot API
        } else if (message.type == "gamestart") {

            // if (this.gameState.gameRunning) {
            //     return; //If the game is running we can't restart it
            // }
            this.gameState.drawer = 0;
            this.gameState.gameRunning = true;
            this.gameState.gameStarted = true;
            // sendWordChoiceToDrawer();
            // sendGameStateToAllClients();

            beginRound(true);
        } else if (message.type == "chooseword") {
            // endRound(); //TODO: Maybe have a separate function to end the round and show scores for that round before resetting for the next one
            console.log("Got word choice");
            //this.gameState.wordChoices[message.num]
            this.gameState.word = this.gameState.wordChoices[message.num];
            this.gameState.endTime = Date.now() + 60 * 1000; //Round ends 60 seconds from now
            this.gameState.wordValue = message.num * 10; //10, 20, 30, 40 pts for each category

            // roundEndTimeout = setTimeout(endRound, 10 * 1000);
            setupRoundEndTimeout();
            generateHint();
            sendGameStateToAllClients();
        } else if (message.type == "guess") {
            console.log("Guess: "+message.word);
            var playernum = getPlayerNum(player.user_id);

            if (this.gameState.players[playernum].correct) {
                return; //Guessed players can't tell everyone else the word!
            }
            //TODO: Function on game end that sets high scores
            if (message.word.trim().toLowerCase() == this.gameState.word.toLowerCase() && this.gameState.word !== "") {
                this.gameState.guesses.push({type: "correct", player: playernum});
                this.gameState.players[playernum].correct = true;


                var placeScores = [50,40,30,20]; //Points for 1st, 2nd, 3rd, etc correct guess
                var scoreIndex = 0;
                if (this.gameState.numGuessedCorrectly >= placeScores.length) {
                    scoreIndex = placeScores.length - 1;
                } else {
                    scoreIndex = this.gameState.numGuessedCorrectly;
                }

                this.gameState.players[playernum].points += placeScores[scoreIndex];
                this.gameState.players[this.gameState.drawer].points += this.gameState.wordValue; //Gives points to the drawer

                this.gameState.numGuessedCorrectly++;

                GameManager.sendMessageToClient(this.room_id, this.gameState.players[playernum].user_id, {
                    "type": "correctguess",
                    "word": this.gameState.word,
                    "points": placeScores[scoreIndex],
                    "place": this.gameState.numGuessedCorrectly
                });

                //TODO: Allocate points
                //TODO: Tell the player they guessed the word!
                //TODO: Check to see if there are any players left who haven't guessed it.
                //      if there is nobody left, end the round right now.
                if (this.gameState.numGuessedCorrectly >= (this.gameState.players.length - 1)) { //Minus one player because one is the drawer
                    endRound();
                }
            } else {
                this.gameState.guesses.push({type: "incorrect", player: playernum, word: message.word});
            }
            sendGameStateToAllClients();
            //TODO: Protect against XSS here?
        }

    }).bind(this);
    //TODO: Prevent moves if the client is the only one
}
//TODO: Only activate on canvas click
var url = process.env.HEROKU_URL+"pictionary/index.html";
if (!process.env.HEROKU_URL) {
    console.log("Using example.com url");
    url = 'https://www.example.com/pictionary/index.html';
}
console.log("URL is "+url);
GameManager.registerGame({
    'short_name': 'pictionary',
    'display_name': 'Pictionary',
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
