<template>
  <div>
    <h1>Activity Calculator</h1>

    <div>
            <label for="activity">Aktivität:</label>
            <input type="text" id="activity" v-model="activity" placeholder="z.B. Laufen, Schwimmen, etc.">
            <label for="time">Zeit pro Tag:</label>
            <input type="number" id="time" v-model="time" placeholder="z.B. in min 30, 60, etc.">
            <label for="lifetime">Lebenserwartung:</label>
            <input type="number" id="lifetime" v-model="lifetime" placeholder="z.B. 100 Jahre">
            <label for="timetype">Zeit Art:</label>
            <button @click="timetype = 'min'">Minuten</button>
            <button @click="timetype = 'h'">Stunden</button>
            <p>{{ time }} {{ timetype }} {{ activity }}, das sind {{ percentage }}% deines Lebens und {{ years }} Jahre.</p>
            <GridLiveWeek :weeksused="timetakenweeks" :lifetime="lifetime"/>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
const activity = ref('')
const STORAGE_KEY = 'nuxt-activity-data'
const time = ref(0)
const timetype = ref('h')
const lifetime = ref(100)
const timetakenweeks = computed(() => {
    let total = 0
    if (timetype.value === 'h') {
    total = time.value * 7 / 168 * 52 * lifetime.value
    }
    if (timetype.value === 'min') {
    total = time.value * 7 / (168 * 60) * 52 * lifetime.value
    }
    return total
})

const percentage = computed(() => {
    return (timetakenweeks.value / (lifetime.value * 52) * 100).toFixed(2)
})
const years = computed(() => {
  return (timetakenweeks.value / 52).toFixed(2)
})
const prop = computed(() => {
  return {
    activity: activity.value,
    time: time.value,
    timetype: timetype.value,
    lifetime: lifetime.value
  }
})

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      activity.value = data.activity
      time.value = data.time
      timetype.value = data.timetype
      lifetime.value = data.lifetime
    }
  } catch (e) {
    // ignore malformed data
  }
})

watch(
  prop,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))

    } catch (e) {
      // ignore storage errors
    }
  },
  { deep: true }
)



</script>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    padding-bottom: 20px;
  }

    p {
    color: darkred;
    font-size: 20px;
    margin-top: 20px;
  }

  h1 {
    color: darkred;
    font-size: 24px;
    margin-bottom: 10px;
  }

  label {
    color: darkred;
    font-size: 18px;
    margin-right: 10px;
  }

  input {
    padding: 8px;
    font-size: 16px;
    color: rgb(157, 157, 157);
    background: rgb(48, 48, 48);
    border: 1px solid #000000;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
    box-sizing: border-box;
  }

  button {
    margin: 5px;
    padding: 10px 20px;
    font-size: 16px;
    color: rgb(157, 157, 157);
    background-color: rgb(48, 48, 48);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>