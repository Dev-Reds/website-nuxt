<template>
    <div class="gw-wrap">
        <div v-for="(year, index) in life" :key="index" class="grid-row">
           <div v-for="(week, weekIndex) in year" :key="weekIndex" class="grid-square" :class="{used:(weekIndex  + index * WEEKS_PER_YEAR) < weeksused}">
           </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    weeksused: {
        type: Number,
        required: true
    },
    lifetime: {
        type: Number,
        required: true,
        default: 100
    }
})

const WEEKS_PER_YEAR = 52

function generateEmptyRow() {

    const squares = []

    for (let i = 0; i < WEEKS_PER_YEAR; i++) {

        squares.push(0)
    }
    return squares
}

function generateEmptyGrid() {

    const grid = []

    for (let i = 0; i < props.lifetime; i++) {

        grid.push(generateEmptyRow())
    }
    return grid
}

const life = computed(() => generateEmptyGrid())



</script>

<style scoped>
.gw-wrap {
  width: 100%;
}

.grid-square {
  aspect-ratio: 1;
  background: white;
  border: 1px solid black;
  box-sizing: border-box;
}

.grid-square.used {
  background: rgb(255, 0, 0);
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  width: 100%;
}
</style>