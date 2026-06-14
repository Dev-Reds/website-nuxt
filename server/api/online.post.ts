export default defineEventHandler(async (event) => {
  const { id, leave, userId, userLeave } = await readBody(event)
  if (id) {
    if (leave) await removeSession(id)
    else await heartbeat(id)
  }
  if (userId) {
    if (userLeave) await removeUserSession(userId)
    else await userHeartbeat(userId)
  }
  return { count: await getOnlineCount() }
})