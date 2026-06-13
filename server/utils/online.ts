const sessions = new Map<string, number>()
const TIMEOUT = 30000

setInterval(() => {
  const now = Date.now()
  for (const [id, ts] of sessions) {
    if (now - ts > TIMEOUT) sessions.delete(id)
  }
}, 10000)

export function heartbeat(id: string) {
  sessions.set(id, Date.now())
}

export function getOnlineCount(): number {
  const now = Date.now()
  for (const [id, ts] of sessions) {
    if (now - ts > TIMEOUT) sessions.delete(id)
  }
  return sessions.size
}
