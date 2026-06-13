export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  if (id) heartbeat(id)
  return { count: getOnlineCount() }
})
