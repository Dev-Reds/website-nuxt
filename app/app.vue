<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const { restore, currentUser } = useAuth()
const { callState, remoteStream, answerCall, rejectCall, endCall, closeCallOverlay, toggleAudio, toggleVideo, onLocalVideoMount, onRemoteVideoMount } = useCall()

const callFullscreen = ref(false)
const callBarPos = ref({ left: null, top: null })
let savedBarPos = null
let dragState = null

function toggleFullscreen() {
  if (callFullscreen.value) {
    callFullscreen.value = false
    if (savedBarPos) {
      callBarPos.value = savedBarPos
      savedBarPos = null
    }
  } else {
    if (callBarPos.value.left !== null) {
      savedBarPos = { ...callBarPos.value }
    }
    callBarPos.value = { left: null, top: null }
    callFullscreen.value = true
  }
}

function onDragStart(e) {
  if (callFullscreen.value) return
  if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'VIDEO') return
  const touch = e.touches ? e.touches[0] : e
  const rect = e.currentTarget.getBoundingClientRect()
  dragState = {
    startX: touch.clientX,
    startY: touch.clientY,
    startLeft: rect.left,
    startTop: rect.top
  }
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.addEventListener('touchmove', onDragMove, { passive: true })
  document.addEventListener('touchend', onDragEnd)
}

function onDragMove(e) {
  if (!dragState) return
  const touch = e.touches ? e.touches[0] : e
  const dx = touch.clientX - dragState.startX
  const dy = touch.clientY - dragState.startY
  callBarPos.value = {
    left: dragState.startLeft + dx,
    top: dragState.startTop + dy
  }
}

function onDragEnd() {
  dragState = null
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
}

function onKeyDown(e) {
  if (e.key === 'Escape' && callFullscreen.value) {
    callFullscreen.value = false
  }
}

const callTimer = ref('00:00')
let timerInterval = null
const showIncoming = ref(false)
const incomingTimeout = ref(null)

onMounted(() => { restore(); document.addEventListener('keydown', onKeyDown) })

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (incomingTimeout.value) clearTimeout(incomingTimeout.value)
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
})

function handleAnswer() { showIncoming.value = false; if (currentUser.value) answerCall(currentUser.value.id) }
function handleReject() { showIncoming.value = false; if (currentUser.value) rejectCall(currentUser.value.id) }

watch(() => callState.value.mode, (mode) => {
  if (mode === 'active') { startTimer(); showIncoming.value = false }
  else if (mode === 'incoming') {
    showIncoming.value = true
    if (incomingTimeout.value) clearTimeout(incomingTimeout.value)
    incomingTimeout.value = setTimeout(() => { showIncoming.value = false }, 15000)
  }
  else if (mode === 'outgoing') { showIncoming.value = false }
  else if (mode === 'ended') {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
    setTimeout(() => { if (callState.value.mode === 'ended') closeCallOverlay() }, 4000)
  }
  else { if (timerInterval) { clearInterval(timerInterval); timerInterval = null } }
})

function startTimer() {
  if (timerInterval) clearInterval(timerInterval)
  const start = Date.now()
  function update() {
    const elapsed = Date.now() - start
    const mins = String(Math.floor(elapsed / 60000)).padStart(2, '0')
    const secs = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')
    callTimer.value = `${mins}:${secs}`
  }
  update()
  timerInterval = setInterval(update, 1000)
}
</script>

<template>
  <div>
    <NavBar/>
    <OnlineDisplay/>
    <AccountButton/>
    <div class="page-wrap">
      <NuxtPage/>
    </div>

    <!-- ═══ INCOMING CALL BANNER (oben, nicht blockierend) ═══ -->
    <div v-if="callState.mode === 'incoming' && showIncoming" class="incoming-banner">
      <div class="incoming-content">
        <div class="incoming-avatar">{{ callState.partnerName[0]?.toUpperCase() || '?' }}</div>
        <div class="incoming-info">
          <span class="incoming-name">{{ callState.partnerName || 'Unbekannt' }}</span>
          <span class="incoming-status">Eingehender Anruf</span>
        </div>
        <div class="incoming-actions">
          <button class="incoming-btn accept" @click="handleAnswer" title="Annehmen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
          </button>
          <button class="incoming-btn reject" @click="handleReject" title="Ablehnen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ FLOATING CALL BAR (aktiv/ausgehend/beendet) ═══ -->
    <div v-if="callState.mode !== 'idle' && callState.mode !== 'incoming'" 
      :class="['call-bar', { fullscreen: callFullscreen }]"
      :style="callBarPos.left !== null ? { left: callBarPos.left + 'px', top: callBarPos.top + 'px', transform: 'none', bottom: 'auto' } : {}"
      @mousedown="onDragStart"
      @touchstart="onDragStart">
      <!-- Remote video PIP -->
      <div v-if="callState.mode === 'active' && remoteStream" class="bar-video-pip">
        <video :ref="onRemoteVideoMount" autoplay playsinline class="pip-video"/>
        <div v-if="callState.videoEnabled" class="pip-self">
          <video :ref="onLocalVideoMount" autoplay muted playsinline class="pip-self-video"/>
        </div>
      </div>

      <div class="bar-main">
        <div class="bar-avatar">{{ callState.partnerName[0]?.toUpperCase() || '?' }}</div>
        <div class="bar-info">
          <span class="bar-name">{{ callState.partnerName || 'Unbekannt' }}</span>
          <span class="bar-status">
            <template v-if="callState.mode === 'outgoing'">Wird verbunden…</template>
            <template v-else-if="callState.mode === 'active'">{{ callTimer }}</template>
            <template v-else-if="callState.mode === 'ended'">Anruf beendet</template>
          </span>
        </div>
        <div class="bar-actions">
          <template v-if="callState.mode === 'active'">
            <button :class="['bar-btn', { active: callState.audioEnabled }]" @click="toggleAudio" title="Stumm">
              <svg v-if="callState.audioEnabled" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
            <button :class="['bar-btn', { active: callState.videoEnabled }]" @click="toggleVideo" title="Kamera">
              <svg v-if="callState.videoEnabled" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
            <button class="bar-btn" @click="toggleFullscreen" title="Vollbild">
              <svg v-if="!callFullscreen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
            </button>
          </template>
          <template v-if="callState.mode !== 'ended'">
            <button class="bar-btn end" @click="endCall" title="Auflegen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            </button>
          </template>
          <template v-else>
            <button class="bar-btn close-bar" @click="closeCallOverlay">Schließen</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background: #1a0a0a;
  margin: 0;
  min-height: 100vh;
}
.page-wrap {
  background: #000 url('/background.png') center/cover no-repeat fixed;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 0;
  box-sizing: border-box;
  transition: padding-bottom .2s;
}
body:has(.call-bar) .page-wrap {
  padding-bottom: 70px;
}

/* ═══ INCOMING CALL BANNER ═══ */
.incoming-banner {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: #2a1010;
  border: 1px solid #3d1a1a;
  border-radius: 14px;
  padding: 12px 18px;
  box-shadow: 0 8px 40px rgba(0,0,0,.6);
  animation: slideDown .3s ease;
  min-width: 320px;
  max-width: 420px;
}
@keyframes slideDown {
  from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}
.incoming-content {
  display: flex;
  align-items: center;
  gap: 14px;
}
.incoming-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; color: white;
  background: #3d1a1a; border: 2px solid #43b581;
  flex-shrink: 0;
}
.incoming-info {
  flex: 1;
  min-width: 0;
}
.incoming-name {
  display: block;
  font-size: 15px; font-weight: 600; color: #e9edef;
}
.incoming-status {
  display: block;
  font-size: 12px; color: #43b581;
}
.incoming-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.incoming-btn {
  width: 42px; height: 42px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s;
}
.incoming-btn.accept { background: #43b581; color: white; }
.incoming-btn.accept:hover { background: #3ca374; transform: scale(1.08); }
.incoming-btn.reject { background: #e53935; color: white; }
.incoming-btn.reject:hover { background: #c62828; transform: scale(1.08); }

/* ═══ FLOATING CALL BAR ═══ */
.call-bar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: #1a0a0a;
  border: 1px solid #3d1a1a;
  border-radius: 16px;
  padding: 8px 12px;
  box-shadow: 0 8px 40px rgba(0,0,0,.6);
  animation: fadeUp .3s ease;
  min-width: 300px;
  max-width: 500px;
}
@keyframes fadeUp {
  from { transform: translateX(-50%) translateY(20px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}
.bar-video-pip {
  margin-bottom: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid #3d1a1a;
  position: relative;
  max-height: 120px;
}
.pip-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  max-height: 120px;
}
.pip-self {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 80px;
  aspect-ratio: 4/3;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,.3);
  background: #000;
}
.pip-self-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bar-main {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 700; color: white;
  background: #3d1a1a; border: 2px solid #e53935;
  flex-shrink: 0;
}
.bar-info {
  flex: 1;
  min-width: 0;
}
.bar-name {
  display: block;
  font-size: 14px; font-weight: 600; color: #e9edef;
}
.bar-status {
  display: block;
  font-size: 11px; color: #8696a0;
}
.bar-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}
.bar-btn {
  width: 36px; height: 36px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s;
  background: #3d1a1a; color: #8696a0; flex-shrink: 0;
}
.bar-btn:hover { background: #5a2020; color: #e9edef; }
.bar-btn.active { background: #43b581; color: white; }
.bar-btn.active:hover { background: #3ca374; }
.bar-btn.end { background: #e53935; color: white; width: 40px; height: 40px; }
.bar-btn.end:hover { background: #c62828; }
.bar-btn.close-bar {
  width: auto; height: auto;
  border-radius: 20px; padding: 6px 14px;
  font-size: 12px; font-weight: 600; font-family: inherit;
}

/* ═══ DRAGGABLE CALL BAR ═══ */
.call-bar { cursor: grab; user-select: none; }
.call-bar:active { cursor: grabbing; }

/* ═══ FULLSCREEN CALL BAR ═══ */
.call-bar.fullscreen {
  cursor: default;
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  max-width: none; border-radius: 0; border: none;
  transform: none !important; padding: 0;
  background: #000; z-index: 10000;
  display: flex; flex-direction: column;
  animation: fadeIn .2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.call-bar.fullscreen .bar-video-pip {
  max-height: none; margin-bottom: 0; border-radius: 0; border: none;
  flex: 1; width: 100%;
  display: flex; align-items: center; justify-content: center;
  background: #000;
}
.call-bar.fullscreen .pip-video {
  max-height: none; height: 100%; width: 100%;
  object-fit: contain;
}
.call-bar.fullscreen .pip-self {
  width: 180px;
}
.call-bar.fullscreen .bar-main {
  position: absolute; bottom: 20px; left: 50%;
  transform: translateX(-50%);
  background: rgba(26,10,10,.85);
  backdrop-filter: blur(8px);
  border-radius: 16px; padding: 10px 16px;
  min-width: 300px;
}
.call-bar.fullscreen .bar-btn { width: 40px; height: 40px; }
.call-bar.fullscreen .bar-btn.end { width: 44px; height: 44px; }

@media(max-width:768px){
  .call-bar {
    left: 8px;
    right: 8px;
    transform: none;
    min-width: unset;
    max-width: unset;
    bottom: 8px;
  }
  @keyframes fadeUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .incoming-banner {
    left: 8px;
    right: 8px;
    transform: none;
    min-width: unset;
    max-width: unset;
  }
  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .bar-avatar { width: 32px; height: 32px; font-size: 13px; }
  .bar-name { font-size: 13px; }
  .bar-btn { width: 32px; height: 32px; }
  .bar-btn.end { width: 36px; height: 36px; }
  .call-bar.fullscreen .pip-self { width: 120px; }
  .call-bar.fullscreen .bar-main { min-width: unset; left: 8px; right: 8px; transform: none; }
}
</style>
