import { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

const DATA_DIR = resolve(process.cwd(), '.data')
const DB_FILE = resolve(DATA_DIR, 'db.json')

interface StoredData {
  users: User[]
  chats: Chat[]
  messages: Record<string, Message[]>
  friendRequests: FriendRequest[]
}

function loadData(): StoredData {
  if (!existsSync(DB_FILE)) return { users: [], chats: [], messages: {}, friendRequests: [] }
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf-8'))
  } catch {
    return { users: [], chats: [], messages: {}, friendRequests: [] }
  }
}

function saveData(data: StoredData) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(DB_FILE, JSON.stringify(data), 'utf-8')
}

let stored = loadData()

export const db = {
  getUsers: () => stored.users,
  setUsers: (data: User[]) => {
    stored.users = data
    saveData(stored)
  },
  getChats: () => stored.chats,
  setChats: (data: Chat[]) => {
    stored.chats = data
    saveData(stored)
  },
  getMessages: (chatId: string) => stored.messages[chatId] || [],
  setMessages: (chatId: string, data: Message[]) => {
    stored.messages[chatId] = data
    saveData(stored)
  },
  getFriendRequests: () => stored.friendRequests,
  setFriendRequests: (data: FriendRequest[]) => {
    stored.friendRequests = data
    saveData(stored)
  },
}
