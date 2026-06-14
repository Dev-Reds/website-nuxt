export default defineEventHandler(async (event) => {
  const { id, leave, userId, userLeave } = await readBody(event)
  if (id) {
    if (leave) removeSession(id)
    else heartbeat(id)
  }
  if (userId) {
    if (userLeave) removeUserSession(userId)
    else userHeartbeat(userId)
  }
  return { count: getOnlineCount() }
})
