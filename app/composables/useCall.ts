import { ref } from 'vue'

const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

const callState = ref({ mode: 'idle', callId: null, partnerId: null, partnerName: '', chatId: null, audioEnabled: true, videoEnabled: false, showInfo: false })
const remoteStream = ref(null)
const localStreamRef = ref(null)

let pc = null
let localStream = null
const processedCallIds = new Set()
let pendingCandidates = []
let processedIceCandidates = new Set()
let bufferedIceCandidates = []
let videoStream = null
let addCallMessageFn = null
let _currentUserId = null
let callStatusInterval = null
let awaitingRenegotiateAnswer = false
let callStartTime = 0
let callDurationInterval = null
const CALL_TIMEOUT = 30000

export function setCallMessageCallback(fn) { addCallMessageFn = fn }

async function addCallMessage(text) {
  if (addCallMessageFn) await addCallMessageFn(text)
}

export function useCall() {

  function cleanupCall() {
    if (pc) { pc.getTransceivers().forEach(t => { if (t.stop) t.stop() }); pc.close(); pc = null }
    if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; localStreamRef.value = null }
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null }
    remoteStream.value = null
    if (callStatusInterval) { clearInterval(callStatusInterval); callStatusInterval = null }
    if (callDurationInterval) { clearInterval(callDurationInterval); callDurationInterval = null }
    callState.value = { mode: 'idle', callId: null, partnerId: null, partnerName: '', chatId: null, audioEnabled: true, videoEnabled: false, showInfo: false }
    processedCallIds.clear()
    processedIceCandidates.clear()
    bufferedIceCandidates = []
    awaitingRenegotiateAnswer = false
  }

  async function processIceCandidates() {
    if (!pc || !callState.value.callId || callState.value.mode === 'idle') return
    try {
      const res = await fetch(`/api/calls?userId=${_currentUserId}`)
      const data = await res.json()
      const call = data.calls.find(c => c.id === callState.value.callId)
      if (!call) return
      const otherCandidates = _currentUserId === call.fromUserId ? (call.toCandidates || []) : (call.fromCandidates || [])
      for (const c of otherCandidates) {
        if (processedIceCandidates.has(c)) continue
        processedIceCandidates.add(c)
        try {
          if (pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(JSON.parse(c))
          } else {
            bufferedIceCandidates.push(c)
          }
        } catch {}
      }
    } catch {}
  }

  async function flushBufferedCandidates() {
    if (!pc || !pc.remoteDescription || !pc.remoteDescription.type || bufferedIceCandidates.length === 0) return
    const toFlush = [...bufferedIceCandidates]
    bufferedIceCandidates = []
    for (const c of toFlush) {
      try { await pc.addIceCandidate(JSON.parse(c)) } catch {}
    }
  }

  async function fetchCallStatus() {
    if (!_currentUserId || !callState.value.callId) return
    let found = false
    try {
      const res = await fetch(`/api/calls?userId=${_currentUserId}`)
      const data = await res.json()
      for (const call of data.calls) {
        if (call.id !== callState.value.callId) continue
        found = true
        // answer received (outgoing → active)
        if ((call.status === 'connected') && callState.value.mode === 'outgoing' && call.answer && pc) {
          try {
            await pc.setRemoteDescription(JSON.parse(call.answer))
            callState.value.mode = 'active'
            startCallDurationTimer()
            await flushBufferedCandidates()
            await processIceCandidates()
            await addCallMessage('📞 Anruf angenommen')
          } catch {}
        }
        // renegotiation — we received a new offer (someone else toggled video)
        if (call.renegotiateOffer && pc && !awaitingRenegotiateAnswer && callState.value.mode === 'active') {
          try {
            await pc.setRemoteDescription(JSON.parse(call.renegotiateOffer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            await fetch('/api/calls', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'renegotiate-answer', callId: callState.value.callId, fromUserId: _currentUserId, sdp: JSON.stringify(answer) })
            })
          } catch {}
        }
        // renegotiation — answer received (we sent the offer)
        if (call.renegotiateAnswer && pc && awaitingRenegotiateAnswer && callState.value.mode === 'active') {
          awaitingRenegotiateAnswer = false
          try {
            await pc.setRemoteDescription(JSON.parse(call.renegotiateAnswer))
          } catch {}
        }
        // ICE candidates
        if (callState.value.mode !== 'idle') {
          await processIceCandidates()
        }
        // remote ended
        if (call.status === 'ended' && callState.value.mode !== 'idle' && callState.value.mode !== 'ended') {
          endCall(true)
          return
        }
      }
      if (!found && callState.value.mode === 'active' && callState.value.callId) {
        await addCallMessage('⚠️ Verbindung zum Server verloren')
        endCall()
      }
    } catch {}
  }

  function startCallDurationTimer() {
    if (callDurationInterval) clearInterval(callDurationInterval)
    callStartTime = Date.now()
    callDurationInterval = setInterval(() => {
      if (callState.value.mode !== 'active') {
        clearInterval(callDurationInterval)
        callDurationInterval = null
        return
      }
      const elapsed = Date.now() - callStartTime
      const mins = Math.floor(elapsed / 60000)
      const secs = Math.floor((elapsed % 60000) / 1000)
      callState.value.showInfo = true
    }, 1000)
  }

  function ensureCallPolling() {
    if (callStatusInterval) return
    callStartTime = Date.now()
    fetchCallStatus()
    callStatusInterval = setInterval(async () => {
      if (!_currentUserId || !callState.value.callId || callState.value.mode === 'idle' || callState.value.mode === 'ended') {
        clearInterval(callStatusInterval); callStatusInterval = null; return
      }
      // timeout if no answer for 30s in outgoing mode
      if (callState.value.mode === 'outgoing' && Date.now() - callStartTime > CALL_TIMEOUT) {
        await addCallMessage('⏱ Keine Antwort – Anruf beendet')
        endCall()
        return
      }
      await fetchCallStatus()
    }, 200)
  }

  async function startCall(partnerId, partnerName, chatId, userId) {
    if (callState.value.mode !== 'idle') return
    _currentUserId = userId
    callState.value = { mode: 'outgoing', callId: null, partnerId, partnerName, chatId, audioEnabled: true, videoEnabled: false, showInfo: false }
    pendingCandidates = []
    bufferedIceCandidates = []
    processedIceCandidates.clear()
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      localStreamRef.value = localStream
      pc = new RTCPeerConnection(rtcConfig)
      localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
      pc.ontrack = (e) => { remoteStream.value = e.streams[0] }
      pc.oniceconnectionstatechange = () => {
        if (pc?.iceConnectionState === 'failed' || pc?.iceConnectionState === 'disconnected') {
          if (callState.value.mode === 'active') {
            addCallMessage('⚠️ Verbindung getrennt')
            endCall()
          }
        }
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
      pc.onconnectionstatechange = () => {
        if (pc?.connectionState === 'failed' || pc?.connectionState === 'disconnected') {
          if (callState.value.mode === 'active') {
            addCallMessage('⚠️ Verbindung getrennt')
            endCall()
          }
        }
      }
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      const res = await fetch('/api/calls', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', fromUserId: _currentUserId, toUserId: partnerId, chatId: chatId, sdp: JSON.stringify(pc.localDescription) })
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
      localStreamRef.value = localStream
      pc = new RTCPeerConnection(rtcConfig)
      localStream.getTracks().forEach(t => pc.addTrack(t, localStream))
      pc.ontrack = (e) => { remoteStream.value = e.streams[0] }
      pc.oniceconnectionstatechange = () => {
        if (pc?.iceConnectionState === 'failed' || pc?.iceConnectionState === 'disconnected') {
          if (callState.value.mode === 'active') {
            addCallMessage('⚠️ Verbindung getrennt')
            endCall()
          }
        }
      }
      pc.onconnectionstatechange = () => {
        if (pc?.connectionState === 'failed' || pc?.connectionState === 'disconnected') {
          if (callState.value.mode === 'active') {
            addCallMessage('⚠️ Verbindung getrennt')
            endCall()
          }
        }
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
        // Process any ICE candidates that arrived before remote description
        await processIceCandidates()
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        const ansRes = await fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'answer', callId: callState.value.callId, fromUserId: _currentUserId, sdp: JSON.stringify(pc.localDescription) })
        })
        const ansData = await ansRes.json()
        if (ansData.error) throw new Error('Server: ' + ansData.error)
        callState.value.mode = 'active'
        startCallDurationTimer()
        await flushBufferedCandidates()
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

  async function endCall(fromRemote = false) {
    if (pc) {
      pc.getTransceivers().forEach(t => { if (t.stop) t.stop() })
      pc.close(); pc = null
    }
    if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; localStreamRef.value = null }
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null }
    remoteStream.value = null
    if (callDurationInterval) { clearInterval(callDurationInterval); callDurationInterval = null }
    // only notify server if we initiated the end (not already ended on server)
    if (!fromRemote && callState.value.callId) {
      try {
        await fetch('/api/calls', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'end', callId: callState.value.callId, fromUserId: _currentUserId })
        })
      } catch {}
    }
    if (!fromRemote) {
      await addCallMessage('🔴 Anruf beendet')
    }
    if (callStatusInterval) { clearInterval(callStatusInterval); callStatusInterval = null }
    awaitingRenegotiateAnswer = false
    callState.value = { ...callState.value, mode: 'ended', callId: null, audioEnabled: true, videoEnabled: false, showInfo: false }
    processedIceCandidates.clear()
    bufferedIceCandidates = []
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
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      callState.value.videoEnabled = videoTrack.enabled
      return
    }
    awaitingRenegotiateAnswer = true
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
          body: JSON.stringify({ action: 'renegotiate-offer', callId: callState.value.callId, fromUserId: _currentUserId, sdp: JSON.stringify(offer) })
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
          callState.value = { mode: 'incoming', callId: call.id, partnerId: call.fromUserId, partnerName: caller?.name || 'Unbekannt', chatId: call.chatId || null, audioEnabled: true, videoEnabled: false, showInfo: false }
          ensureCallPolling()
          await addCallMessage('📞 Eingehender Anruf von ' + (caller?.name || 'Unbekannt'))
        }
        // if ensureCallPolling is active, it handles answer/ICE/end — skip to avoid duplicates
        if (callStatusInterval) continue
        if ((call.status === 'answered' || call.status === 'connected') && callState.value.callId === call.id) {
          if (callState.value.mode === 'outgoing' && call.answer && pc) {
            try {
              const desc = JSON.parse(call.answer)
              await pc.setRemoteDescription(desc)
              callState.value.mode = 'active'
              startCallDurationTimer()
              await flushBufferedCandidates()
              await processIceCandidates()
              await addCallMessage('📞 Anruf angenommen')
            } catch {}
          }
          if (callState.value.mode !== 'idle') {
            await processIceCandidates()
          }
        }
        if (call.status === 'ended' && callState.value.callId === call.id && callState.value.mode !== 'idle' && callState.value.mode !== 'ended') {
          endCall(true)
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
