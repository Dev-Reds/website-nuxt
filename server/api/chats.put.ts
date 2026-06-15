export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  db.setChats(body)
  return { ok: true }
})
