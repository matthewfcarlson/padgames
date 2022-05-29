import axios from "axios";
import { decode as JwtDecode } from 'jsonwebtoken';
import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'
import { Group, JwtUser, RoomAdvert, RoomVisibility, SocketEvents, SocketUser } from '../../common/store_types';
import { ApiEndpointRoot, ApiEndpoints } from '../../common/endpoints';
import { Store } from "vuex";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

let SOCKET: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

const http = axios.create({
    baseURL: ApiEndpointRoot,
    headers: { 'Content-Type': 'application/json' }
});

// Helper function to retrieve a cookie
function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// State
export class MainStoreState {
    jwtCookie = ""
    currentUser: JwtUser|null = null
    currentRoom = ""
}

class MainStoreGetters extends Getters<MainStoreState> {

    get userId() {
        if (this.state.currentUser == null) return null;
        return this.state.currentUser._id;
    }

    get userName() {
        if (this.state.currentUser == null) return '';
        return this.state.currentUser.name;
    }

    get loggedIn() {
        return this.state.currentUser != null;
    }

    get isUserTemporary() {
        return this.getters.loggedIn && this.state.currentUser?.temporary;
    }

    get currentRoom() {
        return this.state.currentRoom;
    }

    get currentSocketUser(): SocketUser | null {
        if (this.getters.loggedIn == false || this.getters.userName == null || this.getters.userId == null) return null;
        return {
            name: this.getters.userName,
            _id: this.getters.userId,
            socket_id: '',
            connected: true,
        }
    }
}

// Mutations
// Extend 'Mutations' class with 'MainStoreState' type
class MainStoreMutations extends Mutations<MainStoreState> {
    login(user: JwtUser|null) {
        this.state.currentUser = user;
    }
    setJwtCookie(cookie: string) {
        this.state.jwtCookie = cookie;
    }
    setRoom(game: string) {
        this.state.currentRoom = game;
    }
    server_mutation(data: any) {
        // the plugin will grab this
        return true;
    }
    logout() {
        this.state.currentUser = null;
        console.log("Logging out");
        // close the socket
        if (SOCKET != null) {
            SOCKET.close();
        }
        SOCKET = null;
    }
}

class MainStoreActions extends Actions<
    MainStoreState,
    MainStoreGetters,
    MainStoreMutations,
    MainStoreActions
> {
    // Called after the module is initialized
    $init(store: Store<any>): void {
        this.actions.checkLogin();
    }

    checkLogin() {
        const state = this.state;
        if (this.getters.loggedIn) return;
        this.mutations.login(null);
        try {
            const cookie = getCookie('token');
            const raw_results = JwtDecode(cookie);
            const user = raw_results as JwtUser;
            if (user != null) {
                this.mutations.setJwtCookie(cookie);
                this.mutations.login(user);
            }
        }
        // Connect websocket
        catch (e) {
            console.error(e);
        }

        // Connect 
        if (this.getters.loggedIn && SOCKET == null) {
            SOCKET = io({
                auth: {
                    token: this.state.jwtCookie,
                }
            });
            const self = this;
            SOCKET.on(SocketEvents.JOIN_ROOM, (item: unknown) => {
                if (typeof (item) != "string") return;
                const room = item;
                if (room == '' && self.state.currentRoom != '') {
                    // go to a location?
                    console.log("refreshing the page to clear state", room, self.state.currentRoom);
                    window.location.reload();
                }
                if (room != '' && self.state.currentRoom == '') {
                    console.log("We need to redirect the user to the right page");
                }
                self.mutations.setRoom(room);
            });
            SOCKET.on(SocketEvents.LEAVE_ROOM, (items: any[]) => {
                self.mutations.setRoom('');
            });
            SOCKET.on(SocketEvents.SERVER_MUTATION, (items: any[]) => {
                self.mutations.server_mutation(items);
            });
            SOCKET.on('reconnect', () => {
                self.actions.requestGameSync();
            })
        }
    }

    async getVisibleRooms(): Promise<RoomAdvert[]> {
        //localhost:3000/api/brick-count?group=1
        try {
            const response = await http.get(ApiEndpoints.REQUEST_VISIBLE_ROOMS);
            return response.data;
        }
        catch { }
        return [];
    }

    async createRoom(): Promise<RoomAdvert|null> {
        try {
            const visibility = RoomVisibility.PUBLIC;
            const response = await http.post(ApiEndpoints.CREATE_ROOM, {visibility});
            return response.data;
        }
        catch { }
        return null;
    }

    async joinRoom(code:string): Promise<null> {
        try {
            this.actions.emit([SocketEvents.JOIN_ROOM, code]);
            return null;
        }
        catch { }
        return null;
    }

    async leaveRoom(): Promise<boolean> {
        try {
            if (this.state.currentRoom == '') return false;
            this.actions.emit(SocketEvents.LEAVE_ROOM);
            return true;
        }
        catch { }
        return false;
    }

    async requestGameSync() {
        this.actions.emit(SocketEvents.GAME_SYNC);
    }

    async emit(message: string | [string, any]) {
        if (SOCKET == null) {
            console.error("Socket isn't initialized, dropping message", message);
            return;
        }
        if (typeof (message) == 'string') {
            SOCKET.emit(message);
            return;
        }
        const [type, items] = message;
        SOCKET.emit(type, items);
    }

    async attemptLogin(email:string) {
        try {
            const params = { email };
            const response = await http.post(ApiEndpoints.LOGIN, params);
            this.actions.checkLogin();
            // we return true if the server does
            return response.status == 200;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async attemptTemporaryLogin() {
        try {
            const response = await http.post(ApiEndpoints.LOGIN_TEMP);
            this.actions.checkLogin();
            return response.status == 200 && this.getters.loggedIn;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
}

export const mainModule = new Module({
    namespaced: false,
    state: MainStoreState,
    getters: MainStoreGetters,
    mutations: MainStoreMutations,
    actions: MainStoreActions
});