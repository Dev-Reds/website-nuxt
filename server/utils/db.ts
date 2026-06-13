interface User {
  id: string
  name: string
  email: string
  password: string
  online: boolean
  avatar: string | null
}

interface Chat {
  id: string
  type: 'dm' | 'group'
  name: string
  members: string[]
  partnerId?: string
  createdBy: string
  createdAt: number
}

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  ts: number
  read: boolean
}

interface FriendRequest {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: number
}

const _users: User[] = []
const _chats: Chat[] = []
const _messages: Record<string, Message[]> = {}
const _friendRequests: FriendRequest[] = []

export const db = {
  getUsers: () => _users,
  setUsers: (data: User[]) => { _users.splice(0, _users.length, ...data) },
  getChats: () => _chats,
  setChats: (data: Chat[]) => { _chats.splice(0, _chats.length, ...data) },
  getMessages: (chatId: string) => _messages[chatId] || [],
  setMessages: (chatId: string, data: Message[]) => { _messages[chatId] = data },
  getFriendRequests: () => _friendRequests,
  setFriendRequests: (data: FriendRequest[]) => { _friendRequests.splice(0, _friendRequests.length, ...data) },
}
