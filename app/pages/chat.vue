<template>
  <div class="app-root">
    <!-- Free line spacer -->
    <div class="app-spacer"></div>
    <div class="app-container">
    <!-- Top bar -->
    <div class="top-bar">
      <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#e53935"/><path d="M24 8C15.163 8 8 15.163 8 24c0 2.836.745 5.5 2.05 7.813L8 40l8.45-2.013A15.93 15.93 0 0024 40c8.837 0 16-7.163 16-16S32.837 8 24 8z" fill="white" fill-opacity=".9"/></svg>
      <span>NachrichtenApp</span>
    </div>
    <div class="app-inner">

    <!-- ═══ AUTH ═══ -->
    <div v-if="!currentUser" class="auth-screen">
      <div class="auth-bg"><div class="b b1"/><div class="b b2"/><div class="b b3"/></div>
      <div class="auth-card">
        <div class="auth-logo">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="13" fill="#e53935"/>
            <path d="M24 8C15.163 8 8 15.163 8 24c0 2.836.745 5.5 2.05 7.813L8 40l8.45-2.013A15.93 15.93 0 0024 40c8.837 0 16-7.163 16-16S32.837 8 24 8z" fill="white" fill-opacity=".9"/>
            <path d="M19 18.5c-.4-1-.8-1.02-1.18-1.04-.31-.01-.66-.01-1.01-.01-.35 0-.92.13-1.4.66-.48.53-1.84 1.8-1.84 4.38s1.88 5.08 2.14 5.43c.26.35 3.65 5.84 8.99 7.96 4.45 1.76 5.34 1.41 6.3 1.32.96-.09 3.1-1.27 3.54-2.49.44-1.22.44-2.27.31-2.49-.13-.22-.48-.35-1.01-.61-.53-.26-3.1-1.53-3.58-1.7-.48-.18-.83-.26-1.18.26-.35.53-1.36 1.7-1.66 2.05-.31.35-.61.4-1.14.13-.53-.26-2.23-.82-4.25-2.62-1.57-1.4-2.63-3.13-2.94-3.66-.31-.53-.03-.81.23-1.07.24-.24.53-.61.79-.92.26-.31.35-.53.53-.88.18-.35.09-.66-.04-.92-.14-.26-1.15-2.87-1.6-3.92z" fill="#e53935"/>
          </svg>
          <h1>NachrichtenApp</h1>
        </div>
        <p class="auth-sub">Melde dich an oder erstelle ein Konto</p>
        <div class="auth-tabs">
          <button :class="['tab',{active:authMode==='login'}]" @click="authMode='login'">Anmelden</button>
          <button :class="['tab',{active:authMode==='register'}]" @click="authMode='register'">Registrieren</button>
        </div>
        <div v-if="authMode==='login'">
          <div class="field"><label>E-Mail</label><input v-model="loginEmail" type="email" placeholder="name@beispiel.de" @keyup.enter="handleLogin"/></div>
          <div class="field"><label>Passwort</label><input v-model="loginPassword" type="password" placeholder="••••••••" @keyup.enter="handleLogin"/></div>
          <p v-if="authError" class="auth-error">{{ authError }}</p>
          <button class="btn-primary" @click="handleLogin">Anmelden</button>
        </div>
        <div v-else>
          <div class="field"><label>Name</label><input v-model="regName" type="text" placeholder="Dein Name" @keyup.enter="handleRegister"/></div>
          <div class="field"><label>E-Mail</label><input v-model="regEmail" type="email" placeholder="name@beispiel.de" @keyup.enter="handleRegister"/></div>
          <div class="field"><label>Passwort</label><input v-model="regPassword" type="password" placeholder="Mindestens 6 Zeichen" @keyup.enter="handleRegister"/></div>
          <p v-if="authError" class="auth-error">{{ authError }}</p>
          <button class="btn-primary" @click="handleRegister">Konto erstellen</button>
        </div>
        <p class="demo-hint">💡 Tipp: Mehrere Tabs mit verschiedenen E-Mails öffnen</p>
      </div>
    </div>

    <!-- ═══ APP ═══ -->
    <div v-else class="chat-app">

      <!-- ── SIDEBAR ── -->
      <div :class="['sidebar',{'sidebar-open':mobileSidebarOpen}]">
        <div class="sidebar-header">
          <!-- Avatar – click to open profile modal -->
          <div class="av sm clickable" :style="avatarStyle(currentUser)" @click="showProfile=true">
            <img v-if="currentUser.avatar" :src="currentUser.avatar" class="av-img"/>
            <span v-else>{{ currentUser.name[0].toUpperCase() }}</span>
          </div>
          <div class="user-info">
            <span class="user-name">{{ currentUser.name }}</span>
            <span class="user-status">● Online</span>
          </div>
          <button class="icon-btn" @click="openNewChatModal" title="Neuer Chat / Gruppe">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="10" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <button class="icon-btn" @click="logout" title="Abmelden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        </div>

        <div class="chat-list">
          <div v-if="chatList.length===0" class="no-chats">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3d1a1a" stroke-width="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="10" y1="11" x2="14" y2="11"/>
            </svg>
            <p>Noch keine Chats.</p>
            <p>Klicke auf <strong>+</strong> um zu starten.</p>
          </div>
          <div
            v-for="chat in chatList" :key="chat.id"
            :class="['chat-item',{active:activeChatId===chat.id}]"
            @click="selectChat(chat.id)"
          >
            <div v-if="chat.type==='group'" class="av group-av">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div v-else class="av" :style="avatarStyle(getPartnerUser(chat))">
              <img v-if="getPartnerUser(chat)?.avatar" :src="getPartnerUser(chat).avatar" class="av-img"/>
              <span v-else>{{ chat.displayName[0].toUpperCase() }}</span>
              <span :class="['dot',{online:isOnline(chat.partnerId)}]"></span>
            </div>
            <div class="chat-info">
              <div class="chat-top">
                <span class="chat-name">{{ chat.displayName }}</span>
                <span class="chat-time">{{ lastMsgTime(chat.id) }}</span>
              </div>
              <div v-if="chat.type==='group'" class="chat-sub">{{ chat.members.length }} Mitglieder</div>
              <div class="chat-preview">{{ lastMsg(chat.id) }}</div>
            </div>
            <div v-if="unread(chat.id)>0" class="badge">{{ unread(chat.id) }}</div>
          </div>
        </div>
      </div>

      <!-- ── CHAT WINDOW ── -->
      <div class="chat-window">
        <!-- Empty state -->
        <div v-if="!activeChatId" class="no-chat">
          <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="#e53935" fill-opacity=".1"/>
            <path d="M24 8C15.163 8 8 15.163 8 24c0 2.836.745 5.5 2.05 7.813L8 40l8.45-2.013A15.93 15.93 0 0024 40c8.837 0 16-7.163 16-16S32.837 8 24 8z" fill="#e53935" fill-opacity=".35"/>
          </svg>
          <h2>NachrichtenApp</h2>
          <p>Klicke auf <strong>+</strong> um einen Chat<br>oder eine Gruppe zu starten.</p>
        </div>

        <template v-else>
          <!-- Header -->
          <div class="chat-header">
            <button class="icon-btn mobile-back" @click="mobileSidebarOpen=true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div v-if="activeChat?.type==='group'" class="av sm group-av">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div v-else class="av sm" :style="avatarStyle(getPartnerUser(activeChat))">
              <img v-if="getPartnerUser(activeChat)?.avatar" :src="getPartnerUser(activeChat).avatar" class="av-img"/>
              <span v-else>{{ activeChat?.displayName?.[0]?.toUpperCase()?? '?' }}</span>
            </div>
            <div class="header-info">
              <span class="header-name">{{ activeChat?.displayName }}</span>
              <span class="header-sub">
                <template v-if="activeChat?.type==='group'">{{ activeChat.members.length }} Mitglieder</template>
                <template v-else>{{ isOnline(activeChat?.partnerId) ? 'Online' : 'Zuletzt online kürzlich' }}</template>
              </span>
            </div>
            <button v-if="activeChat?.type==='group'" class="icon-btn" @click="showGroupInfo=true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </button>
          </div>

          <!-- Messages — no background pattern -->
          <div class="messages-area" ref="messagesArea">
            <div class="messages-inner">
              <div v-if="activeMessages.length===0" class="empty-chat">
                <span>Noch keine Nachrichten. Schreibe etwas!</span>
              </div>
              <template v-for="(msg,i) in activeMessages" :key="msg.id">
                <div v-if="showDivider(i)" class="date-divider"><span>{{ fmtDate(msg.ts) }}</span></div>
                <div :class="['msg-row', msg.senderId===currentUser.id ? 'own':'other']">
                  <div v-if="activeChat?.type==='group' && msg.senderId!==currentUser.id"
                    class="msg-av" :style="avatarStyle(getUserById(msg.senderId))">
                    <img v-if="getUserById(msg.senderId)?.avatar" :src="getUserById(msg.senderId).avatar" class="av-img"/>
                    <span v-else>{{ msg.senderName[0].toUpperCase() }}</span>
                  </div>
                  <div class="bubble">
                    <span v-if="activeChat?.type==='group' && msg.senderId!==currentUser.id"
                      class="sender-name" :style="{ color: color(msg.senderName) }">{{ msg.senderName }}</span>
                    <span class="msg-text">{{ msg.text }}</span>
                    <div class="msg-meta">
                      <span class="msg-time">{{ fmtTime(msg.ts) }}</span>
                      <span v-if="msg.senderId===currentUser.id" class="tick">
                        <svg v-if="msg.read" width="16" height="10" viewBox="0 0 16 10" fill="#ff8a80"><path d="M15.01 1.02L5.63 9.6l-.9-.85L14.16.17l.85.85zM10.93 9.6L1.55.17.7 1.02l9.38 8.58.85-.85zM5.63 7.76L1.55 3.98.7 4.83l4.93 4.77.85-.84z"/></svg>
                        <svg v-else width="16" height="10" viewBox="0 0 16 10" fill="#8696a0"><path d="M10.91 3.316l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Input -->
          <div class="input-area">
            <button class="icon-btn emoji-btn" @click.stop="showEmoji=!showEmoji">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
            </button>
            <div v-if="showEmoji" class="emoji-picker">
              <span v-for="e in emojis" :key="e" @click="addEmoji(e)">{{ e }}</span>
            </div>
            <input ref="msgInput" v-model="newMsg" class="msg-input" placeholder="Nachricht eingeben..." @keyup.enter="sendMessage"/>
            <button class="send-btn" :disabled="!newMsg.trim()" @click="sendMessage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- ═══ PROFILE MODAL ═══ -->
    <div v-if="showProfile" class="modal-overlay" @click.self="showProfile=false">
      <div class="modal">
        <div class="modal-header">
          <h3>Mein Profil</h3>
          <button class="icon-btn" @click="showProfile=false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Avatar preview + upload -->
        <div class="profile-av-wrap">
          <div class="profile-av" :style="avatarStyle(currentUser)">
            <img v-if="currentUser.avatar" :src="currentUser.avatar" class="av-img"/>
            <span v-else>{{ currentUser.name[0].toUpperCase() }}</span>
          </div>
          <button class="change-av-btn" @click="$refs.avatarInput.click()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Foto ändern
          </button>
          <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange"/>
          <button v-if="currentUser.avatar" class="remove-av-btn" @click="removeAvatar">Foto entfernen</button>
        </div>

        <div class="field" style="margin-top:4px">
          <label>Name</label>
          <input v-model="profileName" type="text" placeholder="Dein Name"/>
        </div>
        <div class="field">
          <label>E-Mail</label>
          <input :value="currentUser.email" type="email" disabled style="opacity:.5;cursor:not-allowed"/>
        </div>
        <p v-if="profileMsg" :class="['profile-msg', profileMsgOk ? 'ok':'err']">{{ profileMsg }}</p>
        <button class="btn-primary" @click="saveProfile" style="margin-top:4px">Speichern</button>
      </div>
    </div>

    <!-- ═══ NEW CHAT MODAL ═══ -->
    <div v-if="showNewChat" class="modal-overlay" @click.self="closeNewChat">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ newChatMode==='dm' ? 'Neuer Chat' : 'Neue Gruppe' }}</h3>
          <button class="icon-btn" @click="closeNewChat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-tabs">
          <button :class="['tab',{active:newChatMode==='dm'}]" @click="newChatMode='dm';resetModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
            Direktnachricht
          </button>
          <button :class="['tab',{active:newChatMode==='group'}]" @click="newChatMode='group';resetModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            Neue Gruppe
          </button>
        </div>

        <div v-if="newChatMode==='group'" class="field">
          <label>Gruppenname</label>
          <input v-model="newGroupName" type="text" placeholder="z.B. Familie, Freunde…"/>
        </div>

        <div v-if="newChatMode==='group' && selectedMembers.length>0" class="selected-members">
          <div v-for="m in selectedMembers" :key="m.id" class="member-chip">
            <div class="chip-av" :style="avatarStyle(m)">
              <img v-if="m.avatar" :src="m.avatar" class="av-img"/>
              <span v-else>{{ m.name[0].toUpperCase() }}</span>
            </div>
            <span>{{ m.name }}</span>
            <button @click="toggleMember(m)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="modal-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input v-model="modalSearch" placeholder="Name eingeben…" @input="doModalSearch"/>
        </div>

        <div class="modal-user-list">
          <div v-if="!modalSearch" class="search-hint">Tippe einen Namen ein, um Nutzer zu finden.</div>
          <div v-else-if="modalUserResults.length===0" class="search-empty">Kein Nutzer gefunden.</div>
          <div
            v-for="user in modalUserResults" :key="user.id"
            :class="['modal-user-item',{selected:isMemberSelected(user)}]"
            @click="onUserClick(user)"
          >
            <div class="av sm" :style="avatarStyle(user)">
              <img v-if="user.avatar" :src="user.avatar" class="av-img"/>
              <span v-else>{{ user.name[0].toUpperCase() }}</span>
              <span :class="['dot',{online:user.online}]"></span>
            </div>
            <div class="modal-user-info">
              <span class="modal-user-name">{{ user.name }}</span>
              <span v-if="hasDuplicate(user.name)" class="modal-user-id">ID: {{ user.id.slice(-8) }}</span>
            </div>
            <div v-if="newChatMode==='group'" class="checkbox" :class="{checked:isMemberSelected(user)}">
              <svg v-if="isMemberSelected(user)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e53935" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
        </div>

        <button v-if="newChatMode==='group'" class="btn-primary" :disabled="selectedMembers.length===0||!newGroupName.trim()" @click="createGroup" style="margin-top:14px">
          Gruppe erstellen ({{ selectedMembers.length+1 }} Mitglieder)
        </button>
      </div>
    </div>

    <!-- ═══ GROUP INFO MODAL ═══ -->
    <div v-if="showGroupInfo && activeChat" class="modal-overlay" @click.self="showGroupInfo=false">
      <div class="modal">
        <div class="modal-header">
          <div style="display:flex;align-items:center;gap:12px">
            <div class="av sm group-av">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div>
              <h3>{{ activeChat.displayName }}</h3>
              <p style="font-size:12px;color:#8696a0;margin-top:2px">{{ activeChat.members.length }} Mitglieder</p>
            </div>
          </div>
          <button class="icon-btn" @click="showGroupInfo=false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-user-list" style="margin-top:10px">
          <div v-for="mid in activeChat.members" :key="mid" class="modal-user-item">
            <div class="av sm" :style="avatarStyle(getUserById(mid))">
              <img v-if="getUserById(mid)?.avatar" :src="getUserById(mid).avatar" class="av-img"/>
              <span v-else>{{ getMemberName(mid)[0]?.toUpperCase() }}</span>
              <span :class="['dot',{online:isOnline(mid)}]"></span>
            </div>
            <div class="modal-user-info">
              <span class="modal-user-name">{{ getMemberName(mid) }}</span>
              <span v-if="mid===currentUser.id" class="role-tag you">Du</span>
              <span v-else-if="mid===activeChat.createdBy" class="role-tag admin">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div><!-- /app-inner -->
    </div><!-- /app-container -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const SK = 'napp_'

// ── AUTH ───────────────────────────────────────────────────────────────
const authMode     = ref('login')
const loginEmail   = ref(''); const loginPassword = ref('')
const regName      = ref(''); const regEmail = ref(''); const regPassword = ref('')
const authError    = ref('')
const currentUser  = ref(null)

// ── CHAT ───────────────────────────────────────────────────────────────
const allUsers      = ref([])
const chats         = ref([])
const messages      = reactive({})
const unreadCounts  = reactive({})
const activeChatId  = ref(null)
const newMsg        = ref('')
const mobileSidebarOpen = ref(false)
const showEmoji     = ref(false)
const messagesArea  = ref(null)
const msgInput      = ref(null)
const pollInterval  = ref(null)
const emojis = ['😀','😂','😍','🥰','😊','👍','❤️','🔥','🎉','😎','🤔','😅','👋','✨','💯','🙏','😭','🥳','👀','💪']

// ── MODALS ─────────────────────────────────────────────────────────────
const showNewChat      = ref(false)
const newChatMode      = ref('dm')
const newGroupName     = ref('')
const modalSearch      = ref('')
const modalUserResults = ref([])
const selectedMembers  = ref([])
const showGroupInfo    = ref(false)

// profile
const showProfile  = ref(false)
const profileName  = ref('')
const profileMsg   = ref('')
const profileMsgOk = ref(false)
const avatarInput  = ref(null)

// ── COMPUTED ───────────────────────────────────────────────────────────
const chatList = computed(() =>
  chats.value
    .filter(c => c.members.includes(currentUser.value?.id))
    .map(c => {
      if (c.type === 'group') return { ...c, displayName: c.name }
      const partner = allUsers.value.find(u => u.id === c.partnerId)
      return { ...c, displayName: partner?.name || 'Unbekannt' }
    })
    .sort((a, b) => {
      const at = (messages[a.id] || []).at(-1)?.ts || a.createdAt || 0
      const bt = (messages[b.id] || []).at(-1)?.ts || b.createdAt || 0
      return bt - at
    })
)
const activeChat     = computed(() => chatList.value.find(c => c.id === activeChatId.value) || null)
const activeMessages = computed(() => messages[activeChatId.value] || [])

// ── STORAGE ────────────────────────────────────────────────────────────
const getUsers  = ()      => { try { return JSON.parse(localStorage.getItem(SK+'users')  || '[]') } catch { return [] } }
const saveUsers = u       => localStorage.setItem(SK+'users',  JSON.stringify(u))
const getChats  = ()      => { try { return JSON.parse(localStorage.getItem(SK+'chats')  || '[]') } catch { return [] } }
const saveChats = c       => localStorage.setItem(SK+'chats',  JSON.stringify(c))
const getMsgs   = id      => { try { return JSON.parse(localStorage.getItem(SK+'m_'+id)  || '[]') } catch { return [] } }
const saveMsgs  = (id, m) => localStorage.setItem(SK+'m_'+id, JSON.stringify(m))

// ── AUTH ───────────────────────────────────────────────────────────────
function handleLogin() {
  authError.value = ''
  if (!loginEmail.value || !loginPassword.value) { authError.value = 'Bitte alle Felder ausfüllen.'; return }
  const u = getUsers().find(u => u.email === loginEmail.value && u.password === loginPassword.value)
  if (!u) { authError.value = 'E-Mail oder Passwort falsch.'; return }
  loginUser(u)
}
function handleRegister() {
  authError.value = ''
  if (!regName.value || !regEmail.value || !regPassword.value) { authError.value = 'Bitte alle Felder ausfüllen.'; return }
  if (regPassword.value.length < 6) { authError.value = 'Passwort muss mindestens 6 Zeichen haben.'; return }
  const users = getUsers()
  if (users.find(u => u.email === regEmail.value)) { authError.value = 'E-Mail bereits registriert.'; return }
  const nu = { id: 'u_'+Date.now()+'_'+Math.random().toString(36).slice(2), name: regName.value, email: regEmail.value, password: regPassword.value, online: true, avatar: null }
  users.push(nu); saveUsers(users); loginUser(nu)
}
function loginUser(u) {
  const users = getUsers(); const i = users.findIndex(x => x.id === u.id)
  if (i !== -1) { users[i].online = true; saveUsers(users); u = { ...u, ...users[i] } }
  u.online = true; currentUser.value = u
  profileName.value = u.name
  sessionStorage.setItem(SK+'session', JSON.stringify(u))
  loadData(); startPoll()
}
function logout() {
  clearInterval(pollInterval.value)
  const users = getUsers(); const i = users.findIndex(x => x.id === currentUser.value?.id)
  if (i !== -1) { users[i].online = false; saveUsers(users) }
  sessionStorage.removeItem(SK+'session')
  currentUser.value = null; activeChatId.value = null
  chats.value = []; Object.keys(messages).forEach(k => delete messages[k])
}

// ── PROFILE ────────────────────────────────────────────────────────────
function onAvatarChange(e) {
  const file = e.target.files[0]; if (!file) return
  if (file.size > 2 * 1024 * 1024) { profileMsg.value = 'Bild zu groß (max. 2 MB).'; profileMsgOk.value = false; return }
  const reader = new FileReader()
  reader.onload = ev => {
    const dataUrl = ev.target.result
    currentUser.value = { ...currentUser.value, avatar: dataUrl }
    // persist immediately so preview updates
    const users = getUsers(); const i = users.findIndex(x => x.id === currentUser.value.id)
    if (i !== -1) { users[i].avatar = dataUrl; saveUsers(users) }
    sessionStorage.setItem(SK+'session', JSON.stringify(currentUser.value))
  }
  reader.readAsDataURL(file)
}
function removeAvatar() {
  currentUser.value = { ...currentUser.value, avatar: null }
  const users = getUsers(); const i = users.findIndex(x => x.id === currentUser.value.id)
  if (i !== -1) { users[i].avatar = null; saveUsers(users) }
  sessionStorage.setItem(SK+'session', JSON.stringify(currentUser.value))
}
function saveProfile() {
  profileMsg.value = ''
  if (!profileName.value.trim()) { profileMsg.value = 'Name darf nicht leer sein.'; profileMsgOk.value = false; return }
  const users = getUsers(); const i = users.findIndex(x => x.id === currentUser.value.id)
  if (i !== -1) { users[i].name = profileName.value.trim(); saveUsers(users) }
  currentUser.value = { ...currentUser.value, name: profileName.value.trim() }
  sessionStorage.setItem(SK+'session', JSON.stringify(currentUser.value))
  profileMsg.value = 'Gespeichert ✓'; profileMsgOk.value = true
  setTimeout(() => { profileMsg.value = '' }, 2000)
}

// ── DATA ───────────────────────────────────────────────────────────────
function loadData() {
  allUsers.value = getUsers()
  const stored = getChats(); chats.value = stored
  stored.forEach(c => { messages[c.id] = getMsgs(c.id) })
}
function startPoll() {
  pollInterval.value = setInterval(() => {
    allUsers.value = getUsers()
    const stored = getChats()
    stored.forEach(c => { if (!chats.value.find(x => x.id === c.id)) { chats.value.push(c); messages[c.id] = [] } })
    chats.value = stored
    stored.forEach(c => {
      if (!c.members.includes(currentUser.value?.id)) return
      const fresh = getMsgs(c.id); const prev = messages[c.id] || []
      if (fresh.length !== prev.length) {
        messages[c.id] = fresh
        if (activeChatId.value !== c.id)
          unreadCounts[c.id] = fresh.filter(m => m.senderId !== currentUser.value.id && !m.read).length
      }
    })
    if (activeChatId.value) { markRead(activeChatId.value); unreadCounts[activeChatId.value] = 0; nextTick(scrollBottom) }
  }, 1000)
}

// ── MESSAGING ──────────────────────────────────────────────────────────
function selectChat(id) {
  activeChatId.value = id; mobileSidebarOpen.value = false
  unreadCounts[id] = 0; markRead(id)
  nextTick(() => { scrollBottom(); msgInput.value?.focus() })
}
function sendMessage() {
  const text = newMsg.value.trim()
  if (!text || !activeChatId.value || !currentUser.value) return
  const msg = { id: 'm_'+Date.now()+'_'+Math.random().toString(36).slice(2), senderId: currentUser.value.id, senderName: currentUser.value.name, text, ts: Date.now(), read: false }
  const stored = getMsgs(activeChatId.value); stored.push(msg); saveMsgs(activeChatId.value, stored)
  if (!messages[activeChatId.value]) messages[activeChatId.value] = []
  messages[activeChatId.value].push(msg)
  newMsg.value = ''; showEmoji.value = false
  nextTick(() => { scrollBottom(); msgInput.value?.focus() })
}
function markRead(chatId) {
  const msgs = getMsgs(chatId); let changed = false
  msgs.forEach(m => { if (m.senderId !== currentUser.value.id && !m.read) { m.read = true; changed = true } })
  if (changed) saveMsgs(chatId, msgs)
}

// ── NEW CHAT ───────────────────────────────────────────────────────────
function openNewChatModal() { newChatMode.value = 'dm'; resetModal(); showNewChat.value = true }
function closeNewChat() { showNewChat.value = false; resetModal() }
function resetModal() { newGroupName.value = ''; modalSearch.value = ''; modalUserResults.value = []; selectedMembers.value = [] }
function doModalSearch() {
  const q = modalSearch.value.trim().toLowerCase()
  if (!q) { modalUserResults.value = []; return }
  modalUserResults.value = allUsers.value.filter(u => u.id !== currentUser.value.id && u.name.toLowerCase().includes(q))
}
function onUserClick(user) {
  if (newChatMode.value === 'dm') {
    const existing = chats.value.find(c => c.type === 'dm' && c.members.includes(user.id) && c.members.includes(currentUser.value.id))
    if (existing) { closeNewChat(); selectChat(existing.id); return }
    const chat = { id: 'c_'+Date.now()+'_'+Math.random().toString(36).slice(2), type: 'dm', name: user.name, members: [currentUser.value.id, user.id], partnerId: user.id, createdBy: currentUser.value.id, createdAt: Date.now() }
    const all = getChats(); all.push(chat); saveChats(all)
    chats.value.push(chat); messages[chat.id] = []
    closeNewChat(); selectChat(chat.id)
  } else { toggleMember(user) }
}
function toggleMember(user) {
  const i = selectedMembers.value.findIndex(m => m.id === user.id)
  if (i === -1) selectedMembers.value.push(user); else selectedMembers.value.splice(i, 1)
}
function isMemberSelected(user) { return selectedMembers.value.some(m => m.id === user.id) }
function createGroup() {
  if (!newGroupName.value.trim() || selectedMembers.value.length === 0) return
  const chat = { id: 'c_'+Date.now()+'_'+Math.random().toString(36).slice(2), type: 'group', name: newGroupName.value.trim(), members: [currentUser.value.id, ...selectedMembers.value.map(m => m.id)], createdBy: currentUser.value.id, createdAt: Date.now() }
  const all = getChats(); all.push(chat); saveChats(all)
  chats.value.push(chat); messages[chat.id] = []
  closeNewChat(); selectChat(chat.id)
}

// ── HELPERS ────────────────────────────────────────────────────────────
function scrollBottom() { if (messagesArea.value) messagesArea.value.scrollTop = messagesArea.value.scrollHeight }
function unread(id) { return unreadCounts[id] || 0 }
function isOnline(uid) { return allUsers.value.find(u => u.id === uid)?.online || false }
function getMemberName(uid) { return allUsers.value.find(u => u.id === uid)?.name || 'Unbekannt' }
function getUserById(uid) { return allUsers.value.find(u => u.id === uid) || null }
function getPartnerUser(chat) { return chat ? allUsers.value.find(u => u.id === chat.partnerId) || null : null }
function hasDuplicate(name) { return allUsers.value.filter(u => u.name === name && u.id !== currentUser.value?.id).length > 1 }
function avatarStyle(user) {
  if (!user || user?.avatar) return {}
  return { background: color(user?.name || '') }
}
function color(name) {
  if (!name) return '#3d1a1a'
  const cols = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9','#82E0AA','#F8C471','#FFB347']
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h<<5)-h)
  return cols[Math.abs(h) % cols.length]
}
function lastMsg(id) {
  const msgs = messages[id] || []; if (!msgs.length) return 'Noch keine Nachrichten'
  const l = msgs[msgs.length-1]
  return (l.senderId === currentUser.value?.id ? 'Du: ' : '') + (l.text.length > 35 ? l.text.slice(0,35)+'…' : l.text)
}
function lastMsgTime(id) { const m = (messages[id]||[]).at(-1); return m ? fmtTime(m.ts) : '' }
function fmtTime(ts)  { return new Date(ts).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) }
function fmtDate(ts)  {
  const d = new Date(ts), t = new Date(), y = new Date(t); y.setDate(t.getDate()-1)
  if (d.toDateString()===t.toDateString()) return 'Heute'
  if (d.toDateString()===y.toDateString()) return 'Gestern'
  return d.toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'})
}
function showDivider(i) {
  if (i===0) return true
  return new Date(activeMessages.value[i].ts).toDateString() !== new Date(activeMessages.value[i-1].ts).toDateString()
}
function addEmoji(e) { newMsg.value += e; showEmoji.value = false; nextTick(()=>msgInput.value?.focus()) }

onMounted(() => {
  try { const s = sessionStorage.getItem(SK+'session'); if (s) loginUser(JSON.parse(s)) } catch {}
  document.addEventListener('click', e => {
    if (!e.target.closest('.emoji-btn') && !e.target.closest('.emoji-picker')) showEmoji.value = false
  })
})
onBeforeUnmount(() => {
  clearInterval(pollInterval.value)
  if (currentUser.value) {
    const u = getUsers(); const i = u.findIndex(x=>x.id===currentUser.value.id)
    if(i!==-1){u[i].online=false;saveUsers(u)}
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.app-root{font-family:'DM Sans',sans-serif;width:100%;height:100vh;background:transparent;display:flex;flex-direction:column;align-items:stretch;color:#e9edef}

/* ONE FREE LINE on top */
.app-spacer{height:36px;flex-shrink:0}

/* MAIN CONTAINER — 90% tall, 100% wide */
.app-container{width:100%;height:90vh;display:flex;flex-direction:column;overflow:hidden}

/* TOP BAR */
.top-bar{height:36px;min-height:36px;background:#e53935;display:flex;align-items:center;gap:8px;padding:0 16px;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.top-bar span{font-size:13px;font-weight:600;color:white;letter-spacing:.3px}

/* APP INNER — fills remaining height */
.app-inner{flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0;background:#1a0a0a}

/* AUTH */
.auth-screen{flex:1;display:flex;align-items:center;justify-content:center;position:relative;background:linear-gradient(135deg,#1a0505,#1a0a0a,#280808)}
.auth-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.b{position:absolute;border-radius:50%;opacity:.08;background:#e53935;animation:float 8s ease-in-out infinite}
.b1{width:400px;height:400px;top:-100px;right:-100px}.b2{width:300px;height:300px;bottom:-80px;left:-80px;animation-delay:3s}.b3{width:200px;height:200px;top:50%;left:60%;animation-delay:6s}
@keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.05)}}
.auth-card{background:#2a1010;border:1px solid #3d1a1a;border-radius:20px;padding:40px 36px;width:100%;max-width:420px;position:relative;z-index:1;box-shadow:0 24px 80px rgba(0,0,0,.5)}
.auth-logo{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.auth-logo h1{font-size:22px;font-weight:600}
.auth-sub{font-size:13px;color:#8696a0;margin-bottom:24px}
.auth-tabs{display:flex;background:#3d1a1a;border-radius:10px;padding:4px;margin-bottom:20px}
.tab{flex:1;padding:8px;border:none;background:transparent;color:#8696a0;border-radius:8px;cursor:pointer;font-size:13.5px;font-weight:500;font-family:inherit;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px}
.tab.active{background:#e53935;color:white}
.field{margin-bottom:14px}
.field label{display:block;font-size:12px;color:#8696a0;margin-bottom:5px;font-weight:500}
.field input{width:100%;background:#3d1a1a;border:1.5px solid #5a2020;border-radius:10px;padding:11px 14px;color:#e9edef;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s}
.field input:focus{border-color:#e53935}
.field input::placeholder{color:#4a5568}
.auth-error{color:#ff6b6b;font-size:12.5px;margin-bottom:12px;padding:8px 12px;background:rgba(255,107,107,.1);border-radius:8px}
.btn-primary{width:100%;padding:12px;background:#e53935;border:none;border-radius:10px;color:white;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .2s}
.btn-primary:hover{background:#c62828}
.btn-primary:disabled{opacity:.45;cursor:not-allowed}
.demo-hint{margin-top:18px;font-size:12px;color:#4a5568;text-align:center;padding:10px;border:1px dashed #3d1a1a;border-radius:8px}

/* APP */
.chat-app{display:flex;flex:1;min-height:0}

/* SIDEBAR */
.sidebar{width:360px;min-width:360px;background:#1a0a0a;border-right:1px solid #2a1010;display:flex;flex-direction:column;height:100%}
.sidebar-header{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#231212;flex-shrink:0}
.user-info{flex:1;min-width:0}
.user-name{display:block;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user-status{font-size:11px;color:#e53935}
.icon-btn{background:none;border:none;color:#8696a0;cursor:pointer;padding:7px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.icon-btn:hover{background:#3d1a1a;color:#e9edef}

/* AVATAR */
.av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;color:white;flex-shrink:0;position:relative;overflow:hidden;background:#3d1a1a}
.av.sm{width:38px;height:38px;font-size:15px}
.av-img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.group-av{background:#3d1a1a}
.dot{position:absolute;bottom:2px;right:2px;width:10px;height:10px;border-radius:50%;background:#8696a0;border:2px solid #1a0a0a}
.dot.online{background:#e53935}
.clickable{cursor:pointer;transition:opacity .15s}
.clickable:hover{opacity:.85}

/* CHAT LIST */
.chat-list{flex:1;overflow-y:auto}
.chat-list::-webkit-scrollbar{width:3px}
.chat-list::-webkit-scrollbar-thumb{background:#3d1a1a;border-radius:3px}
.no-chats{padding:50px 20px;text-align:center;color:#8696a0;font-size:13px;line-height:2.2;display:flex;flex-direction:column;align-items:center;gap:4px}
.no-chats strong{color:#e9edef}
.chat-item{display:flex;align-items:center;gap:12px;padding:11px 14px;cursor:pointer;transition:background .1s;border-bottom:1px solid #2d1010}
.chat-item:hover{background:#280d0d}
.chat-item.active{background:#3d1a1a}
.chat-info{flex:1;min-width:0}
.chat-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px}
.chat-name{font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.chat-time{font-size:11px;color:#8696a0;flex-shrink:0}
.chat-sub{font-size:11.5px;color:#8696a0;margin-bottom:1px}
.chat-preview{font-size:13px;color:#8696a0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{background:#e53935;color:white;font-size:11px;font-weight:700;border-radius:50px;min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;padding:0 5px;flex-shrink:0}

/* CHAT WINDOW */
.chat-window{flex:1;display:flex;flex-direction:column;height:100%;min-width:0}
.no-chat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#130808;gap:14px;color:#8696a0;text-align:center}
.no-chat h2{font-size:22px;font-weight:500;color:#e9edef}
.no-chat p{font-size:14px;line-height:1.9}
.no-chat strong{color:#e9edef}
.chat-header{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#231212;border-bottom:1px solid #2a1010;flex-shrink:0}
.header-info{flex:1}
.header-name{display:block;font-size:15px;font-weight:600}
.header-sub{font-size:12px;color:#8696a0;display:block}

/* Messages — solid dark background, NO pattern */
.messages-area{flex:1;overflow-y:auto;background:#130808}
.messages-area::-webkit-scrollbar{width:4px}
.messages-area::-webkit-scrollbar-thumb{background:#3d1a1a;border-radius:4px}
.messages-inner{padding:14px;display:flex;flex-direction:column;gap:2px;min-height:100%}
.empty-chat{flex:1;display:flex;align-items:center;justify-content:center;padding:40px}
.empty-chat span{background:rgba(255,255,255,.04);color:#8696a0;font-size:13px;padding:10px 18px;border-radius:20px}
.date-divider{text-align:center;margin:10px 0}
.date-divider span{background:#280d0d;color:#8696a0;font-size:12px;padding:4px 12px;border-radius:8px}
.msg-row{display:flex;align-items:flex-end;gap:6px;margin-bottom:2px}
.msg-row.own{justify-content:flex-end}
.msg-row.other{justify-content:flex-start}
.msg-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:white;flex-shrink:0;overflow:hidden;background:#3d1a1a}
.bubble{max-width:65%;padding:7px 12px;border-radius:8px;word-break:break-word}
.own .bubble{background:#7b1c1c;border-radius:8px 8px 2px 8px}
.other .bubble{background:#231212;border-radius:8px 8px 8px 2px}
.sender-name{display:block;font-size:12px;font-weight:600;margin-bottom:2px}
.msg-text{font-size:14px;color:#e9edef;line-height:1.5;display:block}
.msg-meta{display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:2px}
.msg-time{font-size:11px;color:#8696a0}
.tick{display:flex;align-items:center}
.input-area{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#231212;flex-shrink:0;position:relative}
.emoji-btn{color:#8696a0}
.emoji-picker{position:absolute;bottom:68px;left:14px;background:#331515;border:1px solid #3d1a1a;border-radius:14px;padding:12px;display:flex;flex-wrap:wrap;gap:6px;width:260px;box-shadow:0 8px 30px rgba(0,0,0,.4);z-index:100}
.emoji-picker span{cursor:pointer;font-size:22px;padding:3px;border-radius:6px;transition:transform .1s}
.emoji-picker span:hover{transform:scale(1.3)}
.msg-input{flex:1;background:#3d1a1a;border:none;border-radius:10px;padding:11px 16px;color:#e9edef;font-size:14.5px;font-family:inherit;outline:none}
.msg-input::placeholder{color:#8696a0}
.send-btn{width:44px;height:44px;border-radius:50%;background:#e53935;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.send-btn:hover{background:#c62828;transform:scale(1.05)}
.send-btn:disabled{background:#3d1a1a;cursor:not-allowed;transform:none}
.mobile-back{display:none}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
.modal{background:#2a1010;border:1px solid #3d1a1a;border-radius:18px;width:100%;max-width:440px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.6);max-height:90vh;display:flex;flex-direction:column}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.modal-header h3{font-size:18px;font-weight:600}
.modal-tabs{display:flex;background:#3d1a1a;border-radius:10px;padding:4px;margin-bottom:16px}
.modal-search{display:flex;align-items:center;gap:8px;background:#3d1a1a;border-radius:10px;padding:9px 14px;margin-bottom:10px;color:#8696a0;flex-shrink:0}
.modal-search input{background:none;border:none;outline:none;color:#e9edef;font-size:14px;font-family:inherit;flex:1}
.modal-search input::placeholder{color:#8696a0}
.modal-user-list{flex:1;overflow-y:auto;min-height:80px;max-height:260px}
.modal-user-list::-webkit-scrollbar{width:3px}
.modal-user-list::-webkit-scrollbar-thumb{background:#3d1a1a;border-radius:3px}
.search-hint{text-align:center;color:#4a5568;font-size:13px;padding:20px 16px}
.search-empty{text-align:center;color:#8696a0;font-size:13px;padding:20px 16px}
.modal-user-item{display:flex;align-items:center;gap:12px;padding:10px 6px;cursor:pointer;border-radius:10px;transition:background .1s}
.modal-user-item:hover{background:#3d1a1a}
.modal-user-item.selected{background:rgba(229,57,53,.07)}
.modal-user-info{flex:1}
.modal-user-name{display:block;font-size:14px;font-weight:500}
.modal-user-id{display:block;font-size:11px;color:#8696a0;font-family:monospace}
.checkbox{width:22px;height:22px;border-radius:50%;border:2px solid #5a2020;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.checkbox.checked{background:#e53935;border-color:#e53935}
.selected-members{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.member-chip{display:flex;align-items:center;gap:6px;background:rgba(229,57,53,.1);border:1px solid rgba(229,57,53,.25);color:#e9edef;border-radius:20px;padding:4px 10px 4px 5px;font-size:13px}
.chip-av{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:white;flex-shrink:0;overflow:hidden;background:#3d1a1a}
.member-chip button{background:none;border:none;color:#8696a0;cursor:pointer;padding:0;display:flex;align-items:center}
.member-chip button:hover{color:#e9edef}
.role-tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:10px;margin-top:2px}
.role-tag.you{background:rgba(229,57,53,.15);color:#e53935}
.role-tag.admin{background:rgba(134,150,160,.15);color:#8696a0}

/* PROFILE MODAL */
.profile-av-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:20px}
.profile-av{width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:600;color:white;overflow:hidden;background:#3d1a1a;border:3px solid #3d1a1a}
.change-av-btn{display:flex;align-items:center;gap:6px;background:#e53935;border:none;border-radius:20px;color:white;padding:7px 16px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;transition:background .2s}
.change-av-btn:hover{background:#c62828}
.remove-av-btn{background:none;border:none;color:#8696a0;font-size:12px;cursor:pointer;font-family:inherit;text-decoration:underline}
.remove-av-btn:hover{color:#ff6b6b}
.profile-msg{font-size:12.5px;margin-bottom:10px;padding:8px 12px;border-radius:8px}
.profile-msg.ok{color:#e53935;background:rgba(229,57,53,.1)}
.profile-msg.err{color:#ff6b6b;background:rgba(255,107,107,.1)}

@media(max-width:768px){
  .sidebar{position:fixed;top:72px;left:0;width:100%;min-width:unset;z-index:50;transform:translateX(-100%);transition:transform .3s ease}
  .sidebar.sidebar-open{transform:translateX(0)}
  .chat-window{width:100%}
  .mobile-back{display:flex}
}
</style>