export default defineEventHandler(async (event) => {
  const { id, leave, userId, userLeave } = await readBody(event)
  if (id) {
    if (leave) removeSession(id)
    else heartbeat(id)
  }
  if (userId) {
    if (userLeave) await removeUserSession(userId)
    else await userHeartbeat(userId)
  }
  return { count: getOnlineCount() }
})
