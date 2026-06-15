<template>
  <div class="online-display" v-if="count > 0">
    <div class="online-dot"></div>
    <span class="online-count">Online: {{ count }}</span>
  </div>
</template>

<script setup>
const SK = 'ol_'
const count = ref(0)
const sessionId = ref('')
const heartbeatInterval = ref(null)
const countInterval = ref(null)

onMounted(() => {
  let sid = sessionStorage.getItem(SK+'sid')
  if (!sid) {
    sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    sessionStorage.setItem(SK+'sid', sid)
  }
  sessionId.value = sid

  async function sendHeartbeat() {
    try {
      await fetch('/api/online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId.value })
      })
    } catch {}
  }

  async function updateCount() {
    try {
      const r = await fetch('/api/online')
      const d = await r.json()
      count.value = d.count
    } catch {}
  }

  sendHeartbeat()
  updateCount()
  heartbeatInterval.value = setInterval(sendHeartbeat, 15000)
  countInterval.value = setInterval(updateCount, 3000)

  window.addEventListener('beforeunload', leave)
})

onUnmounted(() => {
  if (heartbeatInterval.value) clearInterval(heartbeatInterval.value)
  if (countInterval.value) clearInterval(countInterval.value)
  window.removeEventListener('beforeunload', leave)
})

function leave() {
  try {
    fetch('/api/online', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sessionId.value, leave: true }),
      keepalive: true,
    })
  } catch {}
}
</script>

<style scoped>
.online-display {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 14px;
  color: #fff;
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.online-count {
  font-weight: 700;
  color: rgb(188, 0, 0);
}
</style>
