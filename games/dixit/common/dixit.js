var Random = require("random-js");
//figure out if we are server side?
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function CreateGame(gameName, proxyCallback) {

    var default_game = { //python style
        _gameName: gameName || "DEFAULT",
        _players: [],
        _padViewers:0,
        _judge: -1,
        _points: [],
        _imagesSelected: [],
        _votes: [],
        _round: 0,
        _mt: null,
        _lastCommandTime: 0,
        _timeOut: -1
    };
    
    if (proxyCallback == undefined) {
        proxyCallback = function (name, ...args) {
            console.log(name + " was called with " + args);
        };
    }

    function ConvertFunction(context, func) {
        return function (...recievedArgs) {
            proxyCallback(func.name, recievedArgs);
            return func.apply(context, recievedArgs);
        }
    }

    default_game.replicated = {};
    for (var key in default_game) {

        if (isFunction(default_game[key])) {
            var hiddenFunc = default_game[key];
            default_game.replicated[key] = ConvertFunction(default_game, hiddenFunc);
        }
    }
    return default_game;

}

module.exports = {
    CreateGame
}