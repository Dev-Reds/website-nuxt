<template>
  <div class="todo-page">
    <h1>ToDo Liste</h1>

    <section class="todo-input">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Neue Aufgabe eingeben..."
        aria-label="Neue Aufgabe"
      />
      <button type="button" @click="addTodo">Hinzufügen</button>
    </section>

    <section class="todo-list" v-if="todos.length">
      <ul>
        <li v-for="(todo, index) in todos" :key="todo.id">
          <label class="todo-item">
            <input type="checkbox" v-model="todo.completed" aria-label="Erledigt" />
            <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
          </label>
          <button type="button" @click="removeTodo(index)">Löschen</button>
        </li>
      </ul>
    </section>

    <p class="empty" v-else>Hier sind noch keine Aufgaben. Füge eine hinzu!</p>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'ToDo List' })

import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'nuxt-todos'

const newTodo = ref('')
const todos = ref<Array<{ id: number; text: string , completed: boolean}>>([])

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) todos.value = JSON.parse(raw)
  } catch (e) {
    // ignore malformed data
  }
})

watch(
  todos,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
    } catch (e) {
      // ignore storage errors
    }
  },
  { deep: true }
)

const addTodo = () => {
  const text = newTodo.value.trim()
  if (!text) return

  todos.value.push({ id: Date.now(), text, completed: false })
  newTodo.value = ''
}

const removeTodo = (index: number) => {
  todos.value.splice(index, 1)
}
</script>

<style scoped>
.todo-page {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
}

h1 {
  color: rgb(188, 0, 0);
  font-size: 32px;
  text-align: center;
  margin-bottom: 24px;
}

.todo-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input input {
  flex: 1;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.todo-input button {
  padding: 10px 18px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background: rgb(188, 0, 0);
  color: white;
  cursor: pointer;
}

.todo-input button:hover {
  background: rgb(155, 0, 0);
}

.todo-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 12px;
  background: #fff7f7;
}

.todo-list span {
  word-break: break-word;
  min-width: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.todo-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.todo-list span.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.todo-list button {
  border: none;
  background: transparent;
  color: rgb(188, 0, 0);
  font-weight: 700;
  cursor: pointer;
}

.todo-list button:hover {
  color: rgb(140, 0, 0);
}

.empty {
  text-align: center;
  color: #666;
  margin-top: 16px;
}
</style>