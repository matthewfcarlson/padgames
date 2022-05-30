import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import fs from 'fs';
import { GetDB } from "./db";
import WebSocketController from './controllers/socket';
import AuthController from './controllers/auth';
import RoomController from './controllers/rooms';

const cookieParser = require('cookie-parser')

dotenv.config();

// configure the app and folder locations
const app = express();
const prod_client_folder = path.join(__dirname, '..', '..', 'client');
const dev_client_folder = path.join(__dirname, '..', 'dist', 'client');
const client_folder = (fs.existsSync(prod_client_folder)) ? prod_client_folder : dev_client_folder;
console.log("Serving the client folder %s", client_folder)
if (!fs.existsSync(client_folder)) console.error("Folder does not exist")

// Reset the database every time we start the database
const db = GetDB();
db.connect();

// Setup middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup to make sure HTTPS is happening
app.use((req, res, next) => {
  if (process.env.NODE_ENV != 'production') return next();
  //if (req.headers['x-forwarded-proto'] !== 'https') return res.redirect('https://' + req.headers.host + req.url);
  else return next();
});

app.set("port", process.env.PORT || 3000);

// Serve static content
const server = http.createServer(app);
WebSocketController(server, db);
AuthController(app, db);
RoomController(app, db);
app.use(express.static(client_folder));

app.get("/api/*", (req,res)=>{
  res.status(404).send("NOT FOUND");
})
app.post("/api/*", (req,res)=>{
  res.status(404).send("NOT FOUND");
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(client_folder, 'index.html'));
});


server.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});
const env = process.env.NODE_ENV || 'development';
if (env === "development") {
  let exiting = false;
  process.on('exit', function () {
    if (exiting) return;
    exiting = true;
    console.log('About to exit, waiting for remaining connections to complete');
    // Write the database to file
    db.serialize();
    //server.close();
  });
  process.on('SIGINT', function () {
    if (exiting) return;
    exiting = true;
    console.log('SIGINT: About to exit, waiting for remaining connections to complete');
    // Write the database to file
    db.serialize();
    process.exit(0);
    //server.close();
  })
  process.on('SIGTERM', function () {
    if (exiting) return;
    exiting = true;
    console.log('SIGTERM: About to exit, waiting for remaining connections to complete');
    // Write the database to file
    db.serialize();
    //server.close();
  })
}

export default app;