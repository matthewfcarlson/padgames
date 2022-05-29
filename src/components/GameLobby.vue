<template>
  <div class="connected-users">
    <div class="lead">{{ players.length }} players</div>
    <div class="d-grid gap-2">
      <ul class="list-group">
        <li class="list-group-item d-flex align-items-center" v-for="user in players" v-bind:key="user._id">
          <span class="badge bg-danger rounded-pill" v-if="!user.connected"
            ><i class="fas fa-handshake-slash"></i
          ></span>
          <span class="badge bg-primary rounded-pill" v-else-if="hostPlayer != null && user._id == hostPlayer._id"
            ><i class="fas fa-crown"></i
          ></span>
          <span class="badge bg-success rounded-pill" v-else><i class="fas fa-user-check"></i></span>
          <span>&nbsp;</span>
          <h5 class="mb-1">{{ user.name }}</h5>
          <span v-if="user._id == currentUserId">(you)</span>
        </li>
      </ul>

      <button v-if="canStartGame" class="btn btn-block btn-outline-primary" @click="startGame" :disabled="!canStartGame">Start Game</button>
      <div v-else class="text-muted">Only the host can start the game</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator"
import { keeypMapper } from "@/store"
import { SocketUser } from "../../common/store_types"
@Component({
  computed: keeypMapper.mapGetters(["players", "hostPlayer"])
})
export default class ConnectedUsersList extends Vue {
  get connectedPlayerCount() {
    const players = (this as any).players as SocketUser[]
    return players.filter(x => x.connected).length
  }

  get currentUserId() {
    const user = this.$store.getters.currentSocketUser;
    if (user == null) return -1;
    return user._id;
  }

  get canStartGame() {
    if (this.connectedPlayerCount < 2 || this.connectedPlayerCount > 6) return false;
    const self = this as any;
    if (self.hostPlayer != null && this.currentUserId != self.hostPlayer._id ) {
      return false;
    }
    return true;
  }
  
  startGame() {
    // attempt to start the game
    if (!this.canStartGame) return false
    console.log("TODO: start game")
    this.$emit('start-game')
  }
}
</script>