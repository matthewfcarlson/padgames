var gameRoomRoot = "Dixit:";

function Init(socket, io) {
    socket.on(gameRoomRoot + "connect", function() {
        //lists all the games that are available
        socket.join(gameRoomRoot);
        socket.emit(gameRoomRoot+"connected");
    });
}

module.exports = {
    Init
};