const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
const useRedis = !!(KV_URL && KV_TOKEN)

const local: Record<string, any> = {
  users: [], chats: [], messages: {}, friendRequests: [], heartbeats: {}, lastSeen: {},
}

async function redisGet(key: string): Promise<string | null> {
  try {
    const url = `${KV_URL}/get/${encodeURIComponent(key)}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.result ?? null
  } catch { return null }
}

async function redisSet(key: string, val: any) {
  try {
    const url = `${KV_URL}/set/${encodeURIComponent(key)}`
    await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(val),
    })
  } catch { /* ignore */ }
}

async function get<T>(key: string): Promise<T> {
  if (useRedis) {
    const raw = await redisGet(key)
    if (raw !== null) {
      try { return JSON.parse(raw) as T } catch { /* fall through */ }
    }
    return (isObj(key) ? {} : key.endsWith('s') || key.startsWith('msg:') ? [] : {}) as T
  }
  const loc = local[key]; if (loc !== undefined) return loc as T
  return (isObj(key) ? {} : key.endsWith('s') || key.startsWith('msg:') ? [] : {}) as T
}

function isObj(key: string) {
  return key === 'heartbeats' || key === 'lastSeen'
}

async function set(key: string, val: any) {
  if (useRedis) await redisSet(key, val)
  else local[key] = val
}

export const db = {
  getUsers:           ()            => get<any[]>('users'),
  setUsers:           (u: any)      => set('users', u),
  getChats:           ()            => get<any[]>('chats'),
  setChats:           (c: any)      => set('chats', c),
  getMessages:        (id: string)  => get<any[]>(`msg:${id}`),
  setMessages:        (id: string, m: any[]) => set(`msg:${id}`, m),
  getFriendRequests:  ()            => get<any[]>('friendRequests'),
  setFriendRequests:  (r: any)      => set('friendRequests', r),
  getHeartbeats:      ()            => get<Record<string,number>>('heartbeats'),
  setHeartbeats:      (h: Record<string,number>) => set('heartbeats', h),
  getLastSeen:        ()            => get<Record<string,number>>('lastSeen'),
  setLastSeen:        (l: Record<string,number>) => set('lastSeen', l),
}
