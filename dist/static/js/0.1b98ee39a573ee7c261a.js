webpackJsonp([0],{

/***/ "01OR":
/***/ (function(module, exports) {

const questions = [
    "Where were you were born",
    "Where did you mostly grow up",
    "What was your first car",
    "What was your favorite subject in school/high school/college",
    "Where did you serve a mission",
    "What was your first job",
    "What’s your earliest memory",
    "What were some of your hobbies growing up",
    "What is your hobby now",
    "What's your favorite color",
    "What is your favorite season",
    "What's your favorite kind of vacation",
    "What is your favorite animal",
    "What's your favorite tv show",
    "Which is your favorite holiday",
    "What do you do to relax",
    "What's your favorite form of exercise",
    "Are you a night owl or a morning person",
    "Did you play a sport in high school",
    "Do you have a favorite sports team",
    "What is your favorite food",
    "What is your favorite dessert",
    "What is your favorite movie",
    "What is your favorite outdoor activity",
    "Who is the prophet you most remember as a child or youth",
    "What is your job",
    "What is your favorite board game",
];
const McGhieAnswers = [
    "Cupertino, CA",
    "Cupertino, CA",
    "Plymouth Satellite",
    "Music (Band/Choir/Orchestra)",
    "Okayama, Japan",
    "Paper boy",
    "I don’t remember. Lol.",
    "Sports (all, but especially basketball)",
    "Anime",
    "Blue",
    "Spring",
    "Staying at home and relaxing",
    "Ryan’s dog wiggles”",
    "Kaguya wants to be confessed to",
    "Christmas",
    "Play video games (DOTA)",
    "Going for a walk",
    "Neither. I like my sleep.",
    "Yes. Football, basketball, tennis",
    "Orangutan Gangsters",
    "MOD Pizza",
    "Ice Cream",
    "Man of La Mancha",
    "Picnic",
    "David O McKay",
    "Software Engineer",
    "Spot It",
];
const MurrayAnswers = [
    "Lancaster, California",
    "Lancaster, California  - The High Desert",
    "Toyota Celica",
    "Math",
    "Buenos Aires South Argentina and Dallas Texas",
    "Fast Food - Weinerschnitzel",
    "When I was a little kid, I remember having swimming birthday parties in our backyard pool.",
    "Space, Skateboarding and Surfing",
    "Skateboarding, Volleyball and Computers",
    "White",
    "Summer",
    "Disney!",
    "Penguins or my Westie Missy",
    "Hallmark Movies",
    "Christmas",
    "Work in the yard",
    "Gardening or Wii Just Dance",
    "Neither",
    "Golf and Basketball",
    "Seahawks and LA Lakers",
    "Cereal",
    "Ice Cream Shakes or Fudge",
    "Tomorrowland",
    "Boogie Boarding or Surfing or Miniature Golf",
    "Spencer W Kimball",
    "Systems Analyst",
    "Disney Music Trivia or Yahtzee"
];

const EllenAnswers = [
    "Dallas, Texas",
    "Dallas, Texas",
    "Dodge Neon",
    "Social Studies",
    "I didn't serve",
    "Pharmacy Technician",
    "A bad dream with a green monster",
    "The Sims and band",
    "Reading, Baking, and Home Decor",
    "Blue",
    "Fall",
    "Beach Vacations",
    "Dogs",
    "America's Test Kitchen",
    "Christmas",
    "I never relax",
    "Refit",
    "Night Owl",
    "Soccer",
    "I don't watch sports",
    "Carbs",
    "Cookies",
    "Anything with peanut butter and chocolate",
    "Pride and Prejudice",
    "Bike Rides",
    "Monson",
    "None",
    "Settlers of Catan"
];
var DaybellAnswers = [
    "Heber City, UT",
    "Heber City, UT",
    "Ford Pinto",
    "HS (Sports & girls)/College (Math)",
    "Ohio/Pennsylvania",
    "Railroad worker",
    "Watching grandma make peanut butter cookies",
    "Hunting, Fishing, Tae Kwon Do",
    "Reading, Traveling",
    "Blue",
    "Spring",
    "Anything with all my kids and grandkids",
    "Dog",
    "Big Bang Theory",
    "Labor Day",
    "Read",
    "Tae Kwon Do or Running",
    "Night Owl",
    "Basketball, Football and Track",
    "Anyone but the Patriots",
    "Mexican",
    "German chocolate cake",
    "Ferris Buellers Day off",
    "Running or Hiking",
    "David O’ McKay",
    "CEO",
    "Candy Land"
];

module.exports = {
    questions,
    answers: {
        "McGhie": McGhieAnswers,
        "Murray": MurrayAnswers,
        "Daybell": DaybellAnswers,
    }
}

/***/ }),

/***/ "67Hg":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Konami-JS ~
 * :: Now with support for touch events and multiple instances for
 * :: those situations that call for multiple easter eggs!
 * Code: https://github.com/snaptortoise/konami-js
 * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
 * Version: 1.6.2 (7/17/2018)
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1+ and Android
 */

var Konami = function (callback) {
    var konami = {
        addEvent: function (obj, type, fn, ref_obj) {
            if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
            else if (obj.attachEvent) {
                // IE
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () {
                    obj["e" + type + fn](window.event, ref_obj);
                }
                obj.attachEvent("on" + type, obj[type + fn]);
            }
        },
        removeEvent: function (obj, eventName, eventCallback) {
            if (obj.removeEventListener) {
                obj.removeEventListener(eventName, eventCallback);
            } else if (obj.attachEvent) {
                obj.detachEvent(eventName);
            }
        },
        input: "",
        pattern: "38384040373937396665",
        keydownHandler: function (e, ref_obj) {
            if (ref_obj) {
                konami = ref_obj;
            } // IE
            konami.input += e ? e.keyCode : event.keyCode;
            if (konami.input.length > konami.pattern.length) {
                konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
            }
            if (konami.input === konami.pattern) {
                konami.code(konami._currentLink);
                konami.input = '';
                e.preventDefault();
                return false;
            }
        },
        load: function (link) {
            this._currentLink = link;
            this.addEvent(document, "keydown", this.keydownHandler, this);
            this.iphone.load(link);
        },
        unload: function () {
            this.removeEvent(document, 'keydown', this.keydownHandler);
            this.iphone.unload();
        },
        code: function (link) {
            window.location = link
        },
        iphone: {
            start_x: 0,
            start_y: 0,
            stop_x: 0,
            stop_y: 0,
            tap: false,
            capture: false,
            orig_keys: "",
            keys: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"],
            input: [],
            code: function (link) {
                konami.code(link);
            },
            touchmoveHandler: function (e) {
                if (e.touches.length === 1 && konami.iphone.capture === true) {
                    var touch = e.touches[0];
                    konami.iphone.stop_x = touch.pageX;
                    konami.iphone.stop_y = touch.pageY;
                    konami.iphone.tap = false;
                    konami.iphone.capture = false;
                    konami.iphone.check_direction();
                }
            },
            touchendHandler: function () {
                konami.iphone.input.push(konami.iphone.check_direction());

                if (konami.iphone.input.length > konami.iphone.keys.length) konami.iphone.input.shift();

                if (konami.iphone.input.length === konami.iphone.keys.length) {
                    var match = true;
                    for (var i = 0; i < konami.iphone.keys.length; i++) {
                        if (konami.iphone.input[i] !== konami.iphone.keys[i]) {
                            match = false;
                        }
                    }
                    if (match) {
                        konami.iphone.code(konami._currentLink);
                    }
                }
            },
            touchstartHandler: function (e) {
                konami.iphone.start_x = e.changedTouches[0].pageX;
                konami.iphone.start_y = e.changedTouches[0].pageY;
                konami.iphone.tap = true;
                konami.iphone.capture = true;
            },
            load: function (link) {
                this.orig_keys = this.keys;
                konami.addEvent(document, "touchmove", this.touchmoveHandler);
                konami.addEvent(document, "touchend", this.touchendHandler, false);
                konami.addEvent(document, "touchstart", this.touchstartHandler);
            },
            unload: function () {
                konami.removeEvent(document, 'touchmove', this.touchmoveHandler);
                konami.removeEvent(document, 'touchend', this.touchendHandler);
                konami.removeEvent(document, 'touchstart', this.touchstartHandler);
            },
            check_direction: function () {
                x_magnitude = Math.abs(this.start_x - this.stop_x);
                y_magnitude = Math.abs(this.start_y - this.stop_y);
                x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
                y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
                result = (x_magnitude > y_magnitude) ? x : y;
                result = (this.tap === true) ? "TAP" : result;
                return result;
            }
        }
    }

    typeof callback === "string" && konami.load(callback);
    if (typeof callback === "function") {
        konami.code = callback;
        konami.load();
    }

    return konami;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Konami;
} else {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return Konami;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        window.Konami = Konami;
    }
}

/***/ }),

/***/ "pew2":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "xt7G":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm.js
var vue_esm = __webpack_require__("7+uW");

// EXTERNAL MODULE: ./node_modules/vue-socket.io/dist/build.js
var build = __webpack_require__("hMcO");
var build_default = /*#__PURE__*/__webpack_require__.n(build);

// EXTERNAL MODULE: ./games/gameshow/client/konami.js
var konami = __webpack_require__("67Hg");
var konami_default = /*#__PURE__*/__webpack_require__.n(konami);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/gameshow/client/TeamList.vue
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var TeamList = ({
  name: "TeamsList",
  data() {
    return {};
  },
  methods: {
    clicked: function (team) {
      console.log("Clicked on team", team);
      this.$emit("click", team);
    }
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["teams"]
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-89978066","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/gameshow/client/TeamList.vue
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container-fluid"},[_c('h3',[_vm._v("Teams")]),_vm._v(" "),_c('ul',{staticClass:"list-group list-group-flush"},[_vm._l((_vm.teams),function(team){return _c('a',{key:team.name,staticClass:"list-group-item list-group-item-action text-black",on:{"click":function($event){_vm.clicked(team.name)}}},[_vm._v("\n      "+_vm._s(team.name)+"\n      "),_c('span',{staticClass:"badge badge-pill badge-primary"},[_vm._v(_vm._s(team.sockets.length)+" players")])])}),_vm._v(" "),(_vm.teams.length == 0)?_c('li',{staticClass:"list-group-item text-black"},[_vm._v("No Teams Yet")]):_vm._e()],2)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ var client_TeamList = (esExports);
// CONCATENATED MODULE: ./games/gameshow/client/TeamList.vue
function injectStyle (ssrContext) {
  __webpack_require__("ymDM")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-89978066"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  TeamList,
  client_TeamList,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ var gameshow_client_TeamList = (Component.exports);

// EXTERNAL MODULE: ./games/gameshow/common/data.js
var data = __webpack_require__("01OR");
var data_default = /*#__PURE__*/__webpack_require__.n(data);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/gameshow/client/Gameshow.vue
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







vue_esm["a" /* default */].use(build_default.a, window.location.origin);

const ROOT = "Gameshow:";

/* harmony default export */ var Gameshow = ({
  name: "Gameshow game",
  components: {
    TeamList: gameshow_client_TeamList
  },
  data() {
    var self = this;

    var gameRoom = this.$route.params.gameID || "";
    var debug = location.hostname === "localhost" || location.hostname === "127.0.0.1";

    return {
      windowLocation: window.location.href,
      playerTeam: "",
      debug: debug,
      teams: [],
      question: {
        id: -1,
        answer: -1,
        person: ""
      },
      adminMode: false,
      currentTeamsTurn: "",
      isPad: window.innerWidth >= 750,
      newTeamName: "",
      konami: null
    };
  },
  computed: {
    gameOver: function () {
      if (this.question.id == -2) return true;
      return false;
    }
  },
  methods: {
    konamiActivated: function () {
      console.log("Konami activated!");
      this.adminMode = true;
    },
    gameReset: function () {
      this.$socket.emit(ROOT + "reset");
    },
    gameBuzz: function () {
      this.$socket.emit(ROOT + "buzz", this.playerTeam);
    },
    gameSuperBuzz: function (teamName) {
      this.$socket.emit(ROOT + "super buzz", teamName);
    },
    gameAddTeam: function () {
      var teamName = this.newTeamName;
      this.$socket.emit(ROOT + "add team", teamName);
    },
    gameCorrect: function () {
      var questionId = this.question["id"];
      this.$socket.emit(ROOT + "correct", questionId);
    },
    gameIncorrect: function () {
      var questionId = this.question["id"];
      this.$socket.emit(ROOT + "incorrect", questionId);
    },
    gameRemoveTeam: function (teamName) {
      console.log("Removing team", teamName);
      this.$socket.emit(ROOT + "remove team", teamName);
    },
    gamePickTeam: function (teamName) {
      console.log("Pciking team", teamName);
      this.$socket.emit(ROOT + "pick team", teamName);
      this.playerTeam = teamName;
    },
    gameReset: function () {
      this.$socket.emit(ROOT + "reset");
    }
  },
  sockets: {
    connect: function () {
      this.$socket.emit(ROOT + "connect");
    },
    "Gameshow:teams": function (teams) {
      console.log("Recieved new teams", teams);
      while (this.teams.length > 0) this.teams.shift();
      while (teams.length > 0) this.teams.push(teams.shift());
    },
    "Gameshow:question": function (question) {
      console.log("Recieved new question", question);
      this.question.id = question.id;
      this.question.person = question.person;
      this.question.answer = question.answer;
    },
    "Gameshow:team turn": function (teamTurn) {
      this.currentTeamsTurn = teamTurn;
    }
  },
  mounted: function () {
    this.$socket.emit(ROOT + "connect");
    // add keydown event listener
    this.konami = new konami_default.a(this.konamiActivated);
  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-0d18dad8","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/gameshow/client/Gameshow.vue
var Gameshow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_c('br'),_vm._v(" "),_vm._m(0),_vm._v(" "),(_vm.adminMode)?_c('div',[_c('h2',[_vm._v("Admin Mode")]),_vm._v(" "),_c('p',[_vm._v("Correct Answer: "+_vm._s(_vm.question.person))]),_vm._v(" "),_c('button',{staticClass:"btn btn-block btn-success",on:{"click":_vm.gameCorrect}},[_vm._v("Correct!")]),_vm._v(" "),_c('button',{staticClass:"btn btn-block btn-danger",on:{"click":_vm.gameIncorrect}},[_vm._v("Incorrect!")]),_vm._v(" "),_c('br'),_vm._v(" "),_c("TeamList",{tag:"div",attrs:{"teams":_vm.teams},on:{"click":_vm.gameSuperBuzz}}),_vm._v(" "),_c('br'),_vm._v(" "),_c('div',{staticClass:"input-group mb-3"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.newTeamName),expression:"newTeamName"}],staticClass:"form-control",attrs:{"type":"text","placeholder":"New Team Name"},domProps:{"value":(_vm.newTeamName)},on:{"input":function($event){if($event.target.composing){ return; }_vm.newTeamName=$event.target.value}}}),_vm._v(" "),_c('div',{staticClass:"input-group-append"},[_c('button',{staticClass:"btn btn-primary",on:{"click":_vm.gameAddTeam}},[_vm._v("Add Team")])])]),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{staticClass:"btn btn-block btn-warning btn-sm"},[_vm._v("Reset Game")])]):(_vm.gameOver)?_c('div',[_c('h2',[_vm._v("Game Over!")]),_vm._v(" "),_c('h3',[_vm._v("The winner is: ")])]):(_vm.isPad)?_c('div',[(_vm.question.id >= 0)?_c('div',[_c('h3',[_vm._v("When asked, \""+_vm._s(_vm.GameData.questions[_vm.question.id])+"?\""),_c('h3',[_c('h3',[_vm._v("They said \""+_vm._s(_vm.GameData.answers[_vm.question.person][_vm.question.id])+"\"")])])])]):_vm._e(),_vm._v("\n      Questions will appear here.\n      "),(_vm.currentTeamsTurn != '')?_c('div',[_vm._v("Currently it is "+_vm._s(_vm.currentTeamsTurn)+"s team and they have 0:05")]):_vm._e()]):(_vm.playerTeam == '')?_c('div',[_c("TeamList",{tag:"div",attrs:{"teams":_vm.teams},on:{"click":_vm.gamePickTeam}})]):_c('div',[_c('h3',[_vm._v("Team "+_vm._s(_vm.playerTeam))]),_c('p',[_vm._v("Press to buzz in!")]),_vm._v(" "),_c('button',{staticClass:"btn btn-block btn-huuge btn-success",on:{"click":_vm.gameBuzz}},[_vm._v("Buzz in!")])])])}
var Gameshow_staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container"},[_c('div',{staticClass:"jumbotron"},[_c('h1',{staticClass:"display-4 text-black"},[_vm._v("Do you know your bishop?")])])])}]
var Gameshow_esExports = { render: Gameshow_render, staticRenderFns: Gameshow_staticRenderFns }
/* harmony default export */ var client_Gameshow = (Gameshow_esExports);
// CONCATENATED MODULE: ./games/gameshow/client/Gameshow.vue
function Gameshow_injectStyle (ssrContext) {
  __webpack_require__("pew2")
}
var Gameshow_normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var Gameshow___vue_template_functional__ = false
/* styles */
var Gameshow___vue_styles__ = Gameshow_injectStyle
/* scopeId */
var Gameshow___vue_scopeId__ = "data-v-0d18dad8"
/* moduleIdentifier (server only) */
var Gameshow___vue_module_identifier__ = null
var Gameshow_Component = Gameshow_normalizeComponent(
  Gameshow,
  client_Gameshow,
  Gameshow___vue_template_functional__,
  Gameshow___vue_styles__,
  Gameshow___vue_scopeId__,
  Gameshow___vue_module_identifier__
)

/* harmony default export */ var gameshow_client_Gameshow = __webpack_exports__["default"] = (Gameshow_Component.exports);


/***/ }),

/***/ "ymDM":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=0.1b98ee39a573ee7c261a.js.map