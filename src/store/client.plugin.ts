import { ActionExtraPayload, ActionPacket, ActionPayload, ActionSource, isActionExtraPayload, isActionSource, MutationPacket, SocketEvents } from "../../common/store_types";
import { Store } from "vuex";
import _ from "lodash";

const serverMutationChain:MutationPacket[] = [];
const localMutationChain:MutationPacket[] = [];
let resync_requested = false;
import { GAME_NAME } from '../../common/keeyp2d_store';

export default function clientSideSocketPlugin(store: Store<any>) {
    store.subscribe(mutation => {
        if (mutation.type == SocketEvents.JOIN_ROOM || mutation.type == SocketEvents.LEAVE_ROOM) {
            // Clear our chains when the game resets
            console.log("Clearing mutation chains because game reset");
            if (serverMutationChain.length == 0 && localMutationChain.length == 0) return;
            const roomName = mutation.payload;
            // TODO: figure out the game name
            store.commit(GAME_NAME+"/setState");
            serverMutationChain.splice(0, serverMutationChain.length);
            localMutationChain.splice(0, localMutationChain.length);
            return;
        }
        const currentRoom = store.getters.currentRoom as string;
        if (currentRoom == null || currentRoom.length == 0) return;
        const currentGame = GAME_NAME;
        // We know we have a game
        if (mutation.type == SocketEvents.SERVER_MUTATION) {
            const packet = mutation.payload as MutationPacket;
            if (packet.type.endsWith("setState")) {
                console.log("Special set state packet");
                // reset both sets of mutation chains
                resync_requested = false;
                serverMutationChain.splice(0, serverMutationChain.length);
                localMutationChain.splice(0, localMutationChain.length);
            }
            serverMutationChain.push(packet);
            // Step 1: Check if we need to apply this packet, look in our local mutation chain to see if we've already done it
            let shouldApply = false;
            let outOfSync = false;
            console.log("Got server packet "+packet.type, serverMutationChain, localMutationChain);
            if (serverMutationChain.length > localMutationChain.length) shouldApply = true;
            if (!shouldApply) {
                // Scan ahead to see if we've already done this exact commit?
                const hash = store.getters[currentGame+'/stateHash'];
                console.log("Scan ahead to see if we've already applied this packet",hash,packet.resultHash);
                outOfSync = hash != packet.resultHash;

            }
            if (!outOfSync && shouldApply){
                console.log("server mutation", mutation, JSON.stringify(packet));
                store.commit(packet.type, packet.payload);
                // TODO: look at state hash afterwards
                const hash = store.getters[currentGame+'/stateHash'];
                console.log("StateHash", hash);
                if (hash != packet.resultHash) {
                    outOfSync = true;
                    console.error("Local hash = "+hash, packet.resultHash);
                }
            }
            if (outOfSync && serverMutationChain.length != 0 && serverMutationChain[0].type.endsWith("setState")) {
                console.log("Replaying server commits");
                localMutationChain.splice(0, serverMutationChain.length);
                serverMutationChain.forEach((x)=>{
                    store.commit(x.type, x.payload);
                });
                const current_hash = store.getters[currentGame+'/stateHash'];
                const last_hash = serverMutationChain[serverMutationChain.length - 1].resultHash;
                console.log("Replayed "+ current_hash+ " =?= "+last_hash);
                outOfSync = current_hash != last_hash;
            }
            if (outOfSync && !resync_requested) {
                // We're out of sync, request a reset
                resync_requested = true;
                console.error("We've becoming desynced");
                store.dispatch('requestGameSync');
            }
        }
        else if (mutation.type.startsWith(currentGame)){
            const hash = store.getters[currentGame+'/stateHash'];
            // we should log all other mutations 
            const packet: MutationPacket = {
                resultHash: _.clone(hash),
                type: mutation.type,
                payload: _.clone(mutation.payload)
            };
            localMutationChain.push(packet);
            console.log("local mutation", packet, hash);
        }
    })
    store.subscribeAction({
        after: (action, state) => {
            if (action.type.indexOf("/") == -1) return;
            // TODO: check to make sure it starts with the right name as our game
            let tweaked_payload = _.cloneDeep(action.payload) as ActionPayload|null;
            if (isActionSource(tweaked_payload)) {
                tweaked_payload = null;
            }
            if (isActionExtraPayload(tweaked_payload)) {
                (tweaked_payload as any).source  = null;
            }
            // tell the server that we've done a thing
            const packet:ActionPacket = {
                payload: tweaked_payload,
                type: action.type
            }
            console.debug("Emitting to server", packet);
            store.dispatch('emit', [SocketEvents.CLIENT_ACTION, packet]);
        }
    }, { prepend: true });
}