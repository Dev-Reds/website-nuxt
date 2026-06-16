<script setup>
const { restore, currentUser } = useAuth()
const { callState, remoteStream, answerCall, rejectCall, endCall, closeCallOverlay, toggleAudio, toggleVideo, onLocalVideoMount, onRemoteVideoMount } = useCall()
onMounted(() => restore())

function handleAnswer() { if (currentUser.value) answerCall(currentUser.value.id) }
function handleReject() { if (currentUser.value) rejectCall(currentUser.value.id) }
</script>

<template>
  <div>
    <NavBar/>
    <OnlineDisplay/>
    <AccountButton/>
    <div class="page-wrap">
      <NuxtPage/>
    </div>

    <!-- ═══ CALL OVERLAY (full-site) ═══ -->
    <div v-if="callState.mode !== 'idle'" class="call-overlay" @click.self="callState.showInfo = !callState.showInfo">
      <div class="call-container">
        <div v-if="callState.mode === 'active' && remoteStream" class="remote-video-wrap">
          <video :ref="onRemoteVideoMount" autoplay playsinline class="remote-video"/>
        </div>
        <div v-else class="call-avatar-area">
          <div class="call-avatar">{{ callState.partnerName[0]?.toUpperCase() || '?' }}</div>
        </div>
        <div v-if="callState.mode === 'active' && callState.videoEnabled" class="local-video-wrap">
          <video :ref="onLocalVideoMount" autoplay muted playsinline class="local-video"/>
        </div>
        <div class="call-info">
          <div class="call-partner-name">{{ callState.partnerName || 'Unbekannt' }}</div>
          <div class="call-status-text">
            <template v-if="callState.mode === 'outgoing'">Wird verbunden…</template>
            <template v-else-if="callState.mode === 'incoming'">Eingehender Anruf</template>
            <template v-else-if="callState.mode === 'active'">Verbunden</template>
            <template v-else-if="callState.mode === 'ended'">Anruf beendet</template>
          </div>
        </div>
        <div class="call-actions">
          <template v-if="callState.mode === 'incoming'">
            <button class="call-btn accept" @click="handleAnswer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            </button>
            <button class="call-btn reject" @click="handleReject">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </template>
          <template v-else-if="callState.mode === 'outgoing'">
            <button class="call-btn reject" @click="endCall">Auflegen</button>
          </template>
          <template v-else-if="callState.mode === 'active'">
            <button :class="['call-btn', 'v-btn', { active: callState.audioEnabled }]" @click="toggleAudio">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button :class="['call-btn', 'v-btn', { active: callState.videoEnabled }]" @click="toggleVideo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </button>
            <button class="call-btn reject end" @click="endCall">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            </button>
          </template>
          <template v-else-if="callState.mode === 'ended'">
            <button class="call-btn" @click="closeCallOverlay">Schließen</button>
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
  box-sizing: border-box;
}

/* CALL OVERLAY — fixed full-screen */
.call-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(10,5,5,.92);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(6px);
}
.call-container {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 30px; width: 100%; max-width: 400px; position: relative;
}
.call-avatar-area { display: flex; align-items: center; justify-content: center; }
.call-avatar {
  width: 100px; height: 100px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 40px; font-weight: 600; color: white;
  background: #3d1a1a; border: 3px solid #e53935;
  box-shadow: 0 0 40px rgba(229,57,53,.3);
}
.remote-video-wrap {
  width: 100%; max-width: 360px; aspect-ratio: 4/3;
  border-radius: 14px; overflow: hidden;
  background: #000; border: 2px solid #3d1a1a;
}
.remote-video { width: 100%; height: 100%; object-fit: cover; }
.local-video-wrap {
  position: absolute; top: 10px; right: 10px;
  width: 120px; aspect-ratio: 4/3; border-radius: 10px;
  overflow: hidden; border: 2px solid #3d1a1a; background: #000; z-index: 5;
}
.local-video { width: 100%; height: 100%; object-fit: cover; }
.call-info { text-align: center; }
.call-partner-name { font-size: 20px; font-weight: 600; color: #e9edef; }
.call-status-text { font-size: 13px; color: #8696a0; margin-top: 4px; }
.call-actions { display: flex; gap: 14px; align-items: center; justify-content: center; }
.call-btn {
  width: 52px; height: 52px; border-radius: 50%; border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .15s; flex-shrink: 0;
  font-family: inherit; font-size: 13px; font-weight: 600;
  background: #3d1a1a; color: #e9edef;
}
.call-btn:hover { transform: scale(1.05); }
.call-btn.accept { background: #e53935; color: white; width: 60px; height: 60px; }
.call-btn.accept:hover { background: #c62828; }
.call-btn.reject { background: #5a2020; color: #ff6b6b; }
.call-btn.reject:hover { background: #7b1c1c; }
.call-btn.reject.end { width: 60px; height: 60px; }
.call-btn.v-btn { background: #3d1a1a; color: #8696a0; }
.call-btn.v-btn.active { background: #e53935; color: white; }

@media(max-width:768px){
  .call-overlay { padding: 10px; }
  .call-container { padding: 16px 12px; gap: 12px; }
  .call-partner-name { font-size: 17px; }
  .call-btn { width: 44px; height: 44px; }
  .call-btn.accept,.call-btn.reject.end { width: 52px; height: 52px; }
  .call-avatar { width: 80px; height: 80px; font-size: 32px; }
  .local-video-wrap { width: 90px; top: 6px; right: 6px; }
}
</style>
