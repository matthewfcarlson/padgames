const ROOT = "Gameshow:";
const data = require("../common/data");
var teams = {};
var questions = [];
var teamsThatHaveGuessed = [];
var currentTeamTurn = "";

function SetupQuestions() {
    console.log("Setting up questions");
    for (var i = 0; i < data.questions.length; i++) {
        questions.push({
            id: i,
            answer: 5,
            person: "Murray",
        });
    }
}

function SyncTeams(io) {
    io.emit(ROOT + "teams", Object.values(teams));
}

function SyncQuestion(io) {
    if (questions.length == 0) {
        io.emit(ROOT + "question", {
            id: -2, //game over
            answer: -1,
            person: "",
        });
    } else {
        io.emit(ROOT + "question", questions[0]);
    }
}

function SyncTeamTurn(io) {
    io.emit(ROOT + "team turn", currentTeamTurn);
}

function SyncAll(io) {
    SyncQuestion(io);
    SyncTeamTurn(io);
    SyncTeams(io);
}
//setup questions
SetupQuestions();

function Init(socket, io) {
    socket.on(ROOT + "add team", function (teamName) {
        if (teams[teamName] == undefined) {
            teams[teamName] = {
                name: teamName,
                score: 0,
                sockets: []
            };
        }
        SyncTeamTurn(io.to(ROOT));
        SyncTeams(io.to(ROOT));
    });
    socket.on(ROOT + "correct", function (id) {
        //next question
        //give the correct answer to the right team
        currentTeamTurn = "";
        //get rid of the first question
        questions.shift();
        SyncQuestion(io.to(ROOT));
        SyncTeams(io.to(ROOT));
    });
    socket.on(ROOT + "incorrect", function (id) {
        currentTeamTurn = "";
        SyncTeamTurn(io.to(ROOT));
    });
    socket.on(ROOT + "connect", function () {
        //lists all the games that are available
        socket.join(ROOT);
        socket.emit(ROOT + "connect");
        SyncAll(socket);
    });
    socket.on(ROOT + "buzz", function (team) {
        console.log("BUZZ IN", team);
        if (teams[team] == undefined) return;
        if (teamsThatHaveGuessed.indexOf(team) != -1) return;
        if (currentTeamTurn == "" || team == "") currentTeamTurn = team;
        if (currentTeamTurn != "") teamsThatHaveGuessed.push(team);
        SyncTeamTurn(io.to(ROOT));
    });
    socket.on(ROOT + "super buzz", function (team) {
        console.log("SUPER BUZZ IN", team);
        if (teams[team] == undefined) return;
        currentTeamTurn = team;
        SyncTeamTurn(io.to(ROOT));
    });
    socket.on(ROOT + "reset", function () {
        //lists all the games that are available
        teams = {};
        teamsThatHaveGuessed = [];
        currentTeamTurn = "";
        SetupQuestions();
        SyncAll(io.to(ROOT));
    });
    socket.on(ROOT + "pick team", function (teamName) {
        if (teams[teamName] == undefined) return;
        if (teams[teamName] != undefined) {
            if (teams[teamName].sockets.indexOf(socket.id) == -1) teams[teamName].sockets.push(socket.id);
        }
        SyncTeams(io.to(ROOT));

    });
}

module.exports = {
    Init
};