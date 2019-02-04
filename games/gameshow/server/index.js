const ROOT = "Gameshow:";
const data = require("../common/data");
var teams = {};
var questions = [];
var teamsThatHaveGuessed = [];
var currentTeamTurn = "";
const skipPoint = Object.keys(data.answers).length - 1;

//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function SetupQuestions() {
    console.log("Setting up questions");
    questions = [];
    for (var person in data.answers) {
        for (var i = 0; i < data.questions.length; i++) {
            questions.push({
                id: i,
                person: person,
            });
        }
    }
    shuffle(questions);
}

function SyncTeams(io) {
    io.emit(ROOT + "teams", Object.values(teams));
}

function SyncQuestion(io) {
    if (questions.length == 0) {
        io.emit(ROOT + "question", {
            id: -2, //game over
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

function NextQuestion() {
    teamsThatHaveGuessed = [];
    questions.shift();
    currentTeamTurn = "";
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
        SyncTeams(io.to(ROOT));
    });
    socket.on(ROOT + "correct", function (id) {
        //next question
        if (currentTeamTurn == "") return;
        if (questions.length == 0) return;
        if (questions[0].id != id) {
            console.log("Invalid ID");
            return;
        }
        console.log("Correct " + id);
        //give the correct answer to the right team
        teams[currentTeamTurn].score++;

        //get rid of the first question
        NextQuestion();
        SyncAll(io.to(ROOT));
    });
    socket.on(ROOT + "incorrect", function (id) {
        if (currentTeamTurn == "") return;
        if (questions.length == 0) return;
        //Check if we are on the right question
        if (questions[0].id != id) return;
        currentTeamTurn = "";
        //skip to the next question
        if (teamsThatHaveGuessed.length >= skipPoint) {
            NextQuestion();
            SyncQuestion(io.to(ROOT));
        }
        SyncTeamTurn(io.to(ROOT));
    });
    socket.on(ROOT + "connect", function () {
        //lists all the games that are available
        socket.join(ROOT);
        socket.emit(ROOT + "connect");
        SyncAll(socket);
    });
    socket.on(ROOT + "buzz", function (team) {
        //console.log("BUZZ IN", team);
        if (teams[team] == undefined && team != "") return;
        if (teamsThatHaveGuessed.indexOf(team) != -1) return;
        if (currentTeamTurn == "" || team == "") currentTeamTurn = team;
        if (currentTeamTurn != "") teamsThatHaveGuessed.push(team);
        SyncTeamTurn(io.to(ROOT));
    });
    socket.on(ROOT + "super buzz", function (team) {
        //console.log("SUPER BUZZ IN", team);
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