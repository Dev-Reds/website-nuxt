import { hset, hdel, hgetall } from './db'

const TIMEOUT = 30000

export async function heartbeat(id: string) {
  await hset('sessions', id, Date.now())
}

export async function removeSession(id: string) {
  await hdel('sessions', id)
}

export async function getOnlineCount(): Promise<number> {
  const s = (await hgetall('sessions')) ?? {}
  const now = Date.now()
  let count = 0
  for (const id of Object.keys(s)) {
    if (now - Number(s[id]) > TIMEOUT) await hdel('sessions', id)
    else count++
  }
  return count
}

export async function userHeartbeat(id: string) {
  const now = Date.now()
  await hset('heartbeats', id, now)
  await hset('lastSeen', id, now)
}

export async function removeUserSession(id: string) {
  await hdel('heartbeats', id)
}

export async function isUserOnline(id: string): Promise<boolean> {
  const hb = (await hgetall('heartbeats')) ?? {}
  const ts = hb[id]
  return ts !== undefined && (Date.now() - Number(ts)) < TIMEOUT
}

export async function getOnlineUserIds(): Promise<string[]> {
  const hb = (await hgetall('heartbeats')) ?? {}
  const now = Date.now()
  const online: string[] = []
  for (const id of Object.keys(hb)) {
    if (now - Number(hb[id]) > TIMEOUT) await hdel('heartbeats', id)
    else online.push(id)
  }
  return online
}

export async function getLastSeenAll(): Promise<Record<string, number>> {
  const ls = (await hgetall('lastSeen')) ?? {}
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(ls)) out[k] = Number(v)
  return out
}
