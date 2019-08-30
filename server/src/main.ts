import dotenv from "dotenv";
import express from "express";
import path from "path";
import http from "http";
import socket from 'socket.io';
import history from "connect-history-api-fallback";
const app = express();
const httpServer = new http.Server(app);
const io = socket(httpServer);

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT || 3000;

app.use(
    history({
        disableDotRule: true,
        verbose: true
    })
);
app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist_client/index.html"));
});

// Handle requests for static assets
app.use("/static", express.static(path.join(__dirname, "../dist_client/static")));

httpServer.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log("Listening on " + port);
});

io.on("connection", (clientSocket) => {
    // tslint:disable-next-line:no-console
    console.log("New connection from " + clientSocket.id);
});


