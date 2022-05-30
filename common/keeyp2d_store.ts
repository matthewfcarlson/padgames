// import { TileData, PlacedTileData, GenerateTiles, PlacedTileGrid, PlacementGrid } from "./keeyp2d_data";
// import { ActionPayload, ActionSource, SocketUser } from './store_types';
// import _ from "lodash";
// import Vue from 'vue';
// import { ReplaceArray, ReplaceObject, ReplaceObjectProperty, SyncedGameActions, SyncedGameGetters, SyncedGameMutations, SyncedGameState } from './common_store';

// export const GAME_NAME = 'keeyp2'

// export enum KeeypPhase {
//     LOBBY,
//     TUTORIAL,
//     CHARACTER_SELECT,
//     PLAYING,
//     END_GAME
// }

// type UserInventoryItem = string;
// type UserId = number;
// type CharacterId = number;
// export class KeeypStoreState extends SyncedGameState {
//     phase: KeeypPhase = KeeypPhase.LOBBY;
//     player_inventory: { [k: UserId]: UserInventoryItem } = {};
//     player_characters: { [k: UserId]: CharacterId } = {};
//     grid: PlacedTileGrid = {grid:[],size:0};
// }

// class KeeypStoreGetters extends SyncedGameGetters<KeeypStoreState> {
//     get playerCharacters() {
//         return this.state.player_characters;
//     }

//     get allPlayersSelectedCharacters() {
//         // First check that all the players have selected a character
//         const players = this.state.players;
//         const player_characters = this.state.player_characters;
//         const player_character_selected = players.map(x => player_characters.hasOwnProperty(x._id)).every(x=>x);
//         if (!player_character_selected) return false;
//         // Second check to make sure that all the players have unique characters
//         const characters = [];
//         const character_set = new Set();
//         players.forEach(x => {
//             characters.push(player_characters[x._id]);
//             character_set.add(player_characters[x._id]);
//         });
//         if (characters.length != players.length) return false;
//         if (character_set.size != players.length) return false;
//         return true;
//     }

//     get boardView() {
//         const data = this.state;
//         const tile_data = GenerateTiles();
//         const tiles = data.grid.grid.map((x)=>tile_data[x.tile_index]);
//         return {
//             grid_size:data.grid.size,
//             tiles: tiles,
//         }
//     }
// }

// class KeeypStoreMutations extends SyncedGameMutations<KeeypStoreState> {
//     setState(new_potential_state: KeeypStoreState | null) {
//         // if we pass in null, then create a new state
//         const new_state: KeeypStoreState = (new_potential_state == null) ?
//             {
//                 players: [],
//                 isServer: false,
//                 phase: KeeypPhase.LOBBY,
//                 player_inventory: {},
//                 grid: {grid:[], size: 0},
//                 player_characters: {},
//             } : new_potential_state;
//         // Add the players
//         ReplaceArray(this.state.players, new_state.players);
//         // Sets the state to something new
//         this.state.phase = new_state.phase;
//         ReplaceObject(this.state.player_inventory, new_state.player_inventory);

//         ReplaceObject(this.state.player_characters, new_state.player_characters);

//         ReplaceArray(this.state.grid.grid, new_state.grid.grid);
//         this.state.grid.size = new_state.grid.size;

//         // // reset the player symbols
//         // ReplaceObject(this.state.player_symbols, new_state.player_symbols);

//         // // reset the player buttons
//         // ReplaceObject(this.state.player_buttons, new_state.player_buttons);

//         // // reset the player matched
//         // ReplaceObject(this.state.player_matched, new_state.player_matched);

//         // // Replace the leaderboard
//         // ReplaceArray(this.state.leaderboard, new_state.leaderboard);

//         return true;
//     }

//     advancePhase(new_phase: KeeypPhase) {
//         const data = this.state;
//         // check to make sure we're not going to an invalid state
//         if (data.phase == KeeypPhase.LOBBY && new_phase != KeeypPhase.CHARACTER_SELECT) return false;
//         if (data.phase == KeeypPhase.CHARACTER_SELECT && new_phase != KeeypPhase.PLAYING) return false;
//         if (data.phase == KeeypPhase.PLAYING && new_phase != KeeypPhase.END_GAME) return false;
//         data.phase = new_phase;
//         return true;
//     }

//     setGrid(new_grid:PlacedTileGrid) {
//         const data = this.state;
//         data.grid.size = new_grid.size;
//         ReplaceArray(data.grid.grid, new_grid.grid);
//     }

//     setCharacter(payload: {user_id:number, character:number}): boolean {
//         const data = this.state;
//         // TODO: check if this player is in the game
//         ReplaceObjectProperty(data.player_characters, payload.user_id, payload.character);
//         return true;
//     }
// }

// class KeeypStoreActions extends SyncedGameActions<KeeypStoreState,
//     KeeypStoreGetters,
//     KeeypStoreMutations> {
//     // All payloads must be an actionsource or have actionsource as source
//     // All actions take a source: a socketuser or server
//     // The server 

//     reset(source:ActionSource) {
//         this.mutations.setState(null);
//         return true;
//     }

//     startGame(source: ActionSource) {
//         const data = this.state;
//         if (data.phase != KeeypPhase.LOBBY) return false;
//         const host = this.getters.hostPlayer;
//         if (host == null) return false;
//         if (source._id != host._id) return false;
//         this.mutations.advancePhase(KeeypPhase.CHARACTER_SELECT);
//         return true;
//     }

//     selectCharacter(payload:{source:ActionSource, character:number}){
//         const data = this.state;
//         if (data.phase != KeeypPhase.CHARACTER_SELECT) return false;
//         this.mutations.setCharacter({user_id:payload.source._id, character:payload.character});
//         const characters_selected = this.getters.allPlayersSelectedCharacters;
//         if (!characters_selected) return;
//         if (this.getters.isServer) {
//             // Generate the grid
//             // TODO: put this into an option that the host can set
//             const grid_size = 5 + (this.getters.players.length /2); // 2 = 6, 4 = 7, 6=8
//             const grid_gen = new PlacementGrid({size:grid_size, enemies:0});
//             let attempts = 0;
//             while(!grid_gen.isWinnable && attempts < 5) {
//                 grid_gen.placeGrid();
//                 attempts+= 1;
//             } 
//             const new_grid = grid_gen.convertToPlacedGrid();
//             if (new_grid != null) this.mutations.setGrid(new_grid);
//             else console.error("Could not generate grid");
//         }
//         this.mutations.advancePhase(KeeypPhase.PLAYING);
//     }

// }


// export const KeeypStoreModule = new Module({
//     state: KeeypStoreState,
//     getters: KeeypStoreGetters,
//     mutations: KeeypStoreMutations,
//     actions: KeeypStoreActions
// });

// export type KeeypContext = Context<Module<KeeypStoreState, KeeypStoreGetters, KeeypStoreMutations, KeeypStoreActions, {}>>;

