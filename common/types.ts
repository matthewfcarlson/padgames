export interface JwtUser {
    name: string,
    _id: number,
    isHost: boolean,
    isSpectator:boolean,
    groupId: number
}

export interface SocketUser {
    name: string,
    _id: number,
    socket_id: string,
    isHost: boolean,
    isSpectator:boolean,
}
export type ActionSource = SocketUser; // TODO: eventually add the server as a source of actions

export function isActionSource(arg: any): arg is ActionSource {
    if (arg == null) return false;
    return arg.name !== undefined && arg._id !== undefined && arg.socket_id !== undefined;
}
export interface Group {
    name: string,
    _id: number,
    active: boolean,
}

export interface ActionPacket {
    type: string;
    payload: any;
}

export type ActionExtraPayload = {source:ActionSource};

export type ActionPayload = ActionSource | ActionExtraPayload;

export function isActionExtraPayload(arg: any): arg is ActionExtraPayload {
    if (arg == null) return false;
    if (arg.source === undefined) return false;
    return arg.source === null || isActionSource(arg.source);
}

export interface MutationPacket extends ActionPacket {
    resultHash: number;
}

export interface User {
    name: string,
    _id: number,
    admin: boolean,
    password: boolean,
    loggedIn: boolean,
}

export enum SocketEvents {
    CLIENT_ACTION = 'client_action',
    SET_GAME = 'set_game',
    GAME_SYNC = 'game_sync',
    SERVER_MUTATION = 'server_mutation',
}

export const GameTypes = [
]