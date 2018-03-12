var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req,res){
    //res.send("<h1>Hello World</h1>");
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
    console.log("a user connected");
    socket.on("chat message",function(msg){
        io.emit("chat message", msg);
        //socket.emit("chat message")
        console.log("message: "+msg);
    })
});

http.listen(3000, function (){
    console.log("Listening on 3000");
});