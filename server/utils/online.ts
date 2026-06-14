const TIMEOUT = 30000

// Anonymous sessions (persistent via db/KV)
export async function heartbeat(id: string) {
  const now = Date.now()
  const s = await db.getSessions()
  s[id] = now
  await db.setSessions(s)
}

export async function removeSession(id: string) {
  const s = await db.getSessions()
  delete s[id]
  await db.setSessions(s)
}

export async function getOnlineCount(): Promise<number> {
  const s = await db.getSessions()
  const now = Date.now()
  let count = 0
  for (const id of Object.keys(s)) {
    if (now - s[id] > TIMEOUT) delete s[id]
    else count++
  }
  if (Object.keys(s).length > 0) await db.setSessions(s)
  return count
}

// User heartbeats (persistent via db/KV)
export async function userHeartbeat(id: string) {
  const now = Date.now()
  const hb = await db.getHeartbeats()
  hb[id] = now
  await db.setHeartbeats(hb)

  const ls = await db.getLastSeen()
  ls[id] = now
  await db.setLastSeen(ls)
}

export async function removeUserSession(id: string) {
  const hb = await db.getHeartbeats()
  delete hb[id]
  await db.setHeartbeats(hb)
}

export async function isUserOnline(id: string): Promise<boolean> {
  const hb = await db.getHeartbeats()
  const ts = hb[id]
  return ts !== undefined && (Date.now() - ts) < TIMEOUT
}

export async function getOnlineUserIds(): Promise<string[]> {
  const hb = await db.getHeartbeats()
  const now = Date.now()
  const online: string[] = []
  for (const id of Object.keys(hb)) {
    if (now - hb[id] > TIMEOUT) delete hb[id]
    else online.push(id)
  }
  if (online.length > 0 || Object.keys(hb).length > 0) await db.setHeartbeats(hb)
  return online
}

export async function getLastSeenAll(): Promise<Record<string, number>> {
  return db.getLastSeen()
}
