webpackJsonp([5],{

/***/ "BnnJ":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "HWGT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm.js
var vue_esm = __webpack_require__("7+uW");

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/dixit/client/Rabbit.vue
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



/* harmony default export */ var Rabbit = ({
  name: "Rabbit",
  data() {
    return {
      jumping: false
    };
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["score", "name"],
  watch: {
    score() {
      console.log("The rabbit with score " + this.score + " is jumping");
      this.jumping = true;
    }
  },
  methods: {
    endedAnimation() {
      this.jumping = false;
    }
  },
  computed: {
    style() {
      //TODO get maximum score
      var percent = Math.round(this.score / 30 * 100);
      return {
        transform: "translate(" + percent + "%)"
      };
    }
  }
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-f179cc56","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/dixit/client/Rabbit.vue
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"overflow-x":"hidden"}},[_c('div',{staticClass:"rabbit-container",style:(_vm.style)},[_c('div',{staticClass:"rabbit",class:{animated: _vm.jumping},on:{"animationend":_vm.endedAnimation}},[_c('div',{staticClass:"score"},[_vm._v(_vm._s(_vm.score))])])]),_vm._v(" "),_c('div',{staticClass:"name text-center"},[_vm._v(_vm._s(_vm.name))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ var client_Rabbit = (esExports);
// CONCATENATED MODULE: ./games/dixit/client/Rabbit.vue
function injectStyle (ssrContext) {
  __webpack_require__("BnnJ")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-f179cc56"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  Rabbit,
  client_Rabbit,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ var dixit_client_Rabbit = (Component.exports);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/dixit/client/Scores.vue
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




/* harmony default export */ var Scores = ({
  name: "Scores",
  components: {
    Rabbit: dixit_client_Rabbit
  },
  data() {
    return {};
  },
  //players is the list of all the players and available is a list of the index of all avaiable players
  props: ["isPad", "scores", "players"]
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-607cd07a","hasScoped":false,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/dixit/client/Scores.vue
var Scores_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[_c('h2',[_vm._v("Scores")]),_vm._v(" "),(_vm.isPad)?_c('div',_vm._l((_vm.players),function(player,index){return _c('rabbit',{key:(player+index),attrs:{"score":_vm.scores[index],"name":player}})})):_c('div',_vm._l((_vm.players),function(player,index){return _c('div',{key:(player+index)},[_vm._v(_vm._s(player)+": "+_vm._s(_vm.scores[index]))])}))])}
var Scores_staticRenderFns = []
var Scores_esExports = { render: Scores_render, staticRenderFns: Scores_staticRenderFns }
/* harmony default export */ var client_Scores = (Scores_esExports);
// CONCATENATED MODULE: ./games/dixit/client/Scores.vue
var Scores_normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var Scores___vue_template_functional__ = false
/* styles */
var Scores___vue_styles__ = null
/* scopeId */
var Scores___vue_scopeId__ = null
/* moduleIdentifier (server only) */
var Scores___vue_module_identifier__ = null
var Scores_Component = Scores_normalizeComponent(
  Scores,
  client_Scores,
  Scores___vue_template_functional__,
  Scores___vue_styles__,
  Scores___vue_scopeId__,
  Scores___vue_module_identifier__
)

/* harmony default export */ var dixit_client_Scores = __webpack_exports__["a"] = (Scores_Component.exports);


/***/ }),

/***/ "ZfNi":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "ZvKF":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/vue/dist/vue.esm.js
var vue_esm = __webpack_require__("7+uW");

// EXTERNAL MODULE: ./games/dixit/client/Scores.vue + 5 modules
var Scores = __webpack_require__("HWGT");

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./games/dixit/client/Test.vue
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




/* harmony default export */ var Test = ({
  name: "Reveal",
  data() {
    return {
      playerList: ["Joe", "Schmo", "Bo"],
      scores: [5, 2, 3],
      isPad: true,
      hasPad: true,
      state: "reveal"
    };
  },
  components: {
    Scores: Scores["a" /* default */]
  },
  methods: {},
  computed: {}
});
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-09d228da","hasScoped":true,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./games/dixit/client/Test.vue
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"test content container"},[(_vm.state != 'lobby' && (_vm.isPad || !_vm.hasPad))?_c("Scores",{tag:"div",attrs:{"players":_vm.playerList,"isPad":_vm.isPad,"scores":_vm.scores}}):_vm._e(),_vm._v(" "),_c('br'),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.isPad),expression:"isPad"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.isPad)?_vm._i(_vm.isPad,null)>-1:(_vm.isPad)},on:{"change":function($event){var $$a=_vm.isPad,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.isPad=$$a.concat([$$v]))}else{$$i>-1&&(_vm.isPad=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.isPad=$$c}}}}),_vm._v(" IsPad\n  "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.hasPad),expression:"hasPad"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.hasPad)?_vm._i(_vm.hasPad,null)>-1:(_vm.hasPad)},on:{"change":function($event){var $$a=_vm.hasPad,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.hasPad=$$a.concat([$$v]))}else{$$i>-1&&(_vm.hasPad=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.hasPad=$$c}}}}),_vm._v(" hasPad\n  "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.state),expression:"state"}],domProps:{"value":(_vm.state)},on:{"input":function($event){if($event.target.composing){ return; }_vm.state=$event.target.value}}}),_vm._v(" state\n\n  "),_vm._l((_vm.scores),function(score,index){return _c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.scores[index]),expression:"scores[index]"}],key:score,domProps:{"value":(_vm.scores[index])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.scores, index, $event.target.value)}}})}),_vm._v(" state\n")],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ var client_Test = (esExports);
// CONCATENATED MODULE: ./games/dixit/client/Test.vue
function injectStyle (ssrContext) {
  __webpack_require__("ZfNi")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-09d228da"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  Test,
  client_Test,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ var dixit_client_Test = __webpack_exports__["default"] = (Component.exports);


/***/ })

});
//# sourceMappingURL=5.46ef4f24d0adfc381737.js.map