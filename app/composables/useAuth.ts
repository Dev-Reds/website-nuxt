const SK = 'napp_'

async function apiGet(path: string) { const r = await fetch(path); return r.json() }
async function apiPut(path: string, d: any) { await fetch(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}) }

const api = {
  getUsers:  ()            => apiGet('/api/users'),
  saveUsers: (u: any)      => apiPut('/api/users', u),
}

export const useAuth = () => {
  const user = useState<any>('auth-user', () => null)

  async function restore() {
    if (!process.client) return
    try {
      const sid = sessionStorage.getItem(SK+'session')
      if (sid && !user.value) {
        const users = await api.getUsers()
        const found = users.find((x: any) => x.id === sid)
        if (found) user.value = found
      }
    } catch {}
  }

  async function login(email: string, password: string) {
    const users = await api.getUsers()
    const found = users.find((u: any) => u.email === email && u.password === password)
    if (!found) throw new Error('E-Mail oder Passwort falsch.')
    const i = users.findIndex((x: any) => x.id === found.id)
    if (i !== -1) { users[i].online = true; await api.saveUsers(users) }
    user.value = { ...found, online: true }
    sessionStorage.setItem(SK+'session', found.id)
    return user.value
  }

  async function register(name: string, email: string, password: string) {
    if (!process.client) return
    const users = await api.getUsers()
    if (users.find((u: any) => u.email === email)) throw new Error('E-Mail bereits registriert.')
    const nu = { id: 'u_'+Date.now()+'_'+Math.random().toString(36).slice(2), name, email, password, online: true, avatar: null }
    users.push(nu); await api.saveUsers(users)
    user.value = nu
    sessionStorage.setItem(SK+'session', nu.id)
    return user.value
  }

  async function logout() {
    if (user.value && process.client) {
      const users = await api.getUsers()
      const i = users.findIndex((x: any) => x.id === user.value.id)
      if (i !== -1) { users[i].online = false; await api.saveUsers(users) }
    }
    sessionStorage.removeItem(SK+'session')
    sessionStorage.removeItem(SK+'activeChat')
    user.value = null
  }

  return { currentUser: user, login, register, logout, restore }
}
