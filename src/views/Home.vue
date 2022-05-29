<template>
  <div class="404">
    <nav-bar />
    <div class="container">
      <h2>Friends list:</h2>
      <div>TODO</div>
      <hr />
      <h2>Games</h2>
      <div>
        <div class="text-center text-muted lead" v-if="rooms.length == 0">No games just yet, create one?</div>
        <ol class="list-group">
          <li
            class="list-group-item d-flex justify-content-between list-group-item-action align-items-start"
            @click="joinGame(room.code)"
            v-for="room in rooms"
            :key="room.code"
          >
            <div class="ms-2 me-auto">
              <div class="fw-bold">{{ room.code }}</div>
              Hosted by {{ room.hosted_by }}
            </div>
            <span class="badge bg-primary rounded-pill">{{ room.players_connected }}</span>
          </li>
        </ol>
      </div>
      <hr />
      <h2>Create game</h2>
      <div>
        <button class="btn btn-large btn-primary" @click="createGame" :disabled="thinking || isUserTemporary">Create Game</button>
        <p class="text-muted" v-if="isUserTemporary">Temporary accounts cannot create game rooms</p>
      </div>
      <br />
      <div class="text-muted">
        For the time being all games are public since the friend system isn't implemented yet
      </div>
      <hr />
      <div><a href="/old">Old testing version</a></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import NavBar from "@/components/NavBar.vue"
import { storeMapper } from "@/store"
import { mapGetters } from "vuex"
import { RoomAdvert, RoomVisibility } from "../../common/store_types"
import { ReplaceArray } from "../../common/common_store"

interface Data {
  timeout: number
  timer: number | null
  visibility: RoomVisibility
  rooms: RoomAdvert[]
  thinking: boolean
}
@Component({
  components: {
    NavBar
  },
  computed: storeMapper.mapGetters(["currentRoom", "isUserTemporary"])
})
export default class Home extends Vue {
  data(): Data {
    return {
      timeout: 1000,
      visibility: RoomVisibility.PUBLIC,
      timer: null,
      rooms: [],
      thinking: false
    }
  }

  async createGame() {
    const data = this as any as Data
    if (data.thinking) return
    data.thinking = true
    let result = await this.$store.dispatch("createRoom", data.visibility)
    console.log(result)
    data.thinking = false
    if (result != null) {
      console.log("Got back ", result)
      data.rooms.push(result)
      this.joinGame(result.code)
    }
  }

  async joinGame(code: string) {
    const data = this as any as Data
    if (data.thinking) return
    data.thinking = true;
    let result = await this.$store.dispatch("joinRoom", code)
    data.thinking = false;
  }

  async timerFire() {
    const data = this as any as Data
    // we need to start the timer if it doesn't already exist
    data.timer = null
    this.startTimer()
    this.refresh()
  }

  async refresh() {
    const data = (this as any) as Data
    const result = await this.$store.dispatch("getVisibleRooms")
    if (result == null) return
    // TODO: guard here to verify if that is the correct type
    const rooms = result as RoomAdvert[]
    ReplaceArray(data.rooms, rooms)
  }

  created() {
    this.refresh()
    this.startTimer()
    if ((this as any).currentRoom != "") this.$router.replace("/play");
  }

  startTimer() {
    const data = (this as any) as Data
    if (data.timer != null) return
    data.timer = setTimeout(this.timerFire, data.timeout)
    // increase the timeout until it gets to 15 seconds
    data.timeout = Math.min(Math.ceil(data.timeout * 1.1), 15000)
    console.log("Waiting ", data.timeout)
  }
  stopTimer() {
    const data = (this as any) as Data
    if (data.timer != null) {
      clearTimeout(data.timer)
      data.timer = null
    }
  }

  beforeDestroy() {
    this.stopTimer()
  }

}
</script>
