// This is handles the room system, player joining and leaving, the host and join endpoints
// TODO: should this handle player ID's as well?

import RoomManager from "./room_manager";
import express from "express";
import socketio from "socket.io";


// Create the singleton global variable
const gRoomManager = new RoomManager();
// Gets the singleton room manager
// TODO: research typescript singleton pattern
export function GetRoomManager(): RoomManager {
    return gRoomManager;
}

// This is the middleware that express uses to setup the 
export function RoomManagerMiddleware(handler: express.RequestHandler) {
    // setup the /join and /host options to do the appropoate things

    // Also expose some testing endpoints if we are in dev mode?
}

/**
 * This setups the connections to handle players joining and leaving
 * @param io the socket io
 */
export function RoomManageerSocketware(io:socketio.Client) {

}