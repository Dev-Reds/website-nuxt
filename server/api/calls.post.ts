export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action, fromUserId, toUserId, callId, sdp, candidate, chatId } = body
  const calls = await db.getCalls()

  if (action === 'create') {
    const existing = calls.find((c: any) =>
      c.status !== 'ended' &&
      ((c.fromUserId === fromUserId && c.toUserId === toUserId) || (c.fromUserId === toUserId && c.toUserId === fromUserId))
    )
    if (existing) return { call: existing }
    const id = 'call_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
    const call = { id, fromUserId, toUserId, chatId: chatId || null, status: 'ringing', offer: sdp || null, answer: null, fromCandidates: [], toCandidates: [], ts: Date.now() }
    calls.push(call)
    await db.setCalls(calls)
    return { call }
  }

  if (action === 'answer') {
    const call = calls.find((c: any) => c.id === callId)
    if (!call) return { error: 'not found' }
    call.answer = sdp || null
    call.status = 'connected'
    call.ts = Date.now()
    await db.setCalls(calls)
    return { call }
  }

  if (action === 'candidate') {
    const call = calls.find((c: any) => c.id === callId)
    if (!call) return { error: 'not found' }
    if (fromUserId === call.fromUserId) call.fromCandidates.push(candidate)
    else call.toCandidates.push(candidate)
    call.ts = Date.now()
    await db.setCalls(calls)
    return { call }
  }

  if (action === 'renegotiate-offer') {
    const call = calls.find((c: any) => c.id === callId)
    if (!call) return { error: 'not found' }
    call.renegotiateOffer = sdp || null
    call.renegotiateAnswer = null
    call.ts = Date.now()
    await db.setCalls(calls)
    return { call }
  }

  if (action === 'renegotiate-answer') {
    const call = calls.find((c: any) => c.id === callId)
    if (!call) return { error: 'not found' }
    call.renegotiateAnswer = sdp || null
    call.renegotiateOffer = null
    call.ts = Date.now()
    await db.setCalls(calls)
    return { call }
  }

  if (action === 'end' || action === 'reject') {
    const call = calls.find((c: any) => c.id === callId)
    if (!call) return { error: 'not found' }
    call.status = 'ended'
    call.ts = Date.now()
    await db.setCalls(calls)
    return { call }
  }

  return { error: 'invalid action' }
})
