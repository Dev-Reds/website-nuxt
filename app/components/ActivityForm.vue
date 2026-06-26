<template>
  <div>
    <h1>{{ t('activity.heading') }}</h1>

    <div>
            <label for="activity">{{ t('activity.label') }}</label>
            <input type="text" id="activity" v-model="activity" :placeholder="t('activity.placeholder')">
            <label for="time">{{ t('activity.timePerDay') }}</label>
            <input type="number" id="time" v-model="time" :placeholder="t('activity.timePlaceholder')">
            <label for="lifetime">{{ t('activity.years') }}</label>
            <input type="number" id="lifetime" v-model="lifetime" :placeholder="t('activity.yearsPlaceholder')">
            <label for="timetype">{{ t('activity.timeType') }}</label>
            <button @click="timetype = 'min'">{{ t('activity.minutes') }}</button>
            <button @click="timetype = 'h'">{{ t('activity.hours') }}</button>
            <p>{{ t('activity.result', { time, timetype: timetype === 'h' ? t('activity.hours') : t('activity.minutes'), activity, percentage, years }) }}</p>
            <GridLiveWeek :weeksused="timetakenweeks" :lifetime="lifetime"/>
    </div>

  </div>
</template>

<script setup>
const { t } = useLanguage()
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
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }

    p {
    color: darkred;
    font-size: clamp(16px, 4vw, 20px);
    margin-top: 20px;
    text-align: center;
  }

  h1 {
    color: darkred;
    font-size: clamp(18px, 5vw, 24px);
    margin-bottom: 10px;
    text-align: center;
  }

  label {
    color: darkred;
    font-size: clamp(14px, 4vw, 18px);
    margin-right: 10px;
  }

  input {
    padding: 8px;
    font-size: clamp(14px, 4vw, 16px);
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
    font-size: clamp(14px, 4vw, 16px);
    color: rgb(157, 157, 157);
    background-color: rgb(48, 48, 48);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>