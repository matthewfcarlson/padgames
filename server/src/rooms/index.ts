// This is handles the room system, player joining and leaving, the host and join endpoints
// TODO: should this handle player ID's as well?

import RoomManager from "./room_manager";
import express from "express";
import socketio from "socket.io";
import { RootLogger } from "../../../common/util/logger";
import { nextTick } from "q";


// Create the singleton global variable
const gRoomManager = new RoomManager();
// Gets the singleton room manager
// TODO: research typescript singleton pattern
function GetRoomManager(): RoomManager {
    return gRoomManager;
}

function RoomHostMiddleware(request: express.Request, response: express.Response, next: any) {
    RootLogger.info("Host");
    // First we create a game
    const isApi = request.path.startsWith("/api");
    RootLogger.info(request.params);
    // TODO figure out if the user can create this room (if they need to buy it)
    const newRoomID = GetRoomManager().CreateNewRoom(request.params["gameType"]);
    if (newRoomID == null) {
        // We weren't able to create a new room
        if (!isApi) {
            response.redirect("/host?error=1");
        } else {
            response.sendStatus(404);
        }
    }
    const url = "/join/" + newRoomID;
    // TODO: should we redirect directly to the game
    if (isApi) {
        response.json({"url": url}); 
    } else {
        response.redirect(url);
    }
}

function RoomJoinMiddleware(request: express.Request, response: express.Response, next: any) {
    RootLogger.info("Join");
    const roomID = request.params["roomId"];
    const isApi = request.path.startsWith("/api");
    const roomExists =  GetRoomManager().DoesRoomExist(roomID);
    
    if (roomExists) {
        const game = GetRoomManager().GetRoom(roomID);
        const url = GetRoomManager().GetRoomUrl(roomID);
        if (!isApi && url != null) {
            response.redirect(url);
        } else if (isApi) {
            response.json({url: url});
        } else {
            response.sendStatus(404);
        }
    } else {
        if (!isApi) {
            next();
        } else {
            response.sendStatus(404);
        }
    }
}

// This is the middleware that express uses to setup the
export function RoomManagerMiddleware(app: express.Express) {
    // setup the /join and /host options to do the appropiate things
    app.get("/host/:gameType", RoomHostMiddleware);
    app.get("/join/:roomId", RoomJoinMiddleware);

    // Also setup the api for those routes
    app.get("/api/host/:gameType", RoomHostMiddleware);
    app.get("/api/join/:roomId", RoomJoinMiddleware);
    // Also expose some testing endpoints if we are in dev mode?
    if (process.env.NODE_ENV !== "production") {
        app.get("/api/rooms", (req, res, next) => {
            const rooms = GetRoomManager().GetCurrentRooms();
            res.json(rooms);
        });
    }
}

/**
 * This setups the connections to handle players joining and leaving
 * @param io the socket io
 */
export function RoomManagerSocketware(io: socketio.Client) {
    // TODO implement
}