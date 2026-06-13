export default defineEventHandler(async (event) => {
  const { id, leave } = await readBody(event)
  if (id) {
    if (leave) removeSession(id)
    else heartbeat(id)
  }
  return { count: getOnlineCount() }
})
