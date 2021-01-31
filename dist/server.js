/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/backend/server-dev.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/backend/bingoSocketsProtocol.js":
/*!*********************************************!*\
  !*** ./src/backend/bingoSocketsProtocol.js ***!
  \*********************************************/
/*! exports provided: linkHttpSocketServerToApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"linkHttpSocketServerToApp\", function() { return linkHttpSocketServerToApp; });\n/* harmony import */ var _gameController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameController */ \"./src/backend/gameController.js\");\n/* harmony import */ var _common_pubSub_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/pubSub.js */ \"./src/common/pubSub.js\");\n/* harmony import */ var _common_bingoCard_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/bingoCard.js */ \"./src/common/bingoCard.js\");\n\n //import BingoCard from '../common/bingoCard'\n\n\n\nvar linkHttpSocketServerToApp = function linkHttpSocketServerToApp(app) {\n  var http = __webpack_require__(/*! http */ \"http\").createServer(app);\n\n  var io = __webpack_require__(/*! socket.io */ \"socket.io\")(http);\n\n  createBingoProtocol(io);\n  return http;\n};\n\nfunction createBingoProtocol(io) {\n  io.on('connect', function (socket) {\n    //Only one pubSub instance per socket room \n    var pubSub = new _common_pubSub_js__WEBPACK_IMPORTED_MODULE_1__[\"PubSub\"]();\n    var game; //console.log(\"NEVER REACHED\");\n    //A player wants to join a bingo game\n\n    socket.on('join', function (playerName) {\n      var bingoCard = new _common_bingoCard_js__WEBPACK_IMPORTED_MODULE_2__[\"BingoCard\"](playerName); // We create a random id in order to create a hash\n      // only known by joined user in order ti avoid fake cards\n\n      var card = {\n        id: \"card_id_\" + playerName,\n        username: playerName,\n        cardMatrix: bingoCard.getMatrix(),\n        checksum: \"checksum card\"\n      }; //Should be provided to other jooined players\n\n      var card_hidden = {\n        username: playerName,\n        card: bingoCard.getMatrix()\n      };\n      game = _gameController__WEBPACK_IMPORTED_MODULE_0__[\"gameController\"].getCurrentGame(card_hidden, pubSub); //if (!game.pubSub) game.pubSub = new PubSub();\n      //The most important thing. We register socket in a room 'id'\n      //that should be shared by all players on the same game\n\n      socket.join(game.id);\n      card.gameID = game.id; //SEND TO JOINED USER THE CARD WITH ID AND CHECKSUM\n\n      io.to(socket.id).emit('joined_game', JSON.stringify(card)); //SEND TO EVERY PLAYER IN THE GAME THAT NEW PLAYER HAS JOINED, AND ONLY THE CARDMATRIX and USERNAME\n\n      io.sockets[\"in\"](game.id).emit('joined', JSON.stringify(game)); //PUBSUB ------\n      //The only publisher of this event is gameController\n\n      pubSub.subscribe(\"starts_game\", function (data) {\n        io.sockets[\"in\"](game.id).emit('starts_game', data);\n        console.log(\"gameID=\" + game.id + \"starts_game ->\" + JSON.stringify(data));\n      }); //The only publisher of this event is gameController\n\n      pubSub.subscribe(\"new_number\", function (data) {\n        if (data != false) io.sockets[\"in\"](game.id).emit('new_number', data);\n        console.log(\"gameID=\" + game.id + \" new_number ->\" + data.id + \" \" + data.num);\n      }); //The publishers of this event is gameController and when bingo\n      //is shooted\n      // pubSub.subscribe(\"end_game\", (data) => {\n      //   io.sockets.in(data).emit('end_game',data);\n      // });\n    });\n    socket.on('disconnect', function (info) {\n      console.log(\"DISCONNECTED\");\n      console.log(info);\n    });\n    socket.on('bingo', function (playInfo) {\n      pubSub.unsubscribe('new_number');\n      console.log(\"GAME INFO \" + JSON.stringify(game)); //console.log(\"bomboTimer \"+game.bomboTimer);   \n      //clearInterval(game.bomboTimer);\n\n      console.log(\"bingo ->\" + JSON.stringify(playInfo));\n      io.sockets[\"in\"](game.id).emit('bingo_accepted', playInfo); //Stop throwing balls from bombo\n\n      var gId = _gameController__WEBPACK_IMPORTED_MODULE_0__[\"gameController\"].getGameById(game.id);\n      clearInterval(gId.get('bomboInterval'));\n      pubSub.publish(\"end_game\", game.id);\n      io.sockets[\"in\"](game.id).emit('end_game', game.id); // io.sockets.in(game.id).clients((error, socketIds) => {\n      //   if (error) throw error;\n      //   socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(game.id));\n      // });\n    });\n    socket.on('linia', function (playInfo) {\n      console.log(\"linia ->\" + JSON.stringify(playInfo));\n      pubSub.publish(\"linea_accepted\", playInfo);\n      io.sockets[\"in\"](game.id).emit('linia_accepted', playInfo);\n    });\n  });\n}\n\n\n\n//# sourceURL=webpack:///./src/backend/bingoSocketsProtocol.js?");

/***/ }),

/***/ "./src/backend/gameController.js":
/*!***************************************!*\
  !*** ./src/backend/gameController.js ***!
  \***************************************/
/*! exports provided: gameController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"gameController\", function() { return gameController; });\n/* harmony import */ var _common_bombo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/bombo.js */ \"./src/common/bombo.js\");\n/* harmony import */ var _common_bingoCard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/bingoCard.js */ \"./src/common/bingoCard.js\");\n/* harmony import */ var _common_pubSub_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/pubSub.js */ \"./src/common/pubSub.js\");\n/* harmony import */ var _settings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../settings.js */ \"./src/settings.js\");\n\n\n\n //CLOSURE\n\nvar gameController = function () {\n  var currentGame = new Map();\n  var secsUntilBegin = _settings_js__WEBPACK_IMPORTED_MODULE_3__[\"settings\"].secsUntilBegin;\n  var maxUsers = _settings_js__WEBPACK_IMPORTED_MODULE_3__[\"settings\"].maxUsers;\n  var countDown;\n  var secsLineaWait = _settings_js__WEBPACK_IMPORTED_MODULE_3__[\"settings\"].secsLineaWait;\n  var speedBalls = _settings_js__WEBPACK_IMPORTED_MODULE_3__[\"settings\"].ballspeed; //Maps id -> Map object with game informations\n\n  var gamesOnFire = new Map();\n  /* Function create a new game if not exists or join to a new is \n  *  going to launch in the near future \n  *  @param {cardHidden} - {\n          username: playerGame,\n          card: card.cardMatrix\n          }\n      \n  * @param {cardHidden} - publish/subscriber agent\n  */\n\n  var getCurrentGame = function getCurrentGame(cardHidden, pubSub) {\n    var bomboInterval; //There's no new game. So we create a new one\n\n    if (currentGame.size == 0) {\n      currentGame.set('id', Math.round(Math.random() * 10000000));\n      currentGame.set('listPlayers', [cardHidden]);\n      currentGame.set('countDown', secsUntilBegin); //We start game when time is over or we have reached\n      //max users goal\n\n      setTimeout(function () {\n        //Remove countDown timer. Its's nod needed because\n        //we are going to start the game\n        clearInterval(countDown); //pubSub.publish(\"starts_game\",JSON.stringify({id:currentGame.get('id'),players:currentGame.get('listPlayers'),countDown:currentGame.get('countDown')}));\n\n        currentGame.set('bombo', new _common_bombo_js__WEBPACK_IMPORTED_MODULE_0__[\"Bombo\"]());\n        var bombo = currentGame.get(\"bombo\");\n        var idPlay = currentGame.get('id'); //Ball rolling function\n\n        var ballRolling = function ballRolling() {\n          var realGame = gamesOnFire.get(idPlay);\n          var num = bombo.pickNumber();\n\n          if (num) {\n            pubSub.publish(\"new_number\", {\n              id: realGame.get('id'),\n              num: num\n            });\n          } else {\n            pubSub.publish(\"end_game\", realGame.get('id')); //Stop throwing balls from bombo\n\n            clearInterval(bomboInterval);\n          }\n\n          if (!realGame.get('bomboInterval')) {\n            realGame.set('bomboInterval', bomboInterval);\n            console.log(realGame.get('bomboInterval'));\n            console.log('Arre GAT');\n          }\n\n          console.log(\"bomboInterval->\" + idPlay);\n        }; //We call the ballRolling with a set interval\n\n\n        bomboInterval = setInterval(ballRolling, speedBalls * 1000);\n        pubSub.subscribe(\"linea_accepted\", function (data) {\n          console.log(data); //clear Interval\n\n          clearInterval(bomboInterval); //In 3.5 seconds we call the ballRolling function again (I have put 500ms more than in the frontend to avoid any bug)\n\n          setTimeout(function () {\n            bomboInterval = setInterval(ballRolling, speedBalls * 1000);\n          }, secsLineaWait * 1000);\n        });\n        pubSub.subscribe('end_game', function (data) {\n          clearInterval(bomboInterval);\n        }); //currentGame.set('bomboTimer',bomboInterval);\n        //realGame = new Map(currentGame);\n\n        pubSub.publish(\"starts_game\", JSON.stringify({\n          id: currentGame.get('id'),\n          players: currentGame.get('listPlayers'),\n          countDown: currentGame.get('countDown')\n        }));\n        gamesOnFire.set(currentGame.get('id'), new Map(currentGame)); //RESET currentGame\n\n        currentGame = new Map();\n      }, secsUntilBegin * 1000); //Every second we decrement countDown until we me call above\n      //setTimeout\n\n      countDown = setInterval(function () {\n        var count = currentGame.get('countDown');\n        currentGame.set('countDown', count - 1);\n      }, 1000); //There's a game has been started by other user, so we join it\n    } else {\n      var listUsers = currentGame.get('listPlayers');\n      listUsers.push(cardHidden);\n      currentGame.set('listPlayers', listUsers);\n\n      if (listUsers.length >= maxUsers) {\n        setTimeout(function () {\n          currentGame = new Map();\n          clearInterval(countDown);\n        }, 100);\n      }\n    }\n\n    return {\n      id: currentGame.get('id'),\n      players: currentGame.get('listPlayers'),\n      countDown: currentGame.get('countDown'),\n      bomboCongo: bomboInterval\n    };\n  };\n\n  var getGameById = function getGameById(gameID) {\n    return gamesOnFire.get(gameID);\n  };\n\n  return {\n    getCurrentGame: getCurrentGame,\n    getGameById: getGameById\n  };\n}();\n\n //module.exports = gameController();\n\n//# sourceURL=webpack:///./src/backend/gameController.js?");

/***/ }),

/***/ "./src/backend/server-dev.js":
/*!***********************************!*\
  !*** ./src/backend/server-dev.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\");\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../webpack.dev.config.js */ \"./webpack.dev.config.js\");\n/* harmony import */ var _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _bingoSocketsProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./bingoSocketsProtocol */ \"./src/backend/bingoSocketsProtocol.js\");\n\n\n\n\n\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()(),\n    DIST_DIR = __dirname,\n    HTML_FILE = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, 'index.html'),\n    compiler = webpack__WEBPACK_IMPORTED_MODULE_2___default()(_webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5___default.a);\nvar http = Object(_bingoSocketsProtocol__WEBPACK_IMPORTED_MODULE_6__[\"linkHttpSocketServerToApp\"])(app);\napp.use(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default()(compiler, {\n  publicPath: _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5___default.a.output.publicPath\n}));\napp.use(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default()(compiler));\napp.get('*', function (req, res, next) {\n  compiler.outputFileSystem.readFile(HTML_FILE, function (err, result) {\n    if (err) {\n      return next(err);\n    }\n\n    res.set('content-type', 'text/html');\n    res.send(result);\n    res.end();\n  });\n});\nvar PORT = process.env.PORT || 8080; //app.listen(PORT, () => {\n\nhttp.listen(PORT, function () {\n  console.log(\"App listening to \".concat(PORT, \"....\"));\n  console.log('Press Ctrl+C to quit.');\n});\n\n//# sourceURL=webpack:///./src/backend/server-dev.js?");

/***/ }),

/***/ "./src/common/bingoCard.js":
/*!*********************************!*\
  !*** ./src/common/bingoCard.js ***!
  \*********************************/
/*! exports provided: BingoCard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BingoCard\", function() { return BingoCard; });\nfunction _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Class BingoCard\n * In the BingoCard class, it is where we define the arrangement with the 9 numbers that can be in each of the three rows of the bingo card \n * to be able to determine which cell of the card will be occupied by a number or will be empty.\n * We also make a Transpose matrix to fill all cells with random numbers\n * As well as rendering the cardboard in a literal template\n */\nvar BingoCard = function BingoCard(player_) {\n  var rootElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n  var pubSub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;\n\n  _classCallCheck(this, BingoCard);\n\n  var player = player_;\n  var templateRow = [0, 1, 2, 3, 4, 5, 6, 7, 8];\n  var cardMatrix = [[].concat(templateRow), [].concat(templateRow), [].concat(templateRow)]; //Frontend have DOMelement to render. Backend not\n\n  var divRoot;\n\n  if (rootElement) {\n    divRoot = document.createElement('div');\n    divRoot.classList.add('bingoCardLayout');\n    rootElement.appendChild(divRoot);\n  } //Transpose matrix to fullfill all cells with random numbers\n\n\n  var transposedcardMatrix = transpose(cardMatrix);\n  transposedcardMatrix.forEach(function (colCard, index) {\n    transposedcardMatrix[index] = getRandomArbitrary(index * 10, index * 10 + 10, 3);\n  }); //Again transpose to get original shape          \n\n  cardMatrix = transpose(transposedcardMatrix);\n  var row1Blanks = getBlanks(templateRow); //Get four empty cells\n\n  var row2Blanks = getBlanks(templateRow); //Get four empty cells\n  //Pass two arrays eliminate numbers duplicates on both and from resulting array pick only an array of 4 elements\n\n  var duplicatesNonSelectable = row1Blanks.filter(function (i) {\n    return row2Blanks.indexOf(i) >= 0;\n  });\n  var templateRow1 = [].concat(templateRow);\n  duplicatesNonSelectable.forEach(function (elem) {\n    return templateRow1[elem] = null;\n  });\n  var row3Blanks = getBlanks(templateRow1.filter(function (elem) {\n    return elem != null;\n  }));\n  row1Blanks.forEach(function (elem) {\n    return cardMatrix[0][elem] = null;\n  }); //Put a null in every empty picked cell row1\n\n  row2Blanks.forEach(function (elem) {\n    return cardMatrix[1][elem] = null;\n  }); //Put a null in every empty picked cell row2\n\n  row3Blanks.forEach(function (elem) {\n    return cardMatrix[2][elem] = null;\n  }); //Render card \n\n  var render = function render() {\n    var extractedBalls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n    var out = \"<h1>Player \".concat(player, \"</h1>\\n                    <table class='bingoCard'>\\n                    \") + cardMatrix.map(function (value) {\n      return \"<tr>\" + value.map(function (val) {\n        if (val == null) {\n          return \"<th class='nulo'></th>\";\n        } else {\n          if (extractedBalls && extractedBalls.indexOf(val) >= 0) {\n            if (val === extractedBalls[extractedBalls.length - 1]) {\n              return \"<th class='extracted blink'>\" + val + \"</th>\";\n            } else {\n              return \"<th class='extracted'>\" + val + \"</th>\";\n            }\n          } else {\n            return \"<th>\" + val + \"</th>\";\n          }\n        }\n      }).join(\"\") + \"</tr>\";\n    }).join(\"\") + \"</table>\";\n    divRoot.innerHTML = out; //Every time we render the bingo card we should checkBingoOrLine\n\n    checkBingo(cardMatrix, extractedBalls, pubSub, player);\n  };\n\n  if (pubSub) pubSub.subscribe(\"New Number\", render);\n\n  this.getMatrix = function () {\n    return cardMatrix;\n  };\n};\n/**\n * Function checkBingo \n * which we use to know when the line has gone out and bingo \n * to post it with the post pattern so that we can only sing line and bingo once per game.\n * @param {*} cardMatrix \n * @param {*} extractedBalls \n * @param {*} pubSub \n * @param {*} player \n */\n\nfunction checkBingo(cardMatrix, extractedBalls, pubSub, player) {\n  var bingo = true;\n  cardMatrix.forEach(function (row) {\n    var linia = row.filter(function (val) {\n      if (extractedBalls.indexOf(val) <= 0) return val;\n    }).length;\n    if (linia > 0) bingo = false;else pubSub.publish(\"LINIA\", player);\n  });\n\n  if (bingo) {\n    pubSub.publish(\"BINGO\", player); //debug(\"BINGO \"+player)\n  }\n}\n/**\n * Returns count random numbers between min (inclusive) and max (exclusive)\n*/\n\n\nfunction getRandomArbitrary(min, max, count) {\n  if (min == 0) min = 1; //Exception first column from 1 to 9\n\n  if (max == 90) max = 91; //Exception last column from 80 to 90\n\n  var arr3 = [];\n\n  do {\n    var randN = Math.floor(Math.random() * (max - min) + min);\n    if (!arr3.includes(randN)) arr3.push(randN);\n  } while (arr3.length != count);\n\n  return arr3.sort();\n}\n/**\n * Pass an array and we ramdomly pick only an array of 4 elements supposed to be blanks\n */\n\n\nfunction getBlanks(_ref) {\n  var _ref2 = _toArray(_ref),\n      ai = _ref2.slice(0);\n\n  var iterator = Array.apply(null, Array(ai.length - 4));\n  iterator.forEach(function (el) {\n    ai.splice(Math.floor(Math.random() * ai.length), 1);\n  });\n  return ai;\n}\n/**\n * //Transpose a matrix\n * @param {*} matrix \n */\n\n\nfunction transpose(matrix) {\n  return matrix[0].map(function (_, colIndex) {\n    return matrix.map(function (row) {\n      return row[colIndex];\n    });\n  });\n}\n\n//# sourceURL=webpack:///./src/common/bingoCard.js?");

/***/ }),

/***/ "./src/common/bombo.js":
/*!*****************************!*\
  !*** ./src/common/bombo.js ***!
  \*****************************/
/*! exports provided: Bombo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Bombo\", function() { return Bombo; });\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * In the Bombo class is where we have all the balls of the bingo in const templateBombo, there storatge the 90 balls in an array\n * en boles.\n * \n * We store a copy of the templatebombo array so as not to have to modify the original, \n * so in all the actions that we use the balls of the bombo we do it with the copy of the array.\n * \n * And also  we extract the balls randomly using the pickNumber method\n * \n * Let render is used to paint the balls of the bombo\n */\nvar Bombo = //If rootElement (DOM) is not undefined means bombo is used in frontend \nfunction Bombo() {\n  var rootElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;\n\n  _classCallCheck(this, Bombo);\n\n  var templateBombo = Array.from({\n    length: 90\n  }, function (_, i) {\n    return i + 1;\n  });\n\n  var boles = _toConsumableArray(templateBombo);\n\n  var bolesExtracted = [];\n  var lastBall;\n\n  var shuffle = function shuffle() {\n    return boles.sort(function (a, b) {\n      return Math.random() - 0.5;\n    });\n  };\n\n  this.getExtractedNumbers = function () {\n    return bolesExtracted;\n  };\n\n  this.getRemainingBoles = function () {\n    return boles;\n  };\n\n  this.pickNumber = function () {\n    shuffle();\n    boles[0] && bolesExtracted.push(boles[0]);\n\n    if (rootElement && boles[0]) {\n      //si existe una ultima bola le quitamos la animacion\n      if (lastBall) {\n        document.getElementById(lastBall).className = 'bingoBall';\n      } //a la bola actual le ponemos la animacion\n\n\n      document.getElementById(boles[0]).className = 'bingoBall blink';\n      lastBall = boles[0];\n    }\n\n    return boles.length > 0 && boles.splice(0, 1) ? bolesExtracted[bolesExtracted.length - 1] : false;\n  }; //el render solo lo realiza una vez (añadiendo id a cada bola)\n\n\n  var render = function render() {\n    if (rootElement) rootElement.innerHTML += \"\".concat(boles.map(function (ball) {\n      return \"<div class='bingoBallEmpty' id='\".concat(ball, \"'>\").concat(ball, \"</div>\");\n    }).join(\"\"));\n  };\n\n  if (rootElement) render(); //Only rendered if rootElement is not undefined\n};\n\n//# sourceURL=webpack:///./src/common/bombo.js?");

/***/ }),

/***/ "./src/common/pubSub.js":
/*!******************************!*\
  !*** ./src/common/pubSub.js ***!
  \******************************/
/*! exports provided: PubSub */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PubSub\", function() { return PubSub; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\n * Publish/Subscribe Pattern\n */\nvar PubSub = /*#__PURE__*/function () {\n  function PubSub() {\n    _classCallCheck(this, PubSub);\n\n    this.handlers = [];\n  }\n\n  _createClass(PubSub, [{\n    key: \"subscribe\",\n    value: function subscribe(event, handler, context) {\n      if (typeof context === 'undefined') {\n        context = handler;\n      }\n\n      this.handlers.push({\n        event: event,\n        handler: handler.bind(context)\n      });\n    }\n  }, {\n    key: \"publish\",\n    value: function publish(event, args) {\n      this.handlers.forEach(function (topic) {\n        if (topic.event === event) {\n          topic.handler(args);\n        }\n      });\n    }\n  }, {\n    key: \"unsubscribe\",\n    value: function unsubscribe(event) {\n      var filtered = this.handlers.filter(function (el) {\n        return el.event != event;\n      });\n      this.handlers = filtered;\n    }\n  }]);\n\n  return PubSub;\n}();\n\n//# sourceURL=webpack:///./src/common/pubSub.js?");

/***/ }),

/***/ "./src/settings.js":
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
/*! exports provided: settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"settings\", function() { return settings; });\nvar settings = {\n  ballspeed: 1,\n  //Online and offline applied \n  secsUntilBegin: 15,\n  //Online applied\n  maxUsers: 10,\n  //Online applied\n  secsLineaWait: 5 //Online applied\n\n};\n\n\n//# sourceURL=webpack:///./src/settings.js?");

/***/ }),

/***/ "./webpack.dev.config.js":
/*!*******************************!*\
  !*** ./webpack.dev.config.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var path = __webpack_require__(/*! path */ \"path\");\n\nvar webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nvar HtmlWebPackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nmodule.exports = {\n  entry: {\n    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/frontend/main.js']\n  },\n  output: {\n    path: path.join(__dirname, 'dist'),\n    publicPath: '/',\n    filename: '[name].js'\n  },\n  externals: {\n    socketio: 'socket.io-client'\n  },\n  mode: 'development',\n  target: 'web',\n  devtool: '#source-map',\n  module: {\n    rules: [{\n      enforce: \"pre\",\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"eslint-loader\",\n      options: {\n        emitWarning: true,\n        failOnError: false,\n        failOnWarning: false\n      }\n    }, {\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"babel-loader\"\n    }, {\n      // Loads the javacript into html template provided.\n      // Entry point is set below in HtmlWebPackPlugin in Plugins \n      test: /\\.html$/,\n      use: [{\n        loader: \"html-loader\" //options: { minimize: true }\n\n      }]\n    }, {\n      test: /\\.css$/,\n      use: ['style-loader', 'css-loader']\n    }, {\n      test: /\\.(png|svg|jpg|gif)$/,\n      use: ['file-loader']\n    }, {\n      test: /\\.mp4$/,\n      use: ['file-loader?name=videos/[name].[ext]']\n    }, {\n      test: /\\.mp3$/,\n      use: ['file-loader?name=audio/[name].[ext]']\n    }]\n  },\n  plugins: [new HtmlWebPackPlugin({\n    template: \"./src/frontend/index.html\",\n    filename: \"./index.html\",\n    excludeChunks: ['server']\n  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]\n};\n\n//# sourceURL=webpack:///./webpack.dev.config.js?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"html-webpack-plugin\");\n\n//# sourceURL=webpack:///external_%22html-webpack-plugin%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-hot-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-hot-middleware%22?");

/***/ })

/******/ });