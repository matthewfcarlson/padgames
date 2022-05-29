export interface JwtUser {
    name: string,
    _id: number,
    temporary:boolean,
}

export interface RoomAdvert {
    players_connected: number,
    code:string,
    hosted_by:string, // the player that we're being hosted by
    public:boolean, // if the game is public or not
}
export enum RoomVisibility {
    FRIENDS_ONLY,
    PRIVATE,
    PUBLIC
}


export interface SocketUser {
    name: string,
    _id: number,
    socket_id: string,
    connected:boolean
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
export enum SocketEvents {
    CLIENT_ACTION = 'client_action',
    GAME_SYNC = 'game_sync',
    SERVER_MUTATION = 'server_mutation',
    JOIN_ROOM = 'JOIN_ROOM',
    LEAVE_ROOM = 'LEAVE_ROOM'
}