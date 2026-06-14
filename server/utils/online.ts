// Anonymous sessions (in-memory, acceptable loss)
const sessions = new Map<string, number>()
const SESSION_TIMEOUT = 30000

setInterval(() => {
  const now = Date.now()
  for (const [id, ts] of sessions) {
    if (now - ts > SESSION_TIMEOUT) sessions.delete(id)
  }
}, 10000)

export function heartbeat(id: string) {
  sessions.set(id, Date.now())
}
export function removeSession(id: string) {
  sessions.delete(id)
}
export function getOnlineCount(): number {
  const now = Date.now()
  for (const [id, ts] of sessions) {
    if (now - ts > SESSION_TIMEOUT) sessions.delete(id)
  }
  return sessions.size
}

// User heartbeats (persistent via db/KV)
const TIMEOUT = 30000

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
  await db.setHeartbeats(hb)
  return online
}

export async function getLastSeenAll(): Promise<Record<string, number>> {
  return db.getLastSeen()
}
