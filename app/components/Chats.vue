<template>
  <div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
const allChats = ref([])
const STORAGE_KEY = 'nuxt-chat-data'
const currentChat = ref('')
const currentChatMessages = computed(() => {
  const chat = allChats.value.find(c => c.id === currentChat.value)
  return chat ? chat.messages : []
})
const user = ref('User')
const newMessage = ref('')
const chatuser = ref('User2')



onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      allChats.value = data
      currentChat.value = data[0]?.id || ''
    }
  } catch (e) {
    // ignore malformed data
  }
})

watch(
  allChats,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))

    } catch (e) {
      // ignore write errors
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
    width: 200px;
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