<template>
  <div class="account-button" v-if="currentUser" @click="showMenu = !showMenu">
    <div class="account-av" :style="avatarBg(currentUser)">
      <img v-if="currentUser.avatar" :src="currentUser.avatar" class="av-img"/>
      <span v-else>{{ currentUser.name[0].toUpperCase() }}</span>
    </div>
    <div v-if="showMenu" class="account-menu" @click.stop>
      <div class="menu-section">
        <div class="profile-av-wrap">
          <div class="profile-av" :style="avatarBg(currentUser)">
            <img v-if="currentUser.avatar" :src="currentUser.avatar" class="av-img"/>
            <span v-else>{{ currentUser.name[0].toUpperCase() }}</span>
          </div>
          <button class="change-av-btn" @click.stop="avatarInput.click()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange"/>
          <button v-if="currentUser.avatar" class="remove-av-btn" @click.stop="removeAvatar">×</button>
        </div>
        <input v-model="profileName" class="profile-name-input" :placeholder="t('account.yourName')" @keyup.enter="saveProfile"/>
        <p v-if="profileMsg" :class="['profile-msg', profileMsgOk ? 'ok' : 'err']">{{ profileMsg }}</p>
        <button class="save-btn" @click.stop="saveProfile">{{ t('account.save') }}</button>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item" @click.stop="handleLogout">{{ t('account.logout') }}</div>
    </div>
  </div>
  <div v-else class="account-button" @click="showLogin = !showLogin">
    <div class="account-av guest">{{ t('account.guest') }}</div>
    <div v-if="showLogin" class="account-menu login-menu" @click.stop>
      <div class="login-tabs">
        <button :class="['tab', { active: loginMode === 'login' }]" @click.stop="loginMode = 'login'">{{ t('account.login') }}</button>
        <button :class="['tab', { active: loginMode === 'register' }]" @click.stop="loginMode = 'register'">{{ t('account.register') }}</button>
      </div>
      <div v-if="loginMode === 'login'" class="login-form">
        <input v-model="loginEmail" type="email" :placeholder="t('account.email')" @keyup.enter="doLogin">
        <input v-model="loginPassword" type="password" :placeholder="t('account.password')" @keyup.enter="doLogin">
        <button @click.stop="doLogin" class="login-btn">{{ t('account.login') }}</button>
      </div>
      <div v-else class="login-form">
        <input v-model="regName" :placeholder="t('account.name')" @keyup.enter="doRegister">
        <input v-model="regEmail" type="email" :placeholder="t('account.email')" @keyup.enter="doRegister">
        <input v-model="regPassword" type="password" :placeholder="t('account.password')" @keyup.enter="doRegister">
        <button @click.stop="doRegister" class="login-btn">{{ t('account.register') }}</button>
      </div>
      <div v-if="error" class="login-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
const { currentUser, login, register, logout, restore } = useAuth()
const { t } = useLanguage()

const showMenu = ref(false)
const showLogin = ref(false)
const loginMode = ref('login')
const loginEmail = ref('')
const loginPassword = ref('')
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const error = ref('')
const profileName = ref('')
const profileMsg = ref('')
const profileMsgOk = ref(false)
const avatarInput = ref(null)

onMounted(() => { restore() })

watch(currentUser, (u) => {
  if (u) profileName.value = u.name
}, { immediate: true })

function closeAll() { showMenu.value = false; showLogin.value = false; error.value = '' }

async function doLogin() {
  error.value = ''
  if (!loginEmail.value || !loginPassword.value) { error.value = t('account.allRequired'); return }
  try {
    await login(loginEmail.value, loginPassword.value)
    closeAll()
  } catch (e) { error.value = e.message }
}

async function doRegister() {
  error.value = ''
  if (!regName.value || !regEmail.value || !regPassword.value) { error.value = t('account.allRequired'); return }
  if (regPassword.value.length < 6) { error.value = t('account.passwordLength'); return }
  try {
    await register(regName.value, regEmail.value, regPassword.value)
    closeAll()
  } catch (e) { error.value = e.message }
}

async function handleLogout() {
  await logout()
  closeAll()
}

async function onAvatarChange(e) {
  const file = e.target.files[0]; if (!file) return
  if (file.size > 2 * 1024 * 1024) return
  const reader = new FileReader()
  reader.onload = async (ev) => {
    const dataUrl = ev.target.result
    currentUser.value = { ...currentUser.value, avatar: dataUrl }
    const r = await fetch('/api/users'); const users = await r.json()
    const i = users.findIndex(x => x.id === currentUser.value.id)
    if (i !== -1) { users[i].avatar = dataUrl; await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(users) }) }
  }
  reader.readAsDataURL(file)
}

async function removeAvatar() {
  currentUser.value = { ...currentUser.value, avatar: null }
  const r = await fetch('/api/users'); const users = await r.json()
  const i = users.findIndex(x => x.id === currentUser.value.id)
  if (i !== -1) { users[i].avatar = null; await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(users) }) }
}

async function saveProfile() {
  profileMsg.value = ''
  if (!profileName.value.trim()) { profileMsg.value = t('account.nameRequired'); profileMsgOk.value = false; return }
  const r = await fetch('/api/users'); const users = await r.json()
  const i = users.findIndex(x => x.id === currentUser.value.id)
  if (i !== -1) { users[i].name = profileName.value.trim(); await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(users) }) }
  currentUser.value = { ...currentUser.value, name: profileName.value.trim() }
  profileMsg.value = t('account.saved'); profileMsgOk.value = true
  setTimeout(() => { profileMsg.value = '' }, 2000)
}

const cols = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9','#82E0AA','#F8C471','#FFB347']
function avatarBg(user) {
  if (!user || user?.avatar) return {}
  if (!user.name) return { background: '#3d1a1a' }
  let h = 0; for (let i = 0; i < user.name.length; i++) h = user.name.charCodeAt(i) + ((h<<5)-h)
  return { background: cols[Math.abs(h) % cols.length] }
}
</script>

<style scoped>
.account-button {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 10000;
  cursor: pointer;
}

.account-av {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  overflow: hidden;
  background: #3d1a1a;
  border: 2px solid rgb(188, 0, 0);
}

.av-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.account-av:hover {
  opacity: .85;
}

.account-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  min-width: 200px;
  z-index: 10001;
  overflow: hidden;
}

.menu-item {
  padding: 10px 16px;
  cursor: pointer;
  color: #ccc;
  font-size: 14px;
}

.menu-item:hover {
  background: #333;
  color: #fff;
}

.menu-section {
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.profile-av-wrap {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  position: relative;
}

.profile-av {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: white;
  overflow: hidden;
}

.change-av-btn {
  background: #333;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ccc;
  position: absolute;
  bottom: 0;
  right: -8px;
}

.change-av-btn:hover {
  background: #555;
  color: #fff;
}

.remove-av-btn {
  background: #c62828;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  position: absolute;
  top: 0;
  right: -6px;
}

.remove-av-btn:hover {
  background: #e53935;
}

.profile-name-input {
  padding: 8px 12px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #0d1117;
  color: #fff;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.profile-name-input:focus {
  border-color: rgb(188, 0, 0);
}

.profile-msg {
  font-size: 12px;
  margin: 0;
}

.profile-msg.ok { color: #4caf50; }
.profile-msg.err { color: #f44336; }

.save-btn {
  padding: 7px 20px;
  background: rgb(188, 0, 0);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.save-btn:hover {
  background: rgb(155, 0, 0);
}

.menu-divider {
  height: 1px;
  background: #333;
}

.login-menu {
  padding: 12px;
}

.login-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
}

.login-tabs .tab {
  flex: 1;
  padding: 6px;
  border: 1px solid #333;
  border-radius: 6px;
  background: none;
  color: #999;
  cursor: pointer;
  font-size: 13px;
}

.login-tabs .tab.active {
  background: rgb(188, 0, 0);
  border-color: rgb(188, 0, 0);
  color: #fff;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-form input {
  padding: 8px 12px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #0d1117;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.login-form input:focus {
  border-color: rgb(188, 0, 0);
}

.login-btn {
  padding: 8px;
  background: rgb(188, 0, 0);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.login-btn:hover {
  background: rgb(155, 0, 0);
}

.login-error {
  color: #f44336;
  font-size: 13px;
  margin-top: 6px;
  text-align: center;
}
</style>
