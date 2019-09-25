import dotenv from "dotenv";
import express from "express";
import path from "path";
import http from "http";
import socket from 'socket.io';
import history from "connect-history-api-fallback";
import AuthorizationSetup from "./authentication/auth";
const app = express();
const httpServer = new http.Server(app);
const io = socket(httpServer);

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT ||  process.env.PORT || 3000;
const contentsDir = path.join(__dirname, "../../../dist_client");
const serverAssetsDir = path.join(__dirname, "../../../server/assets"); // TODO have webpack handle this?
const staticFileMiddleware = express.static(contentsDir);

// map robots to the public folder
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

// Make sure we parse the body
app.use(express.urlencoded({ extended: true }));

// Setup authentication
AuthorizationSetup(app);

app.use((req, res) => {
    res.status(404).sendFile(path.join(serverAssetsDir, "404.html"));
});

app.use((err, res, next) => {
    console.error(err.statusMessage);
    res.status(500).send('Something broke!');
});

httpServer.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log("Listening on " + port);
});

io.on("connection", (clientSocket) => {
    // tslint:disable-next-line:no-console
    console.log("New connection from " + clientSocket.id);
});


