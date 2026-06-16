import { ref } from 'vue'

const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

const callState = ref({ mode: 'idle', callId: null, partnerId: null, partnerName: '', chatId: null, audioEnabled: true, videoEnabled: false, showInfo: false })
const remoteStream = ref(null)

let pc = null
let localStream = null
const processedCallIds = new Set()
let pendingCandidates = []
let videoStream = null
let addCallMessageFn = null
let _currentUserId = null
let callStatusInterval = null

export function setCallMessageCallback(fn) { addCallMessageFn = fn }

async function addCallMessage(text) {
  if (addCallMessageFn) await addCallMessageFn(text)
}

export function useCall() {

  function cleanupCall() {
    if (pc) { pc.getTransceivers().forEach(t => { if (t.stop) t.stop() }); pc.close(); pc = null }
    if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null }
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null }
    remoteStream.value = null
    if (callStatusInterval) { clearInterval(callStatusInterval); callStatusInterval = null }
    callState.value = { mode: 'idle', callId: null, partnerId: null, partnerName: '', chatId: null, audioEnabled: true, videoEnabled: false, showInfo: false }
    processedCallIds.clear()
  }

  async function fetchCallStatus() {
    if (!_currentUserId || !callState.value.callId) return
    try {
      const res = await fetch(`/api/calls?userId=${_currentUserId}`)
      const data = await res.json()
      for (const call of data.calls) {
        if (call.id !== callState.value.callId) continue
        if ((call.status === 'connected') && callState.value.mode === 'outgoing' && call.answer && pc) {
          try { await pc.setRemoteDescription(JSON.parse(call.answer)).catch(() => {}) } catch {}
          callState.value.mode = 'active'
          await addCallMessage('📞 Anruf angenommen')
        }
        if (callState.value.mode !== 'idle') {
          const otherCandidates = _currentUserId === call.fromUserId ? (call.toCandidates || []) : (call.fromCandidates || [])
          for (const c of otherCandidates) {
            try { if (pc) await pc.addIceCandidate(JSON.parse(c)) } catch {}
          }
        }
        if (call.status === 'ended') { endCall(); return }
      }
    } catch {}
  }

  function ensureCallPolling() {
    if (callStatusInterval) return
    // immediate first check, then poll every 300ms
    fetchCallStatus()
    callStatusInterval = setInterval(async () => {
      if (!_currentUserId || !callState.value.callId || callState.value.mode === 'idle' || callState.value.mode === 'ended') {
        clearInterval(callStatusInterval); callStatusInterval = null; return
      }
      await fetchCallStatus()
    }, 200)
  }

  async function startCall(partnerId, partnerName, chatId, userId) {
    if (callState.value.mode !== 'idle') return
    _currentUserId = userId
    callState.value = { mode: 'outgoing', callId: null, partnerId, partnerName, chatId, audioEnabled: true, videoEnabled: false, showInfo: false }
    pendingCandidates = []
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      pc = new RTCPeerConnection(rtcConfig)
      localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
      pc.ontrack = (e) => { remoteStream.value = e.streams[0] }
      pc.oniceconnectionstatechange = () => {
        if (pc?.iceConnectionState === 'failed') endCall()
      }
      pc.onicecandidate = (e) => {
        if (!e.candidate) return
        if (callState.value.callId) {
          fetch('/api/calls', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'candidate', callId: callState.value.callId, fromUserId: _currentUserId, candidate: JSON.stringify(e.candidate) })
          }).catch(() => {})
        } else {
          pendingCandidates.push(e.candidate)
        }
      }
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      const res = await fetch('/api/calls', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', fromUserId: _currentUserId, toUserId: partnerId, sdp: JSON.stringify(pc.localDescription) })
      })
      const data = await res.json()
      if (data.call) {
        callState.value.callId = data.call.id
        for (const c of pendingCandidates) {
          fetch('/api/calls', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'candidate', callId: callState.value.callId, fromUserId: _currentUserId, candidate: JSON.stringify(c) })
          }).catch(() => {})
        }
        pendingCandidates = []
      }
      ensureCallPolling()
      await addCallMessage('🔴 Du rufst ' + partnerName + ' an...')
    } catch (e) {
      cleanupCall()
    }
  }

  async function answerCall(userId) {
    if (callState.value.mode !== 'incoming') return
    _currentUserId = userId
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      pc = new RTCPeerConnection(rtcConfig)
      localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
      pc.ontrack = (e) => { remoteStream.value = e.streams[0] }
      pc.oniceconnectionstatechange = () => {
        if (pc?.iceConnectionState === 'failed') endCall()
      }
      pc.onicecandidate = (e) => {
        if (!e.candidate || !callState.value.callId) return
        fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'candidate', callId: callState.value.callId, fromUserId: _currentUserId, candidate: JSON.stringify(e.candidate) })
        }).catch(() => {})
      }
      const res = await fetch(`/api/calls?userId=${_currentUserId}`)
      const data = await res.json()
      const call = data.calls.find(c => c.id === callState.value.callId)
      if (call?.offer) {
        const offer = JSON.parse(call.offer)
        await pc.setRemoteDescription(offer)
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        await fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'answer', callId: callState.value.callId, fromUserId: _currentUserId, sdp: JSON.stringify(pc.localDescription) })
        })
        callState.value.mode = 'active'
      }
      ensureCallPolling()
      await addCallMessage('📞 Anruf angenommen')
    } catch (e) {
      cleanupCall()
    }
  }

  async function rejectCall(userId) {
    if (callState.value.callId) {
      try {
        await fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'end', callId: callState.value.callId, fromUserId: userId })
        })
      } catch {}
    }
    await addCallMessage('❌ Anruf abgelehnt')
    cleanupCall()
  }

  async function endCall() {
    if (pc) {
      pc.getTransceivers().forEach(t => { if (t.stop) t.stop() })
      pc.close(); pc = null
    }
    if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null }
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null }
    remoteStream.value = null
    if (callState.value.callId) {
      try {
        await fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'end', callId: callState.value.callId, fromUserId: _currentUserId })
        })
      } catch {}
    }
    await addCallMessage('🔴 Anruf beendet')
    if (callStatusInterval) { clearInterval(callStatusInterval); callStatusInterval = null }
    callState.value = { ...callState.value, mode: 'ended', callId: null, audioEnabled: true, videoEnabled: false, showInfo: false }
  }

  function closeCallOverlay() { cleanupCall() }

  function toggleAudio() {
    if (!localStream) return
    const audioTrack = localStream.getAudioTracks()[0]
    if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; callState.value.audioEnabled = audioTrack.enabled }
  }

  function toggleVideo() {
    if (!pc || !localStream) return
    const videoTrack = localStream.getVideoTracks()[0]
    if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; callState.value.videoEnabled = videoTrack.enabled; return }
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((vs) => {
      videoStream = vs
      const newTrack = vs.getVideoTracks()[0]
      localStream.addTrack(newTrack)
      pc.addTrack(newTrack, localStream)
      callState.value.videoEnabled = true
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer)
        fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'candidate', callId: callState.value.callId, fromUserId: _currentUserId, sdp: JSON.stringify(offer) })
        })
      })
    }).catch(() => {})
  }

  async function pollCalls(userId, allUsers) {
    if (!userId) return
    _currentUserId = userId
    try {
      const res = await fetch(`/api/calls?userId=${_currentUserId}`)
      const data = await res.json()
      for (const call of data.calls) {
        if (call.status === 'ringing' && call.toUserId === _currentUserId && callState.value.mode === 'idle' && !processedCallIds.has(call.id)) {
          processedCallIds.add(call.id)
          const caller = allUsers?.find(u => u.id === call.fromUserId)
          callState.value = { mode: 'incoming', callId: call.id, partnerId: call.fromUserId, partnerName: caller?.name || 'Unbekannt', chatId: null, audioEnabled: true, videoEnabled: false, showInfo: false }
          ensureCallPolling()
          await addCallMessage('📞 Eingehender Anruf von ' + (caller?.name || 'Unbekannt'))
        }
        // if ensureCallPolling is active, it handles answer/ICE/end — skip to avoid duplicates
        if (callStatusInterval) continue
        if ((call.status === 'answered' || call.status === 'connected') && callState.value.callId === call.id) {
          if (callState.value.mode === 'outgoing' && call.answer && pc) {
            try {
              const desc = JSON.parse(call.answer)
              await pc.setRemoteDescription(desc).catch(() => {})
            } catch {}
            callState.value.mode = 'active'
            await addCallMessage('📞 Anruf angenommen')
          }
          if (callState.value.mode !== 'idle') {
            const otherCandidates = _currentUserId === call.fromUserId ? (call.toCandidates || []) : (call.fromCandidates || [])
            for (const c of otherCandidates) {
              try { if (pc) await pc.addIceCandidate(JSON.parse(c)) } catch {}
            }
          }
        }
        if (call.status === 'ended' && callState.value.callId === call.id && callState.value.mode !== 'idle' && callState.value.mode !== 'ended') {
          endCall()
        }
      }
    } catch {}
  }

  function onLocalVideoMount(el) {
    if (el && localStream) el.srcObject = localStream
  }

  function onRemoteVideoMount(el) {
    if (el && remoteStream.value) el.srcObject = remoteStream.value
  }

  return { callState, remoteStream, startCall, answerCall, rejectCall, endCall, closeCallOverlay, toggleAudio, toggleVideo, pollCalls, onLocalVideoMount, onRemoteVideoMount }
}
