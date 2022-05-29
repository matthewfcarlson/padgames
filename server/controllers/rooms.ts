import { Server, Socket } from "socket.io";
import { Express } from "express";
// import { MatchupPhase, MatchupStoreModule, MatchupStoreState } from "../../common/matchup_store";
// import { SloganStoreModule } from "../../common/slogan_store";
import { ActionPacket, ActionSource, isActionExtraPayload, isActionSource, JwtUser, MutationPacket, RoomVisibility, SocketEvents, SocketUser } from "../../common/store_types";

import { DataBase } from "../db/db_types";
import { DecodeJwtToken } from "./auth";
import http from "http";
import { createStore } from "../store/store";
import { CommonGameContext, CommonModule, SyncedGameActions, SyncedGameGetters, SyncedGameMutations, SyncedGameState } from "../../common/common_store";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GAME_NAME } from '../../common/keeyp2d_store';
import { createRoom, requestVisibleGames } from "../db/room_manager";
import { ApiEndpointRoot, ApiEndpoints } from "../../common/endpoints";

export default function RegisterEndPoints(app: Express, db: DataBase) {

    app.get(ApiEndpointRoot + ApiEndpoints.REQUEST_VISIBLE_ROOMS, async (req, res) => {
        const user = res.locals.user;
        if (user == null || user == undefined) {
            res.status(402).send("Not logged in");
            return;
        }
        const jwtuser = user as JwtUser;
        const rooms = requestVisibleGames(jwtuser);
        res.json(rooms);
    });
    app.post(ApiEndpointRoot + ApiEndpoints.CREATE_ROOM, async (req, res) => {
        const user = res.locals.user;
        if (user == null || user == undefined) {
            res.status(402).send("Not logged in");
            return;
        }
        const jwtuser = user as JwtUser;
        // TODO: get the number of 
        const room = createRoom(jwtuser, RoomVisibility.PUBLIC);
        res.json(room);
    });
}