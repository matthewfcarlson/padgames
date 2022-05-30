// import { ActionSource, SocketUser } from "./store_types";

// export function ReplaceObject<V>(old: { [key: string]: V }, new_map: { [key: string]: V }) {
//     Object.keys(old).forEach((k) => {
//         // TODO: check if this appears in new_map? if so skip it
//         delete old[k];
//     });
//     Object.keys(new_map).forEach((k) => {
//         // TODO: check if this is reactive?
//         ReplaceObjectProperty(old, k, new_map[k]);
//     });
// }
// export function ReplaceObjectProperty<V>(object: any, key:string|number, value:V) {  
//     if (Vue != undefined) {
//         Vue.set(object, key, value);
//     }
//     else {
//         object[key] = value;
//     }
// }
// export function ReplaceArray<V>(old: V[], new_array: V[]) {
//     old.splice(0, old.length);
//     old.push(...new_array);
// }

// export class SyncedGameState {
//     isServer: boolean = false;
//     players: SocketUser[] = [];
// }

// export class SyncedGameGetters<S extends SyncedGameState> extends Getters<S> {
//     get isServer() {
//         return this.state.isServer;
//     }
//     get players() {
//         return this.state.players;
//     }
//     get stateHash() {
//         let hashstate:any = {};
//         const state = this.state;
//         Object.keys(this.state).sort().forEach((key:string)=> {
//             if (key.includes("Server")) return;
//             hashstate[key] = (state as any)[key];
//         }
//         );
//         const str = JSON.stringify(hashstate);
//         let h: number = 0;
//         for (var i = 0; i < str.length; i++) {
//             h = (31 * h + str.charCodeAt(i)) & 0xFFFFFFFF;
//         }
//         return h & 0xFFFFFFFF;
//     }

//     get hostPlayer(){
//         if (this.state.players.length == 0) return null;
//         return this.state.players[0];
//     }
// }

// export class SyncedGameMutations<S extends SyncedGameState>  extends Mutations<S> {
//     setIsServer(is_server:boolean) {
//         this.state.isServer = is_server;
//         return true;
//     }
//     setPlayers(new_players: SocketUser[]) {
//         this.state.players.splice(0, this.state.players.length);
//         this.state.players.push(...new_players);
//         return true;
//     }
//     addPlayer(new_player: SocketUser) {
//         this.state.players.forEach((x)=>{
//             if (x._id == new_player._id) x.socket_id = new_player.socket_id;
//         });
//         const existing_count = this.state.players.filter((x)=>x._id == new_player._id || x.socket_id == new_player.socket_id).length;
//         if (existing_count == 1) return true;
//         if (existing_count > 1) {
//             console.error("We already have this player", new_player);
//             return false;
//         } 
//         // TODO: check if player already exists
//         this.state.players.push(new_player);
//         return true;
//     }
//     removePlayer(old_player: SocketUser) {
//         while(true) {
//             const matching_player_index = this.state.players.findIndex((x)=>x._id == old_player._id || x.socket_id == old_player.socket_id);
//             if (matching_player_index == -1) break;
//             this.state.players.splice(matching_player_index, 1);
//         }
//         return true;
//     }
//     setPlayerConnected(player: SocketUser) {
//         const players = this.state.players;
//         players.forEach((x,index)=>{
//             if (x._id != player._id || (x.socket_id != '' && x.socket_id != player.socket_id)) return;
//             ReplaceObjectProperty(players[index], 'socket_id', (player.connected) ? player.socket_id : '');
//             ReplaceObjectProperty(players[index], 'connected', player.connected);
//         });
//         return true;
//     }
// }

// export class SyncedGameActions<S extends SyncedGameState, G extends SyncedGameGetters<S>, M extends SyncedGameMutations<S>> extends Actions<S, G, M> {
//     reset(source:ActionSource) {
//         throw new Error("Not implemented");
//     }
// }

// export type CommonModule = Module<SyncedGameState, SyncedGameGetters<SyncedGameState>, SyncedGameMutations<SyncedGameState>, SyncedGameActions<SyncedGameState,SyncedGameGetters<SyncedGameState>,SyncedGameMutations<SyncedGameState>>, {}>;

// export type CommonGameContext = Context<CommonModule>;