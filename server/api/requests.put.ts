export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  db.setFriendRequests(body)
  return { ok: true }
})
