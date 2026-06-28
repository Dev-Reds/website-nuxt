<script setup>
const isOpen = ref(false)
const { t } = useLanguage()
defineProps<{ inTopBar?: boolean }>()
</script>

<template>
  <div class="nav-wrapper" :class="{ open: isOpen, 'in-bar': inTopBar }">
    <div class="nav-backdrop" v-if="isOpen" @click="isOpen = false"></div>
    <nav class="nav-panel" v-if="isOpen">
      <div class="nav-item"><NuxtLink to="/" @click="isOpen = false">{{ t('nav.projects') }}</NuxtLink></div>
      <div class="nav-item"><NuxtLink to="/youtube" @click="isOpen = false">{{ t('nav.youtube') }}</NuxtLink></div>
      <div class="nav-item"><NuxtLink to="/todo-list" @click="isOpen = false">{{ t('nav.todo') }}</NuxtLink></div>
      <div class="nav-item"><NuxtLink to="/time-calc" @click="isOpen = false">{{ t('nav.timecalc') }}</NuxtLink></div>
      <div class="nav-item"><NuxtLink to="/land-guesser" @click="isOpen = false">{{ t('nav.landguesser') }}</NuxtLink></div>
      <div class="nav-item"><NuxtLink to="/chat" @click="isOpen = false">{{ t('nav.chat') }}</NuxtLink></div>
    </nav>
    <button class="hamburger" @click="isOpen = !isOpen">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</template>

<style scoped>
.nav-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
}

.nav-wrapper.in-bar {
  position: relative;
  left: auto;
  top: auto;
}

.hamburger {
  background: none;
  border: 2px solid rgb(188, 0, 0);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  margin: 10px;
  position: relative;
  z-index: 10001;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background: rgb(188, 0, 0);
  border-radius: 2px;
}

.open .hamburger span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.open .hamburger span:nth-child(2) {
  opacity: 0;
}
.open .hamburger span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
}

.nav-panel {
  position: fixed;
  left: 0;
  top: 0;
  height: 100dvh;
  width: min(200px, 80vw);
  background: rgba(0, 0, 0, 0) url('/background.png') center/cover;
  border-right: 2px solid rgb(188, 0, 0);
  padding: 16px;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
  box-sizing: border-box;
}

.nav-item {
  display: block;
}

a {
  color: rgb(188, 0, 0);
  font-size: clamp(14px, 3vw, 18px);
  border: 2px solid rgb(188, 0, 0);
  border-radius: 10px;
  padding: 8px 12px;
  text-decoration: none;
  display: block;
  text-align: center;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  background: none;
}

a:hover {
  color: rgb(188, 0, 0);
  border-color: rgb(188, 0, 0);
  background: #000;
}
</style>