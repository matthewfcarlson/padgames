import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import fs from 'fs';

const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();
const prod_client_folder = path.join(__dirname, '..', '..', 'client');
const dev_client_folder = path.join(__dirname, '..', 'dist', 'client');
const client_folder = (fs.existsSync(prod_client_folder)) ? prod_client_folder : dev_client_folder;

// Setup login middleware
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
//AuthController(app, db);
app.use(express.static(client_folder));
//ApiController(app, db);


app.get('*', (req, res) => {
  res.sendFile(path.resolve(client_folder, 'index.html'));
});

const server = http.createServer(app);
//WebSocketController(server, db);

server.listen(app.get("port"), () => {
  console.log(
    "App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});


export default app;