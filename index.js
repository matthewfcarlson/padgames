
var express = require("express");
var app = express();
const path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function (req,res){
    //res.send("<h1>Hello World</h1>");
    res.sendFile(__dirname + "/index.html");
});
app.use(express.static(path.join(__dirname, 'public')));

var gameList = [];

function GenerateWordList(){
    return ["test","test2","test3","test4"]
}

//generates the board
function GenerateBoardConfig(firstPlayer){
    return ["blue","red","blue","red"];
    //generate 1 death, neutral, and 7/8 blue and red
}

var boards = {};

io.on("connection", function(socket){
    console.log("a user connected");
    socket.emit("game list", gameList);
    socket.on("chat message",function(msg){
        io.emit("chat message", msg);
        //socket.emit("chat message")
        console.log("message: "+msg);
    });
    socket.on("create game", function (msg){   
        boards[msg] = {};     
        boards[msg].board = GenerateBoardConfig("red");
        boards[msg].words = GenerateWordList();
        io.emit('create game', msg);
        if (gameList.indexOf(msg) != -1) return;
        gameList.push(msg);       
        
    });
    socket.on("join game", function(msg){
        socket.join(msg);
        io.to(msg).emit("word list",boards[msg].words);
        io.to(msg).emit("game board",boards[msg].board);
    });
    
});
const port = process.env.PORT || 3000;
http.listen(port, function (){
    console.log("Listening on "+port);
});