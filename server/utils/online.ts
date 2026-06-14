const sessions = new Map<string, number>()
const userHeartbeats = new Map<string, number>()
const TIMEOUT = 30000

setInterval(() => {
  const now = Date.now()
  for (const [id, ts] of sessions) {
    if (now - ts > TIMEOUT) sessions.delete(id)
  }
  for (const [id, ts] of userHeartbeats) {
    if (now - ts > TIMEOUT) userHeartbeats.delete(id)
  }
}, 10000)

export function heartbeat(id: string) {
  sessions.set(id, Date.now())
}

export function removeSession(id: string) {
  sessions.delete(id)
}

export function userHeartbeat(id: string) {
  userHeartbeats.set(id, Date.now())
}

export function removeUserSession(id: string) {
  userHeartbeats.delete(id)
}

export function isUserOnline(id: string): boolean {
  const ts = userHeartbeats.get(id)
  return ts !== undefined && (Date.now() - ts) < TIMEOUT
}

export function getOnlineCount(): number {
  const now = Date.now()
  for (const [id, ts] of sessions) {
    if (now - ts > TIMEOUT) sessions.delete(id)
  }
  return sessions.size
}

export function getOnlineUserIds(): string[] {
  const now = Date.now()
  const online: string[] = []
  for (const [id, ts] of userHeartbeats) {
    if (now - ts > TIMEOUT) userHeartbeats.delete(id)
    else online.push(id)
  }
  return online
}
