import { defineStore } from 'pinia';
import axios from "axios";
import { decode as JwtDecode } from 'jsonwebtoken-esm';
import { Group, JwtUser, RoomAdvert, RoomVisibility, SocketEvents, SocketUser } from '../../common/store_types';
import { ApiEndpointRoot, ApiEndpoints } from '../../common/endpoints';

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

function checkCookie() {
    try {
        const cookie = getCookie('token');
        const raw_results = JwtDecode(cookie);
        const user = raw_results as JwtUser;
        // TODO: check if we this is a valid JwtUser
        if (user != null) {
            return user;
        }
    }
    catch (e) {
        console.error(e);
    }
    return null;
}

export const useAuthStore = defineStore('auth', {
    state: () => {
        let jwtUser = checkCookie();
        return {
            currentUser: jwtUser,
            currentRoom: "",
        }
    },
    getters: {
        userId(state) {
            if (state.currentUser == null) return null;
            return state.currentUser._id;
        },
        userName(state) {
            if (state.currentUser == null) return '';
            return state.currentUser.name;
        },
    
        loggedIn(state) {
            return state.currentUser != null;
        },
    
        isUserTemporary(): boolean {
            if (!this.loggedIn) return false;
            if (this.currentUser && this.currentUser.temporary) return true;
            return false;
        },
    
        currentSocketUser(): SocketUser | null {
            if (this.loggedIn == false || this.userName == null || this.userId == null) return null;
            return {
                name: this.userName,
                _id: this.userId,
                socket_id: '',
                connected: true,
            }
        }
    },
    actions: {
        async attemptTemporaryLogin() {
            try {
                const response = await http.post(ApiEndpoints.LOGIN_TEMP);
                this.checkLogin();
                return response.status == 200 && this.loggedIn;
            }
            catch (e) {
                console.error(e);
            }
            return false;
        },

        checkLogin() {
            const user = checkCookie();
            if (user == null) return;
            this.currentUser = user;
        },

        async makeFriend(email:string) {
            try {
                const response = await http.post(ApiEndpoints.MAKE_FRIEND, {email});
                return response.data;
            }
            catch { }
            return false;
        },

        async getVisibleRooms(): Promise<RoomAdvert[]> {
            try {
                const response = await http.get(ApiEndpoints.REQUEST_VISIBLE_ROOMS);
                return response.data;
            }
            catch { }
            return [];
        },
    
        async createRoom(visibility: RoomVisibility): Promise<RoomAdvert|null> {
            try {
                const response = await http.post(ApiEndpoints.CREATE_ROOM, {visibility});
                return response.data;
            }
            catch { }
            return null;
        },
    
        async joinRoom(code:string) {
            try {
                this.emit([SocketEvents.JOIN_ROOM, code]);
                return;
            }
            catch { }
            return;
        },

        emit(event: SocketEvents|[SocketEvents,any]) {
            console.log("Emitting socket", event);
        },
    
        async leaveRoom(): Promise<boolean> {
            try {
                if (this.currentRoom == '') return false;
                this.emit(SocketEvents.LEAVE_ROOM);
                return true;
            }
            catch { }
            return false;
        },

        async attemptLogin(email:string) {
            try {
                const params = { email };
                const response = await http.post(ApiEndpoints.LOGIN, params);
                this.checkLogin();
                // we return true if the server does, we might need to specify the user needs to check their email
                return response.status == 200;
            }
            catch (e) {
                console.error(e);
            }
            return false;
        }
    }
})