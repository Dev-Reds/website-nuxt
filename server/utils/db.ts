import { createClient } from '@vercel/kv'

const kv = process.env.KV_REST_API_URL
  ? createClient({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
  : null

const local: Record<string, any> = {
  users: [], chats: [], messages: {}, friendRequests: [],
}

async function get<T>(key: string): Promise<T> {
  if (kv) {
    const val = await kv.get(key)
    return (val ?? (key.endsWith('s') || key.startsWith('msg:') ? [] : {})) as T
  }
  return (local[key] ?? (key.endsWith('s') || key.startsWith('msg:') ? [] : {})) as T
}

async function set(key: string, val: any) {
  if (kv) await kv.set(key, val)
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
}
