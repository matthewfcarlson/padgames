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
const contentsDir = path.join(__dirname, "../dist_client");
const staticFileMiddleware = express.static(contentsDir);
app.get("/", (req, res) => {
    res.sendFile(path.join(contentsDir, "index.html"));
  });
app.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(contentsDir, "public/robots.txt"));
  });
// use static middleware to resolve files
app.use(staticFileMiddleware);
app.use(
    history({
        index: '/app.html',
        verbose: true
    })
);
app.use(staticFileMiddleware);

httpServer.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log("Listening on " + port);
});

io.on("connection", (clientSocket) => {
    // tslint:disable-next-line:no-console
    console.log("New connection from " + clientSocket.id);
});


