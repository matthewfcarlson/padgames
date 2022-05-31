<template>
  <div class="404">
    <nav-bar />
    <div class="container">
      <h2>Friends list:</h2>
      <div v-if="isUserTemporary">
        <p class="muted">Since you are a temporary user, you can't have friends</p>
        <p class="muted">At least, here on PadGames. Real world friends are fine.</p>
      </div>
      <friend-panel v-else />
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
        <div class="input-group mb-1">
            <input
              type="email"
              class="form-control"
              v-model="manualGameCode"
              placeholder="Search for a specific game"
              aria-describedby="search-button"
            />
            <button class="btn btn-success" type="button" id="search-button" @click="searchGame">Search</button>
          </div>
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

    </div>
  </div>
</template>

<script setup lang='ts'>
import { defineComponent, Ref, ref, onMounted, computed, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { RoomAdvert, RoomVisibility } from "../../common/store_types";
import NavBar from "@/components/NavBar.vue";
import FriendPanel from "@/components/FriendPanel.vue";

const thinking = ref(false);
const rooms: Ref<RoomAdvert[]> = ref([]);
const visibility:Ref<RoomVisibility> = ref(RoomVisibility.PUBLIC);
const timeout = ref(1500);
const timer: Ref<null|NodeJS.Timer> = ref(null);
const manualGameCode = ref("");

const store = useAuthStore();
const router = useRouter();

const isUserTemporary = computed(()=>store.isUserTemporary);
const currentRoom = computed(()=>store.currentRoom);

async function searchGame(event: Event) {
  if (manualGameCode.value == '') return;
  const value = manualGameCode.value;
  manualGameCode.value = '';
  await joinGame(manualGameCode.value);
}


async function createGame() {
    if (thinking.value) return
    thinking.value = true
    let result = await store.createRoom(visibility.value);
    console.log(result)
    thinking.value = false
    if (result != null) {
        console.log("Got back ", result)
        rooms.value.push(result)
        joinGame(result.code)
    }
}

async function joinGame(code: string) {
    if (thinking.value) return
    thinking.value = true;
    let result = await store.joinRoom(code);
    thinking.value = false;
}

function timerFire() {
    // we need to start the timer if it doesn't already exist
    timer.value = null
    startTimer()
    refresh()
}

async function refresh() {
    let result = await store.getVisibleRooms()
    if (result == null) return
    // TODO: guard here to verify if that is the correct type
    const rooms = result as RoomAdvert[]
    console.log(rooms)
    //ReplaceArray(data.rooms, rooms)
}

onMounted(() => {
    refresh()
    startTimer()
    if (currentRoom.value != '') router.replace('/play');
});

onBeforeUnmount(() => {
  stopTimer();
})

function startTimer() {
    if (timer.value != null) return
    timer.value = setTimeout(timerFire, timeout.value)
    // increase the timeout until it gets to 15 seconds
    timeout.value = Math.min(Math.ceil(timeout.value * 1.1), 15000)
    console.log("Waiting ", timeout.value)
}
function stopTimer() {
    if (timer.value != null) {
      clearTimeout(timer.value)
      timer.value = null
    }
}

</script>
