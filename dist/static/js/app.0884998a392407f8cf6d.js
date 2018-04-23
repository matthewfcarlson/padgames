webpackJsonp([1],{0:function(e,t){},"22Ry":function(e,t){},"4yV6":function(e,t){},"CHo/":function(e,t,s){"use strict";var a=s("LtXW"),n=s("vSBm"),i=n.GetDeck,r=n.ScoreCards;n.Card;e.exports={Game:class{constructor(e){this.players=[],this.round=0,this.playerHands=[],this.playersReady=[],this.playerRoundDeck=[],this.playerGameDeck=[],this.isPlaying=!1,this.playerScores=[],this.gameOver=!1,void 0==e&&(e=25),this.deckSeed=e,this.turnNumber=0}SyncGame(e){this.round=e.round,this.deckSeed=e.deckSeed,this.gameOver=e.gameOver,this.isPlaying=e.isPlaying,this.players=e.players,this.playerHands=e.playerHands,this.playerScores=e.playerScores,this.playersReady=e.playersReady,this.playerRoundDeck=e.playerRoundDeck,this.playerGameDeck=e.playerGameDeck,this.turnNumber=e.turnNumber}StartRound(){this.playerRoundDeck=[],this.playersReady=[];for(var e=0;e<this.players.length;e++)this.playerRoundDeck.push([]),this.playersReady.push(!1);this.SetDeck(),this.round++}RoundScores(){return r(this.playerRoundDeck)}EndRound(){console.log("Round "+this.round+" is over");for(var e=0;e<this.players.length;e++){var t=this.playerRoundDeck[e].filter(e=>0==e.discarded);this.playerGameDeck[e]=this.playerGameDeck[e].concat(t)}var s=r(this.playerRoundDeck);for(e=0;e<this.players.length&&e<=s.length;e++)this.playerScores[e]+=s[e];if(3==this.round)return this.gameOver=!0,void(this.isPlaying=!1);this.deckSeed+=7,this.StartRound()}SetDeck(){var e=i(),t=a.engines.mt19937();void 0==this.deckSeed?(t=t.autoSeed(),console.log("Using autoseed")):t=t.seed(this.deckSeed),a.shuffle(t,e);var s=this.players.length,n=12-s;n>10&&(n=10),n<7&&(n=7);var r=s*n;e=e.slice(0,r),this.playerHands=[];for(var o=0;o<s;o++)this.playerHands.push(e.splice(0,n))}AddPlayer(e){return!this.isPlaying&&!this.gameOver&&-1==this.players.indexOf(e)&&void this.players.push(e)}AddAI(){var e="[AI]",t=["Billy","Jean","Bobby","Stella","Paul"],s=a.engines.mt19937();if(void 0==this.deckSeed?(s=s.autoSeed(),console.log("Using autoseed")):s=s.seed(this.deckSeed),a.shuffle(s,t),e+=t[this.players.length%t.length],!this.AddPlayer(e))return!1}CalculateAIMoves(e){return[0]}StartGame(){if(this.players.length<=1)return!1;if(this.isPlaying||this.gameOver)return!1;this.isPlaying=!0,this.turnNumber=1;for(var e=0;e<this.players.length;e++)this.playerScores.push(0),this.playerRoundDeck.push([]),this.playerGameDeck.push([]);this.StartRound()}HasChopsticks(e){return this.playerRoundDeck[e].filter(e=>"chopsticks"==e.type).length>0}SetAsideCard(e,t){if(void 0==t||0==this.isPlaying||1==this.gameOver||this.players.length<=e||t.length>=3||2==t.length&&!this.HasChopsticks(e))return!1;if(this.playersReady[e])return!1;if(t.length>2)return console.log("I can't handle multiple chopsticks"),!1;if(2==t.length){var s=this.playerHands[e].filter((e,s)=>-1!=t.indexOf(s));this.playerHands[e]=this.playerHands[e].filter((e,s)=>-1==t.indexOf(s));var a=this.playerRoundDeck[e].map((e,t)=>(e.index=t,e)).filter(e=>"chopsticks"==e.type).map(e=>e.index),n=this;this.playerRoundDeck[e].splice(a[0],1).forEach(t=>{n.playerHands[e].push(t)}),s.forEach(t=>{n.playerRoundDeck[e].push(t)})}else{var i=t[0],r=this.playerHands[e][i];this.playerRoundDeck[e].push(r),this.playerHands[e].splice(i,1)}return this.playersReady[e]=!0,this.HasEveryonePlayed()&&this.EndTurn(),!0}HasEveryonePlayed(){return this.playersReady.reduce(function(e,t){return t&&e},!0)}GetHandCardCount(){return this.playerHands.map(e=>e.length)}EndTurn(){this.playersReady=[];for(var e=0;e<this.players.length;e++)this.playersReady.push(!1);var t=this.playerHands.splice(0,1);this.playerHands.push(t[0]);var s=this.GetHandCardCount().reduce(function(e,t){return e<t?t:e},0);if(this.turnNumber++,s<=1){for(e=0;e<this.playerHands.length;e++)this.playerRoundDeck[e].push(this.playerHands[e].pop());this.EndRound()}}}}},CKbA:function(e,t){},HURy:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("7+uW"),n={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var i=s("VU/8")({name:"App"},n,!1,function(e){s("CKbA")},null,null).exports,r=s("/ocq"),o=s("CHo/");var c={props:["card","picked","index"],name:"Sushies",methods:{PickedCard(){console.log("Picked card from card"),this.$emit("click",this.index)},CardInfo(){console.log("Info wanted for card from card"),this.$emit("card-info",this.index)}},data:()=>({}),computed:{classes(){return{card:!0,"sushi-card":!0,picked:this.card.picked,picked2:this.picked}},headerStyle(){return{"background-color":function(e){switch(e.type){case"sashimi":return"green";case"nigiri":return"yellow";case"maki":return"red";case"dumpling":return"lightblue";case"chopsticks":return"cyan";case"tempura":return"purple";case"pudding":return"pink";case"wasabi":return"lightgreen";default:return console.error("Unknown card type",e.type),"gray"}}(this.card)}},imgSrc(){if(void 0==this.card||void 0==this.card.type)return"N/A";switch(this.card.type){case"nigiri":if(1==this.card.value)return"/static/egg_nigiri.png";if(2==this.card.value)return"/static/nigiri.png";if(3==this.card.value)return"/static/squid_nigiri.png";case"pudding":return"/static/pudding.png";case"maki":return"/static/maki.png";case"tempura":return"/static/tempura.png";case"wasabi":return"/static/wasabi.png";case"chopsticks":return"/static/chopsticks.png";default:return"/static/default_sushi.png"}},hint(){if(void 0==this.card||void 0==this.card.type)return"N/A";switch(this.card.type){case"sashimi":return"x3=10";case"maki":case"chopsticks":return"";case"tempura":return"x2=5";default:return""}}}},d={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{class:e.classes},[s("div",{staticClass:"card-header",style:e.headerStyle,on:{click:e.PickedCard}},[e.card.value>0?s("span",{staticClass:"card-value"},[e._v(e._s(e.card.value))]):e._e(),e._v(" "),s("img",{attrs:{src:e.imgSrc}})]),e._v(" "),s("div",{staticClass:"card-body",on:{click:e.CardInfo}},[e._v("\n      "+e._s(e.card.name)+" "),s("small",[e._v(e._s(e.hint))])])])},staticRenderFns:[]};var l={components:{Card:s("VU/8")(c,d,!1,function(e){s("oS2G")},"data-v-6100cc64",null).exports},props:{cards:{required:!0,type:Array},cardsSetAside:{default:[],type:Array,validator:function(e){return!1}},title:{type:String,default:""}},name:"Sushies",computed:{allCards(){var e=this;return this.cards.map((t,s)=>(t.picked=!1,void 0!==e.cardsSetAside&&-1!=e.cardsSetAside.indexOf(s)?t.picked=!0:console.log(typeof e.cardsSetAside,e.cardsSetAside),t))}},methods:{PickedCard(e){this.$emit("picked-card",e),console.log("Picked card from card view")}},data:()=>({})},u={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"card-view"},[s("div",{staticClass:"card-viewer"},[s("div",{staticClass:"card-view-title"},[e._v(e._s(e.title))]),e._v(" "),e._l(e.allCards,function(t,a){return[s("card",{key:t.name+a,attrs:{card:t,index:a,picked:t.picked},on:{click:e.PickedCard}})]})],2)])])},staticRenderFns:[]};var h=s("VU/8")(l,u,!1,function(e){s("mzGP")},"data-v-1d62e559",null).exports,p=s("hMcO"),m=s.n(p);a.a.use(m.a,window.location.origin),console.log("Connecting to "+window.location.origin);var v={name:"Sushies",components:{CardView:h},data:()=>({isPhone:window.innerWidth<=750,isLandscape:window.innerWidth>=450,game:new o.Game,playerID:-1,cardsSetAside:!1,connected:!1,gameRoom:"",pickedCard:[],playerName:"Matt"}),created:function(){var e=this;$(window).on("resize",function(){e.isPhone=window.innerWidth<=750,e.isLandscape=window.innerWidth>=450}),e.isPhone||this.JoinGame(null),this.gameRoom=this.$route.params.gameID||""},computed:{isLandscape:function(){return window.innerWidth>450},roundScores:function(){return this.game.RoundScores()}},methods:{ResetGame:function(){this.$socket.emit("reset sushi game",this.gameRoom)},StartGame:function(){this.$socket.emit("start sushi game")},PickCard:function(e){if(this.cardsSetAside)console.error("Client can't change their answer");else{console.log("Client is picking card #"+e);var t=this.pickedCard.indexOf(e);-1!=t?this.pickedCard.splice(t,1):this.game.HasChopsticks(this.playerID)?(this.pickedCard.length>1&&this.pickedCard.splice(0,this.pickedCard.length),this.pickedCard.push(e)):(this.pickedCard.length>=1&&this.pickedCard.splice(0,this.pickedCard.length),this.pickedCard.push(e))}},AddAI:function(){this.$socket.emit("add sushi ai")},ReadyToPick:function(e){this.cardsSetAside?console.error("Client can't resend their answer!"):this.pickedCard.length>0&&(this.$socket.emit("pick sushi card",this.pickedCard),this.cardsSetAside=!0)},JoinGame:function(){this.$socket.emit("join sushi game",this.gameRoom,this.playerName)}},sockets:{connect:function(){console.log("socket connected"),this.connected=!0,this.isPhone||this.$socket.emit("sync sushi game")},"sync sushi game":function(e){console.log("We got a new state for the sushi game",e),this.game.SyncGame(e),this.$set(this.game,"playerHands",e.playerHands)},"set players":function(e){this.$set(this.game,"players",e)},"start game":function(){this.game.StartGame()},"reset game":function(){this.game=new o.Game,this.playerID=-1},"set deck seed":function(e){this.game.deckSeed=e},"error message":function(e){alert(e)},"set sushi player":function(e){this.playerID=e,console.log("We are player #"+e)},"pick sushi card":function(e){console.log("Player "+e+" is ready!"),a.a.set(this.game.playersReady,e,!0)},"pick sushi cards":function(e){console.log("All players have played!",e),this.cardsSetAside=!1,this.pickedCard.splice(0,this.pickedCard.length);var t=this;this.game.playersReady=t.game.playersReady.map(e=>!1),e.forEach((e,s)=>{console.log("Setting aside cards for player "+s,e),t.game.SetAsideCard(s,e)})}}},g={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"game-content"},[e.isPhone?e.isLandscape?e.isPhone&&-1==e.playerID?s("div",{staticClass:"container-fluid"},[s("h2",[e._v("Sushi GO!")]),e._v(" "),s("hr"),e._v(" "),s("h3",[e._v("Please Input Your Name")]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.playerName,expression:"playerName"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Your name"},domProps:{value:e.playerName},on:{input:function(t){t.target.composing||(e.playerName=t.target.value)}}}),e._v(" "),s("button",{staticClass:"btn btn-success btn-block",on:{click:e.JoinGame}},[e._v("Join Game")]),e._v(" "),s("br"),e._v(" "),s("button",{staticClass:"btn btn-danger",on:{click:e.ResetGame}},[e._v("Reset Game")])]):e.isPhone&&-1!=e.playerID?s("div",{staticClass:"container-fluid"},[s("div",[e._v("Player "+e._s(e.playerID)+" Round "+e._s(e.game.round))]),e._v(" "),1==e.game.isPlaying?s("div",[s("div",{staticClass:"row"},e._l(e.game.players,function(t,a){return s("div",{key:"player"+a,staticClass:"col-sm"},[a==e.playerID?s("i",{staticClass:"fas fa-user"}):e._e(),e._v(" "+e._s(t)+" \n            "),e.game.playersReady.length>=a?s("span",[e._v(e._s(e.game.playersReady[a]))]):e._e(),e._v(" "),e.game.playerScores.length>=a?s("span",[e._v(e._s(e.game.playerScores[a]))]):e._e(),e._v(" "),e.game.playerScores.length>=a?s("span",[e._v(e._s(e.roundScores[a]))]):e._e()])})),e._v(" "),s("card-view",{staticClass:"row",attrs:{cards:e.game.playerHands[e.playerID],"cards-set-aside":e.pickedCard,id:"player-hand",title:"Hand"},on:{"picked-card":e.PickCard}}),e._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-1"},[s("button",{staticClass:"btn bnt-success",attrs:{disabled:e.cardsSetAside.length>0},on:{click:e.ReadyToPick}},[e._v("Play")])]),e._v(" "),s("card-view",{staticClass:"col",attrs:{cards:e.game.playerRoundDeck[e.playerID],id:"player-deck",title:"Deck"}})],1)],1):e.game.gameOver?s("div"):s("div",[s("p",[e._v("Waiting for the game to start")]),e._v(" "),s("p",[e._v("Players waiting:")]),e._v(" "),s("ul",e._l(e.game.players,function(t){return s("li",[e._v(" "+e._s(t)+" ")])}))]),e._v(" "),e.game.isPlaying||0!=e.playerID?e._e():s("button",{staticClass:"btn",on:{click:e.StartGame}},[e._v("StartGame")]),e._v(" "),e.game.isPlaying||0!=e.playerID?e._e():s("button",{staticClass:"btn",on:{click:e.AddAI}},[e._v("Add AI")]),e._v(" "),s("button",{staticClass:"btn btn-danger",on:{click:e.ResetGame}},[e._v("Reset Game")])]):s("div",[e._v("\n    Unknown state\n  ")]):s("div",[s("h2",[e._v("Please turn your phone sideways.\n  ")])]):s("div",[e._l(e.game.players,function(t,a){return s("div",{key:"player"+a,staticClass:"panel"},[s("h3",[e._v(" "+e._s(t)+" "+e._s(e.game.playersReady[a])+" ")])])}),e._v(" "),e._l(e.game.players,function(t,a){return s("card-view",{key:t,attrs:{cards:e.game.playerRoundDeck[a],title:t}})}),e._v("\n    "+e._s(e.game.playerScores)+"\n    "),s("hr"),e._v(" "),s("pre",{staticClass:"hidden-lg"},[e._v(e._s(e.game))]),e._v(" "),s("button",{on:{click:function(t){e.isPhone=!0}}},[e._v("Play as a player")])],2)])},staticRenderFns:[]};var f=s("VU/8")(v,g,!1,function(e){s("22Ry")},"data-v-71590bb6",null).exports;a.a.use(m.a,window.location.origin);var y={name:"Sushies",data:()=>({gamesList:{},playerName:"Testing"}),methods:{CreateGame(){console.log("Crating sushi game"),this.$socket.emit("create sushi game",this.playerName+"'s game")}},sockets:{connect:function(){console.log("socket connected"),this.$socket.emit("list sushi games")},"list sushi games":function(e){console.log("We got a new list of sushi games",e),this.$set(this,"gamesList",e)}}},_={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content"},[s("h1",[e._v("Sushi Go!")]),e._v(" "),s("div",[e._v("\r\n        Here's where the lobby will go\r\n        "),e._l(e.gamesList,function(t){return s("a",{attrs:{href:/sushi/+t.id}},[e._v(e._s(t.name))])})],2),e._v(" "),s("button",{staticClass:"btn btn-success",on:{click:e.CreateGame}},[e._v("Create Game")])])},staticRenderFns:[]};var k=s("VU/8")(y,_,!1,function(e){s("NtBG")},"data-v-1e2d7bed",null).exports,b=s("DmT9"),C=s.n(b),w=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,G=((window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight)-100)/5;function S(e){return"red"==e?"blue":"red"}var R={name:"Sushies",data:()=>({gameID:"",gamelist:[],newGameName:"",role:"",socket:C()(),currentTurn:"red",winner:"",words:[],board:[],wordsGuessed:[],isPhone:w<500,boxHeight:G-5+"px"}),mounted:function(){var e=this;console.log(e),e.socket.on("create game",this.AddGame),e.socket.on("game list",function(t){console.log(t),e.gamelist=t}),e.socket.on("word list",function(t){e.words=t,console.log("Updating words")}),e.socket.on("guesses",function(t){e.wordsGuessed=t,console.log("Updating guesses",e.wordsGuessed)}),e.socket.on("guess word",function(t){a.a.set(e.wordsGuessed,t,!0),console.log("Updating guess for index "+t)}),e.socket.on("game board",function(t){e.board=t,console.log("Updating board")}),e.socket.on("end turn",function(t){e.currentTurn=t}),e.socket.on("game won",function(t){e.winner=t})},methods:{CreateGame:function(){console.log("Creating a game"),""!=this.newGameName&&this.socket.emit("create game",this.newGameName)},AddGame:function(e){this.gamelist.push(e)},JoinGame:function(e){console.log("Joining game"+e),this.gameID=e,this.words=[],this.winner="",this.role="",this.socket.emit("join game",e);for(var t=0;t<25;t++)a.a.set(this.wordsGuessed,t,!1)},GuessWord:function(e){this.socket.emit("guess word",[this.gameID,e]),a.a.set(this.wordsGuessed,e,!0),this.board[e]!=this.currentTurn&&(this.currentTurn=S(this.currentTurn))},EndGame:function(){this.socket.emit("end game",this.gameID),this.LeaveGame()},LeaveGame:function(){this.gameID=""},SetColor:function(e){this.role=e},EndTurn:function(){this.socket.emit("end turn",this.gameID)}},computed:{MyColor:function(){var e=this.board,t=this.role,s=this.wordsGuessed;return this.words.filter(function(a,n){return e[n]==t&&!s[n]})},TheirColor:function(){var e=this.board,t=S(this.role),s=this.wordsGuessed;return this.words.filter(function(a,n){return e[n]==t&&!s[n]})},DeathWord:function(){var e=this.board,t=this.wordsGuessed;return this.words.filter(function(s,a){return"death"==e[a]&&!t[a]})},NoColor:function(){var e=this.board,t=this.wordsGuessed;return this.words.filter(function(s,a){return"none"==e[a]&&!t[a]})},Guessed:function(){this.board;var e=this.wordsGuessed;return this.words.filter(function(t,s){return e[s]})}}},D={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"container-fluid"},[""==e.gameID||e.isPhone||""!=e.winner?""!=e.gameID&&""==e.role&&""==e.winner?s("div",{staticClass:"container"},[s("br"),e._v(" "),s("h2",[e._v("Pick your Team")]),e._v(" "),s("button",{staticClass:"btn btn-block btn-danger",on:{click:function(t){e.SetColor("red")}}},[e._v("Red")]),e._v(" "),s("button",{staticClass:"btn btn-block btn-primary",on:{click:function(t){e.SetColor("blue")}}},[e._v("Blue")])]):""!=e.gameID&&""==e.winner?s("div",{staticClass:"container"},[s("div",{staticClass:"text-center"},[e._v("Currently "+e._s(e.role==e.currentTurn?"your":"not your")+" turn")]),e._v(" "),s("button",{staticClass:"btn btn-block btn-info",on:{click:e.EndTurn}},[e._v("End Turn")]),e._v(" "),s("h2",[e._v("Your Words")]),e._v(" "),s("ul",e._l(e.MyColor,function(t){return s("li",[e._v(e._s(t))])})),e._v(" "),s("h2",[e._v("Their words")]),e._v(" "),s("ul",e._l(e.TheirColor,function(t){return s("li",[e._v(e._s(t))])})),e._v(" "),s("h2",[e._v("Death word")]),e._v(" "),s("ul",e._l(e.DeathWord,function(t){return s("li",[e._v(e._s(t))])})),e._v(" "),s("h2",[e._v("Neutral")]),e._v(" "),s("ul",e._l(e.NoColor,function(t){return s("li",[e._v(e._s(t))])})),e._v(" "),s("h2",[e._v("Guessed Words")]),e._v(" "),s("ul",e._l(e.Guessed,function(t){return s("li",[e._v(e._s(t))])})),e._v(" "),s("br"),e._v(" "),s("div",{staticClass:"col"},[s("button",{staticClass:"btn btn-success btn-block btn-sm",on:{click:e.LeaveGame}},[e._v("Leave Game")])])]):""!=e.gameID&&""!=e.winner&&""==e.role?s("div",{staticClass:"container"},[s("h1",{staticClass:"text-center"},[e._v("Winner: "+e._s(e.winner))]),e._v(" "),s("div",{staticClass:"col"},[s("button",{staticClass:"btn btn-success btn-block btn-sm",on:{click:e.LeaveGame}},[e._v("Leave Game")])])]):""!=e.gameID&&e.winner==e.role?s("div",{staticClass:"container"},[s("h1",{staticClass:"text-center"},[e._v("Winner winner chicken dinner!")]),e._v(" "),s("div",{staticClass:"col"},[s("button",{staticClass:"btn btn-success btn-block btn-sm",on:{click:e.LeaveGame}},[e._v("Leave Game")])])]):""!=e.gameID&&""!=e.winner?s("div",{staticClass:"container"},[s("h1",[e._v("You've lost!")]),e._v(" "),s("div",{staticClass:"col"},[s("button",{staticClass:"btn btn-success btn-block btn-sm",on:{click:e.LeaveGame}},[e._v("Leave Game")])])]):""==e.gameID?s("div",{staticClass:"container"},[s("h2",[e._v("Join a game!")]),e._v(" "),s("ul",{staticClass:"list-group"},e._l(e.gamelist,function(t){return s("a",{staticClass:"list-group-item",on:{click:function(s){e.JoinGame(t)}}},[e._v(e._s(t))])})),e._v(" "),s("hr"),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.newGameName,expression:"newGameName"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Name your game"},domProps:{value:e.newGameName},on:{input:function(t){t.target.composing||(e.newGameName=t.target.value)}}}),e._v(" "),s("button",{staticClass:"btn btn-block btn-primary",on:{click:e.CreateGame}},[e._v("Create a game")])]):e._e():s("div",[s("div",{staticClass:"text-center",style:{"background-color":e.currentTurn}},[e._v("Currently "+e._s(e.currentTurn)+"'s turn")]),e._v(" "),e.words.length>0?s("div",e._l(Math.ceil(e.words.length/5),function(t){return s("div",{staticClass:"row"},e._l(e.words.slice(5*(t-1),5*t),function(a,n){return s("div",{staticClass:"col text-center codeword",on:{click:function(s){e.GuessWord(n+5*(t-1))}}},[s("div",{staticClass:"card panel-default",class:{red:e.wordsGuessed[n+5*(t-1)]&&"red"==e.board[n+5*(t-1)],blue:e.wordsGuessed[n+5*(t-1)]&&"blue"==e.board[n+5*(t-1)],none:e.wordsGuessed[n+5*(t-1)]&&"none"==e.board[n+5*(t-1)],death:e.wordsGuessed[n+5*(t-1)]&&"death"==e.board[n+5*(t-1)]},style:{height:e.boxHeight}},[e.wordsGuessed[n+5*(t-1)]?s("div",{staticClass:"card-header upsidedown"},[s("span",[e._v(e._s(e.board[n+5*(t-1)]))])]):s("div",{staticClass:"card-header upsidedown"},[e._v("\n                             "+e._s(a)+"\n                         ")]),e._v(" "),e.wordsGuessed[n+5*(t-1)]?s("div",{staticClass:"card-block",style:{height:e.boxHeight}},[s("span",[e._v(e._s(e.board[n+5*(t-1)]))])]):s("div",{staticClass:"card-block",style:{height:e.boxHeight}},[s("b",[e._v(e._s(a))])])])])}))})):s("div",[s("h2",{staticClass:"text-center"},[e._v("Loading words...")])]),e._v(" "),s("br"),e._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[s("button",{staticClass:"btn btn-danger btn-block btn-sm",on:{click:e.EndGame}},[e._v("End Game")])]),e._v(" "),s("div",{staticClass:"col"},[s("button",{staticClass:"btn btn-info btn-block btn-sm",on:{click:e.EndTurn}},[e._v("End Turn")])])])])])},staticRenderFns:[]};const P=[{path:"/sushi",name:"Sushi-to-go-lobby",title:"Sushies Lobby",component:k},{path:"/sushi/:gameID",name:"Sushi-on-the-go",title:"Sushies",component:f},{path:"/codewords",name:"codewords",title:"Code Words",component:s("VU/8")(R,D,!1,function(e){s("4yV6")},"data-v-eb4e2e26",null).exports}];var H={name:"HelloWorld",data:()=>({games:P})},x={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"hello"},[s("h1",[e._v(e._s(e.msg))]),e._v(" "),e._l(e.games,function(t){return s("div",{key:t.name,staticClass:"game"},[s("router-link",{attrs:{to:{name:t.name}}},[s("h1",[e._v("Play  "+e._s(t.title))])])],1)})],2)},staticRenderFns:[]};var I=s("VU/8")(H,x,!1,function(e){s("c6e3")},"data-v-4af59749",null).exports,A={name:"Page Not Found",data:()=>({msg:"Page Not Found"})},N={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"hello"},[t("h1",[this._v(this._s(this.msg))])])},staticRenderFns:[]},E=s("VU/8")(A,N,!1,null,null,null).exports;a.a.use(r.a);var T=[{path:"/",name:"HelloWorld",component:I}];(T=T.concat(P)).push({path:"*",component:E}),console.log(T);var W=new r.a({routes:T,history:!0,mode:"history"});a.a.config.productionTip=!1,new a.a({el:"#app",router:W,components:{App:i},template:"<App/>"})},NtBG:function(e,t){},c6e3:function(e,t){},mzGP:function(e,t){},oS2G:function(e,t){},vSBm:function(e,t){function s(e){for(var t=[],s=0;s<e;s++)t.push(0);return t}function a(e,t){return e.map(function(s){return s.filter(function(s){return null==s&&console.error("This is a bad card",s,e),s.type==t})})}function n(e){return e.map(function(e){e=e.filter(e=>"nigiri"==e.type||"wasabi"==e.type);for(var t=!1,s=0,a=0;a<e.length;a++)"wasabi"==e[a].type?t=!0:(s+=t?3*e[a].value:e[a].value,t=!1);return s})}function i(e){return a(e,"sashimi").map(e=>e.length).map(function(e){return 10*Math.floor(e/3)})}function r(e){var t=[0,1,3,6,10,15,16,18,21,25,30];return a(e,"dumpling").map(e=>e.length).map(function(e){return t[e]})}function o(e){for(var t=a(e,"maki").map(function(e){return e.reduce(function(e,t){return e+t.value},0)}),s=0,n=0,i=0,r=0,o=0;o<t.length;o++)t[o]>s?(s=t[o],i=1):t[o]==s&&i++;for(o=0;o<t.length;o++)t[o]>=s||(t[o]>n?(n=t[o],r=1):t[o]==n&&r++);i>1&&(r=0);var c=Math.floor(6/i),d=0!=r?Math.floor(3/r):0;return 0==s&&(c=0),0==n&&(d=0),t.map(function(e){return e==s?c:e==n?d:0})}function c(e){return a(e,"tempura").map(e=>5*Math.floor(e.length/2))}class d{constructor(e,t,s){this.name=e,void 0==s&&(s=e),this.type=s.toLowerCase(),void 0==t&&(t=0),this.value=t,this.discarded=!1!==t}}e.exports={ScoreCards:function(e){if(void 0==e)return"ERROR";var t=[o,c,i,r,n],a=s(e.length);return t.forEach(t=>{a=function(e,t){for(var s=0;s<e.length&&s<=t.length;s++)e[s]+=t[s];return e}(a,t(e))}),a},GetDeck:function(){for(var e=[],t=0;t<14;t++)e.push(new d("Tempura"));for(t=0;t<14;t++)e.push(new d("Sashimi"));for(t=0;t<14;t++)e.push(new d("Dumpling"));for(t=0;t<12;t++)e.push(new d("Maki",2));for(t=0;t<8;t++)e.push(new d("Maki",3));for(t=0;t<6;t++)e.push(new d("Maki",1));for(t=0;t<10;t++)e.push(new d("Salmon Nigiri",2,"nigiri"));for(t=0;t<5;t++)e.push(new d("Squid Nigiri",3,"nigiri"));for(t=0;t<5;t++)e.push(new d("Egg Nigiri",1,"nigiri"));for(t=0;t<10;t++)e.push(new d("Pudding",!1));for(t=0;t<6;t++)e.push(new d("Wasabi"));for(t=0;t<4;t++)e.push(new d("Chopsticks"));return e},Card:d,ScoreGame:function(e){return s(e)}}}},["HURy"]);
//# sourceMappingURL=app.0884998a392407f8cf6d.js.map